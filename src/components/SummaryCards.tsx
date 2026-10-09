import React from 'react';
import {
  Wallet,
  CalendarDays,
  TrendingDown,
  Coins,
  CheckCircle2,
  AlertCircle,
  ArrowDownRight,
  TrendingUp,
  Receipt,
  Sparkles
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface SummaryCardsProps {
  todayTotal: number;
  last7DaysTotal: number;
  last30DaysTotal: number;
  overallTotal: number;
  activeDaysCount: number;
}

// Mini SVG Sparkline Component
const MiniSparkline: React.FC<{
  data: number[];
  color: string;
  fillColor: string;
}> = ({ data, color, fillColor }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 26;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="w-20 h-7 overflow-hidden flex items-center">
      <svg width={width} height={height} className="overflow-visible">
        <polygon points={areaPoints} fill={fillColor} opacity={0.3} />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
};

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  todayTotal = 0,
  last7DaysTotal = 0,
  last30DaysTotal = 1627000,
  overallTotal = 17855000,
  activeDaysCount = 20,
}) => {
  // Sparkline mockup sequences
  const sparkline7d = [45, 30, 25, 12, 0, 0, 0];
  const sparkline30d = [0, 65, 0, 95, 150, 120, 1119, 50, 28, 0];
  const sparklineTotal = [320, 580, 890, 1200, 1450, 1627, 1780];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4.5">
      {/* 1. Belanja Hari Ini */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Belanja Hari Ini
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
              {formatRupiah(todayTotal)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Belum ada nota
          </div>
          <span className="text-[11px] text-slate-400">Update live</span>
        </div>
      </div>

      {/* 2. 7 Hari Terakhir */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              7 Hari Terakhir
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
              {formatRupiah(last7DaysTotal)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>-8.4% vs pekan lalu</span>
          </div>
          <MiniSparkline data={sparkline7d} color="#10b981" fillColor="#10b981" />
        </div>
      </div>

      {/* 3. 30 Hari Terakhir */}
      <div className="bg-white rounded-2xl border border-blue-200/70 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group bg-gradient-to-br from-white via-white to-blue-50/20">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                30 Hari Terakhir
              </p>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 text-blue-800 font-bold">
                Fokus
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
              {formatRupiah(last30DaysTotal)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              Efisiensi 94%
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">Rerata Rp 893k/hr</span>
          </div>
          <MiniSparkline data={sparkline30d} color="#3b82f6" fillColor="#3b82f6" />
        </div>
      </div>

      {/* 4. Total Keseluruhan */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Keseluruhan
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
              {formatRupiah(overallTotal)}
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{activeDaysCount} Hari Aktif</span>
          </div>
          <MiniSparkline data={sparklineTotal} color="#6366f1" fillColor="#6366f1" />
        </div>
      </div>
    </div>
  );
};
