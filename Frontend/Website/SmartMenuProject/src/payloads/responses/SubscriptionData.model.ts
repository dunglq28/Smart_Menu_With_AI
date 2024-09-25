import { PaymentData } from "./PaymentData.model";

export interface SubscriptionData {
  userId: number;
  subscriptionId: number;
  startDate: Date | null;
  endDate: Date | null;
  planId: string;
  planName: string;
  price: string;
  maxMenu: number;
  maxAccount: number;
  menuCount: number;
  storeCount: number;
  payments: PaymentData[];
}
