import React from 'react';
import { motion } from 'motion/react';
import { useSounds } from '../utils/sounds';
import { HardDrive, Zap, Shield, Headphones } from 'lucide-react';

export default function Features() {
  const { playClick } = useSounds();
  const feats = [
    { 
      title: "NVMe SSD Storage", 
      desc: "Lightning-fast storage for maximum performance with enterprise-grade reliability.", 
      icon: HardDrive,
      color: "text-brand-cyan"
    },
    { 
      title: "99% Uptime Guarantee", 
      desc: "Our cluster architecture ensures your services stay online, no matter what.", 
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
      title: "24/7 Human Support", 
      desc: "Our engineers are available around the clock to assist with your deployment.", 
      icon: Headphones,
      color: "text-blue-500"
    }
  ];

  return (
    <section id="features" className="py-32 px-6 bg-bg-dark visible-grid relative perspective-2000">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-brand-cyan/[0.01] to-bg-dark pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter text-white uppercase italic font-display">
            Engineered for <span className="text-brand-cyan not-italic">Resilience</span>
          </h2>
          <p className="text-zinc-500 font-medium text-lg leading-relaxed uppercase tracking-[0.2em] text-xs">
            Elite infrastructure architectures redefining the hosting landscape. 
          </p>
        </div>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
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
              onMouseEnter={() => playClick()}
              variants={{
                hidden: { opacity: 0, y: 30, rotateX: -10 },
                visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 50 } }
              }}
              whileHover={{ 
                y: -10, 
                rotateX: 5, 
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="platinum-glass rounded-[2.5rem] p-10 flex flex-col group hover:border-brand-cyan/40 transition-all duration-500 preserve-3d shadow-3d hover:shadow-glow-cyan"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:bg-brand-cyan/10 ${f.color} shadow-3d-sm`}>
                <f.icon size={24} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-black mb-5 tracking-tighter text-white uppercase font-display italic group-hover:text-brand-cyan transition-colors">{f.title}</h3>
              <p className="text-zinc-500 font-medium leading-relaxed text-sm group-hover:text-zinc-300 transition-colors">{f.desc}</p>
              
              <div className="mt-10 h-1 w-0 bg-brand-cyan group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
