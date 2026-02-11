
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Plus, ArrowDownRight, Tag, Calendar, MoreVertical } from 'lucide-react';

const AdminExpenses: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { state } = context;

  const totalExpenses = state.expenseData.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dana Keluar</h1>
          <p className="text-slate-500">Pengelolaan dana sosial, misi, dan operasional gereja.</p>
        </div>
        <button className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-shadow shadow-lg shadow-red-600/20">
          <Plus size={20} /> Catat Pengeluaran
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
            <ArrowDownRight size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pengeluaran</p>
            <p className="text-2xl font-bold text-slate-900">Rp {totalExpenses.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <div className="md:col-span-2 bg-slate-900 p-6 rounded-3xl text-white flex items-center justify-between overflow-hidden relative">
           <div className="relative z-10">
             <p className="text-slate-400 text-sm">Alokasi Terbesar Bulan Ini</p>
             <h3 className="text-xl font-bold">Bantuan Sosial & Misi</h3>
             <p className="text-xs text-indigo-400 mt-1">65% dari total dana keluar</p>
           </div>
           <ArrowDownRight size={80} className="absolute right-[-10px] bottom-[-10px] text-white/5" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-200">Deskripsi / Kategori</th>
                <th className="px-6 py-4 border-b border-slate-200">Tanggal</th>
                <th className="px-6 py-4 border-b border-slate-200 text-right">Jumlah</th>
                <th className="px-6 py-4 border-b border-slate-200"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {state.expenseData.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-900">{e.description}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold mt-1">
                        <Tag size={12} /> {e.category}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-800 font-medium">
                      <Calendar size={14} /> {new Date(e.date).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-red-600">Rp {e.amount.toLocaleString('id-ID')}</td>
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
  );
};

export default AdminExpenses;
