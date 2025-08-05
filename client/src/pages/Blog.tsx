import React from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { AuthModal } from "@/components/AuthModal";
import { SEOHead } from "@/components/SEOHead";
import { useState } from "react";

export default function Blog() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const blogPosts = [
    {
      id: 1,
      title: "The Complete Guide to Mediterranean Diet for Weight Loss",
      excerpt: "Discover how the Mediterranean diet can transform your health with delicious, sustainable meal planning strategies that actually work.",
      author: "Dr. Maria Gonzalez",
      date: "January 5, 2025",
      readTime: "8 min read",
      category: "Weight Loss",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      slug: "mediterranean-diet-weight-loss-guide"
    },
    {
      id: 2,
      title: "Asian Fusion Meal Prep: 7-Day Healthy Recipe Collection",
      excerpt: "Transform your weekly meal prep with these authentic Asian fusion recipes that balance traditional flavors with modern nutrition.",
      author: "Chef David Kim",
      date: "January 3, 2025",
      readTime: "12 min read",
      category: "Meal Prep",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=800&q=80",
      slug: "asian-fusion-meal-prep-recipes"
    },
    {
      id: 3,
      title: "Managing Diabetes with Indian Cuisine: Expert Nutritionist Tips",
      excerpt: "Learn how to enjoy traditional Indian flavors while maintaining healthy blood sugar levels with these evidence-based meal strategies.",
      author: "Dr. Priya Sharma",
      date: "December 30, 2024",
      readTime: "10 min read",
      category: "Health Conditions",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
      slug: "diabetes-indian-cuisine-nutrition"
    },
    {
      id: 4,
      title: "Plant-Based African Dishes for Muscle Building",
      excerpt: "Discover protein-rich African plant-based recipes that support muscle growth and athletic performance without compromising taste.",
      author: "Nutritionist James Okonkwo",
      date: "December 28, 2024",
      readTime: "9 min read",
      category: "Muscle Building",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
      slug: "plant-based-african-muscle-building"
    },
    {
      id: 5,
      title: "Latin American Superfoods: Quinoa to Chia Seed Recipes",
      excerpt: "Explore the nutritional powerhouses of Latin America with these superfood recipes that boost energy and support overall wellness.",
      author: "Chef Isabella Rodriguez",
      date: "December 25, 2024",
      readTime: "7 min read",
      category: "Superfoods",
      image: "https://images.unsplash.com/photo-1589827548019-7d32f8f67f63?auto=format&fit=crop&w=800&q=80",
      slug: "latin-american-superfoods-recipes"
    },
    {
      id: 6,
      title: "Intermittent Fasting with Middle Eastern Cuisine",
      excerpt: "Optimize your intermittent fasting journey with nutrient-dense Middle Eastern meals that support your fasting and eating windows.",
      author: "Dr. Omar Al-Hassan",
      date: "December 22, 2024",
      readTime: "11 min read",
      category: "Intermittent Fasting",
      image: "https://images.unsplash.com/photo-1599048062351-6e081b8779d1?auto=format&fit=crop&w=800&q=80",
      slug: "intermittent-fasting-middle-eastern-cuisine"
    },
    {
      id: 7,
      title: "Gluten-Free European Comfort Foods You'll Actually Love",
      excerpt: "Enjoy classic European comfort foods without gluten using these tested recipes that maintain authentic flavors and textures.",
      author: "Chef Antoine Dubois",
      date: "December 20, 2024",
      readTime: "8 min read",
      category: "Gluten-Free",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
      slug: "gluten-free-european-comfort-foods"
    },
    {
      id: 8,
      title: "Keto-Friendly Thai and Vietnamese Dishes",
      excerpt: "Navigate the ketogenic diet while enjoying bold Southeast Asian flavors with these low-carb, high-fat recipe adaptations.",
      author: "Nutritionist Lisa Chen",
      date: "December 18, 2024",
      readTime: "9 min read",
      category: "Keto Diet",
      image: "https://images.unsplash.com/photo-1559314809-0f31657def5e?auto=format&fit=crop&w=800&q=80",
      slug: "keto-thai-vietnamese-recipes"
    },
    {
      id: 9,
      title: "Postpartum Nutrition: Global Recovery Recipes for New Moms",
      excerpt: "Support your postpartum recovery with nourishing recipes from around the world designed specifically for new mothers' nutritional needs.",
      author: "Dr. Sarah Williams",
      date: "December 15, 2024",
      readTime: "12 min read",
      category: "Maternal Health",
      image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80",
      slug: "postpartum-nutrition-global-recipes"
    },
    {
      id: 10,
      title: "Budget-Friendly Healthy Meals: International Edition",
      excerpt: "Eat healthy on a budget with these affordable international recipes that prove nutritious meals don't have to break the bank.",
      author: "Chef Michael Thompson",
      date: "December 12, 2024",
      readTime: "10 min read",
      category: "Budget Meals",
      image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80",
      slug: "budget-friendly-healthy-international-meals"
    },
    {
      id: 11,
      title: "Senior Nutrition: Easy-to-Digest Global Cuisine Adaptations",
      excerpt: "Maintain proper nutrition in your golden years with these gentle, easy-to-digest adaptations of beloved international dishes.",
      author: "Geriatrician Dr. Helen Park",
      date: "December 10, 2024",
      readTime: "8 min read",
      category: "Senior Health",
      image: "https://images.unsplash.com/photo-1573225342350-16731dd9bf3d?auto=format&fit=crop&w=800&q=80",
      slug: "senior-nutrition-global-cuisine"
    },
    {
      id: 12,
      title: "Athletic Performance: Scandinavian and Nordic Diet Secrets",
      excerpt: "Unlock the athletic performance secrets of Scandinavian athletes with these Nordic diet principles and performance-enhancing recipes.",
      author: "Sports Nutritionist Erik Larsson",
      date: "December 8, 2024",
      readTime: "11 min read",
      category: "Athletic Performance",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
      slug: "scandinavian-nordic-athletic-performance"
    },
    {
      id: 13,
      title: "Heart-Healthy Recipes from the Blue Zones",
      excerpt: "Discover longevity secrets from the world's Blue Zones with these heart-healthy recipes that promote cardiovascular wellness.",
      author: "Cardiologist Dr. Roberto Silva",
      date: "December 5, 2024",
      readTime: "9 min read",
      category: "Heart Health",
      image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=800&q=80",
      slug: "heart-healthy-blue-zones-recipes"
    },
    {
      id: 14,
      title: "Anti-Inflammatory Foods: Global Spices and Herbs Guide",
      excerpt: "Harness the anti-inflammatory power of global spices and herbs with this comprehensive guide to natural healing through food.",
      author: "Herbalist Dr. Amira Patel",
      date: "December 3, 2024",
      readTime: "10 min read",
      category: "Anti-Inflammatory",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
      slug: "anti-inflammatory-global-spices-herbs"
    },
    {
      id: 15,
      title: "Kids' Nutrition: Making International Foods Fun and Healthy",
      excerpt: "Get your kids excited about healthy eating with these fun, nutritious international recipes designed specifically for young palates.",
      author: "Pediatric Nutritionist Dr. Jenny Liu",
      date: "November 30, 2024",
      readTime: "8 min read",
      category: "Kids Nutrition",
      image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=800&q=80",
      slug: "kids-nutrition-international-foods"
    },
    {
      id: 16,
      title: "Meal Planning for Shift Workers: 24/7 Nutrition Strategies",
      excerpt: "Master nutrition as a shift worker with these flexible meal planning strategies that adapt to any schedule and boost energy levels.",
      author: "Occupational Health Dr. Mark Foster",
      date: "November 28, 2024",
      readTime: "11 min read",
      category: "Shift Work Nutrition",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      slug: "shift-worker-meal-planning-strategies"
    },
    {
      id: 17,
      title: "Digestive Health: Fermented Foods from Around the World",
      excerpt: "Improve your gut health with these traditional fermented foods from different cultures, complete with recipes and health benefits.",
      author: "Gastroenterologist Dr. Sofia Petrova",
      date: "November 25, 2024",
      readTime: "9 min read",
      category: "Digestive Health",
      image: "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?auto=format&fit=crop&w=800&q=80",
      slug: "fermented-foods-digestive-health"
    },
    {
      id: 18,
      title: "Seasonal Eating: Adapting Global Cuisines to Local Ingredients",
      excerpt: "Learn how to adapt your favorite international recipes using seasonal, local ingredients for optimal nutrition and sustainability.",
      author: "Sustainable Chef Alex Green",
      date: "November 22, 2024",
      readTime: "10 min read",
      category: "Seasonal Eating",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
      slug: "seasonal-eating-global-cuisines"
    },
    {
      id: 19,
      title: "Mental Health and Nutrition: Brain-Boosting Global Foods",
      excerpt: "Discover how traditional brain-boosting foods from around the world can support mental clarity, mood, and cognitive function.",
      author: "Neuropsychologist Dr. Rachel Kim",
      date: "November 20, 2024",
      readTime: "12 min read",
      category: "Mental Health",
      image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800&q=80",
      slug: "mental-health-brain-boosting-foods"
    },
    {
      id: 20,
      title: "Travel Nutrition: Staying Healthy While Exploring Global Cuisines",
      excerpt: "Maintain your health goals while traveling with these expert tips for navigating international cuisines and local food scenes.",
      author: "Travel Health Dr. Amanda Walsh",
      date: "November 18, 2024",
      readTime: "8 min read",
      category: "Travel Nutrition",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      slug: "travel-nutrition-global-cuisines"
    }
  ];

  const categories = [
    "All Posts",
    "Weight Loss",
    "Meal Prep", 
    "Health Conditions",
    "Muscle Building",
    "Superfoods",
    "Intermittent Fasting",
    "Gluten-Free",
    "Keto Diet",
    "Maternal Health",
    "Budget Meals",
    "Senior Health",
    "Athletic Performance",
    "Heart Health",
    "Anti-Inflammatory",
    "Kids Nutrition",
    "Shift Work Nutrition",
    "Digestive Health",
    "Seasonal Eating",
    "Mental Health",
    "Travel Nutrition"
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Posts");

  const filteredPosts = selectedCategory === "All Posts" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "FitBite Health & Nutrition Blog",
    "description": "Expert nutrition advice, global healthy recipes, meal planning tips, and diet strategies from certified nutritionists.",
    "url": "https://fitbite.app/blog",
    "publisher": {
      "@type": "Organization",
      "name": "FitBite",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fitbite.app/logo.png"
      }
    },
    "blogPost": blogPosts.slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "datePublished": new Date(post.date).toISOString(),
      "url": `https://fitbite.app/blog/${post.slug}`,
      "image": post.image,
      "publisher": {
        "@type": "Organization",
        "name": "FitBite"
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="FitBite Health & Nutrition Blog - Expert Diet Tips & Global Recipes"
        description="Discover expert nutrition advice, global healthy recipes, meal planning tips, and diet strategies from certified nutritionists. Transform your health with culturally diverse, science-backed nutrition content."
        keywords="nutrition blog, healthy recipes, meal planning, diet tips, global cuisine, weight loss, muscle building, health conditions, nutritionist advice, international food, cultural diet, personalized nutrition"
        canonical="https://fitbite.app/blog"
        structuredData={structuredData}
      />
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      


      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-800 mb-6">
              Health & Nutrition <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto mb-8">
              Expert nutrition advice, global healthy recipes, and evidence-based diet strategies from certified nutritionists and health professionals worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.slice(0, 8).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category 
                      ? "bg-primary text-white" 
                      : "text-neutral-600 border-neutral-300 hover:border-primary"
                  } rounded-full`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-neutral-500 text-sm">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{post.author}</p>
                        <p className="text-xs text-neutral-500">{post.date}</p>
                      </div>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Read More →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            Stay Updated with Latest Nutrition Tips
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Get weekly expert nutrition advice, healthy recipes, and meal planning tips delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button className="bg-primary hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-neutral-500 mt-4">
            No spam, unsubscribe at any time. Your privacy is protected.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-2">
                  <i className="fas fa-apple-alt text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold">FitBite</span>
              </div>
              <p className="text-neutral-400 text-sm">
                AI-powered global diet planner helping you achieve your health goals with personalized nutrition.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-neutral-400 hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/features" className="text-neutral-400 hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="/about" className="text-neutral-400 hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-neutral-400 hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="text-neutral-400 hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/faq" className="text-neutral-400 hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/privacy" className="text-neutral-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-neutral-400 hover:text-primary transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
            <p className="text-neutral-400 text-sm">
              © 2025 FitBite. All rights reserved. | Empowering healthier lives through personalized nutrition.
            </p>
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