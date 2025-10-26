"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import FilterHeader from "@/interface/components/FilterHeader";
import { ChevronLeft, ChevronRight, SearchIcon } from "lucide-react";
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

export default function OrderList() {
  const { user, isLoading, showLoginModal, setShowLoginModal } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  // Show login modal if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      setShowLoginModal(true);
      setShowLoginRequired(true);
    }
  }, [user, isLoading, setShowLoginModal]);

  // Check if login modal is closed without user logging in
  useEffect(() => {
    if (showLoginRequired && !showLoginModal && !user) {
      // Modal was closed without login
    }
  }, [showLoginModal, showLoginRequired, user]);

  // Fetch orders when user is authenticated
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setError("");
    if (!user) {
      setError("ไม่พบข้อมูลผู้ใช้");
      setOrdersLoading(false);
      return;
    }

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
  };

  // Filter orders based on search term
  const filteredOrders = (orders || []).filter(order =>
    order && order.orderNumber && order.items && (
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item && item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  // Count orders by status
  const statusCounts = {
    all: (orders || []).length,
    preparing: (orders || []).filter(o => o && o.status === "กำลังเตรียมสินค้า").length,
    shipping: (orders || []).filter(o => o && o.status === "กำลังจัดส่ง").length,
    completed: (orders || []).filter(o => o && o.status === "สำเร็จแล้ว").length,
  };

  // Show login required message if not authenticated and modal is closed
  if (!user && !isLoading && showLoginRequired && !showLoginModal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="header2-bold text-white mb-4">กรุณาเข้าสู่ระบบ</h1>
          <p className="text-white mb-6">คุณต้องเข้าสู่ระบบเพื่อดูรายการคำสั่งซื้อ</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-primary-default text-white px-6 py-3 rounded-lg hover:bg-primary-darker transition-colors"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">กำลังตรวจสอบสถานะ...</div>
      </div>
    );
  }

  // Don't render order list if user is not authenticated and modal is showing
  if (!user && showLoginModal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">กรุณาเข้าสู่ระบบ...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col m-10 gap-[10px]">
      {/* search bar + title */}
      <div className="flex gap-[20px]">
        <div className="bg-gray-300 p-[10px] w-[400px] h-[50px] rounded-xl flex gap-[5px] justify-center items-center">
          <SearchIcon />
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none"
          />
        </div>
        <div className="w-full flex items-center">
          <h4 className="header4-bold">รายการคำสั่งซื้อ</h4>
        </div>
      </div>

      <div className="w-full flex gap-2">
        <FilterHeader
          title="ออร์เดอร์ทั้งหมด"
          qnty={statusCounts.all}
          textcolor="primary-default"
          boxcolor="primary-lighter"
        />
        <FilterHeader
          title="กำลังเตรียมสินค้า"
          qnty={statusCounts.preparing}
          textcolor="#8B7131"
          boxcolor="#FADCA3"
        />
        <FilterHeader
          title="กำลังจัดส่ง"
          qnty={statusCounts.shipping}
          textcolor="primary-darker"
          boxcolor="primary-default"
        />
        <FilterHeader
          title="สำเร็จแล้ว"
          qnty={statusCounts.completed}
          textcolor="#498830"
          boxcolor="#84EF5A"
        />
        <button className="p-[10px] rounded-[5px] bg-[#EFC55A] text-white w-[130px]">
          สถานะก่อนหน้า
        </button>
        <button className="p-[10px] rounded-[5px] bg-[#498830] text-white w-[130px]">
          สถานะถัดไป
        </button>
      </div>

      <div className="w-full h-full flex flex-col">
        {ordersLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">กำลังดึงข้อมูลคำสั่งซื้อ...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-red-400 text-xl">{error}</div>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-center rounded-l-xl">
                  เลขออร์เดอร์
                </th>
                <th className="px-4 py-2 text-center">ชื่อสินค้า</th>
                <th className="px-4 py-2 text-center">ชื่อผู้สั่ง</th>
                <th className="px-4 py-2 text-center rounded-r-xl">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr className="h-32">
                  <td colSpan={4} className="text-center text-white">
                    {searchTerm ? "ไม่พบคำสั่งซื้อที่ค้นหา" : "ไม่มีข้อมูลคำสั่งซื้อ"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-600">
                    <td className="px-4 py-3 text-center text-white">
                      {order.orderNumber || '-'}
                    </td>
                    <td className="px-4 py-3 text-center text-white">
                      {(order.items || []).map((item, index) => (
                        <div key={item.id || index}>
                          {item.productName || 'สินค้า'} x{item.quantity || 0}
                          {index < (order.items || []).length - 1 && ", "}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-center text-white">
                      {user?.username || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "สำเร็จแล้ว"
                          ? "bg-green-500 text-white"
                          : order.status === "กำลังจัดส่ง"
                          ? "bg-blue-500 text-white"
                          : order.status === "กำลังเตรียมสินค้า"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="w-full border-t-gray-300 border-t-[1px] flex items-center justify-center gap-[10px] p-[20px]">
        <button className="w-[30px] h-[30px] rounded-[12px] border-[1px] border-gray-300 flex items-center justify-center">
          <ChevronLeft/>
        </button>
        <button className="size-[30px] rounded-[12px] border-[1px] border-gray-300 flex items-center justify-center">1</button>
        <button className="w-[30px] h-[30px] rounded-[12px] border-[1px] border-gray-300 flex items-center justify-center">
          <ChevronRight/>
        </button>
      </div>
    </div>
  );
}
