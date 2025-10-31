"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/contexts/SessionContext";
import FilterHeader from "@/interface/components/FilterHeader";
import { ChevronLeft, ChevronRight, SearchIcon, ChevronDown } from "lucide-react";
import axios from "axios";

interface Order {
  orderId: number;
  userId: number;
  orderStatus: string;
  recipientName: string;
  phoneNumber: string;
  district: string;
  houseAddress: string;
  subDistrict: string;
  streetName: string;
  province: string;
  postalCode: string;
  grandTotalPrice: number | null;
  orderDate: string;
}

interface OrderItem {
  model_name: string;
  model_image: string;
  total_count: number;
  price: number;
}

interface CheckedOrder {
  orderId: number;
  orderStatus: string;
}

export default function OrderList() {
  const { user, isLoading, showLoginModal, setShowLoginModal } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [checkedOrders, setCheckedOrders] = useState<CheckedOrder[]>([]);

  // Handle checkbox selection
  const handleCheckboxChange = (orderId: number, isChecked: boolean, orderStatus: string) => {
    if (isChecked) {
      setCheckedOrders(prev => [...prev, { orderId, orderStatus }]);
    } else {
      setCheckedOrders(prev => prev.filter(order => order.orderId !== orderId));
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setCheckedOrders(filteredOrders.map(order => ({ orderId: order.orderId, orderStatus: order.orderStatus })));
    } else {
      setCheckedOrders([]);
    }
  };

  
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
      console.log(user.id);
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setError("");

    console.log("fetchOrders called - user:", user);

    if (!user) {
      setError("ไม่พบข้อมูลผู้ใช้");
      setOrdersLoading(false);
      return;
    }

    try {
      const apiUrl = `http://localhost:8081/orders`;
      console.log("Making API call to:", apiUrl);
      console.log("User ID being used:", user.id);

      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      console.log("API Response:", response);
      console.log("Response data:", response.data);

      if (response.data) {
        setOrders(response.data);
        console.log(orders);
        console.log("Orders set:", response.data);
      } else {
        console.log("No data in response");
        setOrders([]);
      }
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);

      if (err.response?.status === 401) {
        setError("กรุณาเข้าสู่ระบบใหม่");
      } else if (err.response?.status === 404) {
        setError("ไม่พบข้อมูลคำสั่งซื้อ");
      } else {
        setError(`เกิดข้อผิดพลาด: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: number) => {
    setItemsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/product-items/items/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      console.log("Raw API response:", response);
      console.log("Response data:", response.data);
      console.log("Response data type:", typeof response.data);

      if (Array.isArray(response.data)) {
        console.log("Response is array, first item:", response.data[0]);
        console.log("Keys in first item:", response.data[0] ? Object.keys(response.data[0]) : "No items");
      }

      setOrderItems(response.data || []);
    } catch (err: any) {
      console.error("Error fetching order items:", err);
      console.error("Error response:", err.response?.data);
      setOrderItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = (orders || []).filter(order => {
    if (!order || !order.orderId) return false;

    // Search filter
    const matchesSearch = order.orderId.toString().includes(searchTerm.toLowerCase());

    // Status filter
    let matchesStatus = true;
    if (selectedStatusFilter !== 'all') {
      const statusMap = {
        'waiting_payment': 'รอชำระเงิน',
        'waiting_verification': 'รอตรวจสอบหลักฐาน',
        'payment_rejected': 'หลักฐานการชำระเงินถูกปฏิเสธ',
        'payment_confirmed': 'ยืนยันการชำระแล้ว',
        'production_complete': 'สินค้าผลิตแล้ว',
        'waiting_shipment': 'รอจัดส่ง',
        'shipping_progress': 'กำลังจัดส่ง',
        'shipped': 'จัดส่งแล้ว',
      };
      matchesStatus = order.orderStatus === statusMap[selectedStatusFilter as keyof typeof statusMap];
    }

    return matchesSearch && matchesStatus;
  });

  // Check if all orders are selected
  const isAllSelected = filteredOrders.length > 0 && checkedOrders.length === filteredOrders.length;
  const isIndeterminate = checkedOrders.length > 0 && checkedOrders.length < filteredOrders.length;

  // Process checked orders and call different endpoints based on status

  const handleNextStatus = async () => {
    console.log("Processing checked orders:", checkedOrders);

    // Define status transitions
    const statusTransitions: Record<string, string> = {
      "ยืนยันการชำระแล้ว": "สินค้าผลิตแล้ว",
      "สินค้าผลิตแล้ว": "รอจัดส่ง",
      "รอจัดส่ง": "กำลังจัดส่ง",
      "กำลังจัดส่ง": "จัดส่งแล้ว",
    };

    const updatedOrders: { orderId: number; newStatus: string }[] = [];

    for (const { orderStatus: status, orderId: id } of checkedOrders) {
      let endpoint = "";
      const newStatus = statusTransitions[status];

      if (!newStatus) {
        console.warn(`No status transition defined for status: ${status}`);
        continue;
      }

      if (status === "ยืนยันการชำระแล้ว") {
        endpoint = `http://localhost:8081/orders/${id}/mark-produced`;
      }
      else if (status === "สินค้าผลิตแล้ว") {
        endpoint = `http://localhost:8081/orders/${id}/prepare-shipping`;
      }
      else if (status === "รอจัดส่ง") {
        endpoint = `http://localhost:8081/orders/${id}/ship`;
      }
      else if (status === "กำลังจัดส่ง") {
        endpoint = `http://localhost:8081/orders/${id}/confirm-delivery`;
      }

      try {
          console.log(`Updating order ${id} from "${status}" to "${newStatus}"`);

          const res = await axios.post(endpoint, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
          });

          console.log(`Successfully updated order ${id}:`, res.data);

          // Store successful update for frontend state update
          updatedOrders.push({ orderId: id, newStatus });

      } catch (error) {
          console.error(`Error updating order ${id}:`, error);
        }
     }

     // Update frontend state after all API calls
     if (updatedOrders.length > 0) {
       console.log("Updating frontend state for orders:", updatedOrders);

       setOrders(prevOrders =>
         prevOrders.map(order => {
           const updatedOrder = updatedOrders.find(uo => uo.orderId === order.orderId);
           if (updatedOrder) {
             return { ...order, orderStatus: updatedOrder.newStatus };
           }
           return order;
         })
       );

       // Clear checked orders after successful update
       setCheckedOrders([]);

       console.log("Frontend state updated successfully");
     }
  }

  // Modal functions - define before usage
  const handleShowAddressModal = async (order: Order) => {
    setSelectedOrder(order);
    setShowAddressModal(true);
    // Fetch order items when modal opens
    await fetchOrderItems(order.orderId);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setSelectedOrder(null);
    setOrderItems([]);
  };

  
  // Count orders by status
  const statusCounts = {
    all: (orders || []).length,
    preparing: (orders || []).filter(o => o && o.orderStatus === "กำลังเตรียมสินค้า").length,
    shipping: (orders || []).filter(o => o && o.orderStatus === "กำลังจัดส่ง").length,
    completed: (orders || []).filter(o => o && o.orderStatus === "สำเร็จแล้ว").length,
    waiting_payment: (orders || []).filter(o => o && o.orderStatus === "รอชำระเงิน").length,
    waiting_verification: (orders || []).filter(o => o && o.orderStatus === "รอตรวจสอบหลักฐาน").length,
    payment_confirmed: (orders || []).filter(o => o && o.orderStatus === "ยืนยันการชำระแล้ว").length,
    production_complete: (orders || []).filter(o => o && o.orderStatus === "สินค้าผลิตแล้ว").length,
    waiting_shipment: (orders || []).filter(o => o && o.orderStatus === "รอจัดส่ง").length,
    shipping_progress: (orders || []).filter(o => o && o.orderStatus === "กำลังจัดส่ง").length,
    shipped: (orders || []).filter(o => o && o.orderStatus === "จัดส่งแล้ว").length,
  };

  // Status options for dropdown
  const statusOptions = [
    { value: 'all', label: 'ออร์เดอร์ทั้งหมด', count: statusCounts.all },
    { value: 'waiting_payment', label: 'รอชำระเงิน', count: statusCounts.waiting_payment },
    { value: 'waiting_verification', label: 'รอตรวจสอบหลักฐาน', count: statusCounts.waiting_verification },
    { value: 'payment_confirmed', label: 'ยืนยันการชำระแล้ว', count: statusCounts.payment_confirmed },
    { value: 'production_complete', label: 'สินค้าผลิตแล้ว', count: statusCounts.production_complete },
    { value: 'waiting_shipment', label: 'รอจัดส่ง', count: statusCounts.waiting_shipment },
    { value: 'shipping_progress', label: 'กำลังจัดส่ง', count: statusCounts.shipping_progress },
    { value: 'shipped', label: 'จัดส่งแล้ว', count: statusCounts.shipped },
  ];

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
          <h4 className="header4-bold">รายการคำสั่งซื้อของฉัน</h4>
        </div>
      </div>

      {/* Status Filter Dropdown */}
      <div className="flex gap-3">
      <div className="w-full flex gap-2">
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="bg-primary-lighter text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-default transition-colors min-w-[200px] justify-between"
          >
            <span>
              {statusOptions.find(option => option.value === selectedStatusFilter)?.label || 'ออร์เดอร์ทั้งหมด'}
            </span>
            <div className="flex items-center gap-2">
              <span className="bg-primary-default px-2 py-1 rounded text-sm">
                {statusOptions.find(option => option.value === selectedStatusFilter)?.count || 0}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </div>
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full left-0 mt-2 w-full bg-primary-lighter rounded-lg shadow-lg border border-gray-600 z-50">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedStatusFilter(option.value);
                    setShowStatusDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-primary-default transition-colors ${
                    selectedStatusFilter === option.value ? 'bg-primary-default' : ''
                  } ${option.value === 'all' ? 'rounded-t-lg' : ''} ${
                    option.value === statusOptions[statusOptions.length - 1].value ? 'rounded-b-lg' : ''
                  }`}
                >
                  <span className="text-white">{option.label}</span>
                  <span className="bg-gray-600 min-w-[30px] text-center px-2 py-1 rounded text-sm text-white">
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <button className="w-[300px] h-[30px] bg-amber-400">ก่อนหน้า</button>
      <button className="w-[300px] h-[30px] bg-green-300" onClick={handleNextStatus}>ถัดไป</button>
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
          <>
            <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-center rounded-l-xl">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = isIndeterminate;
                      }
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-default focus:ring-primary-default"
                  />
                </th>
                <th className="px-4 py-2 text-center cursor-pointer">
                  วันที่สั่ง
                </th>
                <th className="px-4 py-2 text-center cursor-pointer">
                  เลขออร์เดอร์
                </th>
                <th className="px-4 py-2 text-center cursor-pointer rounded-r-xl">
                  สถานะ
                </th>
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
                  <tr key={order.orderId} className="border-b border-gray-600">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={checkedOrders.some(co => co.orderId === order.orderId)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(order.orderId, e.target.checked, order.orderStatus);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-gray-300 text-primary-default focus:ring-primary-default"
                      />
                    </td>
                    <td
                      className="px-4 py-3 text-center cursor-pointer"
                      onClick={() => handleShowAddressModal(order)}
                    >
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : '-'}
                    </td>
                    <td
                      className="px-4 py-3 text-center cursor-pointer"
                      onClick={() => handleShowAddressModal(order)}
                    >
                      {order.orderId || '-'}
                    </td>
                    <td
                      className="px-4 py-3 text-center cursor-pointer"
                      onClick={() => handleShowAddressModal(order)}
                    >
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        order.orderStatus === "สำเร็จแล้ว"
                          ? "bg-green-500 text-white"
                          : order.orderStatus === "กำลังจัดส่ง"
                          ? "bg-blue-500 text-white"
                          : order.orderStatus === "กำลังเตรียมสินค้า"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </>
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

      {/* Address Modal */}
      {showAddressModal && selectedOrder && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary-lighter rounded-[16px] w-[900px] max-w-[95%] max-h-[75vh] p-[25px] relative">
            <h2 className="header2-bold text-white text-center mb-4">ข้อมูลคำสั่งซื้อ</h2>

            {/* Close button inside content */}
            <div className="flex justify-end mb-4">
              <button
                onClick={closeAddressModal}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg transition-colors"
              >
                ปิด
              </button>
            </div>

            <div className="flex gap-8 flex-1 overflow-hidden">
              {/* Left Half - Order Items */}
              <div className="flex-1 flex flex-col">
                <div className="bg-white bg-opacity-10 rounded-lg p-4 flex flex-col h-[400px]">
                  <div className="text-body-regular mb-3 border-b-1">รายการสินค้า</div>
                  <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                    {itemsLoading ? (
                      <div className="text-gray-400 text-center py-8">
                        กำลังดึงข้อมูลรายการสินค้า...
                      </div>
                    ) : orderItems.length === 0 ? (
                      <div className="text-gray-400 text-center py-8">
                        ไม่พบรายการสินค้า
                      </div>
                    ) : (
                      orderItems.map((item, index) => {
                        console.log("Rendering item:", item);
                        console.log("Image path:", item.model_image);
                        console.log("Model name:", item.model_name);
                        console.log("Total count:", item.total_count);
                        console.log("Price:", item.price);

                        return (
                        <div key={index} className="flex gap-4 items-center bg-white bg-opacity-10 rounded-lg p-4 border border-gray-600">
                          <div className="flex-shrink-0 text-center">
                            {item.model_image && item.model_image !== 'undefined' && item.model_image.trim() !== '' ? (
                              <Image
                                src={item.model_image.startsWith('http') ? item.model_image : `/images/${item.model_image}`}
                                alt={item.model_name || 'Product image'}
                                width={100}
                                height={100}
                                className="rounded-lg object-cover mb-2"
                                onError={(e) => {
                                  console.error("Image failed to load:", item.model_image);
                                  // Hide the image on error
                                  e.currentTarget.style.display = 'none';
                                }}
                                onLoad={() => {
                                  console.log("Image loaded successfully:", item.model_image);
                                }}
                              />
                            ) : (
                              <div className="w-[100px] h-[100px] bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                                <span className="text-gray-400 text-xs">No Image</span>
                              </div>
                            )}
                            <p className="text-white text-sm font-bold">{item.price ? `${item.price} ฿` : 'N/A'}</p>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg mb-3">
                              {item.model_name || 'Unknown Product'}
                            </h4>
                            <p className="text-green-400 font-medium text-base mb-2">
                              จำนวน: {item.total_count || 0} ชิ้น
                            </p>
                            <p className="text-yellow-400 text-sm">
                              ราคารวม: {item.price && item.total_count ? (item.price * item.total_count).toFixed(2) : '0.00'} ฿
                            </p>
                          </div>
                        </div>
                        )
                      })
                    )}
                  </div>

                  {/* Total Price at bottom of items list */}
                  <div className="border-t border-gray-600 pt-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">ยอดรวมสินค้า:</span>
                      <span className="text-yellow-400 font-bold text-lg">
                        {orderItems.reduce((total, item) => total + ((item.price || 0) * (item.total_count || 0)), 0).toFixed(2)} ฿
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Half - Order Info and Address */}
              <div className="flex-1 flex flex-col">
                <div className="bg-white bg-opacity-10 rounded-lg p-4 flex flex-col h-[400px] overflow-y-auto">
                  <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="">เลขออร์เดอร์:</span>
                    <span className="font-bold">{selectedOrder.orderId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="">วันที่สั่ง:</span>
                    <span className="">
                      {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : '-'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="">สถานะ:</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedOrder.orderStatus === "สำเร็จแล้ว"
                        ? "bg-green-500 text-white"
                        : selectedOrder.orderStatus === "กำลังจัดส่ง"
                        ? "bg-blue-500 text-white"
                        : selectedOrder.orderStatus === "กำลังเตรียมสินค้า"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}>
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <h3 className="font-medium mb-3">ที่อยู่จัดส่ง</h3>
                    <div className="bg-white bg-opacity-10 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex">
                          <div className="text-primary-default w-20">ชื่อ:</div>
                          <div className="ml-2 w-full">{selectedOrder.recipientName || '-'}</div>
                        </div>
                        <div className="flex">
                          <div className="text-primary-default w-20">ที่อยู่:</div>
                          <div className="ml-2 w-full">
                            {selectedOrder.houseAddress && selectedOrder.streetName && selectedOrder.district &&
                             selectedOrder.subDistrict && selectedOrder.province && selectedOrder.postalCode
                              ? `${selectedOrder.houseAddress} ${selectedOrder.streetName} ${selectedOrder.district} ${selectedOrder.subDistrict} ${selectedOrder.province} ${selectedOrder.postalCode}`
                              : '-'}
                          </div>
                        </div>
                        <div className="flex">
                          <div className="text-primary-default w-20">โทรศัพท์:</div>
                          <div className="ml-2 w-full">{selectedOrder.phoneNumber || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
