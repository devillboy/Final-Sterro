import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is a Root Server (VPS)?",
    answer: "A root server, or VPS (Virtual Private Server), is a virtualized server that acts exactly like a dedicated server within a larger physical machine. You get your own dedicated segment with guaranteed resources."
  },
  {
    question: 'What does "Root Access" mean?',
    answer: "Root access means you have full administrative privileges on your server. You can install any software, modify system files, and configure the server exactly as you need it."
  },
  {
    question: "How quickly is the server activated?",
    answer: "Our systems are fully automated. Once your payment clears, your server will be provisioned and ready to use in less than 60 seconds in most cases."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-[var(--color-bg-main)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Your Questions, <span className="text-[#007BFF]">Our Answers</span>
          </h2>
          <p className="text-[var(--color-text-dim)] font-medium text-lg">Everything you need to know to launch your own server</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border-b border-[var(--color-border)] overflow-hidden"
            >
              <button 
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full py-5 pr-4 flex items-center justify-between text-left group"
              >
                <span className="text-base font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors">{faq.question}</span>
                <ChevronDown 
                  size={18} 
                  className={`text-[var(--color-text-dim)] transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-white' : ''}`} 
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
                    <div className="pb-6 pr-8 text-[var(--color-text-dim)] font-medium text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
