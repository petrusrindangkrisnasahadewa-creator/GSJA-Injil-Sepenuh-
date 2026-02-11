
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Heart, MessageCircle, Trash2, Send, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Notification } from '../types';

const AdminPrayers: React.FC = () => {
  const context = useContext(AppContext);
  const [commentText, setCommentText] = useState<{[key: string]: string}>({});
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  if (!context) return null;
  const { state, setState } = context;

  const ADMIN_ID = 'ADMIN';
  const ADMIN_NAME = 'Administrator';

  // Delete Prayer
  const handleDeletePrayer = (id: string) => {
    if (confirm('Hapus pokok doa ini?')) {
      setState(prev => ({
        ...prev,
        prayerData: prev.prayerData.filter(p => p.id !== id)
      }));
    }
  };

  // Delete Comment
  const handleDeleteComment = (prayerId: string, commentId: string) => {
    if (confirm('Hapus komentar ini?')) {
      setState(prev => ({
        ...prev,
        prayerData: prev.prayerData.map(p => {
          if (p.id === prayerId) {
            return {
              ...p,
              comments: p.comments.filter(c => c.id !== commentId)
            };
          }
          return p;
        })
      }));
    }
  };

  // Like Prayer
  const handleLike = (id: string) => {
    setState(prev => ({
      ...prev,
      prayerData: prev.prayerData.map(p => {
        if (p.id === id) {
          const isLiked = p.likedBy.includes(ADMIN_ID);
          return {
            ...p,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
            likedBy: isLiked 
              ? p.likedBy.filter(uid => uid !== ADMIN_ID)
              : [...p.likedBy, ADMIN_ID]
          };
        }
        return p;
      })
    }));
  };

  // Submit Comment as Admin
  const handleSubmitComment = (prayerId: string) => {
    if (!commentText[prayerId]?.trim()) return;

    const targetPrayer = state.prayerData.find(p => p.id === prayerId);

    const newComment = {
      id: `CA${Date.now()}`,
      userId: ADMIN_ID,
      userName: ADMIN_NAME,
      content: commentText[prayerId],
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      prayerData: prev.prayerData.map(p => {
        if (p.id === prayerId) {
          return {
            ...p,
            comments: [...(p.comments || []), newComment]
          };
        }
        return p;
      })
    }));

    // Notify Owner
    if (targetPrayer && targetPrayer.userId !== ADMIN_ID) {
        const newNotif: Notification = {
            id: `N-COM-ADM-${Date.now()}`,
            title: 'Respon Admin',
            message: `Admin memberikan dukungan pada doa Anda: "${newComment.content.substring(0, 20)}..."`,
            type: 'PRAYER',
            isRead: false,
            createdAt: new Date().toISOString(),
            linkTo: '/prayers',
            targetUserId: targetPrayer.userId
        };
        setState(prev => ({ ...prev, notifications: [newNotif, ...prev.notifications] }));
    }

    setCommentText(prev => ({...prev, [prayerId]: ''}));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dukungan Doa</h1>
          <p className="text-slate-500">Pantau, moderasi, dan berikan dukungan pada doa jemaat.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {state.prayerData.length > 0 ? (
          state.prayerData.map((prayer) => {
             const isLiked = prayer.likedBy.includes(ADMIN_ID);

             return (
              <div key={prayer.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                {/* Header Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                      {prayer.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{prayer.userName}</p>
                      <p className="text-xs text-slate-500">{new Date(prayer.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeletePrayer(prayer.id)}
                    className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg hover:bg-red-50 transition-colors"
                    title="Hapus Doa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Content */}
                <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-50 text-slate-800 text-lg leading-relaxed font-medium mb-4">
                  "{prayer.content}"
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex gap-3">
                        <button 
                            onClick={() => handleLike(prayer.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${isLiked ? 'bg-pink-50 text-pink-600' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                            {prayer.likes} Amin
                        </button>
                        <button 
                            onClick={() => setActiveCommentId(activeCommentId === prayer.id ? null : prayer.id)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                        >
                            <MessageCircle size={18} />
                            {prayer.comments.length} Dukungan
                        </button>
                    </div>
                </div>

                {/* Comment Section (Collapsible) */}
                {(activeCommentId === prayer.id || prayer.comments.length > 0) && (
                    <div className="mt-4 space-y-4 pt-4 border-t border-slate-50">
                        {/* List */}
                        <div className="space-y-3 pl-4 border-l-2 border-indigo-100">
                             {prayer.comments.map(c => (
                                 <div key={c.id} className="flex gap-2 group/comment">
                                     <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${c.userId === ADMIN_ID ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        {c.userId === ADMIN_ID ? <ShieldCheck size={12} /> : <span className="text-[10px] font-bold">{c.userName.charAt(0)}</span>}
                                     </div>
                                     <div className="flex-1">
                                        <div className={`p-2 rounded-xl text-sm ${c.userId === ADMIN_ID ? 'bg-indigo-600 text-white rounded-tl-none' : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                                            <span className={`font-bold block text-xs mb-0.5 ${c.userId === ADMIN_ID ? 'text-indigo-200' : 'text-slate-900'}`}>{c.userName}</span>
                                            {c.content}
                                        </div>
                                     </div>
                                     <button 
                                        onClick={() => handleDeleteComment(prayer.id, c.id)}
                                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition-opacity self-center"
                                     >
                                         <X size={14} />
                                     </button>
                                 </div>
                             ))}
                        </div>

                        {/* Input */}
                        <div className="flex gap-2">
                             <input 
                                type="text"
                                value={commentText[prayer.id] || ''}
                                onChange={(e) => setCommentText({...commentText, [prayer.id]: e.target.value})}
                                placeholder="Berikan dukungan sebagai Admin..."
                                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(prayer.id)}
                             />
                             <button 
                                onClick={() => handleSubmitComment(prayer.id)}
                                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
                             >
                                <Send size={16} />
                             </button>
                        </div>
                    </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4">
             <div className="p-6 bg-slate-50 rounded-full text-slate-300">
               <Sparkles size={48} />
             </div>
             <p className="text-slate-400 font-medium">Belum ada pokok doa dari jemaat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPrayers;
