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
    restDelta: 0.001,
  });

  const [showAdmin, setShowAdmin] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Artificial delay for an initial skeleton loading animation
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleOpenAdmin = () => setShowAdmin(true);
    window.addEventListener("OPEN_ADMIN_PANEL", handleOpenAdmin);
    return () =>
      window.removeEventListener("OPEN_ADMIN_PANEL", handleOpenAdmin);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#050914] flex flex-col items-center justify-center space-y-8 p-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-t-2 border-[#00F0FF] animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-blue-500 animate-spin flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full"></span>
          </div>
        </div>
        <div className="w-full max-w-4xl space-y-6">
          <div className="h-16 w-full bg-white/5 animate-pulse rounded-2xl border border-white/10"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-white/5 animate-pulse rounded-2xl border border-white/10"></div>
            <div className="h-64 bg-white/5 animate-pulse rounded-2xl border border-white/10"></div>
            <div className="h-64 bg-white/5 animate-pulse rounded-2xl border border-white/10"></div>
          </div>
          <div className="flex justify-center mt-12">
            <div className="h-8 w-48 bg-white/5 animate-pulse rounded-full border border-white/10"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CursorGlow />
      {showAdmin && <AdminPanel />}
      <div
        id="root"
        className="relative selection:bg-[#00F0FF] selection:text-black bg-[#050914] min-h-screen overflow-x-hidden text-white font-sans"
      >
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
