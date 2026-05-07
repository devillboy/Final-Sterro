import React from "react";
import PricingList from "../components/PricingList";
import FAQ from "../components/FAQ";
import { motion } from "motion/react";

export default function Pricing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24"
    >
      <PricingList />
      <FAQ />
    </motion.div>
  );
}
