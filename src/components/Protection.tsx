import React from 'react';
import { motion } from 'motion/react';

export default function Protection() {
  return (
    <section className="py-24 px-6 bg-[#03060d]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
            Always <span className="text-[#007BFF]">Protected.</span><br/>
            Always <span className="text-[#007BFF]">Recoverable.</span>
          </h2>
          <p className="text-[var(--color-text-dim)] max-w-2xl mx-auto font-medium text-lg">
            Network-level security and instant snapshots work together to keep your VPS safe and quickly restorable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0a1024] border border-[var(--color-border)] rounded-2xl p-8 flex flex-col"
          >
            <div className="h-48 bg-[#050814] rounded-xl border border-[var(--color-border)] mb-8 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#007BFF]/5 to-transparent" />
               <button className="w-56 h-12 bg-[#2a4394] border border-[#3b5ab4] text-white/90 rounded font-bold transition-all shadow-[0_0_20px_rgba(42,67,148,0.4)] group-hover:bg-[#3454b8] group-hover:scale-105 z-10 flex items-center justify-center">
                  Restore My Server
               </button>
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Snapshots & Backups</h3>
            <p className="text-[var(--color-text-dim)] font-medium text-sm leading-relaxed">
              Create snapshots before updates or major changes. Restore your VPS anytime with just one click.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0a1024] border border-[var(--color-border)] rounded-2xl p-8 flex flex-col"
          >
            <div className="h-48 bg-[#050814] rounded-xl border border-[var(--color-border)] mb-8 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ff004c]/10 via-[#050814] to-[#050814]" />
              
              <div className="w-24 h-24 rounded-full border-4 border-[#007BFF]/20 flex flex-col gap-2 items-center justify-center z-10 bg-[#0a1024]/50 backdrop-blur">
                <div className="w-8 h-3 bg-[#007BFF] rounded-sm shadow-[0_0_10px_rgba(0,123,255,0.8)]" />
                <div className="w-8 h-3 bg-[#007BFF] rounded-sm shadow-[0_0_10px_rgba(0,123,255,0.8)]" />
              </div>
              
              {/* Little red triangles around */}
              <div className="absolute right-12 top-10 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-[#ff4d4d] rotate-45 opacity-50 blur-[1px]" />
              <div className="absolute left-10 bottom-12 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-[#ff4d4d] -rotate-45 opacity-50 blur-[1px]" />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Network Protection</h3>
            <p className="text-[var(--color-text-dim)] font-medium text-sm leading-relaxed">
              All VPS instances are protected by default against common network attacks, ensuring consistent uptime and reliability.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
