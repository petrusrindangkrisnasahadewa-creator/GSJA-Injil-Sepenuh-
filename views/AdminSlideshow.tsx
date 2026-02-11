
import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../App';
import { Plus, Trash2, Image as ImageIcon, Upload, Save, X } from 'lucide-react';
import { SlideshowImage } from '../types';

const AdminSlideshow: React.FC = () => {
  const context = useContext(AppContext);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!context) return null;
  const { state, setState } = context;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB for browser performance)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) return;

    if (state.slideshowData.length >= 5) {
      alert("Maksimal 5 foto dalam slideshow. Hapus foto lama untuk menambahkan yang baru.");
      return;
    }

    const newImage: SlideshowImage = {
      id: Math.random().toString(36).substr(2, 9),
      url: newImageUrl,
      caption: newImageCaption || 'Tanpa Keterangan'
    };

    setState(prev => ({
      ...prev,
      slideshowData: [...prev.slideshowData, newImage]
    }));

    setNewImageUrl('');
    setNewImageCaption('');
    setIsAdding(false);
  };

  const removeImage = (id: string) => {
    if (confirm('Hapus foto ini dari slideshow?')) {
      setState(prev => ({
        ...prev,
        slideshowData: prev.slideshowData.filter(img => img.id !== id)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Background Slideshow</h1>
          <p className="text-slate-500">Atur foto background halaman utama aplikasi (Maks. 5 Foto).</p>
        </div>
        
        {state.slideshowData.length < 5 ? (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus size={20} /> Tambah Foto
          </button>
        ) : (
          <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold border border-amber-200">
            Slot Penuh (5/5)
          </div>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-top duration-300">
          <h3 className="font-bold text-lg mb-4 text-slate-900">Upload Foto Baru</h3>
          <form onSubmit={handleAddImage} className="space-y-4">
            
            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">File Gambar</label>
              
              {!newImageUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-100 transition-colors group"
                >
                  <div className="p-4 bg-white rounded-full shadow-sm text-indigo-500 mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <p className="text-indigo-600 font-bold text-sm">Klik untuk upload dari Galeri</p>
                  <p className="text-indigo-400 text-xs mt-1">Maksimal 2MB (JPG/PNG)</p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => { setNewImageUrl(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="absolute top-2 right-2 p-2 bg-white/90 text-red-600 rounded-full shadow-sm hover:bg-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Keterangan (Caption)</label>
              <input 
                type="text" 
                value={newImageCaption}
                onChange={(e) => setNewImageCaption(e.target.value)}
                placeholder="Contoh: Suasana Ibadah Natal"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => { setIsAdding(false); setNewImageUrl(''); }}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                disabled={!newImageUrl}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} /> Simpan Foto
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.slideshowData.map((img, index) => (
          <div key={img.id} className="group relative aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <img 
              src={img.url} 
              alt={img.caption} 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <p className="text-white font-bold truncate">{img.caption}</p>
              <p className="text-white/60 text-xs">Slide #{index + 1}</p>
            </div>
            <button 
              onClick={() => removeImage(img.id)}
              className="absolute top-4 right-4 p-2 bg-white/90 text-red-600 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              title="Hapus Foto"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        {state.slideshowData.length === 0 && (
          <div className="col-span-full py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <ImageIcon size={48} className="mb-4 opacity-50" />
            <p className="font-medium">Belum ada foto background.</p>
            <p className="text-sm">Klik "Tambah Foto" untuk upload gambar dari galeri HP/PC.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSlideshow;
