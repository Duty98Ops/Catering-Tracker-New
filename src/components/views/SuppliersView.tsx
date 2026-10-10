import React, { useState } from 'react';
import {
  Users,
  Store,
  Phone,
  MapPin,
  Star,
  ExternalLink,
  Plus,
  Coins,
  Receipt,
  X,
  CheckCircle2,
  Pencil,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Supplier } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier?: (sup: Supplier) => Promise<void>;
  onUpdateSupplier?: (sup: Supplier) => Promise<void>;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onAddSupplier,
  onUpdateSupplier,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState('4.8');

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setName('');
    setCategory('');
    setPhone('');
    setAddress('');
    setRating('4.8');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setName(sup.name || '');
    setCategory(sup.category || '');
    setPhone(sup.phone || '');
    setAddress(sup.address || '');
    setRating(sup.rating ? sup.rating.toString() : '4.8');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
    setErrorMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Nama supplier dan nomor telepon wajib diisi.');
      return;
    }

    const parsedRating = Math.min(5, Math.max(1, parseFloat(rating) || 4.8));

    setIsSubmitting(true);
    try {
      if (editingSupplier) {
        // Edit mode
        const updatedSup: Supplier = {
          ...editingSupplier,
          name: name.trim(),
          category: category.trim() || 'Bahan Pangan Katering',
          phone: phone.trim(),
          address: address.trim() || 'Pasar Tradisional / Los Mitra',
          rating: parsedRating,
        };

        if (onUpdateSupplier) {
          await onUpdateSupplier(updatedSup);
        }
      } else {
        // Add mode
        const newSup: Supplier = {
          id: `SUP-${Date.now()}`,
          name: name.trim(),
          category: category.trim() || 'Bahan Pangan Katering',
          phone: phone.trim(),
          address: address.trim() || 'Pasar Tradisional / Los Mitra',
          rating: parsedRating,
          totalSpent: 0,
          transactionCount: 0,
        };

        if (onAddSupplier) {
          await onAddSupplier(newSup);
        }
      }

      handleCloseModal();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan saat menyimpan data mitra supplier.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Mitra Supplier Bahan Baku
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {suppliers.length} Mitra Aktif
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Daftar pasar tradisional, agen daging, toko bumbu, dan distributor bahan katering
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Mitra Baru</span>
        </button>
      </div>

      {/* Grid Suppliers */}
      {suppliers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 shadow-xs text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto mb-3">
            <Store className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Belum Ada Mitra Supplier</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Akun Anda baru dan bersih. Mulai catat daftar toko langganan, pasar tradisional, distributor, atau toko bumbu untuk katering Anda.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Mitra Baru Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-sm">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">
                        {supplier.name}
                      </h3>
                      <p className="text-[11px] text-blue-600 font-medium mt-0.5">
                        {supplier.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-amber-700 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{supplier.rating}</span>
                    </div>
                    <button
                      onClick={() => handleOpenEdit(supplier)}
                      title="Edit Data Mitra"
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Spend Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Total Belanja</p>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">
                      {formatRupiah(supplier.totalSpent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Frekuensi</p>
                    <p className="font-bold text-slate-900 text-xs mt-0.5">
                      {supplier.transactionCount} Transaksi
                    </p>
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-mono text-[11px]">{supplier.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-500 line-clamp-2">
                      {supplier.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Vendor Terverifikasi
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(supplier)}
                    className="text-xs text-slate-600 hover:text-blue-600 font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Edit Mitra Supplier"
                  >
                    <Pencil className="w-3 h-3 text-slate-400" />
                    <span>Edit</span>
                  </button>
                  <a
                    href={`https://wa.me/${supplier.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Hubungi WA</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah / Edit Supplier */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingSupplier ? 'Edit Mitra Supplier' : 'Tambah Mitra Supplier Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingSupplier
                    ? 'Perbarui informasi kontak dan data vendor katering'
                    : 'Daftarkan vendor pasar atau distributor baru'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Toko / Supplier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Toko Sayur Segar Jaya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Produk</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sayur, Daging, Bumbu"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating Kualitas (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    placeholder="4.8"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="+62 812-3456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Pasar / Kios</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Pasar Induk Kramat Jati, Blok B No. 12"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingSupplier ? 'Simpan Perubahan' : 'Simpan Mitra'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
