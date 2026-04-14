export interface Country {
  id: string;
  name: string;
  currencyName: string;
  currencyCode: string;
  exchangeRateToUSD: number;
  status: 'healthy' | 'warning' | 'critical';
  cashOnHand: number;
  outstandingDebt: number;
  margin: number;
}

export const countries: Country[] = [
  { id: 'bw', name: 'Botswana', currencyName: 'Pula', currencyCode: 'BWP', exchangeRateToUSD: 13.5, status: 'healthy', cashOnHand: 245000, outstandingDebt: 32000, margin: 28 },
  { id: 'gh', name: 'Ghana', currencyName: 'Cedi', currencyCode: 'GHS', exchangeRateToUSD: 15.2, status: 'warning', cashOnHand: 180000, outstandingDebt: 95000, margin: 18 },
  { id: 'ke', name: 'Kenya', currencyName: 'Shilling', currencyCode: 'KES', exchangeRateToUSD: 153.0, status: 'healthy', cashOnHand: 4200000, outstandingDebt: 680000, margin: 26 },
  { id: 'mw', name: 'Malawi', currencyName: 'Kwacha', currencyCode: 'MWK', exchangeRateToUSD: 1720.0, status: 'critical', cashOnHand: 8500000, outstandingDebt: 12000000, margin: 10 },
  { id: 'na', name: 'Namibia', currencyName: 'Dollar', currencyCode: 'NAD', exchangeRateToUSD: 18.3, status: 'healthy', cashOnHand: 320000, outstandingDebt: 45000, margin: 30 },
  { id: 'rw', name: 'Rwanda', currencyName: 'Franc', currencyCode: 'RWF', exchangeRateToUSD: 1350.0, status: 'healthy', cashOnHand: 52000000, outstandingDebt: 8200000, margin: 24 },
  { id: 'tz', name: 'Tanzania', currencyName: 'Shilling', currencyCode: 'TZS', exchangeRateToUSD: 2550.0, status: 'warning', cashOnHand: 78000000, outstandingDebt: 45000000, margin: 15 },
  { id: 'ug', name: 'Uganda', currencyName: 'Shilling', currencyCode: 'UGX', exchangeRateToUSD: 3780.0, status: 'healthy', cashOnHand: 125000000, outstandingDebt: 18000000, margin: 22 },
  { id: 'zm', name: 'Zambia', currencyName: 'Kwacha', currencyCode: 'ZMW', exchangeRateToUSD: 27.5, status: 'warning', cashOnHand: 520000, outstandingDebt: 310000, margin: 14 },
];

export interface ApprovalItem {
  id: string;
  type: 'logistics' | 'loan';
  title: string;
  country: string;
  amount: string;
  margin?: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export const pendingApprovals: ApprovalItem[] = [
  { id: '1', type: 'logistics', title: 'Electronics Shipment - Batch #4521', country: 'Kenya', amount: 'KES 2,340,000', margin: 26, status: 'pending', date: '2026-03-28' },
  { id: '2', type: 'logistics', title: 'Textiles Import - Batch #4522', country: 'Ghana', amount: 'GHS 185,000', margin: 11, status: 'pending', date: '2026-03-29' },
  { id: '3', type: 'loan', title: 'Emergency Clearing Fee', country: 'Zambia → Ghana', amount: 'USD 12,500', status: 'pending', date: '2026-03-30' },
  { id: '4', type: 'logistics', title: 'Auto Parts - Batch #4523', country: 'Tanzania', amount: 'TZS 45,200,000', margin: 22, status: 'pending', date: '2026-03-31' },
];

export function formatCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function getMarginColor(margin: number, threshold = 12): 'success' | 'warning' | 'danger' {
  if (margin >= 20) return 'success';
  if (margin >= threshold) return 'warning';
  return 'danger';
}
