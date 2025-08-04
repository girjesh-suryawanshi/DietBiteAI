import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signup(email: string, password: string, name: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user in our database
    await apiRequest("POST", "/api/users", {
      uid: user.uid,
      email: user.email,
      name,
    });
  }

  async function loginWithGoogle() {
    const { user } = await signInWithPopup(auth, googleProvider);
    
    // Check if user exists in our database, create if not
    try {
      await apiRequest("GET", `/api/users/${user.uid}`);
    } catch (error) {
      // User doesn't exist, create them
      await apiRequest("POST", "/api/users", {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "User",
      });
    }
  }

  async function loginWithFacebook() {
    const { user } = await signInWithPopup(auth, facebookProvider);
    
    // Check if user exists in our database, create if not
    try {
      await apiRequest("GET", `/api/users/${user.uid}`);
    } catch (error) {
      // User doesn't exist, create them
      await apiRequest("POST", "/api/users", {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "User",
      });
    }
  }

  async function logout() {
    await signOut(auth);
    setUserData(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user data from our database
        try {
          const response = await apiRequest("GET", `/api/users/${user.uid}`);
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
          } else {
            console.error("User not found in database");
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    login,
    signup,
    loginWithGoogle,
    loginWithFacebook,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
