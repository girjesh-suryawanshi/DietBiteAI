import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { UserOnboardingForm } from "@/components/UserOnboardingForm";
import { GoalSelectionForm } from "@/components/GoalSelectionForm";
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
  const [onboardingStep, setOnboardingStep] = useState<'profile' | 'goal' | 'complete'>('complete');
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

  // Determine onboarding step based on user data
  React.useEffect(() => {
    // Priority 1: If we have meal plans, show them
    if (!plansLoading && mealPlans && mealPlans.length > 0) {
      if (onboardingStep !== 'complete') {
        setOnboardingStep('complete');
      }
      return;
    }
    
    // Priority 2: If user data is loaded, check completion
    if (userData) {
      const isProfileComplete = userData.age && userData.height_cm && userData.weight_kg && userData.activity_level && userData.country_region;
      
      if (!isProfileComplete) {
        if (onboardingStep !== 'profile') {
          setOnboardingStep('profile');
        }
      } else if (!plansLoading && (!mealPlans || mealPlans.length === 0)) {
        if (onboardingStep !== 'goal') {
          setOnboardingStep('goal');
        }
      }
    } else if (currentUser && !plansLoading && (!mealPlans || mealPlans.length === 0)) {
      // Priority 3: No user data, no meal plans - start onboarding
      if (onboardingStep !== 'profile') {
        setOnboardingStep('profile');
      }
    }
  }, [userData, mealPlans, currentUser, plansLoading, onboardingStep]);

  // Generate meal plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      const response = await apiRequest("POST", "/api/meal-plans/generate", planData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meal-plans', currentUser?.uid] });
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
      // Download PDF file directly
      const link = document.createElement('a');
      link.href = data.url;
      link.download = `fitbite-meal-plan-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "PDF downloaded!",
        description: "Your meal plan PDF has been downloaded to your device",
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

  const activePlan = mealPlans?.find(plan => plan.is_active) || mealPlans?.[0];
  const weeklyPlan = activePlan?.plan_data as WeeklyMealPlan;

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const response = await apiRequest("PUT", "/api/users/profile", profileData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUser?.uid] });
      toast({
        title: "Profile updated!",
        description: "Your profile has been set up successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (profileData: any) => {
    updateProfileMutation.mutate({
      ...profileData,
      uid: currentUser?.uid,
    });
  };

  const handleGoalSubmit = (goal: string) => {
    // Check if we have user data and essential fields
    if (!currentUser?.uid) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue",
        variant: "destructive",
      });
      return;
    }

    generatePlanMutation.mutate({
      fitness_goal: goal,
      cuisine: userData?.country_region || 'indian',
      diet_type: (userData as any)?.food_preference || 'vegetarian',
      user_id: currentUser.uid,
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

  // Show onboarding steps based on current state
  if (onboardingStep === 'profile') {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar onShowAuth={() => setShowAuthModal(true)} />
        <UserOnboardingForm 
          onSubmit={handleProfileSubmit}
          isLoading={updateProfileMutation.isPending}
        />
        
        {showAuthModal && (
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
          />
        )}
      </div>
    );
  }

  if (onboardingStep === 'goal') {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar onShowAuth={() => setShowAuthModal(true)} />
        <GoalSelectionForm 
          onSubmit={handleGoalSubmit}
          isLoading={generatePlanMutation.isPending}
        />
        
        {showAuthModal && (
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
          />
        )}
      </div>
    );
  }

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
              onClick={() => setOnboardingStep('goal')}
              className="bg-primary hover:bg-green-600 text-white"
            >
              <i className="fas fa-magic mr-2"></i>
              Generate New Plan
            </Button>
          </div>
        </div>

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
                  onClick={() => setOnboardingStep('goal')}
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

      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </div>
  );
}
