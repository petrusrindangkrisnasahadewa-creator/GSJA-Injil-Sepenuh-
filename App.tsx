
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  QrCode, 
  User, 
  LogOut, 
  ShieldCheck, 
  HeartHandshake,
  Users, 
  Scan,
  Menu,
  X,
  Bell,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LayoutGrid,
  Image as ImageIcon,
  Settings,
  Info,
  Mic,
  CheckCircle,
  Cake,
  MessageSquare
} from 'lucide-react';
import { AppState, UserRole, Jemaat, Renungan, Jadwal, PrayerRequest, AttendanceRecord, Tithe, Expense, SlideshowImage, ChurchInfo, Pastor, Volunteer, Notification } from './types';
import LandingPage from './views/LandingPage';
import JemaatLogin from './views/JemaatLogin';
import AdminDashboard from './views/AdminDashboard';
import AdminMembers from './views/AdminMembers';
import AdminSchedules from './views/AdminSchedules';
import AdminRenungan from './views/AdminRenungan';
import AdminScanner from './views/AdminScanner';
import AdminPrayers from './views/AdminPrayers';
import AdminFinance from './views/AdminFinance'; // Merged View
import AdminChurchInfo from './views/AdminChurchInfo';
import AdminSettings from './views/AdminSettings';
import AdminFinancialReport from './views/AdminFinancialReport';
import AdminVolunteers from './views/AdminVolunteers';
import AdminBirthdays from './views/AdminBirthdays'; // New View
import JemaatDashboard from './views/JemaatDashboard';
import JemaatSchedule from './views/JemaatSchedule';
import JemaatDevotional from './views/JemaatDevotional';
import JemaatPrayers from './views/JemaatPrayers';
import JemaatProfile from './views/JemaatProfile';
import JemaatFinances from './views/JemaatFinances';
import JemaatChurchInfo from './views/JemaatChurchInfo';
import JemaatBirthdays from './views/JemaatBirthdays'; 
import JemaatFeedback from './views/JemaatFeedback';

// Mock Initial Data (Keep existing data)
const INITIAL_JEMAAT: Jemaat[] = [
  { 
    id: 'JM001', 
    name: 'Budi Santoso', 
    phone: '08123456789', 
    address: 'Jl. Mawar No. 10', 
    joinedAt: '2023-01-15', 
    photoUrl: '',
    birthPlace: 'Jakarta',
    birthDate: '1985-05-12',
    isBaptized: true,
    wishes: [],
    birthdayLikes: []
  },
  { 
    id: 'JM002', 
    name: 'Siti Aminah', 
    phone: '08198765432', 
    address: 'Jl. Melati No. 5', 
    joinedAt: '2023-02-20', 
    photoUrl: '',
    birthPlace: 'Bandung',
    birthDate: '1990-08-25',
    isBaptized: true,
    wishes: [],
    birthdayLikes: []
  },
  { 
    id: 'JM003', 
    name: 'Agus Wijaya', 
    phone: '08567891234', 
    address: 'Jl. Anggrek No. 12', 
    joinedAt: '2023-03-05', 
    photoUrl: '',
    birthPlace: 'Surabaya',
    birthDate: '1995-12-10',
    isBaptized: false,
    wishes: [],
    birthdayLikes: []
  },
];

const INITIAL_RENUNGAN: Renungan[] = [
  { 
    id: 'R001', 
    title: 'Kasih yang Memulihkan', 
    imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    date: '2024-05-20', 
    verse: 'Yohanes 3:16', 
    content: 'Kasih Allah begitu besar bagi kita sehingga Ia memberikan Anak-Nya yang tunggal. Kasih ini bukan sekadar kata-kata, melainkan tindakan nyata yang menyelamatkan kita dari dosa dan maut. \n\nKetika kita merasa sendirian atau tidak berharga, ingatlah bahwa Pencipta alam semesta ini mengasihi kita secara pribadi. Kasih-Nya memulihkan hati yang hancur dan memberikan pengharapan baru bagi masa depan.', 
    author: 'Pdt. Yohanes',
    likes: 12,
    likedBy: ['JM002'],
    comments: [
      { id: 'C1', userId: 'JM002', userName: 'Siti Aminah', content: 'Amin, sangat memberkati!', createdAt: '2024-05-20T08:00:00Z' }
    ]
  },
  { 
    id: 'R002', 
    title: 'Kekuatan dalam Kelemahan', 
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    date: '2024-05-19', 
    verse: '2 Korintus 12:9', 
    content: 'Seringkali kita berpikir bahwa kekuatan kita terletak pada kemampuan diri sendiri. Namun, Tuhan berkata bahwa dalam kelemahan kitalah kuasa-Nya menjadi sempurna.', 
    author: 'Pdm. Sarah',
    likes: 8,
    likedBy: [],
    comments: []
  },
];

