import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  PieChart as PieIcon,
  Tag,
  ArrowRight,
  Beef,
  Wheat,
  Flame,
  Package,
  Egg,
  Apple,
  Fuel,
  MoreHorizontal
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface CategoryItem {
  name: string;
  percentage: number;
  value: number;
  color: string;
}

interface CategoryDonutChartProps {
  categories: CategoryItem[];
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  categories,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Icon mapping helper
  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Daging & Seafood':
        return <Beef className="w-3.5 h-3.5 text-red-500" />;
      case 'Bahan Pokok':
        return <Wheat className="w-3.5 h-3.5 text-amber-500" />;
      case 'Bumbu & Rempah':
        return <Flame className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Packaging':
        return <Package className="w-3.5 h-3.5 text-blue-500" />;
      case 'Susu & Telur':
        return <Egg className="w-3.5 h-3.5 text-purple-500" />;
      case 'Sayuran & Buah':
        return <Apple className="w-3.5 h-3.5 text-teal-500" />;
      case 'Minyak & Gas':
        return <Fuel className="w-3.5 h-3.5 text-orange-500" />;
      default:
        return <MoreHorizontal className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const activeCategory = activeIndex !== null ? categories[activeIndex] : null;
  const totalCategoryVal = categories.reduce((sum, c) => sum + c.value, 0);
  const activeCategoriesCount = categories.filter((c) => c.value > 0).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Komposisi Kategori
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                Porsi Belanja
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Porsi alokasi belanja bahan makanan katering
            </p>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-200">
            <PieIcon className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Donut Chart & Center Metric */}
      <div className="my-2 relative flex items-center justify-center">
        <div className="w-[190px] h-[190px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as CategoryItem;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-xs z-50">
                        <div className="font-semibold text-slate-200">{data.name}</div>
                        <div className="text-sm font-bold text-sky-400 mt-0.5">
                          {formatRupiah(data.value)} ({data.percentage}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="cursor-pointer transition-transform duration-200 hover:opacity-90"
                    style={{
                      transform: activeIndex === index ? 'scale(1.04)' : 'scale(1)',
                      transformOrigin: 'center center',
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Central Donut Text: "8 KATEGORI" */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {activeCategory ? (
              <div className="animate-fadeIn">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {activeCategory.percentage}%
                </span>
                <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[90px] mx-auto leading-tight">
                  {activeCategory.name}
                </span>
                <span className="text-[9px] text-slate-500 font-medium">
                  {formatRupiah(activeCategory.value)}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-lg font-black text-slate-900 leading-none block">
                  {activeCategoriesCount}
                </span>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mt-0.5 block">
                  KATEGORI
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend & Nominal Breakdown (Grid 2 Kolom) */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100 max-h-[175px] overflow-y-auto pr-1">
        {categories.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            Belum ada transaksi pengeluaran tercatat
          </div>
        ) : (
          categories.map((item, idx) => {
            const isHovered = activeIndex === idx;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center justify-between py-1 px-2 rounded-lg text-xs cursor-pointer transition-all ${
                  isHovered
                    ? 'bg-slate-100 ring-1 ring-slate-300 font-semibold'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-slate-700 text-[11px] font-medium">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[11px] flex-shrink-0 ml-2">
                  <span className="font-bold text-slate-900">{item.percentage}%</span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    ({formatRupiah(item.value)})
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Total Terakumulasi:</span>
        <strong className="text-slate-700 font-semibold">
          {formatRupiah(totalCategoryVal)} ({totalCategoryVal > 0 ? '100%' : '0%'})
        </strong>
      </div>
    </div>
  );
};
