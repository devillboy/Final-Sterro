import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function Hero() {
  const [bgUrl, setBgUrl] = useState("https://cdn.discordapp.com/attachments/1414251304741638191/1497103165689167923/qHFzGKFBz7kvxiVyjoe6JJ-1024-80.jpg.webp?ex=69ef9939&is=69ee47b9&hm=9a8a35041d2aa644a390c81f07f60b874b2c14e45981ffec7827092e0a1bca4e&");
  const { firebaseUser, loginGoogle } = useAuth();

  useEffect(() => {
    async function loadAssets() {
      try {
        const q = query(collection(db, "assets"), where("key", "==", "HERO_BG"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const url = snap.docs[0].data().url;
          if (url) setBgUrl(url);
        }
      } catch (e) {
        console.warn("Dynamic asset load failed, using fallback:", e);
      }
    }
    loadAssets();
  }, []);

  const handleGetStarted = () => {
    if (!firebaseUser) {
      loginGoogle();
    } else {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-24 pb-32 px-6 overflow-hidden flex items-center border-b border-[var(--color-border)] min-h-[90vh]">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050914]/60 via-[#050914]/40 to-[#050914] z-20" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 z-10 opacity-30" 
             style={{ 
               backgroundImage: 'linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)',
               backgroundSize: '50px 50px',
               maskImage: 'radial-gradient(ellipse at center, black, transparent 90%)'
             }} 
        />

        <img 
          src={bgUrl} 
          alt="Gaming Setup Background" 
          className="w-full h-full object-cover opacity-70"
          referrerPolicy="no-referrer"
          onError={() => {
             setBgUrl("https://images.unsplash.com/photo-1624396115105-0219bd52427a?q=80&w=2000&auto=format&fit=crop");
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-30 flex flex-col items-center text-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-1.5 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded-full text-xs font-semibold text-[#00F0FF] mb-8 shadow-[0_0_20px_rgba(0,240,255,0.1)] backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
            </span>
            Welcome to the future of hosting
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-white">
            <span className="block mb-2">High-Performance</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-blue-400">
              Game Servers & VPS
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Next-gen infrastructure for the ultimate gaming experience. 
            Deploy powerful Minecraft nodes and Root Servers in under 60 seconds with DDoS protection included.
          </p>

          <motion.button 
            onClick={handleGetStarted}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(0, 240, 255, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#00F0FF] text-[#050914] font-bold px-10 py-4 rounded-xl transition-all text-lg flex items-center justify-center gap-2"
          >
            {firebaseUser ? 'View Plans & Pricing' : 'Get Started Now'}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
