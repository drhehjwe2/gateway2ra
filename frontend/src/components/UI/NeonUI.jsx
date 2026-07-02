import React from 'react';
import { motion } from 'framer-motion';

export const NeonButton = ({ children, onClick, className = "", variant = "cyan" }) => {
  const variants = {
    cyan: "border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-bg",
    purple: "border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-cyber-bg",
    green: "border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-cyber-bg",
    red: "border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-cyber-bg",
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-md border transition-all duration-300 font-orbitron uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const GlassCard = ({ children, className = "" }) => (
  <div className={`glass-card rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

export const NeonInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-cyber-textSecondary text-sm font-space">{label}</label>}
    <input 
      {...props}
      className="bg-cyber-bg/50 border border-cyber-cyan/30 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all duration-300 placeholder:text-cyber-textMuted"
    />
  </div>
);

export const NeonToggle = ({ enabled, setEnabled }) => (
  <div 
    onClick={() => setEnabled(!enabled)}
    className={`w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 relative ${enabled ? 'bg-cyber-green' : 'bg-cyber-red'}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${enabled ? 'left-7' : 'left-1'}`} />
  </div>
);

export const NeonProgress = ({ value, color = "cyan" }) => {
  const colors = {
    cyan: "bg-cyber-cyan",
    green: "bg-cyber-green",
    yellow: "bg-cyber-gold",
    red: "bg-cyber-red",
  };
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-500 ${colors[color]}`} 
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
