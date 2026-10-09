import React, { useState } from 'react';
import {
  Search,
  TrendingDown,
  TrendingUp,
  Minus,
  AlertCircle,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { formatRupiah, getCategoryBadgeStyle } from '../../utils/formatters';
import { CategoryType, IngredientBenchmark } from '../../types';

interface IngredientSearchViewProps {
  ingredients: IngredientBenchmark[];
}

export const IngredientSearchView: React.FC<IngredientSearchViewProps> = ({
  ingredients,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filtered = ingredients.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCat === 'all' || item.category === selectedCat;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Pencarian Bahan &amp; Benchmark Harga Pasar
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Live Monitor Pasar
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pantau fluktuasi harga bahan pangan harian agar tidak salah hitung HPP menu katering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Update Terakhir: 09 Okt 2026</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari bahan (contoh: Ayam, Sapi, Cabai, Telur, Beras)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Semua Kategori Bahan</option>
              <option value="Daging & Seafood">Daging &amp; Seafood</option>
              <option value="Bahan Pokok">Bahan Pokok</option>
              <option value="Bumbu & Rempah">Bumbu &amp; Rempah</option>
              <option value="Susu & Telur">Susu &amp; Telur</option>
              <option value="Packaging">Packaging</option>
              <option value="Minyak & Gas">Minyak &amp; Gas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of benchmark cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const diff = item.currentPrice - item.previousPrice;
          const diffPct = ((diff / item.previousPrice) * 100).toFixed(1);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryBadgeStyle(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                  {item.marketTrend === 'up' && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                      <ArrowUpRight className="w-3 h-3" /> +{diffPct}%
                    </span>
                  )}
                  {item.marketTrend === 'down' && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <ArrowDownRight className="w-3 h-3" /> {diffPct}%
                    </span>
                  )}
                  {item.marketTrend === 'stable' && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      <Minus className="w-3 h-3" /> Stabil
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-2.5 leading-snug">
                  {item.name}
                </h4>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-lg font-black text-slate-900">
                    {formatRupiah(item.currentPrice)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ {item.unit}</span>
                </div>

                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sebelumnya: {formatRupiah(item.previousPrice)} / {item.unit}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                <p className="line-clamp-2 italic text-slate-500">{item.note}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Cek pasar: {item.lastUpdated}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
