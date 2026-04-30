import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function Hero() {
  const [bgUrl, setBgUrl] = useState("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop");
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto flex flex-col items-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-[10px] font-black text-brand-cyan mb-10 shadow-[0_0_30px_rgba(0,240,255,0.1)] backdrop-blur-3xl uppercase tracking-[0.2em]"
          >
            <span className="relative flex h-2 w-2 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            Next-Generation Infrastructure
          </motion.div>
          
          <h1 className="text-6xl md:text-[6rem] lg:text-[7.5rem] font-extrabold tracking-[-0.04em] mb-8 leading-[0.9] text-white">
            <span className="block mb-2 text-white">Dominate the</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-cyan via-brand-cyan to-brand-blue">
              Game World
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-14 leading-relaxed font-light tracking-wide">
            Experience peak performance with SterroCloud's high-frequency hosting solutions. 
            Deploy powerful nodes with <span className="text-white font-semibold">10Gbps EdgeGuard</span> protection and instant setup as standard.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <motion.button 
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-brand-cyan text-bg-dark font-black rounded-2xl transition-all text-lg shadow-[0_20px_50px_rgba(0,240,255,0.3)] hover:shadow-[0_25px_60px_rgba(0,240,255,0.4)] flex items-center gap-3"
            >
              <span>{firebaseUser ? 'Open Dashboard' : 'Deploy Instant Server'}</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </motion.button>
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all text-lg backdrop-blur-md"
            >
              View Services
            </button>
          </div>
          
          {/* Trust Batch */}
          <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {['10Gbps Network', '99.9% Uptime', 'Tier-4 Datacenter', 'NVMe Storage'].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase">
                <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
