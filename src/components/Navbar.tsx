import React, { useState } from "react";
import { motion } from "motion/react";
import { Menu, X, Shield, LogOut, User as UserIcon, MessageCircle } from "lucide-react";
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
      {/* Top Banner */}
      <div className="bg-[#00F0FF]/10 border-b border-[#00F0FF]/20 text-[#00F0FF] py-2.5 text-xs flex justify-center px-6 items-center">
        <a href="https://discord.gg/b2PqWqSEU3" target="_blank" rel="noreferrer" className="flex items-center gap-2 font-semibold hover:text-white transition-colors">
          Join our Discord community for more information and instant support &rarr;
        </a>
      </div>

      <nav className="sticky top-0 z-50 bg-[#050914]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={(e) => scrollTo("root", e)}>
            <motion.img 
              whileHover={{ scale: 1.05 }}
              src="https://cdn.discordapp.com/icons/1391758924687999006/9d09b6eae193f8156683b959fd116e68.webp?size=2048" 
              alt="Sterro Cloud Logo" 
              className="w-8 h-8 rounded-lg shadow-lg"
            />
            <span className="text-xl font-bold tracking-tight text-white flex items-center">
              <span>STERRO</span>
              <span className="font-medium text-[#00F0FF] ml-1">CLOUD</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold">
            <a href="#" onClick={(e) => scrollTo("root", e)} className="text-zinc-300 hover:text-white transition-colors">Home</a>
            <a href="#games" onClick={(e) => scrollTo("games", e)} className="text-zinc-300 hover:text-white transition-colors">Game Servers</a>
            <a href="#pricing" onClick={(e) => scrollTo("pricing", e)} className="text-zinc-300 hover:text-white transition-colors">Root Servers</a>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('TOGGLE_SUPPORT_CHAT'))}
              className="px-4 py-2 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 hover:bg-[#00F0FF] hover:text-[#050914] transition-all flex items-center gap-2 text-sm font-bold shadow-[0_0_15px_rgba(0,240,255,0.1)]"
            >
              <MessageCircle size={16} />
              Support
            </button>
            {isAdmin && (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('OPEN_ADMIN_PANEL'))}
                className="text-[#00F0FF] font-bold flex items-center gap-2 hover:brightness-125 transition-all"
              >
                  <Shield size={14} /> Panel
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-8 bg-white/5 animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group cursor-pointer relative py-2">
                  <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-black/40">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || ''} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#00F0FF]">
                        <UserIcon size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-white text-sm font-bold truncate max-w-[100px]">{user.displayName}</span>
                    <span className="text-cyan-400 text-[10px] uppercase font-bold tracking-wider">{isAdmin ? 'Admin' : 'Member'}</span>
                  </div>
                  
                  {/* Dropdown for desktop user */}
                  <div className="absolute top-full right-0 mt-1 w-48 bg-[#0a101f] border border-white/10 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-[60]">
                    <div className="px-4 py-2 border-b border-white/5 mb-1 text-white text-xs font-bold truncate">
                      {user.email || 'Cloud User'}
                    </div>
                    {isAdmin && (
                      <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('OPEN_ADMIN_PANEL'))}
                        className="w-full text-left px-4 py-2 text-sm text-[#00F0FF] hover:bg-[#00F0FF]/5 flex items-center gap-2 transition-colors font-bold"
                      >
                        <Shield size={14} /> Admin Panel
                      </button>
                    )}
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={loginGoogle}
                  className="bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-lg transition-all text-sm font-bold shadow-md flex items-center gap-2"
                >
                  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 7.368l6.817 5.281C43.518 35.803 48 29.5 48 24c0-1.353-.167-2.673-.448-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.368l6.19 5.238C36.971 39.205 44 34 44 24c0-1.353-.167-2.673-.448-3.917z"/></svg>
                  Login with Google
                </button>
              </div>
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
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-[#050914] border-b border-white/5 p-6 absolute w-full left-0 top-16 shadow-2xl"
          >
            <div className="flex flex-col gap-6 font-medium">
              <a href="#" onClick={(e) => scrollTo("root", e)} className="text-white">Home</a>
              <a href="#games" onClick={(e) => scrollTo("games", e)} className="text-zinc-300">Game Servers</a>
              <a href="#pricing" onClick={(e) => scrollTo("pricing", e)} className="text-zinc-300">Root Servers</a>
              <button 
                onClick={() => { setIsOpen(false); window.dispatchEvent(new CustomEvent('TOGGLE_SUPPORT_CHAT')); }} 
                className="text-[#00F0FF] font-bold text-left flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse"></span>
                Support Chat
              </button>
              {isAdmin && (
                <button 
                  onClick={() => { setIsOpen(false); window.dispatchEvent(new CustomEvent('OPEN_ADMIN_PANEL')); }} 
                  className="text-[#00F0FF] font-bold text-left"
                >
                  Admin Panel
                </button>
              )}
              <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                {loading ? (
                  <div className="h-10 bg-white/5 animate-pulse rounded-md" />
                ) : user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-black">
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt={user.displayName || ''} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#00F0FF]">
                            <UserIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-white text-sm font-bold truncate">{user.displayName}</span>
                        <span className="text-zinc-400 text-xs truncate">{user.email || 'Cloud User'}</span>
                      </div>
                    </div>
                    <button 
                      onClick={logout}
                      className="border border-red-500/30 text-red-400 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 font-bold"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={loginGoogle}
                      className="bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 7.368l6.817 5.281C43.518 35.803 48 29.5 48 24c0-1.353-.167-2.673-.448-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.368l6.19 5.238C36.971 39.205 44 34 44 24c0-1.353-.167-2.673-.448-3.917z"/></svg>
                      Login with Google
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}
