import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ChefHat,
  Sparkles,
  User,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ClipboardCheck,
  TrendingDown,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Users,
  BarChart3
} from 'lucide-react';
import { loginWithGoogle, registerWithEmail } from '../../firebase/authService';
import { ParticleMeshCanvas } from '../auth/ParticleMeshCanvas';
import { TiltCard } from '../auth/TiltCard';
import { MagneticButton } from '../auth/MagneticButton';
import { AnimatedChartPreview } from '../auth/AnimatedChartPreview';
import { RadarStatusBadge } from '../auth/RadarStatusBadge';
import { NeonInput } from '../auth/NeonInput';
import { PortalTransitionOverlay } from '../auth/PortalTransitionOverlay';

interface SignUpPageViewProps {
  onSelectGuest: () => void;
  onAuthSuccess: () => void;
  onNavigateToLogin: () => void;
  onCancel?: () => void;
}

export const SignUpPageView: React.FC<SignUpPageViewProps> = ({
  onSelectGuest,
  onAuthSuccess,
  onNavigateToLogin,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State untuk Portal Transisi Sinematik Fullscreen
  const [isSuccessExiting, setIsSuccessExiting] = useState(false);
  const [exitTarget, setExitTarget] = useState<'account' | 'guest'>('account');

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Lemah', color: 'bg-rose-500' };
    if (score <= 2) return { score: 2, label: 'Sedang', color: 'bg-amber-500' };
    return { score: 3, label: 'Kuat', color: 'bg-emerald-500' };
  }, [password]);

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      setExitTarget('account');
      setIsSuccessExiting(true);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Jendela pendaftaran Google ditutup sebelum selesai.');
      } else {
        setErrorMessage(err.message || 'Gagal mendaftar dengan Google.');
      }
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Silakan isi nama lengkap Anda.');
      return;
    }
    if (!email || !password) {
      setErrorMessage('Silakan isi alamat email dan kata sandi.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await registerWithEmail(email, password, name, businessName);
      setExitTarget('account');
      setIsSuccessExiting(true);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Email ini sudah terdaftar. Silakan masuk menggunakan akun Anda.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMessage('Metode pendaftaran email belum aktif. Anda dapat menggunakan Google Sign-In.');
      } else {
        setErrorMessage(err.message || 'Terjadi kendala saat membuat akun baru.');
      }
      setLoading(false);
    }
  };

  const handleGuestSignUp = () => {
    setExitTarget('guest');
    setIsSuccessExiting(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#080D1C] text-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#2563FF] selection:text-white relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#2563FF]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#22D3EE]/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] left-[25%] w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/10 blur-[130px] pointer-events-none" />

      {/* Main Container Card: Smooth Satin Entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{
          opacity: isSuccessExiting ? 0.15 : 1,
          scale: isSuccessExiting ? 0.95 : 1,
          filter: isSuccessExiting ? 'blur(6px)' : 'blur(0px)',
        }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full max-w-5xl bg-[#0B132B]/95 rounded-3xl border border-slate-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10"
      >
        {/* ======================================================== */}
        {/* 1. LEFT BRANDING PANEL (approx 43% = 5/12 cols)          */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#0A1128] via-[#080D1C] to-[#0D1836] p-7 sm:p-9 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/70 relative overflow-hidden">
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

            {/* Feature Propositions with 3D Tilt */}
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
                    Dokumentasi pengeluaran dapur rapi per tanggal, menu, dan mitra supplier.
                  </p>
                </div>
              </TiltCard>

              <TiltCard
                maxTilt={5}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60"
              >
                <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 mt-0.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Analisis Biaya Lebih Mudah
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Visualisasi belanja harian dan pemantauan anggaran tanpa ribet.
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
        </div>

        {/* ======================================================== */}
        {/* 2. RIGHT SIGN UP PANEL (approx 57% = 7/12 cols)          */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 bg-[#FFFFFF] text-slate-800 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Header with Switch to Login */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 mb-2">
                  <Sparkles className="w-3 h-3 text-[#2563FF]" /> Registrasi Ruang Kerja
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Daftar Akun Baru
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Siapkan ruang kerja Anda dan mulai kelola biaya catering dengan lebih teratur.
                </p>
              </div>

              <button
                type="button"
                onClick={onNavigateToLogin}
                className="shrink-0 text-xs font-bold text-[#2563FF] hover:text-[#1D4ED8] hover:underline cursor-pointer inline-flex items-center gap-1 pt-1"
              >
                <span>Sudah punya akun? Masuk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Error Feedback Banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 bg-red-50/90 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 shadow-xs"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </motion.div>
            )}

            {/* Google Sign-Up Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-slate-400 rounded-xl text-xs sm:text-[13px] font-bold text-slate-700 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
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
              <span>Daftar dengan Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider relative">
                atau isi formulir pendaftaran
              </span>
            </div>

            {/* Registration Form with Neon Inputs */}
            <form onSubmit={handleEmailSignUp} className="space-y-3.5">
              {/* Row 1: Nama Lengkap & Nama Usaha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <NeonInput
                  label="Nama Lengkap"
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User className="w-4 h-4" />}
                  autoComplete="name"
                />

                <NeonInput
                  label="Nama Usaha (Opsional)"
                  type="text"
                  placeholder="Contoh: Catering Nusantara"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  icon={<Building2 className="w-4 h-4" />}
                  autoComplete="organization"
                />
              </div>

              {/* Email */}
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

              {/* Kata Sandi & Strength Indicator */}
              <div>
                <NeonInput
                  label="Kata Sandi"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  autoComplete="new-password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                      title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'
                        }`}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'
                        }`}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'
                        }`}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 pl-1">
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Konfirmasi Kata Sandi */}
              <div>
                <NeonInput
                  label="Konfirmasi Kata Sandi"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan kembali kata sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  autoComplete="new-password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                      title={showConfirmPassword ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">
                    Konfirmasi kata sandi belum cocok.
                  </p>
                )}
              </div>

              {/* Magnetic Button: "Buat Akun" */}
              <MagneticButton
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 px-4 bg-[#2563FF] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mendaftarkan Ruang Kerja...</span>
                  </>
                ) : (
                  <>
                    <span>Buat Akun Sekarang</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </MagneticButton>
            </form>
          </div>

          {/* Guest alternative & Footer */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={handleGuestSignUp}
              className="text-sky-700 hover:text-sky-900 font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:underline"
            >
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>Atau coba dulu sebagai Tamu (Ruang Kerja Bersama)</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-[#2563FF] hover:text-[#1D4ED8] font-bold cursor-pointer hover:underline"
            >
              Sudah punya akun? Masuk
            </button>
          </div>
        </div>
      </motion.div>

      {/* FULLSCREEN CINEMATIC PORTAL TRANSITION OVERLAY */}
      <PortalTransitionOverlay
        isVisible={isSuccessExiting}
        title={exitTarget === 'guest' ? 'Sesi Tamu Diaktifkan' : 'Pendaftaran Berhasil'}
        subtitle={
          exitTarget === 'guest'
            ? 'Menyiapkan akses ruang kerja bersama demo...'
            : 'Menyiapkan ruang kerja baru katering Anda...'
        }
        onTransitionComplete={() => {
          if (exitTarget === 'guest') {
            onSelectGuest();
          } else {
            onAuthSuccess();
          }
        }}
      />
    </div>
  );
};
