export interface PaymentData {
  paymentId: number;
  amount: string;
  status: number;
  paymentDate: Date;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  email: string;
  subscriptionId: number;
  planId: number;
  planName: string;
}
