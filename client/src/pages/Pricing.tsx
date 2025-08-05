import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, X, Star, Zap, Crown, Gift } from "lucide-react";

const plans = [
  {
    name: "Free",
    icon: Gift,
    price: "0",
    period: "forever",
    description: "Perfect for getting started with AI meal planning",
    features: [
      { name: "3 meal plans per month", included: true },
      { name: "Basic AI meal generation", included: true },
      { name: "5 global cuisines", included: true },
      { name: "PDF download", included: true },
      { name: "Basic health conditions", included: true },
      { name: "Email support", included: true },
      { name: "Unlimited meal plans", included: false },
      { name: "Premium cuisines", included: false },
      { name: "Advanced health integration", included: false },
      { name: "Priority support", included: false },
      { name: "Family sharing", included: false },
      { name: "Nutrition analytics", included: false }
    ],
    cta: "Get Started Free",
    popular: false,
    color: "border-neutral-200"
  },
  {
    name: "Pro",
    icon: Zap,
    price: "9.99",
    period: "per month",
    description: "For serious health enthusiasts who want unlimited access",
    features: [
      { name: "Unlimited meal plans", included: true },
      { name: "Advanced AI meal generation", included: true },
      { name: "15+ global cuisines", included: true },
      { name: "Premium PDF templates", included: true },
      { name: "All health conditions", included: true },
      { name: "Priority email support", included: true },
      { name: "Family sharing (up to 4)", included: true },
      { name: "Nutrition analytics", included: true },
      { name: "Recipe customization", included: true },
      { name: "Meal prep planning", included: true },
      { name: "Shopping list optimization", included: false },
      { name: "Live chat support", included: false }
    ],
    cta: "Start Pro Trial",
    popular: true,
    color: "border-primary ring-2 ring-primary"
  },
  {
    name: "Premium",
    icon: Crown,
    price: "19.99",
    period: "per month",
    description: "Ultimate experience with all features and premium support",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Unlimited family sharing", included: true },
      { name: "Live chat support", included: true },
      { name: "Phone support", included: true },
      { name: "Shopping list optimization", included: true },
      { name: "Nutritionist consultation", included: true },
      { name: "Custom recipe creation", included: true },
      { name: "Advanced analytics", included: true },
      { name: "API access", included: true },
      { name: "White-label options", included: true },
      { name: "Early feature access", included: true },
      { name: "Dedicated account manager", included: true }
    ],
    cta: "Go Premium",
    popular: false,
    color: "border-purple-200"
  }
];

const faq = [
  {
    question: "Can I change my plan anytime?",
    answer: "Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at your next billing cycle."
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Yes, we offer a 14-day free trial for both Pro and Premium plans. No credit card required to start."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. All payments are secure and encrypted."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund within 30 days of purchase."
  },
  {
    question: "How does family sharing work?",
    answer: "Family sharing allows multiple household members to create their own profiles and meal plans under one subscription. Each person gets personalized recommendations."
  },
  {
    question: "Can I use FitBite offline?",
    answer: "While you need internet to generate new meal plans, you can download PDFs for offline access to your recipes and shopping lists."
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Busy Mom of 3",
    content: "FitBite Pro has saved me hours every week. The family sharing feature means everyone gets meals they love while staying healthy.",
    rating: 5
  },
  {
    name: "Dr. Michael Rodriguez", 
    role: "Cardiologist",
    content: "I recommend FitBite Premium to my patients. The health condition integration is impressive and helps them stick to heart-healthy diets.",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "Fitness Enthusiast", 
    content: "The unlimited meal plans in Pro let me experiment with different cuisines while maintaining my fitness goals. Love the Indian cuisine options!",
    rating: 5
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => {}} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 mb-4 sm:mb-6 leading-tight">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Choose the perfect plan for your nutrition journey. Start free and upgrade as your needs grow. 
            No hidden fees, cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-neutral-600">
            <div className="flex items-center">
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary mr-2" />
              No setup fees
            </div>
            <div className="flex items-center">
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <Card key={index} className={`relative ${plan.color} hover:shadow-lg transition-shadow`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <div className="flex items-center justify-center mb-4">
                      <Icon className={`w-8 h-8 ${plan.popular ? 'text-primary' : 'text-neutral-600'}`} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-neutral-800">${plan.price}</span>
                      <span className="text-neutral-600">/{plan.period}</span>
                    </div>
                    <p className="text-neutral-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <Button 
                      className={`w-full mb-8 ${
                        plan.popular 
                          ? 'bg-primary hover:bg-green-600 text-white' 
                          : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                      }`}
                      asChild
                    >
                      <Link href="/dashboard">{plan.cta}</Link>
                    </Button>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-neutral-400 mr-3 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? 'text-neutral-700' : 'text-neutral-400'}`}>
                            {feature.name}
                          </span>
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

      {/* Feature Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Why Choose Paid Plans?</h2>
            <p className="text-lg text-neutral-600">
              Unlock advanced features and unlimited access to transform your nutrition journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Unlimited Generation</h3>
                <p className="text-neutral-600">
                  Create as many meal plans as you want. Perfect for experimenting with different cuisines and adapting to changing needs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Premium Features</h3>
                <p className="text-neutral-600">
                  Access advanced health integration, nutrition analytics, family sharing, and priority support for the best experience.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Expert Support</h3>
                <p className="text-neutral-600">
                  Get priority support, nutritionist consultations, and early access to new features to maximize your results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-neutral-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-neutral-300">
              Real experiences from people who've transformed their nutrition with FitBite
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 border-white/20 text-white">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-200 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-neutral-400">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-neutral-600">
              Everything you need to know about FitBite pricing and features
            </p>
          </div>

          <div className="space-y-6">
            {faq.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-neutral-600">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-lg mb-8 text-green-100">
            Looking for enterprise features, custom integrations, or bulk pricing? 
            We offer tailored solutions for healthcare providers, corporations, and institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-neutral-100 px-8">
                Contact Sales
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" className="bg-neutral-800 hover:bg-neutral-700 text-white px-8">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}