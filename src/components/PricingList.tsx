import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSounds } from '../utils/sounds';
import { useNavigate } from 'react-router-dom';
import { Cpu, HardDrive, MemoryStick, Activity, Network, Archive, LayoutTemplate, Shield, Database, Users, Gamepad2, Server, X, Upload, CheckCircle2, Loader2, AlertCircle, MapPin, Copy, CreditCard, ChevronRight, ChevronLeft, Info, HelpCircle, Settings, Paperclip, Folder, ImagePlus, Star, Zap } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

interface Plan {
  id: string;
  name: string;
  price: string | number;
  ram: string;
  cpu: string;
  storage: string;
  ssd?: string;
  throughput?: string;
  ports: string;
  type: 'minecraft' | 'vps';
  highlight?: boolean;
  order: number;
  isTrial?: boolean;
  backups?: string;
  db?: string;
  ddos?: string;
  players?: string;
}

import { VPS_PLANS, MINECRAFT_PLANS, Plan } from '../constants/plans';

export default function PricingList() {
  const [activeTab, setActiveTab] = useState<'minecraft' | 'vps'>('minecraft');
  const [minecraftPlans, setMinecraftPlans] = useState<Plan[]>(MINECRAFT_PLANS);
  const [vpsPlans, setVpsPlans] = useState<Plan[]>(VPS_PLANS);
  const [loading, setLoading] = useState(true);
  const { playClick } = useSounds();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPlans() {
      setLoading(true);
      try {
        const q = query(collection(db, "plans"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const allPlans = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plan));
          
          let fetchedMcPlans = allPlans.filter(p => p.type === 'minecraft');
          if (fetchedMcPlans.length === 0) fetchedMcPlans = MINECRAFT_PLANS;

          if (!fetchedMcPlans.some(p => p.isTrial)) {
            const defaultTrial = MINECRAFT_PLANS.find(p => p.isTrial);
            if (defaultTrial) {
               fetchedMcPlans = [defaultTrial, ...fetchedMcPlans];
            }
          }
          
          setMinecraftPlans(fetchedMcPlans);
          const fetchedVpsPlans = allPlans.filter(p => p.type === 'vps');
          setVpsPlans(fetchedVpsPlans.length > 0 ? fetchedVpsPlans : VPS_PLANS);
        } else {
          setMinecraftPlans(MINECRAFT_PLANS);
          setVpsPlans(VPS_PLANS);
        }
      } catch (e) {
        console.warn("Live plans load failed, using fallbacks.");
        setMinecraftPlans(MINECRAFT_PLANS);
        setVpsPlans(VPS_PLANS);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  return (
    <section id="pricing" className="relative py-40 px-6 bg-bg-dark overflow-hidden min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent shadow-glow-gold" />
      <div className="absolute inset-0 cinematic-vignette opacity-60 z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 overflow-visible">
        <div className="text-center mb-32 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-none text-white uppercase font-display drop-shadow-2xl">
            Enterprise <span className="text-brand-gold antialiased">Optimization</span>
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto mb-20 text-xs font-black uppercase tracking-[0.6em] leading-relaxed opacity-70">
            Scalable nodes engineered for high-availability enterprise operations. 
          </p>
          
          <div className="inline-flex p-2 bg-black/80 border border-white/10 rounded-[2.5rem] relative z-20 backdrop-blur-3xl mx-auto mb-20 shadow-3d-lg group">
            <div className="absolute -inset-1 bg-brand-gold/10 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <button
              onClick={() => { playClick(); setActiveTab('minecraft'); }}
              className={`relative z-10 flex items-center justify-center gap-4 px-12 py-5 rounded-[2rem] font-black text-[11px] tracking-widest transition-all duration-700 uppercase ${activeTab === 'minecraft' ? 'bg-brand-gold text-slate-950 shadow-glow-gold-strong scale-[1.02]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              <Gamepad2 size={18} /> Gaming Clusters
            </button>
            <button
              onClick={() => { playClick(); setActiveTab('vps'); }}
              className={`relative z-10 flex items-center justify-center gap-4 px-12 py-5 rounded-[2rem] font-black text-[11px] tracking-widest transition-all duration-700 uppercase ${activeTab === 'vps' ? 'bg-brand-gold text-slate-950 shadow-glow-gold-strong scale-[1.02]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              <Server size={18} /> Virtual Compute
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-[10px] font-bold tracking-[0.3em] text-zinc-600 uppercase max-w-3xl mx-auto mb-8">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-green-500/50 rounded-full animate-pulse" />
               Global Regions: IN, US, DE, SG
             </div>
             <div className="hidden md:block w-px h-4 bg-white/10" />
             <div className="flex items-center gap-2">
               <Shield size={14} className="text-brand-gold/60" />
               DDoS Protection Suite Active
             </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-10"
          >
            {loading ? (
              <div className="space-y-6">
                <PlanSkeleton highlight={false} />
                <PlanSkeleton highlight={true} />
              </div>
            ) : (
              <>
                {activeTab === 'minecraft' ? (
                  minecraftPlans.length > 0 ? (
                    minecraftPlans.map((p, i) => (
                      <motion.div
                        key={`mc-${p.id}-${i}`}
                        whileHover={{ y: -15, rotateX: 3, rotateY: -3, translateZ: 40 }}
                        className={`group relative platinum-glass border border-white/10 ${p.highlight ? 'shadow-glow-gold-strong' : 'shadow-3d-lg'} rounded-[4rem] p-2 flex flex-col md:flex-row items-stretch gap-0 transition-all duration-1000 overflow-hidden backdrop-blur-3xl preserve-3d`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        {/* Visual Side */}
                        <div className="relative w-full md:w-[420px] h-72 md:h-auto overflow-hidden shrink-0">
                          <motion.img 
                            src="https://cdn.discordapp.com/attachments/1414251304741638191/1496919234364706988/Download_Free_Minecraft_Wallpapers_and_Backgrounds.jpg?ex=69fd6e6c&is=69fc1cec&hm=d6e957a8daff31c254deb2a7212d7761be538ac58eff2819317259294e2f7d1d&"
                            alt="" 
                            className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-70 transition-all duration-1000" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent hidden md:block" />
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
                          
                          <div className="absolute inset-0 flex flex-col justify-end p-12" style={{ transform: 'translateZ(50px)' }}>
                             <div className="flex items-center gap-4 mb-4">
                               <div className="w-10 h-1 bg-brand-gold rounded-full shadow-glow-gold" />
                               <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em]">Infrastructure Core</span>
                             </div>
                             <h4 className="text-4xl font-black text-white uppercase tracking-tighter font-display drop-shadow-glow">STERRO • {p.name}</h4>
                          </div>
                        </div>

                        {/* Content Side */}
                          <div className="flex-1 p-12 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10" style={{ transform: 'translateZ(60px)' }}>
                            <div className="flex-1 w-full space-y-12">
                              <div className="hidden lg:block">
                                <div className="flex items-center gap-6 mb-4">
                                   <h4 className="text-5xl font-black text-slate-100 uppercase tracking-tighter group-hover:text-brand-gold transition-colors duration-700 font-display text-glow-gold">{p.name}</h4>
                                   {p.highlight && (
                                     <motion.span 
                                       animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                                       transition={{ duration: 4, repeat: Infinity }}
                                       className="bg-brand-gold text-slate-950 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2 shadow-glow-gold-strong"
                                     >
                                       <Star size={12} fill="currentColor" /> Enterprise Tier
                                     </motion.span>
                                   )}
                                </div>
                                <p className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.4em] flex items-center gap-3">
                                  <Zap size={16} className="text-brand-gold group-hover:animate-pulse" />
                                  Tier-1 High-Availability Cluster Engineered in Noida
                                </p>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                                {[
                                  { icon: MemoryStick, label: "Core RAM", value: p.ram, detail: "DDR4 ECC 3200MHz" },
                                  { icon: Cpu, label: "Processing", value: p.cpu, detail: "High-Freq Xeon" },
                                  { icon: HardDrive, label: "NVMe Raid", value: p.storage || p.ssd, detail: "Gen4 Read/Write" },
                                  { icon: Network, label: "Uplink", value: "Gigabit+", detail: "Burstable 2Gbps" },
                                ].map((spec, idx) => (
                                  <div key={idx} className="relative p-7 md:p-9 rounded-[2.5rem] bg-white/[0.03] border border-white/5 transition-all duration-700 hover:border-brand-gold/40 hover:bg-white/[0.08] hover:shadow-3d group/spec shadow-3d-lg overflow-hidden flex flex-col justify-between">
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 via-transparent to-transparent opacity-0 group-hover/spec:opacity-100 transition-opacity duration-1000" />
                                    
                                    <div className="relative z-10">
                                      <div className="flex items-center justify-between mb-6">
                                        <div className="p-3 bg-brand-gold/10 rounded-2xl group-hover/spec:bg-brand-gold group-hover/spec:text-slate-950 transition-all duration-500">
                                          <spec.icon size={20} className="text-brand-gold group-hover/spec:text-inherit transition-transform duration-500 group-hover/spec:scale-110" />
                                        </div>
                                        <div className="text-[7px] font-black text-brand-gold/40 uppercase tracking-[0.4em] transform rotate-90 origin-right">MODULE_{idx+1}</div>
                                      </div>
                                      
                                      <div className="space-y-1">
                                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest transition-colors group-hover/spec:text-brand-gold/80">
                                          {spec.label}
                                        </div>
                                        <div className="text-2xl md:text-3xl font-black text-white tracking-tighter group-hover/spec:translate-x-1 transition-transform duration-500">
                                          {spec.value}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="relative z-10 mt-6 pt-4 border-t border-white/5 opacity-0 group-hover/spec:opacity-100 transition-all duration-700 translate-y-2 group-hover/spec:translate-y-0">
                                      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">{spec.detail}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-8 shrink-0">
                              <div className="text-center lg:text-right">
                                 <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Service Fee</div>
                                 <div className="text-5xl font-bold text-white tracking-tight leading-none">
                                   ₹{p.price}
                                   <span className="text-xs font-semibold text-slate-500 tracking-widest ml-2">/ month</span>
                                 </div>
                              </div>
                              
                              <button 
                                onClick={() => { playClick(); navigate(`/billing/${p.id}`); }}
                                className={`w-full lg:w-64 h-20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 group/btn shadow-glow-gold hover:translate-y-[-4px] active:translate-y-[2px] ${p.highlight ? 'bg-brand-gold text-slate-950 px-8' : 'bg-slate-900 border border-white/10 text-slate-100 hover:bg-slate-800 px-8'}`}
                              >
                                {p.isTrial ? 'Claim Sandbox' : 'Provision Node'}
                                <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.5em]">No Game Clusters Available</p>
                    </div>
                  )
                ) : (
                  vpsPlans.length > 0 ? (
                    vpsPlans.map((p, i) => (
                      <motion.div
                        key={`vps-${p.id}-${i}`}
                        whileHover={{ y: -12, rotateX: -2, rotateY: 2, z: 20 }}
                        className={`group relative platinum-glass border border-white/10 ${p.highlight ? 'shadow-[0_0_50px_rgba(212,175,55,0.1)]' : ''} rounded-[3rem] p-1.5 flex flex-col md:flex-row items-stretch gap-0 transition-all duration-700 overflow-hidden backdrop-blur-3xl preserve-3d`}
                      >
                         {/* Visual Side */}
                         <div className="relative w-full md:w-[320px] h-64 md:h-auto overflow-hidden shrink-0 border-r border-white/5">
                           <motion.img 
                             src="https://cdn.discordapp.com/attachments/1414251304741638191/1497103165689167923/qHFzGKFBz7kvxiVyjoe6JJ-1024-80.jpg.webp?ex=69fd70f9&is=69fc1f79&hm=e4e7fae7a3bc571675731dcf155f8334df1ecae822df8aec30f940b976e0b46e&" 
                             alt="" 
                             className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-all duration-1000" 
                             referrerPolicy="no-referrer"
                           />
                           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-dark z-10" />
                           
                           <div className="absolute inset-0 flex flex-col justify-center items-center p-8 z-20" style={{ transform: 'translateZ(30px)' }}>
                              <div className="flex flex-col items-center">
                                <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.4em] mb-3">Enterprise Cloud</span>
                                <h4 className="text-4xl font-bold text-white uppercase tracking-tight leading-none font-display text-center drop-shadow-2xl">{p.name}</h4>
                              </div>
                           </div>
                         </div>

                         {/* Content Side */}
                         <div className="flex-1 p-10 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 bg-white/[0.01] relative z-10" style={{ transform: 'translateZ(40px)' }}>
                           <div className="flex-1 w-full space-y-10">
                             <div className="hidden lg:block">
                               <div className="flex items-center gap-4 mb-3">
                                  <h4 className="text-4xl font-bold text-slate-100 uppercase tracking-tight group-hover:text-brand-gold transition-colors duration-500 font-display">{p.name}</h4>
                                  {p.highlight && (
                                    <motion.span 
                                      animate={{ opacity: [0.6, 1, 0.6] }}
                                      transition={{ duration: 3, repeat: Infinity }}
                                      className="bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-2"
                                    >
                                      <Star size={10} fill="currentColor" /> Premium
                                    </motion.span>
                                  )}
                               </div>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                                 <Zap size={14} className="text-brand-gold/60" />
                                 Quantum Series • Cloud Architecture
                               </p>
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                               {[
                                 { icon: MemoryStick, label: "ECC Memory", value: p.ram, detail: "DDR4 Stable" },
                                 { icon: Cpu, label: "vCore Compute", value: p.cpu, detail: "Isolated Treads" },
                                 { icon: HardDrive, label: "Storage Node", value: p.storage, detail: "NVMe Gen4" },
                                 { icon: Network, label: "Bandwidth", value: "2 Gbps", detail: "Global Mesh" },
                               ].map((spec, idx) => (
                                 <div key={idx} className="relative p-6 md:p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 transition-all duration-500 hover:border-brand-gold/40 hover:bg-white/[0.05] group/spec shadow-3d overflow-hidden flex flex-col justify-between">
                                   <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-transparent opacity-0 group-hover/spec:opacity-100 transition-opacity duration-1000" />
                                   
                                   <div className="relative z-10">
                                     <div className="flex items-center justify-between mb-5">
                                       <div className="p-2.5 bg-brand-gold/10 rounded-xl group-hover/spec:bg-brand-gold group-hover/spec:text-slate-950 transition-all duration-500">
                                         <spec.icon size={16} className="text-brand-gold group-hover/spec:text-inherit transition-transform duration-500" />
                                       </div>
                                       <div className="text-[6px] font-black text-brand-gold/30 uppercase tracking-[0.4em]">NODE_{idx+1}</div>
                                     </div>

                                     <div className="space-y-1">
                                       <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest transition-colors group-hover/spec:text-brand-gold/80">
                                         {spec.label}
                                       </div>
                                       <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
                                         {spec.value}
                                       </div>
                                     </div>
                                   </div>

                                   <div className="relative z-10 mt-5 pt-3 border-t border-white/5 opacity-0 group-hover/spec:opacity-100 transition-all duration-500 translate-y-1 group-hover/spec:translate-y-0">
                                     <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">{spec.detail}</span>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>

                           <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-8 shrink-0">
                             <div className="text-center lg:text-right">
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Service Rate</div>
                                <div className="text-5xl font-bold text-white tracking-tight leading-none">
                                  ₹{p.price}
                                  <span className="text-xs font-semibold text-slate-500 tracking-widest ml-2">/ month</span>
                                </div>
                             </div>
                             
                             <button 
                               onClick={() => { playClick(); navigate(`/billing/${p.id}`); }}
                               className={`w-full lg:w-64 h-20 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 group/btn shadow-glow-gold hover:translate-y-[-4px] active:translate-y-[2px] ${p.highlight ? 'bg-brand-gold text-slate-950 px-8' : 'bg-slate-900 border border-white/10 text-slate-100 hover:bg-slate-800 px-8'}`}
                             >
                               Deploy Cloud
                               <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                             </button>
                           </div>
                         </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.5em]">No VPS Clusters Available</p>
                    </div>
                  )
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Removed old billing modal */}
    </section>
  );
}

function PlanSkeleton({ highlight }: { highlight: boolean }) {
  return (
    <div className={`relative bg-white/[0.02] border ${highlight ? 'border-brand-gold/20 shadow-glow-gold' : 'border-white/5'} rounded-[2.5rem] p-8 md:p-12 mb-8 animate-skeleton min-h-[280px] flex flex-col md:flex-row gap-8 justify-between items-center overflow-hidden`}>
      <div className="flex-1 w-full space-y-10">
         <div className="flex gap-4 items-center">
            <div className="w-48 h-10 rounded-xl bg-white/5" />
            <div className="w-24 h-5 rounded-full bg-white/5" />
         </div>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="space-y-3">
                <div className="w-12 h-2 bg-white/5 rounded-full" />
                <div className="h-6 bg-white/10 rounded-lg w-full" />
              </div>
            ))}
         </div>
         <div className="flex gap-6">
            {[1,2,3].map(i => <div key={i} className="w-24 h-2 rounded-full bg-white/3" />)}
         </div>
      </div>
      <div className="w-full md:w-52 h-16 rounded-2xl bg-white/5 border border-white/5" />
    </div>
  );
}
