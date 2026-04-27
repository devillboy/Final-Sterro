import React from "react";
import { motion } from "motion/react";
import { Gamepad2, Cloud, Server } from "lucide-react";

export default function Services() {
  const servicesList = [
    {
      icon: <Gamepad2 size={40} className="text-[#00F0FF]" strokeWidth={1.5} />,
      title: "Game Servers",
      desc: "Hosting your own game server shouldn't be hard. Choose from a variety of supported games and we'll get you up and running within minutes."
    },
    {
      icon: <Cloud size={40} className="text-[#00F0FF]" strokeWidth={1.5} />,
      title: "Root Servers",
      desc: "Built on Ryzen processors and NVMe SSDs, our unique VPS platform is built for those needing serious processing power from their instances."
    },
    {
      icon: <Server size={40} className="text-[#00F0FF]" strokeWidth={1.5} />,
      title: "Dedicated Servers",
      desc: "Need dedicated, raw performance? Unmanaged or managed hosting for your most demanding workloads.",
      tag: "Coming Soon"
    }
  ];

  return (
    <section className="py-24 px-6 bg-[var(--color-bg-main)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Our <span className="text-[#00F0FF]">Services</span>
          </h2>
          <p className="text-[var(--color-text-dim)] font-medium max-w-2xl mx-auto">
            High-performance hosting solutions for game servers, root servers, and dedicated servers - optimized for maximum performance.
          </p>
        </div>

        <motion.div 
          className="flex flex-col gap-6 perspective-2000"
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
          {servicesList.map((s, i) => (
            <motion.div 
              key={i}
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 60 } }
              }}
              whileHover={{ 
                scale: 1.01, 
                rotateX: -0.5, 
                rotateY: 0.5, 
                z: 10,
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.4)"
              }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start relative hover:border-[#00F0FF]/30 transition-colors group cursor-pointer preserve-3d shadow-3d"
            >
              <div className="shrink-0 group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </div>
              <div className="flex-1 mt-1">
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                  {s.title}
                  {s.tag && <span className="text-[10px] uppercase font-bold tracking-widest bg-[var(--color-border)] px-2 py-1 rounded text-[var(--color-text-dim)]">{s.tag}</span>}
                </h3>
                <p className="text-[var(--color-text-dim)] leading-relaxed font-medium">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
