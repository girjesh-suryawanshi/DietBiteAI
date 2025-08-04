// Using Google Gemini REST API for meal plan generation
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
}

export async function generateMealPlan(request: MealPlanRequest) {
  const { fitness_goal, cuisine, diet_type, medical_conditions = [], food_exclusions = [] } = request;

  // For now, let's generate a sample meal plan to demonstrate the app functionality
  // This will be replaced with actual Gemini API call once the API key issues are resolved
  
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
            "name": cuisine === "indian" ? "Vegetable Poha" : "Avocado Toast",
            "ingredients": cuisine === "indian" ? ["Poha (flattened rice)", "Mixed vegetables", "Mustard seeds", "Turmeric", "Lemon"] : ["Whole grain bread", "Avocado", "Tomato", "Olive oil", "Salt"],
            "instructions": cuisine === "indian" ? ["Rinse poha and set aside", "Heat oil, add mustard seeds", "Add vegetables and spices", "Mix in poha and cook for 5 minutes", "Garnish with lemon and serve"] : ["Toast the bread", "Mash the avocado", "Spread on toast", "Add sliced tomato", "Drizzle with olive oil"],
            "calories": 320
          },
          {
            "type": "lunch",
            "time": "1:00 PM",
            "name": cuisine === "indian" ? "Dal Rice with Vegetables" : "Quinoa Salad Bowl",
            "ingredients": cuisine === "indian" ? ["Lentils (dal)", "Rice", "Mixed vegetables", "Spices", "Ghee"] : ["Quinoa", "Mixed vegetables", "Chickpeas", "Olive oil", "Lemon dressing"],
            "instructions": cuisine === "indian" ? ["Cook lentils with turmeric", "Prepare rice separately", "Sauté vegetables with spices", "Serve dal over rice", "Add ghee on top"] : ["Cook quinoa", "Roast vegetables", "Mix with chickpeas", "Add dressing", "Serve fresh"],
            "calories": 450
          },
          {
            "type": "dinner",
            "time": "7:00 PM",
            "name": cuisine === "indian" ? "Roti with Sabzi" : "Grilled Vegetables with Brown Rice",
            "ingredients": cuisine === "indian" ? ["Whole wheat flour", "Seasonal vegetables", "Spices", "Oil"] : ["Brown rice", "Mixed vegetables", "Herbs", "Olive oil"],
            "instructions": cuisine === "indian" ? ["Make dough for roti", "Roll and cook on griddle", "Prepare spiced vegetables", "Serve hot with vegetables"] : ["Cook brown rice", "Grill vegetables with herbs", "Season with olive oil", "Serve together"],
            "calories": 380
          }
        ]
      },
      // Generate similar structure for remaining 6 days
      ...Array.from({ length: 6 }, (_, i) => ({
        "day": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i],
        "meals": [
          {
            "type": "breakfast",
            "time": "8:00 AM",
            "name": cuisine === "indian" ? `Indian Breakfast ${i + 2}` : `Healthy Breakfast ${i + 2}`,
            "ingredients": ["Sample ingredient 1", "Sample ingredient 2", "Sample ingredient 3"],
            "instructions": ["Step 1", "Step 2", "Step 3"],
            "calories": 300 + (i * 10)
          },
          {
            "type": "lunch",
            "time": "1:00 PM",
            "name": cuisine === "indian" ? `Indian Lunch ${i + 2}` : `Healthy Lunch ${i + 2}`,
            "ingredients": ["Sample ingredient 1", "Sample ingredient 2", "Sample ingredient 3"],
            "instructions": ["Step 1", "Step 2", "Step 3"],
            "calories": 420 + (i * 15)
          },
          {
            "type": "dinner",
            "time": "7:00 PM",
            "name": cuisine === "indian" ? `Indian Dinner ${i + 2}` : `Healthy Dinner ${i + 2}`,
            "ingredients": ["Sample ingredient 1", "Sample ingredient 2", "Sample ingredient 3"],
            "instructions": ["Step 1", "Step 2", "Step 3"],
            "calories": 360 + (i * 12)
          }
        ]
      }))
    ]
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return sampleMealPlan;
}