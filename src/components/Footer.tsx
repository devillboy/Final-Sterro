import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useSounds } from "../utils/sounds";
import { Mail, MessageCircle, Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const { playClick } = useSounds();
  return (
    <footer className="bg-bg-dark pt-20 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <img 
                src="https://cdn.discordapp.com/icons/1391758924687999006/9d09b6eae193f8156683b959fd116e68.webp?size=2048" 
                alt="Sterro Cloud Logo" 
                className="w-12 h-12 rounded-xl shadow-3d-sm grayscale brightness-125"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-none font-display uppercase text-premium-gradient">
                  STERRO<span className="font-medium text-brand-gold/80 ml-0.5">CLOUD</span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-600 uppercase mt-2">Premium Infrastructure</span>
              </div>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed text-sm">
              Sterro Cloud provides high-performance hosting solutions engineered for speed, security, and global scalability.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-8">Navigation</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-medium">
              <li><FooterLink to="/">Overview</FooterLink></li>
              <li><FooterLink to="/features">Technology</FooterLink></li>
              <li><FooterLink to="/pricing">Infrastructure</FooterLink></li>
              <li><FooterLink to="/login">Client Access</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-8">Ecosystem</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-medium">
              <li><FooterLink to="/support">Documentation</FooterLink></li>
              <li><FooterLink to="https://discord.gg/b2PqWqSEU3" isExternal>Discord Community</FooterLink></li>
              <li><FooterLink to="/status">Network Status</FooterLink></li>
              <li><FooterLink to="/legal">Corporate</FooterLink></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-600 text-xs font-bold uppercase tracking-widest">
            © 2026 Sterro Cloud. Built for performance.
          </div>
          <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest text-slate-600">
            <FooterLink to="/terms">Terms</FooterLink>
            <FooterLink to="/privacy">Privacy</FooterLink>
            <FooterLink to="/legal">Legal</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ children, to, isExternal }: { children: React.ReactNode, to: string, isExternal?: boolean }) {
  const { playClick } = useSounds();
  const baseClasses = "hover:text-brand-gold transition-colors cursor-pointer";
  
  if (isExternal) {
    return (
      <a 
        href={to}
        target="_blank"
        rel="noreferrer"
        onClick={() => playClick()}
        className={baseClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <Link 
      to={to} 
      onClick={() => playClick()}
      className={baseClasses}
    >
      {children}
    </Link>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-black transition-all duration-300">
      {icon}
    </a>
  );
}
