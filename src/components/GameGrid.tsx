import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Server } from 'lucide-react';

const games = [
  { 
    name: "Minecraft Java", 
    icon: Gamepad2, 
    imgUrl: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=600&q=80" 
  },
  { 
    name: "VPS Hosting", 
    icon: Server, 
    imgUrl: "https://images.unsplash.com/photo-1558494949253-e5223abfb21a?auto=format&fit=crop&w=600&q=80" 
  },
];

export default function GameGrid() {
  return (
    <section className="py-24 px-6 bg-[var(--color-bg-main)]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Your favorite games &amp; services<br/>
          <span className="text-[#007BFF]">Ready to deploy instantly.</span>
        </h2>
        <p className="text-[var(--color-text-dim)] mb-16 max-w-2xl mx-auto text-lg font-medium">
          Choose your service and get started instantly. We take care of setup, performance, and stability.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {games.map((game, i) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden group cursor-pointer w-full md:w-[calc(50%-1rem)] h-80 hover:border-[#007BFF]/50 transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-main)] via-[var(--color-bg-main)]/60 to-transparent z-10" />
                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500 group-hover:scale-105">
                  <img src={game.imgUrl} className="w-full h-full object-cover" alt={game.name} />
                </div>
                
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center pt-24">
                  <div className="w-16 h-16 mb-4 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 group-hover:-translate-y-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300">
                    <Icon className="text-white w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-xl text-white tracking-wide">{game.name}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
