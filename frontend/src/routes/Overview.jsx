import React from 'react';
import { GlassCard, NeonProgress } from '../components/UI/NeonUI';
import { Activity, Users, Link2, Database } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Sat', traffic: 400 },
  { name: 'Sun', traffic: 300 },
  { name: 'Mon', traffic: 600 },
  { name: 'Tue', traffic: 800 },
  { name: 'Wed', traffic: 500 },
  { name: 'Thu', traffic: 900 },
  { name: 'Fri', traffic: 1100 },
];

const Overview = () => {
  const stats = [
    { label: 'کل لینک‌ها', value: '128', icon: <Link2 />, color: 'cyan' },
    { label: 'لینک‌های فعال', value: '94', icon: <Activity />, color: 'green' },
    { label: 'ترافیک مصرفی', value: '1.2 TB', icon: <Database />, color: 'purple' },
    { label: 'کاربران آنلاین', value: '12', icon: <Users />, color: 'gold' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <GlassCard key={i} className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-cyber-${s.color}/20 text-cyber-${s.color}`}>
              {s.icon}
            </div>
            <div>
              <div className="text-cyber-textSecondary text-xs">{s.label}</div>
              <div className="text-2xl font-orbitron font-bold">{s.value}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 h-80">
          <h3 className="font-orbitron text-cyber-cyan mb-4">ترافیک روزانه (GB)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#00d4ff', color: '#fff' }}
              />
              <Area type="monotone" dataKey="traffic" stroke="#00d4ff" fillOpacity={1} fill="url(#colorTraffic)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="h-80">
          <h3 className="font-orbitron text-cyber-cyan mb-4">وضعیت سرور</h3>
          <div className="space-y-6 mt-8">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>CPU Usage</span>
                <span className="text-cyber-cyan">42%</span>
              </div>
              <NeonProgress value={42} color="cyan" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>RAM Usage</span>
                <span className="text-cyber-purple">68%</span>
              </div>
              <NeonProgress value={68} color="purple" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Disk Space</span>
                <span className="text-cyber-green">21%</span>
              </div>
              <NeonProgress value={21} color="green" />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Overview;
