
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownRight, Printer, Filter, Download, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'IN' | 'OUT';
}

const AdminFinancialReport: React.FC = () => {
  const context = useContext(AppContext);
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  
  if (!context) return null;
  const { state } = context;

  // Combine Tithes and Expenses into a single sorted list
  const transactions: Transaction[] = [
    ...state.titheData.map(t => ({
      id: t.id,
      date: t.date,
      description: `Persepuluhan - ${t.jemaatName}`,
      category: t.method, // Using method as category for tithes
      amount: t.amount,
      type: 'IN' as const
    })),
    ...state.expenseData.map(e => ({
      id: e.id,
      date: e.date,
      description: e.description,
      category: e.category,
      amount: e.amount,
      type: 'OUT' as const
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  const totalIn = state.titheData.reduce((sum, item) => sum + item.amount, 0);
  const totalOut = state.expenseData.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIn - totalOut;

  // --- CHART DATA PREPARATION ---
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { name: string, income: number, expense: number, dateObj: Date } } = {};

    // Helper to normalize month key (YYYY-MM)
    const getMonthKey = (dateStr: string) => dateStr.substring(0, 7);

    // Process Income
    state.titheData.forEach(t => {
      const key = getMonthKey(t.date);
      if (!monthlyData[key]) {
        const d = new Date(t.date);
        monthlyData[key] = {
          name: d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
          income: 0,
          expense: 0,
          dateObj: d
        };
      }
      monthlyData[key].income += t.amount;
    });

    // Process Expense
    state.expenseData.forEach(e => {
      const key = getMonthKey(e.date);
      if (!monthlyData[key]) {
        const d = new Date(e.date);
        monthlyData[key] = {
          name: d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
          income: 0,
          expense: 0,
          dateObj: d
        };
      }
      monthlyData[key].expense += e.amount;
    });

    // Convert to array, sort by date, and take last 6 months
    return Object.values(monthlyData)
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
      .slice(-6); // Show last 6 months
  }, [state.titheData, state.expenseData]);


  const handleExportCSV = () => {
    // Define Headers
    const headers = ['Tanggal', 'Keterangan', 'Kategori', 'Tipe', 'Nominal'];
    
    // Map Data to CSV Rows
    const rows = filteredTransactions.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
      t.category,
      t.type === 'IN' ? 'Pemasukan' : 'Pengeluaran',
      t.amount
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create Blob and Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Keuangan_GSJA_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
         <Link to="/admin" className="p-2 rounded-xl bg-white border border-gray-200 text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} />
         </Link>
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Laporan Keuangan Lengkap</h1>
            <p className="text-slate-500">Rincian seluruh arus kas masuk dan keluar.</p>
         </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
                <span className="text-slate-500 font-bold text-sm">Total Pemasukan</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ArrowUpRight size={20} /></div>
            </div>
            <p className="text-2xl font-black text-emerald-600">Rp {totalIn.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
                <span className="text-slate-500 font-bold text-sm">Total Pengeluaran</span>
                <div className="p-2 bg-red-50 text-red-600 rounded-lg"><ArrowDownRight size={20} /></div>
            </div>
            <p className="text-2xl font-black text-red-600">Rp {totalOut.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-600/20 text-white flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
                <span className="text-indigo-100 font-bold text-sm">Saldo Akhir</span>
                <div className="p-2 bg-white/10 text-white rounded-lg"><Wallet size={20} /></div>
            </div>
            <p className="text-3xl font-black">Rp {balance.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
               <BarChart2 className="text-indigo-600" size={20} />
               Arus Kas Bulanan (6 Bulan Terakhir)
            </h3>
         </div>
         <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
               >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                     dataKey="name" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{fill: '#64748b', fontSize: 12}} 
                     dy={10}
                  />
                  <YAxis 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{fill: '#64748b', fontSize: 12}} 
                     tickFormatter={(value) => `${value/1000}k`}
                  />
                  <Tooltip 
                     cursor={{fill: '#f8fafc'}}
                     contentStyle={{
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        padding: '12px'
                     }}
                     formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
                  />
                  <Legend 
                     iconType="circle" 
                     wrapperStyle={{paddingTop: '20px'}}
                  />
                  <Bar 
                     name="Pemasukan" 
                     dataKey="income" 
                     fill="#10b981" 
                     radius={[6, 6, 0, 0]} 
                     barSize={30}
                  />
                  <Bar 
                     name="Pengeluaran" 
                     dataKey="expense" 
                     fill="#ef4444" 
                     radius={[6, 6, 0, 0]} 
                     barSize={30}
                  />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Report Table Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
         {/* Toolbar */}
         <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl border border-gray-200">
                <button 
                  onClick={() => setFilterType('ALL')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'ALL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Semua
                </button>
                <button 
                  onClick={() => setFilterType('IN')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'IN' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Pemasukan
                </button>
                <button 
                   onClick={() => setFilterType('OUT')}
                   className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'OUT' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Pengeluaran
                </button>
             </div>

             <div className="flex gap-2">
               <button 
                  onClick={handleExportCSV} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-colors"
                >
                  <Download size={18} /> Export CSV
                </button>
               <button 
                 onClick={() => window.print()} 
                 className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
               >
                  <Printer size={18} /> Cetak
               </button>
             </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-gray-100">
                  <tr>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori/Metode</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Nominal</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                              {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">
                              {t.description}
                          </td>
                          <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${t.type === 'IN' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                 {t.category}
                              </span>
                          </td>
                          <td className={`px-6 py-4 text-right font-black ${t.type === 'IN' ? 'text-emerald-600' : 'text-red-600'}`}>
                              {t.type === 'IN' ? '+ ' : '- '} 
                              Rp {t.amount.toLocaleString('id-ID')}
                          </td>
                      </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         {filteredTransactions.length === 0 && (
             <div className="p-12 text-center text-slate-400 italic">
                 Tidak ada data transaksi yang ditemukan.
             </div>
         )}
      </div>
    </div>
  );
};

export default AdminFinancialReport;
