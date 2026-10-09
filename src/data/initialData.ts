import { Transaction, Supplier, IngredientBenchmark } from '../types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-20260925-01',
    date: '2026-09-25',
    time: '21:09',
    item: 'Ayam',
    description: '2 kg ayam potong segar untuk menu opor',
    category: 'Daging & Seafood',
    supplier: 'Pasar Tradisional',
    status: 'Lunas (Transfer)',
    amount: 28000,
    qty: '2 kg',
    unitPrice: 14000,
    invoiceNumber: 'INV/20260925/089',
    notes: 'Ayam broiler ukuran sedang, sudah dibersihkan'
  },
  {
    id: 'TRX-20260923-01',
    date: '2026-09-23',
    time: '12:42',
    item: 'Sapi',
    description: '2 kg sapi tetelan untuk kaldu & sup',
    category: 'Bahan Pokok',
    supplier: 'Pasar Tradisional',
    status: 'Lunas (Cash)',
    amount: 50000,
    qty: '2 kg',
    unitPrice: 25000,
    invoiceNumber: 'INV/20260923/044',
    notes: 'Kualitas segar, potongan dadu untuk kuah'
  },
  {
    id: 'TRX-20260922-02',
    date: '2026-09-22',
    time: '22:07',
    item: 'Telur & Beras',
    description: 'Beras Ramos 5kg & Telur Negeri 1 tray (30 butir)',
    category: 'Susu & Telur',
    supplier: 'Toko Bumbu Bu Sri',
    status: 'Lunas (Transfer)',
    amount: 104000,
    qty: '1 paket',
    unitPrice: 104000,
    invoiceNumber: 'INV/20260922/191',
    notes: 'Pengiriman darurat tambahan untuk menu sarapan besok'
  },
  {
    id: 'TRX-20260922-01',
    date: '2026-09-22',
    time: '08:15',
    item: 'Daging Sapi & Fillet Ayam Katering',
    description: 'Daging Has Luar 6kg, Daging Rendang 4kg, Fillet Ayam 5kg (Pesanan Event Wedding)',
    category: 'Daging & Seafood',
    supplier: 'UD Berkah Daging',
    status: 'Lunas (Transfer)',
    amount: 1015000,
    qty: '15 kg',
    unitPrice: 67666,
    invoiceNumber: 'INV/20260922/012',
    notes: 'Pesanan partai besar buffet 300 pax'
  },
  {
    id: 'TRX-20260918-01',
    date: '2026-09-18',
    time: '06:30',
    item: 'Beras Pandan Wangi & Minyak Curah',
    description: 'Beras 25kg & Minyak Goreng 5 Liter',
    category: 'Bahan Pokok',
    supplier: 'Grosir Beras Jaya Mandiri',
    status: 'Lunas (Transfer)',
    amount: 120000,
    qty: '1 paket',
    unitPrice: 120000,
    invoiceNumber: 'INV/20260918/005',
    notes: 'Stok beras mingguan dapur operasional'
  },
  {
    id: 'TRX-20260915-01',
    date: '2026-09-15',
    time: '14:20',
    item: 'Bumbu Dapur Basah & Rempah Kering',
    description: 'Cabai Merah Keriting 3kg, Bawang Merah 3kg, Bawang Putih 2kg, Kemiri & Ketumbar',
    category: 'Bumbu & Rempah',
    supplier: 'Toko Bumbu Bu Sri',
    status: 'Lunas (Cash)',
    amount: 150000,
    qty: '8 kg',
    unitPrice: 18750,
    invoiceNumber: 'INV/20260915/078',
    notes: 'Giling halus sebagian untuk bumbu kuning dan merah'
  },
  {
    id: 'TRX-20260912-01',
    date: '2026-09-12',
    time: '10:05',
    item: 'Kotak Bento & Sendok Set Ramah Lingkungan',
    description: 'Thinwall Bento 4 Sekat 200 pcs & Sendok Garpu Kayu steril',
    category: 'Packaging',
    supplier: 'Mitra Plastik Surya',
    status: 'Lunas (Transfer)',
    amount: 95000,
    qty: '200 pcs',
    unitPrice: 475,
    invoiceNumber: 'INV/20260912/032',
    notes: 'Kemasan catering premium corporate lunch box'
  },
  {
    id: 'TRX-20260908-01',
    date: '2026-09-08',
    time: '07:15',
    item: 'Sayuran Segar Campur & Buah Pencuci Mulut',
    description: 'Buncis, Wortel Berastagi, Jagung Manis, Semangka Merah 2 butir',
    category: 'Sayuran & Buah',
    supplier: 'Pasar Tradisional',
    status: 'Lunas (Cash)',
    amount: 65000,
    qty: '12 kg',
    unitPrice: 5416,
    invoiceNumber: 'INV/20260908/011',
    notes: 'Bahan sayur sop manten dan buah potong'
  },
  // Supporting previous transaction history making total 31 items
  {
    id: 'TRX-20260830-01',
    date: '2026-08-30',
    time: '09:20',
    item: 'Daging Kambing Muda',
    description: '10 kg kambing potong untuk gulai akikah',
    category: 'Daging & Seafood',
    supplier: 'UD Berkah Daging',
    status: 'Lunas (Transfer)',
    amount: 1450000,
    qty: '10 kg'
  },
  {
    id: 'TRX-20260828-02',
    date: '2026-08-28',
    time: '11:15',
    item: 'Beras Ramos Premium 100kg',
    description: '4 Karung Beras @25kg',
    category: 'Bahan Pokok',
    supplier: 'Grosir Beras Jaya Mandiri',
    status: 'Lunas (Transfer)',
    amount: 1380000,
    qty: '4 sak'
  },
  {
    id: 'TRX-20260825-01',
    date: '2026-08-25',
    time: '15:40',
    item: 'Gas LPG 12kg & 3kg Refill',
    description: '2 tabung gas 12kg untuk oven & kompor api besar',
    category: 'Minyak & Gas',
    supplier: 'Agen Gas Melati',
    status: 'Lunas (Cash)',
    amount: 420000,
    qty: '2 tabung'
  },
  {
    id: 'TRX-20260822-01',
    date: '2026-08-22',
    time: '08:30',
    item: 'Udang Windu & Cumi Segar',
    description: 'Udang uk 30 8kg, Cumi Sero 5kg',
    category: 'Daging & Seafood',
    supplier: 'Pasar Ikan Muara',
    status: 'Lunas (Transfer)',
    amount: 1150000,
    qty: '13 kg'
  },
  {
    id: 'TRX-20260820-03',
    date: '2026-08-20',
    time: '13:00',
    item: 'Paper Lunch Box L & Stiker Logo',
    description: '500 pcs box laminasi anti minyak',
    category: 'Packaging',
    supplier: 'Mitra Plastik Surya',
    status: 'Lunas (Transfer)',
    amount: 475000,
    qty: '500 pcs'
  },
  {
    id: 'TRX-20260818-01',
    date: '2026-08-18',
    time: '07:45',
    item: 'Ayam Fillet Dada & Paha',
    description: '15 kg dada fillet untuk ayam suwir bali',
    category: 'Daging & Seafood',
    supplier: 'UD Berkah Daging',
    status: 'Lunas (Transfer)',
    amount: 825000,
    qty: '15 kg'
  },
  {
    id: 'TRX-20260815-02',
    date: '2026-08-15',
    time: '10:10',
    item: 'Telur Ayam Ras 3 Peti',
    description: '30 kg telur fresh farm',
    category: 'Susu & Telur',
    supplier: 'Agen Telur Berkah',
    status: 'Lunas (Cash)',
    amount: 810000,
    qty: '30 kg'
  },
  {
    id: 'TRX-20260812-01',
    date: '2026-08-12',
    time: '06:50',
    item: 'Bawang Merah Brebes & Bawang Putih Kating',
    description: 'Bawang Merah 10kg, Bawang Putih 8kg',
    category: 'Bumbu & Rempah',
    supplier: 'Toko Bumbu Bu Sri',
    status: 'Lunas (Cash)',
    amount: 620000,
    qty: '18 kg'
  },
  {
    id: 'TRX-20260810-01',
    date: '2026-08-10',
    time: '16:00',
    item: 'Minyak Goreng Sania Jerigen 18L',
    description: '2 Jerigen minyak goreng premium',
    category: 'Minyak & Gas',
    supplier: 'Grosir Beras Jaya Mandiri',
    status: 'Lunas (Transfer)',
    amount: 610000,
    qty: '2 jerigen'
  },
  {
    id: 'TRX-20260807-02',
    date: '2026-08-07',
    time: '08:20',
    item: 'Ikan Gurame & Kakap Fillet',
    description: '12 kg gurame hidup & 6 kg kakap',
    category: 'Daging & Seafood',
    supplier: 'Pasar Ikan Muara',
    status: 'Lunas (Transfer)',
    amount: 980000,
    qty: '18 kg'
  },
  {
    id: 'TRX-20260805-01',
    date: '2026-08-05',
    time: '11:30',
    item: 'Bumbu Instan Rendang & Santan Kental',
    description: 'Kara 1L x 12 pcs & racik bumbu kelapa sangrai',
    category: 'Bumbu & Rempah',
    supplier: 'Toko Bumbu Bu Sri',
    status: 'Lunas (Cash)',
    amount: 395000,
    qty: '1 karton'
  },
  {
    id: 'TRX-20260802-01',
    date: '2026-08-02',
    time: '09:00',
    item: 'Wortel, Kentang Dieng, Kol & Brokoli',
    description: 'Sayuran sup dan capcay hajatan',
    category: 'Sayuran & Buah',
    supplier: 'Pasar Tradisional',
    status: 'Lunas (Cash)',
    amount: 340000,
    qty: '25 kg'
  },
  {
    id: 'TRX-20260729-01',
    date: '2026-07-29',
    time: '14:15',
    item: 'Mika Bento 5 Sekat + Tutup Bening',
    description: '300 pcs kemasan bento VIP',
    category: 'Packaging',
    supplier: 'Mitra Plastik Surya',
    status: 'Lunas (Transfer)',
    amount: 450000,
    qty: '300 pcs'
  },
  {
    id: 'TRX-20260727-02',
    date: '2026-07-27',
    time: '07:30',
    item: 'Daging Sapi Gandik & Iga',
    description: 'Iga Sapi 8kg & Daging Gandik 6kg untuk semur',
    category: 'Daging & Seafood',
    supplier: 'UD Berkah Daging',
    status: 'Lunas (Transfer)',
    amount: 1420000,
    qty: '14 kg'
  },
  {
    id: 'TRX-20260725-01',
    date: '2026-07-25',
    time: '10:45',
    item: 'Beras Ketan & Santan Murni',
    description: 'Bahan jajanan pasar snack box',
    category: 'Bahan Pokok',
    supplier: 'Grosir Beras Jaya Mandiri',
    status: 'Lunas (Cash)',
    amount: 285000,
    qty: '15 kg'
  },
  {
    id: 'TRX-20260722-01',
    date: '2026-07-22',
    time: '08:00',
    item: 'Melon, Jeruk Medan & Semangka Kuning',
    description: 'Buah segar dessert prasmanan',
    category: 'Sayuran & Buah',
    supplier: 'Pasar Tradisional',
    status: 'Lunas (Cash)',
    amount: 360000,
    qty: '30 kg'
  },
  {
    id: 'TRX-20260720-01',
    date: '2026-07-20',
    time: '12:30',
    item: 'Keju Cheddar, Margarin & Susu UHT',
    description: 'Bahan saus keju & puding vla',
    category: 'Susu & Telur',
    supplier: 'Toko Bahan Kue Sejahtera',
    status: 'Lunas (Transfer)',
    amount: 415000,
    qty: '1 paket'
  },
  {
    id: 'TRX-20260718-02',
    date: '2026-07-18',
    time: '15:10',
    item: 'Plastik Wrap & Sarung Tangan Food Grade',
    description: 'Perlengkapan hygiene kitchen',
    category: 'Packaging',
    supplier: 'Mitra Plastik Surya',
    status: 'Lunas (Cash)',
    amount: 185000,
    qty: '5 roll'
  },
  {
    id: 'TRX-20260715-01',
    date: '2026-07-15',
    time: '07:15',
    item: 'Daging Ayam Pejantan',
    description: '35 ekor ayam pejantan untuk ayam goreng lengkuas',
    category: 'Daging & Seafood',
    supplier: 'UD Berkah Daging',
    status: 'Lunas (Transfer)',
    amount: 1225000,
    qty: '35 ekor'
  },
  {
    id: 'TRX-20260712-01',
    date: '2026-07-12',
    time: '09:40',
    item: 'Kecap Manis Bango 5L & Saus Tiram',
    description: 'Bumbu pelengkap nasi tumpeng',
    category: 'Bumbu & Rempah',
    supplier: 'Toko Bumbu Bu Sri',
    status: 'Lunas (Cash)',
    amount: 320000,
    qty: '1 dus'
  },
  {
    id: 'TRX-20260710-02',
    date: '2026-07-10',
    time: '11:20',
    item: 'Tepung Terigu Segitiga & Maizena',
    description: '2 sak terigu @25kg',
    category: 'Bahan Pokok',
    supplier: 'Grosir Beras Jaya Mandiri',
    status: 'Lunas (Transfer)',
    amount: 510000,
    qty: '2 sak'
  },
  {
    id: 'TRX-20260708-01',
    date: '2026-07-08',
    time: '08:50',
    item: 'Tahu Pong & Tempe Daun Super',
    description: 'Bahan bacem & sambal goreng krecek',
    category: 'Bahan Pokok',
    supplier: 'Pasar Tradisional',
    status: 'Lunas (Cash)',
    amount: 195000,
    qty: '4 papan'
  },
  {
    id: 'TRX-20260705-01',
    date: '2026-07-05',
    time: '13:00',
    item: 'Garam Beryodium, Gula Pasir & Cuka',
    description: 'Bahan dasar perasa masakan 1 bulan',
    category: 'Lain-lain',
    supplier: 'Toko Bumbu Bu Sri',
    status: 'Lunas (Cash)',
    amount: 210000,
    qty: '1 karung'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-01',
    name: 'Pasar Tradisional',
    category: 'Daging, Sayur & Bahan Pokok',
    phone: '+62 812-3456-7890',
    address: 'Jl. Merdeka No. 14, Pasar Kranggan Los A-12',
    rating: 4.8,
    totalSpent: 4280000,
    transactionCount: 14
  },
  {
    id: 'SUP-02',
    name: 'UD Berkah Daging',
    category: 'Daging Sapi & Ayam Unggas',
    phone: '+62 813-9876-5432',
    address: 'Kawasan Jagal Halal Blok C4, Sentra Ternak',
    rating: 4.9,
    totalSpent: 6660000,
    transactionCount: 8
  },
  {
    id: 'SUP-03',
    name: 'Toko Bumbu Bu Sri',
    category: 'Bumbu Dapur Basah & Rempah Kering',
    phone: '+62 857-1122-3344',
    address: 'Pasar Induk Kios 42, Jl. Rempah Mas',
    rating: 4.7,
    totalSpent: 1649000,
    transactionCount: 7
  },
  {
    id: 'SUP-04',
    name: 'Grosir Beras Jaya Mandiri',
    category: 'Beras, Tepung & Minyak Nabati',
    phone: '+62 819-5566-7788',
    address: 'Jl. Pergudangan Niaga No. 88',
    rating: 4.8,
    totalSpent: 2295000,
    transactionCount: 5
  },
  {
    id: 'SUP-05',
    name: 'Mitra Plastik Surya',
    category: 'Packaging, Thinwall & Paper Box',
    phone: '+62 821-4433-2211',
    address: 'Komp. Ruko Kemasan Prima No. 19',
    rating: 4.6,
    totalSpent: 1205000,
    transactionCount: 4
  },
  {
    id: 'SUP-06',
    name: 'Agen Telur Berkah',
    category: 'Telur Ayam Ras, Puyuh & Bebek',
    phone: '+62 878-3322-1100',
    address: 'Jl. Peternakan Sejahtera No. 05',
    rating: 4.9,
    totalSpent: 914000,
    transactionCount: 3
  }
];

