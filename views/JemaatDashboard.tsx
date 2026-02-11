
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { Calendar, BookOpen, MessageSquare, QrCode, ArrowRight, Heart, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

const JemaatDashboard: React.FC = () => {
  const context = useContext(AppContext);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!context) return null;
  const { state } = context;

  // Protect route
  if (!state.currentUser) {
    return <Navigate to="/login" />;
  }

  const upcomingJadwal = state.jadwalData[0];
  const latestRenungan = state.renunganData[0];
  const userName = state.currentUser.name.split(' ')[0]; // Get first name
  const slides = state.slideshowData;

  // Auto-slide effect
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      
      {/* Slideshow Carousel */}
      {slides.length > 0 && (
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl overflow-hidden shadow-xl bg-slate-200">
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img 
                src={slide.url} 
                alt={slide.caption}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Gereja+GSJA' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-lg md:text-2xl font-bold">{slide.caption}</h3>
                </div>
              </div>
            </div>
          ))}

          {/* Controls */}
          {slides.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-colors">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-colors">
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                {slides.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`} 
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Welcome Section */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Shalom, {userName}!</h2>
          <p className="text-slate-500 max-w-lg">Selamat datang di sistem informasi terpadu GSJA Injil Sepenuh. Siapkan hati untuk beribadah dan melayani Tuhan.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/profile" className="bg-red-700 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-800 transition-shadow shadow-lg shadow-red-700/20">
            <QrCode size={18} />
            Absensi
          </Link>
          <Link to="/finances" className="bg-red-50 text-red-700 px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition-colors">
            <Wallet size={18} />
            Keuangan & Persembahan
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Access Card - Jadwal */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Ibadah Terdekat</h3>
            </div>
            <Link to="/schedule" className="text-red-700 font-medium hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>
          
          {upcomingJadwal ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-amber-600 font-bold text-lg">{upcomingJadwal.type}</p>
                <div className="flex justify-between mt-1 text-slate-600">
                  <span>{new Date(upcomingJadwal.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  <span className="font-semibold">{upcomingJadwal.time} WIB</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Pembicara</p>
                  <p className="font-semibold text-slate-800">{upcomingJadwal.preacher}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 italic">Belum ada jadwal terdaftar.</p>
          )}
        </div>

        {/* Quick Access Card - Renungan */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 text-red-700 rounded-2xl">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Renungan Hari Ini</h3>
            </div>
            <Link to="/devotional" className="text-red-700 font-medium hover:underline flex items-center gap-1">
              Baca Lainnya <ArrowRight size={16} />
            </Link>
          </div>

          {latestRenungan ? (
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-slate-900 leading-tight">{latestRenungan.title}</h4>
              <p className="text-sm font-medium text-red-700">{latestRenungan.verse}</p>
              <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed italic">"{latestRenungan.content}"</p>
              <div className="pt-2">
                <p className="text-xs text-slate-400">Oleh: {latestRenungan.author}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 italic">Belum ada renungan hari ini.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JemaatDashboard;
