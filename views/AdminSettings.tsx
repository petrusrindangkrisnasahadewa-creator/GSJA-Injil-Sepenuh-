
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const context = useContext(AppContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [status, setStatus] = useState<{type: 'success' | 'error' | null, message: string}>({ type: null, message: '' });

  if (!context) return null;
  const { state, setState } = context;

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    // Validation
    if (currentPassword !== state.adminPassword) {
      setStatus({ type: 'error', message: 'Password saat ini salah.' });
      return;
    }

    if (newPassword.length < 6) {
        setStatus({ type: 'error', message: 'Password baru minimal 6 karakter.' });
        return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    // Update state
    setState(prev => ({
      ...prev,
      adminPassword: newPassword
    }));

    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setStatus({ type: 'success', message: 'Password berhasil diperbarui!' });

    // Clear success message after 3 seconds
    setTimeout(() => {
        setStatus({ type: null, message: '' });
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-500">Kelola keamanan dan konfigurasi akun admin.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
           <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
             <Lock size={24} />
           </div>
           <div>
             <h2 className="text-lg font-bold text-slate-900">Ubah Password Admin</h2>
             <p className="text-sm text-slate-500">Perbarui kata sandi untuk masuk ke portal admin.</p>
           </div>
        </div>
        
        <div className="p-8">
            {status.message && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold text-sm">{status.message}</span>
                </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Password Saat Ini</label>
                    <div className="relative">
                        <input 
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 font-bold pr-12"
                            placeholder="Masukkan password lama"
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Password Baru</label>
                        <div className="relative">
                            <input 
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 font-bold pr-12"
                                placeholder="Minimal 6 karakter"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Konfirmasi Password</label>
                        <div className="relative">
                            <input 
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 font-bold pr-12"
                                placeholder="Ulangi password baru"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit"
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/10"
                    >
                        <Save size={20} />
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
