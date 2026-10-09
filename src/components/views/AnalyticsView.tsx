import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  Percent,
  DollarSign,
  PieChart as PieIcon,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-sky-300 border border-blue-400/30 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-sky-300" />
            Cost Intelligence Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Analitik &amp; Laporan Efisiensi Biaya Pangan
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Audit margin operasional bahan baku katering per September 2026. Alokasi biaya bahan baku berada dalam rasio aman 28.4% dari total omzet.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <p className="text-[11px] text-slate-300">Food Cost Ratio</p>
            <p className="text-xl font-black text-white mt-0.5">28.4%</p>
            <span className="text-[10px] text-emerald-400 font-semibold">&darr; 3.6% di bawah pagu maks (32%)</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <p className="text-[11px] text-slate-300">Skor Efisiensi Belanja</p>
            <p className="text-xl font-black text-emerald-400 mt-0.5">94 / 100</p>
            <span className="text-[10px] text-slate-300 font-medium">Sangat Optimal (Grade A)</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <p className="text-[11px] text-slate-300">Rata Biaya / Pax Nasi Box</p>
            <p className="text-xl font-black text-white mt-0.5">Rp 12.800</p>
            <span className="text-[10px] text-sky-300 font-medium">Margin Kotor: 57.3%</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <p className="text-[11px] text-slate-300">Potensi Hemat Bulan Depan</p>
            <p className="text-xl font-black text-amber-400 mt-0.5">Rp 340.000</p>
            <span className="text-[10px] text-slate-300 font-medium">Bila beli daging partai grosir</span>
          </div>
        </div>
      </div>

      {/* Grid: Unit Economics & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Unit Economics Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Struktur Biaya Per Porsi (Unit Economics)
              </h3>
              <p className="text-xs text-slate-500">Estimasi biaya bahan pokok per menu katering</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
              Standar Dapur
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-800">1. Paket Prasmanan Wedding VIP (Rp 65.000/pax)</span>
                <span className="text-blue-700">Rp 21.450 (33%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '33%' }}></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Komponen utama: Daging Sapi Lada Hitam, Ayam Kodok, Gurame Asam Manis</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-800">2. Nasi Box Corporate Bento 4 Sekat (Rp 30.000/pax)</span>
                <span className="text-emerald-700">Rp 8.900 (29.6%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '29.6%' }}></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Komponen utama: Ayam Suwir Bali, Telur Balado, Capcay, Thinwall Box</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-800">3. Snack Box Manis &amp; Asin (Rp 15.000/box)</span>
                <span className="text-purple-700">Rp 3.850 (25.6%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '25.6%' }}></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Komponen utama: Lemper Ayam, Risoles Ragout, Sus Vla Susu</p>
            </div>
          </div>
        </div>

        {/* AI Cost Intelligence Recommendations */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Rekomendasi Efisiensi Purchasing
                </h3>
                <p className="text-xs text-slate-500">Optimasi belanja bahan baku berdasarkan data transaksi</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-amber-900 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Konsolidasi Pesanan Daging (Daging &amp; Seafood: 44%)
                </strong>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">Prioritas Tinggi</span>
              </div>
              <p className="text-amber-800/90 text-[11px] leading-relaxed">
                Porsi daging memakan 44% dari total pengeluaran (Rp 715.880 pada periode ini, dengan lonjakan Rp 1.119.000 pada 22 Sep). Alihkan pembelian harian eceran ke kontrak mingguan dengan <em>UD Berkah Daging</em> untuk potongan harga 7%–10%.
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs space-y-1">
              <strong className="text-emerald-900 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Stok Bahan Kering &amp; Beras Tepat Sasaran
              </strong>
              <p className="text-emerald-800/90 text-[11px] leading-relaxed">
                Pengadaan Bahan Pokok (37%) terkonsentrasi di <em>Grosir Beras Jaya Mandiri</em> sudah mendapatkan selisih harga Rp 1.500/kg lebih murah dibanding pasar eceran harian.
              </p>
            </div>

            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl text-xs space-y-1">
              <strong className="text-blue-900 font-bold flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                Packaging Ramah Lingkungan
              </strong>
              <p className="text-blue-800/90 text-[11px] leading-relaxed">
                Biaya kemasan (4%) tetap stabil di Rp 65.080. Pertahankan pembelian kemasan minimal 500 pcs untuk mendapatkan gratis biaya antar ke dapur katering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
