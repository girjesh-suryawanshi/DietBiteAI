import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onShowAuth: () => void;
}

export function Navbar({ onShowAuth }: NavbarProps) {
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <i className="fas fa-apple-alt text-primary text-lg sm:text-xl md:text-2xl mr-1 sm:mr-2"></i>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-800">FitBite</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/features">
                <span className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">Features</span>
              </Link>
              <Link href="/how-it-works">
                <span className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">How It Works</span>
              </Link>
              <Link href="/pricing">
                <span className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">Pricing</span>
              </Link>
            </div>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {currentUser ? (
              <>
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-primary">Home</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-primary">Dashboard</Button>
                </Link>
                <Button 
                  onClick={logout} 
                  variant="ghost" 
                  size="sm"
                  className="text-neutral-600 hover:text-primary"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={onShowAuth} 
                  variant="ghost" 
                  size="sm"
                  className="text-neutral-600 hover:text-primary"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={onShowAuth} 
                  size="sm"
                  className="bg-primary hover:bg-green-600 text-white"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile/Tablet Auth and Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Quick Auth for tablets */}
            <div className="hidden md:flex items-center space-x-2">
              {currentUser ? (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-primary">Dashboard</Button>
                </Link>
              ) : (
                <Button 
                  onClick={onShowAuth} 
                  size="sm"
                  className="bg-primary hover:bg-green-600 text-white px-3"
                >
                  Sign Up
                </Button>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-primary hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="block h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="block h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-neutral-200">
              <Link href="/features">
                <span 
                  className="text-neutral-600 hover:text-primary block px-3 py-3 rounded-md text-base font-medium transition-colors cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </span>
              </Link>
              <Link href="/how-it-works">
                <span 
                  className="text-neutral-600 hover:text-primary block px-3 py-3 rounded-md text-base font-medium transition-colors cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </span>
              </Link>
              <Link href="/pricing">
                <span 
                  className="text-neutral-600 hover:text-primary block px-3 py-3 rounded-md text-base font-medium transition-colors cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </span>
              </Link>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 pb-3 border-t border-neutral-200 space-y-3">
                {currentUser ? (
                  <>
                    <Link href="/">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-neutral-600 hover:text-primary h-12"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Home
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-neutral-600 hover:text-primary h-12"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }} 
                      variant="ghost" 
                      className="w-full justify-start text-neutral-600 hover:text-primary h-12"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => {
                        onShowAuth();
                        setIsMobileMenuOpen(false);
                      }} 
                      variant="ghost" 
                      className="w-full justify-start text-neutral-600 hover:text-primary h-12"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => {
                        onShowAuth();
                        setIsMobileMenuOpen(false);
                      }} 
                      className="w-full bg-primary hover:bg-green-600 text-white h-12"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
