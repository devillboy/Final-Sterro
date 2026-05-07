import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSounds } from "../utils/sounds";
import { Menu, X, Shield, LogOut, User as UserIcon, MessageCircle, ChevronRight, LayoutTemplate, Database } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { firebaseUser, isAdmin, loginGoogle, logout, loading } = useAuth();
  const { playClick } = useSounds();
  const navigate = useNavigate();
  const location = useLocation();

  const user = firebaseUser;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div className="bg-brand-gold/5 border-b border-brand-gold/10 text-brand-gold py-2 text-[10px] uppercase font-bold tracking-widest flex justify-center px-6 items-center">
        <a href="https://discord.gg/b2PqWqSEU3" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-all duration-300">
          <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
          Connect with our global community for expert insights and support
        </a>
      </div>

      <nav className="sticky top-0 z-50 bg-bg-dark/80 backdrop-blur-2xl border-b border-white/5 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-4 group cursor-pointer" onClick={() => playClick()}>
                <div className="relative">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    src="https://cdn.discordapp.com/icons/1391758924687999006/9d09b6eae193f8156683b959fd116e68.webp?size=2048" 
                    alt="Sterro Cloud Logo" 
                    className="w-10 h-10 rounded-xl relative z-10 border border-white/10 shadow-lg brightness-110 grayscale group-hover:grayscale-0 group-hover:brightness-125 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-brand-gold/5 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-white leading-none font-display uppercase text-premium-gradient">
                    STERRO<span className="font-medium text-brand-gold/80 ml-0.5">CLOUD</span>
                  </span>
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                    <span className="w-3 h-px bg-slate-800" />
                    Premium Infrastructure
                  </span>
                </div>
              </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              <Link to="/" onClick={() => playClick()} className={`hover:text-brand-gold transition-colors relative group/link ${isActive('/') ? 'text-brand-gold' : ''}`}>
                Overview
                <span className={`absolute -bottom-1 left-0 h-px bg-brand-gold transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover/link:w-full'}`} />
              </Link>
              <Link to="/features" onClick={() => playClick()} className={`hover:text-brand-gold transition-colors relative group/link ${isActive('/features') ? 'text-brand-gold' : ''}`}>
                Technology
                <span className={`absolute -bottom-1 left-0 h-px bg-brand-gold transition-all duration-300 ${isActive('/features') ? 'w-full' : 'w-0 group-hover/link:w-full'}`} />
              </Link>
              <Link to="/pricing" onClick={() => playClick()} className={`hover:text-brand-gold transition-colors relative group/link ${isActive('/pricing') ? 'text-brand-gold' : ''}`}>
                Infrastructure
                <span className={`absolute -bottom-1 left-0 h-px bg-brand-gold transition-all duration-300 ${isActive('/pricing') ? 'w-full' : 'w-0 group-hover/link:w-full'}`} />
              </Link>
            </div>
            
            <div className="h-3 w-px bg-white/5" />
            
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('TOGGLE_SUPPORT_CHAT'))}
              className="flex items-center gap-2 group text-[11px] font-semibold uppercase tracking-widest text-slate-500 hover:text-brand-gold transition-colors"
            >
              <MessageCircle size={14} />
              Concierge
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {loading ? (
              <div className="w-32 h-12 bg-white/5 animate-pulse rounded-2xl" />
            ) : user ? (
              <div className="group relative">
                <div className="flex items-center gap-4 cursor-pointer py-1.5 pr-1.5 pl-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-brand-gold/20 hover:bg-brand-gold/5 transition-all duration-500">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white leading-none mb-1.5">{user.displayName?.split(' ')[0]}</span>
                    <span className={isAdmin ? 'admin-badge' : 'text-[8px] font-bold text-slate-500 tracking-widest uppercase'}>{isAdmin ? 'OPERATOR' : 'CLIENT'}</span>
                  </div>
                  <div className="w-11 h-11 rounded-xl border border-white/10 overflow-hidden shadow-2xl group-hover:border-brand-gold/30 transition-all duration-500">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-brand-gold/5 flex items-center justify-center text-brand-gold/40">
                        <UserIcon size={18} />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Refined Dropdown */}
                <div className="absolute top-[120%] right-0 w-64 bg-bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl py-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 shadow-3xl z-[60]">
                  <div className="px-5 py-2 mb-2 border-b border-white/5 overflow-hidden">
                    <div className="text-[9px] font-bold text-slate-600 tracking-widest mb-1">ACCOUNT IDENTIFIER</div>
                    <div className="text-[11px] font-mono text-slate-400 truncate">{user.email}</div>
                  </div>
                  
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('OPEN_USER_DASHBOARD', { detail: 'subscriptions' }))}
                    className="w-full text-left px-5 py-3 text-[11px] font-bold text-slate-400 hover:text-brand-gold hover:bg-brand-gold/5 flex items-center gap-3 transition-colors uppercase tracking-widest"
                  >
                    <LayoutTemplate size={14} /> My Subscriptions
                  </button>
                  
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('OPEN_USER_DASHBOARD', { detail: 'credentials' }))}
                    className="w-full text-left px-5 py-3 text-[11px] font-bold text-slate-400 hover:text-brand-gold hover:bg-brand-gold/5 flex items-center gap-3 transition-colors uppercase tracking-widest"
                  >
                    <Database size={14} /> Panel Access
                  </button>

                  <div className="mx-5 my-2 border-t border-white/5" />

                  {isAdmin && (
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('OPEN_ADMIN_PANEL'))}
                      className="w-full text-left px-5 py-3 text-[11px] font-bold text-brand-gold hover:bg-brand-gold/5 flex items-center gap-3 transition-colors uppercase tracking-widest"
                    >
                      <Shield size={14} /> Administration
                    </button>
                  )}
                  <button 
                    onClick={logout}
                    className="w-full text-left px-5 py-3 text-[11px] font-bold text-red-500 hover:bg-red-400/5 flex items-center gap-3 transition-colors uppercase tracking-widest"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={loginGoogle}
                className="group relative px-6 py-3 bg-brand-gold text-slate-950 font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-glow-gold flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
                <span className="relative z-10 group-hover:text-slate-950 transition-colors">Sign In</span>
                <ChevronRight size={14} className="relative z-10 transition-transform group-hover:translate-x-1 group-hover:text-slate-950" />
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
                  <Link to="/" onClick={() => setIsOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-white">Overview</Link>
                  <Link to="/features" onClick={() => setIsOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Technology</Link>
                  <Link to="/pricing" onClick={() => setIsOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Infrastructure</Link>
                  <button 
                    onClick={() => { setIsOpen(false); window.dispatchEvent(new CustomEvent('TOGGLE_SUPPORT_CHAT')); }} 
                    className="text-[11px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                    Support Center
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
                            <div className="w-full h-full flex items-center justify-center text-brand-gold">
                              <UserIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-bold text-white truncate uppercase tracking-wider">{user.displayName}</span>
                          <span className="text-[10px] font-mono text-slate-500 truncate">{user.email}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {isAdmin && (
                          <button 
                            onClick={() => { setIsOpen(false); window.dispatchEvent(new CustomEvent('OPEN_ADMIN_PANEL')); }} 
                            className="bg-brand-gold/10 text-brand-gold px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-brand-gold/20"
                          >
                            Admin
                          </button>
                        )}
                        <button 
                          onClick={logout}
                          className="bg-red-500/10 text-red-500 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-red-500/20"
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={loginGoogle}
                      className="bg-brand-gold text-slate-950 font-bold py-4 rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest"
                    >
                      Sign In
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

