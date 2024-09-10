import { BranchForm } from "../models/BranchForm.model";
import { BrandForm } from "../models/BrandForm.model";
import { UserForm } from "../models/UserForm.model";
import { DashboardData } from "../payloads/responses/DashboarData.model";

export const getInitialUserData = (): UserForm => ({
  fullName: {
    value: "",
    errorMessage: "",
  },
  userName: {
    value: "",
    errorMessage: "",
  },
  phoneNumber: {
    value: "",
    errorMessage: "",
  },
  DOB: {
    value: null,
    errorMessage: "",
  },
  gender: {
    value: "",
    errorMessage: "",
  },
  isActive: {
    value: 0,
    errorMessage: "",
  },
});

export const getInitialBrandData = (): BrandForm => ({
  brandName: { value: "", errorMessage: "" },
  image: { value: null, errorMessage: "" },
});

export const getInitialBranchData = (): BranchForm => ({
  brandName: { id: "", value: "", errorMessage: "" },
  city: { id: "", name: "", errorMessage: "" },
  district: { id: "", name: "", errorMessage: "" },
  ward: { id: "", name: "", errorMessage: "" },
  address: { value: "", errorMessage: "" },
});

export const getInitialDashboardData = (): DashboardData => ({
  numberOfUsers: 0,
  totalRevenue: "0",
  listRevenue: [],
  listBrandCounts: [],
  latestUsers: [],
  recentTransactions: [],
});
