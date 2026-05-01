import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSounds } from "../utils/sounds";
import { ChevronRight } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const HERO_SLIDES = [
  {
    id: "minecraft",
    title: "Minecraft",
    highlight: "Hosting",
    description: "Experience premium Minecraft hosting powered by high-frequency processors. Lag-free gameplay without the premium price tag. Provisioned on our low-latency global network.",
    price: "₹90",
    bgUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2000&auto=format&fit=crop", // Game/MC feel
    fallbackBg: "https://cdn.discordapp.com/attachments/1414251304741638191/1496919234364706988/Download_Free_Minecraft_Wallpapers_and_Backgrounds.jpg?ex=69f433ec&is=69f2e26c&hm=b71364ad8c4d831b99d16ce45d777ca54578b519e492f5e9003192c4d04f6165&"
  },
  {
    id: "vps",
    title: "VPS",
    highlight: "Hosting",
    description: "Secure, scalable, and lightning-fast KVM hosting solutions. Give your projects the enterprise foundation they deserve with our high-performance infrastructure.",
    price: "₹240",
    bgUrl: "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=2000&auto=format&fit=crop", // Ultra reliable network image
    fallbackBg: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2000&auto=format&fit=crop"
  }
];

export default function Hero() {
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
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
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
            src={slide.id === 'minecraft' ? slide.fallbackBg : slide.bgUrl} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-30 flex flex-col justify-center preserve-3d">
        <div className="max-w-3xl flex flex-col items-start px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: -30, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: 30, rotateY: 10 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="preserve-3d"
            >
              <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-black tracking-[-0.04em] mb-6 leading-[0.9] text-white whitespace-nowrap font-display uppercase italic shadow-3d-lg">
                {slide.title}<span className="font-light text-brand-cyan/80 ml-4 not-italic"> {slide.highlight}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mb-12 leading-relaxed">
                {slide.description}
              </p>

              <div className="flex flex-col gap-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
                  <button 
                    onClick={() => { playClick(); handleGetStarted(); }}
                    className="px-10 py-5 bg-brand-cyan hover:bg-brand-cyan/90 text-bg-dark font-black rounded-2xl transition-all uppercase tracking-widest flex items-center gap-3 shadow-[0_20px_40px_rgba(0,240,255,0.3)] hover:scale-105"
                  >
                    GET STARTED
                    <ChevronRight size={18} />
                  </button>
                  <button 
                    onClick={() => { playClick(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black rounded-2xl transition-all uppercase tracking-widest backdrop-blur-md hover:scale-105"
                  >
                    Why Choose Us
                  </button>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400">Servers start at</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">{slide.price}</span>
                      <span className="text-sm text-zinc-400">/ Month</span>
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
      <div className="absolute bottom-12 left-0 right-0 z-40 flex justify-center gap-3">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-4 h-4 rounded-full border-2 transition-all ${currentSlide === idx ? 'bg-transparent border-white scale-110' : 'bg-transparent border-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
}
