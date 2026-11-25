import {
  Transaction,
  IngredientBenchmark,
  Recipe,
  RecipeIngredient,
  RecipeUnit,
} from '../types';

export type UnitFamily = 'weight' | 'volume' | 'count';
export type BaseUnit = 'kg' | 'liter' | 'pcs';

export interface ParsedTransactionPrice {
  transactionId: string;
  itemName: string;
  date: string;
  time: string;
  supplier: string;
  rawQty: string;
  rawAmount: number;
  baseUnit: BaseUnit;
  family: UnitFamily;
  pricePerBaseUnit: number;
  previousPricePerBaseUnit?: number;
  previousDate?: string;
  priceChangePct?: number;
}

export interface ResolvedIngredientCost {
  ingredient: RecipeIngredient;
  source: 'transaction' | 'manual' | 'benchmark' | 'none';
  sourceLabel: string;
  matchedItemName?: string;
  matchedDate?: string;
  matchedSupplier?: string;
  baseUnit: BaseUnit;
  pricePerBaseUnit: number;
  unitCostInRecipeUnit: number;
  totalCost: number;
  priceChangePct?: number;
  previousPricePerBaseUnit?: number;
  unitMismatch: boolean;
}

export interface RecipeCostingSummary {
  recipe: Recipe;
  resolvedIngredients: ResolvedIngredientCost[];
  totalIngredientCost: number;
  totalPackagingCost: number;
  totalBatchCost: number;
  hppPerPortion: number;
  recommendedSellingPriceExact: number;
  recommendedSellingPriceRounded: number;
  actualMarginPct: number;
  profitPerPortion: number;
  foodCostPct: number;
  marginStatus: 'healthy' | 'warning' | 'loss' | 'unset';
  missingPriceCount: number;
  unitMismatchCount: number;
  priceSpikeWarnings: ResolvedIngredientCost[];
}

export function getUnitFamily(unit: RecipeUnit | BaseUnit): UnitFamily {
  if (unit === 'gr' || unit === 'kg') return 'weight';
  if (unit === 'ml' || unit === 'liter') return 'volume';
  return 'count';
}

export function getBaseUnitForRecipeUnit(unit: RecipeUnit): BaseUnit {
  if (unit === 'gr' || unit === 'kg') return 'kg';
  if (unit === 'ml' || unit === 'liter') return 'liter';
  return 'pcs';
}

export function getMultiplierToBaseUnit(unit: RecipeUnit): number {
  if (unit === 'gr' || unit === 'ml') return 0.001;
  return 1;
}

export function formatBaseUnitLabel(baseUnit: BaseUnit): string {
  if (baseUnit === 'kg') return 'kg';
  if (baseUnit === 'liter') return 'liter';
  return 'pcs';
}

function parseUnitString(
  rawText: string
): { value: number; baseUnit: BaseUnit; family: UnitFamily } | null {
  if (!rawText) return null;
  const match = rawText.match(
    /(\d+(?:[.,]\d+)?)\s*(kg|kilogram|gr|gram|g|liter|ltr|l|ml|pcs|pc|buah|butir|biji|lembar)\b/i
  );
  if (!match) return null;

  const num = parseFloat(match[1].replace(',', '.'));
  if (!num || num <= 0 || Number.isNaN(num)) return null;

  const u = match[2].toLowerCase();
  if (u === 'kg' || u === 'kilogram') {
    return { value: num, baseUnit: 'kg', family: 'weight' };
  }
  if (u === 'gr' || u === 'gram' || u === 'g') {
    return { value: num / 1000, baseUnit: 'kg', family: 'weight' };
  }
  if (u === 'liter' || u === 'ltr' || u === 'l') {
    return { value: num, baseUnit: 'liter', family: 'volume' };
  }
  if (u === 'ml') {
    return { value: num / 1000, baseUnit: 'liter', family: 'volume' };
  }
  return { value: num, baseUnit: 'pcs', family: 'count' };
}

