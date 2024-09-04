export interface ProductForm {
  category: { value: number | null; errorMessage: string };
  productName: { value: string; errorMessage: string };
  image: { value: File | null; errorMessage: string };
  imageUrl?: { value: string; errorMessage: string };
  description: { value: string; errorMessage: string };
  price: { value: number | null; errorMessage: string };
}
