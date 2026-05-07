import React from "react";
import Hero from "../components/Hero";
import GameGrid from "../components/GameGrid";
import Protection from "../components/Protection";
import PricingList from "../components/PricingList";
import { motion } from "motion/react";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <PricingList />
      <GameGrid />
      <Protection />
    </motion.div>
  );
}
