import React from 'react';
import { Plus, LogIn, LogOut, User as UserIcon } from 'lucide-react';

interface TopBarProps {
  onOpenAddModal: () => void;
  currentUser?: any;
  onOpenAuthModal?: (mode?: 'login' | 'signup') => void;
  onLogout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenAddModal,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Titles */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Operasional
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Live Sync
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitoring pengeluaran bahan pangan &amp; analisis efisiensi biaya katering
          </p>
        </div>

        {/* Right: Actions & Auth */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {(currentUser.displayName || currentUser.email || 'U').slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Keluar"
                  className="p-1 hover:text-red-600 text-slate-400 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            onOpenAuthModal && (
              <button
                onClick={() => onOpenAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                <span>Masuk</span>
              </button>
            )
          )}

          {/* Primary Action Button: + Tambah Belanja (Blue) */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Tambah Belanja</span>
          </button>
        </div>
      </div>
    </header>
  );
};
