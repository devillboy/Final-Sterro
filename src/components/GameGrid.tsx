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
    <section id="games" className="py-32 px-6 bg-bg-dark relative overflow-hidden">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent top-0" />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter text-white uppercase italic font-display text-glow-cyan">
          Elite <span className="text-brand-cyan not-italic antialiased">Deployment</span> Fleet
        </h2>
        <p className="text-zinc-500 mb-16 max-w-2xl mx-auto text-sm font-bold uppercase tracking-[0.4em]">
          Automated orchestration for next-gen workloads.
        </p>

        <motion.div 
          className="flex flex-wrap justify-center gap-10 perspective-2000"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {games.map((game, i) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 60 } }
                }}
                whileHover={{ 
                  y: -10,
                  rotateX: 2,
                  rotateY: -2,
                  translateZ: 20
                }}
                className="relative platinum-glass platinum-glass-hover rounded-[3rem] overflow-hidden group cursor-pointer w-full md:w-[calc(45%-1rem)] h-[400px] border border-white/5 transition-all duration-700 preserve-3d"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent z-10" />
                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-1000 ease-out group-hover:scale-110">
                  <img src={game.imgUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt={game.name} referrerPolicy="no-referrer" />
                </div>
                
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-center pt-24">
                  <div className="w-20 h-20 mb-8 bg-white/[0.03] backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/10 group-hover:-translate-y-4 group-hover:bg-brand-cyan/10 group-hover:border-brand-cyan/30 transition-all duration-700 shadow-3d">
                    <Icon className="text-white group-hover:text-brand-cyan transition-colors w-10 h-10" />
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-brand-cyan uppercase tracking-[0.6em] block opacity-0 group-hover:opacity-100 transition-opacity duration-700">Cluster Alpha</span>
                    <h3 className="font-black text-4xl text-white tracking-tighter uppercase font-display italic text-glow-cyan">{game.name}</h3>
                    <div className="w-12 h-px bg-white/20 mx-auto group-hover:w-24 transition-all duration-700" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
