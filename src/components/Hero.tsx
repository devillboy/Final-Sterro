import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSounds } from "../utils/sounds";
import { ChevronRight, Cloud, CloudRain, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const HERO_SLIDES = [
  {
    id: "minecraft",
    title: "Minecraft",
    highlight: "Optimization",
    description: "Experience premium Minecraft hosting powered by high-frequency processors. Lag-free gameplay with instant provisioning on our global edge network.",
    price: "₹90",
    bgUrl: "https://images.unsplash.com/photo-1587573089734-09cb99c75cb6?q=80&w=2000&auto=format&fit=crop",
    illustrationUrl: "https://images.unsplash.com/photo-1627398113743-bc0f3c473174?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "vps",
    title: "VPS",
    highlight: "Cloud",
    description: "Secure, scalable, and lightning-fast KVM hosting solutions. Give your projects the enterprise foundation they deserve with our high-performance infrastructure.",
    price: "₹240",
    bgUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
    illustrationUrl: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=1000&auto=format&fit=crop"
  }
];

const CloudRainEffect = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.3,
      size: 0.5 + Math.random() * 1.5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, opacity: 0 }}
          animate={{ 
            y: ['0vh', '100vh'],
            opacity: [0, p.opacity, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size * 20}px`,
            background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.3))',
            borderRadius: '100%',
          }}
        />
      ))}
      {/* Floating Clouds */}
      <motion.div 
        animate={{ x: [-20, 20], y: [-10, 10] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
        className="absolute top-20 left-1/4 opacity-10 blur-3xl"
      >
        <div className="w-96 h-64 bg-brand-gold rounded-full" />
      </motion.div>
      <motion.div 
        animate={{ x: [20, -20], y: [10, -10] }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "mirror" }}
        className="absolute bottom-40 right-1/4 opacity-10 blur-3xl"
      >
        <div className="w-96 h-64 bg-brand-gold rounded-full" />
      </motion.div>
    </div>
  );
};

export default function Hero() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { firebaseUser, loginGoogle } = useAuth();
  const { playClick } = useSounds();
  
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
      <CloudRainEffect />
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/80 to-bg-dark/40 z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent z-20" />
        
        <div className="absolute inset-0 z-10 visible-grid opacity-20" />
        
        <AnimatePresence initial={false}>
          <motion.img 
            key={slide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            src={slide.bgUrl} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 brightness-[0.5]"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-30 flex flex-col justify-center preserve-3d">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center px-4"
          >
            <div className="flex flex-col items-start order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative p-8 md:p-12 rounded-[2.5rem] platinum-glass border border-white/10 shadow-3d group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-br from-brand-gold/20 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur" />
                
                <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-6">
                    <Cloud size={14} className="text-brand-gold" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">Next-Gen Architecture</span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none text-white font-display">
                    {slide.title}<span className="text-brand-gold/60 font-medium ml-2"> {slide.highlight}</span>
                  </h1>
                  
                  <p className="text-base md:text-lg text-slate-300 max-w-xl mb-10 leading-relaxed font-medium">
                    {slide.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <button 
                      onClick={() => { playClick(); handleGetStarted(); }}
                      className="w-full sm:w-auto px-10 py-5 bg-brand-gold text-slate-950 font-black rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-3 shadow-glow-gold hover:translate-y-[-2px] active:translate-y-[1px]"
                    >
                      Deploy Node
                      <ChevronRight size={18} />
                    </button>
                    <div className="flex flex-col pl-6 border-l border-white/10">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Starting From</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white tracking-tight">{slide.price}</span>
                        <span className="text-xs text-slate-500 font-bold">/MO</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="relative order-1 lg:order-2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                animate={{ opacity: 1, scale: 1, rotateY: -10 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative w-full max-w-[500px] aspect-square"
              >
                <div className="absolute inset-0 bg-brand-gold/20 blur-[100px] rounded-full animate-pulse" />
                <motion.div
                  animate={{ 
                    y: [-10, 10, -10],
                    rotateZ: [-2, 2, -2]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 w-full h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-glow-gold p-2 platinum-glass"
                >
                  <img 
                    src={slide.illustrationUrl} 
                    alt={slide.title}
                    className="w-full h-full object-cover rounded-[2.5rem] brightness-90 group-hover:brightness-100 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent" />
                </motion.div>
                
                {/* 3D Floating elements */}
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -top-10 -right-10 w-32 h-32 platinum-glass border border-white/10 rounded-3xl p-4 shadow-3d z-20"
                >
                  <div className="w-full h-full bg-brand-gold/10 rounded-xl flex items-center justify-center">
                    <Zap className="text-brand-gold" size={32} />
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-10 -left-10 w-40 h-40 platinum-glass border border-white/10 rounded-3xl p-6 shadow-3d z-20"
                >
                  <div className="space-y-4">
                     <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-brand-gold" />
                     </div>
                     <div className="h-2 w-3/4 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-brand-gold" />
                     </div>
                     <div className="flex justify-between items-end mt-4">
                        <div className="text-[10px] font-black text-brand-gold uppercase">Uptime</div>
                        <div className="text-xl font-bold text-white">99.9%</div>
                     </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 left-0 right-0 z-40 flex justify-center gap-4">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === idx ? 'w-12 bg-brand-gold shadow-glow-gold' : 'w-6 bg-white/10 hover:bg-white/20'}`}
          />
        ))}
      </div>
    </section>
  );
}
