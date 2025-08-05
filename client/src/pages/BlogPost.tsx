import React from "react";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { AuthModal } from "@/components/AuthModal";
import { useState } from "react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Blog posts data (in a real app, this would come from a CMS or database)
  const blogPosts = {
    "mediterranean-diet-weight-loss-guide": {
      title: "The Complete Guide to Mediterranean Diet for Weight Loss",
      content: `
        <h2>Introduction to the Mediterranean Diet</h2>
        <p>The Mediterranean diet is more than just a way of eating—it's a lifestyle approach that has been scientifically proven to promote weight loss, heart health, and longevity. Based on the traditional eating patterns of countries bordering the Mediterranean Sea, this diet emphasizes whole foods, healthy fats, and fresh ingredients.</p>

        <h2>Key Principles of the Mediterranean Diet</h2>
        <p>The Mediterranean diet is characterized by:</p>
        <ul>
          <li><strong>Olive oil</strong> as the primary source of dietary fat</li>
          <li><strong>Fish and seafood</strong> consumed regularly</li>
          <li><strong>Fruits and vegetables</strong> forming the foundation of meals</li>
          <li><strong>Whole grains</strong> instead of refined carbohydrates</li>
          <li><strong>Nuts and legumes</strong> as protein sources</li>
          <li><strong>Moderate wine consumption</strong> with meals (optional)</li>
        </ul>

        <h2>Weight Loss Benefits</h2>
        <p>Research shows that the Mediterranean diet can lead to significant weight loss while providing numerous health benefits:</p>
        <ul>
          <li>Reduced inflammation in the body</li>
          <li>Improved insulin sensitivity</li>
          <li>Better satiety from healthy fats and fiber</li>
          <li>Lower risk of metabolic syndrome</li>
        </ul>

        <h2>7-Day Mediterranean Meal Plan</h2>
        <h3>Day 1</h3>
        <p><strong>Breakfast:</strong> Greek yogurt with berries and nuts<br>
        <strong>Lunch:</strong> Mediterranean quinoa salad with chickpeas<br>
        <strong>Dinner:</strong> Grilled salmon with roasted vegetables</p>

        <h3>Day 2</h3>
        <p><strong>Breakfast:</strong> Avocado toast with tomatoes and feta<br>
        <strong>Lunch:</strong> Lentil soup with whole grain bread<br>
        <strong>Dinner:</strong> Baked chicken with herbs and olive oil</p>

        <h2>Tips for Success</h2>
        <p>To maximize your weight loss success on the Mediterranean diet:</p>
        <ol>
          <li>Focus on portion control, even with healthy foods</li>
          <li>Stay hydrated with water and herbal teas</li>
          <li>Include physical activity in your daily routine</li>
          <li>Plan your meals in advance</li>
          <li>Choose seasonal, local ingredients when possible</li>
        </ol>

        <h2>Conclusion</h2>
        <p>The Mediterranean diet offers a sustainable approach to weight loss that doesn't feel like restrictive dieting. By focusing on whole, nutritious foods and healthy lifestyle habits, you can achieve your weight loss goals while improving your overall health and well-being.</p>
      `,
      author: "Dr. Maria Gonzalez",
      date: "January 5, 2025",
      readTime: "8 min read",
      category: "Weight Loss",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80"
    },
    "asian-fusion-meal-prep-recipes": {
      title: "Asian Fusion Meal Prep: 7-Day Healthy Recipe Collection",
      content: `
        <h2>Introduction to Asian Fusion Meal Prep</h2>
        <p>Asian fusion cuisine combines traditional Asian flavors with modern cooking techniques and ingredients from other cultures. This approach to meal prep allows you to enjoy diverse, exciting flavors while maintaining a healthy, balanced diet throughout the week.</p>

        <h2>Benefits of Asian Fusion Meal Prep</h2>
        <ul>
          <li>Rich in vegetables and lean proteins</li>
          <li>Incorporates umami flavors for satisfaction</li>
          <li>Uses healthy cooking methods like steaming and stir-frying</li>
          <li>Provides variety to prevent meal prep boredom</li>
        </ul>

        <h2>Essential Ingredients for Asian Fusion Meal Prep</h2>
        <h3>Pantry Staples:</h3>
        <ul>
          <li>Soy sauce, tamari, and coconut aminos</li>
          <li>Rice vinegar and mirin</li>
          <li>Sesame oil and avocado oil</li>
          <li>Fresh ginger and garlic</li>
          <li>Brown rice, quinoa, and rice noodles</li>
        </ul>

        <h2>7-Day Meal Prep Plan</h2>
        <h3>Day 1-2: Korean-Inspired Bowl</h3>
        <p><strong>Protein:</strong> Marinated tofu with gochujang<br>
        <strong>Base:</strong> Brown rice<br>
        <strong>Vegetables:</strong> Steamed broccoli, carrots, and kimchi<br>
        <strong>Sauce:</strong> Sesame-soy dressing</p>

        <h3>Day 3-4: Thai-Mexican Fusion</h3>
        <p><strong>Protein:</strong> Lime-cilantro chicken<br>
        <strong>Base:</strong> Cauliflower rice<br>
        <strong>Vegetables:</strong> Bell peppers, snap peas, and corn<br>
        <strong>Sauce:</strong> Peanut-lime sauce</p>

        <h3>Day 5-7: Japanese-Mediterranean Bowl</h3>
        <p><strong>Protein:</strong> Miso-glazed salmon<br>
        <strong>Base:</strong> Quinoa<br>
        <strong>Vegetables:</strong> Cucumber, edamame, and cherry tomatoes<br>
        <strong>Sauce:</strong> Tahini-miso dressing</p>

        <h2>Meal Prep Tips</h2>
        <ol>
          <li>Cook grains and proteins in batches</li>
          <li>Prepare vegetables but store separately</li>
          <li>Make sauces fresh for best flavor</li>
          <li>Use glass containers for easy reheating</li>
          <li>Label containers with dates and contents</li>
        </ol>
      `,
      author: "Chef David Kim",
      date: "January 3, 2025",
      readTime: "12 min read",
      category: "Meal Prep",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1200&q=80"
    },
    "diabetes-indian-cuisine-nutrition": {
      title: "Managing Diabetes with Indian Cuisine: Expert Nutritionist Tips",
      content: `
        <h2>Understanding Diabetes and Indian Food</h2>
        <p>Managing diabetes doesn't mean giving up the rich, flavorful foods of Indian cuisine. With proper knowledge and planning, you can enjoy traditional Indian dishes while maintaining healthy blood sugar levels.</p>

        <h2>Key Principles for Diabetic-Friendly Indian Cooking</h2>
        <ul>
          <li>Portion control with complex carbohydrates</li>
          <li>Emphasis on protein and fiber</li>
          <li>Using healthy cooking methods</li>
          <li>Incorporating diabetes-friendly spices</li>
        </ul>

        <h2>Diabetic-Friendly Indian Ingredients</h2>
        <h3>Grains and Legumes:</h3>
        <ul>
          <li>Brown rice instead of white rice</li>
          <li>Quinoa and millet</li>
          <li>Chickpeas, lentils, and black beans</li>
          <li>Barley and oats</li>
        </ul>

        <h3>Beneficial Spices:</h3>
        <ul>
          <li>Turmeric (anti-inflammatory)</li>
          <li>Cinnamon (blood sugar regulation)</li>
          <li>Fenugreek (glucose metabolism)</li>
          <li>Cumin (digestive health)</li>
        </ul>

        <h2>Sample Diabetic-Friendly Indian Meals</h2>
        <h3>Breakfast Options:</h3>
        <ul>
          <li>Vegetable upma with quinoa</li>
          <li>Moong dal chilla with vegetables</li>
          <li>Oats poha with nuts</li>
        </ul>

        <h3>Lunch/Dinner Options:</h3>
        <ul>
          <li>Dal with brown rice (small portion)</li>
          <li>Grilled tandoori chicken with vegetables</li>
          <li>Mixed vegetable curry with roti</li>
        </ul>

        <h2>Cooking Modifications</h2>
        <p>Simple modifications can make traditional dishes diabetes-friendly:</p>
        <ol>
          <li>Reduce oil and ghee usage</li>
          <li>Use natural sweeteners like stevia</li>
          <li>Increase vegetable content</li>
          <li>Choose lean proteins</li>
          <li>Steam or grill instead of deep frying</li>
        </ol>

        <h2>Blood Sugar Management Tips</h2>
        <ul>
          <li>Eat smaller, frequent meals</li>
          <li>Monitor carbohydrate intake</li>
          <li>Stay hydrated with water and herbal teas</li>
          <li>Include physical activity after meals</li>
          <li>Regular blood sugar monitoring</li>
        </ul>
      `,
      author: "Dr. Priya Sharma",
      date: "December 30, 2024",
      readTime: "10 min read",
      category: "Health Conditions",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80"
    }
  };

  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onShowAuth={() => setShowAuthModal(true)} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Post Not Found</h1>
          <p className="text-xl text-neutral-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button className="bg-primary hover:bg-green-600 text-white px-6 py-3 rounded-full">
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "publisher": {
      "@type": "Organization",
      "name": "FitBite",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fitbite.app/logo.png"
      }
    },
    "image": post.image,
    "url": `https://fitbite.app/blog/${slug}`,
    "description": post.content.substring(0, 160) + "...",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://fitbite.app/blog/${slug}`
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${post.title} | FitBite Blog`}
        description={post.content.replace(/<[^>]*>/g, '').substring(0, 160)}
        keywords={`${post.category.toLowerCase()}, nutrition, healthy recipes, meal planning, diet tips`}
        canonical={`https://fitbite.app/blog/${slug}`}
        ogType="article"
        articleAuthor={post.author}
        articlePublishedTime={new Date(post.date).toISOString()}
        structuredData={structuredData}
      />
      
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      
      {/* Hero Image */}
      <div className="w-full h-64 md:h-96 overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/blog">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                ← Back to Blog
              </Button>
            </Link>
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between text-neutral-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-neutral-800">{post.author}</p>
                  <p className="text-sm text-neutral-500">{post.date}</p>
                </div>
              </div>
            </div>
            <span className="text-sm">{post.readTime}</span>
          </div>
        </header>

        {/* Article Body */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-neutral-800 prose-p:text-neutral-700 prose-strong:text-neutral-800 prose-ul:text-neutral-700 prose-ol:text-neutral-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-sm text-neutral-500 mb-2">Enjoyed this article?</p>
              <Link href="/blog">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Read More Articles
                </Button>
              </Link>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm text-neutral-500 mb-2">Ready to start your journey?</p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-full"
              >
                Get Your Meal Plan
              </Button>
            </div>
          </div>
        </footer>
      </article>

      {/* Related Articles */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-800 text-center mb-8">Related Articles</h2>
          <div className="text-center">
            <Link href="/blog">
              <Button className="bg-primary hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg">
                View All Blog Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}