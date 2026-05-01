import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export default function CursorGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isVisible]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Primary Soft Glow */}
      <motion.div
        style={{
          x: x,
          y: y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5 }}
        className="absolute top-0 left-0 w-[800px] h-[800px] bg-brand-cyan/15 blur-[120px] rounded-full mix-blend-screen"
      />
      
      {/* Secondary Dynamic Inner Core */}
      <motion.div
        style={{
          x: x,
          y: y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 0.6 : 0 }}
        className="absolute top-0 left-0 w-[150px] h-[150px] bg-brand-cyan/30 blur-[40px] rounded-full mix-blend-plus-lighter"
      />

      {/* Trailing Ring */}
      <motion.div
        style={{
          x: x,
          y: y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? [1, 1.2, 1] : 1
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-0 left-0 w-12 h-12 border border-brand-cyan/40 rounded-full blur-[1px] shadow-[0_0_15px_rgba(0,240,255,0.2)]"
      />
    </div>
  );
}
