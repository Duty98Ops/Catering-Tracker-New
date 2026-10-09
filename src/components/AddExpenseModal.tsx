import React, { useState } from 'react';
import {
  X,
  Plus,
  Receipt,
  Store,
  Calendar,
  Clock,
  DollarSign,
  Tag,
  FileText,
  Upload,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { CategoryType, PaymentStatus, Transaction } from '../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (trx: Omit<Transaction, 'id'>) => void;
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

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  availableSuppliers,
}) => {
  const [item, setItem] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('Daging & Seafood');
  const [supplier, setSupplier] = useState(availableSuppliers[0] || 'Pasar Tradisional');
  const [customSupplier, setCustomSupplier] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [qty, setQty] = useState('');
  const [date, setDate] = useState('2026-09-25');
  const [time, setTime] = useState('14:30');
  const [status, setStatus] = useState<PaymentStatus>('Lunas (Transfer)');
  const [notes, setNotes] = useState('');
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!item.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Mohon lengkapi nama item dan nominal belanja yang valid.');
      return;
    }

    const finalSupplier =
      supplier === 'custom' && customSupplier.trim()
        ? customSupplier.trim()
        : supplier;

    onAddTransaction({
      item: item.trim(),
      description: description.trim() || `${qty || '1 porsi'} untuk kebutuhan dapur katering`,
      category,
      supplier: finalSupplier,
      amount: parsedAmount,
      qty: qty.trim() || '1 item',
      date,
      time,
      status,
      notes: notes.trim(),
      invoiceNumber: `INV/${date.replace(/-/g, '')}/${Math.floor(100 + Math.random() * 900)}`,
    });

    // Reset form
    setItem('');
    setDescription('');
    setAmount('');
    setQty('');
    setNotes('');
    setReceiptFileName(null);
    onClose();
  };

  const handleQuickPreset = (presetItem: string, presetCat: CategoryType, presetPrice: number, presetQty: string) => {
    setItem(presetItem);
    setCategory(presetCat);
    setAmount(presetPrice.toString());
    setQty(presetQty);
    setDescription(`${presetQty} ${presetItem} segar untuk menu pesanan katering`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-300">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Tambah Belanja Bahan Pangan
              </h3>
              <p className="text-xs text-slate-300">
                Pencatatan nota pengeluaran operasional dapur katering
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

        {/* Quick Presets */}
        <div className="px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200/80">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Template Belanja Cepat:
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickPreset('Ayam Broiler', 'Daging & Seafood', 34000, '2 kg')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              🍗 Ayam 2kg (Rp 34k)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Beras Ramos 25kg', 'Bahan Pokok', 350000, '25 kg')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-colors"
            >
              🍚 Beras 25kg (Rp 350k)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Telur Ayam Segar', 'Susu & Telur', 54000, '2 kg')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
            >
              🥚 Telur 2kg (Rp 54k)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('Bumbu Rempah Racik', 'Bumbu & Rempah', 75000, '1 paket')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
            >
              🌶️ Rempah (Rp 75k)
            </button>
          </div>
        </div>

        {/* Form */}
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
                placeholder="Contoh: Daging Sapi Has Dalam, Ayam Broiler, Cabai"
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
                  placeholder="Ketik nama toko/supplier baru"
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

          {/* Description & Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Item / Catatan Menu
            </label>
            <input
              type="text"
              placeholder="Contoh: 2 kg ayam potong segar untuk menu opor pernikahan"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Struk / Nota Upload Mockup */}
          <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-slate-400" />
              <div>
                <p className="font-semibold text-slate-700">Lampirkan Foto Nota / Struk Fisik</p>
                <p className="text-[10px] text-slate-400">JPG, PNG atau PDF maks 5MB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReceiptFileName('nota_pembelian_pasar_' + Date.now().toString().slice(-4) + '.jpg')}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-[11px]"
            >
              {receiptFileName ? 'Terganti: ' + receiptFileName : 'Pilih File'}
            </button>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
