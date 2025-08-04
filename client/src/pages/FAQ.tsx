import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, HelpCircle, Search, Utensils, CreditCard, Shield, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";

const faqData = [
  {
    category: "Getting Started",
    icon: HelpCircle,
    color: "text-blue-600",
    questions: [
      {
        question: "How does FitBite work?",
        answer: "FitBite uses advanced AI to create personalized meal plans based on your health profile, dietary preferences, cultural cuisine choices, and fitness goals. Simply complete our 5-step onboarding process, and our AI will generate a customized weekly meal plan with recipes, ingredients, and nutritional information."
      },
      {
        question: "What information do I need to provide to get started?",
        answer: "You'll need to provide basic information including your age, gender, height, weight, activity level, health conditions, dietary preferences, cultural cuisine choices, and fitness goals. This helps our AI create the most accurate and personalized meal plans for you."
      },
      {
        question: "Is FitBite suitable for beginners?",
        answer: "Absolutely! FitBite is designed for people of all experience levels. Our AI creates meal plans with detailed recipes and cooking instructions, making it easy for anyone to follow healthy nutrition guidelines regardless of their cooking experience."
      },
      {
        question: "How long does it take to set up my profile?",
        answer: "The initial profile setup takes about 5-10 minutes. You'll go through 5 simple steps covering personal information, physical stats, lifestyle preferences, health conditions, and food preferences."
      }
    ]
  },
  {
    category: "Meal Plans & Nutrition",
    icon: Utensils,
    color: "text-green-600",
    questions: [
      {
        question: "How personalized are the meal plans?",
        answer: "Our meal plans are highly personalized, considering your specific health conditions, dietary restrictions, cultural food preferences, activity level, and fitness goals. The AI adapts recipes and portions to match your individual nutritional needs."
      },
      {
        question: "Can I generate multiple meal plans?",
        answer: "Yes! You can generate unlimited meal plans. If you want to try different cuisines, update your goals, or simply want variety, you can create new meal plans anytime by updating your preferences."
      },
      {
        question: "What cuisines are supported?",
        answer: "FitBite supports a wide variety of global cuisines including Indian, American, Mediterranean, Asian, Italian, Mexican, Middle Eastern, and European cuisines. Our AI adapts recipes to maintain cultural authenticity while meeting your nutritional needs."
      },
      {
        question: "How do you handle food allergies and dietary restrictions?",
        answer: "During setup, you can specify any food allergies, intolerances, or dietary restrictions (vegetarian, vegan, keto, etc.). Our AI will exclude these ingredients and suggest suitable alternatives in your meal plans."
      },
      {
        question: "Are the nutritional calculations accurate?",
        answer: "We use comprehensive nutritional databases and calculate values based on standard serving sizes and ingredients. However, nutritional values may vary based on specific brands, preparation methods, and ingredient substitutions."
      },
      {
        question: "Can I download my meal plans?",
        answer: "Yes! You can download your meal plans as PDF documents that include your complete profile information, meal schedule, recipes, ingredients, and nutritional information. These PDFs are perfect for sharing with healthcare providers or printing for reference."
      }
    ]
  },
  {
    category: "Account & Settings",
    icon: Settings,
    color: "text-purple-600",
    questions: [
      {
        question: "How do I update my dietary preferences?",
        answer: "You can update your preferences anytime by clicking 'Generate New Plan' which takes you back to the profile setup. You can modify your health conditions, dietary restrictions, cuisine preferences, or fitness goals and generate a new personalized meal plan."
      },
      {
        question: "Can I share my meal plans with others?",
        answer: "Yes, you can share your meal plans with family members, friends, or healthcare providers. The PDF download feature makes it easy to share comprehensive meal planning information."
      },
      {
        question: "How do I delete my account?",
        answer: "To delete your account, contact our support team at support@fitbite.com with your account email and deletion request. We'll process your request within 24-48 hours and permanently remove your personal information."
      },
      {
        question: "Is my personal information secure?",
        answer: "Yes, we take data security seriously. We use industry-standard encryption, secure servers, and strict access controls to protect your personal information. We never sell your data to third parties."
      }
    ]
  },
  {
    category: "Technical Support",
    icon: Shield,
    color: "text-orange-600",
    questions: [
      {
        question: "Why isn't my meal plan showing after generation?",
        answer: "If your meal plan doesn't appear immediately, try refreshing the page. If the issue persists, check your internet connection and ensure you've completed all required profile steps. Contact support if the problem continues."
      },
      {
        question: "The website is loading slowly. What should I do?",
        answer: "Slow loading can be caused by internet connectivity issues or high server traffic. Try refreshing the page, clearing your browser cache, or accessing the site during off-peak hours. Contact support if problems persist."
      },
      {
        question: "I can't log in to my account. What should I do?",
        answer: "First, ensure you're using the correct email and password. Try resetting your password if needed. Clear your browser cache and cookies, or try logging in from a different browser or device. Contact support if you continue experiencing issues."
      },
      {
        question: "Are there mobile apps available?",
        answer: "Currently, FitBite is available as a responsive web application that works on all devices including smartphones and tablets. A dedicated mobile app may be available in the future."
      }
    ]
  },
  {
    category: "Billing & Pricing",
    icon: CreditCard,
    color: "text-red-600",
    questions: [
      {
        question: "Is FitBite free to use?",
        answer: "FitBite offers both free and premium features. Basic meal plan generation is available for free users, while premium features may include advanced customization options, additional cuisines, and enhanced support."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards (Visa, Mastercard, American Express) and PayPal for premium subscriptions. All payments are processed securely through encrypted payment gateways."
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your premium subscription at any time from your account settings. Your premium features will remain active until the end of your current billing period."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer refunds within 30 days of purchase if you're not satisfied with our premium features. Contact our support team to request a refund and provide details about your experience."
      }
    ]
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (category: string) => {
    setOpenSections(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredData = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => {}} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            Find answers to common questions about FitBite's AI-powered meal planning service
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredData.map((category) => {
            const Icon = category.icon;
            const isOpen = openSections.includes(category.category);
            
            return (
              <Card key={category.category} className="overflow-hidden">
                <Collapsible>
                  <CollapsibleTrigger 
                    className="w-full"
                    onClick={() => toggleSection(category.category)}
                  >
                    <div className="flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center">
                        <Icon className={`w-8 h-8 ${category.color} mr-4`} />
                        <h2 className="text-2xl font-bold text-neutral-800">{category.category}</h2>
                        <span className="ml-3 text-sm text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                          {category.questions.length} questions
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-6 h-6 text-neutral-600" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-neutral-600" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-6 pb-6 space-y-4">
                      {category.questions.map((faq, index) => (
                        <div key={index} className="border-l-4 border-primary pl-4">
                          <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                            {faq.question}
                          </h3>
                          <p className="text-neutral-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredData.length === 0 && searchTerm && (
          <Card className="mt-8">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">No results found</h3>
              <p className="text-neutral-600 mb-4">
                No questions match your search term "{searchTerm}". Try different keywords or browse our categories above.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Contact Support */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-neutral-800 mb-4">Still need help?</h3>
            <p className="text-neutral-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="mailto:support@fitbite.com" 
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Email us directly
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}