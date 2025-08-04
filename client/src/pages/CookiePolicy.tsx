import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Settings, BarChart, Shield } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => {}} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Cookie Policy</h1>
          <p className="text-lg text-neutral-600">
            How FitBite uses cookies and similar technologies - Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* What are Cookies */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Cookie className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-neutral-800">What Are Cookies?</h2>
            </div>
            <p className="text-neutral-700 mb-4">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better user experience by remembering your preferences 
              and enabling certain features of our service.
            </p>
            <p className="text-neutral-700 mb-4">
              Similar technologies include:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-4">
              <li><strong>Local Storage:</strong> Stores data locally in your browser</li>
              <li><strong>Session Storage:</strong> Temporary storage that expires when you close your browser</li>
              <li><strong>Web Beacons:</strong> Small graphics that help us analyze website usage</li>
              <li><strong>Pixels:</strong> Tiny images that track user interactions</li>
            </ul>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-neutral-800">Essential Cookies</h3>
              </div>
              <p className="text-neutral-700 mb-3">
                Required for basic website functionality. These cannot be disabled.
              </p>
              <ul className="list-disc pl-6 text-neutral-700 text-sm">
                <li>User authentication and login sessions</li>
                <li>Security and fraud prevention</li>
                <li>Shopping cart and payment processing</li>
                <li>Website performance and error tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <BarChart className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-neutral-800">Analytics Cookies</h3>
              </div>
              <p className="text-neutral-700 mb-3">
                Help us understand how users interact with our website.
              </p>
              <ul className="list-disc pl-6 text-neutral-700 text-sm">
                <li>Page views and user journey tracking</li>
                <li>Feature usage and engagement metrics</li>
                <li>Performance optimization data</li>
                <li>Error reporting and diagnostics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-neutral-800">Functional Cookies</h3>
              </div>
              <p className="text-neutral-700 mb-3">
                Remember your preferences and personalize your experience.
              </p>
              <ul className="list-disc pl-6 text-neutral-700 text-sm">
                <li>Language and region preferences</li>
                <li>Theme and display settings</li>
                <li>Dietary preferences and restrictions</li>
                <li>Recently viewed meal plans</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Cookie className="w-6 h-6 text-orange-600 mr-3" />
                <h3 className="text-xl font-bold text-neutral-800">Marketing Cookies</h3>
              </div>
              <p className="text-neutral-700 mb-3">
                Used to deliver relevant advertisements and track campaign effectiveness.
              </p>
              <ul className="list-disc pl-6 text-neutral-700 text-sm">
                <li>Personalized content recommendations</li>
                <li>Social media integration</li>
                <li>Advertising campaign tracking</li>
                <li>Third-party marketing analytics</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How We Use Cookies */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">How We Use Cookies</h2>
            
            <h3 className="text-xl font-semibold text-neutral-800 mb-3">User Experience Enhancement</h3>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>Remember your login status and preferences</li>
              <li>Maintain your meal plan preferences and dietary restrictions</li>
              <li>Provide personalized meal recommendations</li>
              <li>Save your progress during account setup</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Analytics and Performance</h3>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>Analyze website traffic and user behavior patterns</li>
              <li>Identify popular features and content</li>
              <li>Monitor website performance and identify technical issues</li>
              <li>Optimize our AI meal planning algorithms</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Security and Fraud Prevention</h3>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>Detect and prevent unauthorized access attempts</li>
              <li>Protect against automated attacks and spam</li>
              <li>Verify user identity and maintain secure sessions</li>
              <li>Monitor for suspicious activity</li>
            </ul>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Third-Party Cookies</h2>
            <p className="text-neutral-700 mb-4">
              We may allow trusted third parties to place cookies on our website for the following purposes:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">Google Analytics</h3>
                <p className="text-neutral-700">Helps us understand user behavior and improve our service</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">Firebase Authentication</h3>
                <p className="text-neutral-700">Provides secure user authentication and account management</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">Payment Processors</h3>
                <p className="text-neutral-700">Enable secure payment processing for premium features</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">Customer Support</h3>
                <p className="text-neutral-700">Provide live chat and help desk functionality</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Management */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Browser Settings</h3>
            <p className="text-neutral-700 mb-4">
              You can control cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 text-neutral-700 mb-6">
              <li>View and delete cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Block third-party cookies</li>
              <li>Clear all cookies when you close your browser</li>
              <li>Receive notifications when cookies are set</li>
            </ul>

            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Browser-Specific Instructions</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold text-neutral-800">Chrome</h4>
                <p className="text-neutral-700 text-sm">Settings → Privacy and Security → Cookies and other site data</p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800">Firefox</h4>
                <p className="text-neutral-700 text-sm">Options → Privacy & Security → Cookies and Site Data</p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800">Safari</h4>
                <p className="text-neutral-700 text-sm">Preferences → Privacy → Manage Website Data</p>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800">Edge</h4>
                <p className="text-neutral-700 text-sm">Settings → Cookies and site permissions → Cookies and site data</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Note:</strong> Disabling certain cookies may affect website functionality and your user experience. 
                Essential cookies cannot be disabled as they are required for basic website operation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Retention */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Cookie Retention Periods</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">Session Cookies</h3>
                <p className="text-neutral-700">Deleted when you close your browser</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">Authentication Cookies</h3>
                <p className="text-neutral-700">Expire after 30 days or when you log out</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">Preference Cookies</h3>
                <p className="text-neutral-700">Stored for up to 1 year to remember your settings</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">Analytics Cookies</h3>
                <p className="text-neutral-700">Typically expire after 2 years</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates to Policy */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Updates to This Policy</h2>
            <p className="text-neutral-700 mb-4">
              We may update this Cookie Policy periodically to reflect changes in our practices or 
              applicable laws. We will notify you of significant changes by posting the updated policy 
              on our website and updating the "last modified" date.
            </p>
            
            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Contact Us</h3>
            <p className="text-neutral-700 mb-4">
              If you have questions about our use of cookies or this policy, please contact us:
            </p>
            <ul className="list-none text-neutral-700">
              <li>Email: privacy@fitbite.com</li>
              <li>Subject: Cookie Policy Inquiry</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}