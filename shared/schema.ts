import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  uid: text("uid").notNull().unique(), // Firebase UID
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  age: integer("age"),
  gender: text("gender"), // male, female, other
  height_cm: integer("height_cm"),
  weight_kg: integer("weight_kg"),
  activity_level: text("activity_level"), // sedentary, lightly_active, moderately_active, very_active, extremely_active
  country_region: text("country_region"),
  health_conditions: text("health_conditions").array(), // diabetes, high_blood_pressure, thyroid, pcos, none, other
  foods_to_include: text("foods_to_include").array(), // tea, coffee, dark_chocolate, one_cookie_a_day, other
  created_at: timestamp("created_at").defaultNow(),
});

export const meal_plans = pgTable("meal_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: varchar("user_id").notNull().references(() => users.id),
  fitness_goal: text("fitness_goal").notNull(), // weight_loss, weight_gain, maintain
  cuisine: text("cuisine").notNull(), // indian, american, mediterranean, etc.
  diet_type: text("diet_type").notNull(), // vegetarian, non_vegetarian, vegan, keto, diabetic_friendly
  plan_data: jsonb("plan_data").notNull(), // 7-day meal plan JSON
  created_at: timestamp("created_at").defaultNow(),
  is_active: boolean("is_active").default(true),
});

export const pdf_files = pgTable("pdf_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  meal_plan_id: varchar("meal_plan_id").notNull().references(() => meal_plans.id),
  file_url: text("file_url").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
});

export const insertMealPlanSchema = createInsertSchema(meal_plans).omit({
  id: true,
  created_at: true,
});

export const insertPdfFileSchema = createInsertSchema(pdf_files).omit({
  id: true,
  created_at: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type MealPlan = typeof meal_plans.$inferSelect;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type PdfFile = typeof pdf_files.$inferSelect;
export type InsertPdfFile = z.infer<typeof insertPdfFileSchema>;

// Meal plan data structure
export const mealSchema = z.object({
  type: z.string(), // breakfast, lunch, dinner, snack
  time: z.string(),
  name: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  calories: z.number(),
});

export const dayMealPlanSchema = z.object({
  day: z.string(),
  meals: z.array(mealSchema),
});

export const weeklyMealPlanSchema = z.object({
  week_start: z.string(),
  days: z.array(dayMealPlanSchema),
  total_daily_calories: z.number(),
  goals: z.object({
    fitness_goal: z.string(),
    cuisine: z.string(),
    diet_type: z.string(),
  }),
});

export type Meal = z.infer<typeof mealSchema>;
export type DayMealPlan = z.infer<typeof dayMealPlanSchema>;
export type WeeklyMealPlan = z.infer<typeof weeklyMealPlanSchema>;
