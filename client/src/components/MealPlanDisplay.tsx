import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyMealPlan, DayMealPlan, Meal } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { RecipeAdjustmentModal } from "./RecipeAdjustmentModal";

interface MealPlanDisplayProps {
  mealPlan: WeeklyMealPlan;
  mealPlanId: string;
  onDownloadPDF: () => void;
  onShare: () => void;
  downloadLoading?: boolean;
}

const MEAL_COLORS = {
  breakfast: {
    bg: "bg-gradient-to-r from-orange-50 to-orange-100",
    icon: "fas fa-sun",
    iconBg: "bg-orange-500",
    textColor: "text-orange-600"
  },
  lunch: {
    bg: "bg-gradient-to-r from-green-50 to-green-100",
    icon: "fas fa-leaf",
    iconBg: "bg-green-500",
    textColor: "text-green-600"
  },
  dinner: {
    bg: "bg-gradient-to-r from-blue-50 to-blue-100",
    icon: "fas fa-moon",
    iconBg: "bg-blue-500",
    textColor: "text-blue-600"
  },
  snack: {
    bg: "bg-gradient-to-r from-purple-50 to-purple-100",
    icon: "fas fa-cookie-bite",
    iconBg: "bg-purple-500",
    textColor: "text-purple-600"
  }
};

