export type CategoryType = 
  | 'Daging & Seafood'
  | 'Bahan Pokok'
  | 'Bumbu & Rempah'
  | 'Packaging'
  | 'Susu & Telur'
  | 'Sayuran & Buah'
  | 'Minyak & Gas'
  | 'Lain-lain';

export type PaymentStatus = 
  | 'Lunas (Transfer)'
  | 'Lunas (Cash)'
  | 'Tempo (Hutang)';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  item: string;
  description: string;
  category: CategoryType;
  supplier: string;
  status: PaymentStatus;
  amount: number;
  qty?: string;
  unitPrice?: number;
  invoiceNumber?: string;
  notes?: string;
  isArchived?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  phone: string;
  address: string;
  rating: number;
  totalSpent: number;
  transactionCount: number;
}

export interface IngredientBenchmark {
  id: string;
  name: string;
  category: CategoryType;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  marketTrend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  note: string;
}
