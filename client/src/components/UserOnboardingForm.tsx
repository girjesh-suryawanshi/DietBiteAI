import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, User, Activity, Globe, Heart, Coffee, MapPin, ChefHat } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const userOnboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(13, "Must be at least 13 years old").max(120, "Invalid age"),
  gender: z.enum(["male", "female", "other"]),
  height_cm: z.number().min(100, "Height must be at least 100cm").max(250, "Invalid height"),
  weight_kg: z.number().min(30, "Weight must be at least 30kg").max(300, "Invalid weight"),
  activity_level: z.enum(["sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"]),
  
  // Location and cultural preferences
  country: z.string().min(1, "Please select your country"),
  region: z.string().optional(),
  city: z.string().optional(),
  cultural_background: z.array(z.string()).default([]),
  cuisine_familiarity: z.array(z.string()).default([]),
  cooking_methods: z.array(z.string()).default([]),
  local_ingredients_preference: z.boolean().default(true),
  budget_preference: z.enum(["budget_friendly", "moderate", "premium"]).optional(),
  
  // Diet and health
  food_preference: z.enum(["vegetarian", "non_vegetarian", "vegan", "keto", "paleo", "mediterranean"]),
  health_conditions: z.array(z.string()).default([]),
  foods_to_include: z.array(z.string()).default([]),
  
  // Backward compatibility
  country_region: z.string().optional(),
});

type UserOnboardingData = z.infer<typeof userOnboardingSchema>;

interface UserOnboardingFormProps {
  onSubmit: (data: UserOnboardingData) => void;
  isLoading?: boolean;
}

