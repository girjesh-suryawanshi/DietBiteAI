import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { UserPlus, ClipboardList, Brain, Download, Share2, RefreshCw } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Tell us about yourself, your health goals, and dietary preferences",
    details: [
      "Personal information (age, gender, height, weight)",
      "Activity level and fitness goals",
      "Health conditions and dietary restrictions", 
      "Cultural cuisine preferences",
      "Foods you love or want to avoid"
    ],
    timeEstimate: "5 minutes"
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Set Your Preferences",
    description: "Customize your meal planning preferences for the best results",
    details: [
      "Choose your preferred cuisines",
      "Select meal complexity level",
      "Set cooking time preferences",
      "Specify any food allergies",
      "Pick your fitness goals (weight loss, gain, maintenance)"
    ],
    timeEstimate: "3 minutes"
  },
  {
    number: "03",
    icon: Brain,
    title: "AI Generates Your Plan",
    description: "Our advanced AI creates a personalized 7-day meal plan just for you",
    details: [
      "Analyzes 50+ personal factors",
      "Balances macronutrients perfectly",
      "Considers cultural food preferences",
      "Adapts to your health conditions",
      "Optimizes for your fitness goals"
    ],
    timeEstimate: "30 seconds"
  },
  {
    number: "04",
    icon: Download,
    title: "Download & Follow",
    description: "Get your complete meal plan as a beautiful PDF with all details",
    details: [
      "Week-long meal schedule",
      "Detailed recipes and instructions",
      "Complete ingredient shopping lists",
      "Nutritional breakdown per meal",
      "Your health profile summary"
    ],
    timeEstimate: "Instant"
  },
  {
    number: "05",
    icon: Share2,
    title: "Share & Collaborate",
    description: "Share your meal plan with family, friends, or healthcare providers",
    details: [
      "Family meal coordination",
      "Healthcare provider consultation",
      "Social support and accountability",
      "Progress tracking with others",
      "Recipe sharing and feedback"
    ],
    timeEstimate: "1 click"
  },
  {
    number: "06",
    icon: RefreshCw,
    title: "Adapt & Regenerate",
    description: "Update your preferences anytime and generate new meal plans",
    details: [
      "Change cuisine preferences",
      "Update health conditions",
      "Modify fitness goals",
      "Try new dietary approaches",
      "Generate unlimited new plans"
    ],
    timeEstimate: "Anytime"
  }
];

const benefits = [
  {
    title: "Save Time",
    description: "No more hours spent meal planning. Get professional-quality plans in minutes.",
    stat: "10+ hours saved per week"
  },
  {
    title: "Improve Health",
    description: "Science-based nutrition tailored to your specific health conditions and goals.",
    stat: "95% see health improvements"
  },
  {
    title: "Reduce Stress",
    description: "Eliminate decision fatigue with clear, detailed meal plans and shopping lists.",
    stat: "90% report reduced meal stress"
  },
  {
    title: "Cultural Authenticity",
    description: "Enjoy authentic flavors from your culture while meeting health goals.",
    stat: "15+ global cuisines supported"
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => {}} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 mb-4 sm:mb-6 leading-tight">
            How <span className="text-primary">Mymealify</span> Works
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Transform your nutrition in 6 simple steps. From profile creation to personalized meal plans, 
            discover how easy healthy eating can be with AI-powered planning.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-green-600 text-white px-6 sm:px-8 py-3 text-sm sm:text-base">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Your Path to Personalized Nutrition</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Follow these simple steps to get started with AI-powered meal planning tailored exactly to your needs
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 1;
              
              return (
                <div key={index} className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl font-bold text-primary/20 mr-4">{step.number}</span>
                      <div className="bg-primary/10 p-3 rounded-lg mr-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-neutral-800">{step.title}</h3>
                        <p className="text-primary font-medium">Takes about {step.timeEstimate}</p>
                      </div>
                    </div>
                    
                    <p className="text-lg text-neutral-600 mb-6">{step.description}</p>
                    
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-neutral-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className="flex-1">
                    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
                      <CardContent className="p-12 text-center">
                        <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <Icon className="w-12 h-12 text-primary" />
                        </div>
                        <h4 className="text-xl font-semibold text-neutral-800 mb-2">Step {step.number}</h4>
                        <p className="text-neutral-600">{step.title}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Why Users Love Mymealify</h2>
            <p className="text-lg text-neutral-600">
              Real benefits that make a difference in your daily life and long-term health
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="text-3xl font-bold text-primary mb-2">{benefit.stat}</div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3">{benefit.title}</h3>
                  <p className="text-neutral-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Explanation */}
      <section className="py-16 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">The Science Behind Mymealify</h2>
              <p className="text-lg text-neutral-300 mb-8">
                Our AI doesn't just create random meal combinations. It uses advanced algorithms 
                and nutritional science to ensure every meal plan is optimized for your unique needs.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Machine Learning Analysis</h3>
                  <p className="text-neutral-300">
                    Processes your health data, preferences, and goals through multiple AI models 
                    to understand your unique nutritional requirements.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Nutritional Optimization</h3>
                  <p className="text-neutral-300">
                    Balances macronutrients, micronutrients, and calories while respecting 
                    your cultural food preferences and health conditions.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Continuous Learning</h3>
                  <p className="text-neutral-300">
                    Improves recommendations based on user feedback and the latest 
                    nutritional research to provide increasingly accurate meal plans.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6">What Makes Mymealify Different</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                  <span>Cultural cuisine integration</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                  <span>Health condition awareness</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                  <span>Real-time plan adaptation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                  <span>Family meal coordination</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                  <span>Professional PDF generation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-800 text-center mb-12">Common Questions</h2>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  How accurate are the AI-generated meal plans?
                </h3>
                <p className="text-neutral-600">
                  Our AI analyzes over 50 personal factors and uses evidence-based nutritional guidelines 
                  to create meal plans with 95%+ accuracy in meeting your specific dietary needs and goals.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  Can I modify the generated meal plans?
                </h3>
                <p className="text-neutral-600">
                  Yes! You can update your preferences anytime and regenerate new meal plans instantly. 
                  Our AI adapts to your changing needs and preferences.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  Is this suitable for people with medical conditions?
                </h3>
                <p className="text-neutral-600">
                  Mymealify considers common health conditions like diabetes, hypertension, and PCOS in meal planning. 
                  However, always consult your healthcare provider before making significant dietary changes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Ready to Start Your Nutrition Journey?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Join thousands of users who have transformed their health with personalized AI meal planning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-green-600 text-white px-8">
                Create Your First Plan
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}