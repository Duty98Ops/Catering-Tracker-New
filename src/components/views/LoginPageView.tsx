import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChefHat,
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ClipboardCheck,
  TrendingDown,
  Users,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { loginWithGoogle, loginWithEmail } from '../../firebase/authService';
import { ParticleMeshCanvas } from '../auth/ParticleMeshCanvas';
import { TiltCard } from '../auth/TiltCard';
import { MagneticButton } from '../auth/MagneticButton';
import { AnimatedChartPreview } from '../auth/AnimatedChartPreview';
import { RadarStatusBadge } from '../auth/RadarStatusBadge';
import { NeonInput } from '../auth/NeonInput';

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

  // State untuk Klimaks Animasi Transisi Sukses (Fullscreen Morphing)
  const [isSuccessExiting, setIsSuccessExiting] = useState(false);

  // Trigger transisi sukses sinematik
  const triggerSuccessSequence = () => {
    setIsSuccessExiting(true);
    setTimeout(() => {
      onAuthSuccess();
    }, 850);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      triggerSuccessSequence();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Jendela login ditutup sebelum selesai.');
      } else {
        setErrorMessage(err.message || 'Gagal masuk dengan Google.');
      }
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
      triggerSuccessSequence();
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
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setIsSuccessExiting(true);
    setTimeout(() => {
      onSelectGuest();
    }, 750);
  };

  return (
    <div className="min-h-screen w-full bg-[#080D1C] text-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#2563FF] selection:text-white relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#2563FF]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#22D3EE]/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/10 blur-[130px] pointer-events-none" />

      {/* Main Container Card: Smooth Satin Entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full max-w-5xl bg-[#0B132B]/95 rounded-3xl border border-slate-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10"
      >
        {/* ======================================================== */}
        {/* 1. LEFT BRAND EXPERIENCE (approx 43% = 5/12 cols)        */}
        {/* ======================================================== */}
        <motion.div
          animate={
            isSuccessExiting
              ? {
                  zIndex: 50,
                  gridColumn: 'span 12 / span 12',
                  backgroundColor: '#080D1C',
                }
              : {}
          }
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 bg-gradient-to-b from-[#0A1128] via-[#080D1C] to-[#0D1836] p-7 sm:p-9 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/70 relative overflow-hidden"
        >
          {/* 3D Interactive Mesh / Particle Field Canvas */}
          <ParticleMeshCanvas particleCount={48} />

          {/* Luminous Grid Texture Overlay */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Header & Branding */}
          <div className="relative z-10 space-y-5">
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
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2563FF] via-[#1D4ED8] to-[#22D3EE] flex items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,255,0.5)] ring-1 ring-white/25">
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

            {/* Hero Headline with Laser Light Text Reveal */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight overflow-hidden">
                <span className="block">
                  {['Kelola', 'Biaya.'].map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ y: 24, opacity: 0, filter: 'blur(6px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.65,
                        delay: 0.15 + i * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block mr-2"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300">
                  {['Kendalikan', 'Bisnis.'].map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ y: 24, opacity: 0, filter: 'blur(6px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.7,
                        delay: 0.45 + i * 0.14,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block mr-2"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-300/80 mt-2.5 leading-relaxed">
                Pantau pengeluaran bahan baku, pahami tren biaya, dan ambil keputusan bisnis dengan lebih percaya diri.
              </p>
            </div>

            {/* 3D Tilt Card: Animated Line Chart with SVG Dashoffset & Peak Burst */}
            <TiltCard
              maxTilt={7}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-700/60 backdrop-blur-md shadow-inner"
            >
              <AnimatedChartPreview />
            </TiltCard>

            {/* Two Value Propositions with Subtle 3D Tilt */}
            <div className="space-y-2 pt-1">
              <TiltCard
                maxTilt={5}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60"
              >
                <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/25 mt-0.5">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Pencatatan Lebih Terstruktur
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Arsip faktur belanja bahan dapur tersusun rapi per supplier &amp; kategori.
                  </p>
                </div>
              </TiltCard>

              <TiltCard
                maxTilt={5}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60"
              >
                <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 mt-0.5">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Analisis Biaya Lebih Mudah
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Visibilitas harga komoditas pangan harian dan evaluasi HPP akurat.
                  </p>
                </div>
              </TiltCard>
            </div>
          </div>

          {/* Bottom Footer with Continuous Concentric Radar Ripple Wave */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
            <span>Cost Intelligence untuk Usaha Catering</span>
            <RadarStatusBadge label="Sistem Aktif" />
          </div>

          {/* Fullscreen Morphing Success State Overlay */}
          <AnimatePresence>
            {isSuccessExiting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#080D1C] p-6 text-center"
              >
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#2563FF] to-[#22D3EE] flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,255,0.8)] animate-bounce mb-4">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Autentikasi Berhasil
                </h3>
                <p className="text-xs text-sky-300 mt-1.5 font-medium">
                  Menyiapkan ruang kerja operasional katering Anda...
                </p>
                <div className="mt-5 w-36 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#2563FF] to-[#22D3EE]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.75, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ======================================================== */}
        {/* 2. RIGHT LOGIN PANEL (approx 57% = 7/12 cols)            */}
        {/* ======================================================== */}
        <AnimatePresence>
          {!isSuccessExiting && (
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lg:col-span-7 bg-[#FFFFFF] text-slate-800 p-7 sm:p-10 lg:p-12 flex flex-col justify-between"
            >
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
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 p-3.5 bg-red-50/90 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 shadow-xs"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{errorMessage}</span>
                  </motion.div>
                )}

                {/* Google Sign-In */}
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

                {/* Login Form with Neon Underline Expansion */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  {/* Email Field */}
                  <NeonInput
                    label="Email"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                    autoComplete="email"
                  />

                  {/* Password Field with Functional Eye Toggle */}
                  <NeonInput
                    label="Kata Sandi"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    autoComplete="current-password"
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                        title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  {/* Magnetic Button: "Masuk ke Akun" */}
                  <MagneticButton
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3 px-4 bg-[#2563FF] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all cursor-pointer disabled:opacity-50"
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
                  </MagneticButton>
                </form>

                {/* Guest Access Alternative */}
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
                      onClick={handleGuestLogin}
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
