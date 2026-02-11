
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Plus, Edit2, Trash2, BookOpen, Clock, User, Heart, MessageCircle, X, Send, ShieldCheck, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Renungan, Notification } from '../types';

const AdminRenungan: React.FC = () => {
  const context = useContext(AppContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRenungan, setSelectedRenungan] = useState<Renungan | null>(null);
  const [commentText, setCommentText] = useState('');
  
  // Toast State
  const [toast, setToast] = useState<{show: boolean, message: string}>({ show: false, message: '' });
  
  // New State for Form
  const [newRenungan, setNewRenungan] = useState<Partial<Renungan>>({
     title: '', verse: '', content: '', author: '', imageUrl: '', date: new Date().toISOString().split('T')[0]
  });

  if (!context) return null;
  const { state, setState } = context;

  const ADMIN_ID = 'ADMIN';
  const ADMIN_NAME = 'Administrator';

  // --- Logic Hapus Renungan ---
  const removeRenungan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm('Hapus renungan ini?')) {
      setState(prev => ({
        ...prev,
        renunganData: prev.renunganData.filter(r => r.id !== id)
      }));
      if (selectedRenungan?.id === id) setSelectedRenungan(null);
    }
  };

  // --- Logic Like ---
  const handleLike = (id: string) => {
    setState(prev => ({
      ...prev,
      renunganData: prev.renunganData.map(r => {
        if (r.id === id) {
          const isLiked = r.likedBy.includes(ADMIN_ID);
          const updatedRenungan = {
            ...r,
            likes: isLiked ? r.likes - 1 : r.likes + 1,
            likedBy: isLiked 
              ? r.likedBy.filter(uid => uid !== ADMIN_ID)
              : [...r.likedBy, ADMIN_ID]
          };
          if (selectedRenungan?.id === id) setSelectedRenungan(updatedRenungan);
          return updatedRenungan;
        }
        return r;
      })
    }));
  };

  // --- Logic Kirim Komentar (Respon Admin) ---
  const handleSubmitComment = (renunganId: string) => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: ADMIN_ID,
      userName: ADMIN_NAME,
      content: commentText,
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      renunganData: prev.renunganData.map(r => {
        if (r.id === renunganId) {
          const updatedRenungan = {
            ...r,
            comments: [...(r.comments || []), newComment]
          };
          if (selectedRenungan?.id === renunganId) setSelectedRenungan(updatedRenungan);
          return updatedRenungan;
        }
        return r;
      })
    }));

    setCommentText('');
  };

  // --- Logic Hapus Komentar (Moderasi) ---
  const handleDeleteComment = (renunganId: string, commentId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return;

    setState(prev => ({
      ...prev,
      renunganData: prev.renunganData.map(r => {
        if (r.id === renunganId) {
          const updatedRenungan = {
            ...r,
            comments: r.comments.filter(c => c.id !== commentId)
          };
          if (selectedRenungan?.id === renunganId) setSelectedRenungan(updatedRenungan);
          return updatedRenungan;
        }
        return r;
      })
    }));
  };

  const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      const renunganToAdd: Renungan = {
          id: `R${Math.random().toString(36).substr(2, 9)}`,
          title: newRenungan.title!,
          verse: newRenungan.verse!,
          content: newRenungan.content!,
          author: newRenungan.author!,
          date: newRenungan.date!,
          imageUrl: newRenungan.imageUrl,
          likes: 0,
          likedBy: [],
          comments: []
      };

      // Create Notification for all users (Broadcast)
      const newNotif: Notification = {
        id: `N-REN-${Date.now()}`,
        title: 'Renungan Baru',
        message: `Renungan hari ini: "${renunganToAdd.title}" telah terbit.`,
        type: 'RENUNGAN',
        isRead: false,
        createdAt: new Date().toISOString(),
        linkTo: '/devotional'
      };

      setState(prev => ({ 
          ...prev, 
          renunganData: [renunganToAdd, ...prev.renunganData],
          notifications: [newNotif, ...prev.notifications]
      }));
      
      setShowAddModal(false);
      setNewRenungan({ title: '', verse: '', content: '', author: '', imageUrl: '', date: new Date().toISOString().split('T')[0] });
      
      // Trigger Toast
      setToast({ show: true, message: 'Renungan berhasil dipublikasikan!' });
      setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 3000);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Renungan</h1>
          <p className="text-slate-500">Tulis, edit, dan responi renungan harian.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus size={20} />
          Renungan Baru
        </button>
      </div>

      {/* LIST RENUNGAN */}
      <div className="space-y-4">
        {state.renunganData.map((r) => (
          <div 
            key={r.id} 
            onClick={() => setSelectedRenungan(r)}
            className="bg-white rounded-3xl p-4 md:p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 group cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all items-start"
          >
            {/* Thumbnail */}
            <div className="w-full md:w-32 h-32 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
               {r.imageUrl ? (
                  <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={32} /></div>
               )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(r.date).toLocaleDateString('id-ID')}</span>
                <span className="flex items-center gap-1.5"><User size={14} /> {r.author}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{r.title}</h3>
                <p className="text-indigo-700 font-bold italic text-sm mt-1">{r.verse}</p>
              </div>
              <p className="text-slate-800 line-clamp-2 text-sm leading-relaxed font-medium">"{r.content}"</p>
              
              {/* Engagement Stats */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-50 mt-2">
                 <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${r.likedBy.includes(ADMIN_ID) ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Heart size={14} fill={r.likedBy.includes(ADMIN_ID) ? "currentColor" : "none"} /> {r.likes || 0}
                 </div>
                 <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg">
                    <MessageCircle size={14} /> {r.comments?.length || 0} Komentar
                 </div>
              </div>
            </div>
            
            <div className="flex md:flex-col justify-end gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
               <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" onClick={(e) => e.stopPropagation()}>
                 <Edit2 size={20} />
               </button>
               <button 
                 onClick={(e) => removeRenungan(r.id, e)}
                 className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
               >
                 <Trash2 size={20} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL VIEW & RESPOND */}
      {selectedRenungan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedRenungan(null)} />
          <div className="bg-white rounded-3xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
               <div>
                  <h2 className="text-xl font-bold text-slate-900">Detail Renungan</h2>
                  <p className="text-sm text-slate-500">Lihat interaksi dan berikan respon</p>
               </div>
               <button onClick={() => setSelectedRenungan(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                  <X size={24} />
               </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
               {/* Hero Image in Modal */}
               {selectedRenungan.imageUrl && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 shadow-md">
                     <img src={selectedRenungan.imageUrl} className="w-full h-full object-cover" alt="Cover" />
                  </div>
               )}

               {/* Content */}
               <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900">{selectedRenungan.title}</h3>
                  <div className="p-4 bg-indigo-50 border-l-4 border-indigo-600 rounded-r-xl">
                      <p className="text-indigo-900 font-bold italic">"{selectedRenungan.verse}"</p>
                  </div>
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedRenungan.content}
                  </div>
                  
                  {/* Admin Actions (Like) */}
                  <div className="flex items-center gap-4 py-4 border-y border-slate-100">
                      <button 
                        onClick={() => handleLike(selectedRenungan.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${selectedRenungan.likedBy.includes(ADMIN_ID) ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                         <Heart size={20} fill={selectedRenungan.likedBy.includes(ADMIN_ID) ? "currentColor" : "none"} />
                         {selectedRenungan.likedBy.includes(ADMIN_ID) ? 'Disukai' : 'Suka'} ({selectedRenungan.likes})
                      </button>
                  </div>
               </div>

               {/* Comments Section */}
               <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <MessageCircle size={18} /> Komentar ({selectedRenungan.comments?.length || 0})
                  </h4>
                  
                  <div className="space-y-4">
                    {selectedRenungan.comments && selectedRenungan.comments.length > 0 ? (
                        selectedRenungan.comments.map((comment) => (
                            <div key={comment.id} className={`flex gap-3 group/comment ${comment.userId === ADMIN_ID ? 'flex-row-reverse' : ''}`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${comment.userId === ADMIN_ID ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                    {comment.userId === ADMIN_ID ? <ShieldCheck size={14} /> : comment.userName.charAt(0)}
                                </div>
                                
                                {/* Bubble */}
                                <div className={`max-w-[80%] flex flex-col ${comment.userId === ADMIN_ID ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-3 rounded-2xl text-sm shadow-sm ${comment.userId === ADMIN_ID ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-50 border border-slate-100 rounded-tl-none'}`}>
                                        <div className={`flex justify-between items-baseline mb-1 gap-4 ${comment.userId === ADMIN_ID ? 'flex-row-reverse' : ''}`}>
                                            <span className={`font-bold ${comment.userId === ADMIN_ID ? 'text-indigo-100' : 'text-slate-900'}`}>{comment.userName}</span>
                                        </div>
                                        <p className={`leading-relaxed ${comment.userId === ADMIN_ID ? 'text-white' : 'text-slate-700'}`}>{comment.content}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 px-1">
                                       <span className="text-[10px] text-slate-400 font-medium">
                                          {new Date(comment.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                       </span>
                                       
                                       {/* Delete Comment Button (Moderation) */}
                                       <button 
                                          onClick={() => handleDeleteComment(selectedRenungan.id, comment.id)}
                                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition-opacity"
                                          title="Hapus Komentar"
                                       >
                                          <X size={12} />
                                       </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                            <MessageCircle className="mx-auto text-slate-300 mb-2" size={24} />
                            <p className="text-slate-400 italic text-sm">Belum ada komentar dari jemaat.</p>
                        </div>
                    )}
                  </div>
               </div>
            </div>

            {/* Modal Footer (Input) */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
               <div className="flex gap-2 relative">
                  <input 
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Tulis balasan sebagai Admin..."
                      className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium shadow-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmitComment(selectedRenungan.id);
                      }}
                  />
                  <button 
                      onClick={() => handleSubmitComment(selectedRenungan.id)}
                      disabled={!commentText}
                      className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md"
                  >
                      <Send size={18} />
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADD NEW RENUNGAN */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900">
               <BookOpen className="text-indigo-600" /> Tulis Renungan Baru
            </h2>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">URL Gambar Sampul (Opsional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={newRenungan.imageUrl}
                    onChange={e => setNewRenungan({...newRenungan, imageUrl: e.target.value})}
                    placeholder="https://..." 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">Judul Renungan</label>
                  <input required type="text" value={newRenungan.title} onChange={e => setNewRenungan({...newRenungan, title: e.target.value})} placeholder="Masukkan judul..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">Ayat Alkitab</label>
                  <input required type="text" value={newRenungan.verse} onChange={e => setNewRenungan({...newRenungan, verse: e.target.value})} placeholder="Contoh: Yohanes 3:16" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">Penulis</label>
                  <input required type="text" value={newRenungan.author} onChange={e => setNewRenungan({...newRenungan, author: e.target.value})} placeholder="Nama penulis..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">Tanggal Publikasi</label>
                  <input required type="date" value={newRenungan.date} onChange={e => setNewRenungan({...newRenungan, date: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Isi Renungan</label>
                <textarea required value={newRenungan.content} onChange={e => setNewRenungan({...newRenungan, content: e.target.value})} rows={8} placeholder="Tuliskan isi renungan di sini..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-slate-900"></textarea>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button type="submit" className="flex-[2] py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                  Publikasikan Renungan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS TOAST */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-900 text-white rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300 z-[70]">
          <div className="bg-emerald-500 p-1 rounded-full">
             <CheckCircle size={14} />
          </div>
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminRenungan;
