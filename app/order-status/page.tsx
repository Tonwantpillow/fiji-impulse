"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/contexts/SessionContext";
import {
  ChevronLeft,
  ChevronRight,
  SearchIcon,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { getStatusBadgeClasses } from "@/utils/OrderStatusColors";

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

export default function OrderList() {
  const { user, isLoading, showLoginModal, setShowLoginModal } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<string>("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  
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
      const apiUrl = `http://localhost:8081/orders/user/${user.id}`;
      console.log("Making API call to:", apiUrl);
      console.log("User ID being used:", user.id);

      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
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
        setError(`เกิดข้อผิดพลาด: ${err.message || "Unknown error"}`);
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    setDetailsLoading(true);
    try {
      // Use the same endpoint as order-list page to fetch order details
      const response = await axios.get(
        `http://localhost:8081/order-details/order/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Order details API response:", response);
      console.log("Response data:", response.data);
      console.log("Response data type:", typeof response.data);

      if (Array.isArray(response.data)) {
        console.log("Response is array, first item:", response.data[0]);
        console.log(
          "Keys in first item:",
          response.data[0] ? Object.keys(response.data[0]) : "No items"
        );
      }

      // For each order detail, fetch the product model information and image
      const orderItems = await Promise.all(
        response.data.map(
          async (detail: {
            modelId: number;
            orderQuantity: number;
            totalPrice: number;
          }) => {
            try {
              // Fetch product model information
              const modelResponse = await axios.get(
                `http://localhost:8081/product-model/${detail.modelId}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                }
              );

              const productModel = modelResponse.data;

              let modelImageData: string | undefined;

              try {
                // Fetch product model image using the same endpoint as other pages
                const imageResponse = await axios.get(
                  `http://localhost:8081/product-model/image/${detail.modelId}`,
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                    responseType: "arraybuffer", // Important for binary image data
                  }
                );

                // Convert the array buffer to base64
                const imageData = imageResponse.data;
                const base64String = btoa(
                  new Uint8Array(imageData).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                  )
                );

                // Get content type from response headers
                const contentType =
                  imageResponse.headers["content-type"] || "image/jpeg";

                // Create base64 data URL
                modelImageData = `data:${contentType};base64,${base64String}`;
              } catch (imageError) {
                console.warn(
                  `Warning: Could not fetch image for modelId ${detail.modelId}:`,
                  imageError
                );
                // Continue without image - this is not a critical error
              }

              // Create order item with all necessary information
              return {
                ...detail,
                model_name: productModel?.modelName || "Unknown Product",
                model_image:
                  productModel?.modelImage ||
                  productModel?.modelImagePath ||
                  "",
                model_image_data: modelImageData,
                total_count: detail.orderQuantity,
                price: detail.totalPrice / detail.orderQuantity, // Calculate unit price
                unitPrice: detail.totalPrice / detail.orderQuantity, // Calculate unit price
              };
            } catch (modelError) {
              console.error(
                `Error fetching model info for modelId ${detail.modelId}:`,
                modelError
              );
              // Return item with default values if model fetch fails
              return {
                ...detail,
                model_name: "Unknown Product",
                model_image: "",
                total_count: detail.orderQuantity,
                price: detail.totalPrice / detail.orderQuantity,
                unitPrice: detail.totalPrice / detail.orderQuantity,
              };
            }
          }
        )
      );

      console.log("Final order items:", orderItems);
      setOrderDetails(orderItems);
    } catch (err: any) {
      console.error("Error fetching order details:", err);
      console.error("Error response:", err.response?.data);
      setOrderDetails([]);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fetch payment information for the order
  const fetchPaymentInfo = async (orderId: number) => {
    setPaymentLoading(true);
    setPaymentInfo(null);

    try {
      const response = await axios.get(
        `http://localhost:8081/payments/receipt/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          responseType: "arraybuffer",
        }
      );

      // Convert the array buffer to base64
      const imageData = response.data;
      const base64String = btoa(
        new Uint8Array(imageData).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      // Get content type from response headers
      const contentType = response.headers["content-type"] || "image/jpeg";

      // Create base64 data URL
      const receiptDataUrl = `data:${contentType};base64,${base64String}`;

      // Calculate total amount for the order
      const orderTotal = orderDetails.reduce(
        (total, item) => total + (item.price || 0) * (item.total_count || 0),
        0
      );

      // Determine payment status based on order status
      let paymentStatus: "pending" | "approved" | "rejected" = "pending";
      if (selectedOrder?.orderStatus === "รอตรวจสอบหลักฐาน") {
        paymentStatus = "pending";
      } else if (selectedOrder?.orderStatus === "หลักฐานการชำระเงินถูกปฏิเสธ") {
        paymentStatus = "rejected";
      } else if (selectedOrder?.orderStatus === "ยืนยันการชำระแล้ว") {
        paymentStatus = "approved";
      } else if (selectedOrder?.orderStatus === "รอตรวจสอบอีกครั้ง") {
        paymentStatus = "pending"; // Treat re-verification as pending
      }

      const paymentData = {
        orderId: orderId,
        totalAmount: orderTotal,
        paymentStatus: paymentStatus,
        receiptData: receiptDataUrl,
        paymentDate: selectedOrder?.orderDate,
      };

      setPaymentInfo(paymentData);
    } catch (err: any) {
      console.error("Error fetching payment info:", err);

      // If no receipt found, check if order status indicates payment should exist
      if (
        selectedOrder &&
        [
          "รอตรวจสอบหลักฐาน",
          "ยืนยันการชำระแล้ว",
          "หลักฐานการชำระเงินถูกปฏิเสธ",
          "รอตรวจสอบอีกครั้ง",
        ].includes(selectedOrder.orderStatus)
      ) {
        const orderTotal = orderDetails.reduce(
          (total, item) => total + (item.price || 0) * (item.total_count || 0),
          0
        );

        let paymentStatus: "pending" | "approved" | "rejected" = "pending";
        if (selectedOrder.orderStatus === "รอตรวจสอบหลักฐาน") {
          paymentStatus = "pending";
        } else if (
          selectedOrder.orderStatus === "หลักฐานการชำระเงินถูกปฏิเสธ"
        ) {
          paymentStatus = "rejected";
        } else if (selectedOrder.orderStatus === "ยืนยันการชำระแล้ว") {
          paymentStatus = "approved";
        } else if (selectedOrder.orderStatus === "รอตรวจสอบอีกครั้ง") {
          paymentStatus = "pending";
        }

        const paymentData = {
          orderId: orderId,
          totalAmount: orderTotal,
          paymentStatus: paymentStatus,
          paymentDate: selectedOrder.orderDate,
        };

        setPaymentInfo(paymentData);
      } else {
        setPaymentInfo(null);
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  

  // Filter orders based on search term and status
  const filteredOrders = (orders || []).filter((order) => {
    if (!order || !order.orderId) return false;

    // Search filter
    const matchesSearch = order.orderId
      .toString()
      .includes(searchTerm.toLowerCase());

    // Status filter
    let matchesStatus = true;
    if (selectedStatusFilter !== "all") {
      const statusMap = {
        waiting_payment: "รอชำระเงิน",
        waiting_verification: "รอตรวจสอบหลักฐาน",
        payment_rejected: "หลักฐานการชำระเงินถูกปฏิเสธ",
        reverification: "รอตรวจสอบอีกครั้ง",
        payment_confirmed: "ยืนยันการชำระแล้ว",
        production_complete: "สินค้าผลิตแล้ว",
        waiting_shipment: "รอจัดส่ง",
        shipping_progress: "กำลังจัดส่ง",
        shipped: "จัดส่งแล้ว",
      };
      matchesStatus =
        order.orderStatus ===
        statusMap[selectedStatusFilter as keyof typeof statusMap];
    }

    return matchesSearch && matchesStatus;
  });

  // Modal functions - define before usage
  const handleShowOrderDetailsModal = async (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
    // Fetch order details when modal opens
    if (user) {
      await fetchOrderDetails(order.orderId);
      // Fetch payment info after order details are loaded
      await fetchPaymentInfo(order.orderId);
    }
  };

  const closeOrderDetailsModal = () => {
    setShowOrderDetailsModal(false);
    setSelectedOrder(null);
    setOrderDetails([]);
  };

  // Count orders by status
  const statusCounts = {
    all: (orders || []).length,
    preparing: (orders || []).filter(
      (o) => o && o.orderStatus === "กำลังเตรียมสินค้า"
    ).length,
    shipping: (orders || []).filter((o) => o && o.orderStatus === "กำลังจัดส่ง")
      .length,
    completed: (orders || []).filter((o) => o && o.orderStatus === "สำเร็จแล้ว")
      .length,
    waiting_payment: (orders || []).filter(
      (o) => o && o.orderStatus === "รอชำระเงิน"
    ).length,
    waiting_verification: (orders || []).filter(
      (o) => o && o.orderStatus === "รอตรวจสอบหลักฐาน"
    ).length,
    payment_confirmed: (orders || []).filter(
      (o) => o && o.orderStatus === "ยืนยันการชำระแล้ว"
    ).length,
    production_complete: (orders || []).filter(
      (o) => o && o.orderStatus === "สินค้าผลิตแล้ว"
    ).length,
    waiting_shipment: (orders || []).filter(
      (o) => o && o.orderStatus === "รอจัดส่ง"
    ).length,
    shipping_progress: (orders || []).filter(
      (o) => o && o.orderStatus === "กำลังจัดส่ง"
    ).length,
    shipped: (orders || []).filter((o) => o && o.orderStatus === "จัดส่งแล้ว")
      .length,
  };

  // Status options for dropdown
  const statusOptions = [
    { value: "all", label: "ออร์เดอร์ทั้งหมด", count: statusCounts.all },
    {
      value: "waiting_payment",
      label: "รอชำระเงิน",
      count: statusCounts.waiting_payment,
    },
    {
      value: "waiting_verification",
      label: "รอตรวจสอบหลักฐาน",
      count: statusCounts.waiting_verification,
    },
    {
      value: "payment_confirmed",
      label: "ยืนยันการชำระแล้ว",
      count: statusCounts.payment_confirmed,
    },
    {
      value: "production_complete",
      label: "สินค้าผลิตแล้ว",
      count: statusCounts.production_complete,
    },
    {
      value: "waiting_shipment",
      label: "รอจัดส่ง",
      count: statusCounts.waiting_shipment,
    },
    {
      value: "shipping_progress",
      label: "กำลังจัดส่ง",
      count: statusCounts.shipping_progress,
    },
    { value: "shipped", label: "จัดส่งแล้ว", count: statusCounts.shipped },
  ];

  // Show login required message if not authenticated and modal is closed
  if (!user && !isLoading && showLoginRequired && !showLoginModal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="header2-bold text-white mb-4">กรุณาเข้าสู่ระบบ</h1>
          <p className="text-white mb-6">
            คุณต้องเข้าสู่ระบบเพื่อดูรายการคำสั่งซื้อ
          </p>
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
      <div className="w-full flex gap-2">
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="bg-primary-lighter text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-default transition-colors min-w-[200px] justify-between"
          >
            <span>
              {statusOptions.find(
                (option) => option.value === selectedStatusFilter
              )?.label || "ออร์เดอร์ทั้งหมด"}
            </span>
            <div className="flex items-center gap-2">
              <span className="bg-primary-default px-2 py-1 rounded text-sm">
                {statusOptions.find(
                  (option) => option.value === selectedStatusFilter
                )?.count || 0}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showStatusDropdown ? "rotate-180" : ""
                }`}
              />
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
                    selectedStatusFilter === option.value
                      ? "bg-primary-default"
                      : ""
                  } ${option.value === "all" ? "rounded-t-lg" : ""} ${
                    option.value ===
                    statusOptions[statusOptions.length - 1].value
                      ? "rounded-b-lg"
                      : ""
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

      <div className="w-full h-full flex flex-col">
        {ordersLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">
              กำลังดึงข้อมูลคำสั่งซื้อ...
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-red-400 text-xl">{error}</div>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-center rounded-l-xl cursor-pointer">
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
                    {searchTerm
                      ? "ไม่พบคำสั่งซื้อที่ค้นหา"
                      : "ไม่มีข้อมูลคำสั่งซื้อ"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.orderId} className="border-b border-gray-600">
                    <td
                      className="px-4 py-3 text-center cursor-pointer"
                      onClick={() => handleShowOrderDetailsModal(order)}
                    >
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString(
                            "th-TH",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </td>
                    <td
                      className="px-4 py-3 text-center cursor-pointer"
                      onClick={() => handleShowOrderDetailsModal(order)}
                    >
                      {order.orderId || "-"}
                    </td>
                    <td
                      className="px-4 py-3 text-center cursor-pointer"
                      onClick={() => handleShowOrderDetailsModal(order)}
                    >
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClasses(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
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
          <ChevronLeft />
        </button>
        <button className="size-[30px] rounded-[12px] border-[1px] border-gray-300 flex items-center justify-center">
          1
        </button>
        <button className="w-[30px] h-[30px] rounded-[12px] border-[1px] border-gray-300 flex items-center justify-center">
          <ChevronRight />
        </button>
      </div>

      {/* Order Details Modal */}
      {showOrderDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary-lighter rounded-[16px] w-[900px] max-w-[95%] max-h-[90vh] p-[25px] relative flex flex-col">
            <h2 className="header2-bold text-white text-center mb-4 flex-shrink-0">
              ข้อมูลคำสั่งซื้อ
            </h2>

            {/* Close button inside content */}
            <div className="flex justify-end mb-4 flex-shrink-0">
              <button
                onClick={closeOrderDetailsModal}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg transition-colors"
              >
                ปิด
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 min-h-full">
                {/* Order Details Section */}
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-body-regular mb-3 border-b-1">
                    รายการสินค้า
                  </div>
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                    {detailsLoading ? (
                      <div className="text-gray-400 text-center py-8">
                        กำลังดึงข้อมูลรายการสินค้า...
                      </div>
                    ) : orderDetails.length === 0 ? (
                      <div className="text-gray-400 text-center py-8">
                        ไม่พบรายการสินค้า
                      </div>
                    ) : (
                      orderDetails.map((detail, index) => {
                        return (
                          <div
                            key={index}
                            className="flex gap-4 items-center bg-white bg-opacity-10 rounded-lg p-3 border border-gray-600"
                          >
                            <div className="flex-shrink-0 text-center">
                              {detail.model_image_data ? (
                                // Use base64 image data if available (from new endpoint)
                                <Image
                                  src={detail.model_image_data}
                                  alt={detail.model_name || "Product image"}
                                  width={80}
                                  height={80}
                                  className="rounded-lg object-cover mb-2"
                                  onError={(e) => {
                                    console.error(
                                      "Base64 image failed to load:",
                                      detail.model_image_data
                                    );
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : detail.model_image &&
                                detail.model_image !== "undefined" &&
                                detail.model_image.trim() !== "" ? (
                                // Fallback to legacy image path if available
                                <Image
                                  src={
                                    detail.model_image.startsWith("http")
                                      ? detail.model_image
                                      : `/images/${detail.model_image}`
                                  }
                                  alt={detail.model_name || "Product image"}
                                  width={80}
                                  height={80}
                                  className="rounded-lg object-cover mb-2"
                                  onError={(e) => {
                                    console.error(
                                      "Image failed to load:",
                                      detail.model_image
                                    );
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                // Fallback placeholder if no image available
                                <div className="w-[80px] h-[80px] bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                                  <span className="text-gray-400 text-xs">
                                    No Image
                                  </span>
                                </div>
                              )}
                              <p className="text-black text-sm font-bold">
                                {detail.price ? `${detail.price} ฿` : "N/A"}
                              </p>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-base mb-2">
                                {detail.model_name || "Unknown Product"}
                              </h4>
                              <p className="text-green-400 font-medium text-sm mb-1">
                                จำนวน: {detail.total_count || 0} ชิ้น
                              </p>
                              <p className="text-yellow-400 text-xs">
                                ราคารวม:{" "}
                                {detail.price && detail.total_count
                                  ? (detail.price * detail.total_count).toFixed(
                                      2
                                    )
                                  : "0.00"}{" "}
                                ฿
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Total Price at bottom of items list */}
                  <div className="border-t border-gray-600 pt-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">ยอดรวมสินค้า:</span>
                      <span className="text-yellow-400 font-bold text-lg">
                        {orderDetails
                          .reduce(
                            (total, detail) =>
                              total +
                              (detail.price || 0) * (detail.total_count || 0),
                            0
                          )
                          .toFixed(2)}{" "}
                        ฿
                      </span>
                    </div>
                  </div>

                  {/* Order Info and Address Section */}
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Info Column */}
                      <div>
                        <h3 className="font-medium mb-3 text-black">
                          ข้อมูลคำสั่งซื้อ
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-black">เลขออร์เดอร์:</span>
                            <span className="font-bold text-black">
                              {selectedOrder.orderId}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-black">วันที่สั่ง:</span>
                            <span className="text-black">
                              {selectedOrder.orderDate
                                ? new Date(
                                    selectedOrder.orderDate
                                  ).toLocaleDateString("th-TH", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : "-"}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-black">สถานะ:</span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClasses(
                                selectedOrder.orderStatus
                              )}`}
                            >
                              {selectedOrder.orderStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Address Column */}
                      <div>
                        <h3 className="font-medium mb-3 text-black">
                          ที่อยู่จัดส่ง
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-primary-default text-sm">
                              ชื่อ:
                            </span>
                            <p className="text-black ml-2">
                              {selectedOrder.recipientName || "-"}
                            </p>
                          </div>
                          <div>
                            <span className="text-primary-default text-sm">
                              ที่อยู่:
                            </span>
                            <p className="text-black ml-2">
                              {selectedOrder.houseAddress &&
                              selectedOrder.streetName &&
                              selectedOrder.district &&
                              selectedOrder.subDistrict &&
                              selectedOrder.province &&
                              selectedOrder.postalCode
                                ? `${selectedOrder.houseAddress} ${selectedOrder.streetName} ${selectedOrder.district} ${selectedOrder.subDistrict} ${selectedOrder.province} ${selectedOrder.postalCode}`
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <span className="text-primary-default text-sm">
                              โทรศัพท์:
                            </span>
                            <p className="text-black ml-2">
                              {selectedOrder.phoneNumber || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Transaction Section */}
                  <div className="mt-4 border-t border-gray-600 pt-4">
                    <h3 className="font-bold text-lg text-black mb-4">
                      การตรวจสอบการชำระเงิน
                    </h3>

                    {paymentLoading ? (
                      <div className="text-gray-400 text-center py-6">
                        กำลังตรวจสอบข้อมูลการชำระเงิน...
                      </div>
                    ) : !paymentInfo ? (
                      <div className="text-gray-400 text-center py-6">
                        ไม่พบข้อมูลการชำระเงิน
                      </div>
                    ) : (
                      <div className="bg-white bg-opacity-10 rounded-lg p-4">
                        <div className="flex flex-col items-center space-y-4">
                          {/* Payment Slip */}
                          <div className="text-center">
                            <div className="text-sm font-medium mb-3">
                              หลักฐานการชำระเงิน
                            </div>
                            {paymentInfo.receiptData ? (
                              <Image
                                src={paymentInfo.receiptData}
                                alt="Payment Receipt"
                                width={250}
                                height={180}
                                className="rounded-lg border-2 border-gray-400 object-cover mb-4"
                                onError={(e) => {
                                  console.error(
                                    "Payment receipt failed to load:",
                                    paymentInfo.receiptData
                                  );
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-[250px] h-[180px] bg-gray-600 rounded-lg flex items-center justify-center border-2 border-gray-400 mb-4">
                                <span className="text-gray-400 text-sm">
                                  ไม่มีหลักฐาน
                                </span>
                              </div>
                            )}

                            </div>

                          </div>
                      </div>
                    )}

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
