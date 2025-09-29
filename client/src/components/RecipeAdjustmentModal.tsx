import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Meal } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

interface RecipeAdjustmentModalProps {
  meal: Meal;
  mealPlanId: string;
  day: string;
  mealIndex: number;
  onMealUpdated: (updatedMeal: Meal) => void;
  children: React.ReactNode;
}

export function RecipeAdjustmentModal({ 
  meal, 
  mealPlanId, 
  day, 
  mealIndex, 
  onMealUpdated, 
  children 
}: RecipeAdjustmentModalProps) {
  const [servingSize, setServingSize] = useState(meal.serving_size || 1);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [replacementIngredient, setReplacementIngredient] = useState("");
  const [swapReason, setSwapReason] = useState("");
  const [customInstructions, setCustomInstructions] = useState(
    meal.modifications?.custom_instructions?.join("\n") || ""
  );
  const [notes, setNotes] = useState(meal.modifications?.notes || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleServingSizeChange = async () => {
    if (servingSize === (meal.serving_size || 1)) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/meal-plans/${mealPlanId}/adjust-serving`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day,
          meal_index: mealIndex,
          serving_multiplier: servingSize
        })
      });

      if (!response.ok) throw new Error('Failed to adjust serving size');

      const data = await response.json();
      onMealUpdated(data.meal);
      toast({
        title: "Serving size adjusted",
        description: `Updated to ${servingSize}x serving size`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to adjust serving size",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngredientSwap = async () => {
    if (!selectedIngredient || !replacementIngredient) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/meal-plans/${mealPlanId}/swap-ingredient`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day,
          meal_index: mealIndex,
          original_ingredient: selectedIngredient,
          replacement_ingredient: replacementIngredient,
          reason: swapReason
        })
      });

      if (!response.ok) throw new Error('Failed to swap ingredient');

      const data = await response.json();
      onMealUpdated(data.meal);
      toast({
        title: "Ingredient swapped",
        description: `Replaced ${selectedIngredient} with ${replacementIngredient}`
      });
      
      // Reset form
      setSelectedIngredient("");
      setReplacementIngredient("");
      setSwapReason("");
      setSuggestions([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to swap ingredient",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomizeRecipe = async () => {
    setIsLoading(true);
    try {
      const instructionsArray = customInstructions
        .split('\n')
        .filter(line => line.trim().length > 0);

      const response = await fetch(`/api/meal-plans/${mealPlanId}/customize-recipe`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day,
          meal_index: mealIndex,
          custom_instructions: instructionsArray.length > 0 ? instructionsArray : undefined,
          notes: notes.trim() || undefined
        })
      });

      if (!response.ok) throw new Error('Failed to customize recipe');

      const data = await response.json();
      onMealUpdated(data.meal);
      toast({
        title: "Recipe customized",
        description: "Your custom instructions and notes have been saved"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to customize recipe",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestions = async (ingredient: string) => {
    if (!ingredient) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/ingredient-suggestions/${encodeURIComponent(ingredient)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
  };

  const handleIngredientSelect = (ingredient: string) => {
    setSelectedIngredient(ingredient);
    getSuggestions(ingredient);
  };

  const calculateAdjustedNutrition = (value: number, multiplier: number) => {
    return Math.round(value * multiplier);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="recipe-adjustment-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Adjust Recipe: {meal.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="serving" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="serving" data-testid="tab-serving">Serving Size</TabsTrigger>
            <TabsTrigger value="ingredients" data-testid="tab-ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="customize" data-testid="tab-customize">Customize</TabsTrigger>
          </TabsList>

          <TabsContent value="serving" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adjust Serving Size</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Serving Multiplier: {servingSize}x</Label>
                  <Slider
                    value={[servingSize]}
                    onValueChange={(value) => setServingSize(value[0])}
                    min={0.5}
                    max={4}
                    step={0.25}
                    className="w-full"
                    data-testid="serving-size-slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0.5x (Half)</span>
                    <span>1x (Normal)</span>
                    <span>2x (Double)</span>
                    <span>4x (Quadruple)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium mb-2">Original Nutrition</h4>
                    <div className="space-y-1 text-sm">
                      <div>Calories: {meal.original_calories || meal.calories}</div>
                      {meal.protein_g && <div>Protein: {meal.protein_g}g</div>}
                      {meal.carbs_g && <div>Carbs: {meal.carbs_g}g</div>}
                      {meal.fat_g && <div>Fat: {meal.fat_g}g</div>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Adjusted Nutrition</h4>
                    <div className="space-y-1 text-sm">
                      <div>Calories: {calculateAdjustedNutrition(meal.original_calories || meal.calories, servingSize)}</div>
                      {meal.protein_g && <div>Protein: {calculateAdjustedNutrition(meal.protein_g, servingSize)}g</div>}
                      {meal.carbs_g && <div>Carbs: {calculateAdjustedNutrition(meal.carbs_g, servingSize)}g</div>}
                      {meal.fat_g && <div>Fat: {calculateAdjustedNutrition(meal.fat_g, servingSize)}g</div>}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleServingSizeChange} 
                  disabled={isLoading || servingSize === (meal.serving_size || 1)}
                  className="w-full"
                  data-testid="button-update-serving"
                >
                  Update Serving Size
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ingredients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Swap Ingredients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select ingredient to replace:</Label>
                  <Select value={selectedIngredient} onValueChange={handleIngredientSelect}>
                    <SelectTrigger data-testid="select-ingredient">
                      <SelectValue placeholder="Choose an ingredient" />
                    </SelectTrigger>
                    <SelectContent>
                      {meal.ingredients.map((ingredient, index) => (
                        <SelectItem key={index} value={ingredient}>
                          {ingredient}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    <Label>Suggested replacements:</Label>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => setReplacementIngredient(suggestion)}
                          data-testid={`suggestion-${index}`}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Replacement ingredient:</Label>
                  <Input
                    value={replacementIngredient}
                    onChange={(e) => setReplacementIngredient(e.target.value)}
                    placeholder="Enter replacement ingredient"
                    data-testid="input-replacement"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Reason (optional):</Label>
                  <Input
                    value={swapReason}
                    onChange={(e) => setSwapReason(e.target.value)}
                    placeholder="e.g., allergy, preference, availability"
                    data-testid="input-reason"
                  />
                </div>

                <Button 
                  onClick={handleIngredientSwap} 
                  disabled={isLoading || !selectedIngredient || !replacementIngredient}
                  className="w-full"
                  data-testid="button-swap-ingredient"
                >
                  Swap Ingredient
                </Button>

                {meal.modifications?.ingredient_swaps && meal.modifications.ingredient_swaps.length > 0 && (
                  <div className="space-y-2">
                    <Label>Previous swaps:</Label>
                    <div className="space-y-2">
                      {meal.modifications.ingredient_swaps.map((swap, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                          <div><strong>{swap.original}</strong> → <strong>{swap.replacement}</strong></div>
                          {swap.reason && <div className="text-gray-600">Reason: {swap.reason}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customize" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customize Recipe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Custom cooking instructions (one per line):</Label>
                  <Textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Add your own cooking instructions..."
                    rows={6}
                    data-testid="textarea-instructions"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Personal notes:</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add personal notes about this recipe..."
                    rows={3}
                    data-testid="textarea-notes"
                  />
                </div>

                <Button 
                  onClick={handleCustomizeRecipe} 
                  disabled={isLoading}
                  className="w-full"
                  data-testid="button-customize-recipe"
                >
                  Save Customizations
                </Button>

                {meal.modifications?.custom_instructions && (
                  <div className="space-y-2">
                    <Label>Your custom instructions:</Label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <ol className="text-sm space-y-1">
                        {meal.modifications.custom_instructions.map((instruction, index) => (
                          <li key={index}>{index + 1}. {instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {meal.modifications?.notes && (
                  <div className="space-y-2">
                    <Label>Your notes:</Label>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      {meal.modifications.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}