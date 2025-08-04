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
      {
        "day": "Tuesday",
        "meals": [
          {
            "type": "breakfast",
            "time": "8:00 AM",
            "name": cuisine === "indian" ? "Upma with Vegetables" : "Greek Yogurt Bowl",
            "ingredients": cuisine === "indian" ? ["Semolina", "Mixed vegetables", "Curry leaves", "Ginger", "Green chilies"] : ["Greek yogurt", "Berries", "Granola", "Honey", "Nuts"],
            "instructions": cuisine === "indian" ? ["Roast semolina", "Heat oil, add curry leaves", "Add vegetables and spices", "Mix semolina with water", "Cook until fluffy"] : ["Layer yogurt in bowl", "Add berries on top", "Sprinkle granola", "Drizzle honey", "Add nuts"],
            "calories": 310
          },
          {
            "type": "lunch",
            "time": "1:00 PM",
            "name": cuisine === "indian" ? "Rajma Rice" : "Mediterranean Wrap",
            "ingredients": cuisine === "indian" ? ["Kidney beans", "Basmati rice", "Onions", "Tomatoes", "Spices"] : ["Whole wheat wrap", "Hummus", "Cucumber", "Bell peppers", "Feta cheese"],
            "instructions": cuisine === "indian" ? ["Soak rajma overnight", "Cook with spices", "Prepare rice separately", "Serve together", "Garnish with coriander"] : ["Spread hummus on wrap", "Add chopped vegetables", "Sprinkle feta cheese", "Roll tightly", "Slice and serve"],
            "calories": 435
          },
          {
            "type": "dinner",
            "time": "7:00 PM",
            "name": cuisine === "indian" ? "Palak Paneer with Roti" : "Grilled Salmon with Quinoa",
            "ingredients": cuisine === "indian" ? ["Spinach", "Paneer", "Whole wheat flour", "Onions", "Garlic"] : ["Salmon fillet", "Quinoa", "Lemon", "Herbs", "Asparagus"],
            "instructions": cuisine === "indian" ? ["Blanch spinach", "Make paneer curry", "Prepare fresh rotis", "Serve hot together"] : ["Season salmon", "Grill until cooked", "Cook quinoa", "Steam asparagus", "Serve with lemon"],
            "calories": 372
          }
        ]
      },
      {
        "day": "Wednesday",
        "meals": [
          {
            "type": "breakfast",
            "time": "8:00 AM",
            "name": cuisine === "indian" ? "Idli with Sambar" : "Oatmeal with Fruits",
            "ingredients": cuisine === "indian" ? ["Idli batter", "Lentils", "Vegetables", "Tamarind", "Spices"] : ["Rolled oats", "Banana", "Berries", "Almonds", "Cinnamon"],
            "instructions": cuisine === "indian" ? ["Steam idlis", "Prepare sambar", "Serve hot together", "Add coconut chutney"] : ["Cook oats with water", "Add sliced fruits", "Sprinkle nuts", "Add cinnamon", "Serve warm"],
            "calories": 300
          },
          {
            "type": "lunch",
            "time": "1:00 PM",
            "name": cuisine === "indian" ? "Chole Bhature" : "Caesar Salad with Chicken",
            "ingredients": cuisine === "indian" ? ["Chickpeas", "All-purpose flour", "Yogurt", "Spices", "Oil"] : ["Romaine lettuce", "Grilled chicken", "Croutons", "Parmesan", "Caesar dressing"],
            "instructions": cuisine === "indian" ? ["Cook spiced chickpeas", "Make bhature dough", "Deep fry bhature", "Serve together hot"] : ["Grill chicken breast", "Chop lettuce", "Add croutons and cheese", "Toss with dressing"],
            "calories": 420
          },
          {
            "type": "dinner",
            "time": "7:00 PM",
            "name": cuisine === "indian" ? "Vegetable Biryani" : "Stuffed Bell Peppers",
            "ingredients": cuisine === "indian" ? ["Basmati rice", "Mixed vegetables", "Saffron", "Ghee", "Biryani spices"] : ["Bell peppers", "Ground turkey", "Brown rice", "Tomato sauce", "Herbs"],
            "instructions": cuisine === "indian" ? ["Layer rice and vegetables", "Add saffron milk", "Cook on low heat", "Serve with raita"] : ["Hollow bell peppers", "Mix turkey and rice", "Stuff peppers", "Bake until tender"],
            "calories": 384
          }
        ]
      },
      {
        "day": "Thursday",
        "meals": [
          {
            "type": "breakfast",
            "time": "8:00 AM",
            "name": cuisine === "indian" ? "Paratha with Curd" : "Smoothie Bowl",
            "ingredients": cuisine === "indian" ? ["Whole wheat flour", "Potatoes", "Yogurt", "Spices", "Ghee"] : ["Mixed berries", "Banana", "Greek yogurt", "Granola", "Honey"],
            "instructions": cuisine === "indian" ? ["Make potato filling", "Roll paratha", "Cook on griddle", "Serve with curd"] : ["Blend fruits with yogurt", "Pour in bowl", "Top with granola", "Drizzle honey"],
            "calories": 330
          },
          {
            "type": "lunch",
            "time": "1:00 PM",
            "name": cuisine === "indian" ? "Sambar Rice" : "Turkey Club Sandwich",
            "ingredients": cuisine === "indian" ? ["Rice", "Lentils", "Vegetables", "Tamarind", "Curry leaves"] : ["Whole grain bread", "Turkey slices", "Lettuce", "Tomato", "Avocado"],
            "instructions": cuisine === "indian" ? ["Cook rice separately", "Prepare sambar", "Mix together", "Serve hot"] : ["Layer turkey and vegetables", "Add condiments", "Stack layers", "Cut diagonally"],
            "calories": 450
          },
          {
            "type": "dinner",
            "time": "7:00 PM",
            "name": cuisine === "indian" ? "Kadhi Chawal" : "Baked Cod with Vegetables",
            "ingredients": cuisine === "indian" ? ["Chickpea flour", "Yogurt", "Rice", "Spices", "Ginger"] : ["Cod fillet", "Broccoli", "Carrots", "Olive oil", "Herbs"],
            "instructions": cuisine === "indian" ? ["Make kadhi base", "Add pakoras", "Cook rice", "Serve together"] : ["Season cod fillet", "Bake with vegetables", "Drizzle olive oil", "Serve hot"],
            "calories": 396
          }
        ]
      },
      {
        "day": "Friday",
        "meals": [
          {
            "type": "breakfast",
            "time": "8:00 AM",
            "name": cuisine === "indian" ? "Dosa with Chutney" : "Pancakes with Berries",
            "ingredients": cuisine === "indian" ? ["Dosa batter", "Coconut", "Green chilies", "Ginger", "Curry leaves"] : ["Whole wheat flour", "Eggs", "Milk", "Fresh berries", "Maple syrup"],
            "instructions": cuisine === "indian" ? ["Heat griddle", "Spread batter thin", "Cook until crispy", "Serve with chutney"] : ["Mix pancake batter", "Cook on griddle", "Stack pancakes", "Top with berries"],
            "calories": 340
          },
          {
            "type": "lunch",
            "time": "1:00 PM",
            "name": cuisine === "indian" ? "Pav Bhaji" : "Asian Stir Fry",
            "ingredients": cuisine === "indian" ? ["Mixed vegetables", "Pav bread", "Butter", "Spices", "Onions"] : ["Mixed vegetables", "Brown rice", "Soy sauce", "Ginger", "Garlic"],
            "instructions": cuisine === "indian" ? ["Mash cooked vegetables", "Add spices", "Butter pav bread", "Serve together"] : ["Stir fry vegetables", "Add sauces", "Serve over rice", "Garnish with herbs"],
            "calories": 465
          },
          {
            "type": "dinner",
            "time": "7:00 PM",
            "name": cuisine === "indian" ? "Aloo Gobi with Roti" : "Grilled Chicken Breast",
            "ingredients": cuisine === "indian" ? ["Potatoes", "Cauliflower", "Whole wheat flour", "Spices", "Oil"] : ["Chicken breast", "Sweet potato", "Green beans", "Olive oil", "Rosemary"],
            "instructions": cuisine === "indian" ? ["Cut vegetables", "Cook with spices", "Make fresh rotis", "Serve hot"] : ["Marinate chicken", "Grill until done", "Roast vegetables", "Serve together"],
            "calories": 408
          }
        ]
      },
      {
        "day": "Saturday",
        "meals": [
          {
            "type": "breakfast",
            "time": "8:00 AM",
            "name": cuisine === "indian" ? "Poori with Aloo Sabzi" : "French Toast",
            "ingredients": cuisine === "indian" ? ["All-purpose flour", "Potatoes", "Spices", "Oil", "Cumin seeds"] : ["Bread slices", "Eggs", "Milk", "Cinnamon", "Fresh fruits"],
            "instructions": cuisine === "indian" ? ["Make puori dough", "Deep fry pooris", "Cook spiced potatoes", "Serve together"] : ["Dip bread in egg mixture", "Cook on griddle", "Serve with fruits", "Add maple syrup"],
            "calories": 350
          },
          {
            "type": "lunch",
            "time": "1:00 PM",
            "name": cuisine === "indian" ? "Pulao with Raita" : "Grilled Vegetable Wrap",
            "ingredients": cuisine === "indian" ? ["Basmati rice", "Mixed vegetables", "Yogurt", "Spices", "Mint"] : ["Tortilla wrap", "Grilled vegetables", "Hummus", "Spinach", "Cheese"],
            "instructions": cuisine === "indian" ? ["Cook rice with vegetables", "Prepare cooling raita", "Serve together", "Garnish with mint"] : ["Grill mixed vegetables", "Spread hummus on wrap", "Add vegetables", "Roll and serve"],
            "calories": 480
          },
          {
            "type": "dinner",
            "time": "7:00 PM",
            "name": cuisine === "indian" ? "Dal Makhani with Naan" : "Beef Stir Fry",
            "ingredients": cuisine === "indian" ? ["Black lentils", "Butter", "Cream", "Naan bread", "Spices"] : ["Lean beef strips", "Mixed vegetables", "Brown rice", "Soy sauce", "Ginger"],
            "instructions": cuisine === "indian" ? ["Cook lentils slowly", "Add cream and butter", "Warm naan bread", "Serve rich and creamy"] : ["Marinate beef strips", "Stir fry quickly", "Add vegetables", "Serve over rice"],
            "calories": 420
          }
        ]
      },
      {
        "day": "Sunday",
        "meals": [
          {
            "type": "breakfast",
            "time": "8:00 AM",
            "name": cuisine === "indian" ? "Masala Chai with Biscuits" : "Eggs Benedict",
            "ingredients": cuisine === "indian" ? ["Tea leaves", "Milk", "Spices", "Whole wheat biscuits", "Butter"] : ["English muffins", "Eggs", "Ham", "Hollandaise sauce", "Spinach"],
            "instructions": cuisine === "indian" ? ["Boil tea with spices", "Add milk and sugar", "Serve with biscuits", "Enjoy hot"] : ["Toast muffins", "Poach eggs", "Layer with ham", "Top with sauce"],
            "calories": 360
          },
          {
            "type": "lunch",
            "time": "1:00 PM",
            "name": cuisine === "indian" ? "South Indian Thali" : "Sunday Roast",
            "ingredients": cuisine === "indian" ? ["Rice", "Sambar", "Rasam", "Vegetables", "Papad"] : ["Roast beef", "Yorkshire pudding", "Roasted vegetables", "Gravy", "Potatoes"],
            "instructions": cuisine === "indian" ? ["Prepare multiple dishes", "Serve on banana leaf", "Include variety of flavors", "Enjoy traditional meal"] : ["Roast beef slowly", "Prepare Yorkshire pudding", "Roast vegetables", "Make gravy"],
            "calories": 495
          },
          {
            "type": "dinner",
            "time": "7:00 PM",
            "name": cuisine === "indian" ? "Biryani with Shorba" : "Pasta Primavera",
            "ingredients": cuisine === "indian" ? ["Basmati rice", "Chicken/Vegetables", "Saffron", "Yogurt", "Spices"] : ["Whole wheat pasta", "Mixed vegetables", "Olive oil", "Garlic", "Parmesan"],
            "instructions": cuisine === "indian" ? ["Layer rice and protein", "Cook with saffron", "Serve with soup", "Garnish with mint"] : ["Cook pasta al dente", "Sauté vegetables", "Toss together", "Add cheese"],
            "calories": 432
          }
        ]
      }
    ]
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return sampleMealPlan;
}