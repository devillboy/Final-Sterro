import React from "react";
import Features from "../components/Features";
import Services from "../components/Services";
import { motion } from "motion/react";

export default function FeaturesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24"
    >
      <Services />
      <Features />
    </motion.div>
  );
}
