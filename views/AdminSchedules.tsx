
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Plus, Calendar, Clock, User, UserCheck, Trash2, Edit, Save } from 'lucide-react';
import { Jadwal } from '../types';

const AdminSchedules: React.FC = () => {
  const context = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  
  // State untuk form tambah jadwal
  const [formData, setFormData] = useState<Partial<Jadwal>>({
    type: 'Ibadah Raya',
    date: '',
    time: '',
    preacher: '',
    worshipLeader: ''
  });

  if (!context) return null;
  const { state, setState } = context;

  const removeJadwal = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      setState(prev => ({
        ...prev,
        jadwalData: prev.jadwalData.filter(j => j.id !== id)
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate ID Unik Otomatis
    // Format: SCH + Timestamp + Random String untuk menjamin keunikan
    const uniqueId = `SCH-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const newSchedule: Jadwal = {
      id: uniqueId,
      type: formData.type as any || 'Ibadah Raya',
      date: formData.date || new Date().toISOString().split('T')[0],
      time: formData.time || '09:00',
      preacher: formData.preacher || '-',
      worshipLeader: formData.worshipLeader || '-'
    };

    setState(prev => ({
      ...prev,
      jadwalData: [...prev.jadwalData, newSchedule]
    }));

    setShowModal(false);
    // Reset Form
    setFormData({
      type: 'Ibadah Raya',
      date: '',
      time: '',
      preacher: '',
      worshipLeader: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jadwal Ibadah</h1>
          <p className="text-slate-500">Kelola waktu pelayanan dan pembicara.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus size={20} />
          Jadwal Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {state.jadwalData.map((j) => (
          <div key={j.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-indigo-600">
                <Calendar size={24} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Edit functionality placeholder */}
                <button className="p-2 text-slate-500 hover:text-indigo-600 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => removeJadwal(j.id)}
                  className="p-2 text-slate-500 hover:text-red-600 bg-white rounded-lg border border-slate-200 shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-6 flex-1 space-y-6">
              <div>
                <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] mb-1">{j.type}</p>
                <h3 className="text-xl font-bold text-slate-900">
                  {new Date(j.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-600 mt-1">
                  <Clock size={14} />
                  <span className="text-sm font-bold">{j.time} WIB - Selesai</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1">Pembicara</p>
                    <p className="text-sm font-bold text-slate-900 leading-none">{j.preacher}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <UserCheck size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1">Worship Leader</p>
                    <p className="text-sm font-bold text-slate-900 leading-none">{j.worshipLeader}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
              <div className="w-full py-2 text-center text-slate-400 text-xs font-mono">
                ID: {j.id}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Tambah Jadwal Baru</h2>
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Tipe Ibadah</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                >
                  <option value="Ibadah Raya">Ibadah Raya</option>
                  <option value="Doa Malam">Doa Malam</option>
                  <option value="Pemuda">Pemuda</option>
                  <option value="Sekolah Minggu">Sekolah Minggu</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">Tanggal</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">Waktu</label>
                  <input 
                    type="time" 
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Pembicara</label>
                <input 
                  type="text" 
                  required
                  value={formData.preacher}
                  onChange={(e) => setFormData({...formData, preacher: e.target.value})}
                  placeholder="Nama Pdt / Pembicara" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Worship Leader</label>
                <input 
                  type="text" 
                  required
                  value={formData.worshipLeader}
                  onChange={(e) => setFormData({...formData, worshipLeader: e.target.value})}
                  placeholder="Nama WL" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" 
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchedules;
