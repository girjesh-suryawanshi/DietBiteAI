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
  const { fitness_goal, cuisine, diet_type, medical_conditions = [], food_exclusions = [], age, gender, weight_kg, height_cm } = request;

  // Create the expert dietician prompt
  const prompt = `You are an expert dietician. Create a safe, balanced, and practical personalized 7-day diet plan following these strict guidelines:

1. CALORIES:
   - For women: 1400–1600 kcal/day (never below 1200)
   - For men: 1700–1900 kcal/day (never below 1500)
   - Adjust based on: Age: ${age || 'N/A'}, Gender: ${gender || 'N/A'}, Weight: ${weight_kg || 'N/A'}kg, Height: ${height_cm || 'N/A'}cm, Goal: ${fitness_goal}

2. MACRONUTRIENTS:
   - Protein: 20–25% of calories (70–80g minimum daily)
   - Carbohydrates: 45–50% (mostly complex carbs, low GI)
   - Fats: 25–30% (healthy fats: olive oil, nuts, seeds, avocado)
   - Fiber: minimum 25g per day

3. MEAL STRUCTURE:
   - Include 3 main meals (breakfast, lunch, dinner) + 2 healthy snacks (mid-morning, evening)
   - Add hydration guidance (2–2.5 liters water/day, herbal teas allowed)

4. NUTRITION QUALITY (Each day must include):
   - At least 1 iron-rich food (lentils, beans, spinach, pumpkin seeds, lean meat)
   - At least 1 calcium source (milk, yogurt, paneer, sesame, ragi, fortified plant milk)
   - At least 1 vitamin C source (citrus fruits, bell peppers, tomatoes)
   - At least 1 omega-3 source (chia seeds, flax, walnuts, or fish if non-vegetarian)

5. DIETARY PREFERENCES:
   - Diet Type: ${diet_type}
   - Cuisine: ${cuisine}
   - If vegetarian → exclude meat, fish, eggs. Use paneer, tofu, dals, beans, soy
   - If vegan → exclude all dairy/eggs. Use plant-based proteins and fortified alternatives
   - Always suggest 1 swap option per meal

6. MEDICAL CONDITIONS & RESTRICTIONS:
   - Medical conditions: ${medical_conditions.length > 0 ? medical_conditions.join(', ') : 'None'}
   - Food exclusions: ${food_exclusions.length > 0 ? food_exclusions.join(', ') : 'None'}

7. OUTPUT FORMAT - Return a valid JSON object with this exact structure:
{
  "week_start": "current date range",
  "total_daily_calories": number,
  "goals": {
    "fitness_goal": "${fitness_goal}",
    "cuisine": "${cuisine}",
    "diet_type": "${diet_type}"
  },
  "days": [
    {
      "day": "Monday",
      "meals": [
        {
          "type": "breakfast",
          "time": "8:00 AM",
          "name": "Dish Name",
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "calories": number,
          "protein_g": number,
          "carbs_g": number,
          "fat_g": number,
          "fiber_g": number,
          "swap_option": "Alternative dish description"
        },
        {
          "type": "mid_morning_snack",
          "time": "10:30 AM",
          "name": "Snack Name",
          "ingredients": ["ingredient1"],
          "instructions": ["preparation"],
          "calories": number,
          "protein_g": number,
          "carbs_g": number,
          "fat_g": number,
          "fiber_g": number,
          "swap_option": "Alternative snack"
        },
        {
          "type": "lunch",
          "time": "1:00 PM",
          "name": "Lunch Dish",
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "calories": number,
          "protein_g": number,
          "carbs_g": number,
          "fat_g": number,
          "fiber_g": number,
          "swap_option": "Alternative meal"
        },
        {
          "type": "evening_snack",
          "time": "4:00 PM",
          "name": "Evening Snack",
          "ingredients": ["ingredient1"],
          "instructions": ["preparation"],
          "calories": number,
          "protein_g": number,
          "carbs_g": number,
          "fat_g": number,
          "fiber_g": number,
          "swap_option": "Alternative snack"
        },
        {
          "type": "dinner",
          "time": "7:00 PM",
          "name": "Dinner Dish",
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "calories": number,
          "protein_g": number,
          "carbs_g": number,
          "fat_g": number,
          "fiber_g": number,
          "swap_option": "Alternative dinner"
        }
      ],
      "daily_totals": {
        "calories": number,
        "protein_g": number,
        "carbs_g": number,
        "fat_g": number,
        "fiber_g": number
      }
    }
    // ... repeat for all 7 days
  ],
  "weekly_summary": {
    "avg_daily_calories": number,
    "avg_protein_g": number,
    "avg_carbs_g": number,
    "avg_fat_g": number,
    "avg_fiber_g": number
  },
  "grocery_list": {
    "vegetables": ["item1", "item2"],
    "fruits": ["item1", "item2"],
    "grains_legumes": ["item1", "item2"],
    "proteins": ["item1", "item2"],
    "dairy_alternatives": ["item1", "item2"],
    "spices_condiments": ["item1", "item2"],
    "nuts_seeds": ["item1", "item2"]
  },
  "hydration_guidance": "Daily water intake recommendations and herbal tea suggestions"
}

Make the plan practical with simple recipes using common ingredients. Ensure it's culturally adaptable and follows all safety guidelines. Return ONLY the JSON object, no additional text.`;

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
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    console.log('✅ Gemini API response received, parsing JSON...');
    
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
              "name": isVegetarian ? "Avocado Toast" : "Scrambled Eggs with Toast",
              "ingredients": isVegetarian ? ["Whole grain bread", "Avocado", "Tomato", "Olive oil", "Salt"] : ["Eggs", "Whole grain bread", "Butter", "Milk", "Salt", "Pepper"],
              "instructions": isVegetarian ? ["Toast the bread", "Mash the avocado", "Spread on toast", "Add sliced tomato", "Drizzle with olive oil"] : ["Beat eggs with milk", "Heat butter in pan", "Add eggs and scramble", "Toast bread", "Serve hot"],
              "calories": 320,
              "protein_g": isVegetarian ? 8 : 18,
              "carbs_g": 35,
              "fat_g": isVegetarian ? 15 : 12,
              "fiber_g": 6,
              "swap_option": isVegetarian ? "Oatmeal with nuts and fruits" : "Greek yogurt with granola"
            },
            {
              "type": "lunch",
              "time": "1:00 PM",
              "name": isVegetarian ? "Quinoa Salad Bowl" : "Grilled Chicken Salad",
              "ingredients": isVegetarian ? ["Quinoa", "Mixed vegetables", "Chickpeas", "Olive oil", "Lemon dressing"] : ["Chicken breast", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil", "Balsamic vinegar"],
              "instructions": isVegetarian ? ["Cook quinoa", "Roast vegetables", "Mix with chickpeas", "Add dressing", "Serve fresh"] : ["Season and grill chicken", "Chop vegetables", "Mix salad ingredients", "Add dressing", "Serve with chicken"],
              "calories": 450,
              "protein_g": isVegetarian ? 15 : 35,
              "carbs_g": isVegetarian ? 60 : 15,
              "fat_g": 12,
              "fiber_g": 8,
              "swap_option": isVegetarian ? "Vegetable curry with rice" : "Fish with steamed vegetables"
            },
            {
              "type": "dinner",
              "time": "7:00 PM",
              "name": isVegetarian ? "Grilled Vegetables with Brown Rice" : "Grilled Salmon with Quinoa",
              "ingredients": isVegetarian ? ["Brown rice", "Mixed vegetables", "Herbs", "Olive oil"] : ["Salmon fillet", "Quinoa", "Asparagus", "Lemon", "Olive oil", "Garlic"],
              "instructions": isVegetarian ? ["Cook brown rice", "Grill vegetables with herbs", "Season with olive oil", "Serve together"] : ["Season salmon with herbs", "Grill until cooked", "Cook quinoa", "Steam asparagus", "Serve with lemon"],
              "calories": 380,
              "protein_g": isVegetarian ? 12 : 32,
              "carbs_g": 45,
              "fat_g": isVegetarian ? 10 : 15,
              "fiber_g": 7,
              "swap_option": isVegetarian ? "Lentil curry with bread" : "Grilled chicken with sweet potato"
            }
          ],
          "daily_totals": {
            "calories": 1150,
            "protein_g": isVegetarian ? 35 : 85,
            "carbs_g": 140,
            "fat_g": isVegetarian ? 37 : 39,
            "fiber_g": 21
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