
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { BookOpen, Calendar, User, Share2, Heart, MessageCircle, Send, Clock, Quote } from 'lucide-react';
import { Renungan } from '../types';

const JemaatDevotional: React.FC = () => {
  const context = useContext(AppContext);
  const [commentText, setCommentText] = useState<{[key: string]: string}>({});
  
  if (!context) return null;
  const { state, setState } = context;
  const currentUser = state.currentUser;

  const handleLike = (id: string) => {
    if (!currentUser) return;
    
    setState(prev => ({
      ...prev,
      renunganData: prev.renunganData.map(r => {
        if (r.id === id) {
          const isLiked = r.likedBy.includes(currentUser.id);
          return {
            ...r,
            likes: isLiked ? r.likes - 1 : r.likes + 1,
            likedBy: isLiked 
              ? r.likedBy.filter(uid => uid !== currentUser.id)
              : [...r.likedBy, currentUser.id]
          };
        }
        return r;
      })
    }));
  };

  const handleCommentChange = (id: string, text: string) => {
    setCommentText(prev => ({...prev, [id]: text}));
  };

  const handleSubmitComment = (renunganId: string) => {
    if (!currentUser || !commentText[renunganId]?.trim()) return;

    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      content: commentText[renunganId],
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      renunganData: prev.renunganData.map(r => {
        if (r.id === renunganId) {
          return {
            ...r,
            comments: [...(r.comments || []), newComment]
          };
        }
        return r;
      })
    }));

    setCommentText(prev => ({...prev, [renunganId]: ''}));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Renungan Harian</h1>
        <p className="text-slate-500">Renungkan firman Tuhan setiap hari untuk pertumbuhan iman Anda.</p>
      </div>

      <div className="space-y-12">
        {state.renunganData.map((r, idx) => {
            const isLiked = currentUser ? r.likedBy?.includes(currentUser.id) : false;
            
            return (
              <article key={r.id} className="group relative bg-white rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                
                {/* Header Image with Parallax-like Zoom Effect */}
                <div className="h-64 md:h-80 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-colors z-10" />
                    <img 
                        src={r.imageUrl || `https://source.unsplash.com/random/800x600?nature,${idx}`} 
                        alt={r.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }}
                    />
                    
                    {/* Floating Date Badge */}
                    <div className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg flex flex-col items-center">
                        <span className="text-2xl font-black text-red-700 leading-none">{new Date(r.date).getDate()}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date(r.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                    </div>

                    {idx === 0 && (
                        <div className="absolute top-6 left-6 z-20 bg-red-700 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                            Renungan Terbaru
                        </div>
                    )}
                </div>

                {/* Overlapping Content Card */}
                <div className="relative z-20 -mt-16 mx-4 md:mx-8 mb-8 p-6 md:p-8 bg-white rounded-[2rem] shadow-lg">
                    
                    {/* Header Info */}
                    <div className="flex items-center gap-3 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><User size={14} className="text-red-500" /> {r.author}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-red-500" /> 3 Menit Baca</span>
                    </div>

                    {/* Title & Verse */}
                    <div className="space-y-6">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight group-hover:text-red-700 transition-colors">
                            {r.title}
                        </h2>
                        
                        <div className="relative p-6 bg-slate-50 rounded-2xl border border-red-50">
                            <Quote className="absolute top-4 left-4 text-red-200 fill-current" size={40} />
                            <div className="relative z-10 pl-8">
                                <p className="text-lg font-serif font-medium text-slate-800 italic">"{r.verse}"</p>
                            </div>
                        </div>

                        <div className="text-slate-600 leading-relaxed text-lg space-y-4 font-sans">
                            {r.content.split('\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>

                    {/* Interaction Footer */}
                    <div className="pt-8 mt-8 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleLike(r.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${isLiked ? 'bg-pink-50 text-pink-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                >
                                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-bounce" : ""} />
                                    <span>{r.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                                    <MessageCircle size={20} />
                                    <span>{r.comments?.length || 0}</span>
                                </button>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-red-700 transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Comments Area */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                             {/* Comment List (Limited preview) */}
                             {r.comments && r.comments.length > 0 && (
                                 <div className="mb-4 space-y-3">
                                     {r.comments.slice(0, 2).map((comment) => (
                                         <div key={comment.id} className="flex gap-2.5">
                                             <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-[10px] shrink-0">
                                                 {comment.userName.charAt(0)}
                                             </div>
                                             <div>
                                                 <p className="text-xs font-bold text-slate-800">{comment.userName}</p>
                                                 <p className="text-sm text-slate-600">{comment.content}</p>
                                             </div>
                                         </div>
                                     ))}
                                     {r.comments.length > 2 && (
                                         <p className="text-xs text-red-600 font-bold pl-9">Lihat {r.comments.length - 2} komentar lainnya...</p>
                                     )}
                                 </div>
                             )}

                             <div className="flex gap-2 relative">
                                <input 
                                    type="text"
                                    value={commentText[r.id] || ''}
                                    onChange={(e) => handleCommentChange(r.id, e.target.value)}
                                    placeholder="Bagikan respon Anda..."
                                    className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 text-sm font-medium shadow-sm"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSubmitComment(r.id);
                                    }}
                                />
                                <button 
                                    onClick={() => handleSubmitComment(r.id)}
                                    disabled={!commentText[r.id]}
                                    className="absolute right-2 top-1.5 p-1.5 bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 transition-colors shadow-md"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
              </article>
            );
        })}
      </div>
    </div>
  );
};

export default JemaatDevotional;
