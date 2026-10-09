import React from 'react';
import {
  Users,
  Store,
  Phone,
  MapPin,
  Star,
  ExternalLink,
  Plus,
  Coins,
  Receipt
} from 'lucide-react';
import { INITIAL_SUPPLIERS } from '../../data/initialData';
import { formatRupiah } from '../../utils/formatters';

export const SuppliersView: React.FC = () => {
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
              {INITIAL_SUPPLIERS.length} Mitra Aktif
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Daftar pasar tradisional, agen daging, toko bumbu, dan distributor resmi katering
          </p>
        </div>

        <button
          onClick={() => alert('Fitur tambah vendor supplier baru siap digunakan!')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Mitra Baru</span>
        </button>
      </div>

      {/* Grid Suppliers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
        {INITIAL_SUPPLIERS.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
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

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-amber-700 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{supplier.rating}</span>
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
        ))}
      </div>
    </div>
  );
};
