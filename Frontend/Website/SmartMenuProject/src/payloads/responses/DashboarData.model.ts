import { UserData } from "./UserData.model";

interface listRevenue {
  year: number;
  month: number;
  totalRevenue: string;
}

interface recentTransactions {
  paymentId: number;
  email: string;
  amount: string;
  paymentDate: Date;
  transactionId: string;
  status: number;
}

interface brandStatistics {
  year: number;
  month: number;
  totalBrands: number;
}

export interface DashboardData {
  numberOfUsers: number;
  totalRevenue: string;
  numberOfBrands: number;
  listRevenue: listRevenue[];
  listBrandCounts: brandStatistics[];
  latestUsers: UserData[];
  recentTransactions: recentTransactions[];
}