const INITIAL_JADWAL: Jadwal[] = [
  { id: 'J001', type: 'Ibadah Raya', date: '2024-05-26', time: '09:00', preacher: 'Pdt. Yohanes', worshipLeader: 'Bpk. Andreas' },
];

const INITIAL_PRAYERS: PrayerRequest[] = [
  {
    id: 'P001',
    userId: 'JM002',
    userName: 'Siti Aminah',
    content: 'Mohon dukungan doa untuk kesembuhan ibu saya yang sedang dirawat di RS. Kiranya Tuhan jamah dan pulihkan.',
    createdAt: '2024-05-25T10:00:00Z',
    likes: 5,
    likedBy: ['JM001'],
    comments: [
      { id: 'C1', userId: 'JM001', userName: 'Budi Santoso', content: 'Kami turut berdoa bu Siti. Tuhan Yesus tabib yang ajaib.', createdAt: '2024-05-25T10:30:00Z' }
    ]
  }
];

const INITIAL_TITHES: Tithe[] = [
  { id: 'T001', jemaatId: 'JM001', jemaatName: 'Budi Santoso', amount: 500000, date: '2024-05-01', method: 'Transfer' },
  { id: 'T002', jemaatId: 'JM002', jemaatName: 'Siti Aminah', amount: 750000, date: '2024-05-05', method: 'Tunai' },
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'E001', description: 'Bantuan Panti Asuhan Kasih', amount: 2000000, date: '2024-05-10', category: 'Sosial' },
  { id: 'E002', description: 'Listrik & Air Gereja', amount: 1500000, date: '2024-05-12', category: 'Operasional' },
];

