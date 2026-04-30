import React from 'react';
import { motion } from 'motion/react';

export default function Features() {
  const feats = [
    { title: "Ryzen™ Bare-Metal", desc: "Native performance on 5.7GHz frequency nodes. Each core is dedicated to your runtime, ensuring zero steal and peak tick rates for demanding workloads." },
    { title: "EdgeGuard L3/L4 Mitigation", desc: "Proprietary network stack capable of 10Tbps+ volumetric scrubbing. Real-time packet inspection ensures zero downtime during targeted saturation events." },
    { title: "Uptime SLA Guarantee", desc: "Enterprise-grade reliability with 99.9% network availability. Our redundancy protocols ensure your mission-critical infrastructure remains accessible 24/7." },
    { title: "Advanced Control Interface", desc: "Granular administrative control via a customized Pterodactyl-based terminal. Manage file systems, databases, and cron tasks with zero friction." },
    { title: "Sub-Second Deployment", desc: "Automated provisioning pipeline that initializes your environment within 12 seconds. Rapid iteration cycles from purchase to production." },
    { title: "Technical Support Liaison", desc: "Direct access to our Level 3 engineering team. We speak your language and troubleshoot your specific implementation challenges." },
    { title: "Global CDN Edge", desc: "Strategically located clusters in Mumbai, Frankfurt, Singapore, and New York for sub-30ms latency benchmarks worldwide." },
    { title: "Scale-Out Ready", desc: "Dynamic resource allocation. Upgrade your compute pool or storage volume horizontally without requiring a system-wide reboot." },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-[var(--color-bg-main)] visible-grid">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white uppercase italic">
            Engineered for <span className="text-[#00F0FF] italic">Resilience</span>
          </h2>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Advanced Infrastructure Architecture & Protocols</p>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {feats.map((f, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
              }}
              whileHover={{ scale: 1.02 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-10 flex flex-col group hover:border-[#00F0FF]/40 transition-colors cursor-default"
            >
              <div className="w-full h-48 mb-8 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border)] flex flex-col items-center justify-center group-hover:opacity-100 transition-opacity bg-gradient-to-b from-[#0a1021] to-[#050814] relative overflow-hidden shrink-0">
                 <img 
                   src={i === 0 ? "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800" : (i === 1 ? "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800" : (i === 2 ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800" : "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800"))} 
                   alt="" 
                   className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent" />
                 <div className="relative z-10 w-16 h-16 bg-[#00F0FF]/10 rounded-lg border border-[#00F0FF]/30 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-8 h-8 rounded bg-[#00F0FF]/40 animate-pulse" />
                 </div>
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight text-white">{f.title}</h3>
              <p className="text-[var(--color-text-dim)] font-medium leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
