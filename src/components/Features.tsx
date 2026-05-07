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
    <section id="features" className="py-40 px-6 bg-bg-dark relative overflow-hidden perspective-2000">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent top-0 shadow-glow-gold" />
      <div className="absolute inset-0 cinematic-vignette opacity-60 z-0" />
      <div className="absolute inset-0 visible-grid-gold opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-32 max-w-3xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white uppercase font-display text-glow-gold drop-shadow-2xl">
            Built for <span className="text-brand-gold tracking-tight antialiased">Reliability</span>
          </h2>
          <p className="text-zinc-500 font-black text-xs leading-relaxed uppercase tracking-[0.6em] mb-12">
            Advanced infrastructure matrices redefining professional cloud hosting. 
          </p>
        </div>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          {feats.map((f, i) => (
            <motion.div
              key={i}
              onMouseEnter={() => playClick()}
              variants={{
                hidden: { opacity: 0, y: 50, rotateX: 15 },
                visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 40, damping: 20 } }
              }}
              whileHover={{ 
                y: -15, 
                rotateX: 5, 
                rotateY: -5,
                translateZ: 40,
                transition: { duration: 0.5 }
              }}
              className="platinum-glass rounded-[3.5rem] p-12 flex flex-col group border border-white/10 transition-all duration-1000 preserve-3d shadow-3d-lg hover:shadow-glow-gold-strong"
            >
              <div className={`w-20 h-20 rounded-[1.75rem] bg-white/[0.03] border border-white/10 flex items-center justify-center mb-12 transition-all duration-700 group-hover:scale-110 group-hover:bg-brand-gold/15 group-hover:border-brand-gold/40 ${f.color} shadow-3d-lg group-hover:shadow-glow-gold`} style={{ transform: 'translateZ(30px)' }}>
                <f.icon size={36} strokeWidth={2} className="group-hover:rotate-12 transition-transform duration-700" />
              </div>
              <div style={{ transform: 'translateZ(40px)' }}>
                <h3 className="text-3xl font-black mb-6 tracking-tighter text-white uppercase font-display group-hover:text-brand-gold transition-colors duration-700">{f.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed text-[15px] group-hover:text-zinc-300 transition-colors duration-700">{f.desc}</p>
              </div>
              
              <div className="mt-auto pt-10">
                <div className="h-1.5 w-12 bg-white/10 rounded-full overflow-hidden group-hover:w-full transition-all duration-1000">
                  <div className="h-full bg-brand-gold w-0 group-hover:w-full transition-all duration-1000 shadow-glow-gold" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