export const INGREDIENT_BENCHMARKS: IngredientBenchmark[] = [
  {
    id: 'ING-01',
    name: 'Ayam Broiler Utuh',
    category: 'Daging & Seafood',
    currentPrice: 34000,
    previousPrice: 36000,
    unit: 'kg',
    marketTrend: 'down',
    lastUpdated: '09 Okt 2026',
    note: 'Suplai peternak lokal melimpah, harga turun 5.5%'
  },
  {
    id: 'ING-02',
    name: 'Daging Sapi Has Luar (Sirloin Lokal)',
    category: 'Daging & Seafood',
    currentPrice: 125000,
    previousPrice: 122000,
    unit: 'kg',
    marketTrend: 'up',
    lastUpdated: '09 Okt 2026',
    note: 'Permintaan pesta pernikahan meningkat di akhir pekan'
  },
  {
    id: 'ING-03',
    name: 'Beras Ramos Premium',
    category: 'Bahan Pokok',
    currentPrice: 14500,
    previousPrice: 14500,
    unit: 'kg',
    marketTrend: 'stable',
    lastUpdated: '08 Okt 2026',
    note: 'Harga stabil pasca panen raya Jawa Tengah'
  },
  {
    id: 'ING-04',
    name: 'Cabai Rawit Merah (Kencana)',
    category: 'Bumbu & Rempah',
    currentPrice: 42000,
    previousPrice: 48000,
    unit: 'kg',
    marketTrend: 'down',
    lastUpdated: '09 Okt 2026',
    note: 'Cuaca stabil, petikan cabai pasar induk optimal'
  },
  {
    id: 'ING-05',
    name: 'Bawang Merah Brebes Super',
    category: 'Bumbu & Rempah',
    currentPrice: 32000,
    previousPrice: 29000,
    unit: 'kg',
    marketTrend: 'up',
    lastUpdated: '07 Okt 2026',
    note: 'Stok gudang distributor mulai menipis'
  },
  {
    id: 'ING-06',
    name: 'Telur Ayam Ras Fresh',
    category: 'Susu & Telur',
    currentPrice: 27000,
    previousPrice: 27000,
    unit: 'kg',
    marketTrend: 'stable',
    lastUpdated: '09 Okt 2026',
    note: 'Stabilitas pakan jagung menjaga harga pangkalan'
  },
  {
    id: 'ING-07',
    name: 'Minyak Goreng Sawit Kemasan',
    category: 'Minyak & Gas',
    currentPrice: 16500,
    previousPrice: 16500,
    unit: 'liter',
    marketTrend: 'stable',
    lastUpdated: '08 Okt 2026',
    note: 'DMO minyakita & merk komersial terkendali'
  },
  {
    id: 'ING-08',
    name: 'Thinwall Bento 4 Sekat 1000ml',
    category: 'Packaging',
    currentPrice: 1850,
    previousPrice: 1900,
    unit: 'pcs',
    marketTrend: 'down',
    lastUpdated: '06 Okt 2026',
    note: 'Diskon pembelian partai > 500 pcs dari supplier surya'
  }
];

