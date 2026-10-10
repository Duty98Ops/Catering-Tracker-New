import React, { useState, useMemo } from 'react';
import {
  Download,
  Calendar,
  Receipt,
  Package,
  FileText,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { Transaction } from '../../types';
import { formatRupiah, formatCompactRupiah } from '../../utils/formatters';

interface AnalyticsViewProps {
  transactions?: Transaction[];
  onExportCSV?: (filtered?: Transaction[]) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions = [],
  onExportCSV,
}) => {
  // Mode Pelaporan: 'range' (Rentang Tanggal) | 'monthly' (Bulanan)
  const [reportMode, setReportMode] = useState<'range' | 'monthly'>('range');

  // Inisialisasi rentang tanggal berdasarkan data transaksi yang tersedia
  const sortedTransactionsByDate = useMemo(() => {
    return [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions]);

  const initialRange = useMemo(() => {
    if (sortedTransactionsByDate.length > 0) {
      const earliest = sortedTransactionsByDate[0].date;
      const latest = sortedTransactionsByDate[sortedTransactionsByDate.length - 1].date;
      return { start: earliest, end: latest };
    }
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return {
      start: thirtyDaysAgo.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0],
    };
  }, [sortedTransactionsByDate]);

  const [startDate, setStartDate] = useState(initialRange.start);
  const [endDate, setEndDate] = useState(initialRange.end);
  const [appliedRange, setAppliedRange] = useState(initialRange);

  // Perbarui input filter ketika initialRange pertama kali siap
  React.useEffect(() => {
    setStartDate(initialRange.start);
    setEndDate(initialRange.end);
    setAppliedRange(initialRange);
  }, [initialRange.start, initialRange.end]);

  // Handler untuk tombol "Tampilkan"
  const handleApplyRangeFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedRange({ start: startDate, end: endDate });
  };

  // Preset Cepat Rentang Tanggal
  const handlePresetAll = () => {
    if (sortedTransactionsByDate.length > 0) {
      const earliest = sortedTransactionsByDate[0].date;
      const latest = sortedTransactionsByDate[sortedTransactionsByDate.length - 1].date;
      setStartDate(earliest);
      setEndDate(latest);
      setAppliedRange({ start: earliest, end: latest });
    }
  };

  const handlePresetLast30Days = () => {
    const end = sortedTransactionsByDate.length > 0
      ? sortedTransactionsByDate[sortedTransactionsByDate.length - 1].date
      : new Date().toISOString().split('T')[0];
    const endObj = new Date(end);
    const startObj = new Date(endObj);
    startObj.setDate(startObj.getDate() - 29);
    const start = startObj.toISOString().split('T')[0];
    setStartDate(start);
    setEndDate(end);
    setAppliedRange({ start, end });
  };

  // ==========================================
  // DATA PERHITUNGAN: RENTANG TANGGAL
  // ==========================================
  const filteredRangeTransactions = useMemo(() => {
    return transactions.filter((t) => {
      return t.date >= appliedRange.start && t.date <= appliedRange.end;
    });
  }, [transactions, appliedRange]);

  // 1. KPI Summary Rentang Tanggal
  const rangeKPIs = useMemo(() => {
    const total = filteredRangeTransactions.reduce((acc, t) => acc + t.amount, 0);
    const activeDays = new Set(filteredRangeTransactions.map((t) => t.date)).size;
    const uniqueItems = new Set(filteredRangeTransactions.map((t) => t.item.trim().toLowerCase())).size;
    const trxCount = filteredRangeTransactions.length;
    return {
      total,
      activeDays,
      uniqueItems,
      trxCount,
    };
  }, [filteredRangeTransactions]);

  // 2. Bar Chart Pengeluaran per Hari
  const dailyChartData = useMemo(() => {
    const map: Record<string, { amount: number; count: number }> = {};
    filteredRangeTransactions.forEach((t) => {
      if (!map[t.date]) {
        map[t.date] = { amount: 0, count: 0 };
      }
      map[t.date].amount += t.amount;
      map[t.date].count += 1;
    });

    const dates = Object.keys(map).sort();
    let maxAmount = 0;
    dates.forEach((d) => {
      if (map[d].amount > maxAmount) maxAmount = map[d].amount;
    });

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
    ];

    return dates.map((d) => {
      const parts = d.split('-');
      const day = parts[2] || '';
      const mIdx = parseInt(parts[1] || '1', 10) - 1;
      const displayDate = `${day} ${monthNames[mIdx] || ''}`;
      const amount = map[d].amount;
      return {
        date: d,
        displayDate,
        amount,
        count: map[d].count,
        isPeak: amount > 0 && amount === maxAmount,
      };
    });
  }, [filteredRangeTransactions]);

  const highestDaily = useMemo(() => {
    if (dailyChartData.length === 0) return null;
    return dailyChartData.reduce((prev, curr) => (curr.amount > prev.amount ? curr : prev), dailyChartData[0]);
  }, [dailyChartData]);

  // 3. Pengeluaran Berdasarkan Kategori
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    filteredRangeTransactions.forEach((t) => {
      const cat = t.category || 'Lain-lain';
      if (!map[cat]) {
        map[cat] = { total: 0, count: 0 };
      }
      map[cat].total += t.amount;
      map[cat].count += 1;
    });

    const categoryColors: Record<string, string> = {
      'Daging & Seafood': '#ef4444',
      'Bahan Pokok': '#f59e0b',
      'Bumbu & Rempah': '#10b981',
      'Packaging': '#3b82f6',
      'Susu & Telur': '#8b5cf6',
      'Sayuran & Buah': '#14b8a6',
      'Minyak & Gas': '#f97316',
      'Lain-lain': '#64748b',
    };

    return Object.entries(map)
      .map(([name, data]) => {
        const percentage = rangeKPIs.total > 0 ? (data.total / rangeKPIs.total) * 100 : 0;
        return {
          name,
          total: data.total,
          count: data.count,
          percentage: Number(percentage.toFixed(1)),
          color: categoryColors[name] || '#64748b',
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [filteredRangeTransactions, rangeKPIs.total]);

  // ==========================================
  // DATA PERHITUNGAN: BULANAN
  // ==========================================
  const monthlyReportData = useMemo(() => {
    const map: Record<
      string,
      {
        yearMonth: string;
        total: number;
        dates: Set<string>;
        items: Set<string>;
        count: number;
      }
    > = {};

    transactions.forEach((t) => {
      const parts = t.date.split('-');
      if (parts.length >= 2) {
        const ym = `${parts[0]}-${parts[1]}`;
        if (!map[ym]) {
          map[ym] = {
            yearMonth: ym,
            total: 0,
            dates: new Set(),
            items: new Set(),
            count: 0,
          };
        }
        map[ym].total += t.amount;
        map[ym].dates.add(t.date);
        map[ym].items.add(t.item.trim().toLowerCase());
        map[ym].count += 1;
      }
    });

    const fullMonthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    const shortMonthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
    ];

    const sortedYm = Object.keys(map).sort();

    return sortedYm.map((ym) => {
      const [year, month] = ym.split('-');
      const mIdx = parseInt(month, 10) - 1;
      const monthName = `${fullMonthNames[mIdx] || month} ${year}`;
      const shortName = `${shortMonthNames[mIdx] || month} ${year.slice(2)}`;
      return {
        yearMonth: ym,
        monthName,
        shortName,
        total: map[ym].total,
        daysCount: map[ym].dates.size,
        itemsCount: map[ym].items.size,
        transactionCount: map[ym].count,
      };
    });
  }, [transactions]);

  const monthlyKPIs = useMemo(() => {
    const totalAll = monthlyReportData.reduce((acc, m) => acc + m.total, 0);
    const totalMonths = monthlyReportData.length;
    const avgMonthly = totalMonths > 0 ? Math.round(totalAll / totalMonths) : 0;
    const totalTrx = monthlyReportData.reduce((acc, m) => acc + m.transactionCount, 0);
    return {
      totalAll,
      totalMonths,
      avgMonthly,
      totalTrx,
    };
  }, [monthlyReportData]);

  // Handler Ekspor CSV
  const handleExport = () => {
    const dataToExport = reportMode === 'range' ? filteredRangeTransactions : transactions;
    if (onExportCSV) {
      onExportCSV(dataToExport);
      return;
    }

    const headers = ['ID', 'Tanggal', 'Waktu', 'Item', 'Deskripsi', 'Kategori', 'Supplier', 'Status', 'Nominal'];
    const rows = dataToExport.map((t) => [
      t.id,
      t.date,
      t.time || '',
      `"${t.item.replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.category,
      `"${t.supplier.replace(/"/g, '""')}"`,
      t.status,
      t.amount,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `laporan_operasional_${reportMode === 'range' ? `${appliedRange.start}_sd_${appliedRange.end}` : 'bulanan'}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ======================================================== */}
      {/* 4. PAGE HEADER                                           */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Analitik &amp; Laporan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau pengeluaran bahan baku dan analisis biaya operasional catering.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Ekspor CSV</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 5. REPORT MODE SELECTOR & FILTERS                        */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Segmented Control */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start">
            <button
              onClick={() => setReportMode('range')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                reportMode === 'range'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rentang Tanggal
            </button>
            <button
              onClick={() => setReportMode('monthly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                reportMode === 'monthly'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bulanan
            </button>
          </div>

          {/* Quick presets for Range mode */}
          {reportMode === 'range' && sortedTransactionsByDate.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Pilihan Cepat:</span>
              <button
                type="button"
                onClick={handlePresetLast30Days}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-medium transition-colors"
              >
                30 Hari Terakhir
              </button>
              <button
                type="button"
                onClick={handlePresetAll}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-medium transition-colors"
              >
                Semua Data
              </button>
            </div>
          )}
        </div>

        {/* Date Filter Bar for "Rentang Tanggal" */}
        {reportMode === 'range' && (
          <form
            onSubmit={handleApplyRangeFilter}
            className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">Dari:</span>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-2.5 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">Sampai:</span>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-2.5 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Tampilkan
            </button>

            <span className="text-[11px] text-slate-400 ml-auto hidden sm:inline">
              Periode aktif: <strong className="text-slate-700">{appliedRange.start}</strong> s/d{' '}
              <strong className="text-slate-700">{appliedRange.end}</strong>
            </span>
          </form>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAMPILAN MODE 1: RENTANG TANGGAL                         */}
      {/* ======================================================== */}
      {reportMode === 'range' && (
        <div className="space-y-6">
          {/* 6. COMPACT KPI SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Total Pengeluaran */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Total Pengeluaran
                  </p>
                  <h3 className="text-2xl font-bold text-blue-700 mt-1 tracking-tight">
                    {formatRupiah(rangeKPIs.total)}
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Akumulasi belanja bahan baku
              </p>
            </div>

            {/* KPI 2: Hari dengan Transaksi */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Hari Belanja
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                    {rangeKPIs.activeDays} <span className="text-sm font-semibold text-slate-500">Hari</span>
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Hari aktif dengan transaksi belanja
              </p>
            </div>

            {/* KPI 3: Jumlah Item Bahan Baku */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Varian Bahan Baku
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                    {rangeKPIs.uniqueItems} <span className="text-sm font-semibold text-slate-500">Item</span>
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Jenis komoditas bahan pangan
              </p>
            </div>

            {/* KPI 4: Jumlah Transaksi */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Jumlah Transaksi
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                    {rangeKPIs.trxCount} <span className="text-sm font-semibold text-slate-500">Nota</span>
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Total nota pembelian tercatat
              </p>
            </div>
          </div>

          {/* EMPTY STATE JIKA TIDAK ADA DATA PADA RENTANG TERPILIH */}
          {filteredRangeTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Tidak Ada Transaksi pada Periode Ini
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Tidak ditemukan catatan pengeluaran antara tanggal {appliedRange.start} sampai {appliedRange.end}. Silakan ubah filter rentang tanggal di atas.
              </p>
            </div>
          ) : (
            <>
              {/* 7. DAILY EXPENSE CHART */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Pengeluaran per Hari
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Distribusi nominal pengeluaran harian bahan baku katering
                    </p>
                  </div>

                  {highestDaily && highestDaily.amount > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium self-start sm:self-auto">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span>
                        Puncak Tertinggi: <strong>{formatRupiah(highestDaily.amount)}</strong> ({highestDaily.displayDate})
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 w-full h-[270px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailyChartData}
                      margin={{ top: 15, right: 10, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="displayDate"
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        interval={dailyChartData.length > 15 ? 1 : 0}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickFormatter={(val) => (val > 0 ? formatCompactRupiah(val) : '0')}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg border border-slate-700 text-xs min-w-[180px]">
                                <div className="text-slate-300 font-semibold mb-1">
                                  {data.date}
                                </div>
                                <div className="text-base font-bold text-sky-400">
                                  {formatRupiah(data.amount)}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1">
                                  {data.count} transaksi belanja
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                        cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                      />
                      <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={28}>
                        {dailyChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.isPeak ? '#2563eb' : '#60a5fa'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 8. CATEGORY EXPENSE BREAKDOWN */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Pengeluaran Berdasarkan Kategori
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Peringkat pengeluaran bahan baku berdasarkan kelompok komoditas
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {categoryBreakdown.length} Kategori
                  </span>
                </div>

                <div className="mt-4 space-y-3.5">
                  {categoryBreakdown.map((cat, idx) => (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400 text-[11px] w-4">
                            #{idx + 1}
                          </span>
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-semibold text-slate-800">
                            {cat.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ({cat.count} nota)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {formatRupiah(cat.total)}
                          </span>
                          <span className="text-xs font-bold text-slate-500 min-w-[42px] text-right">
                            {cat.percentage}%
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, Math.max(2, cat.percentage))}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAMPILAN MODE 2: BULANAN                                 */}
      {/* ======================================================== */}
      {reportMode === 'monthly' && (
        <div className="space-y-6">
          {/* 6. COMPACT KPI SUMMARY BULANAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Total Pengeluaran Seluruh Bulan */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Total Pengeluaran
                  </p>
                  <h3 className="text-2xl font-bold text-blue-700 mt-1 tracking-tight">
                    {formatRupiah(monthlyKPIs.totalAll)}
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Seluruh pengeluaran yang tercatat
              </p>
            </div>

            {/* KPI 2: Jumlah Bulan */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Periode Tercatat
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                    {monthlyKPIs.totalMonths} <span className="text-sm font-semibold text-slate-500">Bulan</span>
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Jumlah bulan memiliki data
              </p>
            </div>

            {/* KPI 3: Rata-rata per Bulan */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Rata-rata / Bulan
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                    {formatRupiah(monthlyKPIs.avgMonthly)}
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Rata-rata per bulan operasional
              </p>
            </div>

            {/* KPI 4: Total Transaksi Seluruh Periode */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Total Transaksi
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                    {monthlyKPIs.totalTrx} <span className="text-sm font-semibold text-slate-500">Nota</span>
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Seluruh nota dalam sistem
              </p>
            </div>
          </div>

          {/* EMPTY STATE JIKA TIDAK ADA DATA TRANSAKSI SAMA SEKALI */}
          {monthlyReportData.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Belum Ada Data Transaksi Bulanan
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Mulai catat transaksi belanja bahan baku di menu Input Pengeluaran untuk melihat rekapitulasi tren bulanan.
              </p>
            </div>
          ) : (
            <>
              {/* 9. MONTHLY TREND CHART */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">
                    Tren Pengeluaran Bulanan
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pergerakan total biaya operasional bahan baku katering antar bulan
                  </p>
                </div>

                <div className="mt-5 w-full h-[270px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyReportData}
                      margin={{ top: 15, right: 15, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="shortName"
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickFormatter={(val) => (val > 0 ? formatCompactRupiah(val) : '0')}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg border border-slate-700 text-xs min-w-[190px]">
                                <div className="text-slate-300 font-semibold mb-1">
                                  {data.monthName}
                                </div>
                                <div className="text-base font-bold text-sky-400">
                                  {formatRupiah(data.total)}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
                                  <div>• {data.transactionCount} transaksi belanja</div>
                                  <div>• {data.daysCount} hari aktif belanja</div>
                                  <div>• {data.itemsCount} varian bahan baku</div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="linear"
                        dataKey="total"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#1d4ed8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 10. MONTHLY SUMMARY TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Tabel Ringkasan Bulanan
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Rincian akumulasi pengeluaran bahan baku berdasarkan bulan transaksi
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    {monthlyReportData.length} Bulan
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-200/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Bulan</th>
                        <th className="py-3 px-4 text-center">Hari</th>
                        <th className="py-3 px-4 text-center">Item</th>
                        <th className="py-3 px-4 text-center">Transaksi</th>
                        <th className="py-3 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {monthlyReportData.map((row, idx) => (
                        <tr
                          key={row.yearMonth}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            idx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                          }`}
                        >
                          <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-800">
                            {row.monthName}
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap text-slate-600">
                            {row.daysCount} hari
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap text-slate-600">
                            {row.itemsCount} bahan
                          </td>
                          <td className="py-3.5 px-4 text-center whitespace-nowrap text-slate-600">
                            {row.transactionCount} nota
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-blue-700 text-sm">
                            {formatRupiah(row.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
