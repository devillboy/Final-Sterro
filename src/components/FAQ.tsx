import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is an Virtual Compute Node (VPS)?",
    answer: "A virtual compute node, or VPS, is an isolated environment within a larger high-performance physical machine. Each node maintains its own dedicated resource segment, ensuring consistent performance and total security."
  },
  {
    question: 'How does high-availability clustering work?',
    answer: "Our infrastructure uses an advanced distributed cluster architecture. If a specific node requires maintenance, our failover protocols ensure your services remain accessible through our global network matrix."
  },
  {
    question: "What is the expected provisioning time?",
    answer: "Our orchestration systems are fully autonomous. Resources are typically allocated and kernel-ready within 60 seconds of secure transaction verification."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-bg-dark border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 visible-grid-gold opacity-[0.01] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white uppercase font-display text-glow-gold">
            Support Center
          </h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">Expert insights into Sterro Cloud infrastructure.</p>
        </div>

        <div className="space-y-4 perspective-2000">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="platinum-glass border border-white/5 rounded-3xl overflow-hidden shadow-3d hover:border-brand-gold/30 transition-all group preserve-3d"
            >
              <button 
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className="text-base font-bold tracking-tight text-white/90 group-hover:text-brand-gold transition-colors">{faq.question}</span>
                <ChevronDown 
                  size={18} 
                  className={`text-slate-500 transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-brand-gold' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-slate-400 font-medium text-sm leading-relaxed border-t border-white/5 pt-6 mx-0">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
