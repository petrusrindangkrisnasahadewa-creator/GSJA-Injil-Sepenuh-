
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Send, MessageCircle, Star, Sparkles } from 'lucide-react';

const JemaatFeedback: React.FC = () => {
  const context = useContext(AppContext);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!context) return null;
  const { setState } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    const newFeedback = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'Anonymous',
      message,
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      feedbackData: [newFeedback, ...prev.feedbackData]
    }));

    setSubmitted(true);
    setName('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-full">
          <MessageCircle size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Pesan & Kesan</h1>
        <p className="text-slate-500 max-w-md mx-auto">Masukan Anda sangat berharga bagi pertumbuhan pelayanan kami di GSJA Injil Sepenuh.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-xl">
        {submitted ? (
          <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Sparkles size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Terima Kasih!</h2>
              <p className="text-slate-500">Pesan Anda telah kami terima dan akan menjadi bahan evaluasi kami.</p>
            </div>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-indigo-600 font-bold hover:underline"
            >
              Kirim masukan lagi
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Nama (Opsional)</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Pesan & Kesan Anda</label>
              <textarea 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Apa yang bisa kami tingkatkan? Apa yang memberkati Anda hari ini?"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Kirim Masukan
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Star, label: "Pelayanan", desc: "Ramah & Melayani" },
          { icon: Star, label: "Fasilitas", desc: "Nyaman & Bersih" },
          { icon: Star, label: "Ibadah", desc: "Hikmat & Teduh" }
        ].map((item, i) => (
          <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center space-y-2">
             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto text-amber-500 shadow-sm">
               <item.icon size={20} />
             </div>
             <p className="font-bold text-slate-900 text-sm">{item.label}</p>
             <p className="text-xs text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JemaatFeedback;
