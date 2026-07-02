import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Link2, BarChart3, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NeonButton } from '../UI/NeonUI';

const Layout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <LayoutDashboard />, label: 'داشبورد', path: '/' },
    { icon: <Link2 />, label: 'مدیریت لینک‌ها', path: '/links' },
    { icon: <BarChart3 />, label: 'آمار ترافیک', path: '/stats' },
    { icon: <User />, label: 'پروفایل', path: '/profile' },
  ];

  return (
    <div className="flex h-screen w-full bg-cyber-bg text-white font-vazir" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 glass-card m-4 rounded-2xl flex flex-col border-l border-cyber-cyan/20">
        <div className="p-6 flex items-center gap-3 border-b border-cyber-cyan/20 mb-6">
          <div className="p-2 bg-cyber-cyan rounded-lg text-cyber-bg">
            <Shield size={24} />
          </div>
          <h1 className="font-orbitron text-lg font-bold neon-text-cyan">CYBERGATE</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-all duration-300 group"
            >
              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-cyber-cyan/20">
          <NeonButton 
            onClick={() => { logout(); navigate('/login'); }} 
            className="w-full flex items-center justify-center gap-2"
            variant="red"
          >
            <LogOut size={18} /> خروج
          </NeonButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <header className="flex justify-between items-center mb-8 p-4 glass-card rounded-2xl">
          <div className="text-cyber-textSecondary font-space">
            Welcome back, <span className="text-cyber-cyan font-bold">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
