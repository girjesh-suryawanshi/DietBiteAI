// Using Google Gemini REST API for meal plan generation
import { getIngredientSubstitutions, getCookingMethods, getStapleGrains } from '../data/ingredient-substitutions.js';
import { calculateMealTargets, generatePortionRecommendations, type UserStats } from './portion.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "demo-key";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

interface MealPlanRequest {
  fitness_goal: string; // weight_loss, weight_gain, maintain
  cuisine: string; // indian, american, mediterranean, etc.
  diet_type: string; // vegetarian, non_vegetarian, vegan, keto, diabetic_friendly
  medical_conditions?: string[];
  food_exclusions?: string[];
  age?: number;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  
  // Enhanced cultural and location context
  country?: string;
  region?: string;
  city?: string;
  cultural_background?: string[];
  cuisine_familiarity?: string[];
  cooking_methods?: string[];
  local_ingredients_preference?: boolean;
  budget_preference?: string;
}

export async function generateMealPlan(request: MealPlanRequest) {
  const { 
    fitness_goal, cuisine, diet_type, medical_conditions = [], food_exclusions = [], 
    age, gender, weight_kg, height_cm,
    country, region, city, cultural_background = [], cuisine_familiarity = [],
    cooking_methods = [], local_ingredients_preference = true, budget_preference
  } = request;

  // Get local context
  const localCookingMethods = country ? getCookingMethods(country) : [];
  const localStapleGrains = country ? getStapleGrains(country) : [];
  
  // Calculate portion targets based on user stats
  const userStats: UserStats = { age, gender, weight_kg, height_cm, fitness_goal };
  const mealTargets = calculateMealTargets(userStats, diet_type, country);
  const portionRecommendations = generatePortionRecommendations(userStats, country);
  
  // Create a focused prompt for structured meal generation
  const prompt = `Generate a 7-day ${diet_type} ${cuisine} diet plan for ${fitness_goal} in ${country || 'International'}.

USER: ${gender || 'N/A'}, ${age || 'N/A'}yrs, ${weight_kg || 'N/A'}kg
DAILY: ${gender === 'male' ? '1800' : '1500'} calories
AVOID: ${food_exclusions.length > 0 ? food_exclusions.join(', ') : 'None'}

MEALS PER DAY (exact calories):
• Breakfast: ${mealTargets.breakfast?.calories || 400} cal, ${mealTargets.breakfast?.protein_g || 20}g protein
• Lunch: ${mealTargets.lunch?.calories || 500} cal, ${mealTargets.lunch?.protein_g || 25}g protein
• Dinner: ${mealTargets.dinner?.calories || 400} cal, ${mealTargets.dinner?.protein_g || 20}g protein
• 2 Snacks: ${mealTargets.mid_morning_snack?.calories || 150} cal each

MANDATORY: ALL ingredients with quantities like:
{"name": "rice", "local_name": "${country === 'India' ? 'चावल' : 'rice'}", "quantity": 1, "unit": "cup", "household_unit": "1 ${country === 'India' ? 'katori' : 'cup'}", "macros": {"calories": 200, "protein_g": 4}}

Return JSON only - 7 days, 5 meals per day, structured ingredients with exact quantities.`;

  try {
    console.log('🤖 Calling Gemini API to generate meal plan...');
    
    const response = await fetch(GEMINI_API_URL + `?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 20000,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('🔍 Gemini API raw response:', JSON.stringify(data, null, 2));
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      console.log('❌ No content in API response. Full response:', JSON.stringify(data, null, 2));
      throw new Error('No content generated from Gemini API');
    }

    console.log('✅ Gemini API response received, parsing JSON...');
    console.log('📝 Generated text length:', generatedText.length);
    
    // Parse the JSON response from Gemini with improved extraction
    let cleanedText = generatedText.replace(/```json|```/g, '').trim();
    
    // Find the JSON object in the response
    const jsonStart = cleanedText.indexOf('{');
    const jsonEnd = cleanedText.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
    }
    
    const mealPlan = JSON.parse(cleanedText);
    
    console.log('✅ Successfully generated meal plan via Gemini API');
    return mealPlan;
  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);
    console.log('🔄 Falling back to enhanced sample meal plan...');
    
    // Fallback to enhanced sample meal plan with proper diet type differentiation
    const isVegetarian = diet_type === "vegetarian" || diet_type === "vegan";
    
    const sampleMealPlan = {
      "week_start": `${new Date().toLocaleDateString()} - ${new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
      "total_daily_calories": fitness_goal === "weight_loss" ? 1400 : fitness_goal === "weight_gain" ? 2200 : 1800,
      "goals": {
        "fitness_goal": fitness_goal,
        "cuisine": cuisine,
        "diet_type": diet_type
      },
      "days": [
        {
          "day": "Monday",
          "meals": [
            {
              "type": "breakfast",
              "time": "8:00 AM",
              "name": isVegetarian ? "Avocado Toast with Seeds" : "Scrambled Eggs with Toast",
              "ingredients": isVegetarian ? [
                {"name": "bread", "local_name": "Whole grain bread", "quantity": 2, "unit": "slices", "household_unit": "2 medium slices", "macros": {"calories": 160, "protein_g": 6}},
                {"name": "avocado", "local_name": "Avocado", "quantity": 1, "unit": "medium", "household_unit": "1 medium fruit", "macros": {"calories": 120, "protein_g": 2}},
                {"name": "tomato", "local_name": "Tomato", "quantity": 50, "unit": "g", "household_unit": "3-4 slices", "macros": {"calories": 10, "protein_g": 1}},
                {"name": "chia seeds", "local_name": "Chia seeds", "quantity": 1, "unit": "tbsp", "household_unit": "1 tablespoon", "macros": {"calories": 60, "protein_g": 3}}
              ] : [
                {"name": "eggs", "local_name": "Eggs", "quantity": 2, "unit": "large", "household_unit": "2 large eggs", "macros": {"calories": 140, "protein_g": 12}},
                {"name": "bread", "local_name": "Whole grain bread", "quantity": 2, "unit": "slices", "household_unit": "2 medium slices", "macros": {"calories": 160, "protein_g": 6}},
                {"name": "spinach", "local_name": "Spinach", "quantity": 30, "unit": "g", "household_unit": "1 handful", "macros": {"calories": 7, "protein_g": 1}},
                {"name": "butter", "local_name": "Butter", "quantity": 1, "unit": "tsp", "household_unit": "1 teaspoon", "macros": {"calories": 35, "protein_g": 0}}
              ],
              "instructions": isVegetarian ? ["Toast bread", "Mash avocado with chia seeds", "Add tomato slices", "Drizzle olive oil"] : ["Beat eggs", "Scramble with spinach", "Toast bread", "Serve hot"],
              "calories": 350,
              "protein_g": isVegetarian ? 12 : 22,
              "carbs_g": 35,
              "fat_g": isVegetarian ? 18 : 16,
              "fiber_g": 8,
              "swap_option": isVegetarian ? "Oatmeal with nuts" : "Greek yogurt parfait"
            },
            {
              "type": "mid_morning_snack",
              "time": "10:30 AM",
              "name": isVegetarian ? "Mixed Nuts" : "Greek Yogurt",
              "ingredients": isVegetarian ? ["Almonds", "Walnuts", "Cashews"] : ["Greek yogurt", "Berries", "Honey"],
              "instructions": isVegetarian ? ["Mix nuts in bowl"] : ["Add berries to yogurt", "Drizzle honey"],
              "calories": 150,
              "protein_g": isVegetarian ? 6 : 15,
              "carbs_g": isVegetarian ? 5 : 18,
              "fat_g": isVegetarian ? 12 : 2,
              "fiber_g": 3,
              "swap_option": isVegetarian ? "Apple with almond butter" : "Cottage cheese"
            },
            {
              "type": "lunch",
              "time": "1:00 PM",
              "name": isVegetarian ? "Quinoa Bowl with Chickpeas" : "Grilled Chicken Salad",
              "ingredients": isVegetarian ? [
                {"name": "quinoa", "local_name": "Quinoa", "quantity": 80, "unit": "g", "household_unit": "1/2 cup cooked", "macros": {"calories": 160, "protein_g": 6}},
                {"name": "chickpeas", "local_name": "Chickpeas", "quantity": 100, "unit": "g", "household_unit": "1/2 cup cooked", "macros": {"calories": 120, "protein_g": 8}},
                {"name": "mixed vegetables", "local_name": "Mixed vegetables", "quantity": 150, "unit": "g", "household_unit": "1 cup chopped", "macros": {"calories": 50, "protein_g": 2}},
                {"name": "tahini", "local_name": "Tahini", "quantity": 1, "unit": "tbsp", "household_unit": "1 tablespoon", "macros": {"calories": 60, "protein_g": 2}}
              ] : [
                {"name": "chicken breast", "local_name": "Chicken breast", "quantity": 120, "unit": "g", "household_unit": "1 medium piece", "macros": {"calories": 200, "protein_g": 30}},
                {"name": "mixed greens", "local_name": "Mixed greens", "quantity": 100, "unit": "g", "household_unit": "2 cups", "macros": {"calories": 20, "protein_g": 2}},
                {"name": "cherry tomatoes", "local_name": "Cherry tomatoes", "quantity": 80, "unit": "g", "household_unit": "6-8 pieces", "macros": {"calories": 15, "protein_g": 1}},
                {"name": "olive oil", "local_name": "Olive oil", "quantity": 1, "unit": "tbsp", "household_unit": "1 tablespoon", "macros": {"calories": 120, "protein_g": 0}}
              ],
              "instructions": isVegetarian ? ["Cook quinoa", "Roast chickpeas", "Mix with vegetables", "Add tahini dressing"] : ["Grill seasoned chicken", "Prepare fresh salad", "Add olive oil dressing"],
              "calories": 480,
              "protein_g": isVegetarian ? 18 : 38,
              "carbs_g": isVegetarian ? 65 : 12,
              "fat_g": 15,
              "fiber_g": 10,
              "swap_option": isVegetarian ? "Lentil curry with rice" : "Fish with vegetables"
            },
            {
              "type": "evening_snack",
              "time": "4:00 PM",
              "name": isVegetarian ? "Green Tea with Dates" : "Protein Smoothie",
              "ingredients": isVegetarian ? ["Green tea", "Dates", "Almonds"] : ["Protein powder", "Banana", "Almond milk"],
              "instructions": isVegetarian ? ["Brew tea", "Eat dates with almonds"] : ["Blend all ingredients", "Serve chilled"],
              "calories": 120,
              "protein_g": isVegetarian ? 3 : 25,
              "carbs_g": isVegetarian ? 22 : 15,
              "fat_g": isVegetarian ? 4 : 2,
              "fiber_g": 2,
              "swap_option": isVegetarian ? "Herbal tea with nuts" : "Hard-boiled eggs"
            },
            {
              "type": "dinner",
              "time": "7:00 PM",
              "name": isVegetarian ? "Lentil Dal with Brown Rice" : "Grilled Salmon with Quinoa",
              "ingredients": isVegetarian ? ["Red lentils", "Brown rice", "Spinach", "Turmeric", "Ginger"] : ["Salmon fillet", "Quinoa", "Asparagus", "Lemon", "Herbs"],
              "instructions": isVegetarian ? ["Cook lentils with spices", "Steam rice", "Add spinach", "Serve together"] : ["Season and grill salmon", "Cook quinoa", "Steam asparagus", "Serve with lemon"],
              "calories": 420,
              "protein_g": isVegetarian ? 16 : 35,
              "carbs_g": 50,
              "fat_g": isVegetarian ? 8 : 18,
              "fiber_g": 12,
              "swap_option": isVegetarian ? "Vegetable curry" : "Chicken with sweet potato"
            }
          ],
          "daily_totals": {
            "calories": 1520,
            "protein_g": isVegetarian ? 55 : 135,
            "carbs_g": 177,
            "fat_g": isVegetarian ? 57 : 53,
            "fiber_g": 35
          }
        },
        {
          "day": "Tuesday",
          "meals": [
            {
              "type": "breakfast",
              "time": "8:00 AM",
              "name": isVegetarian ? "Oatmeal with Fruits" : "Protein Pancakes",
              "ingredients": isVegetarian ? ["Oats", "Banana", "Berries", "Almond milk", "Chia seeds"] : ["Eggs", "Protein powder", "Oat flour", "Berries", "Greek yogurt"],
              "instructions": isVegetarian ? ["Cook oats with almond milk", "Add fruits and chia seeds"] : ["Mix ingredients", "Cook pancakes", "Serve with yogurt"],
              "calories": 340,
              "protein_g": isVegetarian ? 10 : 28,
              "carbs_g": 45,
              "fat_g": isVegetarian ? 12 : 8,
              "fiber_g": 8,
              "swap_option": isVegetarian ? "Smoothie bowl" : "Omelet with vegetables"
            },
            {
              "type": "mid_morning_snack",
              "time": "10:30 AM",
              "name": isVegetarian ? "Apple with Almond Butter" : "Cottage Cheese Bowl",
              "ingredients": isVegetarian ? ["Apple", "Almond butter", "Cinnamon"] : ["Cottage cheese", "Cucumber", "Black pepper"],
              "instructions": isVegetarian ? ["Slice apple", "Dip in almond butter"] : ["Add cucumber to cottage cheese", "Season with pepper"],
              "calories": 160,
              "protein_g": isVegetarian ? 4 : 18,
              "carbs_g": isVegetarian ? 20 : 8,
              "fat_g": isVegetarian ? 8 : 4,
              "fiber_g": 4,
              "swap_option": isVegetarian ? "Banana with peanut butter" : "Protein shake"
            },
            {
              "type": "lunch",
              "time": "1:00 PM",
              "name": isVegetarian ? "Mediterranean Wrap" : "Turkey and Avocado Wrap",
              "ingredients": isVegetarian ? ["Whole wheat tortilla", "Hummus", "Vegetables", "Feta cheese", "Olives"] : ["Whole wheat tortilla", "Turkey slices", "Avocado", "Lettuce", "Tomato"],
              "instructions": isVegetarian ? ["Spread hummus", "Add vegetables and feta", "Roll tightly"] : ["Layer turkey and vegetables", "Add avocado", "Roll and slice"],
              "calories": 450,
              "protein_g": isVegetarian ? 16 : 32,
              "carbs_g": isVegetarian ? 55 : 28,
              "fat_g": 18,
              "fiber_g": 8,
              "swap_option": isVegetarian ? "Buddha bowl" : "Chicken Caesar salad"
            },
            {
              "type": "evening_snack",
              "time": "4:00 PM",
              "name": isVegetarian ? "Trail Mix" : "Protein Bar",
              "ingredients": isVegetarian ? ["Nuts", "Dried fruits", "Seeds"] : ["Protein bar", "Water"],
              "instructions": isVegetarian ? ["Mix ingredients in bowl"] : ["Unwrap and eat"],
              "calories": 140,
              "protein_g": isVegetarian ? 5 : 20,
              "carbs_g": isVegetarian ? 15 : 15,
              "fat_g": isVegetarian ? 8 : 5,
              "fiber_g": 3,
              "swap_option": isVegetarian ? "Energy balls" : "Jerky with nuts"
            },
            {
              "type": "dinner",
              "time": "7:00 PM",
              "name": isVegetarian ? "Stuffed Bell Peppers" : "Grilled Chicken with Vegetables",
              "ingredients": isVegetarian ? ["Bell peppers", "Quinoa", "Black beans", "Corn", "Cheese"] : ["Chicken breast", "Broccoli", "Sweet potato", "Olive oil", "Herbs"],
              "instructions": isVegetarian ? ["Stuff peppers with quinoa mixture", "Bake until tender"] : ["Grill chicken", "Roast vegetables", "Serve together"],
              "calories": 400,
              "protein_g": isVegetarian ? 18 : 36,
              "carbs_g": 45,
              "fat_g": isVegetarian ? 12 : 14,
              "fiber_g": 10,
              "swap_option": isVegetarian ? "Eggplant parmesan" : "Fish with rice"
            }
          ],
          "daily_totals": {
            "calories": 1490,
            "protein_g": isVegetarian ? 53 : 134,
            "carbs_g": 180,
            "fat_g": isVegetarian ? 58 : 51,
            "fiber_g": 33
          }
        },
        {
          "day": "Wednesday",
          "meals": [
            {
              "type": "breakfast",
              "time": "8:00 AM",
              "name": isVegetarian ? "Chia Pudding" : "Egg Benedict",
              "ingredients": isVegetarian ? ["Chia seeds", "Almond milk", "Berries", "Honey", "Nuts"] : ["English muffin", "Eggs", "Ham", "Hollandaise", "Spinach"],
              "instructions": isVegetarian ? ["Soak chia overnight", "Add toppings"] : ["Poach eggs", "Assemble benedict", "Serve hot"],
              "calories": 360,
              "protein_g": isVegetarian ? 12 : 24,
              "carbs_g": 35,
              "fat_g": isVegetarian ? 20 : 22,
              "fiber_g": 12,
              "swap_option": isVegetarian ? "Quinoa breakfast bowl" : "Breakfast burrito"
            },
            {
              "type": "mid_morning_snack",
              "time": "10:30 AM",
              "name": isVegetarian ? "Green Smoothie" : "Protein Shake",
              "ingredients": isVegetarian ? ["Spinach", "Banana", "Apple", "Ginger", "Water"] : ["Whey protein", "Banana", "Milk", "Peanut butter"],
              "instructions": isVegetarian ? ["Blend all ingredients"] : ["Blend with ice", "Serve immediately"],
              "calories": 150,
              "protein_g": isVegetarian ? 4 : 25,
              "carbs_g": isVegetarian ? 35 : 12,
              "fat_g": isVegetarian ? 1 : 8,
              "fiber_g": 6,
              "swap_option": isVegetarian ? "Fruit salad" : "Boiled eggs"
            },
            {
              "type": "lunch",
              "time": "1:00 PM",
              "name": isVegetarian ? "Asian Stir Fry" : "Beef Stir Fry",
              "ingredients": isVegetarian ? ["Tofu", "Mixed vegetables", "Brown rice", "Soy sauce", "Ginger"] : ["Lean beef", "Vegetables", "Brown rice", "Soy sauce", "Garlic"],
              "instructions": isVegetarian ? ["Stir fry tofu and vegetables", "Serve over rice"] : ["Stir fry beef with vegetables", "Serve over rice"],
              "calories": 470,
              "protein_g": isVegetarian ? 20 : 38,
              "carbs_g": isVegetarian ? 60 : 45,
              "fat_g": 15,
              "fiber_g": 8,
              "swap_option": isVegetarian ? "Thai curry" : "Chicken teriyaki"
            },
            {
              "type": "evening_snack",
              "time": "4:00 PM",
              "name": isVegetarian ? "Hummus with Vegetables" : "Turkey Roll-ups",
              "ingredients": isVegetarian ? ["Hummus", "Carrots", "Cucumbers", "Bell peppers"] : ["Turkey slices", "Cream cheese", "Cucumber", "Lettuce"],
              "instructions": isVegetarian ? ["Cut vegetables", "Serve with hummus"] : ["Roll turkey with fillings", "Secure with toothpick"],
              "calories": 130,
              "protein_g": isVegetarian ? 6 : 18,
              "carbs_g": isVegetarian ? 15 : 3,
              "fat_g": isVegetarian ? 6 : 8,
              "fiber_g": 4,
              "swap_option": isVegetarian ? "Guacamole with chips" : "Chicken salad"
            },
            {
              "type": "dinner",
              "time": "7:00 PM",
              "name": isVegetarian ? "Mushroom Risotto" : "Baked Cod with Vegetables",
              "ingredients": isVegetarian ? ["Arborio rice", "Mushrooms", "Vegetable broth", "Parmesan", "Wine"] : ["Cod fillet", "Asparagus", "Carrots", "Olive oil", "Lemon"],
              "instructions": isVegetarian ? ["Cook risotto slowly", "Add mushrooms", "Finish with cheese"] : ["Bake cod with vegetables", "Season with herbs"],
              "calories": 410,
              "protein_g": isVegetarian ? 15 : 32,
              "carbs_g": isVegetarian ? 70 : 25,
              "fat_g": isVegetarian ? 8 : 12,
              "fiber_g": 6,
              "swap_option": isVegetarian ? "Pasta primavera" : "Salmon with quinoa"
            }
          ],
          "daily_totals": {
            "calories": 1520,
            "protein_g": isVegetarian ? 57 : 137,
            "carbs_g": 215,
            "fat_g": isVegetarian ? 50 : 72,
            "fiber_g": 36
          }
        },
        {
          "day": "Thursday",
          "meals": [
            {
              "type": "breakfast",
              "time": "8:00 AM",
              "name": isVegetarian ? "Quinoa Breakfast Bowl" : "Steak and Eggs",
              "ingredients": isVegetarian ? ["Quinoa", "Berries", "Nuts", "Greek yogurt", "Honey"] : ["Lean steak", "Eggs", "Hash browns", "Vegetables"],
              "instructions": isVegetarian ? ["Cook quinoa", "Add toppings", "Drizzle honey"] : ["Grill steak", "Fry eggs", "Serve with hash browns"],
              "calories": 380,
              "protein_g": isVegetarian ? 15 : 35,
              "carbs_g": 50,
              "fat_g": isVegetarian ? 12 : 20,
              "fiber_g": 8,
              "swap_option": isVegetarian ? "Acai bowl" : "Protein omelet"
            },
            {
              "type": "mid_morning_snack",
              "time": "10:30 AM",
              "name": isVegetarian ? "Energy Balls" : "Beef Jerky",
              "ingredients": isVegetarian ? ["Dates", "Nuts", "Coconut", "Chia seeds"] : ["Beef jerky", "Almonds"],
              "instructions": isVegetarian ? ["Blend and roll into balls"] : ["Eat jerky with almonds"],
              "calories": 140,
              "protein_g": isVegetarian ? 4 : 15,
              "carbs_g": isVegetarian ? 20 : 5,
              "fat_g": isVegetarian ? 6 : 8,
              "fiber_g": 4,
              "swap_option": isVegetarian ? "Fruit and nuts" : "Protein smoothie"
            },
            {
              "type": "lunch",
              "time": "1:00 PM",
              "name": isVegetarian ? "Buddha Bowl" : "Chicken Caesar Salad",
              "ingredients": isVegetarian ? ["Quinoa", "Roasted vegetables", "Avocado", "Tahini", "Seeds"] : ["Chicken breast", "Romaine lettuce", "Croutons", "Parmesan", "Caesar dressing"],
              "instructions": isVegetarian ? ["Arrange ingredients in bowl", "Drizzle with tahini"] : ["Grill chicken", "Toss salad", "Add dressing and croutons"],
              "calories": 480,
              "protein_g": isVegetarian ? 18 : 42,
              "carbs_g": isVegetarian ? 65 : 20,
              "fat_g": 20,
              "fiber_g": 12,
              "swap_option": isVegetarian ? "Grain salad" : "Tuna salad"
            },
            {
              "type": "evening_snack",
              "time": "4:00 PM",
              "name": isVegetarian ? "Roasted Chickpeas" : "Protein Muffin",
              "ingredients": isVegetarian ? ["Chickpeas", "Spices", "Olive oil"] : ["Protein muffin", "Berries"],
              "instructions": isVegetarian ? ["Roast seasoned chickpeas"] : ["Warm muffin", "Serve with berries"],
              "calories": 150,
              "protein_g": isVegetarian ? 8 : 20,
              "carbs_g": isVegetarian ? 20 : 15,
              "fat_g": isVegetarian ? 4 : 6,
              "fiber_g": 6,
              "swap_option": isVegetarian ? "Edamame" : "Greek yogurt"
            },
            {
              "type": "dinner",
              "time": "7:00 PM",
              "name": isVegetarian ? "Eggplant Parmesan" : "Grilled Pork with Sweet Potato",
              "ingredients": isVegetarian ? ["Eggplant", "Marinara sauce", "Mozzarella", "Basil", "Parmesan"] : ["Pork tenderloin", "Sweet potato", "Green beans", "Rosemary"],
              "instructions": isVegetarian ? ["Layer eggplant with sauce and cheese", "Bake until bubbly"] : ["Grill seasoned pork", "Roast sweet potato and beans"],
              "calories": 420,
              "protein_g": isVegetarian ? 20 : 38,
              "carbs_g": isVegetarian ? 35 : 30,
              "fat_g": isVegetarian ? 22 : 15,
              "fiber_g": 10,
              "swap_option": isVegetarian ? "Zucchini lasagna" : "Lamb with vegetables"
            }
          ],
          "daily_totals": {
            "calories": 1570,
            "protein_g": isVegetarian ? 65 : 150,
            "carbs_g": 190,
            "fat_g": isVegetarian ? 64 : 69,
            "fiber_g": 40
          }
        },
        {
          "day": "Friday",
          "meals": [
            {
              "type": "breakfast",
              "time": "8:00 AM",
              "name": isVegetarian ? "French Toast" : "Protein French Toast",
              "ingredients": isVegetarian ? ["Whole grain bread", "Almond milk", "Vanilla", "Cinnamon", "Berries"] : ["Whole grain bread", "Eggs", "Protein powder", "Milk", "Berries"],
              "instructions": isVegetarian ? ["Dip bread in mixture", "Cook until golden"] : ["Mix eggs with protein powder", "Dip bread", "Cook and serve"],
              "calories": 350,
              "protein_g": isVegetarian ? 10 : 25,
              "carbs_g": 45,
              "fat_g": isVegetarian ? 12 : 8,
              "fiber_g": 6,
              "swap_option": isVegetarian ? "Pancakes" : "Protein pancakes"
            },
            {
              "type": "mid_morning_snack",
              "time": "10:30 AM",
              "name": isVegetarian ? "Smoothie" : "Tuna Snack Pack",
              "ingredients": isVegetarian ? ["Mango", "Spinach", "Coconut water", "Lime"] : ["Tuna packet", "Crackers", "Cherry tomatoes"],
              "instructions": isVegetarian ? ["Blend all ingredients"] : ["Eat tuna with crackers and tomatoes"],
              "calories": 140,
              "protein_g": isVegetarian ? 3 : 20,
              "carbs_g": isVegetarian ? 32 : 12,
              "fat_g": isVegetarian ? 1 : 6,
              "fiber_g": 4,
              "swap_option": isVegetarian ? "Fruit bowl" : "Protein bar"
            },
            {
              "type": "lunch",
              "time": "1:00 PM",
              "name": isVegetarian ? "Falafel Wrap" : "Chicken Shawarma Wrap",
              "ingredients": isVegetarian ? ["Falafel", "Hummus", "Vegetables", "Tahini", "Pita"] : ["Chicken", "Yogurt sauce", "Vegetables", "Pita bread"],
              "instructions": isVegetarian ? ["Warm falafel", "Assemble wrap with vegetables"] : ["Cook spiced chicken", "Assemble wrap with sauce"],
              "calories": 460,
              "protein_g": isVegetarian ? 16 : 35,
              "carbs_g": isVegetarian ? 60 : 40,
              "fat_g": 18,
              "fiber_g": 10,
              "swap_option": isVegetarian ? "Veggie burger" : "Chicken burger"
            },
            {
              "type": "evening_snack",
              "time": "4:00 PM",
              "name": isVegetarian ? "Dark Chocolate and Nuts" : "Protein Cookies",
              "ingredients": isVegetarian ? ["Dark chocolate", "Mixed nuts"] : ["Protein cookies", "Milk"],
              "instructions": isVegetarian ? ["Eat chocolate with nuts"] : ["Enjoy cookies with milk"],
              "calories": 160,
              "protein_g": isVegetarian ? 4 : 15,
              "carbs_g": isVegetarian ? 12 : 20,
              "fat_g": isVegetarian ? 12 : 6,
              "fiber_g": 3,
              "swap_option": isVegetarian ? "Fruit and nut bar" : "Protein brownie"
            },
            {
              "type": "dinner",
              "time": "7:00 PM",
              "name": isVegetarian ? "Vegetable Curry" : "Grilled Shrimp with Rice",
              "ingredients": isVegetarian ? ["Mixed vegetables", "Coconut milk", "Curry spices", "Brown rice"] : ["Shrimp", "Jasmine rice", "Vegetables", "Garlic", "Lemon"],
              "instructions": isVegetarian ? ["Cook vegetables in curry sauce", "Serve over rice"] : ["Grill seasoned shrimp", "Serve with rice and vegetables"],
              "calories": 440,
              "protein_g": isVegetarian ? 12 : 32,
              "carbs_g": isVegetarian ? 70 : 50,
              "fat_g": isVegetarian ? 15 : 8,
              "fiber_g": 12,
              "swap_option": isVegetarian ? "Thai curry" : "Fish tacos"
            }
          ],
          "daily_totals": {
            "calories": 1550,
            "protein_g": isVegetarian ? 45 : 127,
            "carbs_g": 219,
            "fat_g": isVegetarian ? 58 : 46,
            "fiber_g": 35
          }
        },
        {
          "day": "Saturday",
          "meals": [
            {
              "type": "breakfast",
              "time": "8:00 AM",
              "name": isVegetarian ? "Weekend Pancakes" : "Breakfast Burrito",
              "ingredients": isVegetarian ? ["Oat flour", "Banana", "Berries", "Maple syrup", "Nuts"] : ["Eggs", "Tortilla", "Cheese", "Sausage", "Peppers"],
              "instructions": isVegetarian ? ["Make fluffy pancakes", "Top with berries and syrup"] : ["Scramble eggs with fillings", "Wrap in tortilla"],
              "calories": 390,
              "protein_g": isVegetarian ? 12 : 28,
              "carbs_g": 55,
              "fat_g": isVegetarian ? 15 : 20,
              "fiber_g": 8,
              "swap_option": isVegetarian ? "Waffles" : "Breakfast sandwich"
            },
            {
              "type": "mid_morning_snack",
              "time": "10:30 AM",
              "name": isVegetarian ? "Coconut Yogurt" : "Protein Smoothie Bowl",
              "ingredients": isVegetarian ? ["Coconut yogurt", "Granola", "Berries", "Honey"] : ["Protein powder", "Frozen berries", "Granola", "Milk"],
              "instructions": isVegetarian ? ["Layer yogurt with toppings"] : ["Blend protein mixture", "Top with granola"],
              "calories": 170,
              "protein_g": isVegetarian ? 5 : 22,
              "carbs_g": isVegetarian ? 25 : 18,
              "fat_g": isVegetarian ? 8 : 4,
              "fiber_g": 4,
              "swap_option": isVegetarian ? "Chia pudding" : "Protein shake"
            },
            {
              "type": "lunch",
              "time": "1:00 PM",
              "name": isVegetarian ? "Caprese Salad with Quinoa" : "Grilled Chicken Club",
              "ingredients": isVegetarian ? ["Quinoa", "Tomatoes", "Mozzarella", "Basil", "Balsamic"] : ["Chicken breast", "Bacon", "Lettuce", "Tomato", "Whole grain bread"],
              "instructions": isVegetarian ? ["Layer tomatoes and cheese", "Serve over quinoa"] : ["Grill chicken", "Assemble club sandwich"],
              "calories": 470,
              "protein_g": isVegetarian ? 20 : 45,
              "carbs_g": isVegetarian ? 50 : 25,
              "fat_g": 22,
              "fiber_g": 6,
              "swap_option": isVegetarian ? "Greek salad" : "Turkey club"
            },
            {
              "type": "evening_snack",
              "time": "4:00 PM",
              "name": isVegetarian ? "Avocado Toast" : "Deli Roll-ups",
              "ingredients": isVegetarian ? ["Whole grain bread", "Avocado", "Hemp seeds", "Lemon"] : ["Deli turkey", "Cheese", "Pickles", "Mustard"],
              "instructions": isVegetarian ? ["Toast bread", "Top with mashed avocado and seeds"] : ["Roll turkey with cheese and pickles"],
              "calories": 180,
              "protein_g": isVegetarian ? 6 : 18,
              "carbs_g": isVegetarian ? 20 : 4,
              "fat_g": isVegetarian ? 12 : 12,
              "fiber_g": 8,
              "swap_option": isVegetarian ? "Guacamole with crackers" : "Cheese and crackers"
            },
            {
              "type": "dinner",
              "time": "7:00 PM",
              "name": isVegetarian ? "Stuffed Portobello Mushrooms" : "BBQ Ribs with Coleslaw",
              "ingredients": isVegetarian ? ["Portobello mushrooms", "Quinoa", "Vegetables", "Cheese", "Herbs"] : ["Pork ribs", "BBQ sauce", "Coleslaw mix", "Corn bread"],
              "instructions": isVegetarian ? ["Stuff mushrooms with quinoa mixture", "Bake until tender"] : ["Slow cook ribs", "Serve with coleslaw"],
              "calories": 450,
              "protein_g": isVegetarian ? 18 : 40,
              "carbs_g": isVegetarian ? 45 : 35,
              "fat_g": isVegetarian ? 20 : 25,
              "fiber_g": 8,
              "swap_option": isVegetarian ? "Stuffed peppers" : "Grilled steak"
            }
          ],
          "daily_totals": {
            "calories": 1660,
            "protein_g": isVegetarian ? 61 : 153,
            "carbs_g": 195,
            "fat_g": isVegetarian ? 77 : 85,
            "fiber_g": 34
          }
        },
        {
          "day": "Sunday",
          "meals": [
            {
              "type": "breakfast",
              "time": "8:00 AM",
              "name": isVegetarian ? "Sunday Brunch Bowl" : "Full English Breakfast",
              "ingredients": isVegetarian ? ["Quinoa", "Roasted vegetables", "Poached egg", "Avocado", "Seeds"] : ["Eggs", "Bacon", "Sausage", "Baked beans", "Toast"],
              "instructions": isVegetarian ? ["Arrange ingredients in bowl", "Top with poached egg"] : ["Cook all components", "Serve traditional style"],
              "calories": 420,
              "protein_g": isVegetarian ? 16 : 35,
              "carbs_g": 45,
              "fat_g": isVegetarian ? 20 : 28,
              "fiber_g": 10,
              "swap_option": isVegetarian ? "Breakfast quinoa" : "Protein omelet"
            },
            {
              "type": "mid_morning_snack",
              "time": "10:30 AM",
              "name": isVegetarian ? "Herbal Tea with Biscotti" : "Protein Coffee",
              "ingredients": isVegetarian ? ["Herbal tea", "Almond biscotti"] : ["Coffee", "Protein powder", "Almond milk"],
              "instructions": isVegetarian ? ["Brew tea", "Enjoy with biscotti"] : ["Blend coffee with protein", "Serve hot"],
              "calories": 150,
              "protein_g": isVegetarian ? 3 : 20,
              "carbs_g": isVegetarian ? 25 : 8,
              "fat_g": isVegetarian ? 6 : 6,
              "fiber_g": 2,
              "swap_option": isVegetarian ? "Green tea with nuts" : "Iced protein coffee"
            },
            {
              "type": "lunch",
              "time": "1:00 PM",
              "name": isVegetarian ? "Sunday Pasta" : "Roast Chicken Dinner",
              "ingredients": isVegetarian ? ["Whole wheat pasta", "Vegetables", "Marinara", "Parmesan", "Basil"] : ["Roast chicken", "Mashed potatoes", "Vegetables", "Gravy"],
              "instructions": isVegetarian ? ["Cook pasta", "Toss with vegetables and sauce"] : ["Roast chicken with vegetables", "Serve with potatoes"],
              "calories": 500,
              "protein_g": isVegetarian ? 18 : 45,
              "carbs_g": isVegetarian ? 75 : 40,
              "fat_g": 15,
              "fiber_g": 12,
              "swap_option": isVegetarian ? "Vegetable lasagna" : "Beef roast dinner"
            },
            {
              "type": "evening_snack",
              "time": "4:00 PM",
              "name": isVegetarian ? "Sunday Smoothie" : "Protein Pudding",
              "ingredients": isVegetarian ? ["Berries", "Banana", "Almond milk", "Spinach", "Chia"] : ["Protein powder", "Greek yogurt", "Berries", "Honey"],
              "instructions": isVegetarian ? ["Blend all ingredients"] : ["Mix protein with yogurt", "Top with berries"],
              "calories": 160,
              "protein_g": isVegetarian ? 5 : 25,
              "carbs_g": isVegetarian ? 30 : 15,
              "fat_g": isVegetarian ? 4 : 3,
              "fiber_g": 8,
              "swap_option": isVegetarian ? "Fruit salad" : "Protein ice cream"
            },
            {
              "type": "dinner",
              "time": "7:00 PM",
              "name": isVegetarian ? "Mediterranean Bowl" : "Grilled Fish with Quinoa",
              "ingredients": isVegetarian ? ["Quinoa", "Chickpeas", "Vegetables", "Feta", "Olives", "Tahini"] : ["White fish", "Quinoa", "Mediterranean vegetables", "Lemon", "Herbs"],
              "instructions": isVegetarian ? ["Arrange Mediterranean ingredients", "Drizzle with tahini"] : ["Grill fish with herbs", "Serve with quinoa and vegetables"],
              "calories": 480,
              "protein_g": isVegetarian ? 20 : 38,
              "carbs_g": isVegetarian ? 60 : 45,
              "fat_g": 18,
              "fiber_g": 12,
              "swap_option": isVegetarian ? "Greek bowl" : "Salmon with rice"
            }
          ],
          "daily_totals": {
            "calories": 1710,
            "protein_g": isVegetarian ? 62 : 163,
            "carbs_g": 235,
            "fat_g": isVegetarian ? 63 : 70,
            "fiber_g": 44
          }
        }
      ],
      "weekly_summary": {
        "avg_daily_calories": fitness_goal === "weight_loss" ? 1400 : fitness_goal === "weight_gain" ? 2200 : 1800,
        "avg_protein_g": isVegetarian ? 35 : 85,
        "avg_carbs_g": 140,
        "avg_fat_g": isVegetarian ? 37 : 39,
        "avg_fiber_g": 21
      },
      "grocery_list": {
        "vegetables": ["Mixed vegetables", "Tomatoes", "Asparagus"],
        "fruits": ["Avocado", "Lemon"],
        "grains_legumes": isVegetarian ? ["Quinoa", "Brown rice", "Chickpeas"] : ["Quinoa", "Brown rice"],
        "proteins": isVegetarian ? ["Chickpeas", "Nuts"] : ["Chicken breast", "Salmon", "Eggs"],
        "dairy_alternatives": diet_type === "vegan" ? ["Plant milk"] : ["Milk", "Butter"],
        "spices_condiments": ["Olive oil", "Salt", "Pepper", "Herbs"],
        "nuts_seeds": ["Mixed nuts"]
      },
      "hydration_guidance": "Drink 2-2.5 liters of water daily. Include herbal teas and green tea for antioxidants."
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return sampleMealPlan;
  }
}