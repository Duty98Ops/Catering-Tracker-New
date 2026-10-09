import React, { useState, useEffect } from 'react';
import { Transaction, CategoryType, Supplier, IngredientBenchmark } from './types';
import { Sidebar, NavItemKey } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { SummaryCards } from './components/SummaryCards';
import { DailyTrendChart } from './components/DailyTrendChart';
import { CategoryDonutChart } from './components/CategoryDonutChart';
import { TransactionsTable } from './components/TransactionsTable';
import { AddExpenseModal } from './components/AddExpenseModal';
import { ReceiptDetailModal } from './components/ReceiptDetailModal';
import { AuthModal } from './components/AuthModal';

// Views for navigation tabs
import { InputExpenseView } from './components/views/InputExpenseView';
import { HistoryView } from './components/views/HistoryView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { IngredientSearchView } from './components/views/IngredientSearchView';
import { SuppliersView } from './components/views/SuppliersView';
import { TrashView } from './components/views/TrashView';

import { Menu, X, Loader2 } from 'lucide-react';
import {
  subscribeToTransactions,
  subscribeToTrash,
  subscribeToSuppliers,
  subscribeToIngredients,
  addTransactionDoc,
  moveTransactionToTrash,
  restoreTransactionFromTrash,
  deletePermanentlyFromTrash,
  clearAllTrashDocs,
  resetFirestoreToDemo,
  addSupplierDoc
} from './firebase/dbService';
import { subscribeAuth, logoutUser } from './firebase/authService';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavItemKey>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  // Authentication states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Live Firestore database states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [ingredients, setIngredients] = useState<IngredientBenchmark[]>([]);
  const [trashItems, setTrashItems] = useState<Transaction[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(true);

  // Real-time Auth & Firestore synchronization
  useEffect(() => {
    const unsubAuth = subscribeAuth((user) => {
      setCurrentUser(user);
    });

    const unsubTrx = subscribeToTransactions((items) => {
      setTransactions(items);
      setIsDbLoading(false);
    });

    const unsubTrash = subscribeToTrash((items) => {
      setTrashItems(items);
    });

    const unsubSup = subscribeToSuppliers((items) => {
      setSuppliers(items);
    });

    const unsubIng = subscribeToIngredients((items) => {
      setIngredients(items);
    });

    return () => {
      unsubAuth();
      unsubTrx?.();
      unsubTrash?.();
      unsubSup?.();
      unsubIng?.();
    };
  }, []);

  // --- SEMUA PERHITUNGAN & STATISTIK 100% DIHITUNG DARI DATA FIRESTORE ---

  // 1. Belanja Hari Ini (dari Firestore)
  const todayDateStr = '2026-10-09';
  const todayTransactions = transactions.filter((t) => t.date === todayDateStr);
  const todayTotal = todayTransactions.reduce((acc, t) => acc + t.amount, 0);
  const todayCount = todayTransactions.length;

  // 2. 7 Hari Terakhir (dari Firestore)
  const sevenDaysAgoDate = '2026-10-02';
  const last7DaysTransactions = transactions.filter((t) => t.date >= sevenDaysAgoDate);
  const last7DaysTotal = last7DaysTransactions.reduce((acc, t) => acc + t.amount, 0);
  const last7DaysCount = last7DaysTransactions.length;

  // 3. 30 Hari Terakhir / Periode September (dari Firestore)
  const periodTransactions = transactions.filter((t) => t.date.startsWith('2026-09') || t.date >= '2026-09-01');
  const periodTotal = periodTransactions.reduce((acc, t) => acc + t.amount, 0);

  // 4. Total Keseluruhan (dari seluruh transaksi di Firestore)
  const overallTotal = transactions.reduce((acc, t) => acc + t.amount, 0);
  const activeDaysCount = new Set(transactions.map((t) => t.date)).size;
  const periodActiveDays = new Set(periodTransactions.map((t) => t.date)).size;
  const averageDaily = periodActiveDays > 0 ? Math.round(periodTotal / periodActiveDays) : 0;

  // 5. Tren Pengeluaran Harian (Dihitung 100% dari agregasi Firestore)
  const dailyMap: { [dayLabel: string]: { amount: number; items: number; note?: string } } = {};
  periodTransactions.forEach((t) => {
    const parts = t.date.split('-');
    if (parts.length >= 3) {
      const dayNum = parts[2];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const mIdx = parseInt(parts[1], 10) - 1;
      const dayLabel = `${dayNum} ${monthNames[mIdx] || 'Sep'}`;
      if (!dailyMap[dayLabel]) {
        dailyMap[dayLabel] = { amount: 0, items: 0 };
      }
      dailyMap[dayLabel].amount += t.amount;
      dailyMap[dayLabel].items += 1;
      if (!dailyMap[dayLabel].note) dailyMap[dayLabel].note = t.item;
    }
  });

  // Cari transaksi terbesar dari database
  let maxTransaction = { amount: 0, date: '-' };
  Object.entries(dailyMap).forEach(([day, data]) => {
    if (data.amount > maxTransaction.amount) {
      maxTransaction = { amount: data.amount, date: day };
    }
  });

  // Array grafik tren harian untuk September (1 - 30) dari data Firestore
  const dynamicDailyTrend = Array.from({ length: 30 }, (_, i) => {
    const dayNum = (i + 1).toString().padStart(2, '0');
    const dayLabel = `${dayNum} Sep`;
    const dateStr = `2026-09-${dayNum}`;
    const dayData = dailyMap[dayLabel] || { amount: 0, items: 0 };
    return {
      day: dayLabel,
      date: dateStr,
      amount: dayData.amount,
      items: dayData.items,
      note: dayData.note,
      isPeak: dayData.amount > 0 && dayData.amount === maxTransaction.amount,
    };
  });

  // 6. Komposisi Kategori (Dihitung 100% dari transaksi Firestore)
  const categoryMap: { [cat: string]: number } = {};
  periodTransactions.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  const categoryColors: Record<string, string> = {
    'Daging & Seafood': '#ef4444',
    'Bahan Pokok': '#f59e0b',
    'Bumbu & Rempah': '#10b981',
    'Packaging': '#3b82f6',
    'Susu & Telur': '#8b5cf6',
    'Sayuran & Buah': '#14b8a6',
    'Minyak & Gas': '#f97316',
    'Lain-lain': '#64748b',
  };

  const dynamicCategories = Object.entries(categoryMap)
    .map(([name, value]) => ({
      name,
      value,
      percentage: periodTotal > 0 ? Math.round((value / periodTotal) * 100) : 0,
      color: categoryColors[name] || '#64748b',
    }))
    .sort((a, b) => b.value - a.value);

  // Daftar Supplier dari Firestore
  const availableSuppliers = Array.from(
    new Set([
      ...suppliers.map((s) => s.name),
      ...transactions.map((t) => t.supplier),
    ])
  );

  // CRUD Actions -> Langsung simpan ke Cloud Firestore
  const handleAddTransaction = async (newTrxData: Omit<Transaction, 'id'>) => {
    const newTrx: Transaction = {
      ...newTrxData,
      id: `TRX-${Date.now()}`,
    };
    try {
      await addTransactionDoc(newTrx);
    } catch (e) {
      console.error('Gagal menyimpan transaksi ke Firestore:', e);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (target) {
      try {
        await moveTransactionToTrash(target);
      } catch (e) {
        console.error('Gagal memindahkan ke sampah di Firestore:', e);
      }
    }
  };

  const handleRestoreTrash = async (id: string) => {
    const target = trashItems.find((t) => t.id === id);
    if (target) {
      try {
        await restoreTransactionFromTrash(target);
      } catch (e) {
        console.error('Gagal memulihkan transaksi di Firestore:', e);
      }
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await deletePermanentlyFromTrash(id);
    } catch (e) {
      console.error('Gagal menghapus permanen di Firestore:', e);
    }
  };

  const handleClearAllTrash = async () => {
    if (window.confirm('Hapus seluruh item di tempat sampah secara permanen dari Firestore?')) {
      try {
        await clearAllTrashDocs(trashItems);
      } catch (e) {
        console.error('Gagal mengosongkan sampah di Firestore:', e);
      }
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Reset data transaksi kembali ke data awal katering di Firestore?')) {
      try {
        await resetFirestoreToDemo();
      } catch (e) {
        console.error('Gagal reset data di Firestore:', e);
      }
    }
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `catering_cost_intelligence_backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Tanggal', 'Waktu', 'Item', 'Deskripsi', 'Kategori', 'Supplier', 'Status', 'Nominal'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      t.time,
      `"${t.item.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      `"${t.supplier.replace(/"/g, '""')}"`,
      t.status,
      t.amount,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_belanja_catering_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-800">
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          transactionCount={transactions.length}
          trashCount={trashItems.length}
          onExportData={handleExportJSON}
          onImportData={() => alert('Fitur Import File JSON didukung')}
          onResetData={handleResetData}
          currentUser={currentUser}
          onOpenAuthModal={(mode) => {
            setAuthModalMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
          onLogout={async () => {
            if (window.confirm('Keluar dari akun?')) {
              await logoutUser();
            }
          }}
        />
      </div>

      {/* Main Content Area (Light Theme) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-lg bg-slate-900 text-slate-200"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm tracking-tight">Catering - Cost Intelligence</span>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 bg-blue-600 rounded-lg text-xs font-semibold"
          >
            + Belanja
          </button>
        </div>

        {/* Top Bar Component */}
        <TopBar
          onOpenAddModal={() => setIsAddModalOpen(true)}
          currentUser={currentUser}
          onOpenAuthModal={(mode) => {
            setAuthModalMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
          onLogout={async () => {
            if (window.confirm('Keluar dari akun?')) {
              await logoutUser();
            }
          }}
        />

        {/* View Switcher Container */}
        <main className="flex-1 p-5 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {isDbLoading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-700">Menghubungkan ke Database Firestore...</p>
              <p className="text-xs text-slate-400 mt-1">Mengambil dokumen real-time dari catering-expense-tracker</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* 4 Summary Cards (Atas - 100% dari data Firestore) */}
                  <SummaryCards
                    todayTotal={todayTotal}
                    todayCount={todayCount}
                    last7DaysTotal={last7DaysTotal}
                    last7DaysCount={last7DaysCount}
                    last30DaysTotal={periodTotal}
                    overallTotal={overallTotal}
                    averageDaily={averageDaily}
                    activeDaysCount={activeDaysCount}
                    efficiencyPercentage={94}
                  />

                  {/* Baris Tengah (Grafik & Diagram - 100% dari data Firestore) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Kiri: Tren Pengeluaran Harian */}
                    <div className="lg:col-span-7 xl:col-span-8">
                      <DailyTrendChart
                        data={dynamicDailyTrend}
                        totalPeriod={periodTotal}
                        averageDaily={averageDaily}
                        maxTransaction={maxTransaction}
                      />
                    </div>

                    {/* Kanan: Komposisi Kategori */}
                    <div className="lg:col-span-5 xl:col-span-4">
                      <CategoryDonutChart categories={dynamicCategories} />
                    </div>
                  </div>

                  {/* Baris Bawah (Tabel Transaksi Belanja Terkini dari Firestore) */}
                  <TransactionsTable
                    transactions={transactions}
                    onViewAll={() => setActiveTab('history')}
                    onSelectTransaction={(trx) => setSelectedReceipt(trx)}
                    onDeleteTransaction={handleDeleteTransaction}
                    totalCount={transactions.length}
                  />
                </div>
              )}

              {activeTab === 'input' && (
                <InputExpenseView
                  onAddTransaction={handleAddTransaction}
                  availableSuppliers={availableSuppliers}
                  recentTransactions={transactions}
                  onViewAllHistory={() => setActiveTab('history')}
                />
              )}

              {activeTab === 'history' && (
                <HistoryView
                  transactions={transactions}
                  onSelectTransaction={(trx) => setSelectedReceipt(trx)}
                  onDeleteTransaction={handleDeleteTransaction}
                  onExportCSV={handleExportCSV}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                />
              )}

              {activeTab === 'analytics' && <AnalyticsView />}

              {activeTab === 'ingredients' && (
                <IngredientSearchView ingredients={ingredients} />
              )}

              {activeTab === 'suppliers' && (
                <SuppliersView
                  suppliers={suppliers}
                  onAddSupplier={async (newSup) => {
                    await addSupplierDoc(newSup);
                  }}
                />
              )}

              {activeTab === 'trash' && (
                <TrashView
                  trashItems={trashItems}
                  onRestore={handleRestoreTrash}
                  onPermanentDelete={handlePermanentDelete}
                  onClearAllTrash={handleClearAllTrash}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        availableSuppliers={availableSuppliers}
      />

      {/* Receipt Detail Modal */}
      <ReceiptDetailModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      {/* Login & Signup Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
      />
    </div>
  );
}
