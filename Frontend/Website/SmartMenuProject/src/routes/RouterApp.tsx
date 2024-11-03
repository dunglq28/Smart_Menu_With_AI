import {
  Login,
  User,
  Brand,
  Products,
  Menu,
  Settings,
  Profile,
  Branch,
  Category,
  CustomerSegment,
  CreateMenu,
  AdminDashboard,
  BrandDashboard,
  PaymentHistory,
  LandingPage,
  BuyingGuide,
  PaymentInfor,
  PaymentSuccess,
  PaymentFailure,
  PaymentCancel,
  RenewPackage,
} from "@/pages";

import { GuestLayout, PaymentStepperLayout, HeaderOnly } from "@/layouts";

interface RouteItem {
  path: string;
  component: () => JSX.Element;
  layout?: React.ComponentType<any> | null;
}

export const publicRoutes: RouteItem[] = [
  { path: "/", component: LandingPage, layout: GuestLayout },
  { path: "/login", component: Login, layout: GuestLayout },
  { path: "/payment/payment-infor", component: PaymentInfor, layout: PaymentStepperLayout },
  { path: "/payment/payment-guide", component: BuyingGuide, layout: PaymentStepperLayout },
  { path: "/payment/payment-success", component: PaymentSuccess, layout: PaymentStepperLayout },
  { path: "/payment/payment-failure", component: PaymentFailure, layout: PaymentStepperLayout },
  { path: "/payment/payment-cancel", component: PaymentCancel, layout: PaymentStepperLayout },
  { path: "/payment/renew-package", component: RenewPackage, layout: PaymentStepperLayout },
  { path: "/admin-dashboard", component: AdminDashboard },
  { path: "/brand-dashboard", component: BrandDashboard },
  { path: "/users", component: User },
  { path: "/payment-history", component: PaymentHistory },
  { path: "/brands", component: Brand },
  { path: "/branches", component: Branch },
  { path: "/branches/:brandName", component: Branch },
  { path: "/customerSegment", component: CustomerSegment },
  { path: "/products", component: Products },
  { path: "/categories", component: Category },
  { path: "/categories/:brandName", component: Category },
  { path: "/menu", component: Menu },
  { path: "/menu/:brandName", component: Menu },
  { path: "/menu/create-menu", component: CreateMenu, layout: HeaderOnly },
  { path: "/menu/update-menu", component: CreateMenu, layout: HeaderOnly },
  { path: "/settings", component: Settings },
  { path: "/profile", component: Profile, layout: HeaderOnly },
];

export const privateRoutes: RouteItem[] = [];
