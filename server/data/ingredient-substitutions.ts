// Country-Specific Ingredient Substitution Database
// This database maps global ingredients to locally available, culturally appropriate alternatives

export interface IngredientSubstitution {
  original: string;
  substitutes: {
    ingredient: string;
    local_name?: string; // Local/cultural name
    reason: string;
    nutrition_notes?: string;
    availability: 'common' | 'seasonal' | 'rare'; // How easily available
    cost_tier: 1 | 2 | 3; // 1=budget, 2=moderate, 3=premium
    household_measures?: { // Common household measures for this region
      unit: string;
      size_ml?: number;
      size_g?: number;
    }[];
  }[];
}

export interface CountryData {
  country: string;
  regions?: string[];
  currency: string;
  common_cooking_methods: string[];
  staple_grains: string[];
  common_proteins: string[];
  // Pantry whitelist - most commonly used and accessible ingredients
  pantry_staples: {
    category: string;
    items: {
      name: string;
      local_name?: string;
      availability: 'common' | 'seasonal' | 'rare';
      cost_tier: 1 | 2 | 3;
      household_measures?: {
        unit: string;
        size_ml?: number;
        size_g?: number;
      }[];
    }[];
  }[];
  substitutions: IngredientSubstitution[];
}

export const countryIngredientDatabase: CountryData[] = [
  {
    country: "India",
    regions: ["North India", "South India", "West India", "East India", "Northeast India"],
    currency: "INR",
    common_cooking_methods: ["pressure_cooker", "tandoor", "kadai", "tawa", "steaming"],
    staple_grains: ["rice", "wheat", "millet", "jowar", "bajra"],
    common_proteins: ["dal", "paneer", "chicken", "fish", "eggs"],
    pantry_staples: [
      {
        category: "grains",
        items: [
          { name: "rice", local_name: "चावल", availability: "common", cost_tier: 1, household_measures: [{ unit: "katori", size_ml: 150 }, { unit: "cup", size_ml: 240 }] },
          { name: "wheat flour", local_name: "आटा", availability: "common", cost_tier: 1, household_measures: [{ unit: "cup", size_g: 120 }] },
          { name: "jowar", local_name: "ज्वार", availability: "common", cost_tier: 1, household_measures: [{ unit: "cup", size_g: 120 }] }
        ]
      },
      {
        category: "proteins",
        items: [
          { name: "toor dal", local_name: "अरहर दाल", availability: "common", cost_tier: 1, household_measures: [{ unit: "katori", size_ml: 150 }] },
          { name: "moong dal", local_name: "मूंग दाल", availability: "common", cost_tier: 1, household_measures: [{ unit: "katori", size_ml: 150 }] },
          { name: "paneer", local_name: "पनीर", availability: "common", cost_tier: 2, household_measures: [{ unit: "piece", size_g: 100 }] },
          { name: "chicken", local_name: "मुर्गा", availability: "common", cost_tier: 2, household_measures: [{ unit: "piece", size_g: 150 }] }
        ]
      },
      {
        category: "vegetables",
        items: [
          { name: "onion", local_name: "प्याज", availability: "common", cost_tier: 1, household_measures: [{ unit: "medium", size_g: 100 }] },
          { name: "tomato", local_name: "टमाटर", availability: "common", cost_tier: 1, household_measures: [{ unit: "medium", size_g: 80 }] },
          { name: "spinach", local_name: "पालक", availability: "common", cost_tier: 1, household_measures: [{ unit: "bunch", size_g: 200 }] },
          { name: "potato", local_name: "आलू", availability: "common", cost_tier: 1, household_measures: [{ unit: "medium", size_g: 120 }] }
        ]
      },
      {
        category: "spices",
        items: [
          { name: "turmeric", local_name: "हल्दी", availability: "common", cost_tier: 1, household_measures: [{ unit: "tsp", size_g: 2 }] },
          { name: "cumin", local_name: "जीरा", availability: "common", cost_tier: 1, household_measures: [{ unit: "tsp", size_g: 2 }] },
          { name: "coriander", local_name: "धनिया", availability: "common", cost_tier: 1, household_measures: [{ unit: "tsp", size_g: 2 }] }
        ]
      }
    ],
    substitutions: [
      {
        original: "quinoa",
        substitutes: [
          { ingredient: "brown rice", local_name: "भूरा चावल", reason: "Local availability, similar nutrition", availability: "common", cost_tier: 1, household_measures: [{ unit: "katori", size_ml: 150 }] },
          { ingredient: "daliya", local_name: "दलिया", reason: "Traditional Indian grain, high fiber", availability: "common", cost_tier: 1, household_measures: [{ unit: "katori", size_ml: 150 }] },
          { ingredient: "sama rice", local_name: "समा चावल", reason: "Ancient Indian grain, gluten-free", availability: "seasonal", cost_tier: 2, household_measures: [{ unit: "katori", size_ml: 150 }] }
        ]
      },
      {
        original: "avocado",
        substitutes: [
          { ingredient: "cucumber with ghee", local_name: "खीरा घी के साथ", reason: "Local availability, healthy fats", availability: "common", cost_tier: 1, household_measures: [{ unit: "medium", size_g: 150 }] },
          { ingredient: "raw mango", local_name: "कच्चा आम", reason: "Traditional Indian ingredient", availability: "seasonal", cost_tier: 1, household_measures: [{ unit: "medium", size_g: 200 }] }
        ]
      },
      {
        original: "salmon",
        substitutes: [
          { ingredient: "pomfret", local_name: "पॉम्फ्रेट", reason: "Local fish, high omega-3", availability: "common", cost_tier: 3, household_measures: [{ unit: "piece", size_g: 200 }] },
          { ingredient: "mackerel", local_name: "बांगड़ा", reason: "Affordable local fish, rich in nutrients", availability: "common", cost_tier: 2, household_measures: [{ unit: "piece", size_g: 150 }] },
          { ingredient: "paneer", local_name: "पनीर", reason: "Vegetarian protein alternative", availability: "common", cost_tier: 2, household_measures: [{ unit: "piece", size_g: 100 }] }
        ]
      },
      {
        original: "kale",
        substitutes: [
          { ingredient: "spinach", local_name: "पालक", reason: "Easily available, similar nutrients", availability: "common", cost_tier: 1, household_measures: [{ unit: "bunch", size_g: 200 }] },
          { ingredient: "methi leaves", local_name: "मेथी पत्ता", reason: "Traditional Indian green, high nutrients", availability: "common", cost_tier: 1, household_measures: [{ unit: "bunch", size_g: 150 }] },
          { ingredient: "sarson ka saag", local_name: "सरसों का साग", reason: "Regional specialty, winter vegetable", availability: "seasonal", cost_tier: 1, household_measures: [{ unit: "bunch", size_g: 250 }] }
        ]
      },
      {
        original: "olive oil",
        substitutes: [
          { ingredient: "coconut oil", local_name: "नारियल तेल", reason: "Traditional cooking oil, healthy fats", availability: "common", cost_tier: 2, household_measures: [{ unit: "tbsp", size_ml: 15 }] },
          { ingredient: "mustard oil", local_name: "सरसों का तेल", reason: "Regional preference, antimicrobial properties", availability: "common", cost_tier: 1, household_measures: [{ unit: "tbsp", size_ml: 15 }] },
          { ingredient: "ghee", local_name: "घी", reason: "Traditional clarified butter, cultural preference", availability: "common", cost_tier: 2, household_measures: [{ unit: "tsp", size_ml: 5 }] }
        ]
      },
      {
        original: "greek yogurt",
        substitutes: [
          { ingredient: "hung curd", local_name: "फेंटा दही", reason: "Traditional Indian equivalent", availability: "common", cost_tier: 1, household_measures: [{ unit: "katori", size_ml: 150 }] },
          { ingredient: "fresh curd", local_name: "ताजा दही", reason: "Daily Indian staple, probiotic benefits", availability: "common", cost_tier: 1, household_measures: [{ unit: "katori", size_ml: 150 }] }
        ]
      },
      {
        original: "blueberries",
        substitutes: [
          { ingredient: "jamun", local_name: "जामुन", reason: "Local seasonal fruit, antioxidants", availability: "seasonal", cost_tier: 1, household_measures: [{ unit: "cup", size_g: 150 }] },
          { ingredient: "pomegranate", local_name: "अनार", reason: "Available year-round, high antioxidants", availability: "common", cost_tier: 2, household_measures: [{ unit: "medium", size_g: 200 }] },
          { ingredient: "grapes", local_name: "अंगूर", reason: "Affordable local fruit", availability: "common", cost_tier: 1, household_measures: [{ unit: "cup", size_g: 120 }] }
        ]
      }
    ]
  },
  
  {
    country: "USA",
    regions: ["Northeast", "Southeast", "Midwest", "Southwest", "West Coast"],
    currency: "USD",
    common_cooking_methods: ["oven", "stovetop", "grill", "microwave", "slow_cooker"],
    staple_grains: ["wheat", "rice", "oats", "corn"],
    common_proteins: ["chicken", "beef", "pork", "fish", "turkey"],
    substitutions: [
      {
        original: "ghee",
        substitutes: [
          { ingredient: "butter", reason: "Similar taste and cooking properties" },
          { ingredient: "coconut oil", reason: "Healthy alternative, similar smoking point" }
        ]
      },
      {
        original: "paneer",
        substitutes: [
          { ingredient: "cottage cheese", reason: "Similar texture and protein content" },
          { ingredient: "firm tofu", reason: "Vegan alternative, similar versatility" },
          { ingredient: "halloumi cheese", reason: "Similar cooking properties" }
        ]
      },
      {
        original: "curry leaves",
        substitutes: [
          { ingredient: "bay leaves", reason: "Similar aromatic properties" },
          { ingredient: "basil leaves", reason: "Fresh herb alternative" }
        ]
      }
    ]
  },

  {
    country: "Mexico",
    regions: ["Northern Mexico", "Central Mexico", "Southern Mexico", "Coastal Mexico"],
    currency: "MXN",
    common_cooking_methods: ["comal", "clay_pot", "steaming", "grilling"],
    staple_grains: ["corn", "rice", "wheat"],
    common_proteins: ["beans", "chicken", "pork", "fish", "cheese"],
    substitutions: [
      {
        original: "quinoa",
        substitutes: [
          { ingredient: "amaranth (amaranto)", reason: "Traditional Mexican grain, similar nutrition" },
          { ingredient: "brown rice", reason: "Affordable and nutritious" }
        ]
      },
      {
        original: "greek yogurt",
        substitutes: [
          { ingredient: "crema mexicana", reason: "Traditional Mexican dairy product" },
          { ingredient: "queso fresco", reason: "Local fresh cheese, high protein" }
        ]
      }
    ]
  },

  {
    country: "UK",
    regions: ["England", "Scotland", "Wales", "Northern Ireland"],
    currency: "GBP",
    common_cooking_methods: ["oven", "stovetop", "grill", "steaming"],
    staple_grains: ["wheat", "oats", "rice"],
    common_proteins: ["chicken", "beef", "lamb", "fish", "eggs"],
    substitutions: [
      {
        original: "cilantro",
        substitutes: [
          { ingredient: "coriander", reason: "Same herb, different name" },
          { ingredient: "parsley", reason: "Similar fresh herb flavor" }
        ]
      },
      {
        original: "eggplant",
        substitutes: [
          { ingredient: "aubergine", reason: "Same vegetable, local name" }
        ]
      }
    ]
  },

  {
    country: "China",
    regions: ["Northern China", "Southern China", "Eastern China", "Western China"],
    currency: "CNY",
    common_cooking_methods: ["wok", "steaming", "braising", "stir_frying"],
    staple_grains: ["rice", "wheat", "millet"],
    common_proteins: ["tofu", "pork", "chicken", "fish", "eggs"],
    substitutions: [
      {
        original: "quinoa",
        substitutes: [
          { ingredient: "brown rice", reason: "Traditional staple, similar nutrition" },
          { ingredient: "millet", reason: "Ancient Chinese grain" }
        ]
      },
      {
        original: "avocado",
        substitutes: [
          { ingredient: "cucumber", reason: "Similar texture, widely available" },
          { ingredient: "chinese cabbage", reason: "Local vegetable, good nutrition" }
        ]
      }
    ]
  }
];

