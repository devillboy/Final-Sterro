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
      {/* Infrastructure Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,245,255,0.1),transparent_50%)]" />
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent top-0 shadow-glow-gold" />
      <div className="absolute inset-0 cinematic-vignette opacity-80 z-0" />
      <div className="absolute inset-0 visible-grid-gold opacity-[0.05] pointer-events-none" />
      
      {/* Floating UI Elements for Depth */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-gold/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand-gold/5 blur-[120px] rounded-full animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-10 shadow-3d"
          >
            <div className="relative">
              <Globe size={16} className="text-brand-gold" />
              <div className="absolute inset-0 text-brand-gold blur-sm animate-pulse"><Globe size={16} /></div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold drop-shadow-glow">Global Edge Mesh Connected</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-9xl font-black mb-10 tracking-tighter text-white uppercase font-display leading-[0.8] drop-shadow-2xl">
             Infrastructure <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-white to-brand-gold antialiased">Orchestration</span>
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto font-black uppercase tracking-[0.7em] text-[10px] leading-relaxed opacity-60">
            Real-time latency synchronization across our tier-4 geo-clusters.
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
                 initial={{ opacity: 0, y: 30, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: -30, scale: 0.95 }}
                 transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                 className="platinum-glass rounded-[3rem] p-12 border border-white/10 shadow-3d-lg h-full flex flex-col justify-between group/panel relative overflow-hidden"
               >
                 <div className="absolute top-0 right-0 p-8">
                    <div className="text-[6px] font-black text-brand-gold/20 uppercase tracking-[0.5em] transform rotate-90 origin-right">CONTROL_UNIT_v4.2</div>
                 </div>

                 <div className="space-y-12 relative z-10">
                    <div className="flex justify-between items-start">
                       <div className="relative">
                          <div className="absolute inset-0 bg-brand-gold blur-2xl opacity-20" />
                          <div className="w-20 h-20 rounded-3xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shadow-3d group-hover/panel:bg-brand-gold group-hover/panel:text-slate-950 transition-all duration-700">
                             <Cpu size={40} className="transition-transform duration-700 group-hover/panel:rotate-90" />
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2">Network RTT</span>
                          <div className="flex items-end justify-end gap-1">
                             <span className="text-5xl font-black text-white tracking-tighter drop-shadow-glow">{activeRegion.latency.replace('ms', '')}</span>
                             <span className="text-[10px] font-bold text-brand-gold mb-2 uppercase tracking-widest">ms</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <h3 className="text-5xl font-black text-white uppercase tracking-tighter font-display leading-none group-hover/panel:text-brand-gold transition-colors duration-700">{activeRegion.continent}</h3>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-px bg-brand-gold/40" />
                          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                            {activeRegion.node}
                          </p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 group-hover/panel:border-brand-gold/20 transition-colors">
                          <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-3">Hardware Specification</span>
                          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">{activeRegion.specs}</span>
                       </div>
                       <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                          <div className="space-y-1">
                             <span className="block text-[8px] font-black text-zinc-600 uppercase tracking-widest">Operational Status</span>
                             <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${activeRegion.status === 'Optimal' ? 'bg-brand-gold shadow-glow-gold' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'} animate-pulse`} />
                                <span className="text-xs font-black text-slate-100 uppercase tracking-widest">{activeRegion.status}</span>
                             </div>
                          </div>
                          <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               animate={{ x: ['-100%', '100%'] }}
                               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                               className="w-1/2 h-full bg-brand-gold/40"
                             />
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12">
                    <button className="w-full py-6 bg-brand-gold text-slate-950 font-black rounded-2xl uppercase text-[11px] tracking-[0.2em] hover:scale-[1.02] hover:shadow-glow-gold-strong transition-all duration-500 active:scale-95 flex items-center justify-center gap-3">
                       Initialize Node Deployment
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
