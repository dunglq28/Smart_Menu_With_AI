export interface BrandForm {
  brandName: {
    value: string;
    errorMessage: string;
  };
  image: {
    value: File | null;
    errorMessage: string;
  };
  imageUrl?: {
    value: string;
    errorMessage: string;
  };
}
