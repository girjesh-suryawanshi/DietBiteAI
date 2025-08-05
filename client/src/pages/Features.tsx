import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bot, Globe, FileText, Heart, Share2, Smartphone, Clock, Shield, Target, Users, Download, Zap } from "lucide-react";

const features = [
  {
    icon: Bot,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    title: "AI-Powered Meal Planning",
    description: "Advanced artificial intelligence analyzes your health profile, dietary preferences, and goals to create perfectly personalized meal plans.",
    benefits: [
      "Smart algorithm considers 50+ factors",
      "Learns from your preferences over time",
      "Adapts to seasonal ingredient availability",
      "Optimizes for nutritional balance"
    ]
  },
  {
    icon: Globe,
    color: "text-green-600",
    bgColor: "bg-green-50",
    title: "Global Cuisine Support",
    description: "Enjoy authentic flavors from around the world while maintaining your health goals with culturally diverse meal options.",
    benefits: [
      "Indian, Mediterranean, Asian cuisines",
      "Traditional recipes with healthy twists",
      "Regional ingredient preferences",
      "Cultural dietary customs respected"
    ]
  },
  {
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-50",
    title: "Health Condition Integration",
    description: "Specialized meal plans designed for specific health conditions with medically-informed nutritional guidance.",
    benefits: [
      "Diabetes-friendly meal options",
      "Heart-healthy recipes",
      "PCOS and thyroid support",
      "Hypertension management"
    ]
  },
  {
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    title: "Comprehensive PDF Generation",
    description: "Download beautifully formatted meal plans that include your complete health profile and weekly menu.",
    benefits: [
      "Complete nutritional breakdown",
      "Shopping lists included",
      "Cooking instructions detailed",
      "Health profile summary"
    ]
  },
  {
    icon: Share2,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    title: "Easy Sharing & Collaboration",
    description: "Share your meal plans with family members, friends, or healthcare providers with simple one-click sharing.",
    benefits: [
      "Family meal coordination",
      "Healthcare provider consultation",
      "Social support networks",
      "Progress tracking with others"
    ]
  },
  {
    icon: Smartphone,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    title: "Mobile-Optimized Experience",
    description: "Access your personalized meal plans anywhere with our responsive design that works perfectly on all devices.",
    benefits: [
      "Grocery shopping companion",
      "Kitchen cooking reference",
      "Offline PDF access",
      "Cross-device synchronization"
    ]
  }
];

const additionalFeatures = [
  {
    icon: Clock,
    title: "Time-Saving Efficiency",
    description: "Generate week-long meal plans in seconds instead of hours of manual planning"
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your health data is encrypted and protected with enterprise-grade security"
  },
  {
    icon: Target,
    title: "Goal Achievement",
    description: "Track progress toward weight loss, muscle gain, or maintenance goals"
  },
  {
    icon: Users,
    title: "Family Support",
    description: "Create meal plans that accommodate multiple family members' preferences"
  },
  {
    icon: Download,
    title: "Offline Access",
    description: "Download PDFs for offline viewing and printing when internet isn't available"
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Modify preferences and regenerate plans instantly as your needs change"
  }
];

export default function Features() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => {}} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 mb-4 sm:mb-6 leading-tight">
            Powerful Features for <span className="text-primary">Personalized Nutrition</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Discover how FitBite's advanced AI technology and comprehensive features make 
            healthy meal planning effortless, personalized, and culturally authentic.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-green-600 text-white px-6 sm:px-8 py-3 text-sm sm:text-base">
              Try FitBite Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-4">Core Features</h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
              Everything you need for intelligent, personalized meal planning in one comprehensive platform
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                      <div className={`${feature.bgColor} p-3 rounded-lg mb-3 sm:mb-0 sm:mr-4 w-fit`}>
                        <Icon className={`w-6 sm:w-8 h-6 sm:h-8 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-neutral-700 mb-4 sm:mb-6 text-sm sm:text-base">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start text-xs sm:text-sm text-neutral-600">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-4">Additional Benefits</h2>
            <p className="text-base sm:text-lg text-neutral-600 px-4">
              More reasons why FitBite is the complete solution for your nutrition needs
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6">
                    <div className="bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-800 mb-2 sm:mb-3">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-neutral-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Powered by Advanced AI Technology</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary w-3 h-3 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Machine Learning Algorithms</h3>
                    <p className="text-neutral-300">Continuously learning from user preferences and nutritional science</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary w-3 h-3 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Nutritional Database</h3>
                    <p className="text-neutral-300">Comprehensive food database with accurate nutritional information</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary w-3 h-3 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Cultural Intelligence</h3>
                    <p className="text-neutral-300">Understanding of global cuisines and cultural dietary practices</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary w-3 h-3 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Health Integration</h3>
                    <p className="text-neutral-300">Medical condition awareness for safe, appropriate meal planning</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Why Choose FitBite?</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Personalization Accuracy</span>
                  <span className="font-semibold">95%+</span>
                </div>
                <div className="flex justify-between">
                  <span>Supported Cuisines</span>
                  <span className="font-semibold">15+</span>
                </div>
                <div className="flex justify-between">
                  <span>Health Conditions</span>
                  <span className="font-semibold">20+</span>
                </div>
                <div className="flex justify-between">
                  <span>User Satisfaction</span>
                  <span className="font-semibold">98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Ready to Transform Your Nutrition?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Join thousands of users who have already discovered the power of AI-driven meal planning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-green-600 text-white px-8">
                Start Your Free Plan
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}