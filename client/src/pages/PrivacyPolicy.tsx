import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => {}} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Privacy Policy</h1>
          <p className="text-lg text-neutral-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8 prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Personal Information</h3>
            <p className="text-neutral-700 mb-4">
              When you create an account with FitBite, we collect personal information including:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>Name and email address</li>
              <li>Age, gender, height, and weight</li>
              <li>Health conditions and dietary restrictions</li>
              <li>Activity level and fitness goals</li>
              <li>Food preferences and cultural cuisine choices</li>
              <li>Geographic location (country/region)</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Usage Information</h3>
            <p className="text-neutral-700 mb-6">
              We automatically collect information about how you use our service, including:
              meal plan generation history, user interactions, device information, and app usage patterns.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-neutral-700 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>Generate personalized meal plans using AI algorithms</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Improve our AI models and service quality</li>
              <li>Send important service updates and notifications</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">3. Information Sharing</h2>
            <p className="text-neutral-700 mb-4">
              We do not sell, trade, or rent your personal information. We may share information only in these circumstances:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>With your explicit consent</li>
              <li>To comply with legal requirements or court orders</li>
              <li>To protect our rights, property, or safety</li>
              <li>With trusted service providers who assist in platform operations (under strict confidentiality agreements)</li>
              <li>In case of business transfer or merger (with prior notice)</li>
            </ul>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">4. Data Security</h2>
            <p className="text-neutral-700 mb-6">
              We implement industry-standard security measures including encryption, secure servers, 
              regular security audits, and access controls to protect your personal information. 
              However, no internet transmission is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">5. Data Retention</h2>
            <p className="text-neutral-700 mb-6">
              We retain your personal information for as long as your account is active or as needed 
              to provide services. You may request deletion of your account and personal data at any time 
              through your account settings or by contacting support.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">6. Your Rights</h2>
            <p className="text-neutral-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>Access and review your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Delete your account and personal information</li>
              <li>Export your data in a portable format</li>
              <li>Opt-out of marketing communications</li>
              <li>Restrict processing of your information</li>
            </ul>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">7. Cookies and Tracking</h2>
            <p className="text-neutral-700 mb-6">
              We use cookies and similar technologies to improve user experience, analyze usage patterns, 
              and provide personalized content. You can control cookie settings through your browser preferences.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">8. Children's Privacy</h2>
            <p className="text-neutral-700 mb-6">
              FitBite is not intended for children under 13. We do not knowingly collect personal 
              information from children under 13. If we discover such information, we will delete it immediately.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">9. International Data Transfers</h2>
            <p className="text-neutral-700 mb-6">
              Your information may be transferred to and processed in countries other than your country 
              of residence. We ensure appropriate safeguards are in place for international transfers.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">10. Changes to Privacy Policy</h2>
            <p className="text-neutral-700 mb-6">
              We may update this Privacy Policy periodically. We will notify users of significant 
              changes via email or platform notifications. Continued use constitutes acceptance of updates.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">11. Contact Information</h2>
            <p className="text-neutral-700 mb-4">
              For privacy-related questions or to exercise your rights, contact us at:
            </p>
            <ul className="list-none text-neutral-700 mb-6">
              <li>Email: privacy@fitbite.com</li>
              <li>Subject: Privacy Policy Inquiry</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}