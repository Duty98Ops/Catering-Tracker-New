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
import { formatRupiah, formatCompactRupiah } from '../utils/formatters';

interface SummaryCardsProps {
  todayTotal: number;
  todayCount?: number;
  last7DaysTotal: number;
  last7DaysCount?: number;
  last30DaysTotal: number;
  averageDaily?: number;
  efficiencyPercentage?: number;
  overallTotal: number;
  activeDaysCount: number;
  sparkline7d?: number[];
  sparkline30d?: number[];
  sparklineTotal?: number[];
}

// Mini SVG Sparkline Component
const MiniSparkline: React.FC<{
  data: number[];
  color: string;
  fillColor: string;
}> = ({ data, color, fillColor }) => {
  const safeData = data && data.length > 1 ? data : [0, 0];
  const min = Math.min(...safeData);
  const max = Math.max(...safeData);
  const range = max - min || 1;
  const width = 80;
  const height = 26;

  const points = safeData
    .map((val, idx) => {
      const x = (idx / (safeData.length - 1)) * width;
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
  todayCount = 0,
  last7DaysTotal = 0,
  last7DaysCount = 0,
  last30DaysTotal = 0,
  averageDaily = 0,
  efficiencyPercentage = 94,
  overallTotal = 0,
  activeDaysCount = 0,
  sparkline7d = [0, 0, 0, 0, 0, 0, 0],
  sparkline30d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  sparklineTotal = [0, 0, 0, 0, 0, 0, 0],
}) => {
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
            <span
              className={`w-1.5 h-1.5 rounded-full ${todayTotal > 0 ? 'bg-emerald-500' : 'bg-slate-400'}`}
            ></span>
            {todayTotal > 0 ? `${todayCount} nota hari ini` : 'Belum ada nota'}
          </div>
          <span className="text-[11px] text-slate-400">Sinkron Otomatis</span>
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
            <span>{last7DaysCount > 0 ? `${last7DaysCount} nota pekan ini` : '-8.4% vs pekan lalu'}</span>
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
              Efisiensi {efficiencyPercentage}%
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">
              Rerata {averageDaily > 0 ? formatCompactRupiah(averageDaily) : 'Rp 0'}/hr
            </span>
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
