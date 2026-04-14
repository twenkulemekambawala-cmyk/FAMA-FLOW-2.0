import { Users, ArrowLeftRight, Receipt, AlertTriangle, Package, TrendingUp, DollarSign, Plus, Calendar, Building2, Home, Download, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const MOCK_EXPENSE_LOG = [
  { date: "2026-03-31", desc: "Warehouse Rent", branch: "Kenya", amount: "KES 45,000", receipt: true },
  { date: "2026-03-30", desc: "Fuel - Delivery", branch: "Ghana", amount: "GHS 1,200", receipt: true },
  { date: "2026-03-29", desc: "Staff Salary", branch: "Uganda", amount: "UGX 3,200,000", receipt: false },
] as const;

function financeSalePaymentClass(paymentStructure: string) {
  if (paymentStructure === "Full Payment") return "bg-success/10 text-success border border-success/20";
  if (paymentStructure === "Partial Credit") return "bg-warning/10 text-warning border border-warning/20";
  return "bg-primary/10 text-primary border border-primary/20";
}

export function FinanceTab() {
  const [debtTab, setDebtTab] = useState<'list' | 'add'>('list');
  const [fundingType, setFundingType] = useState<'branch' | 'headoffice'>('branch');
  const [showInventoryTable, setShowInventoryTable] = useState(false);
  const [showSalesTable, setShowSalesTable] = useState(false);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([
    { name: 'Smartphones - Model A', description: 'Android smartphones, 6.5 inch display', quantity: 15000, unitCost: 120, sellingPrice: 180 },
    { name: 'Laptops - Business Series', description: 'Core i5, 8GB RAM, 256GB SSD', quantity: 8500, unitCost: 450, sellingPrice: 650 },
    { name: 'Tablets - Educational', description: '10 inch tablets, pre-loaded educational content', quantity: 12000, unitCost: 80, sellingPrice: 120 },
    { name: 'Smart Watches', description: 'Fitness tracking, heart rate monitor', quantity: 6200, unitCost: 35, sellingPrice: 55 },
    { name: 'Wireless Earbuds', description: 'Bluetooth 5.0, noise cancellation', quantity: 8300, unitCost: 25, sellingPrice: 40 },
    { name: 'Desktop Computers', description: 'All-in-one systems, 24 inch monitor', quantity: 3500, unitCost: 380, sellingPrice: 520 },
    { name: 'Monitors - 4K', description: '27 inch 4K UHD displays', quantity: 4800, unitCost: 180, sellingPrice: 250 },
    { name: 'Keyboards - Mechanical', description: 'RGB backlit, wireless', quantity: 7200, unitCost: 45, sellingPrice: 65 },
    { name: 'Mouse - Gaming', description: 'High precision, programmable', quantity: 9100, unitCost: 30, sellingPrice: 45 },
    { name: 'Webcams - HD', description: '1080p, auto-focus', quantity: 5400, unitCost: 40, sellingPrice: 60 },
    { name: 'Cables - USB-C', description: 'Various lengths, fast charging', quantity: 18900, unitCost: 8, sellingPrice: 12 },
    { name: 'Power Banks', description: '20,000mAh, fast charging', quantity: 11300, unitCost: 22, sellingPrice: 35 },
  ]);
  const [newInventory, setNewInventory] = useState({
    name: '',
    description: '',
    quantity: '',
    unitCost: '',
    sellingPrice: ''
  });
  const [stockSold, setStockSold] = useState({
    itemId: '',
    quantity: '',
    paymentType: 'full'
  });
  const [showPaymentPlan, setShowPaymentPlan] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState({
    downPayment: '',
    installmentAmount: '',
    installmentCount: '',
    paymentFrequency: 'monthly',
    firstPaymentDate: ''
  });
  const [salesHistory, setSalesHistory] = useState([
    { itemName: 'Smartphones - Model A', quantity: 50, unitPrice: 180, paymentStructure: 'Full Payment', date: '2026-04-12' },
    { itemName: 'Laptops - Business Series', quantity: 25, unitPrice: 650, paymentStructure: 'Partial Credit', date: '2026-04-12' },
    { itemName: 'Tablets - Educational', quantity: 100, unitPrice: 120, paymentStructure: 'Credit - 6 monthly', date: '2026-04-11' },
    { itemName: 'Wireless Earbuds', quantity: 200, unitPrice: 40, paymentStructure: 'Full Payment', date: '2026-04-12' },
    { itemName: 'Power Banks', quantity: 75, unitPrice: 35, paymentStructure: 'Credit - 3 monthly', date: '2026-04-11' },
  ]);
  const [customerDebts, setCustomerDebts] = useState([
    { 
      customerName: 'John Doe', 
      customerPhone: '+254712345678',
      customerEmail: 'john.doe@example.com',
      customerCity: 'Nairobi',
      customerCountry: 'kenya',
      itemName: 'Laptops - Business Series', 
      quantity: 25, 
      unitPrice: 650, 
      totalAmount: 16250,
      paymentStructure: 'Partial Credit',
      paymentType: 'partial',
      invoiceNumber: 'INV-20260412-001',
      amountPaid: 8125,
      outstandingDebt: 8125,
      date: '2026-04-12',
      dueDate: '2026-05-12',
      status: 'active'
    },
    { 
      customerName: 'Jane Smith', 
      customerPhone: '+254723456789',
      customerEmail: 'jane.smith@example.com',
      customerCity: 'Mombasa',
      customerCountry: 'kenya',
      itemName: 'Tablets - Educational', 
      quantity: 100, 
      unitPrice: 120, 
      totalAmount: 12000,
      paymentStructure: 'Credit - 6 monthly',
      paymentType: 'credit',
      invoiceNumber: 'INV-20260411-002',
      amountPaid: 2000,
      outstandingDebt: 10000,
      date: '2026-04-11',
      dueDate: '2026-10-11',
      status: 'active'
    },
    { 
      customerName: 'Michael Johnson', 
      customerPhone: '+254734567890',
      customerEmail: 'michael.johnson@example.com',
      customerCity: 'Kisumu',
      customerCountry: 'kenya',
      itemName: 'Power Banks', 
      quantity: 75, 
      unitPrice: 35, 
      totalAmount: 2625,
      paymentStructure: 'Credit - 3 monthly',
      paymentType: 'credit',
      invoiceNumber: 'INV-20260411-003',
      amountPaid: 875,
      outstandingDebt: 1750,
      date: '2026-04-11',
      dueDate: '2026-07-11',
      status: 'active'
    }
  ]);
  const [newDebt, setNewDebt] = useState({
    customerName: '',
    amount: '',
    totalAmount: '',
    installments: '1',
    installmentPeriod: 'months',
    installmentCount: '1',
    firstDueDate: '',
    currency: 'KES'
  });

  const [showCustomerDebtTracker, setShowCustomerDebtTracker] = useState(false);
  const [showExpenseLog, setShowExpenseLog] = useState(false);

  const handleAddDebt = () => {
    // Handle debt addition logic here
    console.log('Adding debt:', newDebt);
    // Reset form
    setNewDebt({
      customerName: '',
      amount: '',
      totalAmount: '',
      installments: '1',
      installmentPeriod: 'months',
      installmentCount: '1',
      firstDueDate: '',
      currency: 'KES'
    });
    setDebtTab('list');
  };

  const handleAddInventory = () => {
    if (newInventory.name && newInventory.description && newInventory.quantity && newInventory.unitCost && newInventory.sellingPrice) {
      setInventoryItems([...inventoryItems, {
        name: newInventory.name,
        description: newInventory.description,
        quantity: parseInt(newInventory.quantity),
        unitCost: parseFloat(newInventory.unitCost),
        sellingPrice: parseFloat(newInventory.sellingPrice)
      }]);
      setNewInventory({ name: '', description: '', quantity: '', unitCost: '', sellingPrice: '' });
      setShowAddInventory(false);
    }
  };

  const handleStockSold = () => {
    if (stockSold.itemId && stockSold.quantity) {
      const itemIndex = parseInt(stockSold.itemId);
      const soldQuantity = parseInt(stockSold.quantity);
      const availableQuantity = inventoryItems[itemIndex].quantity;
      
      // Validate quantity
      if (soldQuantity <= 0) {
        return; // Silently ignore invalid quantities
      }
      
      if (soldQuantity > availableQuantity) {
        return; // Silently ignore insufficient stock
      }
      
      // Prevent reducing to zero - must keep at least 1 unit
      if (availableQuantity - soldQuantity <= 0) {
        return; // Silently ignore attempts to reduce to zero
      }
      
      // If credit sale, show payment plan modal first
      if (stockSold.paymentType === 'credit') {
        setShowPaymentPlan(true);
        return; // Don't update inventory yet, wait for payment plan completion
      }
      
      // Update inventory quantity for non-credit sales
      const updatedItems = [...inventoryItems];
      updatedItems[itemIndex].quantity -= soldQuantity;
      setInventoryItems(updatedItems);
      
      // Reset form
      setStockSold({ itemId: '', quantity: '', paymentType: 'full' });
      
      // Add to sales history for non-credit sales
      const itemName = inventoryItems[itemIndex].name;
      let paymentStructure = 'Full Payment';
      if (stockSold.paymentType === 'partial') {
        paymentStructure = 'Partial Credit';
        console.log('Partial credit sale - would add partial amount to customer debt');
      }
      
      setSalesHistory([...salesHistory, {
        itemName,
        quantity: soldQuantity,
        unitPrice: inventoryItems[itemIndex].sellingPrice,
        paymentStructure,
        date: new Date().toISOString().split('T')[0]
      }]);
    }
  };

  const addCustomerDebt = (saleData) => {
    const newDebt = {
      customerName: saleData.customerName || 'Unknown Customer',
      customerPhone: saleData.customerPhone || '+254 XXX XXX XXX',
      customerEmail: saleData.customerEmail || 'unknown@example.com',
      customerCity: saleData.customerCity || 'Unknown',
      customerCountry: saleData.customerCountry || 'kenya',
      itemName: saleData.itemName,
      quantity: saleData.quantity,
      unitPrice: saleData.unitPrice,
      totalAmount: saleData.quantity * saleData.unitPrice,
      paymentStructure: saleData.paymentStructure,
      paymentType: saleData.paymentType || 'credit',
      invoiceNumber: saleData.invoiceNumber || `INV-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
      amountPaid: 0,
      outstandingDebt: saleData.quantity * saleData.unitPrice,
      date: saleData.date,
      dueDate: calculateDueDate(saleData.paymentStructure, saleData.date),
      status: 'active'
    };
    
    setCustomerDebts([...customerDebts, newDebt]);
  };

  const calculateDueDate = (paymentStructure, saleDate) => {
    const date = new Date(saleDate);
    
    if (paymentStructure === 'Partial Credit') {
      date.setMonth(date.getMonth() + 1);
    } else if (paymentStructure.includes('monthly')) {
      const months = parseInt(paymentStructure.match(/\d+/)?.[0] || 3);
      date.setMonth(date.getMonth() + months);
    }
    
    return date.toISOString().split('T')[0];
  };

  const handlePaymentPlanComplete = () => {
    // Update inventory quantity now that payment plan is set
    const itemIndex = parseInt(stockSold.itemId);
    const soldQuantity = parseInt(stockSold.quantity);
    const itemName = inventoryItems[itemIndex].name;
    
    const updatedItems = [...inventoryItems];
    updatedItems[itemIndex].quantity -= soldQuantity;
    setInventoryItems(updatedItems);
    
    // Add to sales history
    let paymentStructure = 'Full Payment';
    if (stockSold.paymentType === 'credit') {
      paymentStructure = `Credit - ${paymentPlan.installmentCount} ${paymentPlan.paymentFrequency}`;
    } else if (stockSold.paymentType === 'partial') {
      paymentStructure = 'Partial Credit';
    }
    
    const saleData = {
      itemName,
      quantity: soldQuantity,
      unitPrice: inventoryItems[itemIndex].sellingPrice,
      paymentStructure,
      date: new Date().toISOString().split('T')[0]
    };
    
    setSalesHistory([...salesHistory, saleData]);
    
    // Add to customer debt tracker if credit purchase
    if (stockSold.paymentType === 'credit' || stockSold.paymentType === 'partial') {
      addCustomerDebt(saleData);
    }
    
    // Reset forms
    setStockSold({ itemId: '', quantity: '', paymentType: 'full' });
    setPaymentPlan({
      downPayment: '',
      installmentAmount: '',
      installmentCount: '',
      paymentFrequency: 'monthly',
      firstPaymentDate: ''
    });
    setShowPaymentPlan(false);
    
    console.log('Credit sale completed with payment plan:', paymentPlan);
  };

  const downloadInventoryExcel = () => {
    // Create CSV content (Excel-compatible)
    const headers = ['Item Name', 'Description', 'Quantity', 'Unit Cost', 'Selling Price', 'Total Value'];
    const csvContent = [
      headers.join(','),
      ...inventoryItems.map(item => 
        `"${item.name}","${item.description}",${item.quantity},${item.unitCost},${item.sellingPrice},${item.quantity * item.sellingPrice}`
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const customerDebtTotalSummaryAmount = customerDebts.reduce(
    (sum, debt) => sum + debt.totalAmount,
    0
  );

  return (
    <div className="space-y-4 sm:space-y-6 pb-[env(safe-area-inset-bottom)]">
      {/* Sales & Inventory Summary */}
      <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold">Sales & Inventory Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <button 
            type="button"
            onClick={() => setShowInventoryTable(!showInventoryTable)}
            className="text-center min-h-[4.75rem] p-4 rounded-lg bg-muted/50 active:bg-muted sm:hover:bg-muted transition-colors touch-manipulation sm:cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Inventory</span>
            </div>
            <p className="text-2xl font-bold">50,000</p>
            <p className="text-xs text-muted-foreground">units to dispatch</p>
          </button>
          
          <div className="text-center min-h-[4.75rem] p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted-foreground">Remaining</span>
            </div>
            <p className="text-2xl font-bold">49,150</p>
            <p className="text-xs text-muted-foreground">units in stock</p>
          </div>
          
          <button 
            type="button"
            onClick={() => setShowCustomerDebtTracker(!showCustomerDebtTracker)}
            className="text-center min-h-[4.75rem] w-full p-4 rounded-lg bg-muted/50 active:bg-muted sm:hover:bg-muted transition-colors touch-manipulation sm:cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Receipt className="h-4 w-4 text-danger" />
              <span className="text-xs text-muted-foreground">Customer Debt</span>
            </div>
            <p className="text-2xl font-bold text-danger">KES {customerDebtTotalSummaryAmount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{customerDebts.length} active debts</p>
          </button>

          <button
            type="button"
            onClick={() => setShowExpenseLog(!showExpenseLog)}
            className="text-center min-h-[4.75rem] w-full p-4 rounded-lg bg-muted/50 active:bg-muted sm:hover:bg-muted transition-colors touch-manipulation sm:cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Expense Log</span>
            </div>
            <p className="text-2xl font-bold">{MOCK_EXPENSE_LOG.length}</p>
            <p className="text-xs text-muted-foreground">recent entries</p>
          </button>
        </div>
        
        {/* Inventory Table */}
        {showInventoryTable && (
          <div className="mt-4 sm:mt-6 rounded-lg border bg-card p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <h4 className="font-display font-semibold">Inventory Details</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => setShowAddInventory(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Item
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={downloadInventoryExcel}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download Excel
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowInventoryTable(false)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="space-y-3 md:hidden">
              {inventoryItems.map((item, i) => (
                <div key={i} className="rounded-lg border bg-muted/20 p-4 space-y-3">
                  <div>
                    <p className="font-medium text-sm leading-snug">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{item.description}</p>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs border-t pt-3">
                    <div className="flex flex-col">
                      <dt className="text-muted-foreground">Quantity</dt>
                      <dd className="font-semibold tabular-nums">{item.quantity.toLocaleString()}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-muted-foreground">Unit cost</dt>
                      <dd className="font-medium tabular-nums">${item.unitCost.toFixed(2)}</dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-muted-foreground">Selling</dt>
                      <dd className="font-medium tabular-nums">${item.sellingPrice.toFixed(2)}</dd>
                    </div>
                    <div className="flex flex-col col-span-2">
                      <dt className="text-muted-foreground">Total value</dt>
                      <dd className="font-semibold text-primary tabular-nums">${(item.quantity * item.sellingPrice).toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              ))}
              <div className="rounded-lg border-2 border-primary bg-muted/30 p-4 space-y-2 text-sm">
                <p className="font-semibold">Totals</p>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Inventory cost</span>
                  <span className="font-bold tabular-nums">${inventoryItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Selling value</span>
                  <span className="font-bold tabular-nums">${inventoryItems.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-2 border-t pt-2 font-bold text-primary">
                  <span>Total value</span>
                  <span className="tabular-nums">${inventoryItems.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block overflow-x-auto touch-scroll-x">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Item Name</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Description</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Quantity</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Unit Cost</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Selling Price</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{item.description}</td>
                      <td className="py-3 px-4 text-right font-semibold">{item.quantity.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">${item.unitCost.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">${item.sellingPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-primary">
                        ${(item.quantity * item.sellingPrice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary">
                    <td colSpan={3} className="py-3 px-4 font-semibold">Total</td>
                    <td className="py-3 px-4 text-right font-bold">
                      ${inventoryItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      ${inventoryItems.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-primary">
                      ${inventoryItems.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sales Table */}
        {showSalesTable && (
          <div className="mt-4 sm:mt-6 rounded-lg border bg-card p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <h4 className="font-display font-semibold">Sales</h4>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto min-h-10 touch-manipulation"
                onClick={() => setShowSalesTable(false)}
              >
                Close
              </Button>
            </div>
            <div className="space-y-3 md:hidden">
              {salesHistory.map((sale, i) => (
                <div key={i} className="rounded-lg border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{sale.date}</p>
                      <p className="font-medium text-sm leading-snug mt-0.5">{sale.itemName}</p>
                    </div>
                    <span className={`shrink-0 inline-flex px-2 py-1 text-xs rounded-full ${financeSalePaymentClass(sale.paymentStructure)}`}>
                      {sale.paymentStructure}
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 text-xs border-t pt-3">
                    <div>
                      <dt className="text-muted-foreground">Qty</dt>
                      <dd className="font-semibold tabular-nums">{sale.quantity}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Unit price</dt>
                      <dd className="font-medium tabular-nums">${sale.unitPrice.toFixed(2)}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-muted-foreground">Revenue</dt>
                      <dd className="font-semibold text-primary tabular-nums">${(sale.quantity * sale.unitPrice).toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              ))}
              <div className="rounded-lg border-2 border-primary bg-muted/30 p-4 space-y-2 text-sm">
                <p className="font-semibold">Totals</p>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Units sold</span>
                  <span className="font-bold tabular-nums text-primary">{salesHistory.reduce((sum, sale) => sum + sale.quantity, 0)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Avg unit price</span>
                  <span className="font-bold tabular-nums">
                    ${salesHistory.length > 0 ? (salesHistory.reduce((sum, sale) => sum + sale.unitPrice, 0) / salesHistory.length).toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between gap-2 border-t pt-2 font-bold text-primary">
                  <span>Revenue</span>
                  <span className="tabular-nums">${salesHistory.reduce((sum, sale) => sum + (sale.quantity * sale.unitPrice), 0).toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">{salesHistory.length} transactions</p>
              </div>
            </div>
            <div className="hidden md:block overflow-x-auto touch-scroll-x">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Item Name</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Quantity</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Unit Price</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Total Revenue</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Payment Structure</th>
                  </tr>
                </thead>
                <tbody>
                  {salesHistory.map((sale, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-muted-foreground">{sale.date}</td>
                      <td className="py-3 px-4 font-medium">{sale.itemName}</td>
                      <td className="py-3 px-4 text-right font-semibold">{sale.quantity}</td>
                      <td className="py-3 px-4 text-right">${sale.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-primary">
                        ${(sale.quantity * sale.unitPrice).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${financeSalePaymentClass(sale.paymentStructure)}`}>
                          {sale.paymentStructure}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary">
                    <td colSpan={2} className="py-3 px-4 font-semibold">Totals</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">
                      {salesHistory.reduce((sum, sale) => sum + sale.quantity, 0)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      ${salesHistory.length > 0 ? 
                        (salesHistory.reduce((sum, sale) => sum + sale.unitPrice, 0) / salesHistory.length).toFixed(2) : 
                        '0.00'
                      }
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-primary">
                      ${salesHistory.reduce((sum, sale) => sum + (sale.quantity * sale.unitPrice), 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {salesHistory.length} transactions
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customer Debt Tracker */}
        {showCustomerDebtTracker && (
          <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
              <h3 className="font-display font-semibold leading-tight">Customer Debt Tracker</h3>
            </div>
            <div className="flex flex-col gap-0.5 text-sm text-muted-foreground sm:items-end sm:text-right">
              <span>Total Outstanding Debt:</span>
              <span className="text-lg font-bold text-warning">
                KES {customerDebts.reduce((sum, debt) => sum + debt.outstandingDebt, 0).toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="space-y-3 md:hidden">
            {customerDebts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8 px-2">
                No customer debts recorded. Debts will appear here when invoices are approved with credit purchases.
              </p>
            ) : (
              <>
                {customerDebts.map((debt, i) => (
                  <div key={i} className="rounded-lg border bg-muted/20 p-4 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium leading-snug">{debt.customerName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{debt.customerCity}, {debt.customerCountry}</p>
                      </div>
                      <span className={`shrink-0 inline-flex px-2 py-1 text-xs rounded-full ${
                        debt.status === "active"
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-green-100 text-green-700 border border-green-200"
                      }`}>
                        {debt.status === "active" ? "Outstanding" : "Paid"}
                      </span>
                    </div>
                    <div className="text-xs space-y-1 border-t pt-3">
                      <p className="text-muted-foreground">{debt.customerPhone}</p>
                      <p className="text-muted-foreground break-all">{debt.customerEmail}</p>
                    </div>
                    <div className="text-sm border-t pt-3 space-y-1">
                      <p className="font-medium">{debt.itemName}</p>
                      <p className="text-xs text-muted-foreground">Qty {debt.quantity} · {debt.invoiceNumber}</p>
                    </div>
                    <dl className="grid grid-cols-2 gap-2 text-xs border-t pt-3">
                      <div>
                        <dt className="text-muted-foreground">Total</dt>
                        <dd className="font-semibold tabular-nums">KES {debt.totalAmount.toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Paid</dt>
                        <dd className="tabular-nums">KES {debt.amountPaid.toLocaleString()}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-muted-foreground">Outstanding</dt>
                        <dd className="font-semibold text-warning tabular-nums">KES {debt.outstandingDebt.toLocaleString()}</dd>
                      </div>
                      <div className="col-span-2 flex flex-wrap items-center justify-between gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          debt.paymentType === "credit"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-orange-100 text-orange-700 border border-orange-200"
                        }`}>
                          {debt.paymentType === "credit" ? "Full Credit" : "Partial Credit"}
                        </span>
                        <span className="text-muted-foreground">Due {debt.dueDate}</span>
                      </div>
                    </dl>
                  </div>
                ))}
                <div className="rounded-lg border-2 border-warning bg-muted/30 p-4 space-y-2 text-sm">
                  <p className="font-semibold">Total summary</p>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Invoice total</span>
                    <span className="font-bold tabular-nums">KES {customerDebtTotalSummaryAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-bold tabular-nums">KES {customerDebts.reduce((sum, debt) => sum + debt.amountPaid, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between gap-2 font-bold text-warning border-t pt-2">
                    <span>Outstanding</span>
                    <span className="tabular-nums">KES {customerDebts.reduce((sum, debt) => sum + debt.outstandingDebt, 0).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{customerDebts.length} active debts</p>
                </div>
              </>
            )}
          </div>
          <div className="hidden md:block overflow-x-auto touch-scroll-x">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Customer Information</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Contact Details</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Invoice Details</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Total Amount</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Paid Amount</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Outstanding Debt</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Payment Type</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Due Date</th>
                  <th className="text-center py-3 px-4 text-xs text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {customerDebts.map((debt, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{debt.customerName}</p>
                        <p className="text-xs text-muted-foreground">{debt.customerCity}, {debt.customerCountry}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-muted-foreground">{debt.customerPhone}</p>
                        <p className="text-xs text-muted-foreground">{debt.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-sm">{debt.itemName}</p>
                        <p className="text-xs text-muted-foreground">Qty: {debt.quantity}</p>
                        <p className="text-xs text-muted-foreground">Inv: {debt.invoiceNumber}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      KES {debt.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      KES {debt.amountPaid.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-warning">
                      KES {debt.outstandingDebt.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        debt.paymentType === 'credit' 
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-orange-100 text-orange-700 border border-orange-200'
                      }`}>
                        {debt.paymentType === 'credit' ? 'Full Credit' : 'Partial Credit'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {debt.dueDate}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        debt.status === 'active' 
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {debt.status === 'active' ? 'Outstanding' : 'Paid'}
                      </span>
                    </td>
                  </tr>
                ))}
                {customerDebts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-muted-foreground">
                      No customer debts recorded. Debts will appear here when invoices are approved with credit purchases.
                    </td>
                  </tr>
                )}
                {customerDebts.length > 0 && (
                  <tr className="border-t-2 border-warning bg-muted/50">
                    <td colSpan={3} className="py-3 px-4 font-semibold">Total Summary</td>
                    <td className="py-3 px-4 text-right font-bold">
                      KES {customerDebtTotalSummaryAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      KES {customerDebts.reduce((sum, debt) => sum + debt.amountPaid, 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-warning">
                      KES {customerDebts.reduce((sum, debt) => sum + debt.outstandingDebt, 0).toLocaleString()}
                    </td>
                    <td colSpan={3} className="py-3 px-4 text-muted-foreground text-sm">
                      {customerDebts.length} active debts
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {showExpenseLog && (
          <div className="mt-4 sm:mt-6 rounded-lg border bg-card p-4 sm:p-6 space-y-4 w-full min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Receipt className="h-5 w-5 text-primary shrink-0" />
                <h4 className="font-display font-semibold">Expense Log</h4>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button size="sm" className="w-full min-h-10 sm:w-auto touch-manipulation">
                  + Add Expense
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full min-h-10 sm:w-auto touch-manipulation"
                  onClick={() => setShowExpenseLog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="space-y-3 md:hidden">
              {MOCK_EXPENSE_LOG.map((exp, i) => (
                <div key={i} className="rounded-lg border bg-muted/20 p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">{exp.date}</p>
                      <p className="font-medium text-sm mt-0.5">{exp.desc}</p>
                    </div>
                    {exp.receipt ? (
                      <span className="text-xs text-success shrink-0">Uploaded</span>
                    ) : (
                      <span className="text-xs text-muted-foreground shrink-0">No receipt</span>
                    )}
                  </div>
                  <div className="flex justify-between gap-2 text-sm border-t pt-2">
                    <span className="text-muted-foreground">{exp.branch}</span>
                    <span className="font-semibold tabular-nums">{exp.amount}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto touch-scroll-x">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Description</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Branch</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_EXPENSE_LOG.map((exp, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-3">{exp.date}</td>
                      <td className="py-3 font-medium">{exp.desc}</td>
                      <td className="py-3">{exp.branch}</td>
                      <td className="py-3">{exp.amount}</td>
                      <td className="py-3">
                        {exp.receipt ? (
                          <span className="text-xs text-success">Uploaded</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Inventory Modal */}
        {showAddInventory && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
            <div className="w-full max-h-[min(92dvh,92vh)] overflow-y-auto rounded-t-2xl border bg-card p-4 shadow-lg sm:max-h-[90vh] sm:max-w-md sm:rounded-lg sm:p-6 sm:mx-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-semibold">Add Inventory Item</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAddInventory(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Item Name</label>
                  <Input
                    placeholder="Enter item name"
                    value={newInventory.name}
                    onChange={(e) => setNewInventory({...newInventory, name: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Description</label>
                  <Input
                    placeholder="Enter item description"
                    value={newInventory.description}
                    onChange={(e) => setNewInventory({...newInventory, description: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Quantity</label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={newInventory.quantity}
                    onChange={(e) => setNewInventory({...newInventory, quantity: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Unit Cost ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter unit cost"
                    value={newInventory.unitCost}
                    onChange={(e) => setNewInventory({...newInventory, unitCost: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Selling Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter selling price"
                    value={newInventory.sellingPrice}
                    onChange={(e) => setNewInventory({...newInventory, sellingPrice: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddInventory(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddInventory}
                    className="flex-1"
                  >
                    Add Item
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Plan Modal */}
        {showPaymentPlan && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
            <div className="w-full max-h-[min(92dvh,92vh)] overflow-y-auto rounded-t-2xl border bg-card p-4 shadow-lg sm:max-h-[90vh] sm:max-w-md sm:rounded-lg sm:p-6 sm:mx-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-semibold">Payment Plan Setup</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPaymentPlan(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Sale Summary */}
              {stockSold.itemId && stockSold.quantity && (
                <div className="mb-4 p-3 bg-muted/50 rounded text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Item:</span>
                    <span className="font-medium">{inventoryItems[parseInt(stockSold.itemId)].name}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{stockSold.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-bold text-primary">
                      ${(parseInt(stockSold.quantity) * inventoryItems[parseInt(stockSold.itemId)].sellingPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Down Payment ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={paymentPlan.downPayment}
                      onChange={(e) => setPaymentPlan({...paymentPlan, downPayment: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Installment Amount ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={paymentPlan.installmentAmount}
                      onChange={(e) => setPaymentPlan({...paymentPlan, installmentAmount: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Number of Installments</label>
                    <Select value={paymentPlan.installmentCount} onValueChange={(value) => setPaymentPlan({...paymentPlan, installmentCount: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Payment Frequency</label>
                    <Select value={paymentPlan.paymentFrequency} onValueChange={(value) => setPaymentPlan({...paymentPlan, paymentFrequency: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground font-medium">First Payment Date</label>
                  <Input
                    type="date"
                    value={paymentPlan.firstPaymentDate}
                    onChange={(e) => setPaymentPlan({...paymentPlan, firstPaymentDate: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                {/* Payment Summary */}
                {paymentPlan.downPayment && paymentPlan.installmentAmount && paymentPlan.installmentCount && (
                  <div className="p-3 bg-muted/50 rounded text-xs">
                    <p className="text-muted-foreground mb-2">Payment Summary:</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Down Payment:</span>
                        <span className="font-medium">${paymentPlan.downPayment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Installment Amount:</span>
                        <span className="font-medium">${paymentPlan.installmentAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Installments:</span>
                        <span className="font-medium">{paymentPlan.installmentCount} × ${paymentPlan.installmentAmount}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total Payments:</span>
                        <span>${(parseFloat(paymentPlan.downPayment) + (parseFloat(paymentPlan.installmentAmount) * parseInt(paymentPlan.installmentCount))).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPaymentPlan(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handlePaymentPlanComplete}
                    className="flex-1"
                  >
                    Complete Sale
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Modal */}
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
            <div className="w-full max-h-[min(92dvh,92vh)] overflow-y-auto rounded-t-2xl border bg-white px-4 pt-5 shadow-lg sm:max-h-[90vh] sm:max-w-2xl sm:rounded-lg sm:p-8 sm:mx-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
                <div className="min-w-0">
                  <h4 className="text-xl font-bold">INVOICE</h4>
                  <p className="text-sm text-muted-foreground">FAMA FLOW Import & Distribution</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="min-h-10 touch-manipulation"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="min-h-10 min-w-10 touch-manipulation"
                    onClick={() => setShowInvoiceModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Invoice Header */}
              <div className="border-b pb-4 mb-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-display font-bold">FF</span>
                      </div>
                      <div>
                        <h5 className="font-bold">FAMA FLOW</h5>
                        <p className="text-sm text-muted-foreground">Import & Distribution Management</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Invoice Number</p>
                      <p className="font-mono font-bold">INV-{new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 mb-6">
                <div>
                  <h6 className="font-semibold mb-2">Bill To:</h6>
                  <div className="text-sm">
                    <p className="font-medium">Customer Name</p>
                    <p className="text-muted-foreground">Customer Address</p>
                    <p className="text-muted-foreground">City, Country</p>
                    <p className="text-muted-foreground">Phone: +254 XXX XXX XXX</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <h6 className="font-semibold mb-2">Payment Terms:</h6>
                  <div className="text-sm">
                    {stockSold.paymentType === 'full' ? (
                      <p className="text-green-600 font-medium">Paid in Full</p>
                    ) : stockSold.paymentType === 'partial' ? (
                      <p className="text-orange-600 font-medium">Partial Credit</p>
                    ) : (
                      <p className="text-blue-600 font-medium">Credit Sale</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              {stockSold.itemId && (
                <div className="mb-6">
                  <h6 className="font-semibold mb-3">Items:</h6>
                  <div className="md:hidden rounded-lg border bg-muted/20 p-4 space-y-3">
                    <div>
                      <p className="font-medium text-sm">{inventoryItems[parseInt(stockSold.itemId)].name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{inventoryItems[parseInt(stockSold.itemId)].description}</p>
                    </div>
                    <dl className="grid grid-cols-2 gap-2 text-xs border-t pt-3">
                      <div>
                        <dt className="text-muted-foreground">Qty</dt>
                        <dd className="font-semibold tabular-nums">{stockSold.quantity}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Unit price</dt>
                        <dd className="tabular-nums">${inventoryItems[parseInt(stockSold.itemId)].sellingPrice.toFixed(2)}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-muted-foreground">Line total</dt>
                        <dd className="font-semibold tabular-nums">${(parseInt(stockSold.quantity) * inventoryItems[parseInt(stockSold.itemId)].sellingPrice).toFixed(2)}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="hidden md:block overflow-x-auto touch-scroll-x">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Description</th>
                          <th className="text-center py-2">Quantity</th>
                          <th className="text-right py-2">Unit Price</th>
                          <th className="text-right py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{inventoryItems[parseInt(stockSold.itemId)].name}</p>
                              <p className="text-xs text-muted-foreground">{inventoryItems[parseInt(stockSold.itemId)].description}</p>
                            </div>
                          </td>
                          <td className="text-center py-3">{stockSold.quantity}</td>
                          <td className="text-right py-3">${inventoryItems[parseInt(stockSold.itemId)].sellingPrice.toFixed(2)}</td>
                          <td className="text-right py-3 font-semibold">
                            ${(parseInt(stockSold.quantity) * inventoryItems[parseInt(stockSold.itemId)].sellingPrice).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Totals */}
              {stockSold.itemId && stockSold.quantity && (
                <div className="border-t pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${(parseInt(stockSold.quantity) * inventoryItems[parseInt(stockSold.itemId)].sellingPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (0%):</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-green-600">${(parseInt(stockSold.quantity) * inventoryItems[parseInt(stockSold.itemId)].sellingPrice).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
                <p>Thank you for your business!</p>
                <p>For inquiries, contact: info@famaflow.com | Phone: +254 XXX XXX XXX</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
