
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Cake, Calendar, ChevronLeft, ChevronRight, Send, MessageCircle, Gift, User } from 'lucide-react';
import { BirthdayWish } from '../types';

const AdminBirthdays: React.FC = () => {
  const context = useContext(AppContext);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
  const [wishText, setWishText] = useState<{[key: string]: string}>({});

  if (!context) return null;
  const { state, setState } = context;

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Helper to determine status
  const getStatus = (day: number, month: number) => {
      const today = new Date();
      if (month !== today.getMonth()) return 'normal';
      if (day === today.getDate()) return 'today';
      if (day < today.getDate()) return 'past';
      return 'upcoming';
  };

  // Filter Jemaat based on selected month
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

  const handleSendWish = (targetJemaatId: string) => {
      const text = wishText[targetJemaatId];
      if (!text?.trim()) return;

      const newWish: BirthdayWish = {
          id: `W-ADM-${Date.now()}`,
          senderId: 'ADMIN',
          senderName: 'Admin Gereja', // Official Admin Name
          message: text,
          createdAt: new Date().toISOString()
      };

      setState(prev => ({
          ...prev,
          jemaatData: prev.jemaatData.map(m => {
              if (m.id === targetJemaatId) {
                  return { ...m, wishes: [...(m.wishes || []), newWish] };
              }
              return m;
          })
      }));

      setWishText(prev => ({ ...prev, [targetJemaatId]: '' }));
  };

  const nextMonth = () => setSelectedMonth(prev => (prev + 1) % 12);
  const prevMonth = () => setSelectedMonth(prev => (prev - 1 + 12) % 12);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ulang Tahun Jemaat</h1>
          <p className="text-slate-500">Kelola ucapan dan lihat jemaat yang berulang tahun.</p>
        </div>
        
        {/* Month Navigation */}
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-1">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                <ChevronLeft size={20} />
            </button>
            <div className="px-6 py-2 min-w-[150px] text-center font-bold text-slate-900 flex items-center justify-center gap-2">
                <Calendar size={16} className="text-indigo-600" />
                {months[selectedMonth]}
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                <ChevronRight size={20} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {birthdayMembers.length > 0 ? (
              birthdayMembers.map(member => (
                <div key={member.id} className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col ${member.status === 'today' ? 'border-pink-300 ring-4 ring-pink-50 shadow-pink-100' : 'border-gray-100'}`}>
                    
                    {/* Header */}
                    <div className={`p-4 flex items-center gap-4 border-b ${member.status === 'today' ? 'bg-pink-50 border-pink-100' : 'bg-white border-slate-50'}`}>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shrink-0 overflow-hidden ${member.status === 'today' ? 'bg-pink-500' : 'bg-indigo-500'}`}>
                            {member.photoUrl ? (
                                <img src={member.photoUrl} className="w-full h-full object-cover" alt={member.name} />
                            ) : (
                                member.name.charAt(0)
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 line-clamp-1">{member.name}</h3>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className={`px-2 py-0.5 rounded text-white font-bold ${member.status === 'today' ? 'bg-pink-500' : 'bg-slate-400'}`}>
                                    {member.day} {months[selectedMonth].substring(0, 3)}
                                </span>
                                <span>Ke-{member.age} Tahun</span>
                            </div>
                        </div>
                        {member.status === 'today' && (
                            <div className="p-2 bg-pink-100 text-pink-600 rounded-full animate-bounce">
                                <Cake size={20} />
                            </div>
                        )}
                    </div>

                    {/* Wishes Display */}
                    <div className="flex-1 bg-slate-50 p-4 max-h-48 overflow-y-auto custom-scrollbar">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                            <MessageCircle size={12} /> Ucapan ({member.wishes?.length || 0})
                        </p>
                        {member.wishes && member.wishes.length > 0 ? (
                            <div className="space-y-2">
                                {member.wishes.map(wish => (
                                    <div key={wish.id} className={`p-2 rounded-xl text-xs ${wish.senderId === 'ADMIN' ? 'bg-indigo-100 border border-indigo-200 text-indigo-800' : 'bg-white border border-slate-100'}`}>
                                        <span className="font-bold block mb-0.5">{wish.senderName}</span>
                                        <span className="text-slate-900 font-medium">{wish.message}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-slate-400 italic text-xs py-4">Belum ada ucapan.</p>
                        )}
                    </div>

                    {/* Admin Action */}
                    <div className="p-3 border-t border-gray-100 bg-white">
                        <div className="flex gap-2">
                             <input 
                                type="text"
                                value={wishText[member.id] || ''}
                                onChange={(e) => setWishText({...wishText, [member.id]: e.target.value})}
                                placeholder="Tulis ucapan sebagai Admin..."
                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 placeholder:font-normal placeholder:text-slate-400"
                                onKeyDown={(e) => e.key === 'Enter' && handleSendWish(member.id)}
                             />
                             <button 
                                onClick={() => handleSendWish(member.id)}
                                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                             >
                                <Send size={16} />
                             </button>
                        </div>
                    </div>
                </div>
              ))
          ) : (
              <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <Gift size={48} className="mb-4 opacity-50" />
                  <p className="font-medium">Tidak ada jemaat yang berulang tahun di bulan {months[selectedMonth]}.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default AdminBirthdays;
