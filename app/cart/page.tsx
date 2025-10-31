'use client'

import { useSession } from "@/contexts/SessionContext";
import AddedProduct from "@/interface/components/AddedProduct";
import { Product } from "@/utils/Product";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface OrderDetail {
    orderDetailId: number;
    orderId: number;
    modelId: number;
    orderQuantity: number;
    totalPrice: number;
    model_name: string;
  }

interface CartProduct extends Product {
  orderQuantity: number;
  totalPrice: number;
  orderId: number;
  orderDetailId: number;
}

export default function CartPage() {

  const {user, isLoading, showLoginModal, setShowLoginModal} = useSession();

  const [totalCart, setTotalCart] = useState<number>(0)
  const [addedProds, setAddedProds] = useState<CartProduct[]>([])
  const [showLoginRequired, setShowLoginRequired] = useState<boolean>(false)
  const [orderDetails, setOrderDetails] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      setShowLoginModal(true);
      setShowLoginRequired(true);
    }
  }, [user, isLoading, setShowLoginModal]);

  useEffect(() => {
    if (showLoginRequired && !showLoginModal && !user) {
      // Modal was closed without login
      // router.push('/');
    }
  }, [showLoginModal, showLoginRequired, user]);

  useEffect(() => {
    if (user) {
      console.log(user.id);
      fetchOrderDetails();
    }
  }, [user]);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/order-details/order/not-paid/${user?.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (res.data) {
        // Parse the specific response structure:
        // Key: "OrderDetail{orderDetailId=25, orderId=25, modelId=1, orderQuantity=3, totalPrice=7500.00}"
        // Value: "MiniSeal 200"
        const orderDetailsArray: OrderDetail[] = [];
        const cartProducts: CartProduct[] = [];
        let total = 0;

        Object.entries(res.data).forEach(([key, modelName]) => {
          // Parse the key to extract order details
          const match = key.match(/orderDetailId=(\d+).*orderId=(\d+).*modelId=(\d+).*orderQuantity=(\d+).*totalPrice=([\d.]+)/);

          if (match) {
            const orderDetail: OrderDetail = {
              orderDetailId: parseInt(match[1]),
              orderId: parseInt(match[2]),
              modelId: parseInt(match[3]),
              orderQuantity: parseInt(match[4]),
              totalPrice: parseFloat(match[5]),
              model_name: modelName as string
            };

            orderDetailsArray.push(orderDetail);

            // Map to CartProduct format for AddedProduct component
            const cartProduct: CartProduct = {
              id: orderDetail.modelId,
              name: orderDetail.model_name,
              price: orderDetail.totalPrice / orderDetail.orderQuantity, // Calculate unit price
              imageUrl: `/images/${orderDetail.model_name.replace(/\s+/g, '').toLowerCase()}.jpg`, // Clean image name
              description: '',
              orderQuantity: orderDetail.orderQuantity,
              totalPrice: orderDetail.totalPrice,
              orderId: orderDetail.orderId,
              orderDetailId: orderDetail.orderDetailId
            };

            cartProducts.push(cartProduct);
            total += orderDetail.totalPrice;
          }
        });

        setOrderDetails(orderDetailsArray);
        setAddedProds(cartProducts);
        setTotalCart(total);
      }
    } catch (error) {
      setOrderDetails([]);
      setAddedProds([]);
      setTotalCart(0);
    }
  }

  return (
    <div className="flex flex-col gap-2 justify-center mt-10">
      <div className="flex gap-[50px] py-[10px] px-[10px] items-center">
        <ChevronLeft/>
        <h2 className="header3-bold">ตะกร้าสินค้า({orderDetails.reduce((sum, item) => sum + item.orderQuantity, 0)})</h2>
      </div>
      <div className="flex p-[10px]">
        {orderDetails.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-20">
            <p className="text-gray-400 text-lg">ไม่มีสินค้าในตะกร้า</p>
          </div>
        ) : (
          <div className="flex flex-col gap-[5px] w-full">
            {addedProds.map((product) => (
              <AddedProduct key={product.id} {...product} />
            ))} 
          </div>
        )}
        <div className="w-full flex flex-col justify-end p-[20px]">
        <div className="mt-8 p-6 bg-primary-lighter rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg font-medium">ยอดรวม:</span>
                  <span className="text-white text-xl font-bold">{totalCart.toFixed(2)} ฿</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-primary-default hover:bg-primary-darker text-white py-4 rounded-lg transition-colors font-medium text-lg">
                ดำเนินการสั่งซื้อ
              </button>
            </div>
        </div>
      </div>

    </div>
  )
}