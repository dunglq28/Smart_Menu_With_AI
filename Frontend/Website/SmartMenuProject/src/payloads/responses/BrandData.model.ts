export interface BrandData {
  brandId: number;
  brandCode: string;
  brandName: string;
  userId: number;
  createDate: Date;
  imageUrl: string;
  imageName: string;
}

export interface LimitBrandData {
  maxMenu: number;
  maxAccount: number;
  numberMenu: number;
  numberAccount: number;
}
