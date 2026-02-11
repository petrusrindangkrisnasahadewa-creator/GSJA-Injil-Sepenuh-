
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Mic, Music, Monitor, Car, HeartHandshake, Filter, CheckCircle, Clock, Search, Droplets } from 'lucide-react';
import { MinistryRole, Volunteer } from '../types';

const AdminVolunteers: React.FC = () => {
  const context = useContext(AppContext);
  const [filterRole, setFilterRole] = useState<MinistryRole | 'ALL'>('ALL');
  const [filterBaptism, setFilterBaptism] = useState<'ALL' | 'BAPTIZED' | 'NOT_BAPTIZED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  if (!context) return null;
  const { state, setState } = context;

  const roles: { id: MinistryRole; label: string; icon: React.ElementType }[] = [
    { id: 'WL', label: 'Worship Leader', icon: Mic },
    { id: 'Singer', label: 'Singer', icon: Mic },
    { id: 'Keyboard', label: 'Keyboard', icon: Music },
    { id: 'Gitar', label: 'Gitar', icon: Music },
    { id: 'Bass', label: 'Bass', icon: Music },
    { id: 'Drum', label: 'Drum', icon: Music },
    { id: 'Multimedia', label: 'Multimedia', icon: Monitor },
    { id: 'Usher', label: 'Usher', icon: HeartHandshake },
    { id: 'Parkir', label: 'Parkir', icon: Car },
  ];

  const filteredVolunteers = state.volunteerData.filter(v => {
    // Lookup Jemaat Data to check baptism status
    const jemaat = state.jemaatData.find(j => j.id === v.userId);
    const isBaptized = jemaat ? jemaat.isBaptized : false;

    const matchesRole = filterRole === 'ALL' || v.role === filterRole;
    const matchesSearch = v.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesBaptism = true;
    if (filterBaptism === 'BAPTIZED') matchesBaptism = isBaptized;
    if (filterBaptism === 'NOT_BAPTIZED') matchesBaptism = !isBaptized;

    return matchesRole && matchesSearch && matchesBaptism;
  });

  const handleApprove = (id: string) => {
      setState(prev => ({
          ...prev,
          volunteerData: prev.volunteerData.map(v => v.id === id ? { ...v, status: 'Approved' } : v)
      }));
  };

  const getIcon = (role: MinistryRole) => {
      const found = roles.find(r => r.id === role);
      const Icon = found ? found.icon : Mic;
      return <Icon size={18} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pelayan</h1>
          <p className="text-slate-500">Kelola pendaftaran dan database relawan gereja.</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col xl:flex-row gap-4">
              
              {/* Search & Baptism Filter Group */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Cari nama pelayan..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900"
                    />
                </div>
                {/* Baptism Filter Dropdown */}
                <div className="relative min-w-[160px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Droplets size={16} />
                    </div>
                    <select
                        value={filterBaptism}
                        onChange={(e) => setFilterBaptism(e.target.value as any)}
                        className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm font-bold appearance-none cursor-pointer"
                    >
                        <option value="ALL">Semua Status</option>
                        <option value="BAPTIZED">Sudah Baptis</option>
                        <option value="NOT_BAPTIZED">Belum Baptis</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                </div>
              </div>

              {/* Role Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 custom-scrollbar">
                  <Filter size={18} className="text-slate-400 shrink-0" />
                  <button 
                    onClick={() => setFilterRole('ALL')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filterRole === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                  >
                      Semua
                  </button>
                  {roles.map(r => (
                      <button 
                        key={r.id}
                        onClick={() => setFilterRole(r.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${filterRole === r.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                      >
                          <r.icon size={14} /> {r.label}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVolunteers.length > 0 ? (
              filteredVolunteers.map(vol => {
                  const jemaat = state.jemaatData.find(j => j.id === vol.userId);
                  const isBaptized = jemaat ? jemaat.isBaptized : false;

                  return (
                    <div key={vol.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-lg overflow-hidden">
                                    {jemaat?.photoUrl ? (
                                        <img src={jemaat.photoUrl} alt={vol.userName} className="w-full h-full object-cover" />
                                    ) : (
                                        vol.userName.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{vol.userName}</h3>
                                    <p className="text-xs text-slate-500 font-mono">{vol.userPhone}</p>
                                </div>
                            </div>
                            <div className={`p-2 rounded-xl ${vol.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {vol.status === 'Approved' ? <CheckCircle size={20} /> : <Clock size={20} />}
                            </div>
                        </div>

                        {/* Baptism Status Badge */}
                        <div className={`px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-bold ${isBaptized ? 'bg-cyan-50 text-cyan-700' : 'bg-slate-100 text-slate-500'}`}>
                            <Droplets size={14} />
                            {isBaptized ? 'Sudah Baptis Air' : 'Belum Baptis Air'}
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm border border-indigo-50">
                                {getIcon(vol.role)}
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Melayani Sebagai</p>
                                <p className="font-bold text-slate-800">{roles.find(r => r.id === vol.role)?.label}</p>
                            </div>
                        </div>

                        <div className="pt-2 mt-auto border-t border-slate-50">
                            <p className="text-xs text-slate-400 mb-3">Mendaftar: {new Date(vol.createdAt).toLocaleDateString('id-ID')}</p>
                            
                            {vol.status === 'Pending' ? (
                                <button 
                                    onClick={() => handleApprove(vol.id)}
                                    className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
                                >
                                    Setujui & Hubungi
                                </button>
                            ) : (
                                <button disabled className="w-full py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm cursor-default">
                                    Aktif Melayani
                                </button>
                            )}
                        </div>
                    </div>
                  );
              })
          ) : (
              <div className="col-span-full py-20 text-center">
                  <p className="text-slate-400 font-medium">Belum ada data pelayan untuk filter ini.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default AdminVolunteers;
