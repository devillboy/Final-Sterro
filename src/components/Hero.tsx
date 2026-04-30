import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
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
    <section className="relative pt-24 pb-32 px-6 overflow-hidden flex items-center border-b border-white/5 min-h-[90vh]">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-bg-dark/80 to-bg-dark z-20" />
        
        {/* Visible Grid Structure */}
        <div className="absolute inset-0 z-10 visible-grid opacity-20" />
        
        {/* Sophisticated Mesh Glow */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-cyan/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full animate-pulse delay-1000 pointer-events-none" />

        <img 
          src={bgUrl} 
          alt="" 
          className="w-full h-full object-cover opacity-30 grayscale"
          referrerPolicy="no-referrer"
          onError={() => {
             setBgUrl("https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop");
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-30 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto flex flex-col items-center px-4"
        >
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-12 backdrop-blur-xl">
            <span className="flex h-2 w-2 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_10px_#00F0FF]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Infrastructure Status: Optimal</span>
          </div>
          
          <h1 className="text-5xl md:text-[5.5rem] lg:text-[7rem] font-extrabold tracking-[-0.05em] mb-10 leading-[0.85] text-white">
            <span className="block mb-4 text-white opacity-90 italic font-serif font-light lowercase tracking-tight">The ultimate</span>
            High-Performance <br className="hidden md:block" />
            <span className="text-primary-gradient">Compute Network</span>
          </h1>
          
          <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto mb-16 leading-relaxed font-medium tracking-tight">
            Provision enterprise-grade nodes for low-latency gaming and scalable cloud operations. 
            Powered by Ryzen™ technology & <span className="text-white">EdgeGuard 10Gbps</span> protection.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <motion.button 
              onClick={handleGetStarted}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-12 py-5 bg-white text-bg-dark font-black rounded-2xl transition-all text-sm uppercase tracking-widest shadow-2xl flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-brand-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10">{firebaseUser ? 'Access Infrastructure' : 'Deploy Node Now'}</span>
              <ChevronRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all text-sm uppercase tracking-widest backdrop-blur-md"
            >
              Why Choose Us
            </button>
          </div>
          
          {/* Trust Batch */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 opacity-30">
            {[
              { label: 'Uptime', value: '99.99%', sub: 'Guaranteed' },
              { label: 'Network', value: '10 Gbps', sub: 'EdgeGuard' },
              { label: 'Latency', value: '<20ms', sub: 'Region IN' },
              { label: 'Support', value: '24/7', sub: 'Operations' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{item.label}</div>
                <div className="text-xl font-bold text-white tracking-tighter">{item.value}</div>
                <div className="text-[9px] font-medium uppercase tracking-widest text-brand-cyan/60">{item.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

  );
}
