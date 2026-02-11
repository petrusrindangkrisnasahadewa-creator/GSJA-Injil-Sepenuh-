
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { MapPin, Phone, Mail, Church } from 'lucide-react';

const JemaatChurchInfo: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { state } = context;
  const { churchInfo, pastoralTeam } = state;

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-8">
      
      {/* Header Profile */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-32 bg-indigo-600 opacity-10"></div>
         <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg mb-4">
              {churchInfo.logoUrl ? (
                <img src={churchInfo.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="w-full h-full bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Church size={40} /></div>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{churchInfo.name}</h1>
            <p className="text-slate-500 mt-2 max-w-lg">{churchInfo.address}</p>
            
            <a 
              href={`https://wa.me/${churchInfo.whatsapp}`} 
              target="_blank" 
              rel="noreferrer"
              className="mt-6 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Phone size={18} /> Hubungi Sekretariat
            </a>
         </div>
      </div>

      {/* Visi & Misi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <h3 className="text-xl font-bold text-indigo-900 mb-4 border-b border-slate-100 pb-2">Visi Kami</h3>
           <p className="text-slate-700 leading-relaxed text-lg font-medium italic">
             "{churchInfo.vision}"
           </p>
        </div>
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-lg text-white">
           <h3 className="text-xl font-bold text-white mb-4 border-b border-white/20 pb-2">Misi Kami</h3>
           <div className="text-indigo-100 leading-relaxed whitespace-pre-wrap">
             {churchInfo.mission}
           </div>
        </div>
      </div>

      {/* Pastoral Team */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 px-2">Gembala & Staff Pastoral</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
           {pastoralTeam.map(pastor => (
             <div key={pastor.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 overflow-hidden border-4 border-indigo-50">
                  <img src={pastor.photoUrl} alt={pastor.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-slate-900">{pastor.name}</h4>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">{pastor.role}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-[2.5rem] p-4 border border-gray-100 shadow-sm space-y-4">
         <div className="px-4 pt-2">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
               <MapPin className="text-red-500" /> Lokasi Gereja
            </h3>
            <p className="text-slate-500 text-sm mt-1">{churchInfo.address}</p>
         </div>
         <div className="w-full h-64 bg-slate-100 rounded-3xl overflow-hidden">
            <iframe 
              src={churchInfo.mapEmbedUrl} 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
         </div>
      </div>

    </div>
  );
};

export default JemaatChurchInfo;
