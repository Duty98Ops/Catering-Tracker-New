import React, { useState } from 'react';
import {
  Store,
  Phone,
  MapPin,
  ExternalLink,
  Plus,
  X,
  Pencil,
  Trash2,
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
  onDeleteSupplier?: (id: string) => Promise<void>;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setName('');
    setCategory('');
    setPhone('');
    setAddress('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setName(sup.name || '');
    setCategory(sup.category || '');
    setPhone(sup.phone || '');
    setAddress(sup.address || '');
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

    // Nama dan Nomor sekarang opsional
    const finalName = name.trim() || 'Supplier (Tanpa Nama)';
    const finalPhone = phone.trim();

    setIsSubmitting(true);
    try {
      if (editingSupplier) {
        // Edit mode
        const updatedSup: Supplier = {
          ...editingSupplier,
          name: finalName,
          category: category.trim() || 'Bahan Pangan Katering',
          phone: finalPhone,
          address: address.trim() || 'Pasar Tradisional / Los Mitra',
          rating: editingSupplier.rating ?? 5,
        };

        if (onUpdateSupplier) {
          await onUpdateSupplier(updatedSup);
        }
      } else {
        // Add mode
        const newSup: Supplier = {
          id: `SUP-${Date.now()}`,
          name: finalName,
          category: category.trim() || 'Bahan Pangan Katering',
          phone: finalPhone,
          address: address.trim() || 'Pasar Tradisional / Los Mitra',
          rating: 5,
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

  const handleConfirmDelete = async () => {
    if (!supplierToDelete || !onDeleteSupplier) return;
    setIsDeleting(true);
    try {
      await onDeleteSupplier(supplierToDelete.id);
      setSupplierToDelete(null);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsDeleting(false);
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
          {suppliers.map((supplier) => {
            const cleanPhone = (supplier.phone || '').replace(/[^0-9]/g, '');
            const hasPhone = cleanPhone.length > 0;

            return (
              <div
                key={supplier.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-sm shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">
                          {supplier.name || 'Supplier (Tanpa Nama)'}
                        </h3>
                        <p className="text-[11px] text-blue-600 font-medium mt-0.5">
                          {supplier.category || 'Bahan Pangan Katering'}
                        </p>
                      </div>
                    </div>

                    {/* Quick action buttons in top-right */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(supplier)}
                        title="Edit Data Mitra"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteSupplier && (
                        <button
                          onClick={() => setSupplierToDelete(supplier)}
                          title="Hapus Mitra Supplier"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Spend Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Total Belanja</p>
                      <p className="font-bold text-slate-900 text-xs mt-0.5">
                        {formatRupiah(supplier.totalSpent || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Frekuensi</p>
                      <p className="font-bold text-slate-900 text-xs mt-0.5">
                        {supplier.transactionCount || 0} Transaksi
                      </p>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                    {hasPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-mono text-[11px]">{supplier.phone}</span>
                      </div>
                    )}
                    {supplier.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] text-slate-500 line-clamp-2">
                          {supplier.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Edit & Hapus on left, Hubungi WA on right if phone exists */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(supplier)}
                      className="text-xs text-slate-600 hover:text-blue-600 font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Edit Mitra Supplier"
                    >
                      <Pencil className="w-3 h-3 text-slate-400" />
                      <span>Edit</span>
                    </button>
                    {onDeleteSupplier && (
                      <button
                        onClick={() => setSupplierToDelete(supplier)}
                        className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                        title="Hapus Mitra Supplier"
                      >
                        <Trash2 className="w-3 h-3 text-rose-500" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>

                  {/* Hubungi WA hanya jika ada nomor phone / WA */}
                  {hasPhone && (
                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Hubungi WA</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {supplierToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3.5">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Hapus Mitra Supplier?
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Apakah Anda yakin ingin menghapus{' '}
              <span className="font-semibold text-slate-800">
                "{supplierToDelete.name || 'Supplier'}"
              </span>
              ? Data mitra ini akan dihapus dari daftar supplier.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setSupplierToDelete(null)}
                className="w-1/2 px-4 py-2 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="w-1/2 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus</span>
                  </>
                )}
              </button>
            </div>
          </div>
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
                  Nama Toko / Supplier <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Toko Sayur Segar Jaya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kategori Produk <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sayur, Daging, Bumbu"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Telepon / WhatsApp <span className="text-slate-400 font-normal">(Opsional - hanya angka)</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Pasar / Kios <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
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
