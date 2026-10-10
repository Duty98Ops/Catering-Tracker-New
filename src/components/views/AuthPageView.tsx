import React, { useState } from 'react';
import {
  ChefHat,
  Users,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Flame,
  Layers
} from 'lucide-react';
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '../../firebase/authService';

interface AuthPageViewProps {
  onSelectGuest: () => void;
  onAuthSuccess: () => void;
  onCancel?: () => void;
}

export const AuthPageView: React.FC<AuthPageViewProps> = ({
  onSelectGuest,
  onAuthSuccess,
  onCancel,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      onAuthSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Jendela login ditutup sebelum selesai.');
      } else {
        setErrorMessage(err.message || 'Gagal masuk dengan Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Silakan isi email dan kata sandi.');
      return;
    }
    if (tab === 'signup' && password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      if (tab === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name);
      }
      onAuthSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMessage('Email atau kata sandi tidak cocok.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Email sudah terdaftar. Silakan pilih tab Masuk.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMessage('Metode Email/Password belum aktif. Anda dapat menggunakan tombol Google Sign-In.');
      } else {
        setErrorMessage(err.message || 'Terjadi kesalahan saat otentikasi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Left Hero Brand Panel (5 / 12) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            {onCancel && (
              <button
                onClick={onCancel}
                className="mb-4 inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
              >
                ← Kembali ke Dashboard
              </button>
            )}

            {/* Logo */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 ring-1 ring-white/20">
                <ChefHat className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-xl text-white tracking-tight">Catering</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-sky-400 font-medium">Cost Intelligence</p>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Pusat Kontrol Biaya &amp; Belanja Katering
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
              Pantau pengeluaran bahan pangan harian, efisiensi HPP porsi prasmanan, dan integrasi supplier katering secara real-time.
            </p>

            {/* Feature Points */}
            <div className="mt-8 space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white font-bold block">Mode Tamu (Guest)</strong>
                  <span className="text-slate-400 text-[11px]">
                    Siapapun yang masuk sebagai tamu langsung berbagi ruang kerja bersama tanpa perlu registrasi.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white font-bold block">Akun Pribadi</strong>
                  <span className="text-slate-400 text-[11px]">
                    Pengguna terdaftar memiliki ruang kerja katering tersendiri yang aman dan terlindungi.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sistem Operasional Aktif</span>
            <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Online
            </span>
          </div>
        </div>

        {/* Right Auth Forms (7 / 12) */}
        <div className="lg:col-span-7 bg-white text-slate-800 p-8 sm:p-10 flex flex-col justify-center space-y-6">
          {/* Guest Access Option Banner (Highlighted) */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" /> Akses Cepat Langsung
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Masuk sebagai Tamu (Guest)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Masuk seketika tanpa perlu login. Anda akan terhubung ke ruang kerja bersama yang dapat diakses oleh semua pengguna guest.
                </p>
              </div>
            </div>

            <button
              onClick={onSelectGuest}
              className="mt-4 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Users className="w-4 h-4 text-sky-400" />
              <span>Lanjutkan sebagai Tamu (Ruang Kerja Bersama)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              Atau Masuk / Daftar Akun Pribadi
            </span>
          </div>

          {/* Registered Account Section */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-lg transition-all ${
                  tab === 'login'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Masuk ke Akun
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('signup');
                  setErrorMessage(null);
                }}
                className={`py-2 rounded-lg transition-all ${
                  tab === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Daftar Akun Baru
              </button>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Lanjutkan dengan Akun Google Pribadi</span>
            </button>

            {/* Form Email & Password */}
            <form onSubmit={handleEmailAuth} className="space-y-3 text-xs">
              {tab === 'signup' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap / Nama Katering
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Katering Berkah Rasa"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="email@bisniskatering.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {tab === 'login'
                        ? 'Masuk ke Akun'
                        : 'Daftar Akun Baru'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
