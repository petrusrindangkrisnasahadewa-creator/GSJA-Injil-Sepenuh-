
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { MessageSquare, Calendar, User, CheckCircle } from 'lucide-react';

const AdminFeedback: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { state } = context;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pesan & Kesan Jemaat</h1>
          <p className="text-slate-500">Melihat apa yang jemaat katakan tentang pelayanan gereja.</p>
        </div>
        <div className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <CheckCircle size={14} /> Terbaca Semua
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.feedbackData.length > 0 ? (
          state.feedbackData.map((f) => (
            <div key={f.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{f.name}</p>
                    <p className="text-xs text-slate-500 font-bold">Jemaat Umum</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                  <Calendar size={14} />
                  {new Date(f.createdAt).toLocaleDateString('id-ID')}
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-800 text-sm leading-relaxed font-medium">
                "{f.message}"
              </div>

              <div className="flex justify-end gap-2">
                <button className="text-xs font-bold text-indigo-600 hover:underline">Tandai sudah dibaca</button>
                <span className="text-slate-200">|</span>
                <button className="text-xs font-bold text-slate-400 hover:text-red-500">Hapus</button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4">
             <div className="p-6 bg-slate-50 rounded-full text-slate-300">
               <MessageSquare size={48} />
             </div>
             <p className="text-slate-400 font-medium">Belum ada pesan yang masuk saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
