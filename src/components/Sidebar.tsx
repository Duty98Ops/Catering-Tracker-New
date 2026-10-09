import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  BarChart3,
  Search,
  Users,
  Trash2,
  Database,
  ChefHat,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';

export type NavItemKey =
  | 'dashboard'
  | 'input'
  | 'history'
  | 'analytics'
  | 'ingredients'
  | 'suppliers'
  | 'trash';

interface SidebarProps {
  activeTab: NavItemKey;
  setActiveTab: (tab: NavItemKey) => void;
  onOpenAddModal: () => void;
  transactionCount: number;
  trashCount: number;
  onExportData: () => void;
  onImportData: () => void;
  onResetData: () => void;
  currentUser: any;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  transactionCount,
  trashCount,
  onExportData,
  onImportData,
  onResetData,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as NavItemKey,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'input' as NavItemKey,
      label: 'Input Belanja',
      icon: PlusCircle,
      badge: 'Form',
    },
    {
      id: 'history' as NavItemKey,
      label: 'Riwayat',
      icon: History,
      badge: transactionCount.toString(),
    },
    {
      id: 'analytics' as NavItemKey,
      label: 'Analitik & Laporan',
      icon: BarChart3,
    },
    {
      id: 'ingredients' as NavItemKey,
      label: 'Pencarian Bahan',
      icon: Search,
      pill: 'Pasar',
    },
    {
      id: 'suppliers' as NavItemKey,
      label: 'Mitra Supplier',
      icon: Users,
    },
    {
      id: 'trash' as NavItemKey,
      label: 'Sampah / Arsip',
      icon: Trash2,
      badge: trashCount > 0 ? trashCount.toString() : undefined,
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-200 flex flex-col h-screen border-r border-slate-800/80 select-none flex-shrink-0 z-30 transition-all">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <ChefHat className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-100 tracking-tight text-base">Catering</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" />
              Cost Intelligence
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Dapur Utama: <strong className="text-slate-200">Katering Rasa</strong></span>
          </div>
          <span className="text-[10px] text-slate-500">v1.0</span>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Menu Utama
        </div>

        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-blue-500/50'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {item.pill && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                  {item.pill}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Card: Firebase Cloud Data Management */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 shadow-inner">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200 leading-tight">
                  Firebase Cloud Storage
                </h4>
                <p className="text-[10px] text-amber-400/90 font-mono mt-0.5">Firestore Database • Live</p>
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Cloud Sinkron
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {transactionCount} Dokumen
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-2.5 grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/60">
            <button
              onClick={onExportData}
              title="Unduh backup data file JSON"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
            >
              <Download className="w-3 h-3 text-sky-400" />
              Backup
            </button>
            <button
              onClick={onResetData}
              title="Reset ke data awal demo"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-amber-400" />
              Reset Demo
            </button>
          </div>
        </div>

        {/* User profile footer */}
        <div className="mt-3 pt-2.5 flex items-center justify-between px-1">
          {currentUser ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 min-w-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold ring-1 ring-white/20">
                    {(currentUser.displayName || currentUser.email || 'U').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User Katering'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {currentUser.email || 'Terautentikasi'}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Keluar dari akun"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal('login')}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk / Daftar Akun</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
