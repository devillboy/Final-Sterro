import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSounds } from "../utils/sounds";
import { ChevronRight, Cloud, CloudRain, Zap, LayoutTemplate } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const HERO_SLIDES = [
  {
    id: "minecraft",
    title: "Minecraft",
    highlight: "Optimization",
    description: "Unleash your creativity on our ultra-low latency nodes. Powered by Ryzen 9 series processors for the ultimate block-building experience.",
    price: "₹90",
    bgUrl: "https://cdn.discordapp.com/attachments/1414251304741638191/1496919234364706988/Download_Free_Minecraft_Wallpapers_and_Backgrounds.jpg?ex=69fd6e6c&is=69fc1cec&hm=d6e957a8daff31c254deb2a7212d7761be538ac58eff2819317259294e2f7d1d&",
    illustrationUrl: "https://images.unsplash.com/photo-1627398113743-bc0f3c473174?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "vps",
    title: "Cloud VPS",
    highlight: "Performance",
    description: "Enterprise-grade KVM virtualization with dedicated NVMe storage. Deploy your most demanding projects with absolute confidence.",
    price: "₹240",
    bgUrl: "https://cdn.discordapp.com/attachments/1414251304741638191/1497103165689167923/qHFzGKFBz7kvxiVyjoe6JJ-1024-80.jpg.webp?ex=69fd70f9&is=69fc1f79&hm=e4e7fae7a3bc571675731dcf155f8334df1ecae822df8aec30f940b976e0b46e&",
    illustrationUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=1000&auto=format&fit=crop"
  }
];

const CloudRainEffect = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3,
      opacity: 0.1 + Math.random() * 0.4,
      size: 1 + Math.random() * 2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: -100, opacity: 0 }}
            animate={{ 
              y: ['0vh', '110vh'],
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
              height: `${p.size * 25}px`,
              background: 'linear-gradient(to bottom, transparent, rgba(255, 193, 7, 0.4))',
              borderRadius: '100px',
              filter: 'blur(1px)',
            }}
          />
        ))}
      </AnimatePresence>
      {/* Cinematic Clouds */}
      <motion.div 
        animate={{ 
          x: [-100, 100], 
          y: [-20, 20],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute -top-20 left-0 opacity-[0.03] blur-[120px]"
      >
        <div className="w-[800px] h-[500px] bg-brand-gold rounded-full" />
      </motion.div>
      <motion.div 
        animate={{ 
          x: [100, -100], 
          y: [20, -20],
          scale: [1.1, 1, 1.1]
        }}
        transition={{ duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="absolute -bottom-40 right-0 opacity-[0.03] blur-[150px]"
      >
        <div className="w-[1000px] h-[600px] bg-brand-gold rounded-full" />
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
    <section className="relative pt-32 pb-32 px-6 overflow-hidden flex items-center border-b border-white/5 min-h-[95vh] perspective-2000">
      <CloudRainEffect />
      <div className="absolute inset-0 grain-overlay z-40" />
      <div className="absolute inset-0 cinematic-vignette z-30" />
      
      {/* Letterbox Bars */}
      <div className="absolute top-0 left-0 w-full h-12 bg-black z-50 md:block hidden" />
      <div className="absolute bottom-0 left-0 w-full h-12 bg-black z-50 md:block hidden" />

      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
        
        <div className="absolute inset-0 z-10 visible-grid-gold opacity-10" />
        
        <AnimatePresence mode="wait">
          <motion.img 
            key={slide.id}
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px) brightness(0.2)' }}
            animate={{ opacity: 0.4, scale: 1, filter: 'blur(0px) brightness(0.4)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px) brightness(0.2)' }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            src={slide.bgUrl} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-30 flex flex-col justify-center preserve-3d">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
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
                    <button 
                      onClick={() => { playClick(); navigate('/features'); }}
                      className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 hover:translate-y-[-2px] active:translate-y-[1px]"
                    >
                      View Features
                      <LayoutTemplate size={18} className="text-brand-gold" />
                    </button>
                    <div className="flex flex-col pl-6 border-l border-white/10 h-12 justify-center">
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
                initial={{ opacity: 0, scale: 0.8, rotateY: 30, x: 50 }}
                animate={{ opacity: 1, scale: 1, rotateY: -15, x: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative w-full max-w-[500px] aspect-square"
              >
                <div className="absolute inset-0 bg-brand-gold/30 blur-[120px] rounded-full animate-pulse" />
                <motion.div
                  animate={{ 
                    y: [-15, 15, -15],
                    rotateZ: [-3, 3, -3]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 w-full h-full rounded-[3.5rem] overflow-hidden border border-white/20 shadow-glow-gold-strong p-3 platinum-glass"
                >
                  <img 
                    src={slide.illustrationUrl} 
                    alt={slide.title}
                    className="w-full h-full object-cover rounded-[2.8rem] brightness-100 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Glass Shine */}
                  <motion.div 
                    animate={{ left: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                    className="absolute inset-y-0 w-32 bg-white/20 skew-x-[-20deg] blur-xl"
                  />
                </motion.div>
                
                {/* 3D Floating elements */}
                <motion.div 
                  animate={{ 
                    y: [0, -30, 0],
                    rotateZ: [0, 10, 0],
                    translateZ: [0, 50, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -top-12 -right-12 w-36 h-36 platinum-glass border border-white/20 rounded-[2rem] p-5 shadow-3d-lg z-20 flex items-center justify-center translate-z-50"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <div className="w-full h-full bg-brand-gold/20 rounded-2xl flex items-center justify-center">
                    <Zap className="text-brand-gold drop-shadow-glow" size={40} />
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ 
                    y: [0, 30, 0],
                    rotateZ: [0, -5, 0],
                    translateZ: [0, 80, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-12 -left-12 w-48 h-48 platinum-glass border border-white/20 rounded-[2rem] p-8 shadow-3d-lg z-20 translate-z-80"
                  style={{ transform: 'translateZ(80px)' }}
                >
                  <div className="space-y-5">
                     <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: ['0%', '85%', '85%'] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          className="h-full bg-brand-gold shadow-glow-gold" 
                        />
                     </div>
                     <div className="h-3 w-3/4 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: ['0%', '65%', '65%'] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.2 }}
                          className="h-full bg-brand-gold shadow-glow-gold" 
                        />
                     </div>
                     <div className="flex justify-between items-end mt-6">
                        <div className="text-[11px] font-black text-brand-gold uppercase tracking-[0.2em]">Efficiency</div>
                        <div className="text-2xl font-bold text-white tracking-tighter">99<span className="text-brand-gold">.</span>9<span className="text-[12px] opacity-40 ml-1">%</span></div>
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