export function extractTransactionBaseUnitPrice(trx: Transaction): {
  baseUnit: BaseUnit;
  family: UnitFamily;
  pricePerBaseUnit: number;
} {
  const amount = Number(trx.amount) || 0;

  // 1. Try parsing trx.qty directly (e.g., "2 kg", "500 gr", "5 liter", "200 pcs")
  const parsedQty = parseUnitString(trx.qty || '');
  if (parsedQty && parsedQty.value > 0) {
    return {
      baseUnit: parsedQty.baseUnit,
      family: parsedQty.family,
      pricePerBaseUnit: Math.round(amount / parsedQty.value),
    };
  }

  // 2. Check package multiplier in description (e.g., "4 sak" + "@25kg" -> 100 kg)
  const countMatch = (trx.qty || '').match(/(\d+(?:[.,]\d+)?)/);
  const packCount = countMatch ? parseFloat(countMatch[1].replace(',', '.')) : 1;

  const perPackMatch = (trx.description || '').match(
    /@\s*(\d+(?:[.,]\d+)?)\s*(kg|gr|gram|g|liter|ltr|l|ml|pcs|butir)/i
  );
  if (perPackMatch && packCount > 0) {
    const parsedPack = parseUnitString(`${perPackMatch[1]} ${perPackMatch[2]}`);
    if (parsedPack && parsedPack.value > 0) {
      const totalBaseValue = packCount * parsedPack.value;
      return {
        baseUnit: parsedPack.baseUnit,
        family: parsedPack.family,
        pricePerBaseUnit: Math.round(amount / totalBaseValue),
      };
    }
  }

  // 3. Check item title for explicit total measure (e.g., "Beras Ramos Premium 100kg")
  const parsedItemUnit = parseUnitString(trx.item || '');
  if (parsedItemUnit && parsedItemUnit.value > 0) {
    // Check if qty indicates multiple of an item like "2 jerigen" + "18L" in item name
    if (
      packCount > 1 &&
      /(jerigen|sak|karung|karton|dus|tabung|tray|pack|paket)/i.test(trx.qty || '')
    ) {
      const totalBase = packCount * parsedItemUnit.value;
      return {
        baseUnit: parsedItemUnit.baseUnit,
        family: parsedItemUnit.family,
        pricePerBaseUnit: Math.round(amount / totalBase),
      };
    }
    return {
      baseUnit: parsedItemUnit.baseUnit,
      family: parsedItemUnit.family,
      pricePerBaseUnit: Math.round(amount / parsedItemUnit.value),
    };
  }

  // 4. Fallback to unitPrice or amount per pcs
  const divisor = packCount > 0 ? packCount : 1;
  const fallbackUnitPrice =
    trx.unitPrice && trx.unitPrice > 0 ? trx.unitPrice : Math.round(amount / divisor);

  return {
    baseUnit: 'pcs',
    family: 'count',
    pricePerBaseUnit: fallbackUnitPrice,
  };
}

function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Builds a sorted list of latest ingredient purchase prices from Firestore transactions,
 * preserving the previous price (if any) to detect raw material price spikes.
 */
export function buildLatestTransactionPrices(
  transactions: Transaction[]
): ParsedTransactionPrice[] {
  const sorted = [...transactions].sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
    const timeB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
    return timeB - timeA;
  });

  const groupedByItem = new Map<string, ParsedTransactionPrice[]>();

  sorted.forEach((trx) => {
    if (!trx.item || trx.amount <= 0) return;
    const key = normalizeName(trx.item);
    if (!key) return;

    const extracted = extractTransactionBaseUnitPrice(trx);
    const entry: ParsedTransactionPrice = {
      transactionId: trx.id,
      itemName: trx.item,
      date: trx.date,
      time: trx.time || '00:00',
      supplier: trx.supplier,
      rawQty: trx.qty || '1 item',
      rawAmount: trx.amount,
      baseUnit: extracted.baseUnit,
      family: extracted.family,
      pricePerBaseUnit: extracted.pricePerBaseUnit,
    };

    const existingList = groupedByItem.get(key) || [];
    existingList.push(entry);
    groupedByItem.set(key, existingList);
  });

  const result: ParsedTransactionPrice[] = [];
  groupedByItem.forEach((entries) => {
    const latest = entries[0];
    // Find most recent previous purchase with matching unit family
    const previous = entries
      .slice(1)
      .find((e) => e.family === latest.family && e.pricePerBaseUnit > 0);

    if (previous) {
      latest.previousPricePerBaseUnit = previous.pricePerBaseUnit;
      latest.previousDate = previous.date;
      latest.priceChangePct = Number(
        (
          ((latest.pricePerBaseUnit - previous.pricePerBaseUnit) /
            previous.pricePerBaseUnit) *
          100
        ).toFixed(1)
      );
    }

    result.push(latest);
  });

  return result;
}

