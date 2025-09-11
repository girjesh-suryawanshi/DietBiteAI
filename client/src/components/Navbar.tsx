import { useState } from "react";
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
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform">
                <i className="fas fa-apple-alt text-white text-lg"></i>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MyMealify
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-neutral-600 hover:text-primary font-medium transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('features');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-neutral-600 hover:text-primary font-medium transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('how-it-works');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              How It Works
            </a>
            <Link href="/blog">
              <span className="text-neutral-600 hover:text-primary font-medium transition-colors cursor-pointer">
                Blog
              </span>
            </Link>
            <Link href="/about">
              <span className="text-neutral-600 hover:text-primary font-medium transition-colors cursor-pointer">
                About
              </span>
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button className="bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium shadow-sm">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="text-neutral-600 hover:text-primary border-neutral-300 rounded-full px-4"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost"
                  onClick={onShowAuth}
                  className="text-neutral-600 hover:text-primary font-medium"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={onShowAuth}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-green-600 hover:to-blue-600 text-white px-6 py-2 rounded-full font-medium shadow-lg transition-all transform hover:scale-105"
                >
                  Get Started Free
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-600"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-3 px-4">
              <a 
                href="#features" 
                className="text-neutral-600 hover:text-primary py-3 font-medium transition-colors border-b border-neutral-100"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  // Small delay to allow menu to close before scrolling
                  setTimeout(() => {
                    const element = document.getElementById('features');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="text-neutral-600 hover:text-primary py-3 font-medium transition-colors border-b border-neutral-100"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    const element = document.getElementById('how-it-works');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
              >
                How It Works
              </a>
              <Link href="/blog">
                <span 
                  className="text-neutral-600 hover:text-primary py-3 font-medium transition-colors cursor-pointer block border-b border-neutral-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </span>
              </Link>
              <Link href="/about">
                <span 
                  className="text-neutral-600 hover:text-primary py-3 font-medium transition-colors cursor-pointer block border-b border-neutral-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </span>
              </Link>
              
              <div className="pt-4 space-y-3">
                {currentUser ? (
                  <>
                    <Link href="/dashboard">
                      <Button 
                        className="w-full bg-primary hover:bg-green-600 text-white rounded-full font-medium py-3"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-neutral-600 hover:text-primary border-neutral-300 rounded-full py-3"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        onShowAuth();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-neutral-600 hover:text-primary border border-neutral-200 rounded-full py-3"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => {
                        onShowAuth();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-green-600 hover:to-blue-600 text-white rounded-full shadow-lg font-medium py-3"
                    >
                      Get Started Free
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
