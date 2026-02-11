
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Plus, Search, Wallet, ArrowUpRight, Filter } from 'lucide-react';

const AdminTithes: React.FC = () => {
  const context = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  if (!context) return null;
  const { state } = context;

  const filteredTithes = state.titheData.filter(t => 
    t.jemaatName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTithes = state.titheData.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Persepuluhan Jemaat</h1>
          <p className="text-slate-500">Mencatat dan mengelola kontribusi persepuluhan.</p>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-600/20">
          <Plus size={20} /> Entri Baru
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-indigo-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Akumulasi Bulan Ini</p>
            <p className="text-2xl font-bold text-slate-900">Rp {totalTithes.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold">+12% vs Bulan Lalu</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Cari jemaat..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>
          <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600"><Filter size={20}/></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-200">Jemaat</th>
                <th className="px-6 py-4 border-b border-slate-200">Tanggal</th>
                <th className="px-6 py-4 border-b border-slate-200">Metode</th>
                <th className="px-6 py-4 border-b border-slate-200 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTithes.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">{t.jemaatName.charAt(0)}</div>
                      <p className="font-bold text-slate-900">{t.jemaatName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800 font-medium">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-lg font-bold text-xs ${t.method === 'Transfer' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                      {t.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">Rp {t.amount.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTithes;
