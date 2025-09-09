-- FitBite Database Initialization
-- This script sets up the database schema for FitBite

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    uid TEXT NOT NULL UNIQUE, -- Firebase UID
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT, -- male, female, other
    height_cm INTEGER,
    weight_kg INTEGER,
    activity_level TEXT, -- sedentary, lightly_active, moderately_active, very_active, extremely_active
    country_region TEXT,
    health_conditions TEXT[], -- diabetes, high_blood_pressure, thyroid, pcos, none, other
    foods_to_include TEXT[], -- tea, coffee, dark_chocolate, one_cookie_a_day, other
    created_at TIMESTAMP DEFAULT NOW()
);

-- Meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL REFERENCES users(id),
    fitness_goal TEXT NOT NULL, -- weight_loss, weight_gain, maintain
    cuisine TEXT NOT NULL, -- indian, american, mediterranean, etc.
    diet_type TEXT NOT NULL, -- vegetarian, non_vegetarian, vegan, keto, diabetic_friendly
    plan_data JSONB NOT NULL, -- 7-day meal plan JSON
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- PDF files table
CREATE TABLE IF NOT EXISTS pdf_files (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_plan_id VARCHAR NOT NULL REFERENCES meal_plans(id),
    file_url TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_active ON meal_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_pdf_files_meal_plan_id ON pdf_files(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_pdf_files_expires_at ON pdf_files(expires_at);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fitbite_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fitbite_user;