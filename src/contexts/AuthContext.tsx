import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  email: string | null;
}

interface AuthContextType {
  discordUser: DiscordUser | null;
  firebaseUser: FirebaseUser | null;
  isAdmin: boolean;
  loading: boolean;
  loginDiscord: () => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
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

  const refreshDiscordUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setDiscordUser(data.user);
      } else {
        setDiscordUser(null);
      }
    } catch (error) {
      setDiscordUser(null);
    }
  };

  useEffect(() => {
    // Sync Discord
    refreshDiscordUser();

    // Sync Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      checkAdmin(user);
      setLoading(false);
    });

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        refreshDiscordUser();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      unsubscribe();
    };
  }, []);

  const loginDiscord = async () => {
    try {
      const response = await fetch('/api/auth/url');
      if (!response.ok) throw new Error('Failed to get auth URL');
      const { url } = await response.json();
      window.open(url, 'discord_oauth', 'width=500,height=800');
    } catch (error) {
      console.error('Discord login error:', error);
    }
  };

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const logout = async () => {
    try {
      // Logout Discord
      await fetch('/api/auth/logout', { method: 'POST' });
      setDiscordUser(null);
      
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
      discordUser, 
      firebaseUser, 
      isAdmin, 
      loading, 
      loginDiscord, 
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
