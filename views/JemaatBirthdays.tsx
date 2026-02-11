
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Cake, Send, MessageCircle, Heart, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { BirthdayWish, Notification } from '../types';

const JemaatBirthdays: React.FC = () => {
  const context = useContext(AppContext);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
  const [wishText, setWishText] = useState<{[key: string]: string}>({});

  if (!context) return null;
  const { state, setState } = context;

  if (!state.currentUser) return <Navigate to="/login" />;
  const currentUser = state.currentUser;

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const nextMonth = () => setSelectedMonth(prev => (prev + 1) % 12);
  const prevMonth = () => setSelectedMonth(prev => (prev - 1 + 12) % 12);

  // Helper to determine status
  const getStatus = (day: number, month: number) => {
      const today = new Date();
      if (month !== today.getMonth()) return 'normal';
      if (day === today.getDate()) return 'today';
      if (day < today.getDate()) return 'past';
      return 'upcoming';
  };

  // Filter Members by Month
  const birthdayMembers = state.jemaatData
    .filter(member => {
        if (!member.birthDate) return false;
        const bDate = new Date(member.birthDate);
        return bDate.getMonth() === selectedMonth;
    })
    .map(member => {
        const bDate = new Date(member.birthDate);
        const day = bDate.getDate();
        const age = new Date().getFullYear() - bDate.getFullYear();
        return {
            ...member,
            day,
            age,
            status: getStatus(day, selectedMonth)
        };
    })
    .sort((a, b) => a.day - b.day);

  // Handle Send Wish Comment
  const handleSendWish = (targetJemaatId: string) => {
      const text = wishText[targetJemaatId];
      if (!text?.trim()) return;

      const newWish: BirthdayWish = {
          id: `W-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          message: text,
          createdAt: new Date().toISOString()
      };

      // Create Notification
      const newNotif: Notification = {
          id: `N-BDAY-MSG-${Date.now()}`,
          title: 'Ucapan Ulang Tahun',
          message: `${currentUser.name} memberikan ucapan selamat: "${text}"`,
          type: 'BIRTHDAY',
          isRead: false,
          createdAt: new Date().toISOString(),
          linkTo: '/birthdays',
          targetUserId: targetJemaatId
      };

      setState(prev => ({
          ...prev,
          jemaatData: prev.jemaatData.map(m => {
              if (m.id === targetJemaatId) {
                  return { ...m, wishes: [...(m.wishes || []), newWish] };
              }
              return m;
          }),
          notifications: [newNotif, ...prev.notifications]
      }));

      setWishText(prev => ({ ...prev, [targetJemaatId]: '' }));
  };

  // Handle Love/Like Reaction
  const handleLove = (targetJemaatId: string) => {
      const targetMember = state.jemaatData.find(m => m.id === targetJemaatId);
      if (!targetMember) return;

      const currentLikes = targetMember.birthdayLikes || [];
      const isLiked = currentLikes.includes(currentUser.id);

      let newLikes;
      if (isLiked) {
          newLikes = currentLikes.filter(id => id !== currentUser.id);
      } else {
          newLikes = [...currentLikes, currentUser.id];
          
          // Send Notification only on Like (not unlike)
          const newNotif: Notification = {
            id: `N-BDAY-LIKE-${Date.now()}`,
            title: 'Tanda Kasih Ulang Tahun',
            message: `${currentUser.name} mengirimkan tanda kasih (Love) di hari ulang tahun Anda.`,
            type: 'BIRTHDAY',
            isRead: false,
            createdAt: new Date().toISOString(),
            linkTo: '/birthdays',
            targetUserId: targetJemaatId
        };
        setState(prev => ({ ...prev, notifications: [newNotif, ...prev.notifications] }));
      }

      setState(prev => ({
          ...prev,
          jemaatData: prev.jemaatData.map(m => {
              if (m.id === targetJemaatId) {
                  return { ...m, birthdayLikes: newLikes };
              }
              return m;
          })
      }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="text-center space-y-2 mb-4">
        <div className="inline-block p-4 bg-pink-100 rounded-full text-pink-600 mb-2">
            <Cake size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Kalender Ulang Tahun</h1>
        <p className="text-slate-500">Rayakan momen spesial bersama saudara seiman.</p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6">
            <button onClick={prevMonth} className="p-3 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                <ChevronLeft size={24} />
            </button>
            <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Bulan</span>
                <div className="flex items-center gap-2 text-xl font-black text-slate-900">
                    <Calendar size={20} className="text-pink-500" />
                    {months[selectedMonth]}
                </div>
            </div>
            <button onClick={nextMonth} className="p-3 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                <ChevronRight size={24} />
            </button>
      </div>

      <div className="space-y-6">
        {birthdayMembers.length > 0 ? (
            birthdayMembers.map((member) => {
                const isLiked = member.birthdayLikes?.includes(currentUser.id);
                const likeCount = member.birthdayLikes?.length || 0;

                return (
                <div key={member.id} className={`bg-white rounded-3xl border shadow-sm overflow-hidden ${member.status === 'today' ? 'border-pink-300 ring-4 ring-pink-50 shadow-pink-100' : 'border-gray-100'}`}>
                    
                    {/* Header Card */}
                    <div className={`p-6 relative ${member.status === 'today' ? 'bg-gradient-to-r from-pink-50 to-white' : 'bg-white'}`}>
                        {member.status === 'today' && (
                            <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                HARI INI!
                            </div>
                        )}
                        
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center overflow-hidden ${member.status === 'today' ? 'border-pink-200' : 'border-slate-100'}`}>
                                {member.photoUrl ? (
                                    <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-2xl font-bold text-slate-400">{member.name.charAt(0)}</div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                                <p className="text-sm text-slate-500 font-medium">
                                    {member.day} {months[selectedMonth]} (Ke-{member.age} Tahun)
                                </p>
                            </div>
                        </div>

                        {/* Reaction Bar */}
                        <div className="flex justify-center mt-4">
                             <button 
                                onClick={() => handleLove(member.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${isLiked ? 'bg-pink-100 text-pink-600 shadow-sm transform scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                             >
                                <Heart size={18} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-bounce" : ""} />
                                {likeCount > 0 ? `${likeCount} Love` : 'Kirim Love'}
                             </button>
                        </div>
                    </div>

                    {/* Wishes Section */}
                    <div className="bg-slate-50 p-6 border-t border-slate-100">
                        <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <MessageCircle size={16} />
                            Ucapan & Doa ({member.wishes?.length || 0})
                        </h4>

                        {/* List of Wishes */}
                        {member.wishes && member.wishes.length > 0 ? (
                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                                {member.wishes.map(wish => (
                                    <div key={wish.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-sm">
                                        <p className="font-bold text-slate-900 text-xs mb-1">{wish.senderName}</p>
                                        <p className="text-slate-900 font-medium">{wish.message}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-slate-400 italic text-xs mb-4">
                                Belum ada ucapan. Jadilah yang pertama!
                            </div>
                        )}

                        {/* Input */}
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={wishText[member.id] || ''}
                                onChange={(e) => setWishText({...wishText, [member.id]: e.target.value})}
                                placeholder={`Ucapkan selamat...`}
                                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleSendWish(member.id)}
                            />
                            <button 
                                onClick={() => handleSendWish(member.id)}
                                disabled={!wishText[member.id]}
                                className="bg-pink-500 text-white p-2.5 rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 shadow-lg shadow-pink-500/20"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )})
        ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <Cake className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 font-medium">Tidak ada ulang tahun di bulan {months[selectedMonth]}.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default JemaatBirthdays;