function findMatchingTransactionPrice(
  ingredient: RecipeIngredient,
  latestPrices: ParsedTransactionPrice[]
): ParsedTransactionPrice | null {
  if (latestPrices.length === 0) return null;

  // 1. Exact linked item selection from user
  if (ingredient.linkedTransactionItem) {
    const linkedNorm = normalizeName(ingredient.linkedTransactionItem);
    const exactLinked = latestPrices.find(
      (p) => normalizeName(p.itemName) === linkedNorm
    );
    if (exactLinked) return exactLinked;
  }

  const ingNorm = normalizeName(ingredient.name);
  if (!ingNorm) return null;

  // 2. Exact item name match
  const exactMatch = latestPrices.find((p) => normalizeName(p.itemName) === ingNorm);
  if (exactMatch) return exactMatch;

  // 3. Starts-with match (prefer matching unit family first)
  const ingFamily = getUnitFamily(ingredient.unit);
  const startsWithMatches = latestPrices.filter((p) => {
    const pNorm = normalizeName(p.itemName);
    return pNorm.startsWith(ingNorm) || ingNorm.startsWith(pNorm);
  });
  if (startsWithMatches.length > 0) {
    return (
      startsWithMatches.find((m) => m.family === ingFamily) || startsWithMatches[0]
    );
  }

  // 4. Token / substring inclusion match
  const ingTokens = ingNorm.split(' ').filter((t) => t.length >= 3);
  const includesMatches = latestPrices.filter((p) => {
    const pNorm = normalizeName(p.itemName);
    if (pNorm.includes(ingNorm) || ingNorm.includes(pNorm)) return true;
    return ingTokens.some((tok) => pNorm.includes(tok));
  });

  if (includesMatches.length > 0) {
    return includesMatches.find((m) => m.family === ingFamily) || includesMatches[0];
  }

  return null;
}

function findMatchingBenchmark(
  ingredient: RecipeIngredient,
  benchmarks: IngredientBenchmark[]
): IngredientBenchmark | null {
  if (benchmarks.length === 0) return null;
  const ingNorm = normalizeName(ingredient.name);
  if (!ingNorm) return null;

  const exact = benchmarks.find((b) => normalizeName(b.name) === ingNorm);
  if (exact) return exact;

  const tokens = ingNorm.split(' ').filter((t) => t.length >= 3);
  const match = benchmarks.find((b) => {
    const bNorm = normalizeName(b.name);
    if (bNorm.includes(ingNorm) || ingNorm.includes(bNorm)) return true;
    return tokens.some((t) => bNorm.includes(t));
  });

  return match || null;
}

export function resolveIngredientCost(
  ingredient: RecipeIngredient,
  latestPrices: ParsedTransactionPrice[],
  benchmarks: IngredientBenchmark[]
): ResolvedIngredientCost {
  const ingBaseUnit = getBaseUnitForRecipeUnit(ingredient.unit);
  const ingFamily = getUnitFamily(ingredient.unit);
  const multiplier = getMultiplierToBaseUnit(ingredient.unit);

  // Manual override mode
  if (
    ingredient.priceSourceMode === 'manual' &&
    typeof ingredient.manualPricePerUnit === 'number' &&
    ingredient.manualPricePerUnit >= 0
  ) {
    const unitCostInRecipeUnit = ingredient.manualPricePerUnit * multiplier;
    return {
      ingredient,
      source: 'manual',
      sourceLabel: 'Input Manual',
      baseUnit: ingBaseUnit,
      pricePerBaseUnit: ingredient.manualPricePerUnit,
      unitCostInRecipeUnit,
      totalCost: Math.round(ingredient.qty * unitCostInRecipeUnit),
      unitMismatch: false,
    };
  }

  // Auto mode: 1st priority -> Latest Firestore Transaction
  const matchedTrx = findMatchingTransactionPrice(ingredient, latestPrices);
  if (matchedTrx) {
    const unitMismatch = matchedTrx.family !== ingFamily;
    const unitCostInRecipeUnit = unitMismatch
      ? 0
      : matchedTrx.pricePerBaseUnit * multiplier;

    return {
      ingredient,
      source: 'transaction',
      sourceLabel: `Transaksi ${matchedTrx.date}`,
      matchedItemName: matchedTrx.itemName,
      matchedDate: matchedTrx.date,
      matchedSupplier: matchedTrx.supplier,
      baseUnit: matchedTrx.baseUnit,
      pricePerBaseUnit: matchedTrx.pricePerBaseUnit,
      unitCostInRecipeUnit,
      totalCost: unitMismatch ? 0 : Math.round(ingredient.qty * unitCostInRecipeUnit),
      priceChangePct: matchedTrx.priceChangePct,
      previousPricePerBaseUnit: matchedTrx.previousPricePerBaseUnit,
      unitMismatch,
    };
  }

  // Auto mode fallback 1 -> User manual fallback price (if provided)
  if (
    typeof ingredient.manualPricePerUnit === 'number' &&
    ingredient.manualPricePerUnit > 0
  ) {
    const unitCostInRecipeUnit = ingredient.manualPricePerUnit * multiplier;
    return {
      ingredient,
      source: 'manual',
      sourceLabel: 'Estimasi Manual',
      baseUnit: ingBaseUnit,
      pricePerBaseUnit: ingredient.manualPricePerUnit,
      unitCostInRecipeUnit,
      totalCost: Math.round(ingredient.qty * unitCostInRecipeUnit),
      unitMismatch: false,
    };
  }

  // Auto mode fallback 2 -> Market Benchmark catalog
  const benchmark = findMatchingBenchmark(ingredient, benchmarks);
  if (benchmark) {
    const bUnitRaw = benchmark.unit.toLowerCase();
    const bBaseUnit: BaseUnit =
      bUnitRaw === 'kg' ? 'kg' : bUnitRaw === 'liter' ? 'liter' : 'pcs';
    const bFamily = getUnitFamily(bBaseUnit);
    const unitMismatch = bFamily !== ingFamily;
    const unitCostInRecipeUnit = unitMismatch ? 0 : benchmark.currentPrice * multiplier;
    const benchChangePct =
      benchmark.previousPrice > 0
        ? Number(
            (
              ((benchmark.currentPrice - benchmark.previousPrice) /
                benchmark.previousPrice) *
              100
            ).toFixed(1)
          )
        : undefined;

    return {
      ingredient,
      source: 'benchmark',
      sourceLabel: 'Patokan Pasar',
      matchedItemName: benchmark.name,
      matchedDate: benchmark.lastUpdated,
      baseUnit: bBaseUnit,
      pricePerBaseUnit: benchmark.currentPrice,
      unitCostInRecipeUnit,
      totalCost: unitMismatch ? 0 : Math.round(ingredient.qty * unitCostInRecipeUnit),
      priceChangePct: benchChangePct,
      previousPricePerBaseUnit: benchmark.previousPrice,
      unitMismatch,
    };
  }

  // No data source found
  return {
    ingredient,
    source: 'none',
    sourceLabel: 'Belum Ada Harga',
    baseUnit: ingBaseUnit,
    pricePerBaseUnit: 0,
    unitCostInRecipeUnit: 0,
    totalCost: 0,
    unitMismatch: false,
  };
}

