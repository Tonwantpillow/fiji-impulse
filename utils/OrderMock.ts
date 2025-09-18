import { Order } from "./Order";
import { ProductsMock } from "./ProducMock";

export const MockOrder: Order[] = [
  {
    orderId: "ORD123456",
    orderDate: "2024-06-15T10:30:00Z",
    orderStatus: "Shipped",
    address: "123 Main St, Springfield, IL 62701",
    orderItems: [
      { prod: ProductsMock[0], quantity: 2 },
      { prod: ProductsMock[1], quantity: 1 },
    ],
  },
  {
    orderId: "ORD123457",
    orderDate: "2024-06-16T14:45:00Z",
    orderStatus: "Processing",
    address: "456 Elm St, Metropolis, IL 62960",
    orderItems: [
      { prod: ProductsMock[2], quantity: 1 },
      { prod: ProductsMock[3], quantity: 3 },
    ],
  },
  {
    orderId: "ORD123458",
    orderDate: "2024-06-17T09:15:00Z",
    orderStatus: "Delivered",
    address: "789 Oak St, Gotham, NY 10001",
    orderItems: [
      { prod: ProductsMock[4], quantity: 5 },
      { prod: ProductsMock[5], quantity: 2 },
    ],
  },

]