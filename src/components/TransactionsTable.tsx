import React, { useState } from 'react';
import {
  Receipt,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Store,
  ChevronDown,
  Eye,
  Trash2,
  FileSpreadsheet,
  Pencil
} from 'lucide-react';
import { Transaction } from '../types';
import {
  formatRupiah,
  getCategoryBadgeStyle,
  getStatusBadgeStyle
} from '../utils/formatters';

interface TransactionsTableProps {
  transactions: Transaction[];
  onViewAll: () => void;
  onSelectTransaction: (trx: Transaction) => void;
  onEditTransaction?: (trx: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
  totalCount: number;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onViewAll,
  onSelectTransaction,
  onEditTransaction,
  onDeleteTransaction,
  totalCount = 0,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredData = transactions.filter((item) => {
    if (filterCategory !== 'all' && item.category !== filterCategory) {
      return false;
    }
    return true;
  });

  // Display top 6 transactions on the dashboard table
  const displayedData = filteredData.slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Transaksi Belanja Terkini
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
              {displayedData.length} Ditampilkan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Nota pembelian bahan baku dapur katering tercatat otomatis
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Category filter pills */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterCategory === 'all'
                  ? 'bg-white shadow-xs text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterCategory('Daging & Seafood')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterCategory === 'Daging & Seafood'
                  ? 'bg-white shadow-xs text-red-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Daging
            </button>
            <button
              onClick={() => setFilterCategory('Bahan Pokok')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterCategory === 'Bahan Pokok'
                  ? 'bg-white shadow-xs text-amber-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Bahan Pokok
            </button>
            <button
              onClick={() => setFilterCategory('Susu & Telur')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterCategory === 'Susu & Telur'
                  ? 'bg-white shadow-xs text-purple-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Susu &amp; Telur
            </button>
          </div>

          {/* Prompt specified action button: Semua Riwayat (31) */}
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs hover:shadow transition-all group cursor-pointer"
          >
            <span>Semua Riwayat ({totalCount})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Tanggal &amp; Waktu</th>
              <th className="py-3 px-4">Item &amp; Deskripsi</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Supplier</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Nominal</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {displayedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center py-2">
                    <Receipt className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700 text-sm">
                      {transactions.length === 0
                        ? 'Belum ada transaksi pengeluaran tercatat'
                        : 'Tidak ada transaksi yang sesuai filter kategori ini'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {transactions.length === 0
                        ? 'Akun Anda baru dan bersih. Mulai catat belanja bahan baku dapur katering.'
                        : 'Coba pilih kategori lain atau reset filter'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              displayedData.map((trx) => {
                // Formatting date: 25 Sep 2026
                const dateObj = new Date(trx.date);
                const day = trx.date.split('-')[2];
                const monthNames = [
                  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
                ];
                const month = monthNames[parseInt(trx.date.split('-')[1], 10) - 1];
                const year = trx.date.split('-')[0];
                const formattedDate = `${day} ${month} ${year}`;

                return (
                  <tr
                    key={trx.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectTransaction(trx)}
                  >
                    {/* Tanggal & Waktu */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {formattedDate}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {trx.time} WIB
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Item & Deskripsi */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {trx.item}
                          </span>
                          {trx.qty && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                              ({trx.qty})
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 max-w-[260px] mt-0.5">
                          {trx.description}
                        </p>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${getCategoryBadgeStyle(
                          trx.category
                        )}`}
                      >
                        {trx.category}
                      </span>
                    </td>

                    {/* Supplier */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5 text-slate-700">
                        <Store className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{trx.supplier}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] border ${getStatusBadgeStyle(
                          trx.status
                        )}`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {trx.status}
                      </span>
                    </td>

                    {/* Nominal (Bold) */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="font-bold text-slate-900 text-sm tracking-tight">
                        {formatRupiah(trx.amount)}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td
                      className="py-3 px-4 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center space-x-1.5">
                        {onEditTransaction && (
                          <button
                            onClick={() => onEditTransaction(trx)}
                            title="Edit Transaksi Belanja"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onSelectTransaction(trx)}
                          title="Lihat Nota / Invoice"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteTransaction && (
                          <button
                            onClick={() => onDeleteTransaction(trx.id)}
                            title="Pindahkan ke Sampah"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer bar */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Seluruh data pengeluaran tersinkronisasi otomatis dengan aman
        </span>
        <button
          onClick={onViewAll}
          className="text-blue-600 hover:text-blue-700 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          Lihat semua {totalCount} riwayat &rarr;
        </button>
      </div>
    </div>
  );
};