// Helper function to get substitutions for a specific ingredient in a country
export function getIngredientSubstitutions(
  ingredient: string, 
  country: string, 
  region?: string
): IngredientSubstitution | null {
  const countryData = countryIngredientDatabase.find(c => 
    c.country.toLowerCase() === country.toLowerCase()
  );
  
  if (!countryData) return null;
  
  const substitution = countryData.substitutions.find(s => 
    s.original.toLowerCase().includes(ingredient.toLowerCase()) ||
    ingredient.toLowerCase().includes(s.original.toLowerCase())
  );
  
  return substitution || null;
}

// Get all available countries
export function getAvailableCountries(): string[] {
  return countryIngredientDatabase.map(c => c.country);
}

// Get regions for a specific country
export function getCountryRegions(country: string): string[] {
  const countryData = countryIngredientDatabase.find(c => 
    c.country.toLowerCase() === country.toLowerCase()
  );
  
  return countryData?.regions || [];
}

// Get cooking methods for a country
export function getCookingMethods(country: string): string[] {
  const countryData = countryIngredientDatabase.find(c => 
    c.country.toLowerCase() === country.toLowerCase()
  );
  
  return countryData?.common_cooking_methods || [];
}

// Get staple grains for a country
export function getStapleGrains(country: string): string[] {
  const countryData = countryIngredientDatabase.find(c => 
    c.country.toLowerCase() === country.toLowerCase()
  );
  
  return countryData?.staple_grains || [];
}