import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSounds } from "../utils/sounds";
import { ChevronRight } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const HERO_SLIDES = [
  {
    id: "minecraft",
    title: "Minecraft",
    highlight: "Optimization",
    description: "Experience premium Minecraft hosting powered by high-frequency processors. Lag-free gameplay with instant provisioning on our global edge network.",
    price: "₹90",
    bgUrl: "https://cdn.discordapp.com/attachments/1414251304741638191/1496919234364706988/Download_Free_Minecraft_Wallpapers_and_Backgrounds.jpg?ex=69f5856c&is=69f433ec&hm=4c8910092041209010fde2ee1d46323b3cc01a1afbd1161d17e140b02c910576&"
  },
  {
    id: "vps",
    title: "VPS",
    highlight: "Cloud",
    description: "Secure, scalable, and lightning-fast KVM hosting solutions. Give your projects the enterprise foundation they deserve with our high-performance infrastructure.",
    price: "₹240",
    bgUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000&auto=format&fit=crop"
  }
];

export default function Hero() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { firebaseUser, loginGoogle } = useAuth();
  const { playClick } = useSounds();
  
  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    if (!firebaseUser) {
      loginGoogle();
    } else {
      const pricingEl = document.getElementById('pricing');
      if (pricingEl) {
        pricingEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/pricing');
      }
    }
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative pt-32 pb-32 px-6 overflow-hidden flex items-center border-b border-white/5 min-h-[90vh] perspective-2000">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/80 to-bg-dark/40 z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent z-20" />
        
        {/* Visible Grid Structure */}
        <div className="absolute inset-0 z-10 visible-grid opacity-20" />
        
        <AnimatePresence initial={false}>
          <motion.img 
            key={slide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.9, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            src={slide.bgUrl} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 brightness-75"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-30 flex flex-col justify-center preserve-3d">
        <div className="max-w-3xl flex flex-col items-start px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] text-white font-display text-premium-gradient">
                {slide.title}<span className="text-brand-gold/60 font-medium ml-2"> {slide.highlight}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
                {slide.description}
              </p>

              <div className="flex flex-col gap-12">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <button 
                    onClick={() => { playClick(); handleGetStarted(); }}
                    className="px-12 py-5 bg-brand-gold text-slate-950 font-bold rounded-2xl transition-all uppercase tracking-widest flex items-center gap-3 shadow-glow-gold-strong hover:scale-[1.02] active:scale-[0.98] group/btn"
                  >
                    Deploy Node
                    <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => { playClick(); navigate('/features'); }}
                    className="px-10 py-5 bg-slate-900/50 border border-slate-800 text-slate-300 font-bold rounded-2xl transition-all uppercase tracking-widest backdrop-blur-md hover:bg-slate-800 hover:text-white"
                  >
                    Technology Stack
                  </button>
                  <div className="flex flex-col pl-4 border-l border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Entry Rate</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white tracking-tight">{slide.price}</span>
                      <span className="text-xs text-slate-500 font-medium lowercase"> / mo</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm font-medium">
                  <div className="flex gap-1 items-center">
                    <span className="text-white text-lg font-bold mr-2">4.8</span>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-5 h-5 flex items-center justify-center ${i < 4 ? 'bg-[#00b67a]' : 'bg-[#00b67a]'} rounded-sm`}>
                        <svg viewBox="0 0 51 48" className={`w-3 h-3 ${i < 4 ? 'fill-white' : 'fill-white/50'}`}><path d="m25.324.479 7.825 24.084h25.324l-20.487 14.887 7.824 24.084-20.486-14.886-20.487 14.886 7.825-24.084L-7.824 24.563H17.5z"/></svg>
                      </div>
                    ))}
                  </div>
                  <div className="text-zinc-400 flex items-center gap-2">
                    Excellent <span className="w-1 h-1 rounded-full bg-zinc-600" /> Based on <span className="text-white">472 reviews</span>
                    <span className="flex items-center gap-1 font-bold text-white ml-2">
                      <svg viewBox="0 0 31.98 31.98" className="w-5 h-5 fill-[#00b67a]"><path d="M31.98 15.99c0 8.831-7.159 15.99-15.99 15.99S0 24.821 0 15.99 7.159 0 15.99 0s15.99 7.159 15.99 15.99zM14.629 23.364l10.978-10.977-2.314-2.315-8.664 8.664-4.004-4.003-2.314 2.314 6.318 6.317z"/></svg>
                      Trustpilot
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-12 left-0 right-0 z-40 flex justify-center gap-4">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === idx ? 'w-12 bg-brand-gold shadow-glow-gold' : 'w-6 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
}
