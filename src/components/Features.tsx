import React from 'react';
import { motion } from 'motion/react';
import { useSounds } from '../utils/sounds';
import { HardDrive, Zap, Shield, Headphones } from 'lucide-react';

export default function Features() {
  const { playClick } = useSounds();
  const feats = [
    { 
      title: "Enterprise NVMe", 
      desc: "Tier-1 storage matrices engineered for ultra-high throughput and consistent performance.", 
      icon: HardDrive,
      color: "text-brand-gold"
    },
    { 
      title: "Uptime SLA 99.99%", 
      desc: "Redundant cluster architecture ensuring critical services maintain maximum availability.", 
      icon: Zap,
      color: "text-brand-gold"
    },
    { 
      title: "DDoS Mitigation", 
      desc: "Advanced multi-layered traffic scrubbing protecting against large-scale edge attacks.", 
      icon: Shield,
      color: "text-brand-gold"
    },
    { 
      title: "Concierge Support", 
      desc: "Direct access to our senior engineering team for tailored infrastructure consulting.", 
      icon: Headphones,
      color: "text-brand-gold"
    }
  ];

  return (
    <section id="features" className="py-32 px-6 bg-bg-dark visible-grid relative perspective-2000">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-brand-gold/[0.01] to-bg-dark pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter text-white uppercase font-display text-glow-gold">
            Built for <span className="text-brand-gold antialiased">Reliability</span>
          </h2>
          <p className="text-slate-500 font-bold text-[10px] leading-relaxed uppercase tracking-[0.5em] mb-12">
            Advanced infrastructure matrices redefining professional hosting. 
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
              className="platinum-glass rounded-[2.5rem] p-10 flex flex-col group hover:border-brand-gold/40 transition-all duration-500 preserve-3d shadow-3d hover:shadow-glow-gold"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:bg-brand-gold/10 ${f.color} shadow-3d-sm`}>
                <f.icon size={24} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold mb-5 tracking-tighter text-white uppercase font-display group-hover:text-brand-gold transition-colors">{f.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm group-hover:text-slate-300 transition-colors">{f.desc}</p>
              
              <div className="mt-10 h-1 w-0 bg-brand-gold group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
