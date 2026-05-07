import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

export default function Protection() {
  const regions = [
    {
      continent: "Asia",
      locations: ["India - Noida", "India - Mumbai", "Singapore - Singapore"]
    },
    {
      continent: "Europe",
      locations: ["Germany - Frankfurt"]
    }
  ];

  return (
    <section id="locations" className="py-32 px-6 bg-bg-dark relative overflow-hidden">
      <div className="absolute inset-0 visible-grid-gold opacity-[0.02] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter text-white uppercase font-display text-glow-gold">
             Global <span className="text-brand-gold antialiased">Infrastructure</span> Nodes
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto font-bold uppercase tracking-[0.4em] text-sm leading-relaxed">
            Ultra-low latency delivery via our geo-distributed edge architecture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 text-white">
          {regions.map((region, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="platinum-glass rounded-[3rem] p-12 flex flex-col hover:border-brand-gold/20 transition-all duration-700 relative overflow-hidden preserve-3d"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />
              
              <h3 className="text-4xl font-bold mb-10 tracking-tighter text-white font-display uppercase relative z-10">{region.continent}</h3>
              
              <ul className="space-y-8 relative z-10">
                {region.locations.map((loc, i) => (
                  <li key={i} className="flex items-center gap-6 group/loc">
                    <div className="w-14 h-14 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center shrink-0 shadow-3d-sm group-hover/loc:bg-brand-gold/10 group-hover/loc:border-brand-gold/30 transition-all duration-500">
                      <MapPin size={24} className="text-brand-gold" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="block text-white text-2xl font-bold tracking-tighter uppercase font-display">{loc}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      </div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-bold">Connected Active Node</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
