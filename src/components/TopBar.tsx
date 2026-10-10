import React from 'react';
import { Plus, LogIn, LogOut, Users, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  onOpenAddModal: () => void;
  currentUser?: any;
  isGuestMode?: boolean;
  onOpenAuthPage: (mode?: 'login' | 'signup') => void;
  onLogout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenAddModal,
  currentUser,
  isGuestMode = true,
  onOpenAuthPage,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-5 sm:px-6 py-4 transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Titles & Live Status */}
        <div>
          <div className="flex items-center flex-wrap gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Operasional
            </h1>

            {/* Mode Indicator Badge */}
            {currentUser ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Akun Pribadi
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                <Users className="w-3.5 h-3.5 text-sky-600" />
                Mode Tamu (Ruang Kerja Bersama)
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitoring pengeluaran bahan pangan &amp; analisis efisiensi biaya katering
          </p>
        </div>

        {/* Right: Actions & Auth */}
        <div className="flex items-center flex-wrap gap-2.5">

          {currentUser ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {(currentUser.displayName || currentUser.email || 'U').slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-700 max-w-[130px] truncate">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Keluar / Ganti Akun"
                  className="p-1 hover:text-red-600 text-slate-400 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenAuthPage('login')}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                <span>Masuk</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuthPage('signup')}
                className="hidden sm:inline-flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <span>Daftar Akun</span>
              </button>
            </div>
          )}

          {/* Primary Action Button: + Tambah Belanja (Blue) */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Tambah Belanja</span>
          </button>
        </div>
      </div>
    </header>
  );
};
