import React from 'react';
import { motion } from 'motion/react';
import { Cpu, HardDrive, MemoryStick, Activity, Network, Archive, LayoutTemplate } from 'lucide-react';

const plans = [
  { name: "Ryzen Root CORE", vcpu: "2 vCPU", ram: "6 GB DDR5 RAM", disk: "70 GB NVMe SSD", bw: "1 TB Bandwidth", uplink: "2x 10 GBit/s Shared Uplink", price: "8,99", desc: "Perfect for small projects, personal bots, and development tests." },
  { name: "Ryzen Root EDGE", vcpu: "4 vCPU", ram: "12 GB DDR5 RAM", disk: "110 GB NVMe SSD", bw: "1 TB Bandwidth", uplink: "2x 10 GBit/s Shared Uplink", price: "16,99", desc: "Ideal for medium projects, testing, and small team apps." },
  { name: "Ryzen Root PULSE", vcpu: "6 vCPU", ram: "18 GB DDR5 RAM", disk: "160 GB NVMe SSD", bw: "1 TB Bandwidth", uplink: "2x 10 GBit/s Shared Uplink", price: "24,99", desc: "Great for growing projects, multiple bots, and moderate workloads.", highlight: true },
  { name: "Ryzen Root FORGE", vcpu: "8 vCPU", ram: "24 GB DDR5 RAM", disk: "210 GB NVMe SSD", bw: "1 TB Bandwidth", uplink: "2x 10 GBit/s Shared Uplink", price: "33,99", desc: "Perfect for demanding apps, game servers, and dev environments." },
  { name: "Ryzen Root TITAN", vcpu: "10 vCPU", ram: "32 GB DDR5 RAM", disk: "260 GB NVMe SSD", bw: "1 TB Bandwidth", uplink: "2x 10 GBit/s Shared Uplink", price: "44,99", desc: "Designed for high-performance projects and intensive workloads." }
];

export default function PricingList() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[var(--color-bg-main)] to-[var(--color-surface)]/30 border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            VPS Hosting Built for<br/>
            <span className="text-[#007BFF]">Speed & Stability</span>
          </h2>
          <p className="text-[var(--color-text-dim)] max-w-2xl mx-auto mb-20 font-medium">
            Run game panels, websites, bots, databases, or production apps on fast NVMe storage and low-latency locations. Deploy in minutes, scale anytime.
          </p>
          
          <h3 className="text-3xl font-bold mb-3 tracking-tight">Maximum Performance. <span className="text-[#007BFF]">Full Flexibility.</span></h3>
          <p className="text-[var(--color-text-dim)] font-medium">Flexible plans designed to scale with your needs. Upgrade or downgrade anytime.</p>
        </div>

        <div className="flex flex-col gap-4">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-[var(--color-surface)] border ${p.highlight ? 'border-[#007BFF] shadow-[0_0_25px_rgba(0,123,255,0.15)] relative z-10 scale-[1.01]' : 'border-[var(--color-border)]'} rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between hover:border-[#007BFF]/50 transition-all`}
            >
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-2xl font-bold tracking-tight">{p.name}</h4>
                  <span className="bg-[#1A233A] text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">{p.vcpu}</span>
                </div>
                <p className="text-[var(--color-text-dim)] text-sm mb-6 font-medium">{p.desc}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 text-[13px] font-semibold">
                  <div className="flex items-center gap-2"><Cpu size={14} className="text-[#007BFF]"/> <span className="text-white">{p.vcpu} Cores</span></div>
                  <div className="flex items-center gap-2"><HardDrive size={14} className="text-[#007BFF]"/> <span className="text-white">{p.disk}</span></div>
                  <div className="flex items-center gap-2"><MemoryStick size={14} className="text-[#007BFF]"/> <span className="text-white">{p.ram}</span></div>
                  <div className="flex items-center gap-2"><Activity size={14} className="text-[#007BFF]"/> <span className="text-white">{p.bw}</span></div>
                  <div className="flex items-center gap-2"><Network size={14} className="text-[#007BFF]"/> <span className="text-white">{p.uplink}</span></div>
                  <div className="flex items-center gap-2"><Archive size={14} className="text-[#007BFF]"/> <span className="text-white">3 Backups</span></div>
                  <div className="flex items-center gap-2"><LayoutTemplate size={14} className="text-[#007BFF]"/> <span className="text-white">Linux & Windows</span></div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-5 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-[var(--color-border)] shrink-0 pl-0 md:pl-8">
                <div className="hidden md:flex flex-col items-end opacity-[0.15]">
                  <span className="font-black text-xl tracking-[0.2em] leading-none mb-1">AMD</span>
                  <span className="font-black text-4xl tracking-tighter leading-none text-white whitespace-nowrap">RYZEN</span>
                </div>
                <button className={`w-full md:w-auto px-8 py-3.5 rounded-lg font-bold text-white transition-colors text-sm shadow-lg ${p.highlight ? 'bg-[#ff6b00] hover:bg-[#e66000] shadow-[#ff6b00]/20' : 'bg-[#152e6e] hover:bg-[#1a3a8a] border border-[#2345a3] shadow-blue-900/20'} `}>
                  Buy Now for €{p.price}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
