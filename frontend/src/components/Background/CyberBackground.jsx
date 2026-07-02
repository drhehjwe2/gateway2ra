import React, { useEffect, useState } from 'react';

const CyberBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#00d4ff', '#b300ff', '#39ff14'];
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {/* Grid */}
      <div className="cyber-grid"></div>
      
      {/* Scanline */}
      <div className="scanline"></div>
      
      {/* Particles */}
      {particles.map(p => (
        <div 
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            opacity: 0.6
          }}
        />
      ))}
      
      {/* Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]"></div>
    </div>
  );
};

export default CyberBackground;
