import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Hero() {
  const [bgUrl, setBgUrl] = useState("/hero-bg.jpg");

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

  return (
    <section className="relative pt-24 pb-32 px-6 overflow-hidden flex items-center border-b border-[var(--color-border)] min-h-[90vh]">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-20" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 z-10 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
             }} 
        />

        {/* Ambient Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#00F0FF]/20 blur-sm pointer-events-none"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px"
            }}
            animate={{ 
              y: ["-10%", "110%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          />
        ))}

        <img 
          src={bgUrl} 
          alt="Minecraft Landscape" 
          className="w-full h-full object-cover opacity-90"
          referrerPolicy="no-referrer"
          onError={(e) => {
            if (bgUrl !== "/hero-bg.jpg") {
              console.error("Hero BG failed to load, falling back to local asset");
              setBgUrl("/hero-bg.jpg");
            }
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-30 flex flex-col items-center text-center mt-12 perspective-2000">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="preserve-3d"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex px-6 py-2 bg-white/5 border border-[#00F0FF]/40 rounded-full text-[10px] font-black text-[#00F0FF] mb-10 shadow-[0_0_20px_rgba(0,240,255,0.1)] backdrop-blur-xl uppercase tracking-[0.3em]"
          >
            <span className="relative flex h-2 w-2 mr-2 self-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
            </span>
            Premium Game Hosting
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.95] text-white uppercase preserve-3d">
            <motion.span 
              className="block text-3d-white mb-2"
              whileHover={{ translateZ: 50, rotateX: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              UNLEASH THE
            </motion.span>
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-cyan-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] text-3d-aqua"
              whileHover={{ translateZ: 80, rotateX: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              POWER
            </motion.span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--color-text-dim)] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Next-gen infrastructure for the ultimate gaming experience. 
            Deploy high-performance Minecraft and VPS nodes in under 60 seconds.
          </p>

          <motion.button 
            whileHover={{ scale: 1.02, y: -1, z: 20, boxShadow: "0 20px 40px rgba(0, 240, 255, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#00F0FF] text-black font-black px-12 py-5 rounded-2xl transition-all text-xl shadow-3d uppercase tracking-tighter preserve-3d"
          >
            Get Started Now
          </motion.button>
        </motion.div>

        {/* Thumbnail slider mockup */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center flex-wrap gap-4 mt-28 w-full max-w-5xl px-4 pb-4 perspective-2000"
        >
          {/* Active thumb */}
          <motion.div 
            whileHover={{ rotateY: 5, rotateX: -5, scale: 1.05, z: 30 }}
            className="h-24 w-36 border-2 border-[#00F0FF] rounded-2xl overflow-hidden shrink-0 cursor-pointer shadow-3d-lg transition-all preserve-3d glow-primary"
          >
            <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" alt="Aqua Tech" />
          </motion.div>
          
          {/* Other thumbs: Minecraft & VPS Alternating */}
          {[
            "https://images.unsplash.com/photo-1558494949253-e5223abfb21a?auto=format&fit=crop&w=300&q=80",
            "https://images.unsplash.com/photo-1627856013091-fed6e4e048eb?auto=format&fit=crop&w=300&q=80",
            "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80",
            "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=300&q=80",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=300&q=80",
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=300&q=80",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80"
          ].map((url, i) => (
            <motion.div 
              key={i} 
              whileHover={{ rotateY: -5, rotateX: 5, scale: 1.05, z: 20 }}
              className="h-24 w-36 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shrink-0 opacity-40 hover:opacity-100 transition-all cursor-pointer preserve-3d shadow-3d"
            >
              <img src={url} className="w-full h-full object-cover" alt="VPS and Games thumb" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
