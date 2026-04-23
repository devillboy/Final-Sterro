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
            Your Questions, <span className="text-[#00F0FF]">Our Answers</span>
          </h2>
          <p className="text-[var(--color-text-dim)] font-medium text-lg">Everything you need to know to launch your own server</p>
        </div>

        <div className="space-y-4 perspective-2000">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-3d hover:border-[#00F0FF]/30 transition-all group preserve-3d"
            >
              <button 
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <span className="text-base font-bold tracking-tight text-white/90 group-hover:text-[#00F0FF] transition-colors">{faq.question}</span>
                <ChevronDown 
                  size={18} 
                  className={`text-[var(--color-text-dim)] transition-transform duration-200 ${activeIndex === index ? 'rotate-180 text-[#00F0FF]' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-[var(--color-text-dim)] font-medium text-sm leading-relaxed border-t border-[var(--color-border)] pt-4 mt-1">
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
