import React from "react";
import { motion } from "motion/react";
import { useSounds } from "../utils/sounds";
import { Mail, MessageCircle, Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const { playClick } = useSounds();
  return (
    <footer className="bg-surface pt-20 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.discordapp.com/icons/1391758924687999006/9d09b6eae193f8156683b959fd116e68.webp?size=2048" 
                alt="Stereo Cloud Logo" 
                className="w-12 h-12 rounded-xl"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-[-0.04em] text-white leading-none font-display uppercase italic">
                  STEREO<span className="font-light text-brand-cyan/80 ml-1">CLOUD</span>
                </span>
                <span className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase mt-2">Elastic Compute Node</span>
              </div>
            </div>
            <p className="text-white/40 max-w-sm leading-relaxed">
              Stereo Cloud provides high-performance hosting solutions engineered for speed, security, and scalability. Your vision, our hardware.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-8">Products</h4>
            <ul className="space-y-4 text-white/40 text-sm font-medium">
              <li><FooterLink>Game Servers</FooterLink></li>
              <li><FooterLink>vServer (VPS)</FooterLink></li>
              <li><FooterLink>Dedicated Servers</FooterLink></li>
              <li><FooterLink>Web Hosting</FooterLink></li>
              <li><FooterLink>Domains</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-8">Support</h4>
            <ul className="space-y-4 text-white/40 text-sm font-medium">
              <li><FooterLink>Contact Support</FooterLink></li>
              <li><FooterLink>Wiki & Knowledgebase</FooterLink></li>
              <li><FooterLink>Discord Community</FooterLink></li>
              <li><FooterLink>Status Page</FooterLink></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/30 text-xs font-medium">
            © 2026 Stereo Cloud | IT Solution. All rights reserved.
          </div>
          <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest text-white/30">
            <FooterLink>Terms of Service</FooterLink>
            <FooterLink>Privacy Policy</FooterLink>
            <FooterLink>Imprint</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
  const { playClick } = useSounds();
  return (
    <a 
      href="#" 
      onClick={(e) => { e.preventDefault(); playClick(); onClick?.(); }}
      className="hover:text-[#00F0FF] transition-colors cursor-pointer"
    >
      {children}
    </a>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-[#00F0FF] hover:text-black transition-all duration-300">
      {icon}
    </a>
  );
}
