// Country-Specific Ingredient Substitution Database
// This database maps global ingredients to locally available, culturally appropriate alternatives

export interface IngredientSubstitution {
  original: string;
  substitutes: {
    ingredient: string;
    reason: string;
    nutrition_notes?: string;
  }[];
}

export interface CountryData {
  country: string;
  regions?: string[];
  currency: string;
  common_cooking_methods: string[];
  staple_grains: string[];
  common_proteins: string[];
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
    substitutions: [
      {
        original: "quinoa",
        substitutes: [
          { ingredient: "brown rice", reason: "Local availability, similar nutrition" },
          { ingredient: "daliya (broken wheat)", reason: "Traditional Indian grain, high fiber" },
          { ingredient: "sama rice (barnyard millet)", reason: "Ancient Indian grain, gluten-free" }
        ]
      },
      {
        original: "avocado",
        substitutes: [
          { ingredient: "cucumber with olive oil", reason: "Local availability, similar texture" },
          { ingredient: "raw mango with oil", reason: "Traditional Indian ingredient, healthy fats" }
        ]
      },
      {
        original: "salmon",
        substitutes: [
          { ingredient: "pomfret", reason: "Local fish, high omega-3" },
          { ingredient: "mackerel (bangda)", reason: "Affordable local fish, rich in nutrients" },
          { ingredient: "paneer", reason: "Vegetarian protein alternative" }
        ]
      },
      {
        original: "kale",
        substitutes: [
          { ingredient: "spinach (palak)", reason: "Easily available, similar nutrients" },
          { ingredient: "methi leaves (fenugreek)", reason: "Traditional Indian green, high nutrients" },
          { ingredient: "sarson ka saag", reason: "Regional specialty, winter vegetable" }
        ]
      },
      {
        original: "olive oil",
        substitutes: [
          { ingredient: "coconut oil", reason: "Traditional cooking oil, healthy fats" },
          { ingredient: "mustard oil", reason: "Regional preference, antimicrobial properties" },
          { ingredient: "ghee", reason: "Traditional clarified butter, cultural preference" }
        ]
      },
      {
        original: "greek yogurt",
        substitutes: [
          { ingredient: "hung curd (chakka)", reason: "Traditional Indian equivalent" },
          { ingredient: "fresh curd", reason: "Daily Indian staple, probiotic benefits" }
        ]
      },
      {
        original: "blueberries",
        substitutes: [
          { ingredient: "jamun", reason: "Local seasonal fruit, antioxidants" },
          { ingredient: "pomegranate", reason: "Available year-round, high antioxidants" },
          { ingredient: "grapes", reason: "Affordable local fruit" }
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