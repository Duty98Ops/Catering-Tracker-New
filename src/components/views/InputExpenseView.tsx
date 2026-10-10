import React, { useState } from 'react';
import {
  PlusCircle,
  Receipt,
  Store,
  Calendar,
  Clock,
  DollarSign,
  Tag,
  FileText,
  Upload,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers,
  History,
  RotateCcw,
  Check
} from 'lucide-react';
import { CategoryType, PaymentStatus, Transaction } from '../../types';
import { formatRupiah, getCategoryBadgeStyle, getStatusBadgeStyle } from '../../utils/formatters';

interface InputExpenseViewProps {
  onAddTransaction: (trx: Omit<Transaction, 'id'>) => void;
  availableSuppliers: string[];
  recentTransactions: Transaction[];
  onViewAllHistory: () => void;
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

export const InputExpenseView: React.FC<InputExpenseViewProps> = ({
  onAddTransaction,
  availableSuppliers,
  recentTransactions,
  onViewAllHistory,
}) => {
  const todayStr = '2026-09-26';
  const nowTimeStr = '10:30';

  const [item, setItem] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('Daging & Seafood');
  const [supplier, setSupplier] = useState(availableSuppliers[0] || 'Pasar Tradisional');
  const [customSupplier, setCustomSupplier] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [qty, setQty] = useState('');
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState(nowTimeStr);
  const [status, setStatus] = useState<PaymentStatus>('Lunas (Transfer)');
  const [notes, setNotes] = useState('');
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

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

    const generatedInv = `INV/${date.replace(/-/g, '')}/${Math.floor(100 + Math.random() * 900)}`;

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
      invoiceNumber: generatedInv,
    });

    setSuccessNotice(`Nota ${item} (${formatRupiah(parsedAmount)}) berhasil disimpan!`);
    setTimeout(() => setSuccessNotice(null), 4000);

    // Reset fields
    setItem('');
    setDescription('');
    setAmount('');
    setQty('');
    setNotes('');
    setReceiptFileName(null);
  };

  const handleApplyPreset = (
    presetItem: string,
    presetCat: CategoryType,
    presetPrice: number,
    presetQty: string,
    presetSupplier: string
  ) => {
    setItem(presetItem);
    setCategory(presetCat);
    setAmount(presetPrice.toString());
    setQty(presetQty);
    setSupplier(presetSupplier);
    setDescription(`${presetQty} ${presetItem} segar untuk menu pesanan katering`);
  };

  const currentParsedAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Input Belanja Bahan Baku
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Formulir Pembelian
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan nota, kuitansi, dan faktur pengeluaran bahan dapur katering secara presisi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewAllHistory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Lihat Riwayat Belanja</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Tersimpan Aman</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Live Receipt Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (7 / 12) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <PlusCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Rincian Nota Belanja</h3>
                <p className="text-[11px] text-slate-500">Isi parameter pembelian di bawah ini</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Dapur Utama</span>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Pilihan Cepat Belanja Rutin:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset('Daging Has Luar Sapi', 'Daging & Seafood', 250000, '2 kg', 'UD Berkah Daging')
                }
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-700 font-medium transition-colors"
              >
                🥩 Daging Sapi 2kg (Rp 250k)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset('Fillet Dada Ayam', 'Daging & Seafood', 110000, '2.5 kg', 'UD Berkah Daging')
                }
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-700 font-medium transition-colors"
              >
                🍗 Ayam Fillet 2.5kg (Rp 110k)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset('Beras Ramos Premium', 'Bahan Pokok', 350000, '25 kg', 'Grosir Beras Jaya Mandiri')
                }
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-700 font-medium transition-colors"
              >
                🍚 Beras 25kg (Rp 350k)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset('Telur Ayam Ras 1 Tray', 'Susu & Telur', 56000, '1 tray (30 butir)', 'Agen Telur Berkah')
                }
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 text-slate-700 hover:text-purple-700 font-medium transition-colors"
              >
                🥚 Telur 1 Tray (Rp 56k)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset('Kotak Bento 4 Sekat', 'Packaging', 95000, '200 pcs', 'Mitra Plastik Surya')
                }
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 font-medium transition-colors"
              >
                🍱 Bento Box 200pcs (Rp 95k)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Row 1: Item name & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Item / Bahan Baku <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Daging Sapi Has Luar, Ayam Broiler, Beras Ramos..."
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah / Kuantitas
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 5 kg, 2 karton, 3 sak..."
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Row 2: Category & Supplier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Bahan Baku <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
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
                  Mitra Supplier / Toko <span className="text-red-500">*</span>
                </label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
                >
                  {availableSuppliers.map((sup) => (
                    <option key={sup} value={sup}>
                      {sup}
                    </option>
                  ))}
                  <option value="custom">+ Tambah Supplier Baru...</option>
                </select>
                {supplier === 'custom' && (
                  <input
                    type="text"
                    placeholder="Ketik nama toko/supplier baru"
                    value={customSupplier}
                    onChange={(e) => setCustomSupplier(e.target.value)}
                    className="mt-2 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                )}
              </div>
            </div>

            {/* Row 3: Nominal & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Nominal Pembelian (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 150000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Metode &amp; Status Pembayaran
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
                >
                  <option value="Lunas (Transfer)">Lunas (Transfer)</option>
                  <option value="Lunas (Cash)">Lunas (Cash)</option>
                  <option value="Tempo (Hutang)">Tempo (Hutang)</option>
                </select>
              </div>
            </div>

            {/* Row 4: Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Nota
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Row 5: Menu Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deskripsi Penggunaan Menu / Pesanan Katering
              </label>
              <input
                type="text"
                placeholder="Contoh: Menu prasmanan hajatan keluarga 350 porsi & nasi box panitia"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {/* Row 6: Struk Attachment */}
            <div className="p-3.5 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Lampirkan Bukti Foto Struk / Nota</p>
                  <p className="text-[10px] text-slate-400">Format gambar JPEG, PNG, atau PDF faktur resmi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setReceiptFileName('struk_katering_' + Math.floor(1000 + Math.random() * 9000) + '.jpg')
                }
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-[11px]"
              >
                {receiptFileName ? 'Terganti: ' + receiptFileName : 'Pilih File Nota'}
              </button>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setItem('');
                  setDescription('');
                  setAmount('');
                  setQty('');
                }}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Form</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Transaksi Belanja</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview & Recent Stream (5 / 12) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* Live Receipt Paper Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Live Preview Nota
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                Otomatis
              </span>
            </div>

            {/* Paper Preview */}
            <div className="mt-3.5 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 font-sans space-y-3">
              <div className="text-center pb-2 border-b border-slate-200">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
                  Katering Rasa Sejahtera
                </h4>
                <p className="text-[10px] text-slate-500">Nota Pembelian Bahan Operasional</p>
                <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                  {status}
                </div>
              </div>

              <div className="text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Item:</span>
                  <strong className="text-slate-900">{item || '(Nama Bahan)'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jumlah:</span>
                  <span>{qty || '1 item'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kategori:</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${getCategoryBadgeStyle(category)}`}>
                    {category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Supplier:</span>
                  <span>{supplier === 'custom' ? customSupplier || 'Supplier Baru' : supplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tanggal:</span>
                  <span>{date} • {time} WIB</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs font-bold text-slate-900">
                <span>Total Biaya</span>
                <span className="text-sm text-blue-700">
                  {currentParsedAmount > 0 ? formatRupiah(currentParsedAmount) : 'Rp 0'}
                </span>
              </div>
            </div>
          </div>

          {/* Stream 3 Transaksi Terakhir yang Baru Diinput */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Input Terbaru Sesi Ini
              </h4>
              <button
                onClick={onViewAllHistory}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
              >
                Semua &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {recentTransactions.slice(0, 3).map((trx) => (
                <div
                  key={trx.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-900 truncate">{trx.item}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {trx.supplier} • {trx.date}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-slate-900 block">
                      {formatRupiah(trx.amount)}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-semibold">Tersimpan</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
