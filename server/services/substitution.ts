// Smart ingredient substitution service for cultural and local adaptation
import { getIngredientSubstitutions, getAvailableCountries, getCookingMethods, getStapleGrains } from '../data/ingredient-substitutions';

export interface SubstitutionContext {
  country?: string;
  region?: string;
  budget_preference?: string;
  local_ingredients_preference?: boolean;
  cultural_background?: string[];
  cuisine_familiarity?: string[];
}

export interface SubstitutionResult {
  original_ingredient: string;
  suggested_substitute: string;
  reason: string;
  cost_impact?: 'lower' | 'similar' | 'higher';
  availability?: 'common' | 'seasonal' | 'rare';
}

// Apply smart substitutions to a list of ingredients
export function applySmartSubstitutions(
  ingredients: string[], 
  context: SubstitutionContext
): { original_ingredients: string[], substituted_ingredients: string[], substitutions_made: SubstitutionResult[] } {
  const substitutions_made: SubstitutionResult[] = [];
  const substituted_ingredients: string[] = [];
  
  // If no country context or user doesn't prefer local ingredients, return original
  if (!context.country || !context.local_ingredients_preference) {
    return {
      original_ingredients: ingredients,
      substituted_ingredients: ingredients,
      substitutions_made: []
    };
  }

  ingredients.forEach(ingredient => {
    const substitution = getIngredientSubstitutions(ingredient, context.country!, context.region);
    
    if (substitution && substitution.substitutes.length > 0) {
      // Choose the best substitute based on context
      const bestSubstitute = chooseBestSubstitute(substitution.substitutes, context);
      
      if (bestSubstitute) {
        substituted_ingredients.push(bestSubstitute.ingredient);
        substitutions_made.push({
          original_ingredient: ingredient,
          suggested_substitute: bestSubstitute.ingredient,
          reason: bestSubstitute.reason,
          cost_impact: determineCostImpact(ingredient, bestSubstitute.ingredient, context),
          availability: 'common' // Local substitutes are typically more available
        });
      } else {
        substituted_ingredients.push(ingredient);
      }
    } else {
      substituted_ingredients.push(ingredient);
    }
  });

  return {
    original_ingredients: ingredients,
    substituted_ingredients,
    substitutions_made
  };
}

// Choose the best substitute based on user context
function chooseBestSubstitute(
  substitutes: { ingredient: string; reason: string; nutrition_notes?: string }[], 
  context: SubstitutionContext
) {
  if (substitutes.length === 0) return null;
  if (substitutes.length === 1) return substitutes[0];

  // Prioritize based on budget preference
  if (context.budget_preference === 'budget_friendly') {
    // Look for budget-friendly indicators in reasons
    const budgetFriendly = substitutes.find(sub => 
      sub.reason.toLowerCase().includes('affordable') || 
      sub.reason.toLowerCase().includes('budget') ||
      sub.reason.toLowerCase().includes('cheap')
    );
    if (budgetFriendly) return budgetFriendly;
  }

  // Prioritize based on cultural background
  if (context.cultural_background && context.cultural_background.length > 0) {
    for (const background of context.cultural_background) {
      const culturalMatch = substitutes.find(sub => 
        sub.reason.toLowerCase().includes(background.toLowerCase()) ||
        sub.ingredient.toLowerCase().includes(background.toLowerCase())
      );
      if (culturalMatch) return culturalMatch;
    }
  }

  // Default to first substitute (usually most recommended)
  return substitutes[0];
}

// Determine cost impact of substitution
function determineCostImpact(
  original: string, 
  substitute: string, 
  context: SubstitutionContext
): 'lower' | 'similar' | 'higher' {
  // Common expensive ingredients that usually have cheaper local alternatives
  const expensiveIngredients = [
    'quinoa', 'avocado', 'salmon', 'blueberries', 'greek yogurt', 
    'almond milk', 'chia seeds', 'kale', 'organic', 'imported'
  ];
  
  const isOriginalExpensive = expensiveIngredients.some(exp => 
    original.toLowerCase().includes(exp)
  );

  if (isOriginalExpensive) {
    return 'lower';
  }

  // Local/traditional ingredients are usually similar or lower cost
  const localIndicators = ['local', 'traditional', 'seasonal', 'common'];
  const isSubstituteLocal = localIndicators.some(local => 
    substitute.toLowerCase().includes(local)
  );

  if (isSubstituteLocal) {
    return context.budget_preference === 'budget_friendly' ? 'lower' : 'similar';
  }

  return 'similar';
}