export function calculateRecipeCosting(
  recipe: Recipe,
  transactions: Transaction[],
  benchmarks: IngredientBenchmark[]
): RecipeCostingSummary {
  const latestPrices = buildLatestTransactionPrices(transactions);
  return calculateRecipeCostingWithPriceMap(recipe, latestPrices, benchmarks);
}

export function calculateRecipeCostingWithPriceMap(
  recipe: Recipe,
  latestPrices: ParsedTransactionPrice[],
  benchmarks: IngredientBenchmark[]
): RecipeCostingSummary {
  const resolvedIngredients = recipe.ingredients.map((ing) =>
    resolveIngredientCost(ing, latestPrices, benchmarks)
  );

  const portions = recipe.portions > 0 ? recipe.portions : 1;
  const totalIngredientCost = resolvedIngredients.reduce(
    (sum, item) => sum + item.totalCost,
    0
  );
  const totalPackagingCost = (recipe.packagingCostPerPortion || 0) * portions;
  const totalBatchCost = totalIngredientCost + totalPackagingCost;
  const hppPerPortion = Math.round(totalBatchCost / portions);

  const clampedMargin = Math.min(90, Math.max(0, recipe.targetMargin || 0));
  const recommendedSellingPriceExact =
    hppPerPortion > 0
      ? Math.ceil(hppPerPortion / (1 - clampedMargin / 100))
      : 0;
  const recommendedSellingPriceRounded =
    recommendedSellingPriceExact > 0
      ? Math.ceil(recommendedSellingPriceExact / 500) * 500
      : 0;

  const sellingPrice = recipe.sellingPrice || 0;
  const profitPerPortion = sellingPrice - hppPerPortion;
  const actualMarginPct =
    sellingPrice > 0
      ? Number((((sellingPrice - hppPerPortion) / sellingPrice) * 100).toFixed(1))
      : 0;
  const foodCostPct =
    sellingPrice > 0
      ? Number(((hppPerPortion / sellingPrice) * 100).toFixed(1))
      : 0;

  let marginStatus: 'healthy' | 'warning' | 'loss' | 'unset' = 'unset';
  if (sellingPrice <= 0) {
    marginStatus = 'unset';
  } else if (profitPerPortion <= 0) {
    marginStatus = 'loss';
  } else if (actualMarginPct < clampedMargin) {
    marginStatus = 'warning';
  } else {
    marginStatus = 'healthy';
  }

  const missingPriceCount = resolvedIngredients.filter(
    (r) => r.source === 'none'
  ).length;
  const unitMismatchCount = resolvedIngredients.filter(
    (r) => r.unitMismatch
  ).length;
  const priceSpikeWarnings = resolvedIngredients.filter(
    (r) => typeof r.priceChangePct === 'number' && r.priceChangePct > 0
  );

  return {
    recipe,
    resolvedIngredients,
    totalIngredientCost,
    totalPackagingCost,
    totalBatchCost,
    hppPerPortion,
    recommendedSellingPriceExact,
    recommendedSellingPriceRounded,
    actualMarginPct,
    profitPerPortion,
    foodCostPct,
    marginStatus,
    missingPriceCount,
    unitMismatchCount,
    priceSpikeWarnings,
  };
}
