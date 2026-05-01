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
    <section id="locations" className="py-24 px-6 bg-[#03060d]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
            Global Presence, <br className="md:hidden" />
            <span className="text-brand-cyan">Local Performance</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Our rapidly expanding datacenter network spans across the Americas and Europe, delivering ultra-low latency from anywhere and lightning-fast connections wherever you play.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 text-white">
          {regions.map((region, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#0a1024] border border-white/5 rounded-[2rem] p-8 flex flex-col hover:border-brand-cyan/20 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 rounded-full blur-[80px]" />
              
              <h3 className="text-3xl font-black mb-8 tracking-tight text-white relative z-10">{region.continent}</h3>
              
              <ul className="space-y-4 relative z-10 font-bold">
                {region.locations.map((loc, i) => (
                  <li key={i} className="flex items-center gap-4 text-zinc-300 text-lg hover:text-brand-cyan transition-colors">
                    <div className="w-12 h-12 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center shrink-0 shadow-2xl">
                      <MapPin size={22} className="text-brand-cyan" />
                    </div>
                    <div>
                      <span className="block text-white text-xl">{loc}</span>
                      <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-black">Connected Node</span>
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
