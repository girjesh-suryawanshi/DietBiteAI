import type { Express } from "express";
import { createServer, type Server } from "http";
import * as path from "path";
import * as fs from "fs";
import { storage } from "./storage";
import { insertUserSchema, insertMealPlanSchema, insertPdfFileSchema, WeeklyMealPlan } from "@shared/schema";
import { generateMealPlan } from "./services/gemini";
import { generateMealPlanPDF } from "./services/pdf";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Docker
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Serve SEO files directly
  app.get("/sitemap.xml", (req, res) => {
    const sitemapPath = process.env.NODE_ENV === "production" 
      ? path.resolve(import.meta.dirname, "public", "sitemap.xml")
      : path.resolve(process.cwd(), "public", "sitemap.xml");
    
    if (fs.existsSync(sitemapPath)) {
      res.setHeader('Content-Type', 'application/xml');
      res.sendFile(sitemapPath);
    } else {
      res.status(404).send('Sitemap not found');
    }
  });

  app.get("/robots.txt", (req, res) => {
    const robotsPath = process.env.NODE_ENV === "production"
      ? path.resolve(import.meta.dirname, "public", "robots.txt")
      : path.resolve(process.cwd(), "public", "robots.txt");
    
    if (fs.existsSync(robotsPath)) {
      res.setHeader('Content-Type', 'text/plain');
      res.sendFile(robotsPath);
    } else {
      res.status(404).send('Robots.txt not found');
    }
  });

  // User routes
  app.get("/api/users/:uid", async (req, res) => {
    try {
      const user = await storage.getUserByUid(req.params.uid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Auto-create user endpoint for when Firebase user exists but not in our DB
  app.post("/api/users/auto-create", async (req, res) => {
    try {
      const { uid, email, name } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUid(uid);
      if (existingUser) {
        return res.json(existingUser);
      }

      // Create new user
      const user = await storage.createUser({
        uid,
        email: email || "",
        name: name || "User",
      });
      
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to auto-create user", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUid(userData.uid);
      if (existingUser) {
        return res.json(existingUser);
      }

      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to create user", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.put("/api/users/profile", async (req, res) => {
    try {
      const { uid, ...profileData } = req.body;
      
      // Find user by Firebase UID
      let user = await storage.getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user profile
      const updatedUser = await storage.updateUser(user.id, profileData);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: "Failed to update profile", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Meal plan routes
  app.get("/api/meal-plans/:uid", async (req, res) => {
    try {
      // Get user first, create if doesn't exist
      let user = await storage.getUserByUid(req.params.uid);
      if (!user) {
        // Auto-create user if they have a valid Firebase UID but don't exist in our DB
        user = await storage.createUser({
          uid: req.params.uid,
          email: "",
          name: "User",
        });
      }

      const mealPlans = await storage.getMealPlansByUserId(user.id);
      res.json(mealPlans);
    } catch (error) {
      res.status(500).json({ message: "Failed to get meal plans", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/meal-plans/generate", async (req, res) => {
    try {
      const { fitness_goal, cuisine, diet_type, user_id, foods_to_include, health_conditions } = req.body;

      // Get user data for personalization, create if doesn't exist
      let user = await storage.getUser(user_id);
      if (!user) {
        // If user_id is actually a Firebase UID, try to find by UID
        user = await storage.getUserByUid(user_id);
        if (!user) {
          // Create user if doesn't exist
          user = await storage.createUser({
            uid: user_id,
            email: "",
            name: "User",
          });
        }
      }

      // Deactivate any existing active meal plans for this user
      const existingPlans = await storage.getMealPlansByUserId(user.id);
      for (const plan of existingPlans) {
        if (plan.is_active) {
          await storage.updateMealPlan(plan.id, { is_active: false });
        }
      }

      // Generate meal plan using Gemini
      const mealPlanData = await generateMealPlan({
        fitness_goal,
        cuisine,
        diet_type,
        medical_conditions: health_conditions || user.health_conditions || [],
        food_exclusions: foods_to_include || user.foods_to_include || [],
        age: user.age || undefined,
        gender: user.gender || undefined,
        weight_kg: user.weight_kg || undefined,
        height_cm: user.height_cm || undefined,
      });

      // Save meal plan to storage using the database user ID
      const mealPlan = await storage.createMealPlan({
        user_id: user.id, // Use database user ID, not Firebase UID
        fitness_goal,
        cuisine,
        diet_type,
        plan_data: mealPlanData,
        is_active: true,
      });

      console.log(`Created meal plan for user ${user.id} (Firebase UID: ${user.uid})`);

      res.status(201).json(mealPlan);
    } catch (error) {
      console.error("Error generating meal plan:", error);
      res.status(500).json({ 
        message: "Failed to generate meal plan", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/meal-plans/plan/:id", async (req, res) => {
    try {
      const mealPlan = await storage.getMealPlan(req.params.id);
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      res.json(mealPlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to get meal plan", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // PDF generation routes
  app.post("/api/meal-plans/:id/pdf", async (req, res) => {
    try {
      const mealPlan = await storage.getMealPlan(req.params.id);
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }

      // Get user profile for enhanced PDF
      const userProfile = await storage.getUser(mealPlan.user_id);

      // Generate PDF with user profile
      const pdfUrl = await generateMealPlanPDF(mealPlan.plan_data as WeeklyMealPlan, userProfile);

      // Store PDF record with 48-hour expiration
      const expiresAt = new Date();
      expiresAt.setTime(expiresAt.getTime() + (48 * 60 * 60 * 1000)); // 48 hours

      const pdfFile = await storage.createPdfFile({
        meal_plan_id: mealPlan.id,
        file_url: pdfUrl,
        expires_at: expiresAt,
      });

      // Extract filename from URL for better user experience
      const filename = pdfUrl.split('/').pop() || 'meal-plan.pdf';
      
      res.json({ 
        url: pdfFile.file_url, 
        expires_at: pdfFile.expires_at,
        filename: filename
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ 
        message: "Failed to generate PDF", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Serve PDF and HTML files
  app.get("/temp/:filename", (req, res) => {
    const filename = req.params.filename;
    const tempDir = path.join(process.cwd(), "server", "temp");
    const filePath = path.join(tempDir, filename);
    
    if (fs.existsSync(filePath)) {
      if (filename.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      }
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  // Cleanup expired PDFs (could be triggered by a cron job)
  app.post("/api/cleanup-pdfs", async (req, res) => {
    try {
      const expiredPdfs = await storage.getExpiredPdfFiles();
      
      for (const pdf of expiredPdfs) {
        // In production, you would also delete the actual file from storage
        await storage.deletePdfFile(pdf.id);
      }

      res.json({ message: `Cleaned up ${expiredPdfs.length} expired PDFs` });
    } catch (error) {
      res.status(500).json({ message: "Failed to cleanup PDFs", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
