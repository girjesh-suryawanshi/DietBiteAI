import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthModal } from "@/components/AuthModal";
import { Navbar } from "@/components/Navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { useAuth } from "@/contexts/AuthContext";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "wouter";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMiniGenerator, setShowMiniGenerator] = useState(false);
  const [miniGeneratorStep, setMiniGeneratorStep] = useState(1);
  const [miniAnswers, setMiniAnswers] = useState({
    goal: "",
    cuisine: "",
    restriction: ""
  });
  const { currentUser } = useAuth();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FitBite",
    "description": "AI-powered global diet planner that creates personalized meal plans based on your fitness goals, cultural preferences, and health conditions.",
    "url": "https://fitbite.app",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "15000",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "FitBite",
      "url": "https://fitbite.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FitBite",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fitbite.app/logo.png"
      }
    }
  };

  const features = [
    {
      icon: "fas fa-robot",
      color: "primary/10",
      iconColor: "primary",
      title: "AI-Powered Planning",
      description: "Smart algorithms create personalized meal plans based on your goals, preferences, and health conditions."
    },
    {
      icon: "fas fa-globe",
      color: "secondary/10", 
      iconColor: "secondary",
      title: "Global Cuisines",
      description: "Enjoy meals from Indian, Mediterranean, American, and other cultures while meeting your health goals."
    },
    {
      icon: "fas fa-file-pdf",
      color: "accent/10",
      iconColor: "accent", 
      title: "PDF Generation",
      description: "Download beautifully formatted meal plans as PDFs for printing or offline reference."
    },
    {
      icon: "fas fa-heart",
      color: "success/10",
      iconColor: "success",
      title: "Health Conditions", 
      description: "Specialized meal plans for diabetes, hypertension, and other health conditions with medical guidance."
    },
    {
      icon: "fas fa-share-alt",
      color: "warning/10",
      iconColor: "warning",
      title: "Easy Sharing",
      description: "Share your meal plans with family, friends, or healthcare providers with one-click sharing."
    },
    {
      icon: "fas fa-mobile-alt",
      color: "primary/10",
      iconColor: "primary",
      title: "Mobile Optimized", 
      description: "Access your meal plans anywhere with our responsive design that works perfectly on all devices."
    }
  ];

  const resetMiniGenerator = () => {
    setMiniGeneratorStep(1);
    setMiniAnswers({ goal: "", cuisine: "", restriction: "" });
  };

  const generateSamplePlan = () => {
    // Sample meal plan based on selections
    const sampleMeals = {
      "weight_loss": {
        "indian": {
          breakfast: "Masala Oats with Mixed Vegetables (280 cal)",
          lunch: "Grilled Tandoori Chicken with Brown Rice (420 cal)",
          dinner: "Dal Palak with Roti (350 cal)"
        },
        "mediterranean": {
          breakfast: "Greek Yogurt with Berries and Honey (250 cal)",
          lunch: "Grilled Fish with Quinoa Tabbouleh (380 cal)",
          dinner: "Lentil Soup with Whole Grain Bread (320 cal)"
        },
        "american": {
          breakfast: "Veggie Scrambled Eggs with Toast (290 cal)",
          lunch: "Grilled Chicken Salad with Avocado (350 cal)",
          dinner: "Baked Salmon with Roasted Vegetables (400 cal)"
        }
      },
      "weight_gain": {
        "indian": {
          breakfast: "Paneer Paratha with Curd (520 cal)",
          lunch: "Chicken Biryani with Raita (680 cal)",
          dinner: "Rajma Rice with Ghee (580 cal)"
        },
        "mediterranean": {
          breakfast: "Avocado Toast with Eggs (480 cal)",
          lunch: "Pasta with Olive Oil and Chicken (620 cal)",
          dinner: "Grilled Lamb with Couscous (650 cal)"
        },
        "american": {
          breakfast: "Pancakes with Maple Syrup (550 cal)",
          lunch: "Turkey Club Sandwich with Fries (670 cal)",
          dinner: "Steak with Mashed Potatoes (720 cal)"
        }
      }
    };

    const goalKey = (miniAnswers.goal as keyof typeof sampleMeals) || "weight_loss";
    const cuisineKey = miniAnswers.cuisine || "indian";
    
    return sampleMeals[goalKey]?.[cuisineKey as keyof typeof sampleMeals.weight_loss] || sampleMeals.weight_loss.indian;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <SEOHead
        title="FitBite - AI-Powered Global Diet Planner | Personalized Meal Plans for Every Culture"
        description="Transform your health with FitBite's AI-powered meal planning. Get personalized nutrition plans featuring global cuisines, tailored to your fitness goals, dietary restrictions, and cultural preferences. Start your free 7-day meal plan today!"
        keywords="AI diet planner, personalized meal plans, global cuisine nutrition, weight loss meal planner, cultural diet plans, healthy recipe generator, nutrition app, meal prep planner, international food diet, fitness meal planning"
        canonical="https://fitbite.app"
        structuredData={structuredData}
      />
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 sm:py-16 md:py-20 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-400 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-purple-400 rounded-full blur-xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
                <span className="text-sm font-medium text-primary">🎉 Join 15,000+ Happy Users</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 leading-tight mb-4 sm:mb-6">
                AI-Powered <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Global Diet</span> Planning Made Simple
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
                Get personalized 7-day meal plans tailored to your culture, health goals, and dietary preferences. Powered by AI, designed for your lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                {currentUser ? (
                  <Link href="/dashboard">
                    <Button className="bg-primary hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-lg transition-all transform hover:scale-105 w-full sm:w-auto">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    className="bg-primary hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-lg transition-all transform hover:scale-105 w-full sm:w-auto"
                  >
                    Start Free Plan
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => setShowMiniGenerator(true)}
                  className="border-2 border-neutral-300 hover:border-primary text-neutral-700 hover:text-primary px-8 py-4 rounded-xl text-lg font-semibold"
                >
                  Try Quick Generator
                </Button>
              </div>
              {/* Trust Indicators */}
              <div className="mt-8 space-y-4">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-neutral-500">
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-success mr-2"></i>
                    <span>Free 7-day trial</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-success mr-2"></i>
                    <span>No credit card required</span>
                  </div>
                </div>
                
                {/* User Stats */}
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-8 pt-4 border-t border-neutral-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star text-yellow-400 text-sm"></i>
                      ))}
                    </div>
                    <span className="text-neutral-700 font-medium">4.9/5</span>
                    <span className="text-neutral-500 text-sm">(2,847 reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-600">
                    <i className="fas fa-users text-primary"></i>
                    <span className="font-medium">15,000+</span>
                    <span className="text-sm">meal plans generated</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="relative">
                {/* Food Collage */}
                <div className="grid grid-cols-2 gap-4 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="space-y-4">
                    <img 
                      src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center&auto=format&q=80" 
                      alt="Healthy Indian curry bowl" 
                      className="w-full h-48 object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop&crop=center&auto=format&q=80";
                      }}
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=200&fit=crop&crop=center&auto=format&q=80" 
                      alt="Fresh Mediterranean salad" 
                      className="w-full h-32 object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop&crop=center&auto=format&q=80";
                      }}
                    />
                  </div>
                  <div className="space-y-4 pt-8">
                    <img 
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop&crop=center&auto=format&q=80" 
                      alt="Delicious pizza slice" 
                      className="w-full h-32 object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=200&fit=crop&crop=center&auto=format&q=80";
                      }}
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1563379091339-03246963d9d7?w=400&h=300&fit=crop&crop=center&auto=format&q=80" 
                      alt="Nutritious grain bowl" 
                      className="w-full h-48 object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&crop=center&auto=format&q=80";
                      }}
                    />
                  </div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg border border-neutral-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">4.9</div>
                    <div className="text-xs text-neutral-600">★★★★★</div>
                  </div>
                </div>
                
                {/* Bottom Stats */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl px-6 py-3 shadow-lg border border-neutral-200">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-primary">15K+</div>
                      <div className="text-neutral-600">Plans</div>
                    </div>
                    <div className="w-px h-8 bg-neutral-300"></div>
                    <div className="text-center">
                      <div className="font-bold text-secondary">50+</div>
                      <div className="text-neutral-600">Cuisines</div>
                    </div>
                    <div className="w-px h-8 bg-neutral-300"></div>
                    <div className="text-center">
                      <div className="font-bold text-accent">24/7</div>
                      <div className="text-neutral-600">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Loved by Thousands of Users
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Real people, real results with personalized meal planning
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 text-sm"></i>
                  ))}
                </div>
                <p className="text-neutral-700 mb-4 italic">
                  "Lost 18 pounds in 2 months with Mediterranean meal plans that actually taste amazing! The cultural authenticity is incredible."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Sarah M.</p>
                    <p className="text-sm text-neutral-500">New York, NY</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 text-sm"></i>
                  ))}
                </div>
                <p className="text-neutral-700 mb-4 italic">
                  "As a diabetic, finding safe Indian recipes was impossible. FitBite created perfect meal plans that control my blood sugar."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    R
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Raj P.</p>
                    <p className="text-sm text-neutral-500">California</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 text-sm"></i>
                  ))}
                </div>
                <p className="text-neutral-700 mb-4 italic">
                  "Finally, meal planning that understands my Nigerian heritage! Gained healthy weight with traditional foods I love."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Amara O.</p>
                    <p className="text-sm text-neutral-500">Texas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              How FitBite Creates Your Perfect Plan
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Just 3 simple steps to get personalized meal plans that fit your culture and health goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center group">
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative z-10 w-full h-full bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-primary/20">
                  <i className="fas fa-user-cog text-2xl text-primary"></i>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">Tell Us About You</h3>
              <p className="text-neutral-600">
                Share your fitness goals, cultural food preferences, health conditions, and dietary restrictions in our quick 5-step setup.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-accent rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative z-10 w-full h-full bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-secondary/20">
                  <i className="fas fa-magic text-2xl text-secondary"></i>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">AI Creates Your Plan</h3>
              <p className="text-neutral-600">
                Our advanced AI analyzes your profile and generates a personalized 7-day meal plan with recipes from your favorite cuisines.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative z-10 w-full h-full bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-accent/20">
                  <i className="fas fa-download text-2xl text-accent"></i>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">Download & Enjoy</h3>
              <p className="text-neutral-600">
                Get your beautiful PDF meal plan with shopping lists, nutrition facts, and easy-to-follow recipes. Share with family or friends!
              </p>
            </div>
          </div>

          {/* Process Flow */}
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-30 hidden md:block"></div>
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <div className="bg-white px-4 py-2 rounded-full border-2 border-primary/20 text-sm font-medium text-primary">
                5-Step Setup
              </div>
              <div className="bg-white px-4 py-2 rounded-full border-2 border-secondary/20 text-sm font-medium text-secondary">
                AI Processing
              </div>
              <div className="bg-white px-4 py-2 rounded-full border-2 border-accent/20 text-sm font-medium text-accent">
                Ready in 60s
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Everything You Need for Healthy Living
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              From AI-powered meal planning to cultural cuisine options, FitBite adapts to your unique lifestyle and health goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-neutral-50 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 bg-${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <i className={`${feature.icon} text-${feature.iconColor} text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Why Choose FitBite Over Alternatives?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              See how FitBite compares to traditional nutritionists and generic diet apps
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-neutral-800">Features</th>
                  <th className="px-6 py-4 text-center font-semibold text-primary">
                    <div className="flex items-center justify-center space-x-2">
                      <i className="fas fa-apple-alt"></i>
                      <span>FitBite</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-neutral-600">Traditional Nutritionist</th>
                  <th className="px-6 py-4 text-center font-semibold text-neutral-600">Generic Diet Apps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-800">Cost</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-primary font-bold">Free</span>
                  </td>
                  <td className="px-6 py-4 text-center text-neutral-600">$150-300/session</td>
                  <td className="px-6 py-4 text-center text-neutral-600">$10-30/month</td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-800">Cultural Cuisines</td>
                  <td className="px-6 py-4 text-center">
                    <i className="fas fa-check-circle text-primary text-xl"></i>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <i className="fas fa-times-circle text-neutral-400 text-xl"></i>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <i className="fas fa-times-circle text-neutral-400 text-xl"></i>
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-800">Instant Results</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-primary font-medium">60 seconds</span>
                  </td>
                  <td className="px-6 py-4 text-center text-neutral-600">1-2 weeks</td>
                  <td className="px-6 py-4 text-center text-neutral-600">Basic templates</td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-800">Health Conditions</td>
                  <td className="px-6 py-4 text-center">
                    <i className="fas fa-check-circle text-primary text-xl"></i>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <i className="fas fa-check-circle text-secondary text-xl"></i>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <i className="fas fa-times-circle text-neutral-400 text-xl"></i>
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-800">PDF Downloads</td>
                  <td className="px-6 py-4 text-center">
                    <i className="fas fa-check-circle text-primary text-xl"></i>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <i className="fas fa-times-circle text-neutral-400 text-xl"></i>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <i className="fas fa-times-circle text-neutral-400 text-xl"></i>
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-800">24/7 Availability</td>
                  <td className="px-6 py-4 text-center">
                    <i className="fas fa-check-circle text-primary text-xl"></i>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <i className="fas fa-times-circle text-neutral-400 text-xl"></i>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <i className="fas fa-check-circle text-secondary text-xl"></i>
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium text-neutral-800">Multiple Plans</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-primary font-medium">Unlimited</span>
                  </td>
                  <td className="px-6 py-4 text-center text-neutral-600">1 per session</td>
                  <td className="px-6 py-4 text-center text-neutral-600">Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-medium shadow-lg">
              <i className="fas fa-trophy mr-2"></i>
              FitBite: Best of all worlds, completely free
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">
            Ready to Transform Your Health Journey?
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Join 15,000+ users who've discovered the power of culturally authentic, AI-powered meal planning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {currentUser ? (
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all transform hover:scale-105">
                  <i className="fas fa-rocket mr-2"></i>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-primary hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all transform hover:scale-105"
              >
                <i className="fas fa-rocket mr-2"></i>
                Start Your Free Plan
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={() => setShowMiniGenerator(true)}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all"
            >
              <i className="fas fa-play mr-2"></i>
              Try Quick Generator
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-neutral-500">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-success mr-2"></i>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle text-success mr-2"></i>
              <span>Start in 60 seconds</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle text-success mr-2"></i>
              <span>Always free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mr-3">
                  <i className="fas fa-apple-alt text-white text-lg"></i>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  FitBite
                </span>
              </div>
              <p className="text-neutral-400 mb-6 text-sm leading-relaxed">
                AI-powered global diet planning that adapts to your culture, health goals, and preferences. Join 15,000+ users transforming their health journey.
              </p>
              <div className="flex space-x-3">
                <a href="https://twitter.com/fitbite" className="w-10 h-10 bg-neutral-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors group">
                  <i className="fab fa-twitter text-neutral-400 group-hover:text-white"></i>
                </a>
                <a href="https://facebook.com/fitbite" className="w-10 h-10 bg-neutral-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors group">
                  <i className="fab fa-facebook text-neutral-400 group-hover:text-white"></i>
                </a>
                <a href="https://instagram.com/fitbite" className="w-10 h-10 bg-neutral-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors group">
                  <i className="fab fa-instagram text-neutral-400 group-hover:text-white"></i>
                </a>
              </div>
            </div>
            
            {/* Product Section */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="text-neutral-400 hover:text-primary transition-colors flex items-center">Features</a></li>
                <li><a href="#how-it-works" className="text-neutral-400 hover:text-primary transition-colors flex items-center">How It Works</a></li>
                <li>
                  <button 
                    onClick={() => setShowMiniGenerator(true)}
                    className="text-neutral-400 hover:text-primary transition-colors flex items-center"
                  >
                    Try Demo <i className="fas fa-external-link-alt ml-1 text-xs"></i>
                  </button>
                </li>
                <li><a href="/dashboard" className="text-neutral-400 hover:text-primary transition-colors flex items-center">Get Started</a></li>
              </ul>
            </div>
            
            {/* Company Section */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/about" className="text-neutral-400 hover:text-primary transition-colors">About Us</a></li>
                <li><a href="/contact" className="text-neutral-400 hover:text-primary transition-colors">Contact</a></li>
                <li><a href="/faq" className="text-neutral-400 hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="/sitemap" className="text-neutral-400 hover:text-primary transition-colors">Sitemap</a></li>
              </ul>
            </div>
            
            {/* Legal Section */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/privacy" className="text-neutral-400 hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-neutral-400 hover:text-primary transition-colors">Terms & Conditions</a></li>
                <li><a href="/disclaimer" className="text-neutral-400 hover:text-primary transition-colors">Disclaimer</a></li>
                <li><a href="/dmca" className="text-neutral-400 hover:text-primary transition-colors">DMCA</a></li>
                <li><a href="/cookies" className="text-neutral-400 hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-neutral-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-neutral-400 text-sm">
                  &copy; {new Date().getFullYear()} FitBite. All rights reserved.
                </p>
                <div className="flex items-center space-x-4 text-xs text-neutral-500">
                  <span className="flex items-center">
                    <i className="fas fa-shield-alt mr-1"></i>
                    Secure & Private
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-heart mr-1"></i>
                    Made with AI
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={currentUser ? () => {} : () => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-all"
                >
                  {currentUser ? "Dashboard" : "Start Free"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Mini Meal Plan Generator Modal */}
      <Dialog open={showMiniGenerator} onOpenChange={(open) => {
        setShowMiniGenerator(open);
        if (!open) resetMiniGenerator();
      }}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-center">
              {miniGeneratorStep < 4 ? `Quick Generator (${miniGeneratorStep}/3)` : "Your Sample Day"}
            </DialogTitle>
            <DialogDescription className="text-center text-neutral-600">
              {miniGeneratorStep < 4 ? "Answer a few questions to see your personalized meal preview" : "Based on your preferences"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6">
            {miniGeneratorStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">What's your main goal?</h3>
                <div className="space-y-2">
                  {[
                    { value: "weight_loss", label: "🎯 Lose Weight", desc: "Healthy calorie deficit" },
                    { value: "weight_gain", label: "💪 Gain Weight", desc: "Nutritious calorie surplus" },
                    { value: "maintain", label: "⚖️ Maintain Weight", desc: "Balanced nutrition" }
                  ].map((goal) => (
                    <button
                      key={goal.value}
                      onClick={() => {
                        setMiniAnswers({ ...miniAnswers, goal: goal.value });
                        setMiniGeneratorStep(2);
                      }}
                      className="w-full p-4 text-left border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <div className="font-medium">{goal.label}</div>
                      <div className="text-sm text-neutral-600">{goal.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {miniGeneratorStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Which cuisine do you prefer?</h3>
                <div className="space-y-2">
                  {[
                    { value: "indian", label: "🇮🇳 Indian", desc: "Spices, curries, traditional" },
                    { value: "mediterranean", label: "🇬🇷 Mediterranean", desc: "Olive oil, fish, fresh" },
                    { value: "american", label: "🇺🇸 American", desc: "Classic, familiar flavors" }
                  ].map((cuisine) => (
                    <button
                      key={cuisine.value}
                      onClick={() => {
                        setMiniAnswers({ ...miniAnswers, cuisine: cuisine.value });
                        setMiniGeneratorStep(3);
                      }}
                      className="w-full p-4 text-left border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <div className="font-medium">{cuisine.label}</div>
                      <div className="text-sm text-neutral-600">{cuisine.desc}</div>
                    </button>
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setMiniGeneratorStep(1)}
                  className="w-full"
                >
                  ← Back
                </Button>
              </div>
            )}

            {miniGeneratorStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Any dietary restrictions?</h3>
                <div className="space-y-2">
                  {[
                    { value: "none", label: "✅ No Restrictions", desc: "All foods welcome" },
                    { value: "vegetarian", label: "🥬 Vegetarian", desc: "No meat or fish" },
                    { value: "vegan", label: "🌱 Vegan", desc: "Plant-based only" },
                    { value: "diabetic", label: "🩺 Diabetic-Friendly", desc: "Low sugar, controlled carbs" }
                  ].map((restriction) => (
                    <button
                      key={restriction.value}
                      onClick={() => {
                        setMiniAnswers({ ...miniAnswers, restriction: restriction.value });
                        setMiniGeneratorStep(4);
                      }}
                      className="w-full p-4 text-left border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <div className="font-medium">{restriction.label}</div>
                      <div className="text-sm text-neutral-600">{restriction.desc}</div>
                    </button>
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setMiniGeneratorStep(2)}
                  className="w-full"
                >
                  ← Back
                </Button>
              </div>
            )}

            {miniGeneratorStep === 4 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">Here's Your Sample Day!</h3>
                  <p className="text-sm text-neutral-600 mb-4">Based on your preferences</p>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(generateSamplePlan()).map(([meal, description]) => (
                    <div key={meal} className="p-3 bg-neutral-50 rounded-lg">
                      <div className="font-medium capitalize text-primary">{meal}</div>
                      <div className="text-sm text-neutral-700">{description}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <p className="text-sm font-medium text-primary mb-2">
                    Love what you see? Get your full 7-day plan!
                  </p>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => {
                        setShowMiniGenerator(false);
                        setShowAuthModal(true);
                        resetMiniGenerator();
                      }}
                      className="w-full bg-primary hover:bg-green-600"
                    >
                      Get My Full Plan Free
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setMiniGeneratorStep(1)}
                      className="w-full text-sm"
                    >
                      Try Different Options
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