const INITIAL_SLIDESHOW: SlideshowImage[] = [
  { id: 'S001', url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', caption: 'Ibadah Raya Minggu' },
  { id: 'S002', url: 'https://images.unsplash.com/photo-1544427920-24e832256f72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', caption: 'Persekutuan Doa' },
  { id: 'S003', url: 'https://images.unsplash.com/photo-1510590337019-5ef2d3977e9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', caption: 'Retreat Pemuda' },
];

const INITIAL_CHURCH_INFO: ChurchInfo = {
  name: 'GSJA Injil Sepenuh',
  address: 'Jl. Harapan Indah No. 123, Jakarta Pusat',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.46!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sid!4v1600000000000!5m2!1sen!2sid',
  whatsapp: '6281234567890',
  logoUrl: '',
  vision: 'Menjadi gereja yang memuliakan Tuhan dan menjadi berkat bagi bangsa.',
  mission: '1. Memberitakan Injil\n2. Memuridkan Jemaat\n3. Melayani Masyarakat',
};

const INITIAL_PASTORS: Pastor[] = [
  { id: 'P001', name: 'Pdt. Yohanes Wijaya', role: 'Gembala Sidang', photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 'P002', name: 'Pdm. Sarah Susanti', role: 'Wakil Gembala', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
];

const INITIAL_VOLUNTEERS: Volunteer[] = [
  { id: 'VOL-001', userId: 'JM003', userName: 'Agus Wijaya', userPhone: '08567891234', role: 'Drum', status: 'Pending', createdAt: '2024-05-26T10:00:00Z' }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'N001', title: 'Pelayanan Baru', message: 'Agus Wijaya mendaftar sebagai Drum.', type: 'VOLUNTEER', isRead: false, createdAt: '2024-05-26T10:00:00Z', linkTo: '/admin/volunteers' }
];

const AppContext = React.createContext<{
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
} | null>(null);

// Loading Screen Component
const LoadingScreen: React.FC<{ churchInfo: ChurchInfo }> = ({ churchInfo }) => (
  <div className="fixed inset-0 bg-slate-900 z-[9999] flex flex-col items-center justify-center space-y-8">
    <div className="relative">
      <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20 animate-pulse rounded-full"></div>
      <div className="relative z-10 w-32 h-32 flex items-center justify-center bg-white/5 rounded-3xl p-4 backdrop-blur-sm border border-white/10 shadow-2xl">
        {churchInfo.logoUrl ? (
          <img 
            src={churchInfo.logoUrl} 
            alt="Logo" 
            className="w-full h-full object-contain drop-shadow-md animate-in fade-in zoom-in duration-700" 
          />
        ) : (
          <ShieldCheck size={64} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse" />
        )}
      </div>
    </div>
    
    <div className="text-center space-y-4 z-10">
      <h2 className="text-2xl font-bold text-white tracking-tight animate-in slide-in-from-bottom-4 fade-in duration-700">
        {churchInfo.name}
      </h2>
      <div className="flex flex-col items-center gap-3">
         <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
         </div>
         <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">Memuat Data Sistem...</p>
      </div>
    </div>
  </div>
);

// Dashboard Layout Component
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = React.useContext(AppContext);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { state, setState } = context!;
  
  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Filter notifications: Show if it's a broadcast (no targetUserId) OR if it targets the current user
  const relevantNotifications = state.notifications.filter(n => {
    if (state.role === 'ADMIN') return true; // Admin sees all
    return !n.targetUserId || (state.currentUser && n.targetUserId === state.currentUser.id);
  });

  const unreadCount = relevantNotifications.filter(n => !n.isRead).length;

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => {
        // Only mark read for relevant notifications
        const isRelevant = !n.targetUserId || (state.currentUser && n.targetUserId === state.currentUser.id);
        if (state.role === 'ADMIN' || isRelevant) {
          return {...n, isRead: true};
        }
        return n;
      })
    }));
  };

  const isAdmin = state.role === 'ADMIN';

  // Helper to get initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const NotificationDropdown = () => (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60]">
      <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm">Notifikasi</h3>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-indigo-600 font-bold hover:underline">
                Tandai dibaca
            </button>
          )}
      </div>
      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          {relevantNotifications.length > 0 ? (
            relevantNotifications.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(notif => {
               // Determine icon based on type
               let Icon = Bell;
               let iconColor = 'bg-indigo-500';
               if (notif.type === 'BIRTHDAY') { Icon = Cake; iconColor = 'bg-pink-500'; }
               if (notif.type === 'PRAYER') { Icon = HeartHandshake; iconColor = 'bg-cyan-500'; }
               if (notif.type === 'RENUNGAN') { Icon = BookOpen; iconColor = 'bg-red-500'; }

               return (
                <Link to={notif.linkTo || '#'} key={notif.id} onClick={() => setShowNotifications(false)}>
                    <div className={`p-4 border-b border-gray-50 hover:bg-slate-50 transition-colors ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}>
                        <div className="flex gap-3">
                        <div className={`mt-0.5 w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] ${iconColor}`}>
                            <Icon size={14} />
                        </div>
                        <div>
                            <p className={`text-xs font-bold ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-2">{new Date(notif.createdAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        </div>
                    </div>
                </Link>
               );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs italic">
                Belum ada notifikasi baru.
            </div>
          )}
      </div>
      <div className="p-3 border-t border-gray-50 text-center">
          <button onClick={() => setShowNotifications(false)} className="text-xs font-bold text-slate-500 hover:text-slate-800">Tutup</button>
      </div>
    </div>
  );

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin', icon: Home },
    { name: 'Informasi Gereja', path: '/admin/church-info', icon: Info },
    { name: 'Jemaat', path: '/admin/members', icon: Users },
    { name: 'Pelayanan', path: '/admin/volunteers', icon: Mic },
    { name: 'Jadwal', path: '/admin/schedules', icon: Calendar },
    { name: 'Renungan', path: '/admin/renungan', icon: BookOpen },
    { name: 'Ulang Tahun', path: '/admin/birthdays', icon: Cake }, // NEW MENU
    { name: 'Scan Absensi', path: '/admin/scanner', icon: Scan },
    { name: 'Keuangan', path: '/admin/finance', icon: Wallet }, // Merged Menu
    { name: 'Dukungan Doa', path: '/admin/prayers', icon: HeartHandshake },
    { name: 'Pengaturan', path: '/admin/settings', icon: Settings },
  ];

  const jemaatNavItems = [
    { name: 'Beranda', path: '/dashboard', icon: Home },
    { name: 'Jadwal', path: '/schedule', icon: Calendar },
    { name: 'Renungan', path: '/devotional', icon: BookOpen },
    { name: 'Doa', path: '/prayers', icon: HeartHandshake },
    { name: 'Info', path: '/church-info', icon: Info },
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-red-700 p-1.5 rounded-lg overflow-hidden w-8 h-8 flex items-center justify-center">
              {state.churchInfo.logoUrl ? (
                <img src={state.churchInfo.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <ShieldCheck size={18} className="text-white"/>
              )}
            </div>
            <h2 className="text-sm font-bold text-slate-900">GSJA Mobile</h2>
          </div>
          <div className="flex items-center gap-3">
             {/* Notification Bell for Jemaat */}
             <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors relative"
                >
                   <Bell size={20} />
                   {unreadCount > 0 && (
                     <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-600 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                     </span>
                   )}
                </button>
                {showNotifications && <NotificationDropdown />}
             </div>

            <Link to="/" className="p-2 text-slate-400 hover:text-red-700 transition-colors">
              <LogOut size={20} />
            </Link>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-red-50 text-red-700 flex items-center justify-center font-bold text-xs overflow-hidden border border-red-100 hover:ring-2 hover:ring-red-200 transition-all">
              {state.currentUser?.photoUrl ? (
                 <img src={state.currentUser.photoUrl} alt="User" className="w-full h-full object-cover" />
              ) : (
                 state.currentUser ? getInitials(state.currentUser.name) : 'JM'
              )}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-24 custom-scrollbar">
          {children}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 pb-5 z-40 flex justify-between items-center shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
          {jemaatNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-red-700' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className={`p-1 rounded-full ${isActive ? 'bg-red-50' : ''}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-700 p-2 rounded-lg overflow-hidden w-10 h-10 flex items-center justify-center shrink-0">
                {state.churchInfo.logoUrl ? (
                  <img src={state.churchInfo.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <ShieldCheck size={24} />
                )}
              </div>
              <h1 className="font-bold text-lg">Admin Panel</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden"><X size={24} /></button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {adminNavItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-red-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <Link to="/" className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-900/50 py-3 rounded-xl text-xs font-medium transition-colors text-slate-300 hover:text-white">
              <LogOut size={14} /> Keluar Portal
            </Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-600"><Menu size={24} /></button>
            <h2 className="text-lg font-bold text-slate-800">Administrator</h2>
          </div>
          <div className="flex items-center gap-4">
             
             {/* Notification Bell for Admin */}
             <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors relative"
                >
                   <Bell size={20} />
                   {unreadCount > 0 && (
                     <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                     </span>
                   )}
                </button>

                {showNotifications && <NotificationDropdown />}
             </div>

             {/* Admin Logo/Avatar Section */}
             <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                {state.churchInfo.logoUrl ? (
                  <img src={state.churchInfo.logoUrl} alt="Church Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                      <ShieldCheck size={18} />
                  </div>
                )}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    role: 'JEMAAT',
    currentUser: null,
    adminPassword: 'admin',
    churchInfo: INITIAL_CHURCH_INFO,
    pastoralTeam: INITIAL_PASTORS,
    jemaatData: INITIAL_JEMAAT,
    renunganData: INITIAL_RENUNGAN,
    jadwalData: INITIAL_JADWAL,
    prayerData: INITIAL_PRAYERS,
    feedbackData: [],
    attendanceData: [],
    titheData: INITIAL_TITHES,
    expenseData: INITIAL_EXPENSES,
    slideshowData: INITIAL_SLIDESHOW,
    volunteerData: INITIAL_VOLUNTEERS,
    notifications: INITIAL_NOTIFICATIONS
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen churchInfo={state.churchInfo} />;
  }

  return (
    <AppContext.Provider value={{ state, setState }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<JemaatLogin />} />
          
          <Route path="/*" element={
            <DashboardLayout>
              <Routes>
                {/* Jemaat Routes */}
                <Route path="/dashboard" element={<JemaatDashboard />} />
                <Route path="/schedule" element={<JemaatSchedule />} />
                <Route path="/devotional" element={<JemaatDevotional />} />
                <Route path="/prayers" element={<JemaatPrayers />} />
                <Route path="/profile" element={<JemaatProfile />} />
                <Route path="/finances" element={<JemaatFinances />} />
                <Route path="/church-info" element={<JemaatChurchInfo />} />
                <Route path="/birthdays" element={<JemaatBirthdays />} />
                <Route path="/feedback" element={<JemaatFeedback />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/members" element={<AdminMembers />} />
                <Route path="/admin/schedules" element={<AdminSchedules />} />
                <Route path="/admin/renungan" element={<AdminRenungan />} />
                <Route path="/admin/scanner" element={<AdminScanner />} />
                <Route path="/admin/prayers" element={<AdminPrayers />} />
                <Route path="/admin/finance" element={<AdminFinance />} />
                <Route path="/admin/church-info" element={<AdminChurchInfo />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/financial-report" element={<AdminFinancialReport />} />
                <Route path="/admin/volunteers" element={<AdminVolunteers />} />
                <Route path="/admin/birthdays" element={<AdminBirthdays />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DashboardLayout>
          } />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
export { AppContext };
