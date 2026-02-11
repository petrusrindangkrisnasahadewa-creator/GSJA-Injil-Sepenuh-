
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Users, ShieldCheck, ArrowRight, Church, Lock, X, Eye, EyeOff } from 'lucide-react';

const LandingPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  
  if (!context) return null;
  const { state, setState } = context;
  const slides = state.slideshowData;
  const { churchInfo } = state;

  // Auto-slide logic
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleAdminClick = () => {
    setIsAuthModalOpen(true);
    setError('');
    setPassword('');
    setShowPassword(false);
  };

  const verifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === state.adminPassword) {
      setState(prev => ({ ...prev, role: 'ADMIN' }));
      navigate('/admin');
    } else {
      setError('Password salah!');
    }
  };

  const selectJemaat = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {slides.length > 0 ? (
          slides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={slide.url} 
                alt={slide.caption}
                className="w-full h-full object-cover"
              />
              {/* Dark Overlay for readability */}
              <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/90 via-black/50 to-black/40" />
            </div>
          ))
        ) : (
          // Fallback Background if no images
          <>
            <div className="absolute inset-0 bg-slate-900" />
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-red-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-red-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </>
        )}
      </div>

      <div className="relative z-10 w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          {/* LOGO CONTAINER: Removed white background, increased size to w-48 h-48 */}
          <div className="w-48 h-48 mx-auto flex items-center justify-center mb-6 relative">
            {churchInfo.logoUrl ? (
               <img 
                 src={churchInfo.logoUrl} 
                 alt="Logo Gereja" 
                 className="w-full h-full object-contain drop-shadow-2xl filter" 
               />
            ) : (
               <Church size={100} className="text-white drop-shadow-lg" />
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">{churchInfo.name}</h1>
            <p className="text-slate-200 text-lg drop-shadow-md mt-2">Sistem Informasi Gereja Terpadu</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={selectJemaat}
            className="w-full group bg-white/95 hover:bg-white active:scale-95 transition-all p-1.5 rounded-3xl pr-6 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-red-700 p-5 rounded-[1.25rem] text-white shadow-lg group-hover:shadow-red-600/30 transition-shadow">
                <Users size={28} />
              </div>
              <div className="text-left flex-1 py-3">
                <p className="font-bold text-slate-900 text-lg">Portal Jemaat</p>
                <p className="text-slate-500 text-sm">Masuk atau Daftar Baru</p>
              </div>
              <ArrowRight className="text-slate-300 group-hover:text-red-700 transition-colors" />
            </div>
          </button>

          <button 
            onClick={handleAdminClick}
            className="w-full group bg-slate-900/40 hover:bg-slate-900/60 border border-white/10 active:scale-95 transition-all p-1.5 rounded-3xl pr-6 backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-800/80 p-5 rounded-[1.25rem] text-slate-300 group-hover:text-white transition-colors">
                <ShieldCheck size={28} />
              </div>
              <div className="text-left flex-1 py-3">
                <p className="font-bold text-slate-100 text-lg">Portal Admin</p>
                <p className="text-slate-300 text-sm">Kelola data & operasional gereja</p>
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-white transition-colors" />
            </div>
          </button>
        </div>

        <div className="text-center">
          <p className="text-white/40 text-sm">© 2024 {churchInfo.name}. v1.0.0</p>
        </div>
      </div>

      {/* Admin Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAuthModalOpen(false)} />
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsAuthModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-600">
                <Lock size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Admin Login</h2>
            </div>

            <form onSubmit={verifyPassword} className="space-y-4">
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none text-center font-bold text-slate-900 pr-12"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}
              <button 
                type="submit"
                className="w-full bg-red-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-700/20 hover:bg-red-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Masuk
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
