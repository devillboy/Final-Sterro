import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  isAdmin: boolean;
  loading: boolean;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async (user: FirebaseUser | null) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    // Hardcoded initial admin
    if (user.email === 'ghoshsima874@gmail.com') {
      setIsAdmin(true);
      return;
    }
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      setIsAdmin(adminDoc.exists());
    } catch (e) {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Sync Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      checkAdmin(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const logout = async () => {
    try {
      // Logout Firebase
      await signOut(auth);
      setFirebaseUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      firebaseUser, 
      isAdmin, 
      loading, 
      loginGoogle, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