const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export function MealPlanDisplay({ mealPlan, mealPlanId, onDownloadPDF, onShare, downloadLoading = false }: MealPlanDisplayProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentMealPlan, setCurrentMealPlan] = useState(mealPlan);
  const { toast } = useToast();

  const updateMeal = (dayIndex: number, mealIndex: number, updatedMeal: Meal) => {
    setCurrentMealPlan(prev => ({
      ...prev,
      days: prev.days.map((day, dIndex) => 
        dIndex === dayIndex 
          ? {
              ...day,
              meals: day.meals.map((meal, mIndex) => 
                mIndex === mealIndex ? updatedMeal : meal
              )
            }
          : day
      )
    }));
  };

  const currentDay = currentMealPlan.days[selectedDay];
  const totalDailyCalories = currentDay?.meals.reduce((sum, meal) => sum + meal.calories, 0) || 0;

  const handleDownload = async () => {
    try {
      // Call the PDF generation endpoint
      const response = await fetch(`/api/meal-plans/${mealPlanId}/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate download');
      }

      const data = await response.json();
      
      // Download PDF file
      const link = document.createElement('a');
      link.href = data.url;
      link.download = `fitbite-meal-plan-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started!",
        description: "Your meal plan PDF is being downloaded",
      });
      
      onDownloadPDF();
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to generate your meal plan file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My FitBite Meal Plan',
          text: `Check out my personalized ${mealPlan.goals.fitness_goal} meal plan from FitBite!`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying link
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Meal plan link has been copied to clipboard",
        });
      }
    } else {
      // Fallback to copying link
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Meal plan link has been copied to clipboard",
      });
    }
    onShare();
  };

  if (!currentDay) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-neutral-600">No meal plan data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white text-sm"></i>
            </div>
            <div>
              <span className="font-semibold text-neutral-800">Your Meal Plan</span>
              <p className="text-sm text-neutral-500 capitalize">
                {mealPlan.goals.fitness_goal.replace('_', ' ')} Journey
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleDownload}
              disabled={downloadLoading}
              variant="outline"
              className="text-neutral-700 hover:bg-neutral-50"
            >
              {downloadLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-download mr-2"></i>
                  Download
                </>
              )}
            </Button>
            <Button 
              onClick={handleShare}
              className="bg-secondary hover:bg-blue-600 text-white"
            >
              <i className="fas fa-share mr-2"></i>
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-neutral-800">This Week's Plan</h3>
          <div className="flex items-center space-x-4 text-sm text-neutral-500">
            <span><i className="fas fa-calendar mr-1"></i>{mealPlan.week_start}</span>
            <span><i className="fas fa-fire mr-1"></i>{mealPlan.total_daily_calories} cal/day target</span>
          </div>
        </div>

        {/* Day Tabs */}
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            {mealPlan.days.map((day, index) => (
              <TabsTrigger key={index} value={index.toString()} className="text-xs">
                {day.day.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {currentMealPlan.days.map((day, dayIndex) => {
            const dayTotalCalories = day.meals.reduce((sum, meal) => sum + meal.calories, 0);
            
            return (
              <TabsContent key={dayIndex} value={dayIndex.toString()} className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-neutral-800 capitalize">{day.day}</h3>
                  <div className="text-sm text-neutral-500">
                    <i className="fas fa-fire mr-1"></i>{dayTotalCalories} calories
                  </div>
                </div>
                
                <div className="space-y-4">
                  {day.meals.map((meal, mealIndex) => (
                    <MealCard 
                      key={mealIndex} 
                      meal={meal} 
                      mealPlanId={mealPlanId}
                      day={day.day}
                      mealIndex={mealIndex}
                      onMealUpdated={(updatedMeal) => updateMeal(dayIndex, mealIndex, updatedMeal)}
                    />
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Weekly Summary */}
        <Card className="bg-neutral-50 mt-8">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-neutral-800 mb-4">Weekly Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{mealPlan.total_daily_calories}</div>
                <div className="text-sm text-neutral-600">Daily Target</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">7</div>
                <div className="text-sm text-neutral-600">Days Planned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{mealPlan.days.length * 3}</div>
                <div className="text-sm text-neutral-600">Total Meals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 capitalize">{mealPlan.goals.cuisine}</div>
                <div className="text-sm text-neutral-600">Cuisine</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
}

interface MealCardProps {
  meal: Meal;
  mealPlanId: string;
  day: string;
  mealIndex: number;
  onMealUpdated: (updatedMeal: Meal) => void;
}

function MealCard({ meal, mealPlanId, day, mealIndex, onMealUpdated }: MealCardProps) {
  const mealColor = MEAL_COLORS[meal.type as keyof typeof MEAL_COLORS] || MEAL_COLORS.snack;

  return (
    <div className={`${mealColor.bg} rounded-xl p-6 relative`}>
      {/* Adjustment button */}
      <div className="absolute top-4 right-4">
        <RecipeAdjustmentModal
          meal={meal}
          mealPlanId={mealPlanId}
          day={day}
          mealIndex={mealIndex}
          onMealUpdated={onMealUpdated}
        >
          <Button
            variant="outline"
            size="sm"
            className="bg-white/80 hover:bg-white shadow-sm"
            data-testid="button-adjust-recipe"
          >
            <i className="fas fa-cog mr-2"></i>
            Adjust
          </Button>
        </RecipeAdjustmentModal>
      </div>

      <div className="flex items-center justify-between mb-4 pr-20">
        <div className="flex items-center">
          <div className={`w-12 h-12 ${mealColor.iconBg} rounded-full flex items-center justify-center mr-4`}>
            <i className={`${mealColor.icon} text-white`}></i>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-neutral-800 capitalize">{meal.type}</h4>
            <p className="text-sm text-neutral-600">{meal.time}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${mealColor.textColor}`}>{meal.calories}</span>
          <span className="text-sm text-neutral-600">cal</span>
          {meal.serving_size && meal.serving_size !== 1 && (
            <div className="text-xs text-neutral-500 mt-1">
              {meal.serving_size}x serving
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4">
        <h5 className="font-semibold text-neutral-800 mb-2">{meal.name}</h5>
        
        {/* Show modifications if any */}
        {meal.modifications?.ingredient_swaps && meal.modifications.ingredient_swaps.length > 0 && (
          <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
            <i className="fas fa-info-circle mr-1"></i>
            {meal.modifications.ingredient_swaps.length} ingredient{meal.modifications.ingredient_swaps.length > 1 ? 's' : ''} modified
          </div>
        )}
        
        <div className="mb-4">
          <h6 className="text-sm font-medium text-neutral-700 mb-2">Ingredients:</h6>
          <div className="space-y-2">
            {meal.ingredients.map((ingredient, index) => {
              // Handle both old format (string) and new format (object)
              if (typeof ingredient === 'string') {
                return (
                  <span 
                    key={index}
                    className="inline-block bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                  >
                    {ingredient}
                  </span>
                );
              } else {
                // New structured ingredient format
                const displayName = ingredient.local_name || ingredient.name;
                const quantityText = ingredient.household_unit || `${ingredient.quantity} ${ingredient.unit}`;
                
                return (
                  <div 
                    key={index}
                    className="flex items-center justify-between bg-neutral-50 p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-neutral-800">{displayName}</span>
                        {ingredient.local_name && ingredient.name !== ingredient.local_name && (
                          <span className="text-xs text-neutral-500">({ingredient.name})</span>
                        )}
                      </div>
                      {ingredient.notes && (
                        <p className="text-xs text-neutral-600 mt-1">{ingredient.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-neutral-700">{quantityText}</div>
                      {ingredient.macros?.calories && (
                        <div className="text-xs text-neutral-500">{ingredient.macros.calories} cal</div>
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>

        <div className="mb-4">
          <h6 className="text-sm font-medium text-neutral-700 mb-2">Instructions:</h6>
          <ol className="text-sm text-neutral-600 space-y-1">
            {(meal.modifications?.custom_instructions || meal.instructions).map((instruction, index) => (
              <li key={index}>{index + 1}. {instruction}</li>
            ))}
          </ol>
        </div>

        {/* Show portion notes if available */}
        {meal.portion_notes && (
          <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <h6 className="text-xs font-medium text-green-700 mb-1">
              <i className="fas fa-balance-scale mr-1"></i>Portion Guide:
            </h6>
            <p className="text-xs text-green-600">{meal.portion_notes}</p>
          </div>
        )}

        {/* Show nutritional information if available */}
        {(meal.protein_g || meal.carbs_g || meal.fat_g) && (
          <div className="border-t pt-3">
            <h6 className="text-xs font-medium text-neutral-600 mb-2">Nutrition per serving:</h6>
            <div className="flex space-x-4 text-xs text-neutral-600">
              {meal.protein_g && <span>Protein: {meal.protein_g}g</span>}
              {meal.carbs_g && <span>Carbs: {meal.carbs_g}g</span>}
              {meal.fat_g && <span>Fat: {meal.fat_g}g</span>}
            </div>
          </div>
        )}

        {/* Show personal notes if any */}
        {meal.modifications?.notes && (
          <div className="mt-3 p-2 bg-yellow-50 rounded text-xs">
            <strong>Your notes:</strong> {meal.modifications.notes}
          </div>
        )}
      </div>
    </div>
  );
}
