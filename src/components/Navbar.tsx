import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Shield, LogOut, User as UserIcon, MessageCircle, ChevronRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { firebaseUser, isAdmin, loginGoogle, logout, loading } = useAuth();

  const user = firebaseUser;

  const scrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <>
      <div className="bg-brand-cyan/5 border-b border-brand-cyan/10 text-brand-cyan py-2 text-[10px] uppercase font-black tracking-[0.2em] flex justify-center px-6 items-center">
        <a href="https://discord.gg/b2PqWqSEU3" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-all duration-300">
          <span className="w-1 h-1 bg-brand-cyan rounded-full animate-pulse" />
          Join our Discord community for instant support & updates
        </a>
      </div>

      <nav className="sticky top-0 z-50 bg-bg-dark/70 backdrop-blur-3xl border-b border-white/5 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 group cursor-pointer" onClick={(e) => scrollTo("root", e)}>
            <div className="relative">
              <motion.img 
                whileHover={{ scale: 1.1, rotate: 5 }}
                src="https://cdn.discordapp.com/icons/1391758924687999006/9d09b6eae193f8156683b959fd116e68.webp?size=2048" 
                alt="Sterro Cloud Logo" 
                className="w-10 h-10 rounded-xl shadow-2xl relative z-10"
              />
              <div className="absolute inset-0 bg-brand-cyan/20 blur-xl rounded-xl scale-0 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span className="text-2xl font-extrabold tracking-tighter text-white">
              STERRO<span className="text-brand-cyan">CLOUD</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">
              <a href="#" onClick={(e) => scrollTo("root", e)} className="hover:text-white transition-colors">Nodes</a>
              <a href="#pricing" onClick={(e) => scrollTo("pricing", e)} className="hover:text-white transition-colors">Solutions</a>
              <a href="#games" onClick={(e) => scrollTo("games", e)} className="hover:text-white transition-colors">Locations</a>
            </div>
            
            <div className="h-6 w-px bg-white/10" />
            
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('TOGGLE_SUPPORT_CHAT'))}
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-brand-cyan hover:text-white transition-colors"
            >
              <MessageCircle size={14} />
              Assistant
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {loading ? (
              <div className="w-24 h-5 bg-white/5 animate-pulse rounded-full" />
            ) : user ? (
              <div className="group relative">
                <div className="flex items-center gap-3 cursor-pointer py-1 pr-1 pl-4 rounded-full bg-white/5 border border-white/10 hover:border-brand-cyan/30 hover:bg-brand-cyan/5 transition-all duration-300">
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-black uppercase tracking-widest text-white leading-none mb-1">{user.displayName?.split(' ')[0]}</span>
                    <span className="text-[9px] font-bold text-brand-cyan/70 tracking-widest leading-none">{isAdmin ? 'OPERATOR' : 'CLIENT'}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden shadow-lg group-hover:border-brand-cyan/50 transition-colors duration-500">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                        <UserIcon size={16} />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Refined Dropdown */}
                <div className="absolute top-[120%] right-0 w-56 bg-bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl py-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 shadow-3xl z-[60]">
                  <div className="px-5 py-2 mb-2 border-b border-white/5 overflow-hidden">
                    <div className="text-[9px] font-black text-zinc-500 tracking-widest mb-1">ACCOUNT IDENTIFIER</div>
                    <div className="text-[11px] font-mono text-zinc-400 truncate">{user.email}</div>
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('OPEN_ADMIN_PANEL'))}
                      className="w-full text-left px-5 py-3 text-[11px] font-black text-brand-cyan hover:bg-brand-cyan/5 flex items-center gap-3 transition-colors uppercase tracking-widest"
                    >
                      <Shield size={14} /> System Core
                    </button>
                  )}
                  <button 
                    onClick={logout}
                    className="w-full text-left px-5 py-3 text-[11px] font-black text-red-400 hover:bg-red-400/5 flex items-center gap-3 transition-colors uppercase tracking-widest"
                  >
                    <LogOut size={14} /> Terminate
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={loginGoogle}
                className="group relative px-6 py-3 bg-white text-bg-dark font-black rounded-xl text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-brand-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
                <span className="relative z-10">Access Terminal</span>
                <ChevronRight size={14} className="relative z-10" />
              </button>
            )}
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
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-bg-dark border-b border-white/5 overflow-hidden"
            >
              <div className="px-6 py-10 flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                  <a href="#" onClick={(e) => scrollTo("root", e)} className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Infrastructure</a>
                  <a href="#games" onClick={(e) => scrollTo("games", e)} className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Nodes</a>
                  <a href="#pricing" onClick={(e) => scrollTo("pricing", e)} className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Pricing</a>
                  <button 
                    onClick={() => { setIsOpen(false); window.dispatchEvent(new CustomEvent('TOGGLE_SUPPORT_CHAT')); }} 
                    className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-cyan flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                    Connect to Support
                  </button>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col gap-6">
                  {loading ? (
                    <div className="h-14 bg-white/5 animate-pulse rounded-xl" />
                  ) : user ? (
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden bg-bg-card">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-cyan">
                              <UserIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-black text-white truncate uppercase tracking-wider">{user.displayName}</span>
                          <span className="text-[10px] font-mono text-zinc-500 truncate">{user.email}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {isAdmin && (
                          <button 
                            onClick={() => { setIsOpen(false); window.dispatchEvent(new CustomEvent('OPEN_ADMIN_PANEL')); }} 
                            className="bg-brand-cyan/10 text-brand-cyan px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand-cyan/20"
                          >
                            System
                          </button>
                        )}
                        <button 
                          onClick={logout}
                          className="bg-red-500/10 text-red-500 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={loginGoogle}
                      className="bg-white text-bg-dark font-black py-4 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest"
                    >
                      Access Terminal
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
