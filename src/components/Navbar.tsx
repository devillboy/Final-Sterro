import React, { useState } from "react";
import { motion } from "motion/react";
import { Menu, X, ChevronDown, ShoppingCart, Tag, LogOut, User as UserIcon, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { discordUser, firebaseUser, isAdmin, loginDiscord, loginGoogle, logout, loading } = useAuth();

  const user = firebaseUser || (discordUser ? { 
    uid: discordUser.id,
    photoURL: discordUser.avatar ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` : null, 
    displayName: discordUser.global_name || discordUser.username,
    email: discordUser.email
  } : null);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#080d1e] border-b border-[var(--color-border)] text-[var(--color-text-dim)] py-2 text-xs flex justify-between px-6 items-center">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Tag size={12}/> Special Offer</span>
          <span className="hidden sm:inline">Get 50% off on all hosting plans!</span>
          <span className="bg-[#00F0FF] text-black font-bold px-2 py-0.5 rounded ml-2">STERRO50</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 cursor-pointer hover:text-white relative">
            <ShoppingCart size={14} />
            <span className="absolute -top-2 -right-2 bg-[#00F0FF] text-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full leading-none font-bold">1</span>
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
          <div className="flex items-center gap-3 group cursor-pointer preserve-3d">
            <motion.img 
              whileHover={{ rotateY: 20, translateZ: 10 }}
              src="https://cdn.discordapp.com/icons/1391758924687999006/9d09b6eae193f8156683b959fd116e68.webp?size=2048" 
              alt="Sterro Cloud Logo" 
              className="w-8 h-8 rounded shadow-lg"
            />
            <span className="text-xl font-bold tracking-tight text-white flex items-center mt-1 preserve-3d">
              <span className="text-3d-white">STERRO</span>
              <span className="font-normal text-[var(--color-text-dim)] ml-1 text-3d-white" style={{ textShadow: 'none' }}>CLOUD</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="text-white hover:text-white transition-colors">Home</a>
            <NavLink label="Game Servers" hasDropdown />
            <NavLink label="Root Servers" hasDropdown />
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
                  <div className="w-8 h-8 rounded-full border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]">
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
                    <span className="text-[var(--color-text-dim)] text-[10px] uppercase font-bold tracking-wider">{isAdmin ? 'Admin' : 'Member'}</span>
                  </div>
                  
                  {/* Dropdown for desktop user */}
                  <div className="absolute top-full right-0 mt-1 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-[60]">
                    <div className="px-4 py-2 border-b border-[var(--color-border)] mb-1 text-white text-xs font-bold truncate">
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
                    <button className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-dim)] hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors">
                      <UserIcon size={14} /> My Profile
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={loginDiscord}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-md transition-all text-sm font-bold"
                >
                  Discord
                </button>
                <button 
                  onClick={loginGoogle}
                  className="bg-[#00F0FF] hover:bg-[#00D8E6] text-black px-4 py-2 rounded-md transition-all text-sm font-bold shadow-lg shadow-[#00F0FF]/20"
                >
                  Google Login
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
            className="lg:hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] p-6 absolute w-full left-0 top-16 shadow-2xl"
          >
            <div className="flex flex-col gap-6 font-medium">
              <a href="#" className="text-white">Home</a>
              <MobileNavLink label="Game Servers" />
              <MobileNavLink label="Root Servers" />
              {isAdmin && (
                <button 
                  onClick={() => { setIsOpen(false); window.dispatchEvent(new CustomEvent('OPEN_ADMIN_PANEL')); }} 
                  className="text-[#00F0FF] font-bold text-left"
                >
                  Admin Panel
                </button>
              )}
              <div className="pt-4 border-t border-[var(--color-border)] flex flex-col gap-4">
                {loading ? (
                  <div className="h-10 bg-white/5 animate-pulse rounded-md" />
                ) : user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                      <div className="w-10 h-10 rounded-full border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]">
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
                        <span className="text-[var(--color-text-dim)] text-xs truncate">{user.email || 'Cloud User'}</span>
                      </div>
                    </div>
                    <button 
                      onClick={logout}
                      className="border border-red-500/30 text-red-400 py-2 rounded-md hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={loginDiscord}
                      className="border border-white/10 text-white py-2 rounded-md hover:bg-white/5 transition-colors font-bold"
                    >
                      Discord Login
                    </button>
                    <button 
                      onClick={loginGoogle}
                      className="bg-[#00F0FF] text-black font-bold py-2 rounded-md hover:bg-[#00D8E6] transition-colors"
                    >
                      Google Login
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
