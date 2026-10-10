import React, { useState, useEffect } from 'react';
import {
  X,
  Receipt,
  Store,
  Calendar,
  Clock,
  DollarSign,
  Tag,
  CheckCircle2,
  Edit3,
  Save,
  AlertCircle
} from 'lucide-react';
import { CategoryType, PaymentStatus, Transaction } from '../types';

interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (updated: Transaction) => Promise<void> | void;
  availableSuppliers: string[];
}

const CATEGORIES: CategoryType[] = [
  'Daging & Seafood',
  'Bahan Pokok',
  'Bumbu & Rempah',
  'Packaging',
  'Susu & Telur',
  'Sayuran & Buah',
  'Minyak & Gas',
  'Lain-lain',
];

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onSave,
  availableSuppliers,
}) => {
  const [item, setItem] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('Daging & Seafood');
  const [supplier, setSupplier] = useState('');
  const [customSupplier, setCustomSupplier] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [qty, setQty] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('Lunas (Transfer)');
  const [notes, setNotes] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state whenever transaction changes
  useEffect(() => {
    if (transaction) {
      setItem(transaction.item || '');
      setDescription(transaction.description || '');
      setCategory(transaction.category || 'Daging & Seafood');
      
      const supplierExists = availableSuppliers.includes(transaction.supplier);
      if (supplierExists || !transaction.supplier) {
        setSupplier(transaction.supplier || availableSuppliers[0] || 'Pasar Tradisional');
        setCustomSupplier('');
      } else {
        setSupplier('custom');
        setCustomSupplier(transaction.supplier);
      }

      setAmount(transaction.amount ? transaction.amount.toString() : '');
      setQty(transaction.qty || '');
      setDate(transaction.date || new Date().toISOString().split('T')[0]);
      setTime(transaction.time || '12:00');
      setStatus(transaction.status || 'Lunas (Transfer)');
      setNotes(transaction.notes || '');
      setInvoiceNumber(transaction.invoiceNumber || transaction.id);
      setErrorMsg(null);
    }
  }, [transaction, availableSuppliers]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!item.trim()) {
      setErrorMsg('Nama bahan atau item belanja wajib diisi.');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Nominal belanja harus lebih dari 0.');
      return;
    }

    const finalSupplier =
      supplier === 'custom' && customSupplier.trim()
        ? customSupplier.trim()
        : supplier || 'Mitra Pasar';

    const updatedTrx: Transaction = {
      ...transaction,
      item: item.trim(),
      description: description.trim() || `${qty || '1 item'} untuk operasional katering`,
      category,
      supplier: finalSupplier,
      amount: parsedAmount,
      qty: qty.trim(),
      date,
      time,
      status,
      notes: notes.trim(),
      invoiceNumber: invoiceNumber.trim() || transaction.invoiceNumber || transaction.id,
    };

    setIsSubmitting(true);
    try {
      await onSave(updatedTrx);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Gagal menyimpan perubahan transaksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-300">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Edit Riwayat Pembelian</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-200 border border-blue-400/20 font-mono">
                  {transaction.invoiceNumber || transaction.id}
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Perbarui rincian belanja bahan baku operasional katering
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Item Name & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Bahan / Item <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Daging Sapi Has Dalam, Ayam Broiler"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kuantitas / Jumlah
              </label>
              <input
                type="text"
                placeholder="Contoh: 2 kg, 1 sak"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Category & Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Bahan <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mitra Supplier / Toko
              </label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              >
                {availableSuppliers.map((sup) => (
                  <option key={sup} value={sup}>
                    {sup}
                  </option>
                ))}
                <option value="custom">+ Toko / Supplier Baru...</option>
              </select>
              {supplier === 'custom' && (
                <input
                  type="text"
                  placeholder="Ketik nama toko / supplier"
                  value={customSupplier}
                  onChange={(e) => setCustomSupplier(e.target.value)}
                  className="mt-1.5 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              )}
            </div>
          </div>

          {/* Nominal (Total Harga) & Status Pembayaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nominal Belanja (Total Rp) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Rp
                </span>
                <input
                  type="number"
                  required
                  placeholder="50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Pembayaran
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
              >
                <option value="Lunas (Transfer)">Lunas (Transfer)</option>
                <option value="Lunas (Cash)">Lunas (Cash)</option>
                <option value="Tempo (Hutang)">Tempo (Hutang)</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Pembelian
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Waktu Transaksi
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Invoice / No Nota & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Nota / Invoice
              </label>
              <input
                type="text"
                placeholder="INV/20260925/001"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keterangan / Keperluan Menu
              </label>
              <input
                type="text"
                placeholder="Contoh: Untuk pesanan prasmanan 150 porsi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Dapur / Tambahan
            </label>
            <textarea
              rows={2}
              placeholder="Catatan tambahan kondisi bahan, potongan harga, atau instruksi koki..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
