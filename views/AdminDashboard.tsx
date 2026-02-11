
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';
import { Users, Calendar, BookOpen, Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, QrCode, Download, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

const AdminDashboard: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { state } = context;

  // --- FINANCIAL DATA CALCULATION ---
  const totalTithes = state.titheData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = state.expenseData.reduce((acc, curr) => acc + curr.amount, 0);

  // --- ATTENDANCE DATA CALCULATION (LAST 7 DAYS) ---
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentAttendance = state.attendanceData.filter(a => 
    new Date(a.timestamp) >= oneWeekAgo
  );

  // Group by Date for Chart
  const attendanceMap = new Map<string, number>();
  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    attendanceMap.set(d.toLocaleDateString('id-ID', { weekday: 'short' }), 0);
  }
  // Fill with data
  recentAttendance.forEach(a => {
    const dayName = new Date(a.timestamp).toLocaleDateString('id-ID', { weekday: 'short' });
    attendanceMap.set(dayName, (attendanceMap.get(dayName) || 0) + 1);
  });
  
  const attendanceChartData = Array.from(attendanceMap).map(([name, count]) => ({ name, count }));

  // --- HANDLER DOWNLOAD CSV ---
  const handleDownloadAttendance = () => {
    if (recentAttendance.length === 0) {
      alert("Tidak ada data absensi dalam 1 minggu terakhir.");
      return;
    }

    const headers = ['Tanggal', 'Waktu', 'ID Jemaat', 'Nama Jemaat', 'ID Jadwal'];
    const rows = recentAttendance.map(a => {
      const dateObj = new Date(a.timestamp);
      return [
        dateObj.toLocaleDateString('id-ID'),
        dateObj.toLocaleTimeString('id-ID'),
        a.jemaatId,
        `"${a.jemaatName}"`,
        a.jadwalId
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Absensi_Mingguan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    { label: 'Total Jemaat', value: state.jemaatData.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Keuangan Masuk', value: `Rp ${totalTithes.toLocaleString('id-ID')}`, icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Dana Keluar', value: `Rp ${totalExpenses.toLocaleString('id-ID')}`, icon: ArrowDownRight, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Kehadiran (7 Hari)', value: recentAttendance.length, icon: QrCode, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const financialData = [
    { name: 'Jan', masuk: 4000000, keluar: 2400000 },
    { name: 'Feb', masuk: 3000000, keluar: 1398000 },
    { name: 'Mar', masuk: 2000000, keluar: 9800000 },
    { name: 'Apr', masuk: 2780000, keluar: 3908000 },
    { name: 'Mei', masuk: totalTithes, keluar: totalExpenses },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ringkasan Sistem</h1>
          <p className="text-slate-500">Data operasional & keuangan GSJA Injil Sepenuh.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                <stat.icon size={24} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900 truncate">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === SECTION KEUANGAN === */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-600" />
              Arus Kas Bulanan
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="masuk" stroke="#10b981" fillOpacity={1} fill="url(#colorMasuk)" strokeWidth={3} />
                <Area type="monotone" dataKey="keluar" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Aktivitas Keuangan</h3>
          <div className="flex-1 space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <ArrowUpRight size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Persepuluhan Masuk</p>
                <p className="text-xs text-slate-400">JM001 • Rp 500.000</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                <ArrowDownRight size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Bantuan Sosial</p>
                <p className="text-xs text-slate-400">E001 • Rp 2.000.000</p>
              </div>
            </div>
          </div>
          <Link to="/admin/financial-report" className="mt-6 w-full py-3 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors text-center block">
            Lihat Laporan Lengkap
          </Link>
        </div>
      </div>

      {/* === SECTION ABSENSI JEMAAT === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grafik Absensi */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                   <QrCode size={20} className="text-purple-600" />
                   Statistik Kehadiran (7 Hari)
                </h3>
                <button 
                  onClick={handleDownloadAttendance}
                  className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-purple-100 transition-colors"
                >
                   <Download size={14} /> Download Laporan (CSV)
                </button>
             </div>
             
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={attendanceChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="count" fill="#9333ea" radius={[6, 6, 0, 0]} barSize={40} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* List Absensi Terkini */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
             <h3 className="font-bold text-lg text-slate-900 mb-6">Baru Saja Hadir</h3>
             <div className="flex-1 space-y-4 overflow-y-auto max-h-[250px] custom-scrollbar pr-2">
                {recentAttendance.length > 0 ? (
                   // Show latest 5
                   recentAttendance.slice(0, 5).map((a, idx) => (
                      <div key={idx} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                         <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {a.jemaatName.charAt(0)}
                         </div>
                         <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 truncate">{a.jemaatName}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                               <Clock size={10} /> {new Date(a.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                            </p>
                         </div>
                      </div>
                   ))
                ) : (
                   <p className="text-slate-400 italic text-sm text-center py-10">Belum ada data absensi minggu ini.</p>
                )}
             </div>
             <Link to="/admin/scanner" className="mt-6 w-full py-3 text-sm font-semibold text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-center block">
                Buka Scanner
             </Link>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
