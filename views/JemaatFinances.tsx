
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Wallet, ArrowUpRight, Info, Heart, ArrowRight, Copy, Check, CreditCard, QrCode, TrendingUp, ArrowDownRight, PieChart } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const JemaatFinances: React.FC = () => {
  const context = useContext(AppContext);
  const [copied, setCopied] = useState(false);
  
  if (!context) return null;
  const { state } = context;

  if (!state.currentUser) {
    return <Navigate to="/login" />;
  }

  // --- CHURCH WIDE FINANCE DATA ---
  const totalChurchIncome = state.titheData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalChurchExpense = state.expenseData.reduce((acc, curr) => acc + curr.amount, 0);
  const churchBalance = totalChurchIncome - totalChurchExpense;

  // --- PERSONAL FINANCE DATA ---
  const myTithes = state.titheData.filter(t => t.jemaatId === state.currentUser?.id);
  const totalMyTithes = myTithes.reduce((acc, curr) => acc + curr.amount, 0);

  const bankAccount = {
    bank: "Bank BCA",
    number: "123-456-7890",
    name: "GSJA INJIL SEPENUH"
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bankAccount.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Keuangan & Persembahan</h1>
        <p className="text-slate-500">Laporan transparansi keuangan gereja dan informasi persembahan.</p>
      </div>

      {/* --- SECTION 1: CHURCH FINANCIAL REPORT (NEW) --- */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="text-indigo-600" size={20} />
          Laporan Keuangan Gereja
        </h3>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex flex-col justify-between h-32 relative overflow-hidden">
             <div className="relative z-10">
               <div className="flex items-center gap-2 text-emerald-700 mb-1">
                 <ArrowUpRight size={18} />
                 <span className="text-xs font-bold uppercase tracking-wider">Total Pemasukan</span>
               </div>
               <p className="text-2xl font-black text-emerald-800">Rp {totalChurchIncome.toLocaleString('id-ID')}</p>
             </div>
             <ArrowUpRight size={80} className="absolute -right-4 -bottom-4 text-emerald-200 opacity-50" />
          </div>

          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex flex-col justify-between h-32 relative overflow-hidden">
             <div className="relative z-10">
               <div className="flex items-center gap-2 text-red-700 mb-1">
                 <ArrowDownRight size={18} />
                 <span className="text-xs font-bold uppercase tracking-wider">Total Pengeluaran</span>
               </div>
               <p className="text-2xl font-black text-red-800">Rp {totalChurchExpense.toLocaleString('id-ID')}</p>
             </div>
             <ArrowDownRight size={80} className="absolute -right-4 -bottom-4 text-red-200 opacity-50" />
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-600/20 text-white flex flex-col justify-between h-32 relative overflow-hidden">
             <div className="relative z-10">
               <div className="flex items-center gap-2 text-indigo-200 mb-1">
                 <Wallet size={18} />
                 <span className="text-xs font-bold uppercase tracking-wider">Saldo Kas</span>
               </div>
               <p className="text-2xl font-black">Rp {churchBalance.toLocaleString('id-ID')}</p>
             </div>
             <Wallet size={80} className="absolute -right-4 -bottom-4 text-white opacity-10" />
          </div>
        </div>

        {/* Expense Breakdown List */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
               <PieChart size={16} /> Penggunaan Dana (Pengeluaran)
             </h4>
             <span className="text-xs text-slate-400">Bulan Ini</span>
           </div>
           
           <div className="space-y-3">
             {state.expenseData.length > 0 ? (
               state.expenseData.slice(0, 5).map(e => (
                 <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                   <div>
                      <p className="text-sm font-bold text-slate-800">{e.description}</p>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 mt-1 inline-block">{e.category}</span>
                   </div>
                   <span className="text-sm font-bold text-red-600">- Rp {e.amount.toLocaleString('id-ID')}</span>
                 </div>
               ))
             ) : (
               <p className="text-center text-slate-400 text-sm italic py-4">Belum ada data pengeluaran.</p>
             )}
             {state.expenseData.length > 5 && (
                <div className="text-center pt-2">
                   <span className="text-xs font-bold text-indigo-600">dan {state.expenseData.length - 5} transaksi lainnya...</span>
                </div>
             )}
           </div>
        </div>
      </div>

      <div className="border-t border-slate-200 my-8"></div>

      {/* --- SECTION 2: PERSONAL CONTRIBUTION & BANK INFO --- */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
           <Heart className="text-red-600" size={20} />
           Kontribusi Saya
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* My Contribution Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                    <Wallet size={24} />
                </div>
                <h3 className="font-bold text-xl">Total Persembahan Saya</h3>
                </div>
                <div>
                <p className="text-4xl font-black">Rp {totalMyTithes.toLocaleString('id-ID')}</p>
                <p className="text-slate-400 text-sm mt-1">Akumulasi yang tercatat</p>
                </div>
            </div>
            <ArrowUpRight size={120} className="absolute right-[-20px] bottom-[-20px] text-white/5" />
            </div>

            {/* Bank Info */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{bankAccount.bank}</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{bankAccount.number}</h3>
                        <p className="text-sm font-bold text-slate-700 mt-1">A.N. {bankAccount.name}</p>
                    </div>
                    <div className="bg-red-50 p-2 rounded-xl text-red-600">
                        <CreditCard size={24} />
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={handleCopy}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Tersalin' : 'Salin No. Rek'}
                    </button>
                    <button className="flex-1 py-3 bg-red-50 text-red-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                        <QrCode size={16} />
                        QRIS
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 italic text-center">
                    *Harap konfirmasi transfer Anda melalui menu Pesan/Admin.
                </p>
            </div>
        </div>
      </div>

      {/* History Table for Jemaat */}
      <div className="space-y-4">
        <h4 className="font-bold text-slate-800 text-sm">Riwayat Persembahan Saya</h4>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b border-slate-200">Tanggal</th>
                  <th className="px-6 py-4 border-b border-slate-200">Metode</th>
                  <th className="px-6 py-4 border-b border-slate-200 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {myTithes.length > 0 ? (
                  myTithes.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">{new Date(t.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold">{t.method}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-900">Rp {t.amount.toLocaleString('id-ID')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400 text-sm italic">
                      Belum ada riwayat persembahan yang tercatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Information Footer */}
      <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex gap-4">
        <div className="p-3 bg-white text-indigo-700 rounded-2xl shadow-sm shrink-0 h-fit">
          <Info size={24} />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900">Transparansi Keuangan</h4>
          <p className="text-sm text-indigo-700 leading-relaxed mt-1">
             Gereja berkomitmen untuk mengelola setiap persembahan dengan jujur dan terbuka. Laporan di atas mencakup seluruh aktivitas keuangan gereja untuk mendukung operasional, misi, dan bantuan sosial.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JemaatFinances;
