import { Product } from "./Product";

export interface Order {
  orderId: string;
  orderDate: string; // ISO date string
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  address: string;
  orderItems: Array<{ prod: Product; quantity: number;}>;
}
