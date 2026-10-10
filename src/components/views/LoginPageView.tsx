import React, { useState } from 'react';
import {
  ChefHat,
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingDown,
  ClipboardCheck,
  Users,
  Loader2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { loginWithGoogle, loginWithEmail } from '../../firebase/authService';

interface LoginPageViewProps {
  onSelectGuest: () => void;
  onAuthSuccess: () => void;
  onNavigateToSignUp: () => void;
  onCancel?: () => void;
}

export const LoginPageView: React.FC<LoginPageViewProps> = ({
  onSelectGuest,
  onAuthSuccess,
  onNavigateToSignUp,
  onCancel,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Silakan lengkapi email dan kata sandi Anda.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await loginWithEmail(email, password);
      onAuthSuccess();
    } catch (err: any) {
      console.error(err);
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setErrorMessage('Email atau kata sandi tidak cocok.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMessage('Metode login email belum aktif. Anda dapat menggunakan Google Sign-In.');
      } else {
        setErrorMessage(err.message || 'Terjadi kendala saat proses login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080D1C] text-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#2563FF] selection:text-white relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#2563FF]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#22D3EE]/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/10 blur-[130px] pointer-events-none" />

      {/* Main Container Card: 43% Left / 57% Right on Desktop */}
      <div className="w-full max-w-5xl bg-[#0B132B]/95 rounded-3xl border border-slate-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* ======================================================== */}
        {/* LEFT BRAND EXPERIENCE (approx 43% = 5/12 cols)            */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#0A1128] via-[#080D1C] to-[#0D1836] p-7 sm:p-9 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/70 relative overflow-hidden">
          {/* Subtle luminous grid texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Header & Branding */}
          <div className="relative z-10 space-y-6">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Kembali ke Dashboard</span>
              </button>
            )}

            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2563FF] via-[#1D4ED8] to-[#22D3EE] flex items-center justify-center text-white shadow-[0_0_25px_rgba(37,99,255,0.45)] ring-1 ring-white/25">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#080D1C] border border-[#22D3EE]/50 flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-[#22D3EE]" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block leading-none">
                  Catering
                </span>
                <span className="text-[11px] font-semibold text-[#22D3EE] tracking-wide block mt-1">
                  Cost Intelligence
                </span>
              </div>
            </div>

            {/* Hero Headline */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Kelola Biaya.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300">
                  Kendalikan Bisnis.
                </span>
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-300/80 mt-2.5 leading-relaxed">
                Pantau pengeluaran bahan baku, pahami tren biaya, dan ambil keputusan bisnis dengan lebih percaya diri.
              </p>
            </div>

            {/* Abstract Visual: Miniature Culinary Cost Intelligence Card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md shadow-inner space-y-3 relative group hover:border-[#2563FF]/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Efisiensi Pengadaan
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  +14.2% Hemat
                </span>
              </div>

              {/* Sparkline Visual Simulation */}
              <div className="relative pt-1 pb-2">
                <svg className="w-full h-11 overflow-visible" viewBox="0 0 240 44">
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2563FF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,38 Q 40,32 70,22 T 140,25 T 190,12 T 240,6 L 240,44 L 0,44 Z"
                    fill="url(#trendGradient)"
                  />
                  <path
                    d="M 0,38 Q 40,32 70,22 T 140,25 T 190,12 T 240,6"
                    fill="none"
                    stroke="#22D3EE"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Glowing data points */}
                  <circle cx="70" cy="22" r="3.5" fill="#22D3EE" className="animate-ping opacity-75" />
                  <circle cx="70" cy="22" r="3" fill="#FFFFFF" />
                  <circle cx="240" cy="6" r="3.5" fill="#22D3EE" />
                </svg>
              </div>

              {/* Category tags */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 font-medium">
                  Protein (45%)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 font-medium">
                  Sayur (25%)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 font-medium">
                  Bumbu (18%)
                </span>
              </div>
            </div>

            {/* Two Value Propositions */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/25 mt-0.5">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Pencatatan Lebih Terstruktur
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Arsip digital faktur belanja bahan dapur tersusun rapi per supplier &amp; kategori.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 mt-0.5">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Analisis Biaya Lebih Mudah
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Visibilitas harga komoditas pangan harian dan estimasi HPP per porsi prasmanan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer / Status */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Cost Intelligence untuk Usaha Catering</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistem Aktif
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT LOGIN PANEL (approx 57% = 7/12 cols)               */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 bg-[#FFFFFF] text-slate-800 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Greeting Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 mb-2.5">
                <Sparkles className="w-3 h-3 text-[#2563FF]" /> Portal Masuk Pengguna
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Selamat datang kembali
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Masuk ke akun Anda untuk melanjutkan pengelolaan operasional katering.
              </p>
            </div>

            {/* Error Feedback Banner */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-50/90 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Google Sign-In (Clean Secondary Button) */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-[13px] font-bold text-slate-700 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50 group"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>Lanjutkan dengan Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-5">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider relative">
                atau gunakan email
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563FF]/25 focus:border-[#2563FF] transition-all"
                  />
                </div>
              </div>

              {/* Password Field with Functional Show/Hide Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Kata Sandi
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563FF]/25 focus:border-[#2563FF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Action Button: "Masuk ke Akun" (Electric Blue) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#2563FF] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses Masuk...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Guest Access Alternative (Cyan Accent) */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="bg-gradient-to-r from-sky-50 to-cyan-50/70 border border-sky-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-sky-900">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    <span>Lanjutkan sebagai Tamu (Guest)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    Jelajahi fitur langsung tanpa login melalui ruang kerja bersama.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onSelectGuest}
                  className="shrink-0 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                >
                  Masuk Tamu
                </button>
              </div>
            </div>
          </div>

          {/* Switch to Sign Up Navigation */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Belum memiliki akun? </span>
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="text-[#2563FF] hover:text-[#1D4ED8] font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Daftar Akun Baru</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
