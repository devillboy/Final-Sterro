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
      imgUrl: "https://cdn.discordapp.com/attachments/1414251304741638191/1496919234364706988/Download_Free_Minecraft_Wallpapers_and_Backgrounds.jpg?ex=69fd6e6c&is=69fc1cec&hm=d6e957a8daff31c254deb2a7212d7761be538ac58eff2819317259294e2f7d1d&",
      key: "MC_THUMB"
    },
    { 
      name: "Cloud VPS", 
      icon: Server, 
      imgUrl: "https://cdn.discordapp.com/attachments/1414251304741638191/1497103165689167923/qHFzGKFBz7kvxiVyjoe6JJ-1024-80.jpg.webp?ex=69fd70f9&is=69fc1f79&hm=e4e7fae7a3bc571675731dcf155f8334df1ecae822df8aec30f940b976e0b46e&",
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
      <div className="absolute inset-0 cinematic-vignette opacity-50 z-0" />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter text-white uppercase font-display">
          Regional <span className="text-brand-gold antialiased">Orchestration</span> Fleet
        </h2>
        <p className="text-zinc-500 mb-20 max-w-2xl mx-auto text-xs font-bold uppercase tracking-[0.6em] leading-relaxed">
          Automated provisioning for enterprise workloads.
        </p>

        <motion.div 
          className="flex flex-wrap justify-center gap-12 perspective-2000"
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
          {games.map((game, i) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 50, rotateX: 10 },
                  visible: { opacity: 1, scale: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
                }}
                whileHover={{ 
                  y: -15,
                  rotateX: 4,
                  rotateY: -4,
                  translateZ: 50
                }}
                className="relative platinum-glass rounded-[4rem] overflow-hidden group cursor-pointer w-full md:w-[calc(48%-1rem)] h-[480px] border border-white/10 transition-all duration-1000 preserve-3d group shadow-3d-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-all duration-1000 ease-out group-hover:scale-110">
                  <img src={game.imgUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 contrast-125" alt={game.name} referrerPolicy="no-referrer" />
                </div>
                
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-center pt-24" style={{ transform: 'translateZ(60px)' }}>
                  <div className="w-24 h-24 mb-10 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center border border-white/10 group-hover:-translate-y-6 group-hover:bg-brand-gold/15 group-hover:border-brand-gold/40 group-hover:shadow-glow-gold-strong transition-all duration-1000 shadow-3d-lg">
                    <Icon className="text-white group-hover:text-brand-gold transition-all duration-700 w-12 h-12" />
                  </div>
                  <div className="space-y-6">
                    <span className="text-[11px] font-black text-brand-gold uppercase tracking-[0.7em] block opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-1000">Cluster Infrastructure</span>
                    <h3 className="font-bold text-5xl text-white tracking-tighter uppercase font-display text-glow-gold group-hover:scale-110 transition-transform duration-1000">{game.name}</h3>
                    <div className="w-16 h-1 bg-brand-gold/30 mx-auto group-hover:w-32 group-hover:bg-brand-gold transition-all duration-1000 rounded-full" />
                  </div>
                </div>
                
                {/* Cinematic Highlight */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                  <div className="absolute -inset-24 bg-gradient-to-br from-brand-gold/10 to-transparent blur-3xl" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
