import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, User, Activity, Globe, Heart, Coffee } from "lucide-react";
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
  country_region: z.string().min(1, "Please select a cuisine preference"),
  food_preference: z.enum(["vegetarian", "non_vegetarian", "vegan", "keto", "paleo", "mediterranean"]),
  health_conditions: z.array(z.string()).default([]),
  foods_to_include: z.array(z.string()).default([]),
});

type UserOnboardingData = z.infer<typeof userOnboardingSchema>;

interface UserOnboardingFormProps {
  onSubmit: (data: UserOnboardingData) => void;
  isLoading?: boolean;
}

const STEPS = [
  { id: 1, title: "Personal Info", icon: User, description: "Tell us about yourself" },
  { id: 2, title: "Physical Stats", icon: Activity, description: "Your body metrics" },
  { id: 3, title: "Lifestyle", icon: Globe, description: "Activity & preferences" },
  { id: 4, title: "Health & Diet", icon: Heart, description: "Health conditions" },
  { id: 5, title: "Food Include", icon: Coffee, description: "Foods you must have" },
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
  { value: "lightly_active", label: "Lightly Active", description: "Light exercise 1-3 days/week" },
  { value: "moderately_active", label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
  { value: "very_active", label: "Very Active", description: "Hard exercise 6-7 days/week" },
  { value: "extremely_active", label: "Extremely Active", description: "Very hard exercise, physical job" },
];

const CUISINES = [
  { value: "indian", label: "Indian Cuisine" },
  { value: "american", label: "American Cuisine" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "asian", label: "Asian Cuisine" },
  { value: "italian", label: "Italian Cuisine" },
  { value: "mexican", label: "Mexican Cuisine" },
  { value: "middle_eastern", label: "Middle Eastern" },
  { value: "european", label: "European Cuisine" },
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
    },
  });

  const watchedValues = watch();
  const progress = (currentStep / STEPS.length) * 100;

  const nextStep = async () => {
    // For steps 4 and 5, we don't need strict validation as they are optional
    if (currentStep === 4 || currentStep === 5) {
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
      case 3: return ['activity_level', 'country_region', 'food_preference'];
      case 4: return ['health_conditions'];
      case 5: return ['foods_to_include'];
      default: return [];
    }
  };

  const handleHealthConditionChange = (conditionId: string, checked: boolean) => {
    let newConditions;
    if (conditionId === 'none') {
      newConditions = checked ? ['none'] : [];
    } else if (conditionId === 'other') {
      if (checked && customHealthCondition.trim()) {
        newConditions = [...healthConditions.filter(c => c !== 'none'), customHealthCondition.trim()];
      } else {
        newConditions = healthConditions.filter(c => c !== customHealthCondition.trim());
      }
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
      if (checked && customFoodToInclude.trim()) {
        newFoods = [...foodsToInclude, customFoodToInclude.trim()];
      } else {
        newFoods = foodsToInclude.filter(f => f !== customFoodToInclude.trim());
      }
    } else {
      newFoods = checked
        ? [...foodsToInclude, foodId]
        : foodsToInclude.filter(f => f !== foodId);
    }
    setFoodsToInclude(newFoods);
    setValue('foods_to_include', newFoods);
  };

  const onFormSubmit = (data: UserOnboardingData) => {
    const finalData = {
      ...data,
      health_conditions: healthConditions,
      foods_to_include: foodsToInclude,
    };
    onSubmit(finalData);
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
              <h2 className="text-2xl font-bold text-gray-900">Lifestyle & Preferences</h2>
              <p className="text-gray-600 mt-2">Tell us about your activity level and food preferences</p>
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
                <Label>Country/Region Preference</Label>
                <Select onValueChange={(value) => setValue("country_region", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    {CUISINES.map((cuisine) => (
                      <SelectItem key={cuisine.value} value={cuisine.value}>
                        {cuisine.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country_region && <p className="text-red-500 text-sm mt-1">{errors.country_region.message}</p>}
              </div>

              <div>
                <Label>Food Preference</Label>
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
            </div>
          </div>
        );

      case 4:
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
                      checked={condition.id === 'other' ? healthConditions.includes(customHealthCondition) : healthConditions.includes(condition.id)}
                      onCheckedChange={(checked) => handleHealthConditionChange(condition.id, checked as boolean)}
                    />
                    <Label htmlFor={condition.id} className="text-sm font-normal">
                      {condition.label}
                    </Label>
                  </div>
                  {condition.id === 'other' && (
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
          </div>
        );

      case 5:
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
                      checked={food.id === 'other' ? foodsToInclude.includes(customFoodToInclude) : foodsToInclude.includes(food.id)}
                      onCheckedChange={(checked) => handleFoodIncludeChange(food.id, checked as boolean)}
                    />
                    <Label htmlFor={food.id} className="text-sm font-normal">
                      {food.label}
                    </Label>
                  </div>
                  {food.id === 'other' && (
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
                  {currentStep === 5 && (
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