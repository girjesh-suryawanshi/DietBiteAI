import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Heart, Users, Shield } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => {}} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Disclaimer</h1>
          <p className="text-lg text-neutral-600">
            Important information about FitBite's services and limitations
          </p>
        </div>

        {/* Medical Disclaimer */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
              <h2 className="text-2xl font-bold text-orange-800">Medical Disclaimer</h2>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-orange-200">
              <p className="text-neutral-800 font-semibold text-lg mb-4">
                FitBite is NOT a medical service and does NOT provide medical advice.
              </p>
              <p className="text-neutral-700 mb-4">
                The information provided by FitBite, including AI-generated meal plans, nutritional guidance, 
                and dietary recommendations, is for general informational and educational purposes only. 
                This information is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p className="text-neutral-700 mb-4">
                <strong>Always seek the advice of your physician or other qualified healthcare provider</strong> 
                before starting any new diet, nutrition program, or making significant changes to your eating habits, 
                especially if you have:
              </p>
              <ul className="list-disc pl-6 text-neutral-700 mb-4">
                <li>Existing medical conditions (diabetes, heart disease, kidney disease, etc.)</li>
                <li>Food allergies or intolerances</li>
                <li>Eating disorders or history of disordered eating</li>
                <li>Are pregnant, breastfeeding, or planning to become pregnant</li>
                <li>Are taking medications that may interact with dietary changes</li>
                <li>Are under 18 years of age</li>
              </ul>
              <p className="text-neutral-700 font-semibold">
                Never disregard professional medical advice or delay seeking medical treatment because of 
                information provided by FitBite.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI-Generated Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Heart className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-neutral-800">AI-Generated Content Disclaimer</h2>
            </div>
            <p className="text-neutral-700 mb-4">
              FitBite uses artificial intelligence algorithms to generate personalized meal plans and nutritional recommendations. 
              While our AI is trained on extensive nutritional data and guidelines, it may not account for all individual 
              circumstances or the latest research.
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4">
              <li>AI recommendations are based on general nutritional principles and user-provided information</li>
              <li>The AI cannot replace personalized advice from qualified nutritionists or dietitians</li>
              <li>Meal plans may not be suitable for all individuals or specific medical conditions</li>
              <li>Users should verify nutritional information and ingredient suitability independently</li>
            </ul>
          </CardContent>
        </Card>

        {/* Accuracy Disclaimer */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-neutral-800">Information Accuracy</h2>
            </div>
            <p className="text-neutral-700 mb-4">
              While we strive to provide accurate nutritional information and meal recommendations:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4">
              <li>Nutritional values are estimates and may vary based on specific ingredients and preparation methods</li>
              <li>Food availability and nutritional content may differ by geographic location</li>
              <li>Recipe instructions and cooking times are general guidelines</li>
              <li>We cannot guarantee the accuracy of all third-party nutritional databases</li>
            </ul>
            <p className="text-neutral-700">
              Users are responsible for verifying nutritional information and ensuring meal plans meet their specific needs.
            </p>
          </CardContent>
        </Card>

        {/* Individual Results */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-neutral-800">Individual Results May Vary</h2>
            </div>
            <p className="text-neutral-700 mb-4">
              Nutritional needs and responses to dietary changes vary significantly among individuals. Factors affecting results include:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4">
              <li>Individual metabolism and genetic factors</li>
              <li>Current health status and medical conditions</li>
              <li>Activity level and lifestyle factors</li>
              <li>Adherence to recommended meal plans</li>
              <li>Other environmental and personal factors</li>
            </ul>
            <p className="text-neutral-700">
              FitBite makes no guarantees about specific health outcomes or weight loss results from using our meal plans.
            </p>
          </CardContent>
        </Card>

        {/* Allergies and Dietary Restrictions */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Allergies and Dietary Restrictions</h2>
            <p className="text-neutral-700 mb-4">
              While FitBite attempts to accommodate user-specified dietary restrictions and food preferences:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4">
              <li>Users must carefully review all ingredients in recommended meals</li>
              <li>Cross-contamination risks are not accounted for in meal recommendations</li>
              <li>Trace ingredients and processing methods may not be fully disclosed</li>
              <li>Users with severe allergies should consult healthcare providers before following any meal plan</li>
            </ul>
            <p className="text-neutral-700 font-semibold">
              FitBite is not responsible for allergic reactions or adverse effects from recommended foods.
            </p>
          </CardContent>
        </Card>

        {/* Service Limitations */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Service Limitations</h2>
            <ul className="list-disc pl-6 text-neutral-700 mb-4">
              <li>FitBite is a technology platform providing automated meal planning assistance</li>
              <li>The service does not provide emergency medical assistance or crisis intervention</li>
              <li>Customer support responses may take up to 24-48 hours</li>
              <li>Service availability may be limited by technical maintenance or updates</li>
              <li>Internet connectivity is required for full functionality</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Questions or Concerns</h2>
            <p className="text-neutral-700 mb-4">
              If you have questions about this disclaimer or our services, please contact us at:
            </p>
            <ul className="list-none text-neutral-700">
              <li>Email: support@fitbite.com</li>
              <li>Subject: Disclaimer Inquiry</li>
            </ul>
            <p className="text-neutral-700 mt-4 text-sm">
              This disclaimer was last updated on {new Date().toLocaleDateString()}.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}