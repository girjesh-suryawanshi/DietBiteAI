import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "demo-key"
});

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

  const prompt = `Create a comprehensive 7-day meal plan with the following requirements:

REQUIREMENTS:
- Fitness Goal: ${fitness_goal.replace('_', ' ')}
- Cuisine Type: ${cuisine}
- Diet Type: ${diet_type.replace('_', ' ')}
${medical_conditions.length > 0 ? `- Medical Conditions: ${medical_conditions.join(', ')}` : ''}
${food_exclusions.length > 0 ? `- Food Exclusions: ${food_exclusions.join(', ')}` : ''}

INSTRUCTIONS:
- Generate exactly 7 days (Monday to Sunday)
- Each day should have 3 main meals: breakfast, lunch, dinner
- Calculate appropriate calories for each meal based on the fitness goal
- For weight loss: aim for 1200-1500 total daily calories
- For weight gain: aim for 2000-2500 total daily calories  
- For maintenance: aim for 1600-2000 total daily calories
- Include detailed ingredients list for each meal
- Provide step-by-step cooking instructions
- Ensure meals align with the specified cuisine and diet type
- Consider medical conditions and food exclusions
- Make meals practical and achievable for home cooking

RESPONSE FORMAT: Return a JSON object with this exact structure:
{
  "week_start": "Dec 18-24, 2023",
  "total_daily_calories": 1800,
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
          "name": "Meal Name",
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "calories": 300
        }
      ]
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist and meal planning expert. Create detailed, culturally authentic, and nutritionally balanced meal plans. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000,
      temperature: 0.7,
    });

    const mealPlan = JSON.parse(response.choices[0].message.content || "{}");

    // Validate the response structure
    if (!mealPlan.days || !Array.isArray(mealPlan.days) || mealPlan.days.length !== 7) {
      throw new Error("Invalid meal plan structure received from AI");
    }

    return mealPlan;

  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw new Error(`Failed to generate meal plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
