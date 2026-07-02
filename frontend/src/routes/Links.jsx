import React, { useState, useEffect } from 'react';
import { GlassCard, NeonButton, NeonInput, NeonToggle, NeonProgress } from '../components/UI/NeonUI';
import { Plus, Copy, QrCode, Trash2, Edit3, Search } from 'lucide-react';
import axios from 'axios';
import QRCode from 'qrcode.react';

const Links = () => {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', traffic_limit: '' });
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axios.get('/api/links');
      setLinks(res.data);
    } catch (err) {
      console.error("Error fetching links");
    }
  };

  const handleCreateLink = async () => {
    try {
      await axios.post('/api/links', newLink);
      setIsModalOpen(false);
      setNewLink({ name: '', traffic_limit: '' });
      fetchLinks();
    } catch (err) {
      alert("خطا در ساخت لینک");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("آیا از حذف این لینک مطمئن هستید؟")) {
      await axios.delete(`/api/links/${id}`);
      fetchLinks();
    }
  };

  const handleToggle = async (id, status) => {
    await axios.put(`/api/links/${id}`, { is_active: !status });
    fetchLinks();
  };

  const filteredLinks = links.filter(l => l.name?.toLowerCase().includes(search.toLowerCase()) || l.uuid.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-orbitron neon-text-cyan">مدیریت لینک‌ها</h2>
        <NeonButton onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> ساخت لینک جدید
        </NeonButton>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-textMuted" size={18} />
          <NeonInput 
            placeholder="جستجو بر اساس نام یا UUID..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-cyber-cyan/20 text-cyber-textSecondary text-sm">
              <th className="p-4">نام / UUID</th>
              <th className="p-4">محدودیت ترافیک</th>
              <th className="p-4">مصرف شده</th>
              <th className="p-4">وضعیت</th>
              <th className="p-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.map((link) => (
              <tr key={link.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold">{link.name}</div>
                  <div className="text-xs text-cyber-textMuted font-mono">{link.uuid}</div>
                </td>
                <td className="p-4 font-mono">{link.traffic_limit ? `${link.traffic_limit} GB` : 'نامحدود'}</td>
                <td className="p-4 w-48">
                  <div className="flex items-center gap-3">
                    <NeonProgress 
                      value={(link.traffic_used / (link.traffic_limit || 1)) * 100} 
                      color={link.traffic_used / (link.traffic_limit || 1) > 0.8 ? "red" : "cyan"} 
                    />
                    <span className="text-xs font-mono">{link.traffic_used.toFixed(2)} GB</span>
                  </div>
                </td>
                <td className="p-4">
                  <NeonToggle enabled={link.is_active} setEnabled={() => handleToggle(link.id, link.is_active)} />
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedQR(link)} className="p-2 hover:text-cyber-cyan transition-colors"><QrCode size={18} /></button>
                    <button onClick={() => navigator.clipboard.writeText(link.uuid)} className="p-2 hover:text-cyber-cyan transition-colors"><Copy size={18} /></button>
                    <button onClick={() => handleDelete(link.id)} className="p-2 hover:text-cyber-red transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Modal Create */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <GlassCard className="w-full max-w-md p-8">
            <h3 className="text-xl font-orbitron neon-text-cyan mb-6">ساخت لینک VLESS جدید</h3>
            <div className="space-y-4">
              <NeonInput label="نام کاربر" placeholder="مثلاً: Ali-VPN" value={newLink.name} onChange={e => setNewLink({...newLink, name: e.target.value})} />
              <NeonInput label="محدودیت ترافیک (GB)" type="number" placeholder="مثلاً: 50" value={newLink.traffic_limit} onChange={e => setNewLink({...newLink, traffic_limit: e.target.value})} />
              <div className="flex gap-4 mt-8">
                <NeonButton onClick={handleCreateLink} className="flex-1">تایید و ساخت</NeonButton>
                <NeonButton onClick={() => setIsModalOpen(false)} variant="red" className="flex-1">انصراف</NeonButton>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* QR Modal */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <GlassCard className="p-8 text-center">
            <h3 className="text-xl font-orbitron neon-text-cyan mb-6">اتصال سریع</h3>
            <div className="bg-white p-4 rounded-xl inline-block mb-6">
              <QRCode value={`vless://${selectedQR.uuid}@domain:443?path=/vless/${selectedQR.uuid}&security=tls&encryption=none&type=ws&sni=domain#${selectedQR.name}`} size={200} />
            </div>
            <div className="flex gap-4">
              <NeonButton onClick={() => setSelectedQR(null)} className="flex-1">بستن</NeonButton>
              <NeonButton onClick={() => window.print()} className="flex-1">دانلود / چاپ</NeonButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Links;
