import { type User, type InsertUser, type MealPlan, type InsertMealPlan, type PdfFile, type InsertPdfFile, users, meal_plans, pdf_files } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, lt } from "drizzle-orm";
import { Pool } from "pg";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Meal plan operations
  getMealPlan(id: string): Promise<MealPlan | undefined>;
  getMealPlansByUserId(userId: string): Promise<MealPlan[]>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan>;

  // PDF operations
  getPdfFile(id: string): Promise<PdfFile | undefined>;
  createPdfFile(pdfFile: InsertPdfFile): Promise<PdfFile>;
  deletePdfFile(id: string): Promise<void>;
  getExpiredPdfFiles(): Promise<PdfFile[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private mealPlans: Map<string, MealPlan> = new Map();
  private pdfFiles: Map<string, PdfFile> = new Map();

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.uid === uid);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      created_at: new Date(),
      age: insertUser.age ?? null,
      gender: insertUser.gender ?? null,
      height_cm: insertUser.height_cm ?? null,
      weight_kg: insertUser.weight_kg ?? null,
      activity_level: insertUser.activity_level ?? null,
      country_region: insertUser.country_region ?? null,
      health_conditions: insertUser.health_conditions ?? null,
      foods_to_include: insertUser.foods_to_include ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Meal plan operations
  async getMealPlan(id: string): Promise<MealPlan | undefined> {
    return this.mealPlans.get(id);
  }

  async getMealPlansByUserId(userId: string): Promise<MealPlan[]> {
    return Array.from(this.mealPlans.values()).filter(plan => plan.user_id === userId);
  }

  async createMealPlan(insertMealPlan: InsertMealPlan): Promise<MealPlan> {
    const id = randomUUID();
    
    // Deactivate other plans for this user
    const userPlans = await this.getMealPlansByUserId(insertMealPlan.user_id);
    userPlans.forEach(plan => {
      if (plan.is_active) {
        this.mealPlans.set(plan.id, { ...plan, is_active: false });
      }
    });

    const mealPlan: MealPlan = {
      ...insertMealPlan,
      id,
      created_at: new Date(),
      is_active: insertMealPlan.is_active ?? true,
    };
    this.mealPlans.set(id, mealPlan);
    return mealPlan;
  }

  async updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan> {
    const mealPlan = this.mealPlans.get(id);
    if (!mealPlan) {
      throw new Error("Meal plan not found");
    }
    const updatedPlan = { ...mealPlan, ...updates };
    this.mealPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  // PDF operations
  async getPdfFile(id: string): Promise<PdfFile | undefined> {
    return this.pdfFiles.get(id);
  }

  async createPdfFile(insertPdfFile: InsertPdfFile): Promise<PdfFile> {
    const id = randomUUID();
    const pdfFile: PdfFile = {
      ...insertPdfFile,
      id,
      created_at: new Date(),
    };
    this.pdfFiles.set(id, pdfFile);
    return pdfFile;
  }

  async deletePdfFile(id: string): Promise<void> {
    this.pdfFiles.delete(id);
  }

  async getExpiredPdfFiles(): Promise<PdfFile[]> {
    const now = new Date();
    return Array.from(this.pdfFiles.values()).filter(pdf => pdf.expires_at < now);
  }
}

// PostgreSQL Storage Implementation
export class PostgresStorage implements IStorage {
  private db: any;
  private pool: Pool;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    this.db = drizzle(this.pool);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const result = await this.db.update(users).set(updates).where(eq(users.id, id)).returning();
    if (!result[0]) {
      throw new Error("User not found");
    }
    return result[0];
  }

  // Meal plan operations
  async getMealPlan(id: string): Promise<MealPlan | undefined> {
    const result = await this.db.select().from(meal_plans).where(eq(meal_plans.id, id)).limit(1);
    return result[0];
  }

  async getMealPlansByUserId(userId: string): Promise<MealPlan[]> {
    const result = await this.db.select().from(meal_plans).where(eq(meal_plans.user_id, userId));
    return result;
  }

  async createMealPlan(insertMealPlan: InsertMealPlan): Promise<MealPlan> {
    const result = await this.db.insert(meal_plans).values(insertMealPlan).returning();
    return result[0];
  }

  async updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan> {
    const result = await this.db.update(meal_plans).set(updates).where(eq(meal_plans.id, id)).returning();
    if (!result[0]) {
      throw new Error("Meal plan not found");
    }
    return result[0];
  }

  // PDF operations
  async getPdfFile(id: string): Promise<PdfFile | undefined> {
    const result = await this.db.select().from(pdf_files).where(eq(pdf_files.id, id)).limit(1);
    return result[0];
  }

  async createPdfFile(insertPdfFile: InsertPdfFile): Promise<PdfFile> {
    const result = await this.db.insert(pdf_files).values(insertPdfFile).returning();
    return result[0];
  }

  async deletePdfFile(id: string): Promise<void> {
    await this.db.delete(pdf_files).where(eq(pdf_files.id, id));
  }

  async getExpiredPdfFiles(): Promise<PdfFile[]> {
    const now = new Date();
    const result = await this.db.select().from(pdf_files).where(lt(pdf_files.expires_at, now));
    return result;
  }

  // Cleanup method for graceful shutdown
  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Use PostgreSQL storage in production, Memory storage for development
export const storage = process.env.NODE_ENV === 'production' 
  ? new PostgresStorage() 
  : new MemStorage();
