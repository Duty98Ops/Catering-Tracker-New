import React from 'react';
import { Plus } from 'lucide-react';

interface TopBarProps {
  onOpenAddModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenAddModal }) => {
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

        {/* Right: Primary Action Button: + Tambah Belanja (Blue) */}
        <div className="flex items-center">
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
