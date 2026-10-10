import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Store,
  CheckCircle2,
  Eye,
  Trash2,
  ArrowUpDown,
  FileSpreadsheet,
  Pencil
} from 'lucide-react';
import { Transaction, CategoryType } from '../../types';
import {
  formatRupiah,
  getCategoryBadgeStyle,
  getStatusBadgeStyle
} from '../../utils/formatters';
import { EditTransactionModal } from '../EditTransactionModal';

interface HistoryViewProps {
  transactions: Transaction[];
  onSelectTransaction: (trx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onUpdateTransaction?: (trx: Transaction) => Promise<void> | void;
  onExportCSV: () => void;
  onOpenAddModal: () => void;
  availableSuppliers?: string[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  transactions,
  onSelectTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
  onExportCSV,
  onOpenAddModal,
  availableSuppliers = [],
}) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filtered = transactions.filter((trx) => {
    const matchesSearch =
      trx.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trx.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || trx.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' || trx.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`).getTime();
    const dateB = new Date(`${b.date}T${b.time}`).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const totalFilteredAmount = sorted.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Riwayat Pembelian Bahan Baku
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {sorted.length} Dokumen Nota
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Arsip lengkap seluruh transaksi belanja operasional katering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor CSV / Excel</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            <span>+ Catat Belanja Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama bahan, deskripsi, atau toko..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Semua Kategori</option>
              <option value="Daging & Seafood">Daging &amp; Seafood</option>
              <option value="Bahan Pokok">Bahan Pokok</option>
              <option value="Bumbu & Rempah">Bumbu &amp; Rempah</option>
              <option value="Packaging">Packaging</option>
              <option value="Susu & Telur">Susu &amp; Telur</option>
              <option value="Sayuran & Buah">Sayuran &amp; Buah</option>
              <option value="Minyak & Gas">Minyak &amp; Gas</option>
              <option value="Lain-lain">Lain-lain</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Semua Status Bayar</option>
              <option value="Lunas (Transfer)">Lunas (Transfer)</option>
              <option value="Lunas (Cash)">Lunas (Cash)</option>
              <option value="Tempo (Hutang)">Tempo (Hutang)</option>
            </select>
          </div>
        </div>

        {/* Quick summary strip */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan <strong className="text-slate-800">{sorted.length}</strong> dari{' '}
            {transactions.length} total transaksi
          </span>
          <span className="text-slate-800 font-bold">
            Total Nilai: <span className="text-blue-700">{formatRupiah(totalFilteredAmount)}</span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th
                  className="py-3 px-4 cursor-pointer hover:text-slate-800"
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                >
                  <div className="flex items-center gap-1">
                    <span>Tanggal &amp; Waktu</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Item &amp; Deskripsi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data riwayat transaksi yang cocok.
                  </td>
                </tr>
              ) : (
                sorted.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectTransaction(trx)}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-800">{trx.date}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{trx.time} WIB</p>
                    </td>

                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {trx.item}
                          </span>
                          {trx.qty && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              ({trx.qty})
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 max-w-[280px]">
                          {trx.description}
                        </p>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${getCategoryBadgeStyle(
                          trx.category
                        )}`}
                      >
                        {trx.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                      {trx.supplier}
                    </td>

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

                    <td className="py-3 px-4 text-right whitespace-nowrap font-bold text-slate-900">
                      {formatRupiah(trx.amount)}
                    </td>

                    <td
                      className="py-3 px-4 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => setEditingTransaction(trx)}
                          title="Edit Transaksi"
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectTransaction(trx)}
                          title="Lihat Nota"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(trx.id)}
                          title="Hapus"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Transaksi Pembelian */}
      <EditTransactionModal
        isOpen={Boolean(editingTransaction)}
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSave={async (updated) => {
          if (onUpdateTransaction) {
            await onUpdateTransaction(updated);
          }
          setEditingTransaction(null);
        }}
        availableSuppliers={availableSuppliers}
      />
    </div>
  );
};
