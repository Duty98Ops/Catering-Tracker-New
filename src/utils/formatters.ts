import { CategoryType, PaymentStatus } from '../types';

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value).replace('IDR', 'Rp').trim();
};

export const formatCompactRupiah = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)} Jt`;
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)} Ribu`;
  }
  return formatRupiah(value);
};

export const getCategoryBadgeStyle = (category: CategoryType) => {
  switch (category) {
    case 'Daging & Seafood':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Bahan Pokok':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Bumbu & Rempah':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Packaging':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Susu & Telur':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Sayuran & Buah':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'Minyak & Gas':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Lain-lain':
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const getStatusBadgeStyle = (status: PaymentStatus) => {
  switch (status) {
    case 'Lunas (Transfer)':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
    case 'Lunas (Cash)':
      return 'bg-green-50 text-green-700 border-green-200 font-medium';
    case 'Tempo (Hutang)':
      return 'bg-amber-50 text-amber-700 border-amber-200 font-medium';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};