// Daily distribution over 30 days (1 Sep - 30 Sep 2026)
// Total matches exactly Rp 1.627.000 with a prominent spike on 22 Sep (Rp 1.119.000)
export const DAILY_TREND_DATA = [
  { day: '01 Sep', date: '2026-09-01', amount: 0, items: 0 },
  { day: '02 Sep', date: '2026-09-02', amount: 0, items: 0 },
  { day: '03 Sep', date: '2026-09-03', amount: 0, items: 0 },
  { day: '04 Sep', date: '2026-09-04', amount: 0, items: 0 },
  { day: '05 Sep', date: '2026-09-05', amount: 0, items: 0 },
  { day: '06 Sep', date: '2026-09-06', amount: 0, items: 0 },
  { day: '07 Sep', date: '2026-09-07', amount: 0, items: 0 },
  { day: '08 Sep', date: '2026-09-08', amount: 65000, items: 1, note: 'Sayuran segar & buah' },
  { day: '09 Sep', date: '2026-09-09', amount: 0, items: 0 },
  { day: '10 Sep', date: '2026-09-10', amount: 0, items: 0 },
  { day: '11 Sep', date: '2026-09-11', amount: 0, items: 0 },
  { day: '12 Sep', date: '2026-09-12', amount: 95000, items: 1, note: 'Kotak bento thinwall' },
  { day: '13 Sep', date: '2026-09-13', amount: 0, items: 0 },
  { day: '14 Sep', date: '2026-09-14', amount: 0, items: 0 },
  { day: '15 Sep', date: '2026-09-15', amount: 150000, items: 1, note: 'Bumbu dapur & rempah' },
  { day: '16 Sep', date: '2026-09-16', amount: 0, items: 0 },
  { day: '17 Sep', date: '2026-09-17', amount: 0, items: 0 },
  { day: '18 Sep', date: '2026-09-18', amount: 120000, items: 1, note: 'Beras & minyak' },
  { day: '19 Sep', date: '2026-09-19', amount: 0, items: 0 },
  { day: '20 Sep', date: '2026-09-20', amount: 0, items: 0 },
  { day: '21 Sep', date: '2026-09-21', amount: 0, items: 0 },
  { day: '22 Sep', date: '2026-09-22', amount: 1119000, items: 2, note: 'Lonjakan pesanan buffet wedding (Daging & Telur/Beras)', isPeak: true },
  { day: '23 Sep', date: '2026-09-23', amount: 50000, items: 1, note: 'Sapi tetelan sup' },
  { day: '24 Sep', date: '2026-09-24', amount: 0, items: 0 },
  { day: '25 Sep', date: '2026-09-25', amount: 28000, items: 1, note: 'Ayam potong segar' },
  { day: '26 Sep', date: '2026-09-26', amount: 0, items: 0 },
  { day: '27 Sep', date: '2026-09-27', amount: 0, items: 0 },
  { day: '28 Sep', date: '2026-09-28', amount: 0, items: 0 },
  { day: '29 Sep', date: '2026-09-29', amount: 0, items: 0 },
  { day: '30 Sep', date: '2026-09-30', amount: 0, items: 0 },
];

