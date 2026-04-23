import React from "react";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-32 px-6 overflow-hidden flex items-center border-b border-[var(--color-border)] min-h-[85vh]">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-main)]/80 via-[var(--color-bg-main)]/60 to-[var(--color-bg-main)] z-10" />
        <img 
          src="https://i.pinimg.com/originals/d3/8f/4d/d38f4da29234e9188ed3098a83d940aa.jpg" 
          alt="Pinterest gaming background" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-col items-center text-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs font-semibold text-[var(--color-text-dim)] mb-8 shadow-xl">
            Minecraft Server Hosting
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            More Blocks. More<br />
            Performance. More Minecraft.
          </h1>
          
          <p className="text-lg text-[var(--color-text-dim)] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Lag-free gameplay at maximum performance. Play with friends on ultra-stable, high-performance Minecraft servers for a seamless experience.
          </p>

          <button className="bg-[#007BFF] hover:bg-[#0056b3] text-white font-bold px-10 py-4 rounded-md transition-colors text-lg shadow-[0_0_20px_rgba(0,123,255,0.3)]">
            Order now
          </button>
        </motion.div>

        {/* Thumbnail slider mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center flex-wrap gap-4 mt-28 overflow-hidden w-full max-w-5xl px-4 pb-4"
        >
          {/* Active thumb */}
          <div className="h-24 w-36 border-2 border-[#007BFF] rounded-lg overflow-hidden shrink-0 cursor-pointer shadow-[0_0_15px_rgba(0,123,255,0.4)] transition-transform hover:scale-105">
            <img src="https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" alt="Minecraft Sword" />
          </div>
          
          {/* Other thumbs: Minecraft & VPS Alternating */}
          {[
            "https://images.unsplash.com/photo-1558494949253-e5223abfb21a?auto=format&fit=crop&w=300&q=80", // VPS Server Room
            "https://images.unsplash.com/photo-1627856013091-fed6e4e048eb?auto=format&fit=crop&w=300&q=80", // Minecraft Landscape
            "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80", // VPS Network Rack
            "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=300&q=80", // Minecraft Grass Block
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=300&q=80", // VPS Data Center
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=300&q=80", // RGB/Gaming PC
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80", // VPS Blue Rack Close Up
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80"  // Gameplay Setup
          ].map((url, i) => (
            <div key={i} className="h-24 w-36 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden shrink-0 opacity-60 hover:opacity-100 transition-all cursor-pointer hover:scale-105">
              <img src={url} className="w-full h-full object-cover" alt="VPS and Games thumb" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
