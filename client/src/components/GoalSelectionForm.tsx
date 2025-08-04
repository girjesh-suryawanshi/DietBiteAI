import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Activity, Target, ArrowLeft } from "lucide-react";

interface GoalSelectionFormProps {
  onSubmit: (goal: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const FITNESS_GOALS = [
  {
    id: "weight_loss",
    title: "Lose Weight",
    description: "Create a calorie deficit to shed pounds healthily",
    icon: TrendingDown,
    color: "bg-red-50 border-red-200 text-red-700",
    iconColor: "text-red-500",
    benefits: ["Burn fat", "Reduce calories", "Boost metabolism"]
  },
  {
    id: "weight_gain",
    title: "Gain Weight",
    description: "Build muscle mass and healthy weight gain",
    icon: TrendingUp,
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconColor: "text-blue-500",
    benefits: ["Build muscle", "Increase calories", "Protein focus"]
  },
  {
    id: "maintain",
    title: "Maintain Weight",
    description: "Stay at your current weight with balanced nutrition",
    icon: Activity,
    color: "bg-green-50 border-green-200 text-green-700",
    iconColor: "text-green-500",
    benefits: ["Balanced nutrition", "Stable energy", "Healthy habits"]
  }
];

export function GoalSelectionForm({ onSubmit, onBack, isLoading = false }: GoalSelectionFormProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>("");

  const handleSubmit = () => {
    if (selectedGoal) {
      onSubmit(selectedGoal);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          What's Your Fitness Goal?
        </h1>
        <p className="text-gray-600 text-lg">
          Choose your primary objective to get a personalized meal plan
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {FITNESS_GOALS.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoal === goal.id;
          
          return (
            <Card
              key={goal.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-primary shadow-lg transform scale-105' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedGoal(goal.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${goal.color}`}>
                  <Icon className={`w-6 h-6 ${goal.iconColor}`} />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {goal.title}
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  {goal.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {goal.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                {isSelected && (
                  <div className="mt-4 pt-4 border-t">
                    <Badge className="bg-primary text-white">
                      Selected
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </Button>
        )}
        
        <div className="flex-1 text-center">
          <Button
            onClick={handleSubmit}
            disabled={!selectedGoal || isLoading}
            className="px-8 py-3 bg-primary hover:bg-green-600 text-white text-lg font-medium"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating Your Meal Plan...
              </>
            ) : (
              "Generate My Meal Plan"
            )}
          </Button>
          
          {selectedGoal && (
            <p className="text-sm text-gray-500 mt-3">
              Your meal plan will be optimized for {FITNESS_GOALS.find(g => g.id === selectedGoal)?.title.toLowerCase()}
            </p>
          )}
        </div>
        
        {!onBack && <div className="w-32" />} {/* Spacer when no back button */}
      </div>
    </div>
  );
}