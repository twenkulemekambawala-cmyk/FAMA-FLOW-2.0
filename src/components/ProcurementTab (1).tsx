import { RefreshCw, TrendingUp, Package, DollarSign, Plus, Calendar, Building2, Home, Download, X, Printer } from "lucide-react";
import QRCode from 'qrcode';

// Create initials mapping for products
const getItemInitials = (productName) => {
  const words = productName.split(' ');
  return words.map(word => word.charAt(0).toUpperCase()).join('');
};

// Category-based initials
const categoryInitials = {
  electronics: 'ELEC',
  accessories: 'ACC',
  services: 'SVC',
  furniture: 'FURN',
  clothing: 'CLTH'
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "@/lib/data";
import { MarginDial } from "./MarginDial";
import { useState } from "react";

function procurementSalePaymentClass(paymentStructure: string) {
  if (paymentStructure === "Full Payment") return "bg-success/10 text-success border border-success/20";
  if (paymentStructure === "Partial Credit") return "bg-warning/10 text-warning border border-warning/20";
  return "bg-primary/10 text-primary border border-primary/20";
}

const countryData = {
  kenya: {
    callerId: '+254',
    cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Kitale', 'Garissa', 'Kakamega', 'Kisii']
  },
  malawi: {
    callerId: '+265',
    cities: ['Lilongwe', 'Blantyre', 'Dedza', 'Chitipa', 'Kalonga', 'Mzuzu', 'Zomba', 'Karonga', 'Mchinji', 'Salima']
  },
  tanzania: {
    callerId: '+255',
    cities: ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya', 'Morogoro', 'Tanga', 'Kilimanjaro', 'Iringa', 'Kigoma']
  },
  uganda: {
    callerId: '+256',
    cities: ['Kampala', 'Entebbe', 'Jinja', 'Gulu', 'Mbarara', 'Mbale', 'Mukono', 'Kasese', 'Masaka', 'Lira']
  },
  zambia: {
    callerId: '+260',
    cities: ['Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Chingola', 'Mufulira', 'Luanshya', 'Livingstone', 'Kasama', 'Chipata']
  },
  zimbabwe: {
    callerId: '+263',
    cities: ['Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru', 'Kwekwe', 'Kadoma', 'Masvingo', 'Marondera', 'Chinhoyi']
  }
};

export function ProcurementTab() {
  const [showSalesTable, setShowSalesTable] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [stockSold, setStockSold] = useState({
    itemId: '',
    quantity: '',
    paymentType: 'full',
    customerName: '',
    customerPhone: '',
    customerCity: '',
    customerCountry: 'kenya'
  });
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [customers, setCustomers] = useState([
  {
    customerId: 'CUST-1',
    name: 'John Chisale',
    phone: '+265999123456',
    city: 'Lilongwe',
    country: 'malawi',
    totalPurchases: 2500,
    totalDebt: 500,
    firstPurchaseDate: '2026-03-15',
    lastPurchaseDate: '2026-04-01',
    purchaseHistory: []
  },
  {
    customerId: 'CUST-2',
    name: 'Jane Smith',
    phone: '+254712345678',
    city: 'Nairobi',
    country: 'kenya',
    totalPurchases: 1800,
    totalDebt: 0,
    firstPurchaseDate: '2026-02-20',
    lastPurchaseDate: '2026-04-05',
    purchaseHistory: []
  },
  {
    customerId: 'CUST-3',
    name: 'Michael Banda',
    phone: '+265888987654',
    city: 'Blantyre',
    country: 'malawi',
    totalPurchases: 3200,
    totalDebt: 800,
    firstPurchaseDate: '2026-01-10',
    lastPurchaseDate: '2026-03-28',
    purchaseHistory: []
  }
]);
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showPendingInvoices, setShowPendingInvoices] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [paymentPlan, setPaymentPlan] = useState({
    downPayment: '',
    installmentAmount: '',
    installmentCount: '',
    paymentFrequency: 'monthly',
    firstPaymentDate: ''
  });
  const [salesHistory, setSalesHistory] = useState([
    { itemName: 'Smartphones - Model A', quantity: 50, unitPrice: 180, paymentStructure: 'Full Payment', date: '2026-04-12', customerName: 'John Doe', customerPhone: '+254712345678', customerCity: 'Nairobi', customerCountry: 'kenya' },
    { itemName: 'Laptops - Business Series', quantity: 25, unitPrice: 650, paymentStructure: 'Partial Credit', date: '2026-04-12', customerName: 'Jane Smith', customerPhone: '+254723456789', customerCity: 'Mombasa', customerCountry: 'kenya' },
    { itemName: 'Tablets - Educational', quantity: 100, unitPrice: 120, paymentStructure: 'Credit - 6 monthly', date: '2026-04-11', customerName: 'School District', customerPhone: '+265734567890', customerCity: 'Lilongwe', customerCountry: 'malawi' },
    { itemName: 'Wireless Earbuds', quantity: 200, unitPrice: 40, paymentStructure: 'Full Payment', date: '2026-04-12', customerName: 'Tech Store', customerPhone: '+255745678901', customerCity: 'Dar es Salaam', customerCountry: 'tanzania' },
    { itemName: 'Power Banks', quantity: 75, unitPrice: 35, paymentStructure: 'Credit - 3 monthly', date: '2026-04-11', customerName: 'Mobile Shop', customerPhone: '+265756789012', customerCity: 'Blantyre', customerCountry: 'malawi' },
  ]);
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
  const [showPaymentPlan, setShowPaymentPlan] = useState(false);

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
      setStockSold({ itemId: '', quantity: '', paymentType: 'full', customerName: '', customerPhone: '', customerCity: '', customerCountry: 'kenya' });
      
      // Add to sales history for non-credit sales
      const itemName = inventoryItems[itemIndex].name;
      let paymentStructure = 'Full Payment';
      if (stockSold.paymentType === 'partial') {
        paymentStructure = 'Partial Credit';
      }
      
      setSalesHistory([...salesHistory, {
        itemName,
        quantity: soldQuantity,
        unitPrice: inventoryItems[itemIndex].sellingPrice,
        paymentStructure,
        date: new Date().toISOString().split('T')[0],
        customerName: stockSold.customerName,
        customerPhone: stockSold.customerPhone,
        customerCity: stockSold.customerCity,
        customerCountry: stockSold.customerCountry
      }]);
    }
  };

  const addToCart = () => {
    if (stockSold.itemId && stockSold.quantity && stockSold.paymentType) {
      const itemIndex = parseInt(stockSold.itemId);
      const quantity = parseInt(stockSold.quantity);
      const availableQuantity = inventoryItems[itemIndex].quantity;
      
      // Validate quantity
      if (quantity <= 0) return;
      if (quantity > availableQuantity) return;
      
      const item = inventoryItems[itemIndex];
      const existingItemIndex = cart.findIndex(cartItem => cartItem.itemId === stockSold.itemId);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedCart = [...cart];
        const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
        if (newQuantity <= availableQuantity) {
          updatedCart[existingItemIndex].quantity = newQuantity;
          updatedCart[existingItemIndex].totalPrice = newQuantity * item.sellingPrice;
          setCart(updatedCart);
        }
      } else {
        // Add new item to cart with payment type and initials
        setCart([...cart, {
          itemId: stockSold.itemId,
          itemName: item.name,
          description: item.description,
          quantity: quantity,
          unitPrice: item.sellingPrice,
          totalPrice: quantity * item.sellingPrice,
          paymentType: stockSold.paymentType,
          itemInitials: getItemInitials(item.name)
        }]);
      }
      
      // Reset item selection
      setStockSold({
        ...stockSold,
        itemId: '',
        quantity: '',
        paymentType: 'full'
      });
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.itemId !== itemId));
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    const itemIndex = parseInt(itemId);
    const availableQuantity = inventoryItems[itemIndex].quantity;
    
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    if (newQuantity <= availableQuantity) {
      setCart(cart.map(item => {
        if (item.itemId === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newQuantity * item.unitPrice
          };
        }
        return item;
      }));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const searchCustomers = (query) => {
    if (!query) {
      setFilteredCustomers([]);
      return;
    }
    
    const filtered = customers.filter(customer => 
      customer.name.toLowerCase().includes(query.toLowerCase()) ||
      customer.phone.includes(query) ||
      customer.city.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredCustomers(filtered);
  };

  const selectCustomer = (customer) => {
    // Clear search immediately
    setShowCustomerSearch(false);
    setCustomerSearchQuery('');
    setFilteredCustomers([]);
    
    // Autofill all customer details
    setStockSold({
      ...stockSold,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerCity: customer.city,
      customerCountry: customer.country
    });
    setSelectedCustomer(customer);
    
    // Show debt notification if customer has debt
    if (customer.totalDebt > 0) {
      setTimeout(() => {
        alert(`WARNING: ${customer.name} has an outstanding debt of $${customer.totalDebt.toFixed(2)}\n\nPlease collect payment before proceeding with new purchases.`);
      }, 100);
    }
  };

  const findOrCreateCustomer = (customerInfo) => {
    const existingCustomer = customers.find(c => 
      c.phone === customerInfo.phone || 
      (c.name === customerInfo.name && c.city === customerInfo.city)
    );
    
    if (existingCustomer) {
      return existingCustomer;
    }
    
    const newCustomer = {
      customerId: `CUST-${Date.now()}`,
      name: customerInfo.customerName,
      phone: customerInfo.customerPhone,
      city: customerInfo.customerCity,
      country: customerInfo.customerCountry,
      totalPurchases: 0,
      totalDebt: 0,
      firstPurchaseDate: new Date().toISOString(),
      lastPurchaseDate: new Date().toISOString(),
      purchaseHistory: []
    };
    
    setCustomers([...customers, newCustomer]);
    return newCustomer;
  };

  const createPendingInvoice = () => {
    if (cart.length === 0 || !stockSold.customerName) return;
    
    const customer = findOrCreateCustomer(stockSold);
    const invoice = {
      invoiceId: `INV-${Date.now()}`,
      customerId: customer.customerId,
      customerInfo: {
        name: stockSold.customerName,
        phone: stockSold.customerPhone,
        city: stockSold.customerCity,
        country: stockSold.customerCountry
      },
      items: [...cart],
      totalAmount: getCartTotal(),
      paymentType: stockSold.paymentType,
      status: 'pending',
      createdDate: new Date().toISOString(),
      printedDate: null,
      completedDate: null
    };
    
    setPendingInvoices([...pendingInvoices, invoice]);
    return invoice;
  };

  const printInvoice = () => {
    if (cart.length === 0) return;
    
    // Check if all items are credit purchases (no full payments)
    const hasFullPayment = cart.some(item => item.paymentType === 'full');
    const allCreditPurchases = !hasFullPayment;
    
    const invoice = createPendingInvoice();
    
    // Mark as printed
    const updatedInvoices = pendingInvoices.map(inv => 
      inv.invoiceId === invoice.invoiceId 
        ? { ...inv, printedDate: new Date().toISOString() }
        : inv
    );
    setPendingInvoices(updatedInvoices);
    
    // Generate QR code before opening modal
    generateQRCode();
    
    // For full credit purchases, show pending invoices instead of invoice modal
    if (allCreditPurchases) {
      setShowInvoiceModal(false);
      setShowPendingInvoices(true);
      
      // Show notification for full credit purchase
      setTimeout(() => {
        alert(`Credit Purchase Invoice Created!\n\nInvoice ${invoice.invoiceId} has been added to pending invoices.\n\nTotal Amount: $${invoice.totalAmount.toFixed(2)}\nItems: ${invoice.items.length}\n\nYou can find this invoice in "Pending Invoices" section.`);
      }, 500);
    } else {
      // Open invoice modal for mixed or full payment purchases
      setShowInvoiceModal(true);
    }
  };

  const completePendingInvoice = (invoiceId) => {
    const invoice = pendingInvoices.find(inv => inv.invoiceId === invoiceId);
    if (!invoice) return;
    
    // Update inventory
    const updatedItems = [...inventoryItems];
    invoice.items.forEach(cartItem => {
      const itemIndex = parseInt(cartItem.itemId);
      updatedItems[itemIndex].quantity -= cartItem.quantity;
    });
    setInventoryItems(updatedItems);
    
    // Add to sales history
    const newSalesEntries = invoice.items.map(cartItem => ({
      itemName: cartItem.itemName,
      quantity: cartItem.quantity,
      unitPrice: cartItem.unitPrice,
      paymentStructure: invoice.paymentType === 'full' ? 'Full Payment' : 
                      invoice.paymentType === 'partial' ? 'Partial Credit' : 'Credit Sale',
      date: new Date().toISOString().split('T')[0],
      customerName: invoice.customerInfo.name,
      customerPhone: invoice.customerInfo.phone,
      customerCity: invoice.customerInfo.city,
      customerCountry: invoice.customerInfo.country
    }));
    
    setSalesHistory([...salesHistory, ...newSalesEntries]);
    
    // Update customer in CRM
    const updatedCustomers = customers.map(customer => {
      if (customer.customerId === invoice.customerId) {
        return {
          ...customer,
          totalPurchases: customer.totalPurchases + invoice.totalAmount,
          lastPurchaseDate: new Date().toISOString(),
          purchaseHistory: [
            ...customer.purchaseHistory,
            {
              invoiceId: invoice.invoiceId,
              date: new Date().toISOString().split('T')[0],
              items: invoice.items,
              totalAmount: invoice.totalAmount
            }
          ]
        };
      }
      return customer;
    });
    setCustomers(updatedCustomers);
    
    // Remove from pending invoices
    setPendingInvoices(pendingInvoices.filter(inv => inv.invoiceId !== invoiceId));
  };

  const generateQRCode = async () => {
    if (cart.length === 0 || !stockSold.customerName) return;
    
    const invoiceNumber = `INV-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`;
    const qrData = {
      invoice: invoiceNumber,
      customer: stockSold.customerName,
      phone: stockSold.customerPhone,
      city: stockSold.customerCity,
      country: stockSold.customerCountry,
      amount: getCartTotal().toFixed(2),
      date: new Date().toISOString().split('T')[0],
      company: `FAMA ${stockSold.customerCountry ? stockSold.customerCountry.toUpperCase() : 'KENYA'}`,
      items: cart.map(item => `${item.quantity}x ${item.itemInitials}`).join(', ')
    };
    
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 150,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const completeCartSale = () => {
    if (cart.length === 0) return;
    
    generateQRCode();
    printInvoice();
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
    
    setSalesHistory([...salesHistory, {
      itemName,
      quantity: soldQuantity,
      unitPrice: inventoryItems[itemIndex].sellingPrice,
      paymentStructure,
      date: new Date().toISOString().split('T')[0],
      customerName: stockSold.customerName,
      customerPhone: stockSold.customerPhone,
      customerCity: stockSold.customerCity,
      customerCountry: stockSold.customerCountry
    }]);
    
    // Reset forms
    setStockSold({ itemId: '', quantity: '', paymentType: 'full', customerName: '', customerPhone: '', customerCity: '', customerCountry: 'kenya' });
    setPaymentPlan({
      downPayment: '',
      installmentAmount: '',
      installmentCount: '',
      paymentFrequency: 'monthly',
      firstPaymentDate: ''
    });
    setShowPaymentPlan(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-[env(safe-area-inset-bottom)]">
      {/* New Sale Section */}
      <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-4">
        <div className="border-t pt-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground font-bold">NEW SALE</label>
              
              {/* Customer Search */}
              <div className="flex flex-col gap-2 mt-2 sm:flex-row">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                  className="flex-1 min-h-11 touch-manipulation"
                >
                  Search Existing Customer
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPendingInvoices(!showPendingInvoices)}
                  className="flex-1 min-h-11 relative touch-manipulation"
                >
                  Pending Invoices ({pendingInvoices.length})
                  {pendingInvoices.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-warning text-warning-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingInvoices.length}
                    </span>
                  )}
                </Button>
              </div>

              {/* Customer Search Results */}
              {showCustomerSearch && (
                <div className="mt-2 p-3 border rounded-lg bg-muted/50">
                  <div className="text-sm font-medium mb-2">Search Results:</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {customers.length === 0 ? (
                      <div className="text-xs text-muted-foreground">No customers found</div>
                    ) : (
                      customers.map((customer, index) => (
                        <div 
                          key={index}
                          className="flex justify-between items-center p-2 bg-background rounded cursor-pointer hover:bg-muted"
                          onClick={() => {
                            setStockSold({
                              ...stockSold,
                              customerName: customer.name,
                              customerPhone: customer.phone,
                              customerCity: customer.city,
                              customerCountry: customer.country
                            });
                            setShowCustomerSearch(false);
                          }}
                        >
                          <div>
                            <div className="font-medium text-sm">{customer.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {customer.phone} | {customer.city}, {customer.country}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${customer.totalPurchases.toFixed(2)} total
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Customer Details */}
              <div className="grid grid-cols-1 gap-2 mt-2 sm:grid-cols-2">
                <div className="relative">
                  <Input
                    placeholder="Customer Name"
                    value={stockSold.customerName}
                    onChange={(e) => {
                      setStockSold({...stockSold, customerName: e.target.value});
                      setCustomerSearchQuery(e.target.value);
                      searchCustomers(e.target.value);
                    }}
                    onFocus={() => setShowCustomerSearch(true)}
                    className="w-full"
                  />
                  {/* Real-time Search Results */}
                  {showCustomerSearch && customerSearchQuery && filteredCustomers.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {filteredCustomers.map((customer, index) => (
                        <div 
                          key={index}
                          className="flex justify-between items-center p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                          onClick={() => {
                            selectCustomer(customer);
                            setShowCustomerSearch(false);
                          }}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">{customer.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {customer.phone} | {customer.city}, {customer.country}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Total Purchases: ${customer.totalPurchases.toFixed(2)}
                            </div>
                          </div>
                          <div className="text-right">
                            {customer.totalDebt > 0 && (
                              <div className="text-xs font-medium text-red-600">
                                Debt: ${customer.totalDebt.toFixed(2)}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {customer.totalDebt > 0 ? 'Has Debt' : 'No Debt'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Select value={stockSold.customerCountry} onValueChange={(value) => setStockSold({...stockSold, customerCountry: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="malawi">Malawi</SelectItem>
                    <SelectItem value="tanzania">Tanzania</SelectItem>
                    <SelectItem value="uganda">Uganda</SelectItem>
                    <SelectItem value="zambia">Zambia</SelectItem>
                    <SelectItem value="zimbabwe">Zimbabwe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-2 sm:grid-cols-2">
                <Select value={stockSold.customerCity} onValueChange={(value) => setStockSold({...stockSold, customerCity: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryData[stockSold.customerCountry as keyof typeof countryData].cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    {countryData[stockSold.customerCountry as keyof typeof countryData].callerId}
                  </div>
                  <Input
                    placeholder="Phone Number"
                    value={stockSold.customerPhone}
                    onChange={(e) => setStockSold({...stockSold, customerPhone: e.target.value})}
                    className="w-full pl-16"
                  />
                </div>
              </div>
              
              {/* Sale Details */}
              <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:flex-wrap">
                <Select value={stockSold.itemId} onValueChange={(value) => setStockSold({...stockSold, itemId: value})}>
                  <SelectTrigger className="w-full min-h-11 sm:w-48 touch-manipulation">
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryItems.map((item, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {item.name} ({item.quantity} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={stockSold.quantity}
                  onChange={(e) => setStockSold({...stockSold, quantity: e.target.value})}
                  className="w-full min-h-11 sm:w-24"
                />
                <Select value={stockSold.paymentType} onValueChange={(value) => setStockSold({...stockSold, paymentType: value})}>
                  <SelectTrigger className="w-full min-h-11 sm:w-32 touch-manipulation">
                    <SelectValue placeholder="Payment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Payment</SelectItem>
                    <SelectItem value="partial">Partial Credit</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addToCart} className="min-h-11 w-full touch-manipulation sm:w-auto">
                  Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowCart(!showCart)}
                  className="relative min-h-11 w-full touch-manipulation sm:w-auto"
                >
                  Cart ({cart.length})
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </div>
              {stockSold.itemId && stockSold.quantity && (
                <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                  <span className="text-muted-foreground">Sale Value: </span>
                  <span className="font-medium">
                    ${stockSold.quantity && stockSold.itemId ? 
                      (parseInt(stockSold.quantity) * inventoryItems[parseInt(stockSold.itemId)].sellingPrice).toFixed(2) : 
                      '0.00'
                    }
                  </span>
                  <span className="text-muted-foreground ml-2">
                    ({stockSold.paymentType === 'full' ? 'Paid in Full' : stockSold.paymentType === 'partial' ? 'Partial Credit' : 'Credit Sale'})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sales Table */}
        {showSalesTable && (
          <div className="mt-4 sm:mt-6 rounded-lg border bg-card p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
              <h4 className="font-display font-semibold">Sales</h4>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full min-h-10 sm:w-auto touch-manipulation"
                onClick={() => setShowSalesTable(false)}
              >
                Close
              </Button>
            </div>
            <div className="space-y-3 md:hidden">
              {salesHistory.map((sale, i) => (
                <div key={i} className="rounded-lg border bg-muted/20 p-4 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{sale.date}</p>
                      <p className="font-medium text-sm mt-0.5">{sale.customerName}</p>
                      <p className="text-xs text-muted-foreground capitalize mt-1">{sale.customerCity}, {sale.customerCountry}</p>
                      <p className="text-xs text-muted-foreground mt-1 break-all">{sale.customerPhone}</p>
                    </div>
                    <span className={`shrink-0 inline-flex px-2 py-1 text-xs rounded-full ${procurementSalePaymentClass(sale.paymentStructure)}`}>
                      {sale.paymentStructure}
                    </span>
                  </div>
                  <div className="text-sm border-t pt-3">
                    <p className="font-medium">{sale.itemName}</p>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 text-xs border-t pt-3">
                    <div>
                      <dt className="text-muted-foreground">Qty</dt>
                      <dd className="font-semibold tabular-nums">{sale.quantity}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Unit</dt>
                      <dd className="tabular-nums">${sale.unitPrice.toFixed(2)}</dd>
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
                  <span className="text-muted-foreground">Units</span>
                  <span className="font-bold tabular-nums text-primary">{salesHistory.reduce((sum, sale) => sum + sale.quantity, 0)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Avg unit</span>
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
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Country</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">City</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Phone</th>
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
                      <td className="py-3 px-4 font-medium">{sale.customerName}</td>
                      <td className="py-3 px-4 text-muted-foreground capitalize">{sale.customerCountry}</td>
                      <td className="py-3 px-4 text-muted-foreground">{sale.customerCity}</td>
                      <td className="py-3 px-4 text-muted-foreground">{sale.customerPhone}</td>
                      <td className="py-3 px-4 font-medium">{sale.itemName}</td>
                      <td className="py-3 px-4 text-right font-semibold">{sale.quantity}</td>
                      <td className="py-3 px-4 text-right">${sale.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-primary">
                        ${(sale.quantity * sale.unitPrice).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${procurementSalePaymentClass(sale.paymentStructure)}`}>
                          {sale.paymentStructure}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary">
                    <td colSpan={6} className="py-3 px-4 font-semibold">Totals</td>
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

        {/* Cart Display */}
        {showCart && cart.length > 0 && (
          <div className="mt-6 rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-semibold">Shopping Cart</h4>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCart(false)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.itemName}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                    <div className="text-sm text-muted-foreground">${item.unitPrice.toFixed(2)} each</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        item.paymentType === 'full' 
                          ? 'bg-success/10 text-success border border-success/20'
                          : item.paymentType === 'partial'
                          ? 'bg-warning/10 text-warning border border-warning/20'
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {item.paymentType === 'full' ? 'Full Payment' : 
                         item.paymentType === 'partial' ? 'Partial Credit' : 'Credit'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateCartQuantity(item.itemId, parseInt(e.target.value))}
                      className="w-16 text-center"
                      min="1"
                    />
                    <div className="text-sm font-medium w-20 text-right">
                      ${item.totalPrice.toFixed(2)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFromCart(item.itemId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Cart Total:</span>
                  <span className="text-lg font-bold text-primary">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                  <div className="font-medium mb-1">Payment Summary:</div>
                  <div className="space-y-1">
                    {Object.entries(
                      cart.reduce((acc: Record<string, {items: string[], total: number}>, item) => {
                        const type = item.paymentType;
                        if (!acc[type]) acc[type] = { items: [], total: 0 };
                        acc[type].items.push(`${item.quantity}x ${item.itemInitials}`);
                        acc[type].total += item.totalPrice;
                        return acc;
                      }, {} as Record<string, {items: string[], total: number}>)
                    ).map(([type, data]) => (
                      <div key={type} className="flex justify-between">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                          type === 'full' 
                            ? 'bg-success/10 text-success border border-success/20'
                            : type === 'partial'
                            ? 'bg-warning/10 text-warning border border-warning/20'
                            : 'bg-primary/10 text-primary border border-primary/20'
                        }`}>
                          {type === 'full' ? 'Full Payment' : type === 'partial' ? 'Partial Credit' : 'Credit'}
                        </span>
                        <span>{data.items.join(', ')} - ${data.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <Button 
                  variant="destructive"
                  onClick={printInvoice}
                  disabled={cart.length === 0}
                >
                  <Printer className="h-3 w-3 mr-1" />
                  Save & Print Invoice
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Invoices */}
        {showPendingInvoices && (
          <div className="mt-6 rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-semibold">Pending Invoices</h4>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPendingInvoices(false)}
              >
                Close
              </Button>
            </div>
            <div className="space-y-3">
              {pendingInvoices.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No pending invoices
                </div>
              ) : (
                pendingInvoices.map((invoice, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{invoice.invoiceId}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.customerInfo.name} | {invoice.customerInfo.phone}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {invoice.items.length} items | ${invoice.totalAmount.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">
                          {invoice.printedDate ? 'Printed' : 'Not Printed'}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => completePendingInvoice(invoice.invoiceId)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Complete Purchase
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(invoice.createdDate).toLocaleDateString()}
                      {invoice.printedDate && ` | Printed: ${new Date(invoice.printedDate).toLocaleDateString()}`}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Invoice Modal */}
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
            <div className="w-full max-h-[min(92dvh,92vh)] overflow-y-auto rounded-t-2xl border bg-white px-4 pt-5 shadow-lg sm:max-h-[90vh] sm:max-w-2xl sm:rounded-lg sm:p-8 sm:mx-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold">INVOICE</h4>
                  <p className="text-sm text-muted-foreground">FAMA IMPORT AND DISTRIBUTION</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="min-h-10 flex-1 sm:flex-initial touch-manipulation"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="min-h-10 flex-1 sm:flex-initial touch-manipulation"
                    onClick={() => {
                      setShowInvoiceModal(false);
                      clearCart();
                    }}
                  >
                    Close
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
                        <h5 className="font-bold">FAMA {stockSold.customerCountry ? stockSold.customerCountry.toUpperCase() : 'KENYA'}</h5>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Invoice Number</p>
                      <p className="font-mono font-bold">INV-{new Date().toISOString().slice(0,10).replace(/-/g, '')}-{Math.floor(Math.random() * 1000)}</p>
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
                    <p className="font-medium">{stockSold.customerName || 'Customer Name'}</p>
                    <p className="text-muted-foreground">Customer Address</p>
                    <p className="text-muted-foreground">{stockSold.customerCity || 'City'}, Country</p>
                    <p className="text-muted-foreground">Phone: {stockSold.customerPhone ? 
                    (stockSold.customerPhone.startsWith('+') ? stockSold.customerPhone : 
                     `${countryData[stockSold.customerCountry as keyof typeof countryData].callerId}${stockSold.customerPhone}`) : 
                    `${countryData[stockSold.customerCountry as keyof typeof countryData].callerId} XXX XXX XXX`}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <h6 className="font-semibold mb-2">Payment Terms:</h6>
                  <div className="text-sm">
                    {cart.length > 0 ? (
                      <div className="space-y-1">
                        {Object.entries(
                          cart.reduce((acc: Record<string, {items: string[], total: number}>, item) => {
                            const type = item.paymentType;
                            if (!acc[type]) acc[type] = { items: [], total: 0 };
                            acc[type].items.push(`${item.quantity}x ${item.itemInitials}`);
                            acc[type].total += item.totalPrice;
                            return acc;
                          }, {} as Record<string, {items: string[], total: number}>)
                        ).map(([type, data]) => (
                          <div key={type} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {type === 'full' ? 'Full Payment' : type === 'partial' ? 'Partial Credit' : 'Credit Sale'}:
                            </span>
                            <span>{data.items.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No items in cart</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              {cart.length > 0 && (
                <div className="mb-6">
                  <h6 className="font-semibold mb-3">Items:</h6>
                  <div className="space-y-3 md:hidden">
                    {cart.map((item, index) => (
                      <div key={index} className="rounded-lg border bg-muted/20 p-4 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-mono text-sm font-semibold">{item.itemInitials}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.itemName}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full shrink-0 ${
                            item.paymentType === "full"
                              ? "bg-success/10 text-success border border-success/20"
                              : item.paymentType === "partial"
                              ? "bg-warning/10 text-warning border border-warning/20"
                              : "bg-primary/10 text-primary border border-primary/20"
                          }`}>
                            {item.paymentType === "full" ? "Full Payment" : item.paymentType === "partial" ? "Partial Credit" : "Credit"}
                          </span>
                        </div>
                        <dl className="grid grid-cols-2 gap-2 text-xs border-t pt-3">
                          <div>
                            <dt className="text-muted-foreground">Qty</dt>
                            <dd className="font-semibold tabular-nums">{item.quantity}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Unit</dt>
                            <dd className="tabular-nums">${item.unitPrice.toFixed(2)}</dd>
                          </div>
                          <div className="col-span-2">
                            <dt className="text-muted-foreground">Line total</dt>
                            <dd className="font-semibold tabular-nums">${item.totalPrice.toFixed(2)}</dd>
                          </div>
                        </dl>
                      </div>
                    ))}
                  </div>
                  <div className="hidden md:block overflow-x-auto touch-scroll-x">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Description</th>
                          <th className="text-center py-2">Quantity</th>
                          <th className="text-right py-2">Unit Price</th>
                          <th className="text-right py-2">Total</th>
                          <th className="text-left py-2">Payment Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item, index) => (
                          <tr key={index}>
                            <td className="py-3">
                              <div>
                                <p className="font-medium">{item.itemInitials}</p>
                                <p className="text-xs text-muted-foreground">{item.itemName}</p>
                              </div>
                            </td>
                            <td className="text-center py-3">{item.quantity}</td>
                            <td className="text-right py-3">${item.unitPrice.toFixed(2)}</td>
                            <td className="text-right py-3 font-semibold">
                              ${item.totalPrice.toFixed(2)}
                            </td>
                            <td className="py-3">
                              {item.paymentType === 'full' ? 'Full Payment' : 
                               item.paymentType === 'partial' ? 'Partial Credit' : 'Credit'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Totals */}
              {cart.length > 0 && (
                <div className="border-t pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (0%):</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-green-600">${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Code Section */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-2">
                      <p className="font-medium">Invoice Verification</p>
                      <p>Scan QR code to verify invoice authenticity</p>
                    </div>
                  </div>
                  <div className="text-center">
                    {qrCodeUrl ? (
                      <>
                        <img src={qrCodeUrl} alt="Invoice QR Code" className="w-32 h-32 border border-gray-300" />
                        <p className="text-xs text-muted-foreground mt-1">Scan to verify</p>
                      </>
                    ) : (
                      <div className="w-32 h-32 border border-gray-300 flex items-center justify-center bg-gray-50">
                        <p className="text-xs text-muted-foreground">Generating...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
                <p>Thank you for your business!</p>
                <p>For inquiries, contact: info@famaflow.com | Phone: +254 XXX XXX XXX</p>
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
      </div>
    </div>
  );
}
