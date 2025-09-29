import type { Express } from "express";
import { createServer, type Server } from "http";
import * as path from "path";
import * as fs from "fs";
import { storage } from "./storage";
import { insertUserSchema, insertMealPlanSchema, insertPdfFileSchema, WeeklyMealPlan, adjustServingSizeSchema, swapIngredientSchema, customizeRecipeSchema } from "@shared/schema";
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

  // Recipe adjustment endpoints
  app.patch("/api/meal-plans/:id/adjust-serving", async (req, res) => {
    try {
      const { day, meal_index, serving_multiplier } = adjustServingSizeSchema.parse(req.body);
      const mealPlanId = req.params.id;

      const mealPlan = await storage.getMealPlan(mealPlanId);
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }

      const planData = mealPlan.plan_data as WeeklyMealPlan;
      const dayPlan = planData.days.find(d => d.day === day);
      if (!dayPlan || !dayPlan.meals[meal_index]) {
        return res.status(404).json({ message: "Meal not found" });
      }

      const meal = dayPlan.meals[meal_index];
      
      // Store original calories if not already stored
      if (!meal.original_calories) {
        meal.original_calories = meal.calories;
      }

      // Update serving size and recalculate nutrition
      meal.serving_size = serving_multiplier;
      const baseCalories = meal.original_calories || meal.calories;
      meal.calories = Math.round(baseCalories * serving_multiplier);
      
      if (meal.protein_g) meal.protein_g = Math.round(meal.protein_g * serving_multiplier);
      if (meal.carbs_g) meal.carbs_g = Math.round(meal.carbs_g * serving_multiplier);
      if (meal.fat_g) meal.fat_g = Math.round(meal.fat_g * serving_multiplier);
      if (meal.fiber_g) meal.fiber_g = Math.round(meal.fiber_g * serving_multiplier);

      // Update the meal plan in storage
      await storage.updateMealPlan(mealPlanId, { plan_data: planData });

      res.json({ message: "Serving size adjusted successfully", meal });
    } catch (error) {
      console.error("Error adjusting serving size:", error);
      res.status(500).json({ 
        message: "Failed to adjust serving size", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.patch("/api/meal-plans/:id/swap-ingredient", async (req, res) => {
    try {
      const { day, meal_index, original_ingredient, replacement_ingredient, reason } = swapIngredientSchema.parse(req.body);
      const mealPlanId = req.params.id;

      const mealPlan = await storage.getMealPlan(mealPlanId);
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }

      const planData = mealPlan.plan_data as WeeklyMealPlan;
      const dayPlan = planData.days.find(d => d.day === day);
      if (!dayPlan || !dayPlan.meals[meal_index]) {
        return res.status(404).json({ message: "Meal not found" });
      }

      const meal = dayPlan.meals[meal_index];

      // Find and replace the ingredient
      const ingredientIndex = meal.ingredients.findIndex(ing => 
        ing.toLowerCase().includes(original_ingredient.toLowerCase())
      );

      if (ingredientIndex === -1) {
        return res.status(404).json({ message: "Original ingredient not found in recipe" });
      }

      meal.ingredients[ingredientIndex] = replacement_ingredient;

      // Track the modification
      if (!meal.modifications) {
        meal.modifications = {};
      }
      if (!meal.modifications.ingredient_swaps) {
        meal.modifications.ingredient_swaps = [];
      }

      meal.modifications.ingredient_swaps.push({
        original: original_ingredient,
        replacement: replacement_ingredient,
        reason: reason || "User preference"
      });

      // Update the meal plan in storage
      await storage.updateMealPlan(mealPlanId, { plan_data: planData });

      res.json({ message: "Ingredient swapped successfully", meal });
    } catch (error) {
      console.error("Error swapping ingredient:", error);
      res.status(500).json({ 
        message: "Failed to swap ingredient", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.patch("/api/meal-plans/:id/customize-recipe", async (req, res) => {
    try {
      const { day, meal_index, custom_instructions, notes } = customizeRecipeSchema.parse(req.body);
      const mealPlanId = req.params.id;

      const mealPlan = await storage.getMealPlan(mealPlanId);
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }

      const planData = mealPlan.plan_data as WeeklyMealPlan;
      const dayPlan = planData.days.find(d => d.day === day);
      if (!dayPlan || !dayPlan.meals[meal_index]) {
        return res.status(404).json({ message: "Meal not found" });
      }

      const meal = dayPlan.meals[meal_index];

      // Initialize modifications if not exists
      if (!meal.modifications) {
        meal.modifications = {};
      }

      // Update custom instructions and notes
      if (custom_instructions) {
        meal.modifications.custom_instructions = custom_instructions;
      }
      if (notes) {
        meal.modifications.notes = notes;
      }

      // Update the meal plan in storage
      await storage.updateMealPlan(mealPlanId, { plan_data: planData });

      res.json({ message: "Recipe customized successfully", meal });
    } catch (error) {
      console.error("Error customizing recipe:", error);
      res.status(500).json({ 
        message: "Failed to customize recipe", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get ingredient suggestions for swapping
  app.get("/api/ingredient-suggestions/:ingredient", async (req, res) => {
    try {
      const ingredient = req.params.ingredient.toLowerCase();
      
      // Common ingredient substitutions map
      const substitutions: Record<string, string[]> = {
        // Proteins
        "chicken": ["turkey", "tofu", "tempeh", "chickpeas", "lentils"],
        "beef": ["lean turkey", "portobello mushrooms", "beyond meat", "black beans"],
        "fish": ["tofu", "tempeh", "chickpeas", "nuts"],
        "eggs": ["flax eggs", "chia eggs", "aquafaba", "silken tofu"],
        
        // Dairy
        "milk": ["almond milk", "oat milk", "soy milk", "coconut milk"],
        "cheese": ["nutritional yeast", "cashew cheese", "vegan cheese"],
        "yogurt": ["coconut yogurt", "almond yogurt", "soy yogurt"],
        "butter": ["olive oil", "coconut oil", "avocado", "nut butter"],
        
        // Grains
        "rice": ["quinoa", "cauliflower rice", "bulgur", "barley"],
        "pasta": ["zucchini noodles", "shirataki noodles", "lentil pasta", "quinoa pasta"],
        "bread": ["lettuce wraps", "portobello caps", "sweet potato slices"],
        
        // Vegetables
        "potato": ["sweet potato", "cauliflower", "turnips", "rutabaga"],
        "onion": ["shallots", "leeks", "garlic", "green onions"],
        "tomato": ["red bell pepper", "sun-dried tomatoes", "roasted red pepper"],
        
        // Common allergens
        "nuts": ["seeds", "roasted chickpeas", "coconut flakes"],
        "gluten": ["gluten-free alternatives", "rice-based products"],
        "soy": ["coconut products", "nut-based alternatives"]
      };

      // Find suggestions based on ingredient matching
      let suggestions: string[] = [];
      for (const [key, subs] of Object.entries(substitutions)) {
        if (ingredient.includes(key) || key.includes(ingredient)) {
          suggestions = [...suggestions, ...subs];
        }
      }

      // Remove duplicates and limit to 6 suggestions
      suggestions = Array.from(new Set(suggestions)).slice(0, 6);

      // If no specific suggestions found, provide general healthy alternatives
      if (suggestions.length === 0) {
        suggestions = [
          "Similar protein source",
          "Vegetarian alternative", 
          "Lower calorie option",
          "Higher fiber substitute",
          "Gluten-free version",
          "Dairy-free alternative"
        ];
      }

      res.json({ suggestions });
    } catch (error) {
      console.error("Error getting ingredient suggestions:", error);
      res.status(500).json({ 
        message: "Failed to get suggestions", 
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
