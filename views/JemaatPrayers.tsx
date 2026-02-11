
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Send, Heart, MessageCircle, User, Sparkles } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { Notification } from '../types';

const JemaatPrayers: React.FC = () => {
  const context = useContext(AppContext);
  const [newPrayer, setNewPrayer] = useState('');
  const [commentText, setCommentText] = useState<{[key: string]: string}>({});
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  if (!context) return null;
  const { state, setState } = context;

  if (!state.currentUser) return <Navigate to="/login" />;
  const currentUser = state.currentUser;

  // Submit Prayer
  const handleSubmitPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;

    const prayer = {
      id: `P${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      content: newPrayer,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      comments: []
    };

    setState(prev => ({
      ...prev,
      prayerData: [prayer, ...prev.prayerData]
    }));
    setNewPrayer('');
  };

  // Handle Like
  const handleLike = (id: string) => {
    let targetOwnerId = '';
    
    setState(prev => ({
      ...prev,
      prayerData: prev.prayerData.map(p => {
        if (p.id === id) {
          targetOwnerId = p.userId; // Capture owner ID
          const isLiked = p.likedBy.includes(currentUser.id);
          return {
            ...p,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
            likedBy: isLiked 
              ? p.likedBy.filter(uid => uid !== currentUser.id)
              : [...p.likedBy, currentUser.id]
          };
        }
        return p;
      })
    }));

    // Trigger Notification only if liking (not unliking) and not self-like
    const isAlreadyLiked = state.prayerData.find(p => p.id === id)?.likedBy.includes(currentUser.id);
    if (!isAlreadyLiked && targetOwnerId && targetOwnerId !== currentUser.id && targetOwnerId !== 'ADMIN') {
        const newNotif: Notification = {
            id: `N-LIKE-${Date.now()}`,
            title: 'Dukungan Doa',
            message: `${currentUser.name} mendoakan (Amin) pokok doa Anda.`,
            type: 'PRAYER',
            isRead: false,
            createdAt: new Date().toISOString(),
            linkTo: '/prayers',
            targetUserId: targetOwnerId
        };
        setState(prev => ({ ...prev, notifications: [newNotif, ...prev.notifications] }));
    }
  };

  // Submit Comment
  const handleSubmitComment = (prayerId: string) => {
    if (!commentText[prayerId]?.trim()) return;
    
    const targetPrayer = state.prayerData.find(p => p.id === prayerId);

    const newComment = {
      id: `C${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
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

    // Notify Owner if not self-comment
    if (targetPrayer && targetPrayer.userId !== currentUser.id && targetPrayer.userId !== 'ADMIN') {
        const newNotif: Notification = {
            id: `N-COM-${Date.now()}`,
            title: 'Dukungan Doa Baru',
            message: `${currentUser.name} memberikan dukungan pada doa Anda: "${newComment.content.substring(0, 20)}..."`,
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
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Dukungan Doa</h1>
        <p className="text-slate-500">Saling mendoakan dan menguatkan satu sama lain.</p>
      </div>

      {/* Input Box */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-indigo-50">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0 overflow-hidden">
             {currentUser.photoUrl ? (
                <img src={currentUser.photoUrl} className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">{currentUser.name.charAt(0)}</div>
             )}
          </div>
          <div className="flex-1 space-y-3">
             <textarea 
                value={newPrayer}
                onChange={(e) => setNewPrayer(e.target.value)}
                placeholder="Tulis pokok doa Anda di sini..."
                className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none text-slate-900"
             />
             <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-medium">Doa Anda akan dilihat oleh jemaat lain.</span>
                <button 
                  onClick={handleSubmitPrayer}
                  disabled={!newPrayer.trim()}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                   <Send size={16} /> Kirim Doa
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {state.prayerData.map(prayer => {
           const isLiked = prayer.likedBy.includes(currentUser.id);
           
           return (
             <div key={prayer.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                      {prayer.userName.charAt(0)}
                   </div>
                   <div>
                      <p className="font-bold text-slate-900">{prayer.userName}</p>
                      <p className="text-xs text-slate-400">{new Date(prayer.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                   </div>
                </div>

                {/* Content */}
                <div className="mb-4 text-slate-800 leading-relaxed font-medium">
                   {prayer.content}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                   <button 
                      onClick={() => handleLike(prayer.id)}
                      className={`flex items-center gap-2 text-sm font-bold transition-colors ${isLiked ? 'text-pink-600' : 'text-slate-400 hover:text-pink-600'}`}
                   >
                      <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                      {prayer.likes > 0 ? `${prayer.likes} Amin` : 'Amin'}
                   </button>
                   <button 
                      onClick={() => setActiveCommentId(activeCommentId === prayer.id ? null : prayer.id)}
                      className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                   >
                      <MessageCircle size={18} />
                      {prayer.comments.length > 0 ? `${prayer.comments.length} Dukungan` : 'Dukung'}
                   </button>
                </div>

                {/* Comments Section */}
                {(activeCommentId === prayer.id || prayer.comments.length > 0) && (
                   <div className="mt-4 pt-4 bg-slate-50 rounded-2xl p-4 space-y-4">
                      {/* List Comments */}
                      {prayer.comments.map(c => (
                         <div key={c.id} className="flex gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${c.userId === 'ADMIN' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                               {c.userId === 'ADMIN' ? <Sparkles size={10} /> : c.userName.charAt(0)}
                            </div>
                            <div className="flex-1">
                               <div className="bg-white p-2 rounded-xl rounded-tl-none border border-slate-100 shadow-sm">
                                  <p className="text-xs font-bold text-slate-900">{c.userName}</p>
                                  <p className="text-sm text-slate-700">{c.content}</p>
                               </div>
                            </div>
                         </div>
                      ))}

                      {/* Add Comment */}
                      <div className="flex gap-2">
                         <input 
                            type="text"
                            value={commentText[prayer.id] || ''}
                            onChange={(e) => setCommentText({...commentText, [prayer.id]: e.target.value})}
                            placeholder="Tulis dukungan doa..."
                            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(prayer.id)}
                         />
                         <button 
                            onClick={() => handleSubmitComment(prayer.id)}
                            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                         >
                            <Send size={16} />
                         </button>
                      </div>
                   </div>
                )}
             </div>
           );
        })}

        {state.prayerData.length === 0 && (
           <div className="text-center py-10 text-slate-400">
              <Sparkles className="mx-auto mb-2 opacity-50" size={48} />
              <p>Belum ada pokok doa. Jadilah yang pertama membagikan.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default JemaatPrayers;
