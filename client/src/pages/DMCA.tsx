import React from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Mail, AlertTriangle, FileText } from "lucide-react";

export default function DMCA() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onShowAuth={() => {}} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">DMCA / Copyright Policy</h1>
          <p className="text-lg text-neutral-600">
            Digital Millennium Copyright Act compliance and copyright protection procedures
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-neutral-800">Our Commitment to Copyright Protection</h2>
            </div>
            <p className="text-neutral-700 mb-4">
              FitBite respects the intellectual property rights of others and expects our users to do the same. 
              We comply with the Digital Millennium Copyright Act (DMCA) and will respond promptly to 
              valid copyright infringement notices.
            </p>
            <p className="text-neutral-700">
              This policy outlines our procedures for addressing allegations of copyright infringement 
              on our platform and provides information for copyright holders on how to submit takedown notices.
            </p>
          </CardContent>
        </Card>

        {/* Copyright Infringement Notice */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
              <h2 className="text-2xl font-bold text-neutral-800">Filing a Copyright Infringement Notice</h2>
            </div>
            <p className="text-neutral-700 mb-4">
              If you believe that content on FitBite infringes your copyright, you may submit a DMCA takedown notice. 
              To be valid under the DMCA, your notice must include the following information:
            </p>
            
            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Required Information</h3>
            <ol className="list-decimal pl-6 text-neutral-700 mb-6 space-y-2">
              <li><strong>Identification of the copyrighted work:</strong> Provide a detailed description of the copyrighted material you claim has been infringed, including registration numbers if applicable.</li>
              <li><strong>Identification of infringing material:</strong> Specify the exact location (URL) of the allegedly infringing content on our platform and describe it sufficiently to allow us to locate it.</li>
              <li><strong>Contact information:</strong> Include your full name, address, telephone number, and email address.</li>
              <li><strong>Good faith statement:</strong> Include a statement that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
              <li><strong>Accuracy statement:</strong> Include a statement that the information in your notice is accurate and that you are the copyright owner or authorized to act on behalf of the copyright owner.</li>
              <li><strong>Electronic or physical signature:</strong> Provide your physical or electronic signature.</li>
            </ol>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Important Notice:</h4>
              <p className="text-blue-700">
                Under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that 
                material is infringing may be subject to liability. Please ensure your claim is valid before submitting.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How to Submit */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Mail className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-neutral-800">How to Submit a DMCA Notice</h2>
            </div>
            
            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Designated Copyright Agent</h3>
            <p className="text-neutral-700 mb-4">
              Send your complete DMCA notice to our designated copyright agent:
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-neutral-800 font-semibold mb-2">DMCA Copyright Agent</p>
              <p className="text-neutral-700">FitBite Legal Department</p>
              <p className="text-neutral-700">Email: dmca@fitbite.com</p>
              <p className="text-neutral-700">Subject Line: DMCA Takedown Notice</p>
            </div>

            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Processing Timeline</h3>
            <ul className="list-disc pl-6 text-neutral-700 mb-4">
              <li>We will acknowledge receipt of your notice within 24-48 hours</li>
              <li>Valid notices will be processed within 3-5 business days</li>
              <li>Infringing content will be removed or disabled promptly upon verification</li>
              <li>The alleged infringer will be notified of the takedown</li>
            </ul>
          </CardContent>
        </Card>

        {/* Counter-Notice */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <FileText className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-neutral-800">Filing a Counter-Notice</h2>
            </div>
            <p className="text-neutral-700 mb-4">
              If you believe your content was removed in error or misidentification, you may file a counter-notice. 
              Your counter-notice must include:
            </p>
            
            <ol className="list-decimal pl-6 text-neutral-700 mb-6 space-y-2">
              <li>Your physical or electronic signature</li>
              <li>Identification of the material removed and its location before removal</li>
              <li>A statement under penalty of perjury that you have a good faith belief the material was removed due to mistake or misidentification</li>
              <li>Your name, address, and telephone number</li>
              <li>A statement consenting to federal court jurisdiction in your district</li>
              <li>A statement that you will accept service of process from the complainant</li>
            </ol>

            <p className="text-neutral-700 mb-4">
              Send counter-notices to the same email address: <strong>dmca@fitbite.com</strong>
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Note:</strong> If we receive a valid counter-notice, we may restore the content in 
                10-14 business days unless the original complainant files a court action.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Repeat Infringer Policy */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Repeat Infringer Policy</h2>
            <p className="text-neutral-700 mb-4">
              FitBite maintains a policy of terminating user accounts that are repeat copyright infringers. 
              We track copyright violations and may take the following actions:
            </p>
            
            <ul className="list-disc pl-6 text-neutral-700 mb-4">
              <li><strong>First violation:</strong> Warning and content removal</li>
              <li><strong>Second violation:</strong> Temporary account suspension</li>
              <li><strong>Third violation:</strong> Permanent account termination</li>
            </ul>
            
            <p className="text-neutral-700">
              Users whose accounts are terminated for repeat infringement may not create new accounts on our platform.
            </p>
          </CardContent>
        </Card>

        {/* Our Content Protection */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Protection of FitBite's Content</h2>
            <p className="text-neutral-700 mb-4">
              FitBite's content, including but not limited to:
            </p>
            
            <ul className="list-disc pl-6 text-neutral-700 mb-4">
              <li>AI-generated meal plans and recipes</li>
              <li>Website design and user interface</li>
              <li>Software algorithms and code</li>
              <li>Logo, trademarks, and branding materials</li>
              <li>Educational content and nutritional information</li>
            </ul>
            
            <p className="text-neutral-700 mb-4">
              is protected by copyright and other intellectual property laws. Unauthorized use, reproduction, 
              or distribution of our content is prohibited and may result in legal action.
            </p>
            
            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Permitted Use</h3>
            <ul className="list-disc pl-6 text-neutral-700 mb-4">
              <li>Personal use of meal plans generated for your account</li>
              <li>Sharing meal plans with family members for personal use</li>
              <li>Fair use for educational or commentary purposes with proper attribution</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Prohibited Use</h3>
            <ul className="list-disc pl-6 text-neutral-700 mb-4">
              <li>Commercial redistribution of meal plans or recipes</li>
              <li>Creating competing services using our content</li>
              <li>Reverse engineering our algorithms or software</li>
              <li>Using our branding or logos without permission</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Contact Information</h2>
            <p className="text-neutral-700 mb-4">
              For all copyright-related inquiries:
            </p>
            
            <div className="space-y-2 text-neutral-700">
              <p><strong>DMCA Agent:</strong> FitBite Legal Department</p>
              <p><strong>Email:</strong> dmca@fitbite.com</p>
              <p><strong>For general copyright questions:</strong> legal@fitbite.com</p>
            </div>
            
            <p className="text-neutral-700 mt-6 text-sm">
              This DMCA policy was last updated on {new Date().toLocaleDateString()}.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}