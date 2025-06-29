import React, { useState, useRef } from "react";
import {
  Plus,
  Eye,
  Download,
  Send,
  Search,
  Filter,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
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
import { CreateInvoiceForm } from "./CreateInvoiceForm";
import { generatePDFFromElement, shareViaWhatsApp } from "../lib/pdfUtils";

interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  issueDate: string;
  dueDate: string;
  subsidiaryId: number;
}

const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-2024-001",
    customerName: "Mwalimu John Kasonga",
    customerPhone: "+255712345678",
    customerEmail: "john.kasonga@gmail.com",
    items: [
      {
        description: "Fertilizer A (50kg)",
        quantity: 10,
        unitPrice: 45000,
        total: 450000,
      },
    ],
    subtotal: 450000,
    tax: 81000,
    total: 531000,
    status: "Paid",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    subsidiaryId: 1,
  },
  {
    id: 2,
    invoiceNumber: "INV-2024-002",
    customerName: "Mama Grace Mwangi",
    customerPhone: "+255723456789",
    customerEmail: "grace.mwangi@yahoo.com",
    items: [
      {
        description: "Engine Oil (5L)",
        quantity: 25,
        unitPrice: 18000,
        total: 450000,
      },
    ],
    subtotal: 450000,
    tax: 81000,
    total: 531000,
    status: "Sent",
    issueDate: "2024-01-16",
    dueDate: "2024-02-16",
    subsidiaryId: 2,
  },
  {
    id: 3,
    invoiceNumber: "INV-2024-003",
    customerName: "Bwana Ahmed Hassan",
    customerPhone: "+255734567890",
    customerEmail: "ahmed.hassan@hotmail.com",
    items: [
      {
        description: "Maize Flour (25kg)",
        quantity: 50,
        unitPrice: 35000,
        total: 1750000,
      },
    ],
    subtotal: 1750000,
    tax: 315000,
    total: 2065000,
    status: "Overdue",
    issueDate: "2024-01-10",
    dueDate: "2024-02-10",
    subsidiaryId: 3,
  },
];

