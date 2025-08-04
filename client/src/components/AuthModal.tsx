import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login, signup, loginWithGoogle, loginWithFacebook } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password, name);
        toast({
          title: "Account created successfully!",
          description: "Welcome to FitBite",
        });
      } else {
        await login(email, password);
        toast({
          title: "Signed in successfully!",
          description: "Welcome back to FitBite",
        });
      }
      onClose();
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      toast({
        title: "Signed in with Google!",
        description: "Welcome to FitBite",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Google sign-in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFacebookAuth = async () => {
    try {
      await loginWithFacebook();
      toast({
        title: "Signed in with Facebook!",
        description: "Welcome to FitBite",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Facebook sign-in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-4 p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription>
            {isSignUp ? "Start your health journey today" : "Sign in to continue your health journey"}
          </DialogDescription>
        </DialogHeader>
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <i className="fas fa-apple-alt text-primary text-3xl mr-2"></i>
              <span className="text-2xl font-bold text-neutral-800">FitBite</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-800">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h3>
            <p className="text-neutral-600">
              {isSignUp ? "Start your health journey today" : "Sign in to continue your health journey"}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button 
              onClick={handleGoogleAuth}
              variant="outline" 
              className="w-full flex items-center justify-center py-3"
            >
              <i className="fab fa-google text-red-500 mr-3"></i>
              Continue with Google
            </Button>
            <Button 
              onClick={handleFacebookAuth}
              variant="outline" 
              className="w-full flex items-center justify-center py-3"
            >
              <i className="fab fa-facebook text-blue-600 mr-3"></i>
              Continue with Facebook
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label className="block text-sm font-medium text-neutral-700 mb-2">Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            )}
            <div>
              <Label className="block text-sm font-medium text-neutral-700 mb-2">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-neutral-700 mb-2">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-green-600 text-white py-3"
            >
              {loading ? "Loading..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:text-green-600 text-sm font-medium"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
