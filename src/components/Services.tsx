import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, Terminal, Puzzle, ChevronRight } from "lucide-react";

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      icon: <LayoutDashboard size={20} className="text-brand-gold" />,
      title: "Omni-Channel Dashboard",
      desc: "Advanced telemetry visualization for real-time monitoring of resource distribution, latency metrics, and network health."
    },
    {
      icon: <Terminal size={20} className="text-brand-gold" />,
      title: "Low-Latency Terminal",
      desc: "Direct-to-node kernel access with encrypted shell execution and real-time log streaming for mission-critical operations."
    },
    {
      icon: <Puzzle size={20} className="text-brand-gold" />,
      title: "Module Orchestrator",
      desc: "Automated deployment of complex software stacks and plugin architectures with zero-configuration requirement."
    }
  ];

  return (
    <section id="services" className="py-40 px-6 relative bg-bg-dark overflow-hidden">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent top-0" />
      <div className="absolute inset-0 cinematic-vignette opacity-50 z-0" />
      <div className="absolute inset-0 visible-grid-gold opacity-[0.02] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-32">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase font-display text-glow-gold drop-shadow-2xl">
            Systems <span className="text-brand-gold/90 font-semibold font-display italic antialiased">Management</span>
          </h2>
          <p className="text-zinc-500 font-black max-w-2xl mx-auto text-xs leading-relaxed uppercase tracking-[0.6em]">
            Precision orchestration systems for elite enterprise operations.
          </p>
        </div>

        <div className="flex flex-col gap-8 max-w-3xl mx-auto perspective-2000">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`platinum-glass rounded-[2.5rem] overflow-hidden transition-all duration-1000 border border-white/5 ${activeTab === i ? 'border-brand-gold/40 shadow-glow-gold' : 'hover:border-white/20'}`}
              style={{ transformY: activeTab === i ? 0 : 0 }}
            >
              <button 
                onClick={() => setActiveTab(activeTab === i ? -1 : i)}
                className="w-full text-left p-10 flex items-center gap-10 cursor-pointer focus:outline-none group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-16 h-16 rounded-[1.25rem] bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-gold/20 group-hover:border-brand-gold/50 group-hover:shadow-glow-gold transition-all duration-700 relative z-10">
                  <div className={activeTab === i ? 'text-brand-gold scale-125 transition-transform duration-500' : 'text-slate-400 group-hover:text-brand-gold transition-all duration-500'}>
                    {f.icon}
                  </div>
                </div>
                <h3 className={`text-3xl font-black tracking-tighter transition-all duration-700 relative z-10 uppercase font-display ${activeTab === i ? 'text-brand-gold translate-x-4' : 'text-slate-200 group-hover:text-white group-hover:translate-x-2'}`}>
                  {f.title}
                </h3>
                <div className="ml-auto relative z-10">
                  <ChevronRight 
                    size={24} 
                    className={`transition-all duration-700 ${activeTab === i ? 'rotate-90 text-brand-gold scale-125' : 'text-zinc-600 group-hover:text-white'}`} 
                  />
                </div>
              </button>
              <AnimatePresence>
                {activeTab === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="px-10 pb-10 pt-0 ml-26 text-zinc-400 text-lg leading-relaxed font-medium relative z-10"
                  >
                    <div className="w-12 h-px bg-brand-gold/40 mb-6" />
                    {f.desc}
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
