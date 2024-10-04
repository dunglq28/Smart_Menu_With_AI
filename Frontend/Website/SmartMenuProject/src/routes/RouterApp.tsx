import Login from "../pages/Login/Login";
import User from "../pages/User";
import Brand from "../pages/Brand";
import Products from "../pages/Product";
import Menu from "../pages/Menu";
import Settings from "../pages/Setting";
import New from "../pages/New";
import Profile from "../pages/Profile";
import { HeaderOnly } from "../layouts";
import Branch from "../pages/Branch";
import Category from "../pages/Category";
import CustomerSegment from "../pages/CustomerSegment";
import CreateMenu from "../pages/Menu/CreateMenu";
import AdminDashboard from "../pages/AdminDashboard";
import BrandDashboard from "../pages/BrandDashboard";
import PaymentHistory from "../pages/Payment/PaymentHistory"; 
import GuestLayout from "../layouts/GuestLayout";
import LandingPage from "../pages/LandingPage";
import BuyingGuide from "../pages/Payment/BuyingGuide"; 
import PaymentInfor from "../pages/Payment/PaymentInfor";
import PaymentStepperLayout from "../layouts/PaymentStepperLayout";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PaymentFailure from "../pages/Payment/PaymentFail";
import PaymentCancel from "../pages/Payment/PaymentCancel";
import RenewPackage from "../pages/Payment/RenewPackage";

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
  { path: "/new", component: New },
  { path: "/profile", component: Profile, layout: HeaderOnly },
  // { path: "/newBranch", component: New },
];

export const privateRoutes: RouteItem[] = [];
