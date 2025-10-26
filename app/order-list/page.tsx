"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import axios from "axios";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  orderDate: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrderListPage() {
  const { user, isLoading, setShowLoginModal } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to login modal if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      setShowLoginModal(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  }, [user, isLoading, setShowLoginModal]);

  // Fetch orders when user is authenticated
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setError("");
    if (user) {
    try {
      const response = await axios.get(`http://localhost:8081/orders/user/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.data) {
        setOrders(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching orders:", err);

      if (err.response?.status === 401) {
        setError("กรุณาเข้าสู่ระบบใหม่");
      } else if (err.response?.status === 404) {
        setError("ไม่พบข้อมูลคำสั่งซื้อ");
      } else {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ");
      }
    } finally {
      setOrdersLoading(false);
    }
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">กำลังตรวจสอบสถานะ...</div>
      </div>
    );
  }

  // Don't render order list if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">กรุณาเข้าสู่ระบบ...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="header2-bold text-white mb-6">ประวัติการสั่งซื้อ</h1>

      {ordersLoading && (
        <div className="text-white text-center py-8">
          กำลังดึงข้อมูลคำสั่งซื้อ...
        </div>
      )}

      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!ordersLoading && !error && (
        <div>
          {orders.length === 0 ? (
            <div className="text-white text-center py-12">
              <p className="text-xl mb-4">ยังไม่มีประวัติการสั่งซื้อ</p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-primary-default text-white px-6 py-2 rounded hover:bg-primary-darker transition-colors"
              >
                ไปยังหน้าหลัก
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-semibold">คำสั่งซื้อ #{order.orderNumber}</h3>
                      <p className="text-gray-300 text-sm">วันที่: {new Date(order.orderDate).toLocaleDateString('th-TH')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{order.totalAmount.toFixed(2)} บาท</p>
                      <p className="text-sm text-yellow-400">{order.status}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-600 pt-3">
                    <h4 className="text-white font-medium mb-2">รายการสินค้า:</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-gray-300 text-sm">
                          <span>{item.productName} x{item.quantity}</span>
                          <span>{(item.price * item.quantity).toFixed(2)} บาท</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}