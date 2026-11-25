import React, { useState, useMemo, useEffect } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Calculator,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  AlertCircle,
  Link2,
  SlidersHorizontal,
  ArrowRight,
  Receipt
} from 'lucide-react';
import {
  Recipe,
  RecipeIngredient,
  RecipeUnit,
  Transaction,
  IngredientBenchmark,
} from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  buildLatestTransactionPrices,
  calculateRecipeCostingWithPriceMap,
  formatBaseUnitLabel,
  getBaseUnitForRecipeUnit,
  RecipeCostingSummary,
} from '../../utils/recipeCosting';

interface RecipesViewProps {
  recipes: Recipe[];
  transactions: Transaction[];
  ingredients: IngredientBenchmark[];
  onAddRecipe: (recipe: Recipe) => Promise<void>;
  onUpdateRecipe: (recipe: Recipe) => Promise<void>;
  onDeleteRecipe: (id: string) => Promise<void>;
}

const RECIPE_CATEGORIES = [
  'Nasi Box',
  'Prasmanan / Buffet',
  'Snack Box',
  'Tumpeng & Hampers',
  'Menu Harian',
  'Minuman & Dessert',
];

const RECIPE_UNITS: RecipeUnit[] = ['gr', 'kg', 'ml', 'liter', 'pcs'];

