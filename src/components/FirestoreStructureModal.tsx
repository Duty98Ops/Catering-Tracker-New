import React, { useState } from 'react';
import {
  X,
  Database,
  Layers,
  Code2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  FileJson,
  Table
} from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah } from '../utils/formatters';

interface FirestoreStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTransactions: Transaction[];
  activeUserId: string;
}

export const FirestoreStructureModal: React.FC<FirestoreStructureModalProps> = ({
  isOpen,
  onClose,
  allTransactions,
  activeUserId,
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'users' | 'documents' | 'json'>('schema');
  const [selectedScope, setSelectedScope] = useState<'all' | 'guest' | 'bagus' | 'siti'>('all');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isBagus = (uid?: string) => uid === '08aQQ51M5JU6JroyW9SSvFVYxNo2' || uid === 'user_bagus_01' || (uid && uid.includes('bagus'));
  const isSiti = (uid?: string) => uid === 'B94UUVCz44bA6slp80aX8bqdgL92' || uid === 'user_siti_02' || (uid && uid.includes('siti'));

  const filteredDocs = allTransactions.filter((trx) => {
    if (selectedScope === 'all') return true;
    if (selectedScope === 'guest') return !trx.userId || trx.userId === 'guest';
    if (selectedScope === 'bagus') return isBagus(trx.userId);
    if (selectedScope === 'siti') return isSiti(trx.userId);
    return true;
  });

  const handleCopySampleJson = () => {
    const sample = filteredDocs[0] || allTransactions[0];
    if (sample) {
      navigator.clipboard.writeText(JSON.stringify(sample, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Struktur Database Cloud Firestore
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  catering-expense-tracker
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspeksi skema koleksi, isolasi data per akun &amp; payload dokumen asli
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex space-x-1 sm:space-x-3 text-xs font-bold">
            <button
              onClick={() => setActiveTab('schema')}
              className={`py-3 px-3 sm:px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'schema'
                  ? 'border-blue-600 text-blue-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Arsitektur &amp; Skema Koleksi</span>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-3 px-3 sm:px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Daftar Dokumen ({allTransactions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`py-3 px-3 sm:px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'json'
                  ? 'border-blue-600 text-blue-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileJson className="w-4 h-4" />
              <span>Format JSON Firestore</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 pb-2">
            <span>Sesi Aktif:</span>
            <span className="font-mono font-bold text-slate-800 px-2 py-0.5 rounded bg-slate-200 text-[11px]">
              {activeUserId}
            </span>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: SCHEMA EXPLANATION */}
          {activeTab === 'schema' && (
            <div className="space-y-6">
              {/* Architecture Overview Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                  <div className="flex items-center gap-2 text-sky-800 font-bold text-xs mb-1">
                    <Users className="w-4 h-4 text-sky-600" />
                    <span>Mode Tamu (Guest)</span>
                  </div>
                  <p className="text-xl font-black text-sky-950 font-mono">userId: "guest"</p>
                  <p className="text-xs text-sky-700 mt-2 leading-relaxed">
                    Semua pengunjung yang masuk sebagai Guest membaca &amp; menulis ke dokumen dengan field <code className="bg-sky-100 px-1 rounded">userId: "guest"</code>. <strong>1 Database Bersama</strong> untuk kolaborasi publik.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs mb-1">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Akun 1 (Chef Bagus)</span>
                  </div>
                  <p className="text-xl font-black text-indigo-950 font-mono">userId: "user_bagus_01"</p>
                  <p className="text-xs text-indigo-700 mt-2 leading-relaxed">
                    Dokumen belanja katering prasmanan/wedding tersimpan privat dengan <code className="bg-indigo-100 px-1 rounded">userId: "user_bagus_01"</code>. Hanya terlihat oleh Chef Bagus.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Akun 2 (Bu Siti)</span>
                  </div>
                  <p className="text-xl font-black text-emerald-950 font-mono">userId: "user_siti_02"</p>
                  <p className="text-xs text-emerald-700 mt-2 leading-relaxed">
                    Dokumen pesanan tumpeng &amp; lunchbox tradisional tersimpan privat dengan <code className="bg-emerald-100 px-1 rounded">userId: "user_siti_02"</code>. Hanya terlihat oleh Bu Siti.
                  </p>
                </div>
              </div>

              {/* Collections & Fields Table */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-3">
                  Spesifikasi Koleksi: <span className="font-mono text-blue-600 lowercase">/transactions/{'{documentId}'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-mono font-bold text-slate-900 block">id</span>
                    <span className="text-[11px] text-blue-600 font-semibold">string (Primary Key)</span>
                    <p className="text-[11px] text-slate-500 mt-1">ID unik dokumen (contoh: TRX-BAGUS-001)</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs ring-1 ring-blue-500/20">
                    <span className="font-mono font-bold text-slate-900 block">userId</span>
                    <span className="text-[11px] text-purple-600 font-semibold">string (Partition Key)</span>
                    <p className="text-[11px] text-slate-500 mt-1">"guest" atau UID akun pribadi masing-masing</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-mono font-bold text-slate-900 block">item</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">string</span>
                    <p className="text-[11px] text-slate-500 mt-1">Nama bahan makanan / item belanja</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-mono font-bold text-slate-900 block">amount</span>
                    <span className="text-[11px] text-amber-600 font-semibold">number</span>
                    <p className="text-[11px] text-slate-500 mt-1">Nominal belanja dalam Rupiah (&gt;= 0)</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-mono font-bold text-slate-900 block">category</span>
                    <span className="text-[11px] text-sky-600 font-semibold">string (Enum)</span>
                    <p className="text-[11px] text-slate-500 mt-1">Daging &amp; Seafood, Bahan Pokok, Bumbu, dll</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-mono font-bold text-slate-900 block">supplier</span>
                    <span className="text-[11px] text-slate-700 font-semibold">string</span>
                    <p className="text-[11px] text-slate-500 mt-1">Nama mitra supplier / toko penyedia</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-mono font-bold text-slate-900 block">date &amp; time</span>
                    <span className="text-[11px] text-slate-700 font-semibold">string (ISO Format)</span>
                    <p className="text-[11px] text-slate-500 mt-1">Tanggal "YYYY-MM-DD" &amp; waktu "HH:mm"</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-mono font-bold text-slate-900 block">status</span>
                    <span className="text-[11px] text-slate-700 font-semibold">string</span>
                    <p className="text-[11px] text-slate-500 mt-1">"Lunas (Transfer)" atau "Lunas (Cash)"</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="font-mono font-bold text-slate-900 block">invoiceNumber</span>
                    <span className="text-[11px] text-slate-700 font-semibold">string</span>
                    <p className="text-[11px] text-slate-500 mt-1">Nomor seri nota / struk belanja</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE DOCUMENTS IN FIRESTORE */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex items-center flex-wrap gap-2 text-xs">
                <span className="text-slate-500 font-bold mr-1">Filter Partisi:</span>
                <button
                  onClick={() => setSelectedScope('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedScope === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua Dokumen ({allTransactions.length})
                </button>
                <button
                  onClick={() => setSelectedScope('guest')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedScope === 'guest'
                      ? 'bg-sky-600 text-white'
                      : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                  }`}
                >
                  Guest Saja (1 Database Bersama)
                </button>
                <button
                  onClick={() => setSelectedScope('user_bagus_01')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedScope === 'user_bagus_01'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  Akun Chef Bagus
                </button>
                <button
                  onClick={() => setSelectedScope('user_siti_02')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedScope === 'user_siti_02'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Akun Bu Siti
                </button>
              </div>

              {/* Table of Live Documents */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3">Document ID</th>
                        <th className="py-3 px-3">Partisi (userId)</th>
                        <th className="py-3 px-3">Item &amp; Deskripsi</th>
                        <th className="py-3 px-3">Kategori</th>
                        <th className="py-3 px-3">Supplier</th>
                        <th className="py-3 px-3 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {filteredDocs.map((docItem) => (
                        <tr key={docItem.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">
                            {docItem.id}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                                docItem.userId === 'user_bagus_01'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : docItem.userId === 'user_siti_02'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {docItem.userId || 'guest'}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-900">
                            {docItem.item}
                            <span className="block text-[11px] text-slate-500 font-normal">
                              {docItem.description}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{docItem.category}</td>
                          <td className="py-3 px-3 text-slate-600">{docItem.supplier}</td>
                          <td className="py-3 px-3 font-bold text-slate-900 text-right">
                            {formatRupiah(docItem.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RAW JSON */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">
                  Contoh Dokumen JSON yang tersimpan di Firestore:{' '}
                  <strong className="font-mono text-slate-900">
                    {filteredDocs[0]?.id || 'TRX-SAMPLE'}
                  </strong>
                </span>
                <button
                  onClick={handleCopySampleJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin JSON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 overflow-x-auto font-mono text-xs shadow-inner">
                <pre>{JSON.stringify(filteredDocs[0] || allTransactions[0], null, 2)}</pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <p className="font-semibold text-slate-800 mb-1">
                  💡 Cara Kerja di Firebase Console:
                </p>
                <p>
                  Jika Anda membuka Firebase Console pada project <code className="bg-slate-200 px-1 rounded font-mono">catering-expense-tracker</code> &gt; <strong>Firestore Database</strong>, Anda akan melihat koleksi <strong>transactions</strong> berisi daftar ID dokumen di atas. Setiap dokumen memiliki kolom <code className="bg-slate-200 px-1 rounded font-mono">userId</code> yang membedakan kepemilikan data antar akun.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total {allTransactions.length} Dokumen Transaksi Live di Cloud Firestore
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Tutup Inspektor
          </button>
        </div>
      </div>
    </div>
  );
};
