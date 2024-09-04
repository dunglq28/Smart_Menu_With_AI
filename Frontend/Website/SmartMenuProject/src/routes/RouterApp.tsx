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

interface RouteItem {
  path: string;
  component: () => JSX.Element;
  layout?: React.ComponentType<any> | null;
}

export const publicRoutes: RouteItem[] = [
  { path: "/", component: Login, layout: null },
  { path: "/login", component: Login, layout: null },
  { path: "/users", component: User },
  { path: "/brands", component: Brand },
  { path: "/branches", component: Branch },
  { path: "/branches/:brandName", component: Branch },
  { path: "/customerSegment", component: CustomerSegment },
  { path: "/products", component: Products },
  { path: "/categories", component: Category },
  { path: "/categories/:brandName", component: Category },
  { path: "/menu", component: Menu },
  { path: "/menu/create-menu", component: CreateMenu, layout: HeaderOnly },
  { path: "/menu/update-menu", component: CreateMenu, layout: HeaderOnly },
  { path: "/settings", component: Settings },
  { path: "/new", component: New },
  { path: "/profile", component: Profile, layout: HeaderOnly },
  // { path: "/newBranch", component: New },
];

export const privateRoutes: RouteItem[] = [];
