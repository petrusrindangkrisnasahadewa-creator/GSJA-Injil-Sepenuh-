
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, UserPlus, Church, MapPin, User, ChevronLeft, AlertCircle, Calendar } from 'lucide-react';
import { Jemaat, Notification } from '../types';

const JemaatLogin: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // State khusus untuk input tanggal lahir mentah (DDMMYYYY)
  const [rawBirthDate, setRawBirthDate] = useState('');

  const [registerData, setRegisterData] = useState({ 
      name: '', 
      address: '',
      birthPlace: '',
      birthDate: '', // Format sistem: YYYY-MM-DD
      isBaptized: false
  });
  const [error, setError] = useState('');

  if (!context) return null;
  const { state, setState } = context;

  const handleLoginCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber) {
      setError('Mohon masukkan nomor HP');
      return;
    }

    const cleanPhone = phoneNumber.trim();
    const existingUser = state.jemaatData.find(j => j.phone === cleanPhone);

    if (existingUser) {
      setState(prev => ({
        ...prev,
        role: 'JEMAAT',
        currentUser: existingUser
      }));
      navigate('/dashboard');
    } else {
      setIsRegistering(true);
      setError(''); 
    }
  };

  // Handler khusus untuk input tanggal lahir DDMMYYYY
  const handleRawDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // Hapus non-angka
    if (input.length > 8) return; // Batasi 8 karakter

    setRawBirthDate(input);

    // Jika panjang 8 digit, coba parsing
    if (input.length === 8) {
        const day = input.substring(0, 2);
        const month = input.substring(2, 4);
        const year = input.substring(4, 8);

        const numDay = parseInt(day);
        const numMonth = parseInt(month);
        const numYear = parseInt(year);

        // Validasi logika tanggal sederhana
        if (numMonth >= 1 && numMonth <= 12 && numDay >= 1 && numDay <= 31 && numYear > 1900) {
            // Simpan ke format ISO YYYY-MM-DD untuk backend
            setRegisterData(prev => ({...prev, birthDate: `${year}-${month}-${day}`}));
        } else {
            setRegisterData(prev => ({...prev, birthDate: ''}));
        }
    } else {
        // Reset jika belum lengkap
        setRegisterData(prev => ({...prev, birthDate: ''}));
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.name || !registerData.address || !registerData.birthPlace || !registerData.birthDate) {
      if (!registerData.birthDate && rawBirthDate.length === 8) {
          setError('Format tanggal lahir tidak valid. Gunakan format: Tanggal-Bulan-Tahun (Contoh: 30071994)');
      } else {
          setError('Mohon lengkapi semua data diri.');
      }
      return;
    }

    const maxId = state.jemaatData.reduce((max, user) => {
        const numStr = user.id.replace('JM', '');
        const num = parseInt(numStr);
        return !isNaN(num) && num > max ? num : max;
    }, 0);

    const nextId = maxId + 1;
    const newId = `JM${nextId.toString().padStart(3, '0')}`;
    
    const newUser: Jemaat = {
      id: newId,
      name: registerData.name,
      address: registerData.address,
      phone: phoneNumber,
      joinedAt: new Date().toISOString().split('T')[0],
      photoUrl: '',
      birthPlace: registerData.birthPlace,
      birthDate: registerData.birthDate,
      isBaptized: registerData.isBaptized
    };

    const newNotif: Notification = {
        id: `N-${Date.now()}`,
        title: 'Pendaftaran Jemaat Baru',
        message: `${newUser.name} baru saja mendaftar ke dalam sistem.`,
        type: 'REGISTRATION',
        isRead: false,
        createdAt: new Date().toISOString(),
        linkTo: '/admin/members'
    };

    setState(prev => ({
      ...prev,
      jemaatData: [newUser, ...prev.jemaatData],
      notifications: [newNotif, ...prev.notifications],
      role: 'JEMAAT',
      currentUser: newUser
    }));

    navigate('/dashboard');
  };

  const handleBackToLogin = () => {
    setIsRegistering(false);
    setError('');
  };

  // Helper untuk menampilkan tanggal cantik di bawah input
  const getFormattedDatePreview = () => {
      if (registerData.birthDate) {
          return new Date(registerData.birthDate).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
          });
      }
      return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 relative z-10 transition-all duration-300">
        
        {/* Tombol Kembali (Navigasi) */}
        <button 
            onClick={() => isRegistering ? handleBackToLogin() : navigate('/')} 
            className="absolute top-6 left-6 p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
        >
            <ChevronLeft size={24} />
        </button>

        {/* Header Section */}
        <div className="text-center mb-8 pt-6">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-700 shadow-sm border border-red-100">
             {isRegistering ? <UserPlus size={32} /> : <Church size={32} />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isRegistering ? 'Pendaftaran Jemaat' : 'Portal Jemaat'}
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed px-4">
            {isRegistering 
              ? 'Lengkapi data diri Anda untuk bergabung dalam komunitas.' 
              : 'Masuk menggunakan nomor Handphone yang terdaftar.'}
          </p>
        </div>

        {/* --- FORM LOGIN (INPUT NO HP) --- */}
        {!isRegistering ? (
          <form onSubmit={handleLoginCheck} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 ml-1">Nomor Handphone</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" size={20} />
                <input 
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-red-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-700/20 hover:bg-red-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Lanjutkan
              <ArrowRight size={20} />
            </button>
          </form>
        ) : (
          
          /* --- FORM REGISTRASI --- */
          <form onSubmit={handleRegister} className="space-y-5 animate-in slide-in-from-right duration-300">
            
            {/* Info Box */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 items-start">
                <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-slate-700">
                    <p className="font-medium mb-1">Nomor tidak ditemukan.</p>
                    <p>Silakan mendaftar menggunakan nomor <span className="font-bold text-slate-900">{phoneNumber}</span>.</p>
                </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800 ml-1">Nama Lengkap</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" size={20} />
                  <input 
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    placeholder="Nama sesuai KTP"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                    autoFocus
                  />
                </div>
              </div>

              {/* Data Kelahiran */}
              <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 ml-1">Tempat Lahir</label>
                  <div className="relative group">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                          type="text"
                          value={registerData.birthPlace}
                          onChange={(e) => setRegisterData({...registerData, birthPlace: e.target.value})}
                          placeholder="Kota Lahir"
                          className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-slate-900 text-sm font-medium"
                      />
                  </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 ml-1">Tanggal Lahir</label>
                  <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                          type="tel" // Numeric keypad on mobile
                          maxLength={8}
                          value={rawBirthDate}
                          onChange={handleRawDateChange}
                          placeholder="DDMMYYYY (Contoh: 30071994)"
                          className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-slate-900 text-sm font-medium tracking-wide"
                      />
                  </div>
                  {/* Visual Feedback for Date */}
                  {rawBirthDate.length > 2 ? (
                      <p className={`text-[11px] font-bold ml-1 transition-all ${registerData.birthDate ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {registerData.birthDate ? (
                             <span>Terbaca: {getFormattedDatePreview()}</span>
                          ) : (
                             <span>Format: Tanggal-Bulan-Tahun (30071994)</span>
                          )}
                      </p>
                  ) : (
                      <p className="text-[10px] text-slate-400 ml-1">Ketik angka saja, contoh: 30071994</p>
                  )}
              </div>

              {/* Status Baptis */}
              <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-800 ml-1">Status Baptis Air</label>
                  <div className="grid grid-cols-2 gap-3">
                      <div 
                          onClick={() => setRegisterData({...registerData, isBaptized: true})}
                          className={`cursor-pointer p-3 rounded-xl border flex items-center gap-2 transition-all ${registerData.isBaptized ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                      >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${registerData.isBaptized ? 'border-red-600' : 'border-slate-400'}`}>
                             {registerData.isBaptized && <div className="w-2 h-2 rounded-full bg-red-600" />}
                          </div>
                          <span className="text-sm font-bold">Sudah Baptis</span>
                      </div>
                      <div 
                          onClick={() => setRegisterData({...registerData, isBaptized: false})}
                          className={`cursor-pointer p-3 rounded-xl border flex items-center gap-2 transition-all ${!registerData.isBaptized ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                      >
                           <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!registerData.isBaptized ? 'border-red-600' : 'border-slate-400'}`}>
                             {!registerData.isBaptized && <div className="w-2 h-2 rounded-full bg-red-600" />}
                          </div>
                          <span className="text-sm font-bold">Belum Baptis</span>
                      </div>
                  </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-800 ml-1">Alamat Domisili</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-red-600 transition-colors" size={20} />
                  <textarea 
                    rows={2}
                    value={registerData.address}
                    onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                    placeholder="Jalan, RT/RW, Kelurahan..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none resize-none font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400 text-sm"
                  ></textarea>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center font-bold bg-red-50 py-2 rounded-lg">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-red-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-700/20 hover:bg-red-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Daftar Sekarang
              <UserPlus size={20} />
            </button>
          </form>
        )}
      </div>
      
      {/* Footer Text */}
      <div className="mt-8 text-center text-slate-400 text-xs">
        <p>© 2024 GSJA Injil Sepenuh</p>
        <p className="mt-1">Sistem Informasi Gereja Terpadu</p>
      </div>
    </div>
  );
};

export default JemaatLogin;