// 8 Categories composition matching prompt:
// Daging & Seafood 44%, Bahan Pokok 37%, Bumbu & Rempah 5%, Packaging 4%, Susu & Telur 4%,
// Sayuran & Buah 3%, Minyak & Gas 2%, Lain-lain 1% = 100%
export const CATEGORY_COMPOSITION = [
  { name: 'Daging & Seafood', percentage: 44, value: 715880, color: '#ef4444', icon: 'Beef' },
  { name: 'Bahan Pokok', percentage: 37, value: 601990, color: '#f59e0b', icon: 'Wheat' },
  { name: 'Bumbu & Rempah', percentage: 5, value: 81350, color: '#10b981', icon: 'Flame' },
  { name: 'Packaging', percentage: 4, value: 65080, color: '#3b82f6', icon: 'Package' },
  { name: 'Susu & Telur', percentage: 4, value: 65080, color: '#8b5cf6', icon: 'Egg' },
  { name: 'Sayuran & Buah', percentage: 3, value: 48810, color: '#14b8a6', icon: 'Apple' },
  { name: 'Minyak & Gas', percentage: 2, value: 32540, color: '#f97316', icon: 'Fuel' },
  { name: 'Lain-lain', percentage: 1, value: 16270, color: '#64748b', icon: 'MoreHorizontal' },
];

export const SPARKLINE_DATA_7_DAYS = [
  { val: 120 }, { val: 80 }, { val: 40 }, { val: 10 }, { val: 0 }, { val: 0 }, { val: 0 }
];

export const SPARKLINE_DATA_30_DAYS = [
  { val: 0 }, { val: 65 }, { val: 0 }, { val: 95 }, { val: 150 }, { val: 120 }, { val: 1119 }, { val: 50 }, { val: 28 }, { val: 0 }
];

export const SPARKLINE_DATA_TOTAL = [
  { val: 450 }, { val: 780 }, { val: 1200 }, { val: 950 }, { val: 1400 }, { val: 1627 }, { val: 1800 }, { val: 2100 }
];
