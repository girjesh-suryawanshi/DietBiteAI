import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { MealPlanForm } from "@/components/MealPlanForm";
import { MealPlanDisplay } from "@/components/MealPlanDisplay";
import { AuthModal } from "@/components/AuthModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MealPlan, WeeklyMealPlan } from "@shared/schema";
import { Redirect } from "wouter";

export default function Dashboard() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const { currentUser, userData } = useAuth();
  const { toast } = useToast();

  // Fetch user's meal plans
  const { data: mealPlans, isLoading: plansLoading } = useQuery<MealPlan[]>({
    queryKey: ['/api/meal-plans', currentUser?.uid],
    enabled: !!currentUser,
  });

  // Redirect to landing if not authenticated
  if (!currentUser) {
    return <Redirect to="/" />;
  }

  // Generate meal plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      const response = await apiRequest("POST", "/api/meal-plans/generate", planData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meal-plans', currentUser?.uid] });
      setShowPlanForm(false);
      toast({
        title: "Meal plan generated!",
        description: "Your personalized meal plan is ready",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to generate meal plan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Download PDF mutation
  const downloadPdfMutation = useMutation({
    mutationFn: async (mealPlanId: string) => {
      const response = await apiRequest("POST", `/api/meal-plans/${mealPlanId}/pdf`, {});
      return response.json();
    },
    onSuccess: (data) => {
      // Open PDF in new tab
      window.open(data.url, '_blank');
      toast({
        title: "PDF generated!",
        description: "Your meal plan PDF is ready for download",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to generate PDF",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const activePlan = mealPlans?.find(plan => plan.is_active);
  const weeklyPlan = activePlan?.plan_data as WeeklyMealPlan;

  const handleGeneratePlan = (formData: any) => {
    generatePlanMutation.mutate({
      ...formData,
      user_id: currentUser?.uid, // Use Firebase UID instead of database ID
    });
  };

  const handleDownloadPDF = () => {
    if (activePlan) {
      downloadPdfMutation.mutate(activePlan.id);
    }
  };

  const handleShare = () => {
    // Handled in MealPlanDisplay component
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800">
                Welcome back, {userData?.name}!
              </h1>
              <p className="text-neutral-600 mt-2">
                Your personalized meal planning dashboard
              </p>
            </div>
            <Button
              onClick={() => setShowPlanForm(!showPlanForm)}
              className="bg-primary hover:bg-green-600 text-white"
            >
              <i className="fas fa-magic mr-2"></i>
              Generate New Plan
            </Button>
          </div>
        </div>

        {/* Plan Generation Form */}
        {showPlanForm && (
          <div className="mb-8">
            <MealPlanForm 
              onSubmit={handleGeneratePlan}
              loading={generatePlanMutation.isPending}
            />
          </div>
        )}

        {/* Main Content */}
        {plansLoading ? (
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="grid grid-cols-7 gap-2 mt-6">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="h-8" />
                  ))}
                </div>
                <div className="space-y-6 mt-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : weeklyPlan && activePlan ? (
          <MealPlanDisplay
            mealPlan={weeklyPlan}
            mealPlanId={activePlan.id}
            onDownloadPDF={handleDownloadPDF}
            onShare={handleShare}
            downloadLoading={downloadPdfMutation.isPending}
          />
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-utensils text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                  No meal plan yet
                </h3>
                <p className="text-neutral-600 mb-6">
                  Generate your first AI-powered meal plan to get started on your health journey.
                </p>
                <Button
                  onClick={() => setShowPlanForm(true)}
                  className="bg-primary hover:bg-green-600 text-white"
                >
                  <i className="fas fa-magic mr-2"></i>
                  Create Your First Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
