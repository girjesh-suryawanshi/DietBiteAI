import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Heart, Award } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => {}} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">About Mymealify</h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Revolutionizing personalized nutrition through AI-powered meal planning for a healthier world
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-neutral-800">Our Mission</h2>
            </div>
            <p className="text-neutral-700 text-lg leading-relaxed">
              At Mymealify, we believe that proper nutrition should be accessible, personalized, and enjoyable for everyone. 
              Our mission is to democratize healthy eating by providing AI-powered meal planning that adapts to individual 
              health conditions, dietary preferences, and cultural cuisines. We're committed to making nutrition science 
              simple and actionable for people worldwide.
            </p>
          </CardContent>
        </Card>

        {/* Story Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Heart className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-neutral-800">Our Story</h2>
            </div>
            <p className="text-neutral-700 text-lg leading-relaxed mb-4">
              Mymealify was born from the recognition that one-size-fits-all nutrition advice doesn't work in our diverse world. 
              Traditional meal planning often ignores individual health conditions, cultural food preferences, and lifestyle constraints 
              that make sustainable healthy eating challenging.
            </p>
            <p className="text-neutral-700 text-lg leading-relaxed">
              Our team of nutrition experts, AI researchers, and software engineers came together to create a solution that 
              considers your unique health profile, cultural background, and personal preferences to generate meal plans 
              that are not just healthy, but also practical and enjoyable.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Award className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-neutral-800">Our Values</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Personalization</h3>
                <p className="text-neutral-700">Every individual has unique nutritional needs, and our AI adapts to provide truly personalized recommendations.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Cultural Inclusivity</h3>
                <p className="text-neutral-700">We celebrate food diversity and ensure our meal plans respect and incorporate global cuisines and traditions.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Scientific Accuracy</h3>
                <p className="text-neutral-700">Our recommendations are based on the latest nutrition science and evidence-based dietary guidelines.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Accessibility</h3>
                <p className="text-neutral-700">Healthy eating should be available to everyone, regardless of their technical expertise or nutritional knowledge.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-neutral-800">Our Team</h2>
            </div>
            <p className="text-neutral-700 text-lg leading-relaxed">
              Mymealify is powered by a diverse team of nutritionists, dietitians, AI researchers, and software engineers 
              from around the world. Our multidisciplinary approach ensures that our platform combines cutting-edge 
              technology with sound nutritional science and cultural sensitivity. We're passionate about using technology 
              to solve real-world health challenges and make a positive impact on people's lives.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}