// Apply substitutions to a complete meal plan
export function applyMealPlanSubstitutions(
  mealPlan: any, 
  context: SubstitutionContext
): { substituted_meal_plan: any, all_substitutions: SubstitutionResult[] } {
  const allSubstitutions: SubstitutionResult[] = [];
  const substitutedMealPlan = JSON.parse(JSON.stringify(mealPlan)); // Deep clone

  // Process each day and meal
  if (substitutedMealPlan.days) {
    substitutedMealPlan.days.forEach((day: any) => {
      if (day.meals) {
        day.meals.forEach((meal: any) => {
          if (meal.ingredients && Array.isArray(meal.ingredients)) {
            const substitutionResult = applySmartSubstitutions(meal.ingredients, context);
            
            // Update meal with substituted ingredients
            meal.ingredients = substitutionResult.substituted_ingredients;
            
            // Track all substitutions made
            allSubstitutions.push(...substitutionResult.substitutions_made);
            
            // Update meal name if significant substitutions were made
            if (substitutionResult.substitutions_made.length > 0) {
              meal.localized_name = localizeMealName(meal.name, context);
            }
          }
        });
      }
    });
  }

  // Update grocery list with substituted ingredients
  if (substitutedMealPlan.grocery_list) {
    Object.keys(substitutedMealPlan.grocery_list).forEach(category => {
      if (Array.isArray(substitutedMealPlan.grocery_list[category])) {
        const substitutionResult = applySmartSubstitutions(
          substitutedMealPlan.grocery_list[category], 
          context
        );
        substitutedMealPlan.grocery_list[category] = substitutionResult.substituted_ingredients;
        allSubstitutions.push(...substitutionResult.substitutions_made);
      }
    });
  }

  return {
    substituted_meal_plan: substitutedMealPlan,
    all_substitutions: allSubstitutions
  };
}

// Localize meal names for cultural relevance
function localizeMealName(originalName: string, context: SubstitutionContext): string {
  if (!context.country) return originalName;

  // Country-specific meal name mappings
  const nameLocalizations: { [key: string]: { [key: string]: string } } = {
    'India': {
      'grilled chicken salad': 'tandoori chicken with raita',
      'quinoa bowl': 'daliya bowl',
      'avocado toast': 'cucumber paratha',
      'greek yogurt': 'hung curd',
      'smoothie bowl': 'lassi bowl',
      'stir fry': 'sabzi',
      'oatmeal': 'dalia',
      'protein shake': 'protein lassi'
    },
    'Mexico': {
      'quinoa bowl': 'amaranth bowl',
      'greek yogurt': 'crema bowl',
      'stir fry': 'verduras salteadas',
      'protein shake': 'licuado de proteína'
    },
    'China': {
      'quinoa bowl': 'brown rice bowl',
      'avocado toast': 'cucumber bao',
      'greek yogurt': 'soy yogurt',
      'smoothie': 'fruit tea'
    }
  };

  const countryLocalizations = nameLocalizations[context.country];
  if (!countryLocalizations) return originalName;

  // Find matching localization
  const lowerOriginal = originalName.toLowerCase();
  for (const [english, local] of Object.entries(countryLocalizations)) {
    if (lowerOriginal.includes(english.toLowerCase())) {
      return local;
    }
  }

  return originalName;
}

// Get substitution suggestions for a single ingredient
export function getIngredientAlternatives(
  ingredient: string, 
  context: SubstitutionContext
): SubstitutionResult[] {
  if (!context.country) return [];

  const substitution = getIngredientSubstitutions(ingredient, context.country, context.region);
  if (!substitution) return [];

  return substitution.substitutes.map(sub => ({
    original_ingredient: ingredient,
    suggested_substitute: sub.ingredient,
    reason: sub.reason,
    cost_impact: determineCostImpact(ingredient, sub.ingredient, context),
    availability: 'common'
  }));
}