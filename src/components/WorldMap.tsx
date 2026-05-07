import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  x: number; // percentage from left
  y: number; // percentage from top
  flag: string;
}

const locations: Location[] = [
  { id: "1", name: "India (Mumbai)", x: 72, y: 55, flag: "🇮🇳" },
  { id: "2", name: "Singapore", x: 80, y: 68, flag: "🇸🇬" },
  { id: "3", name: "Germany (Frankfurt)", x: 50, y: 32, flag: "🇩🇪" },
  { id: "4", name: "USA (New York)", x: 25, y: 35, flag: "🇺🇸" },
];

interface WorldMapProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function WorldMap({ selectedId, onSelect }: WorldMapProps) {
  return (
    <div className="relative w-full aspect-[2/1] bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-3d-lg group perspective-2000 preserve-3d">
      {/* Abstract Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--color-brand-gold)_1px,transparent_1px)] [background-size:20px_20px]" />
      
      {/* Simple World SVG Path (Approximate) */}
      <svg 
        viewBox="0 0 1000 500" 
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1"
      >
        <path 
          className="text-slate-600"
          d="M150,150 Q200,100 300,120 T450,100 T600,150 T750,120 T900,180 T850,350 T700,400 T550,380 T400,420 T250,380 T100,300 Z" 
          opacity="0.2"
        />
        {/* Actual world shapes are too complex for raw string d, using a simplified mesh or dots is better for "tech" feel */}
        {Array.from({ length: 40 }).map((_, i) => (
           Array.from({ length: 20 }).map((_, j) => (
             <circle 
                key={`${i}-${j}`} 
                cx={i * 25 + 10} 
                cy={j * 25 + 10} 
                r="1" 
                fill="currentColor" 
                className="text-slate-700 opacity-[0.05]" 
             />
           ))
        ))}
      </svg>

      {/* Locations */}
      {locations.map((loc) => {
        const isSelected = selectedId === loc.id;
        return (
          <motion.button
            key={loc.id}
            type="button"
            onClick={() => onSelect(loc.id)}
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group/pin z-30`}
            whileHover={{ scale: 1.2, z: 50 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {/* Pinging connection radius */}
            <div className={`absolute -inset-4 rounded-full border-2 transition-all duration-500 scale-0 group-hover/pin:scale-100 ${isSelected ? 'border-brand-gold/40 animate-pulse scale-100' : 'border-white/10'}`} />
            
            <div className="relative flex flex-col items-center">
              {/* Tooltip */}
              <motion.div 
                initial={false}
                animate={{ 
                  opacity: isSelected ? 1 : 0.8, 
                  y: isSelected ? -38 : -28,
                  scale: isSelected ? 1 : 0.8,
                  backgroundColor: isSelected ? "var(--color-brand-gold)" : "rgba(10, 16, 33, 0.9)",
                  color: isSelected ? "#000" : "#fff"
                }}
                className={`absolute pointer-events-none whitespace-nowrap px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-3d-lg border ${isSelected ? 'border-brand-gold/50' : 'border-white/10'} backdrop-blur-md`}
              >
                <div className="flex items-center gap-2">
                  <span>{loc.flag} {loc.name}</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-black' : 'bg-green-500'} animate-pulse`} />
                    <span className="text-[8px] opacity-70">ONLINE</span>
                  </div>
                </div>
              </motion.div>

              {/* Holographic Base */}
              {isSelected && (
                <div className="absolute top-1/2 -translate-y-1/2 w-8 h-4 bg-brand-gold/20 blur-md rounded-[100%] scale-150 -z-10" />
              )}

              {/* Dot */}
              <div className={`w-3 h-3 rounded-full border-2 border-black shadow-lg transition-all duration-300 ${isSelected ? 'bg-brand-gold scale-125' : 'bg-white/40 group-hover/pin:bg-white'}`} />
              
              {/* Pulse */}
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-brand-gold rounded-full -z-10"
                />
              )}
            </div>
          </motion.button>
        );
      })}

      {/* Grid Overlay for 3D depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      
      {/* Bottom Selection Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
        {locations.map((loc) => (
          <button
            key={loc.id}
            type="button"
            onClick={() => onSelect(loc.id)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedId === loc.id ? 'bg-brand-gold border-brand-gold text-bg-dark shadow-glow-gold' : 'bg-black/60 border-white/10 text-slate-500 hover:text-white hover:border-brand-gold/40'}`}
          >
            {loc.id === "1" ? "IND" : loc.id === "2" ? "SGP" : loc.id === "3" ? "DEU" : "USA"}
          </button>
        ))}
      </div>
    </div>
  );
}
