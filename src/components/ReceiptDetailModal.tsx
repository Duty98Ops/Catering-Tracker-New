import React from 'react';
import {
  X,
  Printer,
  Share2,
  Calendar,
  Store,
  Tag,
  CheckCircle2,
  Receipt,
  FileText,
  Clock,
  MapPin,
  Pencil
} from 'lucide-react';
import { Transaction } from '../types';
import {
  formatRupiah,
  getCategoryBadgeStyle,
  getStatusBadgeStyle
} from '../utils/formatters';

interface ReceiptDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onEdit?: (trx: Transaction) => void;
}

export const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({
  transaction,
  onClose,
  onEdit,
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Receipt className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Rincian Nota Pembelian
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {transaction.invoiceNumber || transaction.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body (Receipt Paper style) */}
        <div className="p-6 space-y-5 bg-white print:p-0">
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <h4 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
              Katering Rasa Sejahtera
            </h4>
            <p className="text-xs text-slate-500">
              Divisi Operasional &amp; Pengadaan Bahan Pangan
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] border bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {transaction.status}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-semibold">Waktu Pembelian</p>
              <p className="font-semibold text-slate-800 mt-0.5">{transaction.date}</p>
              <p className="text-slate-500 font-mono text-[11px]">{transaction.time} WIB</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-semibold">Mitra Supplier</p>
              <p className="font-semibold text-slate-800 mt-0.5">{transaction.supplier}</p>
              <p className="text-slate-500 text-[11px]">Pasar / Grosir Resmi</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200/60">
              <p className="text-slate-400 text-[10px] uppercase font-semibold">Kategori Alokasi</p>
              <span
                className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getCategoryBadgeStyle(
                  transaction.category
                )}`}
              >
                {transaction.category}
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100/70 px-4 py-2 text-[11px] font-bold text-slate-600 uppercase flex justify-between">
              <span>Item &amp; Deskripsi</span>
              <span>Nominal</span>
            </div>
            <div className="p-4 space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-sm font-bold text-slate-900">{transaction.item}</h5>
                  <p className="text-xs text-slate-500 mt-0.5">{transaction.description}</p>
                  {transaction.qty && (
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Jumlah: <strong className="text-slate-600">{transaction.qty}</strong>
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900">
                    {formatRupiah(transaction.amount)}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
              <span>Total Pengeluaran</span>
              <span className="text-base text-blue-700">{formatRupiah(transaction.amount)}</span>
            </div>
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div className="text-xs bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-amber-900">
              <p className="font-semibold text-amber-800 text-[11px]">Catatan Dapur:</p>
              <p className="mt-0.5 text-amber-800/90">{transaction.notes}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak / PDF
              </button>
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(transaction);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Transaksi</span>
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
