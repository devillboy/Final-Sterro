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
      <div className="min-h-screen bg-bg-dark overflow-hidden flex flex-col">
        {/* Navbar Skeleton */}
        <div className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-24">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse"></div>
             <div className="w-32 h-4 rounded-full bg-white/5 animate-pulse hidden sm:block"></div>
          </div>
          <div className="flex items-center gap-6">
             <div className="w-16 h-3 rounded-full bg-white/5 animate-pulse hidden lg:block"></div>
             <div className="w-16 h-3 rounded-full bg-white/5 animate-pulse hidden lg:block"></div>
             <div className="w-24 h-10 rounded-xl bg-white/5 animate-pulse"></div>
          </div>
        </div>

        {/* Hero Skeleton */}
        <div className="pt-32 pb-24 px-6 flex flex-col items-center text-center">
           <div className="w-48 h-8 rounded-full bg-white/5 animate-pulse mb-12"></div>
           <div className="w-full max-w-4xl h-16 sm:h-24 md:h-32 rounded-3xl bg-white/5 animate-pulse mb-8"></div>
           <div className="w-full max-w-xl h-6 rounded-full bg-white/5 animate-pulse mb-16"></div>
           <div className="flex gap-4">
              <div className="w-48 h-14 rounded-2xl bg-white/5 animate-pulse"></div>
              <div className="w-48 h-14 rounded-2xl bg-white/5 animate-pulse hidden sm:block"></div>
           </div>
        </div>

        {/* Grid Content Skeleton */}
        <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {[1, 2, 3].map((i) => (
             <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                   <div className="space-y-3">
                      <div className="w-32 h-6 rounded-lg bg-white/5 animate-pulse"></div>
                      <div className="w-24 h-4 rounded-full bg-white/5 animate-pulse"></div>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-white/5 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                   <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                   <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                   <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                   <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                </div>
                <div className="mt-8 h-14 rounded-2xl bg-white/5 animate-pulse w-full"></div>
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
        className="relative bg-bg-dark min-h-screen overflow-x-hidden text-white font-sans selection:bg-brand-cyan selection:text-bg-dark"
      >
        {/* Animated Background Glow */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-cyan/5 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/5 blur-[150px] rounded-full animate-pulse delay-1000" />
        </div>

        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-brand-cyan z-[100] origin-left shadow-[0_0_15px_rgba(0,240,255,0.5)]"
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
