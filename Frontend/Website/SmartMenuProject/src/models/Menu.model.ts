import { ProductData } from "./../payloads/responses/ProductData.model";

export interface Menu {
  isActive: boolean;
  segmentId: { value: number[]; errorMessage: string };
  description: { value: string; errorMessage: string };
  menuImage: { value: File | null; errorMessage: string };
  priority: { value: number; errorMessage: string };
}

export interface MenuList {
  listId: number;
  listName: string;
  productData: ProductData[];
  listIndex: number;
  maxProduct: number;
}
