import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NeonInput, NeonButton } from '../components/UI/NeonUI';
import CyberBackground from '../components/Background/CyberBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert('خطا در ورود: نام کاربری یا رمز عبور اشتباه است');
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden">
      <CyberBackground />
      <div className="glass-card p-8 rounded-3xl w-full max-w-md z-10 text-center">
        <div className="mb-8">
          <div className="text-5xl font-orbitron font-bold neon-text-cyan mb-2 animate-glitch">
            CG RVG
          </div>
          <div className="typewriter text-cyber-textSecondary font-space text-sm">
            ACCESSING CYBERGATE SECURE GATEWAY...
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <NeonInput 
            label="ایمیل ادمین" 
            type="email" 
            placeholder="admin@cybergate.local" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <NeonInput 
            label="رمز عبور" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <NeonButton className="w-full py-3 text-lg" onClick={handleSubmit}>
            ورود به سیستم
          </NeonButton>
        </form>
      </div>
    </div>
  );
};

export default Login;
