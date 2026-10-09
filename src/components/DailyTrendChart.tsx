import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  AlertCircle,
  Calendar,
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { formatRupiah, formatCompactRupiah } from '../utils/formatters';

interface DailyTrendChartProps {
  data: Array<{
    day: string;
    date: string;
    amount: number;
    items?: number;
    note?: string;
    isPeak?: boolean;
  }>;
  totalPeriod?: number;
  averageDaily?: number;
  maxTransaction?: {
    amount: number;
    date: string;
  };
}

export const DailyTrendChart: React.FC<DailyTrendChartProps> = ({
  data,
  totalPeriod = 1627000,
  averageDaily = 892750,
  maxTransaction = { amount: 1119000, date: '22 Sep' },
}) => {
  const [selectedBar, setSelectedBar] = useState<any | null>(null);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs min-w-[200px] z-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="font-semibold text-slate-300">{point.day} 2026</span>
            {point.isPeak && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Lonjakan Tertinggi
              </span>
            )}
          </div>
          <p className="text-base font-bold text-white">
            {formatRupiah(point.amount)}
          </p>
          {point.items !== undefined && point.items > 0 ? (
            <p className="text-slate-400 mt-1 flex items-center justify-between">
              <span>Transaksi:</span>
              <span className="font-medium text-slate-200">{point.items} Nota</span>
            </p>
          ) : (
            <p className="text-slate-500 mt-1 italic">Tidak ada transaksi</p>
          )}
          {point.note && (
            <div className="mt-2 pt-1.5 border-t border-slate-800 text-[11px] text-sky-300">
              {point.note}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Tren Pengeluaran Harian
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                30 Hari Terakhir
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribusi pembelian bahan pangan 30 hari ke belakang
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>01 Sep - 30 Sep 2026</span>
          </div>
        </div>

        {/* 3 Metric Summary Banner */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/80 rounded-xl p-3 border border-slate-200/80">
          <div className="px-2">
            <p className="text-[11px] font-medium text-slate-500">Total Periode</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {formatRupiah(totalPeriod)}
            </p>
            <span className="text-[10px] text-slate-400">Total belanja terinput</span>
          </div>

          <div className="px-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0">
            <p className="text-[11px] font-medium text-slate-500">Rata-rata Harian</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {formatRupiah(averageDaily)}
            </p>
            <span className="text-[10px] text-emerald-600 font-medium">Berdasarkan hari aktif belanja</span>
          </div>

          <div className="px-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-slate-500">Transaksi Terbesar</p>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                Spike
              </span>
            </div>
            <p className="text-sm font-bold text-amber-700 mt-0.5">
              {formatRupiah(maxTransaction.amount)}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">
              pada {maxTransaction.date} (Buffet Event)
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="mt-5 w-full h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 25, right: 10, left: -15, bottom: 0 }}
            onClick={(state: any) => {
              if (state && (state as any).activePayload && (state as any).activePayload.length) {
                setSelectedBar((state as any).activePayload[0].payload);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 10 }}
              interval={2}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={(val) => (val > 0 ? formatCompactRupiah(val) : '0')}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={22}>
              {data.map((entry, index) => {
                const isSelected = selectedBar?.day === entry.day;
                // Significant spike on 22 Sep
                const is22Sep = entry.day === '22 Sep' || entry.isPeak;
                let fillColor = '#cbd5e1'; // empty / zero days subtle
                if (entry.amount > 0) {
                  fillColor = is22Sep ? '#2563eb' : '#60a5fa'; // blue-600 for spike, sky-400 for regular
                }
                if (isSelected) {
                  fillColor = '#1d4ed8';
                }
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fillColor}
                    className="transition-all duration-200 cursor-pointer hover:opacity-85"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Annotation badge for 22 Sep */}
        <div className="absolute top-1 right-[24%] sm:right-[26%] bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-pulse pointer-events-none">
          <span>22 Sep: Rp 1,119 Jt</span>
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>

      {/* Footer indicator */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
            <strong className="text-slate-700">Lonjakan 22 Sep</strong> (Rp 1.119.000)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400"></span>
            Belanja Reguler
          </span>
        </div>
        <span className="text-[10px] text-slate-400">Klik batang untuk info detail</span>
      </div>
    </div>
  );
};
