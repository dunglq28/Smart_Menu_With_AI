import { ProductData } from "./ProductData.model";

export interface MenuData {
  menuId: number;
  menuCode: string;
  menuImage: string;
  createDate: Date;
  description: string;
  priority: number;
  menuLists: MenuLists[];
  isActive: boolean;
  menuSegments: MenuSegments[];
}

export interface MenuSegments {
  menuId: number;
  segmentId: number;
  priority: number;
}

export interface MenuLists {
  menuId: number;
  listId: number;
  listIndex: number;
  list: ListData;
}

export interface ListData {
  listId: number;
  listCode: string;
  listName: string;
  totalProduct: number;
  productLists: productLists[];
}

export interface productLists {
  listId: number;
  indexInList: number;
  product: ProductData;
}

export interface IndexProduct {
  productId: number;
  indexInList: number;
}

export interface ListProductDetails {
  listId: number;
  indexProducts: IndexProduct[];
}
