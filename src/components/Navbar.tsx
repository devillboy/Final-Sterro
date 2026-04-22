import React, { useState } from "react";
import { motion } from "motion/react";
import { Menu, X, ChevronDown, ShoppingCart, Tag } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#080d1e] border-b border-[var(--color-border)] text-[var(--color-text-dim)] py-2 text-xs flex justify-between px-6 items-center">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Tag size={12}/> Special Offer</span>
          <span className="hidden sm:inline">Get 50% off on all hosting plans!</span>
          <span className="bg-[#0d6efd] text-white font-bold px-2 py-0.5 rounded ml-2">STERRO50</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 cursor-pointer hover:text-white relative">
            <ShoppingCart size={14} />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full leading-none">1</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white">
            <img src="https://flagcdn.com/w20/gb.png" alt="English" className="h-3 rounded-[1px] opacity-80" />
            English <ChevronDown size={12} />
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-[var(--color-bg-main)]/90 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.discordapp.com/icons/1391758924687999006/9d09b6eae193f8156683b959fd116e68.webp?size=2048" 
              alt="Sterro Cloud Logo" 
              className="w-8 h-8 rounded"
            />
            <span className="text-xl font-bold tracking-tight text-white flex items-center mt-1">
              STERRO<span className="font-normal text-[var(--color-text-dim)] ml-1">CLOUD</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="text-white hover:text-white transition-colors">Home</a>
            <NavLink label="Game Servers" hasDropdown />
            <NavLink label="Root Servers" hasDropdown />
            <NavLink label="Informations" hasDropdown />
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="text-[var(--color-text-dim)] hover:text-white px-4 py-2 text-sm font-medium transition-colors border border-[var(--color-border)] rounded-md">
              Login
            </button>
            <button className="bg-[#0d6efd] hover:bg-blue-600 text-white px-5 py-2 rounded-md transition-colors text-sm font-medium">
              Register
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] p-6 absolute w-full left-0 top-16 shadow-2xl"
          >
            <div className="flex flex-col gap-6 font-medium">
              <a href="#" className="text-white">Home</a>
              <MobileNavLink label="Game Servers" />
              <MobileNavLink label="Root Servers" />
              <MobileNavLink label="Informations" />
              <div className="pt-4 border-t border-[var(--color-border)] flex flex-col gap-4">
                <button className="border border-[var(--color-border)] text-[var(--color-text-dim)] py-2 rounded-md hover:text-white transition-colors">Login</button>
                <button className="bg-[#0d6efd] text-white py-2 rounded-md hover:bg-blue-600 transition-colors">Register</button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}

function NavLink({ label, hasDropdown = false }: { label: string; hasDropdown?: boolean }) {
  return (
    <div className="flex items-center gap-1 text-[var(--color-text-dim)] hover:text-white cursor-pointer transition-colors">
      {label}
      {hasDropdown && <ChevronDown size={14} className="opacity-70" />}
    </div>
  );
}

function MobileNavLink({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between text-[var(--color-text-dim)] hover:text-white transition-colors cursor-pointer">
      {label}
      <ChevronDown size={16} />
    </div>
  );
}
