import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Shield, Zap, Globe, Cpu } from 'lucide-react';
import WorldMap from './WorldMap';

export default function Protection() {
  const [selectedLocation, setSelectedLocation] = useState("1");

  const regions = [
    {
      id: "1",
      continent: "Asia Cluster",
      node: "Mumbai - MA1",
      specs: "4.5GHz • NVMe Gen4",
      status: "Optimal",
      latency: "12ms"
    },
    {
      id: "2",
      continent: "Asia Pacific",
      node: "Singapore - SG1",
      specs: "4.2GHz • NVMe Gen4",
      status: "Active",
      latency: "24ms"
    },
    {
      id: "3",
      continent: "Europe Core",
      node: "Frankfurt - DE1",
      specs: "4.8GHz • Intel Gold",
      status: "Optimal",
      latency: "18ms"
    },
    {
      id: "4",
      continent: "North America",
      node: "New York - US1",
      specs: "4.4GHz • AMD EPYC",
      status: "Maintenance",
      latency: "45ms"
    }
  ];

  const activeRegion = regions.find(r => r.id === selectedLocation) || regions[0];

  return (
    <section id="locations" className="py-40 px-6 bg-bg-dark relative overflow-hidden">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent top-0 shadow-glow-gold" />
      <div className="absolute inset-0 cinematic-vignette opacity-60 z-0" />
      <div className="absolute inset-0 visible-grid-gold opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-8"
          >
            <Globe size={14} className="text-brand-gold animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold">Real-Time Infrastructure Sync</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white uppercase font-display text-glow-gold">
             Global <span className="text-brand-gold antialiased">Command</span> Grid
          </h2>
          <p className="text-zinc-500 max-w-3xl mx-auto font-black uppercase tracking-[0.5em] text-xs leading-relaxed opacity-60">
            Interactive routing matrix for our geo-distributed edge architecture.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          {/* Map Section */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="platinum-glass rounded-[3rem] p-4 border border-white/10 shadow-3d-lg relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="p-4 border-b border-white/5 flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-gold shadow-glow-gold" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Traffic Analysis</span>
                 </div>
                 <div className="text-[10px] font-bold text-brand-gold/60 uppercase tracking-widest animate-pulse">Live Feed Connected</div>
              </div>
              <WorldMap selectedId={selectedLocation} onSelect={setSelectedLocation} />
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-4 space-y-6">
             <AnimatePresence mode="wait">
               <motion.div
                 key={selectedLocation}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                 className="platinum-glass rounded-[2.5rem] p-10 border border-white/10 shadow-3d-lg h-full flex flex-col justify-between group"
               >
                 <div className="space-y-8">
                    <div className="flex justify-between items-start">
                       <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shadow-3d">
                          <Cpu size={32} />
                       </div>
                       <div className="text-right">
                          <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Latency</span>
                          <span className="text-3xl font-black text-brand-gold tracking-tighter drop-shadow-glow">{activeRegion.latency}</span>
                       </div>
                    </div>

                    <div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter font-display mb-2">{activeRegion.continent}</h3>
                       <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          <MapPin size={12} className="text-brand-gold" />
                          {activeRegion.node}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                          <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Hardware</span>
                          <span className="text-[10px] font-bold text-slate-200">{activeRegion.specs}</span>
                       </div>
                       <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                          <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</span>
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${activeRegion.status === 'Optimal' ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
                             <span className="text-[10px] font-bold text-slate-200 uppercase">{activeRegion.status}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 pt-8 border-t border-white/5">
                    <button className="w-full py-4 bg-brand-gold text-slate-950 font-black rounded-xl uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform shadow-glow-gold active:scale-95">
                       Deploy to this Node
                    </button>
                 </div>
               </motion.div>
             </AnimatePresence>

             <div className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 animate-pulse">
                   <Shield size={20} />
                </div>
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-relaxed">
                   Global DDoS scrubbing active via Anycast routing.
                </p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
