import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CursorGlow from "./CursorGlow";
import AdminPanel from "./AdminPanel";
import UserDashboard from "./UserDashboard";
import SupportChat from "./SupportChat";
import { motion, useScroll, useSpring } from "motion/react";
import { AuthProvider } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const handleOpenAdmin = () => setShowAdmin(true);
    window.addEventListener("OPEN_ADMIN_PANEL", handleOpenAdmin);
    return () =>
      window.removeEventListener("OPEN_ADMIN_PANEL", handleOpenAdmin);
  }, []);

  return (
    <AuthProvider>
      <CursorGlow />
      {showAdmin && <AdminPanel />}
      <UserDashboard />
      <div
        id="app-main"
        className="relative bg-bg-dark min-h-screen overflow-x-hidden text-slate-300 font-sans selection:bg-brand-gold selection:text-bg-dark"
      >
        {/* Animated Background Glow */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-gold/5 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-500/5 blur-[150px] rounded-full animate-pulse delay-1000" />
        </div>

        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-brand-gold z-[100] origin-left shadow-glow-gold"
          style={{ scaleX }}
        />

        <Navbar />

        <main className="relative z-10">
          {children}
        </main>

        <Footer />
      </div>
      <SupportChat />
    </AuthProvider>
  );
}
