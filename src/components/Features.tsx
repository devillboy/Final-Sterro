import React from 'react';
import { motion } from 'motion/react';

export default function Features() {
  const feats = [
    { title: "Epic Hardware", desc: "Pick your power: AMD EPYC 9654 for budget-friendly might or Ryzen 7950X3D for top-tier single-core performance. Let's play!" },
    { title: "DDoS Protection", desc: "Our network protects your servers with up to 7 Tbps DDoS mitigation at no extra cost." },
    { title: "Always Online", desc: "Your server, your schedule. We're always online, so you decide when to log off. 24/7 gaming, no questions asked." },
    { title: "User-Friendly Panel", desc: "Control your server like a boss with our user-friendly panel. No tech wizardry required just pure gaming management." },
    { title: "Instant Play", desc: "Ready, set, game! Most servers are up in minutes. Skip the wait and dive straight into the action." },
    { title: "Fast & Friendly Support", desc: "Stuck? Our gamer support squad's got your back. Fast, friendly help from fellow players, no extra coin needed." },
    { title: "Superb Documentation", desc: "Setup's a breeze with our easy guides and videos. We've got the essentials covered, so you can focus on gaming." },
    { title: "Mods & Plugin Manager", desc: "Unleash your creativity! Easily upload and manage your custom mods or plugins to make your server truly unique." },
  ];

  return (
    <section className="py-24 px-6 bg-[var(--color-bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-white">
            Everything <span className="text-[#00F0FF]">your server needs</span>
          </h2>
          <p className="text-[var(--color-text-dim)] font-medium text-lg">Features, tools, settings, and support bundled in one place.</p>
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
              <div className="w-full h-40 mb-8 rounded-xl bg-[var(--color-bg-main)] border border-[var(--color-border)] flex flex-col items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-[#0a1021] to-[#050814] relative overflow-hidden">
                 {/* Abstract visual representation */}
                 <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)]" style={{backgroundSize: '20px 20px'}}></div>
                 <div className="w-16 h-16 bg-[#00F0FF]/10 rounded-lg border border-[#00F0FF]/30 flex items-center justify-center">
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
