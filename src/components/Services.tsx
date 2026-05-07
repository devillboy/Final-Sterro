import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, Terminal, Puzzle } from "lucide-react";

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
    <section id="services" className="py-32 px-6 relative bg-bg-dark border-t border-white/5 visible-grid">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight uppercase font-display text-glow-gold text-premium-gradient">
            Systems <span className="text-brand-gold/80 font-semibold font-display">Management</span>
          </h2>
          <p className="text-slate-500 font-bold max-w-2xl mx-auto text-[10px] leading-relaxed uppercase tracking-[0.4em]">
            Precision orchestration systems for elite operations.
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="platinum-glass platinum-glass-hover rounded-3xl overflow-hidden transition-all duration-500">
              <button 
                onClick={() => setActiveTab(activeTab === i ? -1 : i)}
                className="w-full text-left p-8 flex items-center gap-6 cursor-pointer focus:outline-none group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center shrink-0 group-hover:bg-brand-gold/10 group-hover:border-brand-gold/20 transition-all duration-500">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-100 tracking-tight group-hover:text-brand-gold transition-colors">{f.title}</h3>
              </button>
              <AnimatePresence>
                {activeTab === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-8 pb-8 pt-0 ml-18 text-slate-400 text-sm leading-relaxed"
                  >
                    {f.desc}
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