const STEPS = [
  { id: 1, title: "Personal Info", icon: User, description: "Tell us about yourself" },
  { id: 2, title: "Physical Stats", icon: Activity, description: "Your body metrics" },
  { id: 3, title: "Location", icon: MapPin, description: "Where are you from?" },
  { id: 4, title: "Cultural Taste", icon: ChefHat, description: "Your cooking style" },
  { id: 5, title: "Lifestyle", icon: Globe, description: "Diet & activity level" },
  { id: 6, title: "Health", icon: Heart, description: "Health conditions" },
  { id: 7, title: "Preferences", icon: Coffee, description: "Foods you love" },
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
  { value: "lightly_active", label: "Lightly Active", description: "Light exercise 1-3 days/week" },
  { value: "moderately_active", label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
  { value: "very_active", label: "Very Active", description: "Hard exercise 6-7 days/week" },
  { value: "extremely_active", label: "Extremely Active", description: "Very hard exercise, physical job" },
];

// Location data
const COUNTRIES = [
  { value: "India", label: "India", regions: ["North India", "South India", "West India", "East India", "Northeast India"] },
  { value: "USA", label: "United States", regions: ["Northeast", "Southeast", "Midwest", "Southwest", "West Coast"] },
  { value: "UK", label: "United Kingdom", regions: ["England", "Scotland", "Wales", "Northern Ireland"] },
  { value: "Canada", label: "Canada", regions: ["Ontario", "Quebec", "British Columbia", "Alberta", "Other Provinces"] },
  { value: "Australia", label: "Australia", regions: ["New South Wales", "Victoria", "Queensland", "Western Australia", "Other States"] },
  { value: "Mexico", label: "Mexico", regions: ["Northern Mexico", "Central Mexico", "Southern Mexico", "Coastal Mexico"] },
  { value: "China", label: "China", regions: ["Northern China", "Southern China", "Eastern China", "Western China"] },
  { value: "Germany", label: "Germany", regions: ["Bavaria", "North Rhine-Westphalia", "Baden-Württemberg", "Other States"] },
  { value: "France", label: "France", regions: ["Île-de-France", "Provence", "Normandy", "Aquitaine", "Other Regions"] },
  { value: "Italy", label: "Italy", regions: ["Northern Italy", "Central Italy", "Southern Italy", "Islands"] },
  { value: "Other", label: "Other Country", regions: [] }
];

// Cultural backgrounds by region
const CULTURAL_BACKGROUNDS = {
  India: ["North Indian", "South Indian", "Punjabi", "Bengali", "Gujarati", "Maharashtrian", "Tamil", "Kerala", "Rajasthani", "Other"],
  USA: ["American", "Mexican-American", "Italian-American", "Asian-American", "African-American", "Native American", "Other"],
  China: ["Han Chinese", "Cantonese", "Sichuan", "Hunan", "Beijing", "Shanghai", "Other"],
  Mexico: ["Mexican", "Maya", "Aztec Heritage", "Spanish Influence", "Regional Mexican", "Other"],
  Other: ["Local Traditional", "Mixed Heritage", "International", "Other"]
};

// Cuisine familiarity options
const CUISINES = [
  { value: "indian", label: "Indian Cuisine" },
  { value: "american", label: "American Cuisine" },
  { value: "chinese", label: "Chinese Cuisine" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "italian", label: "Italian Cuisine" },
  { value: "mexican", label: "Mexican Cuisine" },
  { value: "middle_eastern", label: "Middle Eastern" },
  { value: "japanese", label: "Japanese Cuisine" },
  { value: "thai", label: "Thai Cuisine" },
  { value: "french", label: "French Cuisine" },
];

// Cooking methods
const COOKING_METHODS = [
  { value: "pressure_cooker", label: "Pressure Cooker" },
  { value: "stovetop", label: "Stovetop Cooking" },
  { value: "oven", label: "Oven Baking" },
  { value: "wok", label: "Wok/Stir Fry" },
  { value: "grill", label: "Grilling" },
  { value: "steaming", label: "Steaming" },
  { value: "tandoor", label: "Tandoor/Clay Oven" },
  { value: "slow_cooker", label: "Slow Cooker" },
  { value: "microwave", label: "Microwave" },
  { value: "air_fryer", label: "Air Fryer" },
];

const HEALTH_CONDITIONS = [
  { id: "diabetes", label: "Diabetes" },
  { id: "high_blood_pressure", label: "High Blood Pressure" },
  { id: "thyroid", label: "Thyroid" },
  { id: "pcos", label: "PCOS" },
  { id: "none", label: "None" },
  { id: "other", label: "Other" },
];

const FOODS_TO_INCLUDE = [
  { id: "tea", label: "Tea" },
  { id: "coffee", label: "Coffee" },
  { id: "dark_chocolate", label: "A piece of dark chocolate" },
  { id: "one_cookie_a_day", label: "One cookie a day" },
  { id: "other", label: "Other" },
];

export function UserOnboardingForm({ onSubmit, isLoading = false }: UserOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [foodsToInclude, setFoodsToInclude] = useState<string[]>([]);
  const [customHealthCondition, setCustomHealthCondition] = useState("");
  const [customFoodToInclude, setCustomFoodToInclude] = useState("");
  
  // New cultural and location state
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [culturalBackgrounds, setCulturalBackgrounds] = useState<string[]>([]);
  const [cuisineFamiliarity, setCuisineFamiliarity] = useState<string[]>([]);
  const [cookingMethods, setCookingMethods] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<UserOnboardingData>({
    resolver: zodResolver(userOnboardingSchema),
    mode: "onChange",
    defaultValues: {
      health_conditions: [],
      foods_to_include: [],
      cultural_background: [],
      cuisine_familiarity: [],
      cooking_methods: [],
      local_ingredients_preference: true,
    },
  });

  const watchedValues = watch();
  const progress = (currentStep / STEPS.length) * 100;

  const nextStep = async () => {
    // For steps 4, 6, and 7, we don't need strict validation as they are optional
    if (currentStep === 4 || currentStep === 6 || currentStep === 7) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }
    
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate as any);
    
    if (isStepValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof UserOnboardingData)[] => {
    switch (step) {
      case 1: return ['name', 'age', 'gender'];
      case 2: return ['height_cm', 'weight_kg'];
      case 3: return ['country'];
      case 4: return []; // Cultural preferences are optional
      case 5: return ['activity_level', 'food_preference'];
      case 6: return []; // Health conditions are optional
      case 7: return []; // Food preferences are optional
      default: return [];
    }
  };

  const handleHealthConditionChange = (conditionId: string, checked: boolean) => {
    let newConditions;
    if (conditionId === 'none') {
      newConditions = checked ? ['none'] : [];
    } else if (conditionId === 'other') {
      newConditions = checked
        ? [...healthConditions.filter(c => c !== 'none'), 'other']
        : healthConditions.filter(c => c !== 'other' && c !== customHealthCondition.trim());
    } else {
      newConditions = checked
        ? [...healthConditions.filter(c => c !== 'none'), conditionId]
        : healthConditions.filter(c => c !== conditionId);
    }
    setHealthConditions(newConditions);
    setValue('health_conditions', newConditions);
  };

  const handleFoodIncludeChange = (foodId: string, checked: boolean) => {
    let newFoods;
    if (foodId === 'other') {
      newFoods = checked
        ? [...foodsToInclude, 'other']
        : foodsToInclude.filter(f => f !== 'other' && f !== customFoodToInclude.trim());
    } else {
      newFoods = checked
        ? [...foodsToInclude, foodId]
        : foodsToInclude.filter(f => f !== foodId);
    }
    setFoodsToInclude(newFoods);
    setValue('foods_to_include', newFoods);
  };

  const onFormSubmit = (data: UserOnboardingData) => {
    // Replace 'other' with custom values in final submission
    const finalHealthConditions = healthConditions.map(condition => 
      condition === 'other' && customHealthCondition.trim() ? customHealthCondition.trim() : condition
    ).filter(condition => condition !== 'other' || customHealthCondition.trim());

    const finalFoodsToInclude = foodsToInclude.map(food => 
      food === 'other' && customFoodToInclude.trim() ? customFoodToInclude.trim() : food
    ).filter(food => food !== 'other' || customFoodToInclude.trim());

    const finalData = {
      ...data,
      health_conditions: finalHealthConditions,
      foods_to_include: finalFoodsToInclude,
      cultural_background: culturalBackgrounds,
      cuisine_familiarity: cuisineFamiliarity,
      cooking_methods: cookingMethods,
      // Set backward compatibility field
      country_region: data.country,
    };
    onSubmit(finalData);
  };
  
  // Handle country selection and update available regions
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setValue('country', country);
    
    const countryData = COUNTRIES.find(c => c.value === country);
    setAvailableRegions(countryData?.regions || []);
    setValue('region', ''); // Reset region when country changes
  };
  
  // Handle cultural background changes
  const handleCulturalBackgroundChange = (background: string, checked: boolean) => {
    const newBackgrounds = checked
      ? [...culturalBackgrounds, background]
      : culturalBackgrounds.filter(b => b !== background);
    setCulturalBackgrounds(newBackgrounds);
    setValue('cultural_background', newBackgrounds);
  };
  
  // Handle cuisine familiarity changes
  const handleCuisineFamiliarityChange = (cuisine: string, checked: boolean) => {
    const newCuisines = checked
      ? [...cuisineFamiliarity, cuisine]
      : cuisineFamiliarity.filter(c => c !== cuisine);
    setCuisineFamiliarity(newCuisines);
    setValue('cuisine_familiarity', newCuisines);
  };
  
  // Handle cooking methods changes
  const handleCookingMethodsChange = (method: string, checked: boolean) => {
    const newMethods = checked
      ? [...cookingMethods, method]
      : cookingMethods.filter(m => m !== method);
    setCookingMethods(newMethods);
    setValue('cooking_methods', newMethods);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              <p className="text-gray-600 mt-2">Let's start with the basics</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("name")}
                  className="mt-1"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  {...register("age", { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => setValue("gender", value as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Physical Statistics</h2>
              <p className="text-gray-600 mt-2">Your body measurements help us personalize your plan</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="180"
                  {...register("height_cm", { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.height_cm && <p className="text-red-500 text-sm mt-1">{errors.height_cm.message}</p>}
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="75"
                  {...register("weight_kg", { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.weight_kg && <p className="text-red-500 text-sm mt-1">{errors.weight_kg.message}</p>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Where Are You Located?</h2>
              <p className="text-gray-600 mt-2">Help us suggest ingredients available in your area</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Country</Label>
                <Select onValueChange={handleCountryChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
              </div>

              {availableRegions.length > 0 && (
                <div>
                  <Label>Region/State (Optional)</Label>
                  <Select onValueChange={(value) => setValue("region", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRegions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="city">City (Optional)</Label>
                <Input
                  id="city"
                  placeholder="e.g., Mumbai, New York, London"
                  {...register("city")}
                  className="mt-1"
                />
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Why we ask:</strong> This helps us suggest locally available ingredients and culturally appropriate meals for your area.
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Cultural Food Background</h2>
              <p className="text-gray-600 mt-2">Tell us about your food culture and cooking preferences</p>
            </div>
            
            <div className="space-y-6">
              {selectedCountry && CULTURAL_BACKGROUNDS[selectedCountry as keyof typeof CULTURAL_BACKGROUNDS] && (
                <div>
                  <Label className="text-base font-medium">Cultural Background (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {CULTURAL_BACKGROUNDS[selectedCountry as keyof typeof CULTURAL_BACKGROUNDS].map((background) => (
                      <div key={background} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cultural-${background}`}
                          checked={culturalBackgrounds.includes(background)}
                          onCheckedChange={(checked) => handleCulturalBackgroundChange(background, checked as boolean)}
                        />
                        <Label htmlFor={`cultural-${background}`} className="text-sm font-normal">
                          {background}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-base font-medium">Cuisines You're Familiar With (Optional)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {CUISINES.map((cuisine) => (
                    <div key={cuisine.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cuisine-${cuisine.value}`}
                        checked={cuisineFamiliarity.includes(cuisine.value)}
                        onCheckedChange={(checked) => handleCuisineFamiliarityChange(cuisine.value, checked as boolean)}
                      />
                      <Label htmlFor={`cuisine-${cuisine.value}`} className="text-sm font-normal">
                        {cuisine.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Cooking Methods You Use (Optional)</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {COOKING_METHODS.map((method) => (
                    <div key={method.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cooking-${method.value}`}
                        checked={cookingMethods.includes(method.value)}
                        onCheckedChange={(checked) => handleCookingMethodsChange(method.value, checked as boolean)}
                      />
                      <Label htmlFor={`cooking-${method.value}`} className="text-sm font-normal">
                        {method.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Note:</strong> This step is optional. We'll use this information to make meal plans that feel familiar and use cooking methods you're comfortable with.
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Lifestyle & Diet Preferences</h2>
              <p className="text-gray-600 mt-2">Tell us about your activity level and dietary choices</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Activity Level</Label>
                <Select onValueChange={(value) => setValue("activity_level", value as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-sm text-gray-500">{level.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.activity_level && <p className="text-red-500 text-sm mt-1">{errors.activity_level.message}</p>}
              </div>

              <div>
                <Label>Diet Type</Label>
                <Select onValueChange={(value) => setValue("food_preference", value as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select diet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                    <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  </SelectContent>
                </Select>
                {errors.food_preference && <p className="text-red-500 text-sm mt-1">{errors.food_preference.message}</p>}
              </div>

              <div>
                <Label>Budget Preference (Optional)</Label>
                <Select onValueChange={(value) => setValue("budget_preference", value as any)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select budget preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget_friendly">Budget-Friendly</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="local_ingredients"
                  checked={watchedValues.local_ingredients_preference ?? true}
                  onCheckedChange={(checked) => setValue("local_ingredients_preference", checked as boolean)}
                />
                <Label htmlFor="local_ingredients" className="text-sm font-normal">
                  Prefer locally available ingredients (recommended)
                </Label>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Health Conditions</h2>
              <p className="text-gray-600 mt-2">Select any existing conditions. This will help tailor the plan further.</p>
            </div>
            
            <div className="space-y-3">
              {HEALTH_CONDITIONS.map((condition) => (
                <div key={condition.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={condition.id}
                      checked={healthConditions.includes(condition.id)}
                      onCheckedChange={(checked) => handleHealthConditionChange(condition.id, checked as boolean)}
                    />
                    <Label htmlFor={condition.id} className="text-sm font-normal">
                      {condition.label}
                    </Label>
                  </div>
                  {condition.id === 'other' && healthConditions.includes('other') && (
                    <div className="ml-6">
                      <Input
                        placeholder="Please specify your health condition"
                        value={customHealthCondition}
                        onChange={(e) => setCustomHealthCondition(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> This step is optional. You can skip it if you don't have any specific health conditions.
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Foods to Include</h2>
              <p className="text-gray-600 mt-2">Select any foods you must have. The AI will try to include them.</p>
            </div>
            
            <div className="space-y-3">
              {FOODS_TO_INCLUDE.map((food) => (
                <div key={food.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={food.id}
                      checked={foodsToInclude.includes(food.id)}
                      onCheckedChange={(checked) => handleFoodIncludeChange(food.id, checked as boolean)}
                    />
                    <Label htmlFor={food.id} className="text-sm font-normal">
                      {food.label}
                    </Label>
                  </div>
                  {food.id === 'other' && foodsToInclude.includes('other') && (
                    <div className="ml-6">
                      <Input
                        placeholder="Please specify the food you'd like to include"
                        value={customFoodToInclude}
                        onChange={(e) => setCustomFoodToInclude(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> This step is optional. You can skip it if you don't have specific food preferences to include.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between mb-8">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center space-y-2">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${isActive ? 'border-primary bg-primary text-white' : ''}
                ${isCompleted ? 'border-green-500 bg-green-500 text-white' : ''}
                ${!isActive && !isCompleted ? 'border-gray-300 text-gray-400' : ''}
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                  {step.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onFormSubmit)}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              {currentStep < STEPS.length ? (
                <div className="flex space-x-2">
                  {(currentStep === 4 || currentStep === 6 || currentStep === 7) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={nextStep}
                      className="flex items-center space-x-2"
                    >
                      <span>Skip</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 bg-primary hover:bg-green-600"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-primary hover:bg-green-600"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Setup</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}