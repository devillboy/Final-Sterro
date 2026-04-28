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
import SupportChat from "./components/SupportChat";
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
      <div className="min-h-screen bg-[#050914] overflow-hidden">
        {/* Navbar Skeleton */}
        <div className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-24">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#1a1f2e] animate-pulse"></div>
             <div className="w-32 h-6 rounded-md bg-[#1a1f2e] animate-pulse hidden sm:block"></div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-20 h-6 rounded-md bg-[#1a1f2e] animate-pulse hidden sm:block"></div>
             <div className="w-20 h-6 rounded-md bg-[#1a1f2e] animate-pulse hidden sm:block"></div>
             <div className="w-10 h-10 rounded-full bg-[#1a1f2e] animate-pulse"></div>
          </div>
        </div>

        {/* Hero Skeleton (like YouTube banner or FB cover) */}
        <div className="pt-24 pb-16 px-6 flex flex-col items-center text-center">
           <div className="w-32 h-8 rounded-full bg-[#1a1f2e] animate-pulse mb-8"></div>
           <div className="w-full max-w-2xl h-16 sm:h-20 rounded-2xl bg-[#1a1f2e] animate-pulse mb-6"></div>
           <div className="w-full max-w-sm h-6 rounded-md bg-[#1a1f2e] animate-pulse mb-12"></div>
        </div>

        {/* Grid Content Skeleton (YouTube-like video grid or Pricing Pricing Cards) */}
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-24">
          {[1, 2, 3, 4].map((i) => (
             <div key={i} className="flex flex-col gap-4">
                {/* Big Thumbnail/Card Body */}
                <div className="w-full h-64 rounded-2xl bg-[#1a1f2e] animate-pulse"></div>
                {/* Details Row */}
                <div className="flex items-start gap-4 mt-2">
                   {/* Avatar/Icon */}
                   <div className="w-10 h-10 rounded-full bg-[#1a1f2e] animate-pulse shrink-0"></div>
                   {/* Text lines */}
                   <div className="flex-1 space-y-3 py-1">
                      <div className="h-4 bg-[#1a1f2e] rounded-md w-5/6 animate-pulse"></div>
                      <div className="h-3 bg-[#1a1f2e] rounded-md w-2/3 animate-pulse"></div>
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CursorGlow />
      {showAdmin && <AdminPanel />}
      <div
        id="app-main"
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
      <SupportChat />
    </AuthProvider>
  );
}
