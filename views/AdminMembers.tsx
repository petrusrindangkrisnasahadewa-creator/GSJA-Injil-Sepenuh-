
import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../App';
import { Search, Plus, Edit2, Trash2, Phone, X, Save, MapPin, Calendar, AlertTriangle, Droplets, Baby, Filter, Camera, User } from 'lucide-react';
import { Jemaat } from '../types';

const AdminMembers: React.FC = () => {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBaptism, setFilterBaptism] = useState<'ALL' | 'BAPTIZED' | 'NOT_BAPTIZED'>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Jemaat>>({
    name: '',
    phone: '',
    address: '',
    birthPlace: '',
    birthDate: '',
    photoUrl: '',
    isBaptized: false
  });

  // Delete Confirmation State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{isOpen: boolean, id: string, name: string}>({
    isOpen: false,
    id: '',
    name: ''
  });

  if (!context) return null;
  const { state, setState } = context;

  const filteredJemaat = state.jemaatData.filter(j => {
    const matchesSearch = j.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          j.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterBaptism === 'BAPTIZED') matchesFilter = j.isBaptized === true;
    if (filterBaptism === 'NOT_BAPTIZED') matchesFilter = j.isBaptized === false;

    return matchesSearch && matchesFilter;
  });

  // Handlers
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ name: '', phone: '', address: '', birthPlace: '', birthDate: '', photoUrl: '', isBaptized: false });
    setIsModalOpen(true);
  };

  const openEditModal = (jemaat: Jemaat) => {
    setIsEditing(true);
    setFormData(jemaat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      name
    });
  };

  const confirmDelete = () => {
    setState(prev => ({
      ...prev,
      jemaatData: prev.jemaatData.filter(j => j.id !== deleteConfirmation.id)
    }));
    setDeleteConfirmation({ isOpen: false, id: '', name: '' });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, id: '', name: '' });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && formData.id) {
      // Update existing
      setState(prev => ({
        ...prev,
        jemaatData: prev.jemaatData.map(j => j.id === formData.id ? { ...j, ...formData } as Jemaat : j)
      }));
    } else {
      // Create new (Sequential ID Logic)
      
      // Mencari angka terbesar dari ID yang ada (format JMxxx)
      const maxId = state.jemaatData.reduce((max, user) => {
          const numStr = user.id.replace('JM', '');
          const num = parseInt(numStr);
          return !isNaN(num) && num > max ? num : max;
      }, 0);

      const nextId = maxId + 1;
      const newId = `JM${nextId.toString().padStart(3, '0')}`;

      const newJemaat: Jemaat = {
        id: newId,
        name: formData.name || 'Tanpa Nama',
        phone: formData.phone || '-',
        address: formData.address || '-',
        joinedAt: new Date().toISOString().split('T')[0],
        photoUrl: formData.photoUrl || '',
        birthPlace: formData.birthPlace || '',
        birthDate: formData.birthDate || '',
        isBaptized: formData.isBaptized || false
      };

      setState(prev => ({
        ...prev,
        jemaatData: [newJemaat, ...prev.jemaatData]
      }));
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Jemaat</h1>
          <p className="text-slate-500">Kelola database anggota jemaat gereja.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-3">
          
          {/* Filter Dropdown */}
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={filterBaptism}
              onChange={(e) => setFilterBaptism(e.target.value as any)}
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-slate-900 font-medium appearance-none cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="BAPTIZED">Sudah Baptis</option>
              <option value="NOT_BAPTIZED">Belum Baptis</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari ID atau Nama..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 text-slate-900"
            />
          </div>
          <button 
            onClick={openAddModal}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 whitespace-nowrap"
          >
            <Plus size={20} /> <span className="font-bold">Jemaat Baru</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider">ID / Nama</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider">Kontak</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider">Data Diri</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider">Alamat</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJemaat.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:ring-2 group-hover:ring-indigo-100 transition-all border border-slate-200 overflow-hidden shrink-0">
                        {j.photoUrl ? (
                          <img src={j.photoUrl} alt={j.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg">{j.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="font-bold text-slate-900 text-base">{j.name}</p>
                           {j.isBaptized && (
                             <span className="p-0.5 bg-cyan-100 text-cyan-600 rounded-full" title="Sudah Baptis">
                                <Droplets size={12} fill="currentColor" />
                             </span>
                           )}
                        </div>
                        <p className="text-xs text-slate-500 font-mono font-semibold">{j.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                        <Phone size={14} className="text-slate-500" />
                        {j.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                            <Baby size={14} className="text-slate-500" />
                            {j.birthDate ? (
                                <span>{j.birthPlace}, {new Date(j.birthDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</span>
                            ) : (
                                <span className="text-slate-400 italic">Data belum lengkap</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                             <Calendar size={14} className="text-slate-500" />
                             <span className="text-xs">Join: {new Date(j.joinedAt).toLocaleDateString('id-ID')}</span>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-slate-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-800 font-medium line-clamp-2 max-w-[150px]">{j.address}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(j)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Data"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(j.id, j.name)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Data"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredJemaat.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
            <Search size={48} className="mb-4 text-slate-200" />
            <p>Tidak ada jemaat ditemukan{searchTerm ? ` dengan kata kunci "${searchTerm}"` : ''} {filterBaptism !== 'ALL' ? ` pada filter "${filterBaptism === 'BAPTIZED' ? 'Sudah Baptis' : 'Belum Baptis'}"` : ''}</p>
          </div>
        )}
      </div>

      {/* Modal Form (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={closeModal} />
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-1 text-slate-900">
              {isEditing ? 'Edit Data Jemaat' : 'Tambah Jemaat Baru'}
            </h2>
            <p className="text-slate-500 text-sm mb-6">Lengkapi informasi biodata jemaat di bawah ini.</p>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center justify-center mb-6">
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-indigo-500 transition-colors"
                 >
                   {formData.photoUrl ? (
                     <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                   ) : (
                     <User size={32} className="text-slate-400" />
                   )}
                   <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={24} />
                   </div>
                 </div>
                 <p className="text-xs text-slate-500 mt-2 font-medium">Ketuk untuk upload foto</p>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nama sesuai KTP" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-900 font-medium" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">Tempat Lahir</label>
                      <input 
                          type="text" 
                          value={formData.birthPlace}
                          onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                          placeholder="Kota" 
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 font-medium" 
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">Tanggal Lahir</label>
                      <input 
                          type="date" 
                          value={formData.birthDate}
                          onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 font-medium" 
                      />
                  </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Nomor Handphone (WhatsApp)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="08xxxxxxxxxx" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-slate-900 font-medium" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Alamat Domisili</label>
                <textarea 
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Alamat lengkap..." 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none text-slate-900 font-medium"
                ></textarea>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${formData.isBaptized ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200 text-slate-500'}`}>
                          <Droplets size={20} />
                      </div>
                      <div>
                          <p className="font-bold text-slate-900 text-sm">Status Baptis Air</p>
                          <p className="text-xs text-slate-500">{formData.isBaptized ? 'Sudah dibaptis' : 'Belum dibaptis'}</p>
                      </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.isBaptized || false}
                        onChange={(e) => setFormData({...formData, isBaptized: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                  </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={cancelDelete} />
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <AlertTriangle size={32} />
             </div>
             <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Hapus Data Jemaat?</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                   Anda akan menghapus data <span className="font-bold text-slate-900 bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-100">{deleteConfirmation.name}</span>. 
                   Tindakan ini tidak dapat dibatalkan.
                </p>
             </div>
             <div className="flex gap-3">
                <button 
                   onClick={cancelDelete}
                   className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                   Batal
                </button>
                <button 
                   onClick={confirmDelete}
                   className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors"
                >
                   Hapus
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
