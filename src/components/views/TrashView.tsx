import React from 'react';
import {
  Trash2,
  RotateCcw,
  AlertOctagon,
  Calendar,
  Store,
  CheckCircle2
} from 'lucide-react';
import { Transaction } from '../../types';
import { formatRupiah, getCategoryBadgeStyle } from '../../utils/formatters';

interface TrashViewProps {
  trashItems: Transaction[];
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onClearAllTrash: () => void;
}

export const TrashView: React.FC<TrashViewProps> = ({
  trashItems,
  onRestore,
  onPermanentDelete,
  onClearAllTrash,
}) => {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Sampah &amp; Arsip Transaksi
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {trashItems.length} Item
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data nota belanja yang dihapus sementara. Anda dapat memulihkan atau menghapus permanen.
          </p>
        </div>

        {trashItems.length > 0 && (
          <button
            onClick={onClearAllTrash}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start md:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Kosongkan Sampah</span>
          </button>
        )}
      </div>

      {trashItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Tempat Sampah Bersih
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tidak ada transaksi yang sedang berada di folder sampah atau arsip saat ini.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Item &amp; Deskripsi</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trashItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-800">{item.date}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.time}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{item.item}</span>
                      <p className="text-[11px] text-slate-500">{item.description}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryBadgeStyle(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{item.supplier}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatRupiah(item.amount)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => onRestore(item.id)}
                          title="Pulihkan Transaksi"
                          className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Pulihkan
                        </button>
                        <button
                          onClick={() => onPermanentDelete(item.id)}
                          title="Hapus Permanen"
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