function createEmptyIngredient(): RecipeIngredient {
  return {
    id: `ing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: '',
    qty: 100,
    unit: 'gr',
    priceSourceMode: 'auto',
  };
}

export const RecipesView: React.FC<RecipesViewProps> = ({
  recipes,
  transactions,
  ingredients,
  onAddRecipe,
  onUpdateRecipe,
  onDeleteRecipe,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // Modal & Action states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live Simulator overrides for selected recipe
  const [simTargetMargin, setSimTargetMargin] = useState<number>(38);
  const [simSellingPrice, setSimSellingPrice] = useState<number>(0);
  const [isSavingSim, setIsSavingSim] = useState(false);

  // Modal Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Nasi Box');
  const [formPortions, setFormPortions] = useState('1');
  const [formPackagingCost, setFormPackagingCost] = useState('0');
  const [formTargetMargin, setFormTargetMargin] = useState('38');
  const [formSellingPrice, setFormSellingPrice] = useState('25000');
  const [formNotes, setFormNotes] = useState('');
  const [formIngredients, setFormIngredients] = useState<RecipeIngredient[]>([
    createEmptyIngredient(),
  ]);

  // 1. Build latest transaction price map from user's Firestore transactions
  const latestPrices = useMemo(
    () => buildLatestTransactionPrices(transactions),
    [transactions]
  );

  // 2. Calculate dynamic HPP & margin summaries for all recipes
  const recipeSummaries = useMemo(() => {
    return recipes.map((recipe) =>
      calculateRecipeCostingWithPriceMap(recipe, latestPrices, ingredients)
    );
  }, [recipes, latestPrices, ingredients]);

  // 3. Filter recipes
  const filteredSummaries = useMemo(() => {
    return recipeSummaries.filter((summary) => {
      const matchesQuery =
        summary.recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        summary.recipe.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === 'all' || summary.recipe.category === selectedCategory;
      return matchesQuery && matchesCat;
    });
  }, [recipeSummaries, searchQuery, selectedCategory]);

  // Auto-select first recipe if none selected or if selected was deleted
  useEffect(() => {
    if (filteredSummaries.length === 0) {
      setSelectedRecipeId(null);
      return;
    }
    const stillExists = filteredSummaries.some(
      (s) => s.recipe.id === selectedRecipeId
    );
    if (!selectedRecipeId || !stillExists) {
      setSelectedRecipeId(filteredSummaries[0].recipe.id);
    }
  }, [filteredSummaries, selectedRecipeId]);

  const activeSummary: RecipeCostingSummary | null = useMemo(() => {
    if (!selectedRecipeId) return null;
    return (
      recipeSummaries.find((s) => s.recipe.id === selectedRecipeId) || null
    );
  }, [recipeSummaries, selectedRecipeId]);

  // Sync live simulator inputs when selected recipe changes
  useEffect(() => {
    if (activeSummary) {
      setSimTargetMargin(activeSummary.recipe.targetMargin);
      setSimSellingPrice(activeSummary.recipe.sellingPrice);
    }
  }, [activeSummary?.recipe.id, activeSummary?.recipe.targetMargin, activeSummary?.recipe.sellingPrice]);

  // Live simulated costing preview for the active recipe
  const simulatedSummary = useMemo(() => {
    if (!activeSummary) return null;
    const simulatedRecipe: Recipe = {
      ...activeSummary.recipe,
      targetMargin: simTargetMargin,
      sellingPrice: simSellingPrice,
    };
    return calculateRecipeCostingWithPriceMap(
      simulatedRecipe,
      latestPrices,
      ingredients
    );
  }, [activeSummary, simTargetMargin, simSellingPrice, latestPrices, ingredients]);

  const hasSimChanges =
    activeSummary !== null &&
    (simTargetMargin !== activeSummary.recipe.targetMargin ||
      simSellingPrice !== activeSummary.recipe.sellingPrice);

  // Portfolio-level KPIs
  const avgFoodCostPct = useMemo(() => {
    const valid = recipeSummaries.filter((s) => s.recipe.sellingPrice > 0);
    if (valid.length === 0) return 0;
    const sum = valid.reduce((acc, s) => acc + s.foodCostPct, 0);
    return Number((sum / valid.length).toFixed(1));
  }, [recipeSummaries]);

  const erodedMenus = useMemo(
    () =>
      recipeSummaries.filter(
        (s) => s.marginStatus === 'warning' || s.marginStatus === 'loss'
      ),
    [recipeSummaries]
  );

  const healthyMenusCount = useMemo(
    () => recipeSummaries.filter((s) => s.marginStatus === 'healthy').length,
    [recipeSummaries]
  );

  // Editor modal handlers
  const handleOpenCreate = () => {
    setEditingRecipe(null);
    setFormName('');
    setFormCategory('Nasi Box');
    setFormPortions('1');
    setFormPackagingCost('0');
    setFormTargetMargin('38');
    setFormSellingPrice('25000');
    setFormNotes('');
    setFormIngredients([createEmptyIngredient()]);
    setErrorMsg(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormName(recipe.name);
    setFormCategory(recipe.category || 'Nasi Box');
    setFormPortions(String(recipe.portions || 1));
    setFormPackagingCost(String(recipe.packagingCostPerPortion || 0));
    setFormTargetMargin(String(recipe.targetMargin ?? 38));
    setFormSellingPrice(String(recipe.sellingPrice ?? 0));
    setFormNotes(recipe.notes || '');
    setFormIngredients(
      recipe.ingredients && recipe.ingredients.length > 0
        ? recipe.ingredients.map((i) => ({ ...i }))
        : [createEmptyIngredient()]
    );
    setErrorMsg(null);
    setIsEditorOpen(true);
  };

  const handleAddIngredientRow = () => {
    setFormIngredients((prev) => [...prev, createEmptyIngredient()]);
  };

  const handleRemoveIngredientRow = (id: string) => {
    setFormIngredients((prev) =>
      prev.length > 1 ? prev.filter((item) => item.id !== id) : prev
    );
  };

  const handleUpdateIngredientRow = (
    id: string,
    patch: Partial<RecipeIngredient>
  ) => {
    setFormIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  // Live preview inside Editor Modal
  const modalPreviewSummary = useMemo(() => {
    const validIngs = formIngredients.filter(
      (i) => i.name.trim() && Number(i.qty) > 0
    );
    const draftRecipe: Recipe = {
      id: editingRecipe?.id || 'draft',
      name: formName.trim() || 'Draft Resep',
      category: formCategory,
      portions: Math.max(1, parseInt(formPortions, 10) || 1),
      targetMargin: Math.min(90, Math.max(0, parseFloat(formTargetMargin) || 0)),
      sellingPrice: Math.max(0, parseInt(formSellingPrice.replace(/[^0-9]/g, ''), 10) || 0),
      packagingCostPerPortion: Math.max(
        0,
        parseInt(formPackagingCost.replace(/[^0-9]/g, ''), 10) || 0
      ),
      ingredients: validIngs,
    };
    return calculateRecipeCostingWithPriceMap(
      draftRecipe,
      latestPrices,
      ingredients
    );
  }, [
    formName,
    formCategory,
    formPortions,
    formTargetMargin,
    formSellingPrice,
    formPackagingCost,
    formIngredients,
    editingRecipe,
    latestPrices,
    ingredients,
  ]);

  const handleSaveRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formName.trim()) {
      setErrorMsg('Nama menu / resep wajib diisi.');
      return;
    }

    const cleanedIngredients = formIngredients
      .filter((i) => i.name.trim() && Number(i.qty) > 0)
      .map((i) => ({
        ...i,
        name: i.name.trim(),
        qty: Number(i.qty),
      }));

    if (cleanedIngredients.length === 0) {
      setErrorMsg('Tambahkan minimal 1 bahan baku dengan takaran lebih dari 0.');
      return;
    }

    const portions = Math.max(1, parseInt(formPortions, 10) || 1);
    const targetMargin = Math.min(
      90,
      Math.max(0, parseFloat(formTargetMargin) || 35)
    );
    const sellingPrice = Math.max(
      0,
      parseInt(formSellingPrice.replace(/[^0-9]/g, ''), 10) || 0
    );
    const packagingCostPerPortion = Math.max(
      0,
      parseInt(formPackagingCost.replace(/[^0-9]/g, ''), 10) || 0
    );

    setIsSubmitting(true);
    try {
      const payload: Recipe = {
        id: editingRecipe ? editingRecipe.id : `RCP-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        portions,
        targetMargin,
        sellingPrice,
        packagingCostPerPortion,
        notes: formNotes.trim(),
        ingredients: cleanedIngredients,
        updatedAt: new Date().toISOString().split('T')[0],
      };

      if (editingRecipe) {
        await onUpdateRecipe(payload);
      } else {
        await onAddRecipe(payload);
        setSelectedRecipeId(payload.id);
      }

      setIsEditorOpen(false);
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal menyimpan resep. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSimulation = async (overrideSellingPrice?: number) => {
    if (!activeSummary) return;
    setIsSavingSim(true);
    try {
      const nextSellingPrice =
        overrideSellingPrice !== undefined ? overrideSellingPrice : simSellingPrice;
      await onUpdateRecipe({
        ...activeSummary.recipe,
        targetMargin: simTargetMargin,
        sellingPrice: nextSellingPrice,
        updatedAt: new Date().toISOString().split('T')[0],
      });
      if (overrideSellingPrice !== undefined) {
        setSimSellingPrice(overrideSellingPrice);
      }
    } finally {
      setIsSavingSim(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!recipeToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteRecipe(recipeToDelete.id);
      setRecipeToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Master Resep &amp; Kalkulator HPP
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kalkulasi HPP per porsi secara real-time berdasarkan harga beli bahan baku terakhir di riwayat belanja
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Resep Baru</span>
        </button>
      </div>

      {/* Compact KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">
              Total Resep Aktif
            </span>
            <UtensilsCrossed className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1.5 font-mono tabular-nums">
            {recipes.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Menu terdaftar</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">
              Rata-rata Food Cost
            </span>
            <Calculator className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-blue-700 mt-1.5 font-mono tabular-nums">
            {avgFoodCostPct}%
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Dari harga jual menu
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">
              Kesehatan Margin
            </span>
            {erodedMenus.length > 0 ? (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1.5 font-mono tabular-nums">
            {healthyMenusCount} / {recipes.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {erodedMenus.length > 0
              ? `${erodedMenus.length} menu di bawah target margin`
              : 'Semua menu sesuai target'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">
              Referensi Harga Belanja
            </span>
            <Receipt className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1.5 font-mono tabular-nums">
            {latestPrices.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Item bahan dari transaksi terakhir
          </p>
        </div>
      </div>

      {/* Margin Erosion Warning Banner */}
      {erodedMenus.length > 0 && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-900">
                Peringatan Margin Tergerus ({erodedMenus.length} Menu)
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                {erodedMenus.map((m) => m.recipe.name).join(', ')} memiliki margin aktual di bawah target akibat HPP bahan baku terkini. Klik menu terkait untuk menyesuaikan harga jual atau komposisi.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRecipeId(erodedMenus[0].recipe.id)}
            className="text-xs font-semibold text-amber-900 bg-white hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl transition-colors shrink-0 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Tinjau Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content */}
      {recipes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 shadow-xs text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto mb-3">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Belum Ada Master Resep
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            Buat resep pertama Anda untuk menghitung HPP per porsi secara otomatis dari catatan transaksi belanja bahan baku terakhir, lengkap dengan simulasi margin keuntungan.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Resep Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Panel: Recipe List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs space-y-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari menu atau paket..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">Semua Kategori Menu</option>
                {RECIPE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5">
              {filteredSummaries.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500">
                  Tidak ada resep yang cocok dengan pencarian.
                </div>
              ) : (
                filteredSummaries.map((summary) => {
                  const isSelected = summary.recipe.id === selectedRecipeId;
                  return (
                    <button
                      key={summary.recipe.id}
                      type="button"
                      onClick={() => setSelectedRecipeId(summary.recipe.id)}
                      className={`w-full text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/60 border-blue-500 ring-1 ring-blue-500/30 shadow-xs'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-slate-500">
                            {summary.recipe.category} · {summary.recipe.portions} Porsi
                          </p>
                          <h3 className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                            {summary.recipe.name}
                          </h3>
                        </div>

                        {summary.marginStatus === 'healthy' && (
                          <span className="text-[11px] font-semibold text-emerald-700 shrink-0">
                            Margin Sehat
                          </span>
                        )}
                        {summary.marginStatus === 'warning' && (
                          <span className="text-[11px] font-semibold text-amber-700 shrink-0">
                            Tergerus
                          </span>
                        )}
                        {summary.marginStatus === 'loss' && (
                          <span className="text-[11px] font-semibold text-rose-700 shrink-0">
                            Rugi
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/70 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">
                            HPP / Porsi
                          </span>
                          <span className="font-bold text-slate-900 font-mono tabular-nums">
                            {formatRupiah(summary.hppPerPortion)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">
                            Harga Jual
                          </span>
                          <span className="font-bold text-blue-700 font-mono tabular-nums">
                            {summary.recipe.sellingPrice > 0
                              ? formatRupiah(summary.recipe.sellingPrice)
                              : '-'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">
                            Margin
                          </span>
                          <span
                            className={`font-bold font-mono tabular-nums ${
                              summary.marginStatus === 'loss'
                                ? 'text-rose-600'
                                : summary.marginStatus === 'warning'
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                            }`}
                          >
                            {summary.recipe.sellingPrice > 0
                              ? `${summary.actualMarginPct}%`
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Selected Recipe Costing & Simulator Workbench */}
          <div className="lg:col-span-8 space-y-4">
            {simulatedSummary ? (
              <>
                {/* Recipe Detail Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>{simulatedSummary.recipe.category}</span>
                        <span>·</span>
                        <span>Takaran {simulatedSummary.recipe.portions} porsi</span>
                        {simulatedSummary.recipe.updatedAt && (
                          <>
                            <span>·</span>
                            <span>Diperbarui {simulatedSummary.recipe.updatedAt}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {simulatedSummary.recipe.name}
                      </h3>
                      {simulatedSummary.recipe.notes && (
                        <p className="text-xs text-slate-500 mt-1">
                          {simulatedSummary.recipe.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(simulatedSummary.recipe)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Resep</span>
                      </button>
                      <button
                        onClick={() => setRecipeToDelete(simulatedSummary.recipe)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>

                  {/* Key HPP & Pricing Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[11px] font-medium text-slate-500 block">
                        HPP per Porsi
                      </span>
                      <p className="text-lg font-bold text-slate-900 mt-1 font-mono tabular-nums">
                        {formatRupiah(simulatedSummary.hppPerPortion)}
                      </p>
                      <span className="text-[10px] text-slate-500">
                        {simulatedSummary.recipe.packagingCostPerPortion
                          ? `Termasuk kemasan ${formatRupiah(
                              simulatedSummary.recipe.packagingCostPerPortion
                            )}`
                          : 'Biaya bahan baku'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80">
                      <span className="text-[11px] font-medium text-blue-700 block">
                        Saran Harga Jual
                      </span>
                      <p className="text-lg font-bold text-blue-700 mt-1 font-mono tabular-nums">
                        {formatRupiah(simulatedSummary.recommendedSellingPriceRounded)}
                      </p>
                      <span className="text-[10px] text-blue-600">
                        Target margin {simTargetMargin}% (eksak:{' '}
                        {formatRupiah(simulatedSummary.recommendedSellingPriceExact)})
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[11px] font-medium text-slate-500 block">
                        Margin Aktual
                      </span>
                      <p
                        className={`text-lg font-bold mt-1 font-mono tabular-nums ${
                          simulatedSummary.marginStatus === 'loss'
                            ? 'text-rose-600'
                            : simulatedSummary.marginStatus === 'warning'
                            ? 'text-amber-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {simSellingPrice > 0
                          ? `${simulatedSummary.actualMarginPct}%`
                          : '-'}
                      </p>
                      <span className="text-[10px] text-slate-500">
                        Food cost {simulatedSummary.foodCostPct}%
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-[11px] font-medium text-slate-500 block">
                        Laba Kotor / Porsi
                      </span>
                      <p
                        className={`text-lg font-bold mt-1 font-mono tabular-nums ${
                          simulatedSummary.profitPerPortion <= 0
                            ? 'text-rose-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {simSellingPrice > 0
                          ? formatRupiah(simulatedSummary.profitPerPortion)
                          : '-'}
                      </p>
                      <span className="text-[10px] text-slate-500">
                        {simSellingPrice > 0
                          ? `Dari harga jual ${formatRupiah(simSellingPrice)}`
                          : 'Harga jual belum diisi'}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Margin & Price Simulator */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                        <span>Simulasi Target Margin &amp; Penyesuaian Harga Jual</span>
                      </div>

                      {simulatedSummary.recommendedSellingPriceRounded > 0 &&
                        simSellingPrice !==
                          simulatedSummary.recommendedSellingPriceRounded && (
                          <button
                            type="button"
                            disabled={isSavingSim}
                            onClick={() =>
                              handleSaveSimulation(
                                simulatedSummary.recommendedSellingPriceRounded
                              )
                            }
                            className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Terapkan Saran Harga (
                            {formatRupiah(
                              simulatedSummary.recommendedSellingPriceRounded
                            )}
                            )
                          </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <label className="font-semibold text-slate-700">
                            Target Margin Keuntungan
                          </label>
                          <span className="font-bold text-blue-700 font-mono tabular-nums">
                            {simTargetMargin}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={15}
                          max={70}
                          step={1}
                          value={simTargetMargin}
                          onChange={(e) =>
                            setSimTargetMargin(Number(e.target.value))
                          }
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                          <span>15% (Ekonomis)</span>
                          <span>35% - 40% (Standar Katering)</span>
                          <span>70%</span>
                        </div>
                      </div>

                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Harga Jual Aktual / Porsi (Rp)
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={500}
                            value={simSellingPrice}
                            onChange={(e) =>
                              setSimSellingPrice(
                                Math.max(0, Number(e.target.value) || 0)
                              )
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 font-mono tabular-nums focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                          />
                        </div>

                        {hasSimChanges && (
                          <button
                            type="button"
                            disabled={isSavingSim}
                            onClick={() => handleSaveSimulation()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            {isSavingSim ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Save className="w-3.5 h-3.5" />
                            )}
                            <span>Simpan</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Specific Margin / Spike Feedback for Active Recipe */}
                    {simulatedSummary.marginStatus === 'warning' && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          Margin aktual ({simulatedSummary.actualMarginPct}%) di bawah target {simTargetMargin}%. Untuk menjaga target margin, pertimbangkan menyesuaikan harga jual menjadi minimal{' '}
                          <strong className="font-mono">
                            {formatRupiah(
                              simulatedSummary.recommendedSellingPriceRounded
                            )}
                          </strong>
                          .
                        </span>
                      </div>
                    )}

                    {simulatedSummary.marginStatus === 'loss' && (
                      <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>
                          Harga jual saat ini ({formatRupiah(simSellingPrice)}) lebih rendah atau sama dengan HPP ({formatRupiah(simulatedSummary.hppPerPortion)}). Segera naikkan harga jual ke minimal{' '}
                          <strong className="font-mono">
                            {formatRupiah(
                              simulatedSummary.recommendedSellingPriceRounded
                            )}
                          </strong>{' '}
                          agar tidak merugi.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ingredient Cost Breakdown Table */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Rincian Komposisi &amp; Biaya Bahan Baku
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Harga bahan ditarik otomatis dari transaksi pembelian terakhir Anda
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 font-mono tabular-nums">
                      Total Batch ({simulatedSummary.recipe.portions} Porsi):{' '}
                      {formatRupiah(simulatedSummary.totalBatchCost)}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500">
                          <th className="py-3 px-4">Bahan Baku</th>
                          <th className="py-3 px-3 text-right">Takaran</th>
                          <th className="py-3 px-3 text-right">Harga Beli Terakhir</th>
                          <th className="py-3 px-3">Sumber Harga</th>
                          <th className="py-3 px-4 text-right">Biaya Resep</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {simulatedSummary.resolvedIngredients.map((item) => {
                          const perPortionCost = Math.round(
                            item.totalCost /
                              (simulatedSummary.recipe.portions || 1)
                          );

                          return (
                            <tr
                              key={item.ingredient.id}
                              className="hover:bg-slate-50/70 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-900">
                                  {item.ingredient.name}
                                </div>
                                {item.matchedItemName &&
                                  item.matchedItemName !== item.ingredient.name && (
                                    <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                                      <Link2 className="w-3 h-3 text-blue-500" />
                                      <span>Terhubung: {item.matchedItemName}</span>
                                    </div>
                                  )}
                                {item.unitMismatch && (
                                  <div className="text-[10px] text-rose-600 mt-0.5 font-medium">
                                    Satuan resep ({item.ingredient.unit}) tidak cocok dengan transaksi ({item.baseUnit}). Ubah satuan atau pakai harga manual.
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 font-medium">
                                {item.ingredient.qty} {item.ingredient.unit}
                              </td>

                              <td className="py-3 px-3 text-right font-mono tabular-nums">
                                {item.pricePerBaseUnit > 0 ? (
                                  <div>
                                    <span className="font-semibold text-slate-800">
                                      {formatRupiah(item.pricePerBaseUnit)}
                                    </span>
                                    <span className="text-slate-400 text-[10px]">
                                      {' '}
                                      / {formatBaseUnitLabel(item.baseUnit)}
                                    </span>
                                    {typeof item.priceChangePct === 'number' &&
                                      item.priceChangePct !== 0 && (
                                        <div
                                          className={`text-[10px] font-semibold inline-flex items-center gap-0.5 ml-1.5 ${
                                            item.priceChangePct > 0
                                              ? 'text-rose-600'
                                              : 'text-emerald-600'
                                          }`}
                                        >
                                          {item.priceChangePct > 0 ? (
                                            <TrendingUp className="w-3 h-3" />
                                          ) : (
                                            <TrendingDown className="w-3 h-3" />
                                          )}
                                          {item.priceChangePct > 0 ? '+' : ''}
                                          {item.priceChangePct}%
                                        </div>
                                      )}
                                  </div>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                <span
                                  className={`text-[11px] font-medium ${
                                    item.source === 'transaction'
                                      ? 'text-emerald-700'
                                      : item.source === 'benchmark'
                                      ? 'text-amber-700'
                                      : item.source === 'manual'
                                      ? 'text-blue-700'
                                      : 'text-rose-600'
                                  }`}
                                >
                                  {item.sourceLabel}
                                </span>
                                {item.matchedSupplier && (
                                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                    {item.matchedSupplier}
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right font-mono tabular-nums">
                                <div className="font-bold text-slate-900">
                                  {formatRupiah(item.totalCost)}
                                </div>
                                {simulatedSummary.recipe.portions > 1 && (
                                  <div className="text-[10px] text-slate-400">
                                    {formatRupiah(perPortionCost)} / porsi
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                        {(simulatedSummary.recipe.packagingCostPerPortion || 0) >
                          0 && (
                          <tr className="bg-slate-50/40">
                            <td className="py-3 px-4 font-semibold text-slate-700">
                              Biaya Kemasan &amp; Operasional Tambahan
                            </td>
                            <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                              {simulatedSummary.recipe.portions} porsi
                            </td>
                            <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                              {formatRupiah(
                                simulatedSummary.recipe.packagingCostPerPortion || 0
                              )}{' '}
                              <span className="text-[10px] text-slate-400">
                                / porsi
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[11px] text-slate-500">
                              Biaya Tetap
                            </td>
                            <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                              {formatRupiah(simulatedSummary.totalPackagingCost)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Resep */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingRecipe ? 'Edit Master Resep' : 'Buat Master Resep Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Susun komposisi bahan baku untuk kalkulasi HPP dinamis otomatis
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipe}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Basic Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nama Menu / Paket Katering <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Nasi Kotak Rendang Spesial"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Kategori Menu
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {RECIPE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Hasil Porsi Resep
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formPortions}
                      onChange={(e) => setFormPortions(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Kemasan / Porsi (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={formPackagingCost}
                      onChange={(e) => setFormPackagingCost(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Target Margin (%)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={85}
                      value={formTargetMargin}
                      onChange={(e) => setFormTargetMargin(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Harga Jual / Porsi (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={formSellingPrice}
                      onChange={(e) => setFormSellingPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Ingredients Section */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800">
                        Komposisi Bahan Baku
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Hubungkan ke item transaksi belanja agar harga otomatis mengikuti pembelian terakhir
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddIngredientRow}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Bahan</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {formIngredients.map((ing, idx) => {
                      const baseUnit = getBaseUnitForRecipeUnit(ing.unit);
                      return (
                        <div
                          key={ing.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                            <div className="sm:col-span-5">
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                Nama Bahan #{idx + 1}
                              </label>
                              <input
                                type="text"
                                placeholder="Contoh: Beras Ramos, Daging Sapi"
                                value={ing.name}
                                onChange={(e) =>
                                  handleUpdateIngredientRow(ing.id, {
                                    name: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                Takaran
                              </label>
                              <input
                                type="number"
                                min={0}
                                step="any"
                                value={ing.qty}
                                onChange={(e) =>
                                  handleUpdateIngredientRow(ing.id, {
                                    qty: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                Satuan
                              </label>
                              <select
                                value={ing.unit}
                                onChange={(e) =>
                                  handleUpdateIngredientRow(ing.id, {
                                    unit: e.target.value as RecipeUnit,
                                  })
                                }
                                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                              >
                                {RECIPE_UNITS.map((u) => (
                                  <option key={u} value={u}>
                                    {u}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                Sumber Harga
                              </label>
                              <select
                                value={ing.priceSourceMode || 'auto'}
                                onChange={(e) =>
                                  handleUpdateIngredientRow(ing.id, {
                                    priceSourceMode: e.target.value as
                                      | 'auto'
                                      | 'manual',
                                  })
                                }
                                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                              >
                                <option value="auto">Otomatis</option>
                                <option value="manual">Manual</option>
                              </select>
                            </div>

                            <div className="sm:col-span-1 flex justify-end pt-3 sm:pt-4">
                              <button
                                type="button"
                                onClick={() => handleRemoveIngredientRow(ing.id)}
                                disabled={formIngredients.length <= 1}
                                title="Hapus baris bahan"
                                className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Row secondary controls: Link to Firestore Transaction OR Manual Price */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {ing.priceSourceMode !== 'manual' ? (
                              <div>
                                <label className="block text-[10px] text-slate-500 mb-0.5">
                                  Tautkan ke Item Transaksi (Opsional)
                                </label>
                                <select
                                  value={ing.linkedTransactionItem || ''}
                                  onChange={(e) => {
                                    const selectedItem = e.target.value;
                                    handleUpdateIngredientRow(ing.id, {
                                      linkedTransactionItem: selectedItem || undefined,
                                      name:
                                        !ing.name.trim() && selectedItem
                                          ? selectedItem
                                          : ing.name,
                                    });
                                  }}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-none focus:border-blue-600"
                                >
                                  <option value="">
                                    -- Cocokkan Otomatis Berdasarkan Nama --
                                  </option>
                                  {latestPrices.map((lp) => (
                                    <option
                                      key={lp.transactionId}
                                      value={lp.itemName}
                                    >
                                      {lp.itemName} ({formatRupiah(lp.pricePerBaseUnit)}/{lp.baseUnit} · {lp.date})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div>
                                <label className="block text-[10px] text-slate-500 mb-0.5">
                                  Harga Manual per {formatBaseUnitLabel(baseUnit)} (Rp)
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  placeholder={`Harga per ${formatBaseUnitLabel(baseUnit)}`}
                                  value={ing.manualPricePerUnit ?? ''}
                                  onChange={(e) =>
                                    handleUpdateIngredientRow(ing.id, {
                                      manualPricePerUnit:
                                        parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                              </div>
                            )}

                            {ing.priceSourceMode !== 'manual' && (
                              <div>
                                <label className="block text-[10px] text-slate-500 mb-0.5">
                                  Harga Cadangan per {formatBaseUnitLabel(baseUnit)} (jika belum ada transaksi)
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  placeholder="Opsional (Rp)"
                                  value={ing.manualPricePerUnit ?? ''}
                                  onChange={(e) =>
                                    handleUpdateIngredientRow(ing.id, {
                                      manualPricePerUnit: e.target.value
                                        ? parseFloat(e.target.value)
                                        : undefined,
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-600"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catatan Dapur (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Menu standar box 4 sekat, termasuk sambal"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Real-time Draft HPP Preview */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-medium text-blue-700 block">
                      Estimasi HPP / Porsi
                    </span>
                    <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                      {formatRupiah(modalPreviewSummary.hppPerPortion)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-medium text-blue-700 block">
                      Saran Harga Jual (Margin {modalPreviewSummary.recipe.targetMargin}%)
                    </span>
                    <span className="text-base font-bold text-blue-700 font-mono tabular-nums">
                      {formatRupiah(modalPreviewSummary.recommendedSellingPriceRounded)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-slate-200 bg-white rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>
                        {editingRecipe ? 'Simpan Perubahan' : 'Simpan Resep'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {recipeToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3.5">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Hapus Master Resep?
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Apakah Anda yakin ingin menghapus resep{' '}
              <span className="font-semibold text-slate-800">
                "{recipeToDelete.name}"
              </span>
              ? Data resep ini akan dihapus permanen.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setRecipeToDelete(null)}
                className="w-1/2 px-4 py-2 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="w-1/2 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
    </div>
  );
};
