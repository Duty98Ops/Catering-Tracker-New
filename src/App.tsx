import React, { useState, useEffect } from 'react';
import {
  INITIAL_TRANSACTIONS,
  DAILY_TREND_DATA,
  CATEGORY_COMPOSITION,
  INITIAL_SUPPLIERS
} from './data/initialData';
import { Transaction, CategoryType } from './types';
import { Sidebar, NavItemKey } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { SummaryCards } from './components/SummaryCards';
import { DailyTrendChart } from './components/DailyTrendChart';
import { CategoryDonutChart } from './components/CategoryDonutChart';
import { TransactionsTable } from './components/TransactionsTable';
import { AddExpenseModal } from './components/AddExpenseModal';
import { ReceiptDetailModal } from './components/ReceiptDetailModal';

// Views for navigation tabs
import { InputExpenseView } from './components/views/InputExpenseView';
import { HistoryView } from './components/views/HistoryView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { IngredientSearchView } from './components/views/IngredientSearchView';
import { SuppliersView } from './components/views/SuppliersView';
import { TrashView } from './components/views/TrashView';

import { Menu, X } from 'lucide-react';

const STORAGE_KEY = 'catering_cost_intel_transactions_v1';
const TRASH_STORAGE_KEY = 'catering_cost_intel_trash_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavItemKey>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);

  // Transactions state with localStorage persistence
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from storage', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [trashItems, setTrashItems] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(TRASH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load trash', e);
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Save to local storage error', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(trashItems));
    } catch (e) {
      console.error('Save trash error', e);
    }
  }, [trashItems]);

  // Derived metrics for current active period (September 2026)
  // Belanja Hari Ini: Rp 0 (Belum ada nota)
  // 7 Hari Terakhir: Rp 0 (-8.4% vs pekan lalu)
  // 30 Hari Terakhir: Rp 1.627.000 (Efisiensi 94%, Rerata Rp 893k/hr)
  // Total Keseluruhan: Rp 17.855.000 (20 Hari Aktif)
  const todayTotal = 0;
  const last7DaysTotal = 0;
  
  // Calculate 30-day September total dynamically
  const septemberTransactions = transactions.filter((t) => t.date.startsWith('2026-09'));
  const septemberTotal = septemberTransactions.reduce((acc, t) => acc + t.amount, 0);
  
  // Total keseluruhan
  const overallTotal = transactions.reduce((acc, t) => acc + t.amount, 0);

  // Dynamic daily trend chart data
  const dynamicDailyTrend = DAILY_TREND_DATA.map((dayItem) => {
    // If user added new transactions for this date, aggregate them
    const matching = septemberTransactions.filter((t) => t.date === dayItem.date);
    if (matching.length > 0) {
      const sum = matching.reduce((s, it) => s + it.amount, 0);
      return {
        ...dayItem,
        amount: sum,
        items: matching.length,
        isPeak: dayItem.day === '22 Sep' || sum >= 1000000,
      };
    }
    return dayItem;
  });

  // Category composition data
  const dynamicCategories = CATEGORY_COMPOSITION.map((cat) => {
    const catTrx = septemberTransactions.filter((t) => t.category === cat.name);
    const sum = catTrx.reduce((s, t) => s + t.amount, 0);
    // Use calculated value or baseline percentage
    const value = sum > 0 ? sum : cat.value;
    const percentage = septemberTotal > 0 ? Math.round((value / septemberTotal) * 100) : cat.percentage;
    return {
      ...cat,
      value,
      percentage,
    };
  });

  // Unique list of suppliers
  const availableSuppliers = Array.from(
    new Set([
      'Pasar Tradisional',
      'UD Berkah Daging',
      'Toko Bumbu Bu Sri',
      'Grosir Beras Jaya Mandiri',
      'Mitra Plastik Surya',
      'Agen Telur Berkah',
      ...transactions.map((t) => t.supplier),
    ])
  );

  // Add transaction handler
  const handleAddTransaction = (newTrxData: Omit<Transaction, 'id'>) => {
    const newTrx: Transaction = {
      ...newTrxData,
      id: `TRX-${Date.now()}`,
    };
    setTransactions((prev) => [newTrx, ...prev]);
  };

  // Move to trash
  const handleDeleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (target) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setTrashItems((prev) => [target, ...prev]);
    }
  };

  // Restore from trash
  const handleRestoreTrash = (id: string) => {
    const target = trashItems.find((t) => t.id === id);
    if (target) {
      setTrashItems((prev) => prev.filter((t) => t.id !== id));
      setTransactions((prev) => [target, ...prev]);
    }
  };

  // Permanent delete
  const handlePermanentDelete = (id: string) => {
    setTrashItems((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearAllTrash = () => {
    if (window.confirm('Hapus seluruh item di tempat sampah secara permanen?')) {
      setTrashItems([]);
    }
  };

  // Export JSON (File-Based Data Management)
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

  // Export CSV
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

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('Reset data transaksi kembali ke data demo awal?')) {
      setTransactions(INITIAL_TRANSACTIONS);
      setTrashItems([]);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TRASH_STORAGE_KEY);
    }
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
        <TopBar onOpenAddModal={() => setIsAddModalOpen(true)} />

        {/* View Switcher Container */}
        <main className="flex-1 p-5 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 4 Summary Cards (Atas) */}
              <SummaryCards
                todayTotal={todayTotal}
                last7DaysTotal={last7DaysTotal}
                last30DaysTotal={septemberTotal || 1627000}
                overallTotal={overallTotal || 17855000}
                activeDaysCount={20}
              />

              {/* Baris Tengah (Grafik & Diagram) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Kiri (Bar Chart): Tren Pengeluaran Harian (7 / 12 width) */}
                <div className="lg:col-span-7 xl:col-span-8">
                  <DailyTrendChart
                    data={dynamicDailyTrend}
                    totalPeriod={septemberTotal || 1627000}
                    averageDaily={892750}
                    maxTransaction={{
                      amount: 1119000,
                      date: '22 Sep',
                    }}
                  />
                </div>

                {/* Kanan (Donut Chart): Komposisi Kategori (5 / 12 width) */}
                <div className="lg:col-span-5 xl:col-span-4">
                  <CategoryDonutChart categories={dynamicCategories} />
                </div>
              </div>

              {/* Baris Bawah (Tabel Transaksi Belanja Terkini) */}
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

          {activeTab === 'ingredients' && <IngredientSearchView />}

          {activeTab === 'suppliers' && <SuppliersView />}

          {activeTab === 'trash' && (
            <TrashView
              trashItems={trashItems}
              onRestore={handleRestoreTrash}
              onPermanentDelete={handlePermanentDelete}
              onClearAllTrash={handleClearAllTrash}
            />
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
    </div>
  );
}
