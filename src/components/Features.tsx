import React from 'react';
import { motion } from 'motion/react';
import { HardDrive, Zap, Shield, Headphones } from 'lucide-react';

export default function Features() {
  const feats = [
    { 
      title: "NVMe SSD Storage", 
      desc: "Lightning-fast storage for maximum performance with enterprise-grade reliability.", 
      icon: HardDrive,
      color: "text-brand-cyan"
    },
    { 
      title: "99% Uptime Guarantee", 
      desc: "We just cannot be taken down by anyone.", 
      icon: Zap,
      color: "text-amber-500"
    },
    { 
      title: "DDoS Protection", 
      desc: "Advanced multi-layered security protecting against sophisticated attacks.", 
      icon: Shield,
      color: "text-emerald-500"
    },
    { 
      title: "24/7 Customer Support", 
      desc: "We are available 100% of the time. At least AI Agents are.", 
      icon: Headphones,
      color: "text-blue-500"
    }
  ];

  return (
    <section id="features" className="py-32 px-6 bg-bg-dark visible-grid relative">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-brand-cyan/[0.01] to-bg-dark pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter text-white uppercase italic">
            Engineered for <span className="text-brand-cyan">Resilience</span>
          </h2>
          <p className="text-zinc-500 font-medium text-lg leading-relaxed">
            We offer elite infrastructure architectures that redefine the hosting landscape. 
            Maximum performance, Zero compromises.
          </p>
        </div>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
              className="bg-[#050812] border border-white/5 rounded-[2rem] p-8 flex flex-col group hover:border-[#00F0FF]/20 transition-all duration-300"
            >
              <div className={`w-12 h-6 rounded-full bg-white/5 flex items-center justify-center mb-8 ${f.color}`}>
                <f.icon size={16} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold mb-4 tracking-tight text-brand-cyan leading-tight">{f.title}</h3>
              <p className="text-zinc-400 font-medium leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
