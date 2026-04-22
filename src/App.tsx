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
import { motion, useScroll, useSpring } from "motion/react";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative selection:bg-[#007BFF] selection:text-white bg-[var(--color-bg-main)]">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#007BFF] z-[100] origin-left" 
        style={{ scaleX }} 
      />

      <Navbar />
      
      <main>
        <Hero />
        <GameGrid />
        <Services />
        <PricingList />
        <Features />
        <Protection />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}

