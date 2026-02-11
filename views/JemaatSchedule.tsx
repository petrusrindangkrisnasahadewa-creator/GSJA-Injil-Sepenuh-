
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Calendar, Clock, User, UserCheck, ChevronRight, Mic, Music, Monitor, Car, HeartHandshake, CheckCircle, X } from 'lucide-react';
import { MinistryRole, Notification } from '../types';

const JemaatSchedule: React.FC = () => {
  const context = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<MinistryRole | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!context) return null;
  const { state, setState } = context;

  const roles: { id: MinistryRole; label: string; icon: React.ElementType }[] = [
    { id: 'WL', label: 'Worship Leader', icon: Mic },
    { id: 'Singer', label: 'Singer', icon: Mic },
    { id: 'Keyboard', label: 'Keyboardist', icon: Music },
    { id: 'Gitar', label: 'Gitaris', icon: Music },
    { id: 'Bass', label: 'Bassist', icon: Music },
    { id: 'Drum', label: 'Drummer', icon: Music },
    { id: 'Multimedia', label: 'Multimedia', icon: Monitor },
    { id: 'Usher', label: 'Usher / Kolektan', icon: HeartHandshake },
    { id: 'Parkir', label: 'Jaga Parkir', icon: Car },
  ];

  const handleRegister = () => {
    if (!selectedRole || !state.currentUser) return;

    // Check if already registered
    const alreadyRegistered = state.volunteerData.some(
        v => v.userId === state.currentUser!.id && v.role === selectedRole
    );

    if (alreadyRegistered) {
        alert("Anda sudah mendaftar di pelayanan ini.");
        return;
    }

    const newVolunteer = {
        id: `VOL-${Date.now()}`,
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        userPhone: state.currentUser.phone,
        role: selectedRole,
        status: 'Pending' as const,
        createdAt: new Date().toISOString()
    };

    // New Notification
    const roleLabel = roles.find(r => r.id === selectedRole)?.label;
    const newNotif: Notification = {
        id: `N-${Date.now()}`,
        title: 'Permohonan Pelayanan',
        message: `${state.currentUser.name} mendaftar sebagai ${roleLabel}.`,
        type: 'VOLUNTEER',
        isRead: false,
        createdAt: new Date().toISOString(),
        linkTo: '/admin/volunteers'
    };

    setState(prev => ({
        ...prev,
        volunteerData: [...prev.volunteerData, newVolunteer],
        notifications: [newNotif, ...prev.notifications] // Trigger Notif
    }));

    setIsSuccess(true);
    setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
        setSelectedRole(null);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Jadwal Pelayanan</h1>
        <p className="text-slate-500">Hadirlah tepat waktu untuk memuliakan nama Tuhan bersama-sama.</p>
      </div>

      <div className="space-y-4">
        {state.jadwalData.map((j) => (
          <div key={j.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6">
            {/* Date Badge */}
            <div className="bg-indigo-50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px] border border-indigo-100">
              <span className="text-indigo-600 font-bold text-2xl">{new Date(j.date).getDate()}</span>
              <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">
                {new Date(j.date).toLocaleDateString('id-ID', { month: 'short' })}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                     {j.type}
                   </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {new Date(j.date).toLocaleDateString('id-ID', { weekday: 'long' })} - {j.time} WIB
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                     <User size={16} />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Pembicara</p>
                     <p className="text-sm font-bold text-slate-900">{j.preacher}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                     <UserCheck size={16} />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Worship Leader</p>
                     <p className="text-sm font-bold text-slate-900">{j.worshipLeader}</p>
                   </div>
                 </div>
              </div>
            </div>

            <div className="flex items-center">
              <button className="p-3 bg-slate-50 rounded-full text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action - Rindu Melayani */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white text-center space-y-6 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
            <h4 className="text-xl font-bold text-white">Rindu Melayani Tuhan?</h4>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            "Layanilah seorang akan yang lain, sesuai dengan karunia yang telah diperoleh tiap-tiap orang sebagai pengurus yang baik dari kasih karunia Allah." (1 Petrus 4:10)
            </p>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 px-8 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 transform hover:scale-105 active:scale-95"
            >
            Daftar Pelayanan
            </button>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="bg-white rounded-3xl w-full max-w-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
                
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Pendaftaran Berhasil!</h3>
                        <p className="text-slate-500">Terima kasih atas kerinduan Anda.<br/>Admin kami akan segera menghubungi Anda.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Pilih Bidang Pelayanan</h2>
                                <p className="text-slate-500 text-sm">Pilih bidang yang sesuai dengan talenta Anda.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Updated Grid Selection */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                            {roles.map((role) => {
                                const isSelected = selectedRole === role.id;
                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`relative group flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 ${
                                            isSelected 
                                            ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.02]' 
                                            : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50 hover:shadow-sm'
                                        }`}
                                    >
                                        {/* Selection Checkmark */}
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 text-indigo-600 animate-in zoom-in duration-200">
                                                <CheckCircle size={20} fill="currentColor" className="text-white" />
                                            </div>
                                        )}

                                        {/* Icon Container */}
                                        <div className={`p-4 rounded-full mb-3 transition-colors duration-300 ${
                                            isSelected 
                                            ? 'bg-white text-indigo-600 shadow-sm' 
                                            : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                        }`}>
                                            <role.icon size={28} strokeWidth={1.5} />
                                        </div>

                                        {/* Label */}
                                        <span className={`text-sm font-bold text-center transition-colors ${
                                            isSelected ? 'text-indigo-900' : 'text-slate-600 group-hover:text-slate-900'
                                        }`}>
                                            {role.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-lg shadow-sm">
                                     {state.currentUser?.name.charAt(0)}
                                 </div>
                                 <div>
                                     <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">Mendaftar Sebagai</p>
                                     <p className="font-bold text-slate-900 text-lg leading-none">{state.currentUser?.name}</p>
                                     <p className="text-xs text-slate-500 mt-1">{state.currentUser?.phone}</p>
                                 </div>
                             </div>
                        </div>

                        <button 
                            onClick={handleRegister}
                            disabled={!selectedRole}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <HeartHandshake size={20} />
                            Kirim Permohonan
                        </button>
                    </>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default JemaatSchedule;
