
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Plus, Search, Wallet, ArrowUpRight, ArrowDownRight, Filter, Tag, Calendar, MoreVertical, TrendingUp } from 'lucide-react';
import { Tithe, Expense } from '../types';

const AdminFinance: React.FC = () => {
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Expense Filter
  const [expenseFilter, setExpenseFilter] = useState<'ALL' | 'Misi' | 'Sosial' | 'Operasional' | 'Pembangunan'>('ALL');

  if (!context) return null;
  const { state, setState } = context;

  // --- Calculations ---
  const totalTithes = state.titheData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = state.expenseData.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalTithes - totalExpenses;

  // --- Filtering ---
  const filteredTithes = state.titheData.filter(t => 
    t.jemaatName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExpenses = state.expenseData.filter(e => {
      const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = expenseFilter === 'ALL' || e.category === expenseFilter;
      return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Keuangan Gereja</h1>
          <p className="text-slate-500">Kelola pemasukan persepuluhan dan pengeluaran operasional.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setActiveTab('INCOME')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'INCOME' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
                <ArrowUpRight size={16} /> Pemasukan
            </button>
            <button 
                onClick={() => setActiveTab('EXPENSE')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'EXPENSE' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
                <ArrowDownRight size={16} /> Pengeluaran
            </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 flex items-center gap-4 shadow-sm">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <ArrowUpRight size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">Total Pemasukan</p>
                <p className="text-xl font-bold text-slate-900">Rp {totalTithes.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-red-100 flex items-center gap-4 shadow-sm">
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
                <ArrowDownRight size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">Total Pengeluaran</p>
                <p className="text-xl font-bold text-slate-900">Rp {totalExpenses.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <div className="bg-indigo-600 p-6 rounded-3xl text-white flex items-center justify-between relative overflow-hidden shadow-lg shadow-indigo-600/20">
             <div className="relative z-10">
                 <p className="text-indigo-200 text-sm font-medium">Saldo Kas Saat Ini</p>
                 <p className="text-2xl font-black mt-1">Rp {balance.toLocaleString('id-ID')}</p>
             </div>
             <Wallet size={64} className="absolute -right-4 -bottom-4 text-white opacity-10" />
          </div>
      </div>

      {/* --- INCOME TAB --- */}
      {activeTab === 'INCOME' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Riwayat Persepuluhan</h3>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                    <Plus size={16} /> Catat Pemasukan
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                        type="text" placeholder="Cari nama jemaat..." 
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 text-sm"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Jemaat</th>
                                <th className="px-6 py-4">Tanggal</th>
                                <th className="px-6 py-4">Metode</th>
                                <th className="px-6 py-4 text-right">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredTithes.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">{t.jemaatName.charAt(0)}</div>
                                <p className="font-bold text-slate-900 text-sm">{t.jemaatName}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                            <td className="px-6 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-lg font-bold text-xs ${t.method === 'Transfer' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                                {t.method}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-slate-900">Rp {t.amount.toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {/* --- EXPENSE TAB --- */}
      {activeTab === 'EXPENSE' && (
         <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Riwayat Pengeluaran</h3>
                <button className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-700 transition-colors">
                    <Plus size={16} /> Catat Pengeluaran
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                        type="text" placeholder="Cari deskripsi pengeluaran..." 
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 text-sm"
                        />
                    </div>
                    {/* Category Filter */}
                    <div className="relative min-w-[150px] w-full sm:w-auto">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select 
                            value={expenseFilter}
                            onChange={(e) => setExpenseFilter(e.target.value as any)}
                            className="w-full pl-9 pr-8 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 text-sm font-bold appearance-none cursor-pointer"
                        >
                            <option value="ALL">Semua Kategori</option>
                            <option value="Operasional">Operasional</option>
                            <option value="Sosial">Sosial</option>
                            <option value="Misi">Misi</option>
                            <option value="Pembangunan">Pembangunan</option>
                        </select>
                        <ArrowDownRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Deskripsi / Kategori</th>
                            <th className="px-6 py-4">Tanggal</th>
                            <th className="px-6 py-4 text-right">Jumlah</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredExpenses.map((e) => (
                            <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div>
                                <p className="font-bold text-slate-900 text-sm">{e.description}</p>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold mt-1 bg-slate-100 w-fit px-2 py-0.5 rounded-full uppercase">
                                    <Tag size={10} /> {e.category}
                                </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                                <Calendar size={14} /> {new Date(e.date).toLocaleDateString('id-ID')}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-red-600">Rp {e.amount.toLocaleString('id-ID')}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical size={16}/></button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AdminFinance;
