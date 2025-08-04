import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMealPlanSchema, insertPdfFileSchema } from "@shared/schema";
import { generateMealPlan } from "./services/openai";
import { generateMealPlanPDF } from "./services/pdf";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Meal plan routes
  app.get("/api/meal-plans/:uid", async (req, res) => {
    try {
      // Get user first
      const user = await storage.getUserByUid(req.params.uid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const mealPlans = await storage.getMealPlansByUserId(user.id);
      res.json(mealPlans);
    } catch (error) {
      res.status(500).json({ message: "Failed to get meal plans", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/meal-plans/generate", async (req, res) => {
    try {
      const { fitness_goal, cuisine, diet_type, user_id } = req.body;

      // Get user data for personalization
      const user = await storage.getUser(user_id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate meal plan using OpenAI
      const mealPlanData = await generateMealPlan({
        fitness_goal,
        cuisine,
        diet_type,
        medical_conditions: user.medical_conditions || [],
        food_exclusions: user.food_exclusions || [],
        age: user.age,
        gender: user.gender,
        weight_kg: user.weight_kg,
        height_cm: user.height_cm,
      });

      // Save meal plan to storage
      const mealPlan = await storage.createMealPlan({
        user_id,
        fitness_goal,
        cuisine,
        diet_type,
        plan_data: mealPlanData,
        is_active: true,
      });

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

      // Generate PDF
      const pdfUrl = await generateMealPlanPDF(mealPlan.plan_data);

      // Store PDF record with 48-hour expiration
      const expiresAt = new Date();
      expiresAt.setTime(expiresAt.getTime() + (48 * 60 * 60 * 1000)); // 48 hours

      const pdfFile = await storage.createPdfFile({
        meal_plan_id: mealPlan.id,
        file_url: pdfUrl,
        expires_at: expiresAt,
      });

      res.json({ url: pdfFile.file_url, expires_at: pdfFile.expires_at });
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ 
        message: "Failed to generate PDF", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
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
