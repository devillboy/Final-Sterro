import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSounds } from "../utils/sounds";
import { ChevronRight, Cloud, CloudRain, Zap, LayoutTemplate } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const HERO_SLIDES = [
  {
    id: "minecraft",
    title: "Forge Your Kingdom",
    highlight: "Minecraft Elite",
    description: "Unleash the full potential of your Minecraft world on our high-performance Xeon infrastructure. Zero lag, absolute dominion.",
    price: "₹90",
    bgUrl: "https://cdn.discordapp.com/attachments/1414251304741638191/1496919234364706988/Download_Free_Minecraft_Wallpapers_and_Backgrounds.jpg?ex=69fd6e6c&is=69fc1cec&hm=d6e957a8daff31c254deb2a7212d7761be538ac58eff2819317259294e2f7d1d&",
    illustrationUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "vps",
    title: "Cloud Infrastructure",
    highlight: "KVM Dedicated",
    description: "Enterprise-grade KVM virtualization with dedicated NVMe storage. Deploy your most demanding projects with absolute hardware isolation.",
    price: "₹240",
    bgUrl: "https://cdn.discordapp.com/attachments/1414251304741638191/1497103165689167923/qHFzGKFBz7kvxiVyjoe6JJ-1024-80.jpg.webp?ex=69fd70f9&is=69fc1f79&hm=e4e7fae7a3bc571675731dcf155f8334df1ecae822df8aec30f940b976e0b46e&",
    illustrationUrl: "/src/assets/images/regenerated_image_1778300953384.png"
  }
];

const CloudRainEffect = () => {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden scale-110">
      {/* Cinematic Fog Layers */}
      <motion.div 
        animate={{ 
          x: [-20, 20],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-tr from-brand-gold/5 via-brand-gold/10 to-transparent blur-[120px] mix-blend-screen"
      />
      <motion.div 
        animate={{ 
          x: [20, -20],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute inset-0 bg-gradient-to-bl from-brand-gold/10 via-transparent to-brand-gold/5 blur-[100px] mix-blend-screen"
      />
      
      {/* Minecraft Rain Elements */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -50, x: Math.random() * 100 + "%", opacity: 0 }}
            animate={{ 
              y: ["0vh", "120vh"],
              opacity: [0, 1, 1, 0],
              height: ["2px", "100px", "100px", "2px"]
            }}
            transition={{
              duration: Math.random() * 0.5 + 0.5,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
            className="absolute w-[1px] bg-brand-gold shadow-[0_0_10px_rgba(0,245,255,0.5)]"
          />
        ))}
      </div>
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
                    y: [0, -40, 0],
                    rotateZ: [0, 15, 0],
                    rotateX: [0, -10, 0],
                    translateZ: [0, 80, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -top-16 -right-16 w-40 h-40 platinum-glass border border-white/20 rounded-[2.5rem] p-6 shadow-3d-lg z-20 flex items-center justify-center translate-z-80"
                  style={{ transform: 'translateZ(80px)' }}
                >
                  <div className="w-full h-full bg-brand-gold/20 rounded-3xl flex items-center justify-center relative group/inner">
                    <div className="absolute inset-0 bg-brand-gold/20 blur-2xl rounded-full opacity-0 group-hover/inner:opacity-100 transition-opacity" />
                    <Zap className="text-brand-gold drop-shadow-glow" size={48} />
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ 
                    y: [0, 40, 0],
                    rotateZ: [0, -10, 0],
                    rotateX: [0, 5, 0],
                    translateZ: [0, 110, 0]
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-16 -left-16 w-56 h-56 platinum-glass border border-white/20 rounded-[2.5rem] p-10 shadow-3d-lg z-20 translate-z-110"
                  style={{ transform: 'translateZ(110px)' }}
                >
                  <div className="space-y-6">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-black text-brand-gold/60 uppercase tracking-[0.3em]">Node Load</span>
                        <span className="text-[10px] font-bold text-white">42%</span>
                     </div>
                     <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                        <motion.div 
                          animate={{ width: ['20%', '85%', '42%'] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                          className="h-full bg-brand-gold shadow-glow-gold rounded-full" 
                        />
                     </div>
                     <div className="h-4 w-5/6 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                        <motion.div 
                          animate={{ width: ['10%', '65%', '31%'] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, delay: 0.2 }}
                          className="h-full bg-brand-gold shadow-glow-gold rounded-full" 
                        />
                     </div>
                     <div className="flex justify-between items-end mt-8">
                        <div className="text-[11px] font-black text-brand-gold uppercase tracking-[0.2em]">Uptime</div>
                        <div className="text-3xl font-bold text-white tracking-tighter">99<span className="text-brand-gold">.</span>99<span className="text-[12px] opacity-40 ml-1">%</span></div>
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
