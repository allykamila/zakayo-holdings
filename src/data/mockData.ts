
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Owner' | 'Manager' | 'Staff';
  subsidiaryId?: number;
  avatar?: string; // Added avatar property
}

export interface Subsidiary {
  id: number;
  name: string;
  description: string;
  color: string;
  products: string[];
}

export const users: User[] = [
  {
    id: 1,
    name: "Owner",
    email: "owner@zakayo.com",
    role: "Owner",
    avatar: "OW"
  },
  {
    id: 2,
    name: "John Manager",
    email: "john@agrovet.com",
    role: "Manager",
    subsidiaryId: 1,
    avatar: "JM"
  },
  {
    id: 3,
    name: "Mary Sales",
    email: "mary.sales@example.com",
    role: "Staff",
    subsidiaryId: 2,
    avatar: "MS"
  },
  {
    id: 4,
    name: "Eve Williams",
    email: "eve.williams@example.com",
    role: "Staff",
    subsidiaryId: 2,
    avatar: "EW"
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "Staff",
    subsidiaryId: 3,
    avatar: "CB"
  },
  {
    id: 6,
    name: "Diana Miller",
    email: "diana.miller@example.com",
    role: "Staff",
    subsidiaryId: 4,
    avatar: "DM"
  }
];

export const subsidiaries: Subsidiary[] = [
  {
    id: 1,
    name: "Zakayo Agrovet",
    description: "Agricultural products and fertilizers",
    color: "#10B981",
    products: ["Fertilizer A", "Fertilizer B", "Seeds", "Pesticides"]
  },
  {
    id: 2,
    name: "Zakayo Lubricants",
    description: "Motor oils and lubricants",
    color: "#3B82F6",
    products: ["Engine Oil", "Brake Fluid", "Transmission Oil", "Grease"]
  },
  {
    id: 3,
    name: "Zakayo Sembe",
    description: "Maize flour and grain products",
    color: "#F59E0B",
    products: ["Maize Flour", "Wheat Flour", "Rice", "Beans"]
  },
  {
    id: 4,
    name: "Zakayo Wine & Spirit",
    description: "Alcoholic beverages and spirits",
    color: "#8B5CF6",
    products: ["Local Beer", "Wine", "Spirits", "Traditional Brew"]
  }
];

// Mock dashboard statistics
export const getDashboardStats = (subsidiaryId: number | null) => {
  const baseStats = {
    totalSales: subsidiaryId ? 450000 : 1850000,
    totalOrders: subsidiaryId ? 23 : 89,
    pendingOrders: subsidiaryId ? 5 : 18,
    deliveredOrders: subsidiaryId ? 18 : 71,
    totalInvoices: subsidiaryId ? 28 : 105,
    paidInvoices: subsidiaryId ? 20 : 78,
    pendingInvoices: subsidiaryId ? 6 : 21,
    overdueInvoices: subsidiaryId ? 2 : 6
  };

  return baseStats;
};
