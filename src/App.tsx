/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import GameGrid from "./components/GameGrid";
import Services from "./components/Services";
import PricingList from "./components/PricingList";
import Features from "./components/Features";
import Protection from "./components/Protection";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import CursorGlow from "./components/CursorGlow";
import AdminPanel from "./components/AdminPanel";
import { motion, useScroll, useSpring } from "motion/react";
import { AuthProvider } from "./contexts/AuthContext";
import { useState, useEffect } from "react";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const handleOpenAdmin = () => setShowAdmin(true);
    window.addEventListener('OPEN_ADMIN_PANEL', handleOpenAdmin);
    return () => window.removeEventListener('OPEN_ADMIN_PANEL', handleOpenAdmin);
  }, []);

  return (
    <AuthProvider>
      <CursorGlow />
      {showAdmin && <AdminPanel />}
      <div id="root" className="relative selection:bg-[#00F0FF] selection:text-black bg-[#050914] min-h-screen overflow-x-hidden text-white font-sans">
        {/* Animated Background Glow */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00F0FF]/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />
        </div>

        {/* Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-[2px] bg-[#00F0FF] z-[100] origin-left shadow-[0_0_10px_#00F0FF]" 
          style={{ scaleX }} 
        />

        <Navbar />
        
        <main>
          <div id="hero">
            <Hero />
          </div>
          <div id="games">
            <GameGrid />
          </div>
          <div id="services">
            <Services />
          </div>
          <div id="pricing">
            <PricingList />
          </div>
          <Features />
          <Protection />
          <FAQ />
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