const Invoices: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSubsidiary, setSelectedSubsidiary] = useState("all");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const invoicePreviewRef = useRef<HTMLDivElement>(null);

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || invoice.status === selectedStatus;

    let matchesSubsidiary = true;
    if (currentUser?.role !== "Owner") {
      matchesSubsidiary = invoice.subsidiaryId === currentUser?.subsidiaryId;
    } else if (selectedSubsidiary !== "all") {
      matchesSubsidiary = invoice.subsidiaryId === parseInt(selectedSubsidiary);
    }

    return matchesSearch && matchesStatus && matchesSubsidiary;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "Sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft":
        return <FileText className="h-4 w-4" />;
      case "Sent":
        return <Send className="h-4 w-4" />;
      case "Paid":
        return <CheckCircle className="h-4 w-4" />;
      case "Overdue":
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handlePreviewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPreviewModal(true);
  };

  const handleCreateInvoice = (data: any) => {
    // In a real app, would send this to an API
    // For now, just logging the data
    console.log("Creating new invoice:", data);

    // Create a new invoice from form data
    const newInvoice: Invoice = {
      id: Math.max(...mockInvoices.map((i) => i.id)) + 1,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(
        mockInvoices.length + 1
      ).padStart(3, "0")}`,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      items: data.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      status: "Draft",
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      subsidiaryId: parseInt(data.subsidiaryId),
    };

    // In a real app, this would be handled properly with state management
    // For this demo, we'll use a workaround to add to our mock data
    (mockInvoices as any).push(newInvoice);

    // Force re-render by updating state
    setSearchTerm(searchTerm);

    // Open the preview modal for the newly created invoice
    setSelectedInvoice(newInvoice);
    setShowPreviewModal(true);
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!invoicePreviewRef.current || !selectedInvoice) return;

    const fileName = `${selectedInvoice.invoiceNumber}.pdf`;
    const result = await generatePDFFromElement(
      invoicePreviewRef.current,
      fileName
    );

    if (result.success) {
      console.log("PDF generated successfully!");
    } else {
      console.error("Failed to generate PDF:", result.error);
    }
  };

  // Handle WhatsApp sharing
  const handleWhatsAppShare = () => {
    if (!selectedInvoice) return;

    const message = `
Hello ${selectedInvoice.customerName},

Your invoice ${
      selectedInvoice.invoiceNumber
    } for TSh ${selectedInvoice.total.toLocaleString()} is ready.
Issue Date: ${selectedInvoice.issueDate}
Due Date: ${selectedInvoice.dueDate}

Thank you for your business.
Zakayo Holdings Management System
    `.trim();

    shareViaWhatsApp(selectedInvoice.customerPhone, message);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">
            Manage customer invoices and payments
          </p>
        </div>
        <Button
          className="bg-zakayo-primary hover:bg-zakayo-primary/90"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold">{filteredInvoices.length}</p>
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
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold">
                  {filteredInvoices.filter((i) => i.status === "Paid").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Clock className="h-5 w-5 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">
                  {
                    filteredInvoices.filter((i) => i.status === "Overdue")
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
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  TSh{" "}
                  {(
                    filteredInvoices.reduce((sum, i) => sum + i.total, 0) /
                    1000000
                  ).toFixed(1)}
                  M
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
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-input rounded-md bg-background min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
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

      {/* Invoices List */}
      <div className="grid gap-4">
        {filteredInvoices.map((invoice) => {
          const subsidiary = subsidiaries.find(
            (s) => s.id === invoice.subsidiaryId
          );
          return (
            <Card key={invoice.id} className="hover-lift card-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {invoice.invoiceNumber}
                      </h3>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Customer:{" "}
                        </span>
                        <span className="font-medium">
                          {invoice.customerName}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email: </span>
                        <span className="font-medium">
                          {invoice.customerEmail}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Issue Date:{" "}
                        </span>
                        <span className="font-medium">{invoice.issueDate}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Due Date:{" "}
                        </span>
                        <span className="font-medium">{invoice.dueDate}</span>
                      </div>
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
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-xl font-bold">
                        TSh {invoice.total.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewInvoice(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Invoice Preview Modal */}
      {showPreviewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Invoice Preview</CardTitle>
                  <CardDescription>
                    {selectedInvoice.invoiceNumber}
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
            <CardContent className="p-6 space-y-6" ref={invoicePreviewRef}>
              {/* Invoice Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-zakayo-primary to-zakayo-secondary bg-clip-text text-transparent">
                  Zakayo Holdings
                </h2>
                <p className="text-sm text-muted-foreground">
                  Business Management System
                </p>
                <h3 className="text-lg font-semibold">INVOICE</h3>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Bill To:</h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">
                      {selectedInvoice.customerName}
                    </p>
                    <p>{selectedInvoice.customerPhone}</p>
                    <p>{selectedInvoice.customerEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Invoice #:</span>{" "}
                      {selectedInvoice.invoiceNumber}
                    </p>
                    <p>
                      <span className="font-medium">Issue Date:</span>{" "}
                      {selectedInvoice.issueDate}
                    </p>
                    <p>
                      <span className="font-medium">Due Date:</span>{" "}
                      {selectedInvoice.dueDate}
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
                      <th className="text-right p-3 font-medium">Qty</th>
                      <th className="text-right p-3 font-medium">Unit Price</th>
                      <th className="text-right p-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{item.description}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">
                          TSh {item.unitPrice.toLocaleString()}
                        </td>
                        <td className="p-3 text-right">
                          TSh {item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>TSh {selectedInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span>TSh {selectedInvoice.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>TSh {selectedInvoice.total.toLocaleString()}</span>
                  </div>
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

      {/* Create Invoice Modal */}
      <CreateInvoiceForm
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateInvoice}
      />
    </div>
  );
};

export default Invoices;
