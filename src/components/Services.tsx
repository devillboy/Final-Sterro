import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, Terminal, Puzzle } from "lucide-react";

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      icon: <LayoutDashboard size={20} className="text-brand-cyan" />,
      title: "Dashboard",
      desc: "Get an instant overview of your server's health, resource usage, and player activity all in one clean interface."
    },
    {
      icon: <Terminal size={20} className="text-brand-cyan" />,
      title: "Real-Time Console",
      desc: "Monitor your server logs and issue commands in real-time with our lightning-fast terminal."
    },
    {
      icon: <Puzzle size={20} className="text-brand-cyan" />,
      title: "Mods Installer",
      desc: "Browse and install thousands of mods and plugins with a single click. No FTP required."
    }
  ];

  return (
    <section id="services" className="py-32 px-6 relative bg-bg-dark border-t border-white/5 visible-grid">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter uppercase italic">
            Titan <span className="text-brand-cyan">Control Panel</span>
          </h2>
          <p className="text-zinc-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            Automated management systems engineered for speed. Control your global instances via our unified high-frequency dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {features.map((f, i) => (
            <div key={i} className="platinum-glass platinum-glass-hover rounded-[2rem] overflow-hidden">
              <button 
                onClick={() => setActiveTab(activeTab === i ? -1 : i)}
                className="w-full text-left p-6 flex items-center gap-4 cursor-pointer focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{f.title}</h3>
              </button>
              <AnimatePresence>
                {activeTab === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 pt-0 ml-14 text-zinc-400"
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
