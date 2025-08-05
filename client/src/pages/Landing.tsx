import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthModal } from "@/components/AuthModal";
import { Navbar } from "@/components/Navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useAuth } from "@/contexts/AuthContext";
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
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 leading-tight mb-4 sm:mb-6">
                AI-Powered <span className="text-primary">Global Diet</span> Planning Made Simple
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
              <img 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Healthy meal planning on smartphone" 
                className="rounded-2xl shadow-2xl w-full h-auto" 
              />
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
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

      {/* Footer */}
      <footer className="bg-neutral-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <i className="fas fa-apple-alt text-primary text-2xl mr-2"></i>
                <span className="text-2xl font-bold">FitBite</span>
              </div>
              <p className="text-neutral-400 mb-6 max-w-md">
                AI-powered global diet planning that adapts to your culture, health goals, and lifestyle. Start your personalized nutrition journey today.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Get Started</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a></li>
                <li><a href="/dmca" className="hover:text-white transition-colors">DMCA Policy</a></li>
                <li><a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-700 pt-8 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-neutral-400">
                &copy; {new Date().getFullYear()} FitBite. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/privacy" className="text-neutral-400 hover:text-white text-sm transition-colors">Privacy</a>
                <a href="/terms" className="text-neutral-400 hover:text-white text-sm transition-colors">Terms</a>
                <a href="/cookies" className="text-neutral-400 hover:text-white text-sm transition-colors">Cookies</a>
                <a href="/contact" className="text-neutral-400 hover:text-white text-sm transition-colors">Support</a>
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
