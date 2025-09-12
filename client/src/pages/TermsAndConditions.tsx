import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => {}} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-neutral-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8 prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-neutral-700 mb-6">
              By accessing and using Mymealify's services, you agree to comply with and be bound by these 
              Terms and Conditions. If you do not agree with any part of these terms, you may not use our service.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">2. Description of Service</h2>
            <p className="text-neutral-700 mb-4">
              Mymealify provides AI-powered personalized meal planning services that consider:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>Individual health conditions and dietary requirements</li>
              <li>Cultural cuisine preferences and food availability</li>
              <li>Fitness goals and activity levels</li>
              <li>Personal food preferences and restrictions</li>
            </ul>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">3. User Responsibilities</h2>
            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Account Security</h3>
            <p className="text-neutral-700 mb-4">You are responsible for:</p>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and up-to-date information</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Appropriate Use</h3>
            <p className="text-neutral-700 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>Use the service for illegal or unauthorized purposes</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper working of the service</li>
              <li>Share your account with others</li>
              <li>Use automated systems to access the service without permission</li>
            </ul>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">4. Medical Disclaimer</h2>
            <p className="text-neutral-700 mb-6">
              <strong>IMPORTANT:</strong> Mymealify provides general nutritional guidance and meal planning suggestions. 
              Our service is NOT a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult your physician or qualified healthcare provider before starting any new diet or 
              making significant changes to your eating habits, especially if you have existing health conditions.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">5. Intellectual Property</h2>
            <p className="text-neutral-700 mb-4">
              Mymealify owns all rights to:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>The Mymealify platform, software, and algorithms</li>
              <li>All content, including meal plans, recipes, and nutritional information</li>
              <li>Trademarks, logos, and brand elements</li>
              <li>User interface design and functionality</li>
            </ul>
            <p className="text-neutral-700 mb-6">
              You may use generated meal plans for personal use only. Commercial use or redistribution 
              is prohibited without written permission.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">6. Privacy and Data Protection</h2>
            <p className="text-neutral-700 mb-6">
              Your privacy is important to us. Our collection, use, and protection of your personal 
              information is governed by our Privacy Policy, which is incorporated into these terms by reference.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">7. Service Availability</h2>
            <p className="text-neutral-700 mb-6">
              We strive to provide continuous service availability but cannot guarantee uninterrupted access. 
              We may temporarily suspend service for maintenance, updates, or technical issues. We are not 
              liable for any inconvenience caused by service interruptions.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">8. Limitation of Liability</h2>
            <p className="text-neutral-700 mb-6">
              Mymealify and its affiliates shall not be liable for any indirect, incidental, special, 
              or consequential damages resulting from the use or inability to use our service. 
              Our total liability shall not exceed the amount paid by you for the service in the 12 months 
              preceding the claim.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">9. Indemnification</h2>
            <p className="text-neutral-700 mb-6">
              You agree to indemnify and hold harmless Mymealify from any claims, damages, or expenses 
              arising from your use of the service, violation of these terms, or infringement of 
              any third-party rights.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">10. Termination</h2>
            <p className="text-neutral-700 mb-4">
              Either party may terminate this agreement:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>You may delete your account at any time</li>
              <li>We may suspend or terminate accounts for terms violations</li>
              <li>We may discontinue the service with reasonable notice</li>
            </ul>
            <p className="text-neutral-700 mb-6">
              Upon termination, your right to use the service ceases immediately, and we may delete your account data.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">11. Changes to Terms</h2>
            <p className="text-neutral-700 mb-6">
              We reserve the right to modify these terms at any time. Material changes will be 
              communicated via email or platform notifications. Continued use of the service after 
              changes constitutes acceptance of the updated terms.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">12. Governing Law</h2>
            <p className="text-neutral-700 mb-6">
              These terms are governed by applicable laws. Any disputes will be resolved through 
              binding arbitration or in courts of competent jurisdiction.
            </p>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">13. Contact Information</h2>
            <p className="text-neutral-700 mb-4">
              For questions about these Terms and Conditions, contact us at:
            </p>
            <ul className="list-none text-neutral-700 mb-6">
              <li>Email: legal@mymealify.com</li>
              <li>Subject: Terms and Conditions Inquiry</li>
            </ul>

            <h2 className="text-2xl font-bold text-neutral-800 mb-4">14. Severability</h2>
            <p className="text-neutral-700 mb-6">
              If any provision of these terms is found to be unenforceable, the remaining provisions 
              will continue in full force and effect.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}