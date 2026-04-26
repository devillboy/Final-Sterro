import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Server } from 'lucide-react';
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function GameGrid() {
  const [games, setGames] = useState([
    { 
      name: "Minecraft Java", 
      icon: Gamepad2, 
      imgUrl: "https://images.unsplash.com/photo-1628100129202-0ee2169eb786?q=80&w=1000&auto=format&fit=crop&q=80",
      key: "MC_THUMB"
    },
    { 
      name: "VPS Hosting", 
      icon: Server, 
      imgUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop&q=80",
      key: "VPS_THUMB"
    },
  ]);

  useEffect(() => {
    async function syncAssets() {
      try {
        const snap = await getDocs(collection(db, "assets"));
        const assetMap = new Map();
        snap.forEach(doc => assetMap.set(doc.data().key, doc.data().url));
        
        setGames(prev => prev.map(game => ({
          ...game,
          imgUrl: assetMap.get(game.key) || game.imgUrl
        })));
      } catch (e) {
        console.warn("Games custom assets load failed.");
      }
    }
    syncAssets();
  }, []);
  return (
    <section className="py-24 px-6 bg-[var(--color-bg-main)]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">
          Your favorite games &amp; services<br/>
          <span className="text-[#00F0FF]">Ready to deploy instantly.</span>
        </h2>
        <p className="text-[var(--color-text-dim)] mb-16 max-w-2xl mx-auto text-lg font-medium">
          Choose your service and get started instantly. We take care of setup, performance, and stability.
        </p>

        <div className="flex flex-wrap justify-center gap-6 perspective-2000">
          {games.map((game, i) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 40px -12px rgba(0, 240, 255, 0.15)"
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="relative bg-[#050914] border border-[#121b2b] rounded-3xl overflow-hidden group cursor-pointer w-full md:w-[calc(50%-1rem)] h-80 hover:border-[#00F0FF]/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-black/60 to-transparent z-10" />
                <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-all duration-700 ease-out group-hover:scale-105">
                  <img src={game.imgUrl} className="w-full h-full object-cover" alt={game.name} onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
                
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center pt-24">
                  <div className="w-16 h-16 mb-4 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:-translate-y-2 group-hover:bg-white/10 transition-all duration-300">
                    <Icon className="text-white w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-2xl text-white tracking-tight">{game.name}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
