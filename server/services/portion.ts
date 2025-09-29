// Portion Calculation Engine
// Calculates appropriate portion sizes based on user stats, TDEE, and fitness goals

export interface UserStats {
  age?: number;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
  fitness_goal?: string;
}

export interface MacroTargets {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
}

export interface MealDistribution {
  breakfast: number; // percentage of daily calories
  mid_morning_snack: number;
  lunch: number;
  evening_snack: number;
  dinner: number;
}

// Activity level multipliers for TDEE calculation
const ACTIVITY_MULTIPLIERS: { [key: string]: number } = {
  'sedentary': 1.2,
  'lightly_active': 1.375,
  'moderately_active': 1.55,
  'very_active': 1.725,
  'extremely_active': 1.9
};

// Cultural meal distribution patterns
const CULTURAL_MEAL_DISTRIBUTIONS: { [key: string]: MealDistribution } = {
  'India': {
    breakfast: 25,
    mid_morning_snack: 10,
    lunch: 35,
    evening_snack: 10,
    dinner: 20
  },
  'USA': {
    breakfast: 20,
    mid_morning_snack: 10,
    lunch: 30,
    evening_snack: 10,
    dinner: 30
  },
  'default': {
    breakfast: 25,
    mid_morning_snack: 10,
    lunch: 30,
    evening_snack: 10,
    dinner: 25
  }
};

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 */
export function calculateBMR(userStats: UserStats): number {
  const { age = 25, gender = 'male', weight_kg = 70, height_cm = 170 } = userStats;
  
  if (gender.toLowerCase() === 'female') {
    return (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161;
  } else {
    return (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5;
  }
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
export function calculateTDEE(userStats: UserStats): number {
  const bmr = calculateBMR(userStats);
  const activityMultiplier = ACTIVITY_MULTIPLIERS[userStats.activity_level || 'moderately_active'] || 1.55;
  return Math.round(bmr * activityMultiplier);
}

/**
 * Calculate target calories based on fitness goal
 */
export function calculateTargetCalories(userStats: UserStats): number {
  const tdee = calculateTDEE(userStats);
  const { fitness_goal = 'maintain', gender = 'male' } = userStats;
  
  let targetCalories = tdee;
  
  switch (fitness_goal.toLowerCase()) {
    case 'weight_loss':
      targetCalories = tdee - 500; // 500 calorie deficit for ~1lb/week loss
      break;
    case 'weight_gain':
      targetCalories = tdee + 300; // 300 calorie surplus for healthy weight gain
      break;
    case 'maintain':
    default:
      targetCalories = tdee;
      break;
  }
  
  // Apply safety bounds
  const minCalories = gender.toLowerCase() === 'female' ? 1200 : 1500;
  const maxCalories = gender.toLowerCase() === 'female' ? 2000 : 2500;
  
  return Math.max(minCalories, Math.min(maxCalories, targetCalories));
}

/**
 * Calculate macro targets based on calories and diet type
 */
export function calculateMacroTargets(targetCalories: number, dietType: string = 'balanced'): MacroTargets {
  let proteinPercent = 0.25; // 25% default
  let carbPercent = 0.45;    // 45% default  
  let fatPercent = 0.30;     // 30% default
  
  // Adjust based on diet type
  switch (dietType.toLowerCase()) {
    case 'keto':
      proteinPercent = 0.25;
      carbPercent = 0.05;
      fatPercent = 0.70;
      break;
    case 'high_protein':
      proteinPercent = 0.35;
      carbPercent = 0.35;
      fatPercent = 0.30;
      break;
    case 'low_carb':
      proteinPercent = 0.30;
      carbPercent = 0.20;
      fatPercent = 0.50;
      break;
    case 'vegetarian':
    case 'vegan':
      proteinPercent = 0.20;
      carbPercent = 0.55;
      fatPercent = 0.25;
      break;
  }
  
  const proteinCals = targetCalories * proteinPercent;
  const carbCals = targetCalories * carbPercent;
  const fatCals = targetCalories * fatPercent;
  
  return {
    calories: targetCalories,
    protein_g: Math.round(proteinCals / 4), // 4 calories per gram
    carbs_g: Math.round(carbCals / 4),      // 4 calories per gram
    fat_g: Math.round(fatCals / 9),         // 9 calories per gram
    fiber_g: Math.round(targetCalories / 70) // Rough estimate: 1g fiber per 70 calories
  };
}

/**
 * Get meal distribution pattern based on country/culture
 */
export function getMealDistribution(country?: string): MealDistribution {
  return CULTURAL_MEAL_DISTRIBUTIONS[country || 'default'] || CULTURAL_MEAL_DISTRIBUTIONS['default'];
}

/**
 * Calculate per-meal macro targets
 */
export function calculateMealTargets(
  userStats: UserStats, 
  dietType: string = 'balanced', 
  country?: string
): { [mealType: string]: MacroTargets } {
  const targetCalories = calculateTargetCalories(userStats);
  const dailyMacros = calculateMacroTargets(targetCalories, dietType);
  const distribution = getMealDistribution(country);
  
  const mealTargets: { [mealType: string]: MacroTargets } = {};
  
  Object.entries(distribution).forEach(([mealType, percentage]) => {
    const mealCalories = Math.round(dailyMacros.calories * (percentage / 100));
    mealTargets[mealType] = {
      calories: mealCalories,
      protein_g: Math.round(dailyMacros.protein_g * (percentage / 100)),
      carbs_g: Math.round(dailyMacros.carbs_g * (percentage / 100)),
      fat_g: Math.round(dailyMacros.fat_g * (percentage / 100)),
      fiber_g: Math.round(dailyMacros.fiber_g * (percentage / 100))
    };
  });
  
  return mealTargets;
}

/**
 * Calculate BMI and category
 */
export function calculateBMI(userStats: UserStats): { bmi: number; category: string } {
  const { weight_kg = 70, height_cm = 170 } = userStats;
  const heightMeters = height_cm / 100;
  const bmi = weight_kg / (heightMeters * heightMeters);
  
  let category = 'Normal weight';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 25 && bmi < 30) category = 'Overweight';
  else if (bmi >= 30) category = 'Obese';
  
  return { bmi: Math.round(bmi * 10) / 10, category };
}

/**
 * Generate portion recommendations text
 */
export function generatePortionRecommendations(userStats: UserStats, country?: string): string {
  const targetCalories = calculateTargetCalories(userStats);
  const { bmi, category } = calculateBMI(userStats);
  const mealTargets = calculateMealTargets(userStats, 'balanced', country);
  
  let recommendations = `Based on your profile (BMI: ${bmi}, ${category}), your daily target is ${targetCalories} calories. `;
  
  if (country === 'India') {
    recommendations += `Meal portions: Breakfast (~${mealTargets.breakfast?.calories} cal), Lunch (~${mealTargets.lunch?.calories} cal), Dinner (~${mealTargets.dinner?.calories} cal). `;
    recommendations += `Use household measures: 1 katori rice ≈ 150 cal, 1 katori dal ≈ 120 cal, 1 roti ≈ 80 cal. `;
  } else {
    recommendations += `Distribute calories across meals with healthy portion sizes. `;
  }
  
  if (userStats.fitness_goal === 'weight_loss') {
    recommendations += `Focus on protein-rich foods and vegetables to maintain satiety while in caloric deficit.`;
  } else if (userStats.fitness_goal === 'weight_gain') {
    recommendations += `Include healthy calorie-dense foods like nuts, seeds, and whole grains.`;
  }
  
  return recommendations;
}