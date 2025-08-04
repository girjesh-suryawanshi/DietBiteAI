import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Home, User, FileText, Shield, HelpCircle } from "lucide-react";

const sitemapData = [
  {
    category: "Main Pages",
    icon: Home,
    color: "text-blue-600",
    pages: [
      { name: "Home", path: "/", description: "Welcome to FitBite - AI-powered meal planning" },
      { name: "Dashboard", path: "/dashboard", description: "Personalized meal planning dashboard" },
      { name: "About Us", path: "/about", description: "Learn about FitBite's mission and team" },
      { name: "Contact Us", path: "/contact", description: "Get in touch with our support team" },
    ]
  },
  {
    category: "User Account",
    icon: User,
    color: "text-green-600",
    pages: [
      { name: "Sign In", path: "/auth", description: "Access your FitBite account" },
      { name: "Profile Setup", path: "/dashboard?step=profile", description: "Complete your health and preference profile" },
      { name: "Goal Selection", path: "/dashboard?step=goal", description: "Set your fitness and nutrition goals" },
    ]
  },
  {
    category: "Legal & Compliance",
    icon: Shield,
    color: "text-purple-600",
    pages: [
      { name: "Privacy Policy", path: "/privacy", description: "How we protect and use your personal information" },
      { name: "Terms and Conditions", path: "/terms", description: "Terms of service and user agreements" },
      { name: "Disclaimer", path: "/disclaimer", description: "Important medical and service disclaimers" },
      { name: "DMCA Policy", path: "/dmca", description: "Copyright protection and infringement procedures" },
      { name: "Cookie Policy", path: "/cookies", description: "Information about cookies and tracking technologies" },
    ]
  },
  {
    category: "Support & Resources",
    icon: HelpCircle,
    color: "text-orange-600",
    pages: [
      { name: "FAQ", path: "/faq", description: "Frequently asked questions and answers" },
      { name: "Sitemap", path: "/sitemap", description: "Complete overview of all website pages" },
    ]
  },
  {
    category: "Features",
    icon: FileText,
    color: "text-red-600",
    pages: [
      { name: "AI Meal Planning", path: "/#features", description: "Personalized meal plans using artificial intelligence" },
      { name: "Cultural Cuisines", path: "/#features", description: "Global cuisine options adapted to your preferences" },
      { name: "Health Integration", path: "/#features", description: "Meal plans considering health conditions and restrictions" },
      { name: "PDF Downloads", path: "/#features", description: "Download comprehensive meal plans as PDF documents" },
    ]
  }
];

export default function Sitemap() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => {}} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Sitemap</h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Complete overview of all pages and features available on FitBite
          </p>
        </div>

        {/* Sitemap Categories */}
        <div className="grid lg:grid-cols-2 gap-8">
          {sitemapData.map((category) => {
            const Icon = category.icon;
            
            return (
              <Card key={category.category} className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon className={`w-6 h-6 ${category.color} mr-3`} />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.pages.map((page, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4 hover:bg-neutral-50 p-3 rounded-r-lg transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-neutral-800">
                            <a 
                              href={page.path} 
                              className="hover:text-primary transition-colors"
                            >
                              {page.name}
                            </a>
                          </h3>
                          <ExternalLink className="w-4 h-4 text-neutral-400" />
                        </div>
                        <p className="text-neutral-600 text-sm mb-2">
                          {page.description}
                        </p>
                        <code className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                          {page.path}
                        </code>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* SEO Information */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>SEO & Technical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Website Structure</h3>
                <ul className="list-disc pl-6 text-neutral-700 space-y-1">
                  <li>Clean URL structure with descriptive paths</li>
                  <li>Mobile-responsive design for all devices</li>
                  <li>Fast loading times with optimized assets</li>
                  <li>Semantic HTML markup for accessibility</li>
                  <li>Meta descriptions and title tags for SEO</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Content Features</h3>
                <ul className="list-disc pl-6 text-neutral-700 space-y-1">
                  <li>AI-generated personalized meal plans</li>
                  <li>Comprehensive nutritional information</li>
                  <li>Multi-cultural cuisine support</li>
                  <li>Health condition accommodations</li>
                  <li>PDF export functionality</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center mt-12 p-6 bg-white rounded-lg border">
          <p className="text-neutral-600">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()} | 
            <strong> Total Pages:</strong> {sitemapData.reduce((total, category) => total + category.pages.length, 0)}
          </p>
          <p className="text-neutral-500 text-sm mt-2">
            This sitemap is automatically updated as new features and pages are added to FitBite.
          </p>
        </div>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Need Help Finding Something?</h3>
            <p className="text-neutral-600 mb-4">
              If you can't find what you're looking for, our support team is here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Contact Support
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}