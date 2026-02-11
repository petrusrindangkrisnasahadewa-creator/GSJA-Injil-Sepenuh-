
import React, { useState, useRef, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { Camera, RefreshCw, CheckCircle, XCircle, Info, History } from 'lucide-react';

const AdminScanner: React.FC = () => {
  const context = useContext(AppContext);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<{success: boolean, message: string} | null>(null);
  const [scannedHistory, setScannedHistory] = useState<{name: string, time: string}[]>([]);

  if (!context) return null;
  const { state, setState } = context;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Tidak dapat mengakses kamera. Pastikan izin telah diberikan.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    const tracks = stream?.getTracks();
    tracks?.forEach(track => track.stop());
    setIsScanning(false);
  };

  // Simulation of a scan process since real QR decoding requires a heavy library
  const handleSimulateScan = () => {
    const randomMember = state.jemaatData[Math.floor(Math.random() * state.jemaatData.length)];
    const now = new Date();
    
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      jemaatId: randomMember.id,
      jemaatName: randomMember.name,
      jadwalId: 'J001',
      timestamp: now.toISOString()
    };

    setState(prev => ({
      ...prev,
      attendanceData: [newRecord, ...prev.attendanceData]
    }));

    setLastScanResult({ 
      success: true, 
      message: `Berhasil mencatat kehadiran: ${randomMember.name}` 
    });

    setScannedHistory(prev => [{
      name: randomMember.name,
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }, ...prev].slice(0, 5));

    setTimeout(() => setLastScanResult(null), 3000);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Scan Absensi Jemaat</h1>
        <p className="text-slate-500">Arahkan kamera ke QR Code yang dimiliki jemaat.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Scanner Viewport */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl group">
            {isScanning ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-100">
                <div className="p-6 bg-white rounded-full shadow-md mb-4 text-slate-300">
                  <Camera size={64} />
                </div>
                <p className="font-semibold">Kamera Tidak Aktif</p>
              </div>
            )}

            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-indigo-400/50 rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl" />
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scan-line" />
                </div>
              </div>
            )}

            {/* Status Alert Overlay */}
            {lastScanResult && (
              <div className={`absolute inset-x-0 top-0 p-4 transition-all animate-in slide-in-from-top duration-300`}>
                <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-xl ${
                  lastScanResult.success ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {lastScanResult.success ? <CheckCircle size={24} /> : <XCircle size={24} />}
                  <p className="font-bold">{lastScanResult.message}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {!isScanning ? (
              <button 
                onClick={startCamera}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                Aktifkan Kamera
              </button>
            ) : (
              <button 
                onClick={stopCamera}
                className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
              >
                Matikan Kamera
              </button>
            )}
            
            <button 
              onClick={handleSimulateScan}
              className="px-6 bg-amber-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all flex items-center justify-center"
              title="Simulasikan Scan (Demo)"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* History / Info Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <History size={18} className="text-indigo-600" />
              Baru Saja Masuk
            </h3>
            <div className="space-y-4">
              {scannedHistory.length > 0 ? (
                scannedHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-right duration-500" style={{animationDelay: `${i * 100}ms`}}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {h.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{h.name}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400">{h.time} WIB</span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 italic text-sm">
                  Belum ada absensi tercatat
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 space-y-3">
            <h4 className="font-bold text-indigo-900 flex items-center gap-2 text-sm">
              <Info size={16} />
              Petunjuk Penggunaan
            </h4>
            <ul className="text-xs text-indigo-700 space-y-2 leading-relaxed list-disc pl-4">
              <li>Pastikan ruangan memiliki pencahayaan cukup.</li>
              <li>Arahkan QR jemaat tepat di tengah kotak bidik.</li>
              <li>Sistem akan otomatis mencatat kehadiran jika QR valid.</li>
              <li>Gunakan tombol "Refresh" kuning untuk simulasi jika kamera bermasalah.</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminScanner;
