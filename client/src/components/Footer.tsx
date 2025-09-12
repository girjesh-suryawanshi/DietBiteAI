import React from "react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <i className="fas fa-apple-alt text-primary text-2xl mr-2"></i>
              <span className="text-2xl font-bold text-neutral-800">MyMealify</span>
            </div>
            <p className="text-neutral-600 text-sm mb-4">
              AI-powered personalized meal planning for a healthier lifestyle. 
              Customized nutrition that respects your health, culture, and preferences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <i className="fab fa-linkedin-in text-lg"></i>
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  Meal Planning
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  DMCA Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-neutral-600 hover:text-primary text-sm transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} Mymealify. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-neutral-500 hover:text-primary text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-neutral-500 hover:text-primary text-sm transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-neutral-500 hover:text-primary text-sm transition-colors">
                Cookies
              </Link>
              <Link href="/contact" className="text-neutral-500 hover:text-primary text-sm transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}