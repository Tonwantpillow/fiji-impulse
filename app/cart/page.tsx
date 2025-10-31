'use client'

import { useSession } from "@/contexts/SessionContext";
import AddedProduct from "@/interface/components/AddedProduct";
import { Product } from "@/utils/Product";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const [hasAddress, setHasAddress] = useState<boolean>(false)
  const [addressData, setAddressData] = useState<any>(null)
  const [showPaymentSection, setShowPaymentSection] = useState<boolean>(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter();

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

        // Check if any order has address information and status
        if (orderDetailsArray.length > 0) {
          try {
            // Get first order to check for address info and status
            const orderRes = await axios.get(`http://localhost:8081/orders/${orderDetailsArray[0].orderId}`, {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true
            });

            if (orderRes.data) {
              const order = orderRes.data;
              // Check if order has valid address fields (exclude "Pending" values) and is waiting for payment
              const hasValidAddr = order.recipientName && order.recipientName !== 'Pending' &&
                                 order.phoneNumber && order.phoneNumber !== 'Pending' &&
                                 order.houseAddress && order.houseAddress !== 'Pending' &&
                                 order.province && order.province !== 'Pending';
              const needsPayment = order.orderStatus === 'รอชำระเงิน';

              setHasAddress(hasValidAddr && needsPayment); // Only show address if payment is still needed
              if (hasValidAddr && needsPayment) {
                setAddressData(order);
              }
            }
          } catch (error) {
            console.error('Error checking order address:', error);
            setHasAddress(false);
          }
        }
      }
    } catch (error) {
      setOrderDetails([]);
      setAddedProds([]);
      setTotalCart(0);
      setHasAddress(false);
      setAddressData(null);
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

            {!hasAddress ? (
              <button
                className="w-full mt-6 bg-primary-default hover:bg-primary-darker text-white py-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 font-medium text-lg"
                onClick={() => router.push('/address-form')}
              >
                ดำเนินการสั่งซื้อ
              </button>
            ) : (
              <button
                className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 font-medium text-lg"
                onClick={() => setShowPaymentSection(true)}
              >
                ยืนยันการสั่งซื้อ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Address Section */}
      {hasAddress && addressData && (
        <div className="flex p-[10px] mt-6">
          <div className="w-full p-6 bg-primary-lighter rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">ที่อยู่จัดส่ง</h3>
              <button
                className="text-white hover:text-blue-200 underline text-sm transition-all duration-300 ease-in-out transform hover:scale-105"
                onClick={() => router.push('/address-form')}
              >
                แก้ไขที่อยู่
              </button>
            </div>

            <div className="text-white space-y-2">
              <p><span className="font-semibold">ชื่อ:</span> {(addressData.recipientName && addressData.recipientName !== 'Pending') ? addressData.recipientName : '-'}</p>
              <p><span className="font-semibold">เบอร์โทรศัพท์:</span> {(addressData.phoneNumber && addressData.phoneNumber !== 'Pending') ? addressData.phoneNumber : '-'}</p>
              <p><span className="font-semibold">ที่อยู่:</span> {(addressData.houseAddress && addressData.houseAddress !== 'Pending') ? addressData.houseAddress : '-'}</p>
              <div className="flex flex-wrap gap-2">
                {addressData.streetName && addressData.streetName !== 'Pending' && (
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm text-black">{addressData.streetName}</span>
                )}
                {addressData.subDistrict && addressData.subDistrict !== 'Pending' && (
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm text-black">ต.{addressData.subDistrict}</span>
                )}
                {addressData.district && addressData.district !== 'Pending' && (
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm text-black">อ.{addressData.district}</span>
                )}
                {addressData.province && addressData.province !== 'Pending' && (
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm text-black">จ.{addressData.province}</span>
                )}
                {addressData.postalCode && addressData.postalCode !== 'Pending' && (
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm text-black">{addressData.postalCode}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Section - Only shows when confirm button is clicked */}
      {showPaymentSection && (
        <div className="flex p-[10px] mt-6">
          <div className="w-full p-6 bg-primary-lighter rounded-lg">
            <h3 className="text-white text-xl font-bold mb-4">ชำระเงิน</h3>

            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center border-2 border-gray-300">
                 <Image src="/images/qrcode.jpg" alt="QR Code" width={200} height={200} className="object-contain"/>
                  </div>
                </div>
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-white mb-2">อัปโหลดสลิปการโอนเงิน</label>
                <div className="flex justify-center">
                  <label className="cursor-pointer">
                    <div className="w-full max-w-md h-32 border-2 border-dashed border-white rounded-lg flex items-center justify-center hover:bg-white hover:bg-opacity-10 transition-all duration-300 ease-in-out transform hover:scale-105">
                      {uploadedImage ? (
                        <div className="relative">
                          <img src={uploadedImage} alt="Uploaded slip" className="max-w-full max-h-28 object-contain rounded" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedImage(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-all duration-300 ease-in-out transform hover:scale-110"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-white">
                          <p className="text-lg mb-1">📷</p>
                          <p className="text-sm">คลิกเพื่อเลือกรูปสลิป</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setUploadedImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  className={`flex-1 py-3 rounded-lg transition-all duration-300 ease-in-out transform font-medium ${
                    uploadedImage
                      ? "bg-green-500 hover:bg-green-600 text-white hover:scale-105"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  onClick={async () => {
                    if (uploadedImage) {
                      setIsSubmitting(true);
                      try {
                        // Convert base64 to blob for FormData
                        const response = await fetch(uploadedImage);
                        const blob = await response.blob();
                        const file = new File([blob], 'payment-slip.jpg', { type: 'image/jpeg' });

                        // Get current date in yyyy-MM-dd HH:mm:ss format for backend compatibility
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = String(now.getMonth() + 1).padStart(2, '0');
                        const day = String(now.getDate()).padStart(2, '0');
                        const hours = String(now.getHours()).padStart(2, '0');
                        const minutes = String(now.getMinutes()).padStart(2, '0');
                        const seconds = String(now.getSeconds()).padStart(2, '0');
                        const paymentDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                        // Calculate total amount for the entire order
                        const totalAmount = orderDetails.reduce((total, detail) => total + detail.totalPrice, 0);

                        // Get unique order ID (all orderDetails should have the same orderId)
                        const orderId = orderDetails[0]?.orderId;

                        if (!orderId) {
                          throw new Error('No order ID found');
                        }

                        // Upload payment slip once per order with total amount
                        const formData = new FormData();
                        formData.append('orderId', orderId.toString());
                        formData.append('totalAmount', totalAmount.toString());
                        formData.append('paymentDate', paymentDate);
                        formData.append('file', file);

                        const res = await axios.post(
                          `http://localhost:8081/payments/upload`,
                          formData,
                          {
                            headers: {
                              'Content-Type': 'multipart/form-data',
                            },
                            withCredentials: true
                          }
                        );

                        console.log('Payment upload response:', res.data);

                        setShowPaymentSection(false);
                        setUploadedImage(null);

                        // Refresh order details to check status - no unpaid orders should remain
                        await fetchOrderDetails();

                      } catch (error) {
                        console.error('Error uploading payment slip:', error);
                        alert('เกิดข้อผิดพลาดในการอัปโหลดสลิป กรุณาลองใหม่');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }
                  }}
                  disabled={!uploadedImage || isSubmitting}
                >
                  {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยันการชำระเงิน'}
                </button>

                <button
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 font-medium"
                  onClick={() => {
                    setShowPaymentSection(false);
                    setUploadedImage(null);
                  }}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
      )}
      </div>
  )
}