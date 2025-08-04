import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyMealPlan, DayMealPlan, Meal } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const currentDay = mealPlan.days[selectedDay];
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
      
      // Check if it's a PDF or HTML preview
      if (data.url.includes('preview=true')) {
        // Open HTML preview in new tab
        window.open(data.url, '_blank');
        toast({
          title: "Preview opened!",
          description: "Your meal plan preview has opened in a new tab",
        });
      } else {
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
      }
      
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
          
          {mealPlan.days.map((day, dayIndex) => {
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
                    <MealCard key={mealIndex} meal={meal} />
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

function MealCard({ meal }: { meal: Meal }) {
  const mealColor = MEAL_COLORS[meal.type as keyof typeof MEAL_COLORS] || MEAL_COLORS.snack;

  return (
    <div className={`${mealColor.bg} rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-4">
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
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4">
        <h5 className="font-semibold text-neutral-800 mb-2">{meal.name}</h5>
        
        <div className="mb-4">
          <h6 className="text-sm font-medium text-neutral-700 mb-2">Ingredients:</h6>
          <div className="flex flex-wrap gap-2">
            {meal.ingredients.map((ingredient, index) => (
              <span 
                key={index}
                className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h6 className="text-sm font-medium text-neutral-700 mb-2">Instructions:</h6>
          <ol className="text-sm text-neutral-600 space-y-1">
            {meal.instructions.map((instruction, index) => (
              <li key={index}>{index + 1}. {instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
