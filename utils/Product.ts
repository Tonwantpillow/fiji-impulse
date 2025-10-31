export interface Product {
  orderQuantity: number | (() => number);
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}