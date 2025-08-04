import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";

interface NavbarProps {
  onShowAuth: () => void;
}

export function Navbar({ onShowAuth }: NavbarProps) {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <i className="fas fa-apple-alt text-primary text-2xl mr-2"></i>
              <span className="text-2xl font-bold text-neutral-800">FitBite</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#features" className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">How It Works</a>
              <a href="#pricing" className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Pricing</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link href="/">
                  <Button variant="ghost" className="text-neutral-600 hover:text-primary">Home</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-neutral-600 hover:text-primary">Dashboard</Button>
                </Link>
                <Button 
                  onClick={logout} 
                  variant="ghost" 
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
                  className="text-neutral-600 hover:text-primary"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={onShowAuth} 
                  className="bg-primary hover:bg-green-600 text-white"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
