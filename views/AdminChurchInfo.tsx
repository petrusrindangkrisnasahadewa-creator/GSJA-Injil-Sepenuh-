import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../App';
import { Save, Upload, Plus, Trash2, MapPin, Phone, Users, Image as ImageIcon, Layout, X, User, Camera, Check, Edit2, AlertTriangle } from 'lucide-react';
import { SlideshowImage, Pastor } from '../types';

const AdminChurchInfo: React.FC = () => {
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'general' | 'vision' | 'slideshow' | 'pastors'>('general');
  
  // Slide States
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideshowImage | null>(null);
  
  // Delete Confirmation State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{isOpen: boolean, id: string}>({
    isOpen: false,
    id: ''
  });
  
  // Pastor States
  const [isAddingPastor, setIsAddingPastor] = useState(false);
  const [editingPastorId, setEditingPastorId] = useState<string | null>(null);
  
  // Toast State
  const [toast, setToast] = useState<{show: boolean, message: string}>({ show: false, message: '' });

  // Temporary states for uploads
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [newSlideCaption, setNewSlideCaption] = useState('');
  
  const [newPastorName, setNewPastorName] = useState('');
  const [newPastorRole, setNewPastorRole] = useState('');
  const [newPastorPhoto, setNewPastorPhoto] = useState('');

  const slideFileRef = useRef<HTMLInputElement>(null);
  const pastorFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);

  if (!context) return null;
  const { state, setState } = context;

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // Generic File Handler
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // Increased limit to 10MB to support high-res phone camera photos
      if (file.size > 10 * 1024 * 1024) { 
          alert("Ukuran file terlalu besar. Maksimal 10MB."); 
          return; 
      }
      const reader = new FileReader();
      reader.onloadend = () => setUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // General Info Handlers
  const handleInfoChange = (field: string, value: string) => {
    setState(prev => ({
      ...prev,
      churchInfo: { ...prev.churchInfo, [field]: value }
    }));
  };

  // --- SLIDESHOW HANDLERS ---
  const addSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideUrl) return;
    const newSlide: SlideshowImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: newSlideUrl,
        caption: newSlideCaption || 'Tanpa Keterangan'
    };
    setState(prev => ({ ...prev, slideshowData: [...prev.slideshowData, newSlide] }));
    setNewSlideUrl(''); setNewSlideCaption(''); setIsAddingSlide(false);
    showToast("Banner berhasil ditambahkan");
  };

  const handleUpdateSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    setState(prev => ({
        ...prev,
        slideshowData: prev.slideshowData.map(s => 
            s.id === editingSlide.id ? { ...s, caption: editingSlide.caption } : s
        )
    }));
    setEditingSlide(null);
    showToast("Keterangan banner berhasil diperbarui");
  };

  const requestDeleteSlide = (id: string) => {
    setDeleteConfirmation({ isOpen: true, id });
  };

  const confirmDeleteSlide = () => {
    setState(prev => ({ 
        ...prev, 
        slideshowData: prev.slideshowData.filter(s => s.id !== deleteConfirmation.id) 
    }));
    setDeleteConfirmation({ isOpen: false, id: '' });
    showToast("Banner berhasil dihapus");
  };

  // --- PASTOR HANDLERS ---
  const handleEditPastor = (pastor: Pastor) => {
    setNewPastorName(pastor.name);
    setNewPastorRole(pastor.role);
    setNewPastorPhoto(pastor.photoUrl);
    setEditingPastorId(pastor.id);
    setIsAddingPastor(true);
  };

  const handleSavePastor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPastorName || !newPastorRole) return;

    if (editingPastorId) {
      // Update Existing
      setState(prev => ({
        ...prev,
        pastoralTeam: prev.pastoralTeam.map(p => p.id === editingPastorId ? {
          ...p,
          name: newPastorName,
          role: newPastorRole,
          photoUrl: newPastorPhoto || p.photoUrl
        } : p)
      }));
      showToast("Data staff berhasil diperbarui");
    } else {
      // Add New
      const newPastor: Pastor = {
          id: Math.random().toString(36).substr(2, 9),
          name: newPastorName,
          role: newPastorRole,
          photoUrl: newPastorPhoto || 'https://via.placeholder.com/150'
      };
      setState(prev => ({ ...prev, pastoralTeam: [...prev.pastoralTeam, newPastor] }));
      showToast("Staff berhasil ditambahkan");
    }

    resetPastorForm();
  };

  const resetPastorForm = () => {
    setNewPastorName(''); 
    setNewPastorRole(''); 
    setNewPastorPhoto(''); 
    setEditingPastorId(null);
    setIsAddingPastor(false);
  };

  const removePastor = (id: string) => {
    if(confirm('Hapus staff ini?')) {
        setState(prev => ({ ...prev, pastoralTeam: prev.pastoralTeam.filter(p => p.id !== id) }));
        if (editingPastorId === id) resetPastorForm();
        showToast("Staff berhasil dihapus");
    }
  };

  return (
    <div className="space-y-6 pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Informasi Gereja</h1>
          <p className="text-slate-500">Kelola profil, banner, visi misi, dan staff gereja.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {[
          { id: 'general', label: 'Identitas & Kontak', icon: Layout },
          { id: 'vision', label: 'Visi & Misi', icon: MapPin },
          { id: 'slideshow', label: 'Banner Foto', icon: ImageIcon },
          { id: 'pastors', label: 'Staff Pastoral', icon: Users },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm min-h-[500px]">
        
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-3xl">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Profil & Kontak</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Logo Gereja</label>
                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm relative group cursor-pointer" onClick={() => logoFileRef.current?.click()}>
                      {state.churchInfo.logoUrl ? (
                        <img src={state.churchInfo.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Layout className="text-slate-300" size={32} />
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Camera className="text-white" />
                      </div>
                   </div>
                   <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-2">Ditampilkan di halaman login dan header aplikasi.</p>
                      <button 
                        onClick={() => logoFileRef.current?.click()}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-200 transition-colors"
                      >
                        Ganti Logo
                      </button>
                      <input type="file" ref={logoFileRef} className="hidden" accept="image/*" onChange={(e) => handleFile(e, (url) => handleInfoChange('logoUrl', url))} />
                   </div>
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Nama Gereja</label>
                 <input 
                   type="text" 
                   value={state.churchInfo.name} 
                   onChange={(e) => handleInfoChange('name', e.target.value)}
                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Nomor WhatsApp Sekretariat</label>
                 <div className="relative">
                   <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                   <input 
                     type="text" 
                     value={state.churchInfo.whatsapp} 
                     onChange={(e) => handleInfoChange('whatsapp', e.target.value)}
                     className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                     placeholder="628xxxxxxxx"
                   />
                 </div>
               </div>
               
               <div className="space-y-2 md:col-span-2">
                 <label className="text-sm font-bold text-slate-700">Alamat Lengkap</label>
                 <textarea 
                   rows={2}
                   value={state.churchInfo.address} 
                   onChange={(e) => handleInfoChange('address', e.target.value)}
                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none text-slate-900"
                 />
               </div>

               <div className="space-y-2 md:col-span-2">
                 <label className="text-sm font-bold text-slate-700">Link Google Map (Embed URL)</label>
                 <input 
                   type="text" 
                   value={state.churchInfo.mapEmbedUrl} 
                   onChange={(e) => handleInfoChange('mapEmbedUrl', e.target.value)}
                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                   placeholder="https://www.google.com/maps/embed?..."
                 />
                 <p className="text-xs text-slate-400">Copy 'Embed a map' link from Google Maps.</p>
               </div>
            </div>
            <div className="pt-4">
              <button 
                onClick={() => showToast("Profil Gereja berhasil disimpan!")}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800"
              >
                <Save size={18} /> Simpan Profil
              </button>
            </div>
          </div>
        )}

        {/* VISION MISI TAB */}
        {activeTab === 'vision' && (
          <div className="space-y-6 max-w-3xl">
             <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Visi & Misi</h3>
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Visi</label>
                   <textarea 
                     rows={3}
                     value={state.churchInfo.vision} 
                     onChange={(e) => handleInfoChange('vision', e.target.value)}
                     className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700">Misi</label>
                   <textarea 
                     rows={6}
                     value={state.churchInfo.mission} 
                     onChange={(e) => handleInfoChange('mission', e.target.value)}
                     className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900"
                   />
                </div>
                <button 
                  onClick={() => showToast("Visi & Misi berhasil disimpan!")}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800"
                >
                   <Save size={18} /> Simpan Perubahan
                </button>
             </div>
          </div>
        )}

        {/* SLIDESHOW TAB */}
        {activeTab === 'slideshow' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center mb-4">
               <div>
                  <h3 className="text-lg font-bold text-slate-900">Banner Foto</h3>
                  <p className="text-sm text-slate-500">Ditampilkan di Halaman Login & Dashboard</p>
               </div>
               <button 
                 onClick={() => setIsAddingSlide(true)}
                 disabled={state.slideshowData.length >= 5}
                 className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
               >
                 <Plus size={16} /> Tambah
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {state.slideshowData.map((slide, index) => (
                  <div key={slide.id} className="group relative bg-slate-100 rounded-2xl overflow-hidden shadow-sm aspect-video">
                    <img src={slide.url} alt={slide.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                       <p className="text-white font-bold truncate">{slide.caption}</p>
                       <div className="flex gap-2 mt-2">
                          <button 
                            onClick={() => setEditingSlide(slide)}
                            className="bg-white/20 hover:bg-white text-white hover:text-indigo-600 p-2 rounded-lg backdrop-blur-sm transition-colors"
                            title="Edit Keterangan"
                          >
                             <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => requestDeleteSlide(slide.id)}
                            className="bg-white/20 hover:bg-red-600 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                            title="Hapus Banner"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
             </div>

             {/* Modal Add Slide */}
             {isAddingSlide && (
               <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddingSlide(false)} />
                  <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                     <h3 className="font-bold text-lg mb-4 text-slate-900">Tambah Banner Baru</h3>
                     <form onSubmit={addSlide} className="space-y-4">
                        <div 
                          onClick={() => slideFileRef.current?.click()}
                          className="w-full h-40 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                           {newSlideUrl ? (
                              <img src={newSlideUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                           ) : (
                              <div className="flex flex-col items-center text-slate-400">
                                 <div className="p-3 bg-white rounded-full shadow-sm mb-2">
                                    <Upload size={24} className="text-indigo-500" />
                                 </div>
                                 <span className="text-sm font-bold text-slate-600">Klik untuk Upload Foto</span>
                                 <span className="text-xs text-slate-400">(Dari Galeri / Kamera)</span>
                              </div>
                           )}
                           <input type="file" ref={slideFileRef} className="hidden" accept="image/*" onChange={(e) => handleFile(e, setNewSlideUrl)} />
                        </div>
                        <div>
                           <label className="text-sm font-bold text-slate-700">Keterangan</label>
                           <input 
                             type="text" 
                             value={newSlideCaption} 
                             onChange={(e) => setNewSlideCaption(e.target.value)} 
                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                             placeholder="Contoh: Ibadah Natal 2024"
                           />
                        </div>
                        <div className="flex gap-2">
                           <button type="button" onClick={() => setIsAddingSlide(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Batal</button>
                           <button type="submit" disabled={!newSlideUrl} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl disabled:opacity-50">Simpan</button>
                        </div>
                     </form>
                  </div>
               </div>
             )}

             {/* Modal Edit Slide */}
             {editingSlide && (
               <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingSlide(null)} />
                  <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                     <h3 className="font-bold text-lg mb-4 text-slate-900">Edit Keterangan Banner</h3>
                     <form onSubmit={handleUpdateSlide} className="space-y-4">
                        <div className="w-full h-40 rounded-xl bg-slate-100 overflow-hidden">
                           <img src={editingSlide.url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <label className="text-sm font-bold text-slate-700">Keterangan</label>
                           <input 
                             type="text" 
                             value={editingSlide.caption} 
                             onChange={(e) => setEditingSlide({...editingSlide, caption: e.target.value})} 
                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                           />
                        </div>
                        <div className="flex gap-2">
                           <button type="button" onClick={() => setEditingSlide(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Batal</button>
                           <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl">Simpan Perubahan</button>
                        </div>
                     </form>
                  </div>
               </div>
             )}

             {/* Modal Confirm Delete */}
             {deleteConfirmation.isOpen && (
               <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                 <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setDeleteConfirmation({isOpen: false, id: ''})} />
                 <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                       <AlertTriangle size={32} />
                    </div>
                    <div className="text-center mb-6">
                       <h3 className="text-xl font-bold text-slate-900">Hapus Banner Foto?</h3>
                       <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                          Tindakan ini akan menghapus foto dari slideshow. Data yang dihapus tidak dapat dikembalikan.
                       </p>
                    </div>
                    <div className="flex gap-3">
                       <button 
                          onClick={() => setDeleteConfirmation({isOpen: false, id: ''})}
                          className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                       >
                          Batal
                       </button>
                       <button 
                          onClick={confirmDeleteSlide}
                          className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors"
                       >
                          Hapus
                       </button>
                    </div>
                 </div>
               </div>
             )}
          </div>
        )}

        {/* PASTORS TAB */}
        {activeTab === 'pastors' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center mb-4">
               <div>
                  <h3 className="text-lg font-bold text-slate-900">Staff Pastoral</h3>
                  <p className="text-sm text-slate-500">Daftar hamba Tuhan yang melayani</p>
               </div>
               <button 
                 onClick={() => setIsAddingPastor(true)}
                 className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
               >
                 <Plus size={16} /> Tambah Staff
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.pastoralTeam.map(pastor => (
                  <div key={pastor.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                     <div className="w-16 h-16 rounded-full bg-white overflow-hidden shadow-sm shrink-0">
                       <img src={pastor.photoUrl} alt={pastor.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{pastor.name}</h4>
                        <p className="text-xs text-indigo-600 font-bold uppercase">{pastor.role}</p>
                     </div>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleEditPastor(pastor)} className="p-2 bg-white text-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50"><Edit2 size={16}/></button>
                         <button onClick={() => removePastor(pastor.id)} className="p-2 bg-white text-red-600 rounded-lg shadow-sm hover:bg-red-50"><Trash2 size={16}/></button>
                     </div>
                  </div>
                ))}
             </div>

             {/* Modal Add/Edit Pastor */}
             {isAddingPastor && (
               <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={resetPastorForm} />
                  <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                     <h3 className="font-bold text-lg mb-4 text-slate-900">{editingPastorId ? 'Edit Data Staff' : 'Tambah Staff Baru'}</h3>
                     <form onSubmit={handleSavePastor} className="space-y-4">
                        <div className="flex justify-center mb-4">
                           <div 
                             onClick={() => pastorFileRef.current?.click()}
                             className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden relative group"
                           >
                              {newPastorPhoto ? (
                                <img src={newPastorPhoto} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <User className="text-slate-400" size={32} />
                              )}
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Camera className="text-white" size={20} />
                              </div>
                              <input type="file" ref={pastorFileRef} className="hidden" accept="image/*" onChange={(e) => handleFile(e, setNewPastorPhoto)} />
                           </div>
                        </div>
                        <div>
                           <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
                           <input 
                             type="text" 
                             required
                             value={newPastorName} 
                             onChange={(e) => setNewPastorName(e.target.value)} 
                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                           />
                        </div>
                        <div>
                           <label className="text-sm font-bold text-slate-700">Jabatan / Peran</label>
                           <input 
                             type="text" 
                             required
                             value={newPastorRole} 
                             onChange={(e) => setNewPastorRole(e.target.value)} 
                             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                           />
                        </div>
                        <div className="flex gap-2 pt-2">
                           <button type="button" onClick={resetPastorForm} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Batal</button>
                           <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl">Simpan Data</button>
                        </div>
                     </form>
                  </div>
               </div>
             )}
          </div>
        )}

      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-900 text-white rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300 z-[70]">
          <div className="bg-emerald-500 p-1 rounded-full">
             <Check size={14} />
          </div>
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminChurchInfo;
