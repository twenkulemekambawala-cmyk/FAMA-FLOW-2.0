import { useEffect, useState } from "react";
import { Ship, Package, Plus, Download, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { countries } from "@/lib/data";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CONTAINER_MAX = 68;
const isFCL = (cbm: number) => cbm >= 50;

type ShippingMode = 'FCL' | 'LCL';
type ShipmentStatus = 'IN_CONSOLIDATION_QUEUE' | 'READY_FOR_PROCUREMENT';
type ShipmentType = 'customer' | 'fama_group';
type ShipmentStage = 'warehouse' | 'port' | 'offloaded';

interface ClientShipment {
  id: string;
  shipmentId: string;
  type: ShipmentType;
  clientName: string;
  productName: string;
  quantity: number;
  length: number; // in cm
  width: number;  // in cm
  height: number; // in cm
  cbm: number;
  originWarehouse: string;
  departurePort: string;
  itemImageName?: string;
  destinationCountry: string;
  containerNumber: string;
  shippingMode: ShippingMode;
  stage: ShipmentStage;
  pricePerCBM: number;
  totalPrice: number;
  createdDate: string;
}

// Pricing structure for different shipping modes
const PRICING_STRUCTURE = {
  LCL: 150, // USD per CBM for LCL
  FCL: 2500 // USD per container for FCL
};

interface ContainerInfo {
  number: string;
  destination: string;
  departureTime: string;
}

const formatContainerNumber = (index: number) => `CONT-${String(index).padStart(3, '0')}`;

const CONTAINER_DESTINATION_COMPATIBILITY: Record<string, string[]> = {
  tz: ['mw', 'zm', 'rw', 'ke', 'ug', 'tz'],
  gh: ['gh'],
};

const containerDestinationLabels: Record<string, string> = {
  tz: 'Tanzania',
  gh: 'Ghana',
};

const getContainerDestinationForShipment = (destinationCountry: string) => {
  if (['mw', 'zm', 'rw', 'ke', 'ug', 'tz'].includes(destinationCountry)) return 'tz';
  if (destinationCountry === 'gh') return 'gh';
  return 'tz';
};

export function LogisticsTab() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [showInternalTransfers, setShowInternalTransfers] = useState<boolean>(false);
  const [activeShipmentTab, setActiveShipmentTab] = useState<ShipmentType>('customer');
  const [shipments, setShipments] = useState<ClientShipment[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [selectedShipment, setSelectedShipment] = useState<ClientShipment | null>(null);
  const [showAddShipment, setShowAddShipment] = useState<boolean>(false);
  const [showNewContainerForm, setShowNewContainerForm] = useState<boolean>(false);
  const [containers, setContainers] = useState<ContainerInfo[]>([
    { number: formatContainerNumber(1), destination: 'tz', departureTime: '' }
  ]);
  const [activeContainer, setActiveContainer] = useState<string>(formatContainerNumber(1));
  const [containerIndex, setContainerIndex] = useState<number>(1);
  const [containerAlert, setContainerAlert] = useState<string>('');
  const [containerItemImages, setContainerItemImages] = useState<Record<string, string>>({});
  const [newContainer, setNewContainer] = useState({
    destination: 'tz',
    departureTime: '',
  });
  const [newShipment, setNewShipment] = useState({
    clientName: '',
    productName: '',
    quantity: 1,
    length: 0,
    width: 0,
    height: 0,
    originWarehouse: 'Tianjin',
    departurePort: 'Tianjin',
    destinationCountry: ''
  });

  const getContainerCBM = (containerNumber: string) => shipments
    .filter(shipment => shipment.containerNumber === containerNumber)
    .reduce((sum, shipment) => sum + shipment.cbm, 0);

  const currentContainerCBM = getContainerCBM(activeContainer);
  const currentContainerRemaining = Math.max(CONTAINER_MAX - currentContainerCBM, 0);
  const currentContainerMode: ShippingMode = isFCL(currentContainerCBM) ? 'FCL' : 'LCL';
  const progressPercentage = Math.min((currentContainerCBM / CONTAINER_MAX) * 100, 100);

  const containerCBMs = shipments.reduce<Record<string, number>>((acc, shipment) => {
    acc[shipment.containerNumber] = (acc[shipment.containerNumber] ?? 0) + shipment.cbm;
    return acc;
  }, {});

  const fullContainers = Object.entries(containerCBMs)
    .filter(([, cbm]) => cbm >= CONTAINER_MAX)
    .map(([containerNumber]) => containerNumber);

  const containersNeedingItemImage = fullContainers
    .filter((containerNumber) => !containerItemImages[containerNumber]);

  const activeContainerInfo = containers.find(container => container.number === activeContainer);
  const activeContainerDestinationName = activeContainerInfo ? containerDestinationLabels[activeContainerInfo.destination] ?? countries.find(c => c.id === activeContainerInfo.destination)?.name ?? 'Unknown' : 'Unknown';
  const activeContainerDepartureTime = activeContainerInfo?.departureTime || 'Not set';

  useEffect(() => {
    if (!containerAlert) return;
    const timer = window.setTimeout(() => setContainerAlert(''), 5000);
    return () => window.clearTimeout(timer);
  }, [containerAlert]);

  const calculateCBM = (length: number, width: number, height: number, quantity: number): number => {
    // CBM = (Length × Width × Height) / 1,000,000 * Quantity
    if (!length || !width || !height || !quantity) return 0;
    const singleCBM = (length * width * height) / 1000000;
    return singleCBM * quantity;
  };

  const calculateShippingPrice = (cbm: number, mode: ShippingMode): number => {
    if (mode === 'FCL') {
      return PRICING_STRUCTURE.FCL;
    } else {
      return Math.ceil(cbm * PRICING_STRUCTURE.LCL);
    }
  };

  const handleAddShipment = () => {
    if (!newShipment.clientName || !newShipment.productName || !newShipment.destinationCountry 
        || !newShipment.length || !newShipment.width || !newShipment.height) {
      alert('Please fill in all shipment details.');
      return;
    }

    const cbm = calculateCBM(newShipment.length, newShipment.width, newShipment.height, newShipment.quantity);
    if (cbm <= 0) {
      alert('Please enter valid dimensions and quantity.');
      return;
    }

    const shippingMode = isFCL(cbm) ? 'FCL' : 'LCL';
    const totalPrice = calculateShippingPrice(cbm, shippingMode);
    const currentContainerCBM = getContainerCBM(activeContainer);
    const remainingCBM = CONTAINER_MAX - currentContainerCBM;
    const currentContainerInfo = containers.find(container => container.number === activeContainer);
    const currentDestination = currentContainerInfo?.destination ?? 'tz';
    const allowedForCurrent = CONTAINER_DESTINATION_COMPATIBILITY[currentDestination] ?? [newShipment.destinationCountry];
    let assignedContainer = activeContainer;
    let assignedContainerDestination = currentDestination;

    const createContainer = (destination: string) => {
      const nextIndex = containerIndex + 1;
      const nextContainer = formatContainerNumber(nextIndex);
      setContainers([...containers, { number: nextContainer, destination, departureTime: '' }]);
      setContainerIndex(nextIndex);
      setActiveContainer(nextContainer);
      return nextContainer;
    };

    if (!allowedForCurrent.includes(newShipment.destinationCountry)) {
      const destination = getContainerDestinationForShipment(newShipment.destinationCountry);
      assignedContainer = createContainer(destination);
      assignedContainerDestination = destination;
      setContainerAlert(`Shipment not compatible with current container destination. Started ${assignedContainer} with destination ${containerDestinationLabels[destination]}.`);
    } else if (cbm > remainingCBM) {
      const destination = currentDestination;
      assignedContainer = createContainer(destination);
      assignedContainerDestination = destination;
      setContainerAlert(`Container ${activeContainer} is full. Started ${assignedContainer} for the new shipment.`);
    } else if (cbm === remainingCBM) {
      assignedContainer = activeContainer;
      setContainerAlert(`Container ${activeContainer} is now full.`);
      const destination = currentDestination;
      assignedContainer = createContainer(destination);
      assignedContainerDestination = destination;
    }

    const shipment: ClientShipment = {
      id: Date.now().toString(),
      shipmentId: `SHIP-${Date.now()}`,
      type: activeShipmentTab,
      clientName: newShipment.clientName,
      productName: newShipment.productName,
      quantity: newShipment.quantity,
      length: newShipment.length,
      width: newShipment.width,
      height: newShipment.height,
      cbm: cbm,
      originWarehouse: newShipment.originWarehouse,
      departurePort: newShipment.departurePort,
      destinationCountry: newShipment.destinationCountry,
      containerNumber: assignedContainer,
      shippingMode: shippingMode,
      stage: 'warehouse',
      pricePerCBM: shippingMode === 'LCL' ? PRICING_STRUCTURE.LCL : 0,
      totalPrice: totalPrice,
      createdDate: new Date().toISOString()
    };

    setShipments([...shipments, shipment]);
    setNewShipment({
      clientName: '',
      productName: '',
      quantity: 1,
      length: 0,
      width: 0,
      height: 0,
      originWarehouse: 'Tianjin',
      departurePort: 'Tianjin',
      destinationCountry: ''
    });
    setShowAddShipment(false);
  };

  const handleMoveToPort = (shipment: ClientShipment) => {
    const containerCBM = getContainerCBM(shipment.containerNumber);
    const isContainerFull = containerCBM >= CONTAINER_MAX;

    if (isContainerFull && !containerItemImages[shipment.containerNumber]) {
      alert(`Please upload an item image for ${shipment.containerNumber} before moving to port.`);
      return;
    }

    setShipments(shipments.map((item) => item.id === shipment.id ? { ...item, stage: 'port' } : item));
  };

  const updateShipmentStage = (shipmentId: string, stage: ShipmentStage) => {
    setShipments(shipments.map(shipment => shipment.id === shipmentId ? { ...shipment, stage } : shipment));
  };

  const downloadInvoice = async () => {
    if (!selectedShipment) return;
    
    const invoiceElement = document.getElementById(`invoice-${selectedShipment.id}`);
    if (!invoiceElement) return;

    try {
      const canvas = await html2canvas(invoiceElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `Shipment_${selectedShipment.shipmentId}_${selectedShipment.clientName}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const stageSummary = shipments
    .filter((shipment) => shipment.type === activeShipmentTab)
    .reduce(
      (summary, shipment) => {
        summary[shipment.stage] += 1;
        return summary;
      },
      { warehouse: 0, port: 0, offloaded: 0 } as Record<ShipmentStage, number>
    );

  const handleApprovalRequest = () => {
    const status: ShipmentStatus = currentContainerMode === 'LCL' 
      ? 'IN_CONSOLIDATION_QUEUE' 
      : 'READY_FOR_PROCUREMENT';
    
    console.log(`Shipment status set to: ${status}`);
    // TODO: Implement backend logic to update shipment status
    // TODO: For LCL, add to consolidation queue
    // TODO: For FCL, mark as ready for procurement
  };
  return (
    <div className="space-y-6">
      {/* Client Shipment Section */}
      <div className="rounded-lg border bg-white">
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-red-700" />
                <h3 className="font-display font-semibold text-slate-800">Shipments</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveShipmentTab('customer')}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${activeShipmentTab === 'customer' ? 'bg-red-700 text-white' : 'bg-gray-100 text-slate-800 hover:bg-gray-200'}`}
                >
                  Customer Shipment
                </button>
                <button
                  type="button"
                  onClick={() => setActiveShipmentTab('fama_group')}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${activeShipmentTab === 'fama_group' ? 'bg-red-700 text-white' : 'bg-gray-100 text-slate-800 hover:bg-gray-200'}`}
                >
                  Fama Group Shipment
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {containerAlert && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {containerAlert}
                  </div>
                )}
                <div className="grid gap-2 sm:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    <p className="text-xs text-slate-500">Active Container</p>
                    <p className="mt-1 font-semibold text-slate-800">{activeContainer}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    <p className="text-xs text-slate-500">Destination</p>
                    <p className="mt-1 font-semibold text-slate-800">{activeContainerDestinationName}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    <p className="text-xs text-slate-500">Departure</p>
                    <p className="mt-1 font-semibold text-slate-800">{activeContainerDepartureTime || 'Not set'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    <p className="text-xs text-slate-500">Available Capacity</p>
                    <p className="mt-1 font-semibold text-slate-800">{currentContainerRemaining.toFixed(2)} CBM</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setShowNewContainerForm(!showNewContainerForm)}
                    variant="secondary"
                    className="rounded-full px-4 py-2 text-sm font-medium"
                  >
                    Add New Container
                  </Button>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-red-700" style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>
              {showNewContainerForm && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Create New Container</p>
                      <p className="text-xs text-slate-500">Specify final destination, departure time, and default capacity.</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewContainerForm(false)}
                    >
                      Close
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 mt-4">
                    <div>
                      <label className="text-xs text-slate-600 font-medium">Final Destination</label>
                      <select
                        value={newContainer.destination}
                        onChange={(e) => setNewContainer({ ...newContainer, destination: e.target.value })}
                        className="w-full mt-1 rounded-md border bg-white px-3 py-2 text-sm text-slate-800"
                      >
                        <option value="tz">Tanzania</option>
                        <option value="gh">Ghana</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 font-medium">Departure Time</label>
                      <input
                        type="datetime-local"
                        value={newContainer.departureTime}
                        onChange={(e) => setNewContainer({ ...newContainer, departureTime: e.target.value })}
                        className="w-full mt-1 rounded-md border bg-white px-3 py-2 text-sm text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 font-medium">Available Capacity</label>
                      <div className="mt-1 rounded-md border bg-white px-3 py-2 text-sm text-slate-800">{CONTAINER_MAX} CBM</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        const nextIndex = containerIndex + 1;
                        const nextNumber = formatContainerNumber(nextIndex);
                        setContainers([...containers, {
                          number: nextNumber,
                          destination: newContainer.destination,
                          departureTime: newContainer.departureTime,
                        }]);
                        setActiveContainer(nextNumber);
                        setContainerIndex(nextIndex);
                        setNewContainer({ destination: 'tz', departureTime: '' });
                        setShowNewContainerForm(false);
                        setContainerAlert(`Added new container ${nextNumber} for ${containerDestinationLabels[newContainer.destination]}.`);
                      }}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Create Container
                    </Button>
                  </div>
                </div>
              )}
              {containersNeedingItemImage.length > 0 && (
                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-slate-800">
                  <p className="font-semibold">Full container item image required</p>
                  <p className="text-xs text-slate-500">Upload an image of the item itself for the full container before moving its shipments from China warehouse to port.</p>
                  <div className="mt-3 space-y-4">
                    {containersNeedingItemImage.map((containerNumber) => (
                      <div key={containerNumber} className="space-y-2 rounded-xl border border-yellow-100 bg-white p-3">
                        <p className="font-medium">{containerNumber}</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const fileName = e.target.files?.[0]?.name || '';
                            setContainerItemImages({
                              ...containerItemImages,
                              [containerNumber]: fileName,
                            });
                          }}
                          className="w-full rounded-md border bg-card p-2 text-sm text-slate-800"
                        />
                        {containerItemImages[containerNumber] && (
                          <p className="text-xs text-slate-500">Uploaded: {containerItemImages[containerNumber]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {shipments.filter((shipment) => shipment.type === activeShipmentTab).length > 0 && (
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    <p className="text-xs text-slate-500">Warehouse</p>
                    <p className="mt-1 font-semibold text-slate-800">{stageSummary.warehouse} shipment(s)</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    <p className="text-xs text-slate-500">Port</p>
                    <p className="mt-1 font-semibold text-slate-800">{stageSummary.port} shipment(s)</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                    <p className="text-xs text-slate-500">Offloaded</p>
                    <p className="mt-1 font-semibold text-slate-800">{stageSummary.offloaded} shipment(s)</p>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={() => setShowAddShipment(!showAddShipment)}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Shipment
            </Button>
          </div>

          {/* Add New Shipment Form */}
          {showAddShipment && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-medium">Client Name</label>
                  <input
                    type="text"
                    placeholder="Client name"
                    value={newShipment.clientName}
                    onChange={(e) => setNewShipment({...newShipment, clientName: e.target.value})}
                    className="w-full mt-1 p-2 rounded-md border bg-white text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Electronic Components"
                    value={newShipment.productName}
                    onChange={(e) => setNewShipment({...newShipment, productName: e.target.value})}
                    className="w-full mt-1 p-2 rounded-md border bg-white text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Quantity (Units)</label>
                  <input
                    type="number"
                    min="1"
                    value={newShipment.quantity}
                    onChange={(e) => setNewShipment({...newShipment, quantity: parseInt(e.target.value) || 1})}
                    className="w-full mt-1 p-2 rounded-md border bg-white text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Destination Country</label>
                  <select
                    value={newShipment.destinationCountry}
                    onChange={(e) => setNewShipment({...newShipment, destinationCountry: e.target.value})}
                    className="w-full mt-1 p-2 rounded-md border bg-white text-sm text-slate-800"
                  >
                    <option value="">Select destination</option>
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Origin Warehouse</label>
                  <select
                    value={newShipment.originWarehouse}
                    onChange={(e) => setNewShipment({...newShipment, originWarehouse: e.target.value})}
                    className="w-full mt-1 p-2 rounded-md border bg-white text-sm text-slate-800"
                  >
                    <option value="Tianjin">Tianjin</option>
                    <option value="Guangzhou">Guangzhou</option>
                    <option value="Shenzhen">Shenzhen</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">Departure Port</label>
                  <select
                    value={newShipment.departurePort}
                    onChange={(e) => setNewShipment({...newShipment, departurePort: e.target.value})}
                    className="w-full mt-1 p-2 rounded-md border bg-white text-sm text-slate-800"
                  >
                    <option value="Tianjin">Tianjin</option>
                    <option value="Guangzhou">Guangzhou</option>
                    <option value="Shenzhen">Shenzhen</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-600 font-medium">Dimensions (cm)</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      placeholder="Length (cm)"
                      value={newShipment.length || ''}
                      onChange={(e) => setNewShipment({...newShipment, length: parseFloat(e.target.value) || 0})}
                      className="w-full p-2 rounded-md border bg-white text-sm text-slate-800"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Width (cm)"
                      value={newShipment.width || ''}
                      onChange={(e) => setNewShipment({...newShipment, width: parseFloat(e.target.value) || 0})}
                      className="w-full p-2 rounded-md border bg-white text-sm text-slate-800"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Height (cm)"
                      value={newShipment.height || ''}
                      onChange={(e) => setNewShipment({...newShipment, height: parseFloat(e.target.value) || 0})}
                      className="w-full p-2 rounded-md border bg-white text-sm text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddShipment}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Add Shipment
                </Button>
                <Button
                  onClick={() => setShowAddShipment(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Shipments List */}
          {shipments.filter(shipment => shipment.type === activeShipmentTab).length > 0 ? (
            <div className="space-y-3">
              {shipments.filter(shipment => shipment.type === activeShipmentTab).map((shipment) => (
                <div key={shipment.id} className="border rounded-lg p-4 bg-gray-50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-800">{shipment.clientName}</p>
                      <p className="text-sm text-slate-600">{shipment.shipmentId}</p>
                      <p className="text-xs text-slate-500 mt-1">Product: {shipment.productName}</p>
                      <p className="text-xs text-slate-500 mt-1">Container: {shipment.containerNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${shipment.shippingMode === 'FCL' ? 'text-green-600' : 'text-orange-500'}`}>
                        {shipment.shippingMode}
                      </p>
                      <p className="text-xs text-slate-600">CBM: {shipment.cbm.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-600">Destination</p>
                      <p className="font-medium text-slate-800">{countries.find(c => c.id === shipment.destinationCountry)?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Quantity</p>
                      <p className="font-medium text-slate-800">{shipment.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Dimensions</p>
                      <p className="font-medium text-slate-800">{shipment.length}×{shipment.width}×{shipment.height} cm</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Price</p>
                      <p className="font-bold text-slate-800">${shipment.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm pt-2">
                    <div>
                      <p className="text-xs text-slate-600">Warehouse</p>
                      <p className="font-medium text-slate-800">{shipment.originWarehouse}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Port</p>
                      <p className="font-medium text-slate-800">{shipment.departurePort}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Container Status</p>
                      <p className="font-medium text-slate-800">
                        {containerItemImages[shipment.containerNumber] ? 'Item image uploaded' : 'Item image pending'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3">
                    <p className="text-xs text-slate-600 uppercase tracking-[0.2em]">Shipment Tracker</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className={`rounded-full px-3 py-2 text-xs font-semibold ${shipment.stage === 'warehouse' ? 'bg-red-700 text-white' : 'bg-gray-100 text-slate-600'}`}>
                        China Warehouse
                      </div>
                      <div className={`rounded-full px-3 py-2 text-xs font-semibold ${shipment.stage === 'port' ? 'bg-red-700 text-white' : 'bg-gray-100 text-slate-600'}`}>
                        Port {shipment.departurePort}
                      </div>
                      <div className={`rounded-full px-3 py-2 text-xs font-semibold ${shipment.stage === 'offloaded' ? 'bg-red-700 text-white' : 'bg-gray-100 text-slate-600'}`}>
                        Offloaded Tanzania
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {shipment.stage === 'warehouse' && (
                      <Button
                        onClick={() => handleMoveToPort(shipment)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Move to Port
                      </Button>
                    )}
                    {shipment.stage === 'port' && (
                      <Button
                        onClick={() => updateShipmentStage(shipment.id, 'offloaded')}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Mark Offloaded
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedShipment(shipment);
                        setShowInvoiceModal(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Printer className="h-3 w-3 mr-1" />
                      View Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !showAddShipment && (
              <p className="text-center text-slate-600 py-6">No {activeShipmentTab === 'customer' ? 'Customer' : 'Fama Group'} shipments yet. Click "New Shipment" to add one.</p>
            )
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="w-full max-h-[min(92dvh,92vh)] overflow-y-auto rounded-t-2xl border bg-white px-4 pt-5 shadow-lg sm:max-h-[90vh] sm:max-w-2xl sm:rounded-lg sm:p-8 sm:mx-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
              <div>
                <h4 className="text-xl font-bold">SHIPMENT INVOICE</h4>
                <p className="text-sm text-slate-600">FAMA IMPORT AND DISTRIBUTION</p>
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
                  onClick={downloadInvoice}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="min-h-10 min-w-10 touch-manipulation"
                  onClick={() => {
                    setShowInvoiceModal(false);
                    setSelectedShipment(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div id={`invoice-${selectedShipment.id}`} className="space-y-4">
              {/* Invoice Header */}
              <div className="border-b pb-4">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-red-700 flex items-center justify-center">
                        <span className="text-white font-display font-bold">FF</span>
                      </div>
                      <div>
                        <h5 className="font-bold">FAMA LOGISTICS</h5>
                        <p className="text-xs text-slate-600">From China to Africa</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      <p className="text-sm text-slate-600">Shipment ID</p>
                      <p className="font-mono font-bold text-slate-800">{selectedShipment.shipmentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Date</p>
                      <p className="font-semibold text-slate-800">{new Date(selectedShipment.createdDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="grid grid-cols-2 gap-8 pb-4">
                <div>
                  <h6 className="font-semibold text-slate-800 mb-2">Bill To:</h6>
                  <div className="text-sm">
                    <p className="font-medium text-slate-800">{selectedShipment.clientName}</p>
                    <p className="text-slate-600">Destination</p>
                    <p className="text-slate-600 font-medium">{countries.find(c => c.id === selectedShipment.destinationCountry)?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h6 className="font-semibold text-slate-800 mb-2">Shipment Details:</h6>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Origin:</span>
                      <span className="font-medium text-slate-800">China (Shanghai)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mode:</span>
                      <span className={`font-bold ${selectedShipment.shippingMode === 'FCL' ? 'text-green-600' : 'text-orange-500'}`}>
                        {selectedShipment.shippingMode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-y py-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-xs text-slate-600 font-medium">Product</th>
                      <th className="text-center py-2 text-xs text-slate-600 font-medium">Qty</th>
                      <th className="text-center py-2 text-xs text-slate-600 font-medium">Dimensions (cm)</th>
                      <th className="text-right py-2 text-xs text-slate-600 font-medium">CBM</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 font-medium text-slate-800">{selectedShipment.productName}</td>
                      <td className="text-center py-3 text-slate-800">{selectedShipment.quantity}</td>
                      <td className="text-center py-3 text-slate-800">{selectedShipment.length}×{selectedShipment.width}×{selectedShipment.height}</td>
                      <td className="text-right py-3 font-semibold text-slate-800">{selectedShipment.cbm.toFixed(4)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">${selectedShipment.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-red-700">${selectedShipment.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t text-xs text-slate-600">
                <p>Thank you for your shipment!</p>
                <p>Payment Terms: Due upon delivery | Contact: logistics@famaflow.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
