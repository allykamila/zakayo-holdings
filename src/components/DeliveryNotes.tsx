import React, { useState, useRef } from "react";
import {
  Plus,
  Eye,
  Download,
  Search,
  Truck,
  Package,
  CheckCircle,
  Clock,
  Send,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { subsidiaries } from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";
import { CreateDeliveryNoteForm } from "./CreateDeliveryNoteForm";
import { generatePDFFromElement, shareViaWhatsApp } from "../lib/pdfUtils";

interface DeliveryNote {
  id: number;
  deliveryNumber: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: {
    description: string;
    quantity: number;
    delivered: number;
  }[];
  status: "Pending" | "In Transit" | "Delivered" | "Failed";
  deliveryDate: string;
  deliveredDate?: string;
  driverName: string;
  vehicleNumber: string;
  subsidiaryId: number;
}

const mockDeliveryNotes: DeliveryNote[] = [
  {
    id: 1,
    deliveryNumber: "DN-2024-001",
    orderNumber: "ORD-2024-001",
    customerName: "Mwalimu John Kasonga",
    customerPhone: "+255712345678",
    customerAddress: "Mwanza, Tanzania",
    items: [
      {
        description: "Fertilizer A (50kg)",
        quantity: 10,
        delivered: 10,
      },
    ],
    status: "Delivered",
    deliveryDate: "2024-01-20",
    deliveredDate: "2024-01-20",
    driverName: "Hassan Mwalimu",
    vehicleNumber: "T123 ABC",
    subsidiaryId: 1,
  },
  {
    id: 2,
    deliveryNumber: "DN-2024-002",
    orderNumber: "ORD-2024-002",
    customerName: "Mama Grace Mwangi",
    customerPhone: "+255723456789",
    customerAddress: "Dar es Salaam, Tanzania",
    items: [
      {
        description: "Engine Oil (5L)",
        quantity: 25,
        delivered: 25,
      },
    ],
    status: "In Transit",
    deliveryDate: "2024-01-18",
    driverName: "John Kiprotich",
    vehicleNumber: "T456 DEF",
    subsidiaryId: 2,
  },
  {
    id: 3,
    deliveryNumber: "DN-2024-003",
    orderNumber: "ORD-2024-003",
    customerName: "Bwana Ahmed Hassan",
    customerPhone: "+255734567890",
    customerAddress: "Arusha, Tanzania",
    items: [
      {
        description: "Maize Flour (25kg)",
        quantity: 50,
        delivered: 50,
      },
    ],
    status: "Delivered",
    deliveryDate: "2024-01-18",
    deliveredDate: "2024-01-18",
    driverName: "Peter Mwangi",
    vehicleNumber: "T789 GHI",
    subsidiaryId: 3,
  },
];

const DeliveryNotes: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSubsidiary, setSelectedSubsidiary] = useState("all");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedDeliveryNote, setSelectedDeliveryNote] =
    useState<DeliveryNote | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const deliveryNotePreviewRef = useRef<HTMLDivElement>(null);

  const filteredDeliveryNotes = mockDeliveryNotes.filter((note) => {
    const matchesSearch =
      note.deliveryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || note.status === selectedStatus;

    let matchesSubsidiary = true;
    if (currentUser?.role !== "Owner") {
      matchesSubsidiary = note.subsidiaryId === currentUser?.subsidiaryId;
    } else if (selectedSubsidiary !== "all") {
      matchesSubsidiary = note.subsidiaryId === parseInt(selectedSubsidiary);
    }

    return matchesSearch && matchesStatus && matchesSubsidiary;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "In Transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "In Transit":
        return <Truck className="h-4 w-4" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "Failed":
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handlePreviewDeliveryNote = (note: DeliveryNote) => {
    setSelectedDeliveryNote(note);
    setShowPreviewModal(true);
  };

  const handleCreateDeliveryNote = (data: any) => {
    // In a real app, would send this to an API
    // For now, just logging the data
    console.log("Creating new delivery note:", data);

    // Create a new delivery note from form data
    const newDeliveryNote: DeliveryNote = {
      id: Math.max(...mockDeliveryNotes.map((d) => d.id)) + 1,
      deliveryNumber: `DN-${new Date().getFullYear()}-${String(
        mockDeliveryNotes.length + 1
      ).padStart(3, "0")}`,
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress,
      items: data.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        delivered: 0, // Initially nothing is delivered
      })),
      status: "Pending",
      deliveryDate: data.deliveryDate,
      driverName: data.driverName,
      vehicleNumber: data.vehicleNumber,
      subsidiaryId: parseInt(data.subsidiaryId),
    };

    // In a real app, this would be handled properly with state management
    // For this demo, we'll use a workaround to add to our mock data
    (mockDeliveryNotes as any).push(newDeliveryNote);

    // Force re-render by updating state
    setSearchTerm(searchTerm);

    // Open the preview modal for the newly created delivery note
    setSelectedDeliveryNote(newDeliveryNote);
    setShowPreviewModal(true);
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!deliveryNotePreviewRef.current || !selectedDeliveryNote) return;

    const fileName = `${selectedDeliveryNote.deliveryNumber}.pdf`;
    const result = await generatePDFFromElement(
      deliveryNotePreviewRef.current,
      fileName
    );

    if (result.success) {
      console.log("Delivery note PDF generated successfully!");
    } else {
      console.error("Failed to generate delivery note PDF:", result.error);
    }
  };

  // Handle WhatsApp sharing
  const handleWhatsAppShare = () => {
    if (!selectedDeliveryNote) return;

    const message = `
Hello ${selectedDeliveryNote.customerName},

Your delivery ${selectedDeliveryNote.deliveryNumber} for order ${selectedDeliveryNote.orderNumber} is scheduled for ${selectedDeliveryNote.deliveryDate}.

Delivery Address: ${selectedDeliveryNote.customerAddress}
Driver: ${selectedDeliveryNote.driverName}
Vehicle: ${selectedDeliveryNote.vehicleNumber}

Please prepare to receive your delivery.
Thank you,
Zakayo Holdings Management System
    `.trim();

    shareViaWhatsApp(selectedDeliveryNote.customerPhone, message);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Delivery Notes</h1>
          <p className="text-muted-foreground">
            Track and manage product deliveries
          </p>
        </div>
        <Button
          className="bg-zakayo-primary hover:bg-zakayo-primary/90"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Delivery Note
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Deliveries
                </p>
                <p className="text-2xl font-bold">
                  {filteredDeliveryNotes.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {
                    filteredDeliveryNotes.filter((d) => d.status === "Pending")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold">
                  {
                    filteredDeliveryNotes.filter(
                      (d) => d.status === "In Transit"
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">
                  {
                    filteredDeliveryNotes.filter(
                      (d) => d.status === "Delivered"
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search delivery notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-input rounded-md bg-background min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Failed">Failed</option>
            </select>
            {currentUser?.role === "Owner" && (
              <select
                value={selectedSubsidiary}
                onChange={(e) => setSelectedSubsidiary(e.target.value)}
                className="px-4 py-2 border border-input rounded-md bg-background min-w-[180px]"
              >
                <option value="all">All Subsidiaries</option>
                {subsidiaries.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Notes List */}
      <div className="grid gap-4">
        {filteredDeliveryNotes.map((note) => {
          const subsidiary = subsidiaries.find(
            (s) => s.id === note.subsidiaryId
          );
          return (
            <Card key={note.id} className="hover-lift card-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {note.deliveryNumber}
                      </h3>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          note.status
                        )}`}
                      >
                        {getStatusIcon(note.status)}
                        {note.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Order: </span>
                        <span className="font-medium">{note.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Customer:{" "}
                        </span>
                        <span className="font-medium">{note.customerName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Driver: </span>
                        <span className="font-medium">{note.driverName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vehicle: </span>
                        <span className="font-medium">
                          {note.vehicleNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Delivery Date:{" "}
                        </span>
                        <span className="font-medium">{note.deliveryDate}</span>
                      </div>
                      {note.deliveredDate && (
                        <div>
                          <span className="text-muted-foreground">
                            Delivered:{" "}
                          </span>
                          <span className="font-medium">
                            {note.deliveredDate}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Address: </span>
                      <span className="font-medium">
                        {note.customerAddress}
                      </span>
                    </div>

                    {subsidiary && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subsidiary.color }}
                        />
                        <span className="text-sm font-medium">
                          {subsidiary.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="text-xl font-bold">
                        {note.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewDeliveryNote(note)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delivery Note Preview Modal */}
      {showPreviewModal && selectedDeliveryNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Delivery Note</CardTitle>
                  <CardDescription>
                    {selectedDeliveryNote.deliveryNumber}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowPreviewModal(false)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6" ref={deliveryNotePreviewRef}>
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-zakayo-primary to-zakayo-secondary bg-clip-text text-transparent">
                  Zakayo Holdings
                </h2>
                <p className="text-sm text-muted-foreground">
                  Business Management System
                </p>
                <h3 className="text-lg font-semibold">DELIVERY NOTE</h3>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Deliver To:</h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">
                      {selectedDeliveryNote.customerName}
                    </p>
                    <p>{selectedDeliveryNote.customerPhone}</p>
                    <p>{selectedDeliveryNote.customerAddress}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Delivery Note #:</span>{" "}
                      {selectedDeliveryNote.deliveryNumber}
                    </p>
                    <p>
                      <span className="font-medium">Order #:</span>{" "}
                      {selectedDeliveryNote.orderNumber}
                    </p>
                    <p>
                      <span className="font-medium">Delivery Date:</span>{" "}
                      {selectedDeliveryNote.deliveryDate}
                    </p>
                    <p>
                      <span className="font-medium">Driver:</span>{" "}
                      {selectedDeliveryNote.driverName}
                    </p>
                    <p>
                      <span className="font-medium">Vehicle:</span>{" "}
                      {selectedDeliveryNote.vehicleNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium">Description</th>
                      <th className="text-right p-3 font-medium">Ordered</th>
                      <th className="text-right p-3 font-medium">Delivered</th>
                      <th className="text-right p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDeliveryNote.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{item.description}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">{item.delivered}</td>
                        <td className="p-3 text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.quantity === item.delivered
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }`}
                          >
                            {item.quantity === item.delivered
                              ? "Complete"
                              : "Partial"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t">
                <div>
                  <h4 className="font-semibold mb-4">Driver Signature</h4>
                  <div className="border-b border-gray-300 h-16 mb-2"></div>
                  <p className="text-sm text-center">
                    {selectedDeliveryNote.driverName}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Customer Signature</h4>
                  <div className="border-b border-gray-300 h-16 mb-2"></div>
                  <p className="text-sm text-center">Customer Name & Date</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  className="bg-zakayo-primary hover:bg-zakayo-primary/90"
                  onClick={handleWhatsAppShare}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Delivery Note Modal */}
      <CreateDeliveryNoteForm
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateDeliveryNote}
      />
    </div>
  );
};

export default DeliveryNotes;
