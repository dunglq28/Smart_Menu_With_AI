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

export interface AdminDashboardData {
  numberOfUsers: number;
  totalRevenue: string;
  numberOfBrands: number;
  listRevenue: listRevenue[];
  listBrandCounts: brandStatistics[];
  latestUsers: UserData[];
  recentTransactions: recentTransactions[];
}
// ----------------------------------------------------------------

interface timesRecomments {
  menuId: number;
  times: number;
  description: string;
}

interface productsByCate {
  numberOfProduct: number;
  cateName: string;
}

export interface BrandDashboardData {
  store: number;
  product: number;
  menus: number;
  timesRecomments: timesRecomments[];
  productsByCate: productsByCate[];
}
