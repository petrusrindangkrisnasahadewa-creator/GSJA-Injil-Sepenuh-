
import React, { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { Shield, User, MapPin, Phone, Download, Calendar, Camera, Edit2, Save, X, Baby } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { Jemaat } from '../types';

const JemaatProfile: React.FC = () => {
  const context = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Jemaat>>({});

  if (!context) return null;
  const { state, setState } = context;

  if (!state.currentUser) {
    return <Navigate to="/login" />;
  }

  const user = state.currentUser;
  const churchLogo = state.churchInfo.logoUrl;

  // Sync state when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditForm(user);
    }
  }, [isEditing, user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        
        // Update both the currentUser state AND the persistent jemaatData list
        setState(prev => ({
          ...prev,
          currentUser: { ...prev.currentUser!, photoUrl: result },
          jemaatData: prev.jemaatData.map(j => 
            j.id === prev.currentUser!.id ? { ...j, photoUrl: result } : j
          )
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_GSJA_${user.name.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleSave = () => {
    if (!editForm.name || !editForm.phone) {
        alert("Nama dan Nomor Telepon tidak boleh kosong");
        return;
    }

    setState(prev => ({
        ...prev,
        currentUser: { ...prev.currentUser!, ...editForm } as Jemaat,
        jemaatData: prev.jemaatData.map(j => 
            j.id === user.id ? { ...j, ...editForm } as Jemaat : j
        )
    }));
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative">
        
        {/* Profile Header */}
        <div className="bg-red-700 h-32 relative">
            {/* Toggle Edit Button */}
            <div className="absolute top-4 right-4 z-20">
                {isEditing ? (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="bg-white/20 text-white p-2 rounded-xl backdrop-blur-md hover:bg-white/30"
                        >
                            <X size={20} />
                        </button>
                        <button 
                            onClick={handleSave}
                            className="bg-white text-red-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg"
                        >
                            <Save size={16} /> Simpan
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-white/20 text-white px-3 py-2 rounded-xl backdrop-blur-md hover:bg-white/30 flex items-center gap-2 text-xs font-bold"
                    >
                        <Edit2 size={14} /> Edit Profil
                    </button>
                )}
            </div>

          <div className="absolute -bottom-12 left-8 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg relative">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center text-white text-3xl font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
              
              {/* Camera Icon Overlay */}
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera className="text-white" size={24} />
              </div>
              
              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </div>
            <div className="absolute -bottom-6 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full shadow-sm">Ubah Foto</span>
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8 space-y-8">
          <div>
            {isEditing ? (
                <input 
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="text-2xl font-bold text-slate-900 border-b-2 border-indigo-200 focus:border-indigo-600 outline-none w-full bg-transparent pb-1"
                    placeholder="Nama Lengkap"
                />
            ) : (
                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
            )}
            <p className="text-slate-500 flex items-center gap-2 mt-1">
              <Shield size={14} className="text-red-700" />
              Anggota Jemaat Terverifikasi
            </p>
          </div>

          {/* QR Code Section */}
          {!isEditing && (
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col items-center gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
                {/* Real QR Code Implementation */}
                <div className="rounded-xl overflow-hidden">
                    <QRCodeCanvas
                    id="qr-canvas"
                    value={user.id}
                    size={200}
                    level={"H"}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    includeMargin={true}
                    imageSettings={churchLogo ? {
                        src: churchLogo,
                        x: undefined,
                        y: undefined,
                        height: 40,
                        width: 40,
                        excavate: true,
                    } : undefined}
                    />
                </div>
                </div>
                
                <div className="text-center space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID JEMAAT: {user.id}</p>
                <h3 className="font-bold text-slate-800 text-lg">QR Code Kehadiran</h3>
                <p className="text-sm text-slate-500 px-4">Tunjukkan kode ini kepada petugas penerima tamu saat tiba di gereja.</p>
                </div>

                <button 
                onClick={handleDownloadQR}
                className="flex items-center gap-2 text-red-700 font-bold text-sm bg-red-50 px-6 py-2.5 rounded-xl hover:bg-red-100 transition-colors"
                >
                <Download size={18} />
                Simpan ke Galeri
                </button>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500 mt-0.5">
                  <Phone size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase">No. Handphone</p>
                  {isEditing ? (
                      <input 
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="font-semibold text-slate-900 border-b border-indigo-200 focus:border-indigo-600 outline-none w-full bg-transparent"
                      />
                  ) : (
                      <p className="font-semibold text-slate-800">{user.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500 mt-0.5">
                  <User size={16} />
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                   <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.isBaptized ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200 text-slate-500'}`}>
                          {user.isBaptized ? 'Sudah Baptis' : 'Belum Baptis'}
                      </span>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500 mt-0.5">
                  <Baby size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase">Tempat, Tgl Lahir</p>
                  {isEditing ? (
                      <div className="flex gap-2">
                          <input 
                            type="text"
                            value={editForm.birthPlace}
                            onChange={(e) => setEditForm({...editForm, birthPlace: e.target.value})}
                            className="font-semibold text-slate-900 border-b border-indigo-200 focus:border-indigo-600 outline-none w-1/2 bg-transparent text-sm"
                            placeholder="Kota"
                          />
                           <input 
                            type="date"
                            value={editForm.birthDate}
                            onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                            className="font-semibold text-slate-900 border-b border-indigo-200 focus:border-indigo-600 outline-none w-1/2 bg-transparent text-sm"
                          />
                      </div>
                  ) : (
                      <p className="font-semibold text-slate-800">
                        {user.birthPlace || '-'}, {user.birthDate ? new Date(user.birthDate).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'}) : '-'}
                      </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase">Alamat Domisili</p>
                  {isEditing ? (
                      <textarea 
                        value={editForm.address}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                        className="font-semibold text-slate-900 border-b border-indigo-200 focus:border-indigo-600 outline-none w-full bg-transparent resize-none"
                        rows={2}
                      />
                  ) : (
                      <p className="font-semibold text-slate-800">{user.address}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500 mt-0.5">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Terdaftar Sejak</p>
                  <p className="font-semibold text-slate-800">{new Date(user.joinedAt).toLocaleDateString('id-ID', {month: 'long', year: 'numeric'})}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JemaatProfile;
