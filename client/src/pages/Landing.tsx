import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthModal } from "@/components/AuthModal";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 leading-tight">
                AI-Powered <span className="text-primary">Global Diet</span> Planning Made Simple
              </h1>
              <p className="mt-6 text-xl text-neutral-600 leading-relaxed">
                Get personalized 7-day meal plans tailored to your culture, health goals, and dietary preferences. Powered by AI, designed for your lifestyle.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {currentUser ? (
                  <Link href="/dashboard">
                    <Button className="bg-primary hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all transform hover:scale-105">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    className="bg-primary hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all transform hover:scale-105"
                  >
                    Start Free Plan
                  </Button>
                )}
                <Button 
                  variant="outline"
                  className="border-2 border-neutral-300 hover:border-primary text-neutral-700 hover:text-primary px-8 py-4 rounded-xl text-lg font-semibold"
                >
                  View Demo
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-neutral-500">
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-success mr-2"></i>
                  <span>Free 7-day trial</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-success mr-2"></i>
                  <span>No credit card required</span>
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
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Downloads</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-700 pt-8 mt-12 text-center text-neutral-400">
            <p>&copy; 2023 FitBite. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
