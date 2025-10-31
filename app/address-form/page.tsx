'use client'

import { useSession } from "@/contexts/SessionContext";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface AddressFormData {
  name: string;
  phone: string;
  homeAddress: string;
  province: string;
  district: string;
  subdistrict: string;
  street: string;
  postalCode: string;
}

export default function AddressFormPage() {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<AddressFormData>({
    name: '',
    phone: '',
    homeAddress: '',
    province: '',
    district: '',
    subdistrict: '',
    street: '',
    postalCode: '',
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/cart');
    }
  }, [user, isLoading, router]);

  // Fetch order details on page load
  useEffect(() => {
    if (user) {
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
        const orderDetailsArray: any[] = [];
        Object.entries(res.data).forEach(([key, modelName]) => {
          const match = key.match(/orderDetailId=(\d+).*orderId=(\d+).*modelId=(\d+).*orderQuantity=(\d+).*totalPrice=([\d.]+)/);
          if (match) {
            orderDetailsArray.push({
              orderDetailId: parseInt(match[1]),
              orderId: parseInt(match[2]),
              modelId: parseInt(match[3]),
              orderQuantity: parseInt(match[4]),
              totalPrice: parseFloat(match[5]),
              model_name: modelName as string
            });
          }
        });
        setOrderDetails(orderDetailsArray);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setOrderDetails([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (orderDetails.length === 0) {
      alert('ไม่มีรายการสินค้าในตะกร้า');
      return;
    }

    setIsSubmitting(true);

    try {
      // Update all orders with address information (no status change)
      const updatePromises = orderDetails.map(async (orderDetail) => {
        const params = new URLSearchParams({
          recipientName: formData.name,
          phoneNumber: formData.phone,
          houseAddress: formData.homeAddress,
          subDistrict: formData.subdistrict,
          district: formData.district,
          streetName: formData.street,
          province: formData.province,
          postalCode: formData.postalCode,
        });

        return await axios.put(
          `http://localhost:8081/orders/${orderDetail.orderId}/address?${params.toString()}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
          }
        );
      });

      await Promise.all(updatePromises);

      alert('บันทึกข้อมูลที่อยู่สำเร็จแล้ว!');
      router.push('/cart');

    } catch (error) {
      console.error('Error updating order:', error);
      alert('เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">กำลังโหลด...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="flex flex-col justify-center mt-10 max-w-2xl mx-auto">
      <div className="flex gap-[50px] py-[10px] px-[10px] items-center">
        <ChevronLeft className="cursor-pointer" onClick={() => router.push('/cart')} />
        <h2 className="header3-bold">ข้อมูลการจัดส่ง</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-primary-lighter rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-white mb-2">ชื่อ *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-default bg-white text-gray-800"
            />
          </div>

          <div>
            <label className="block text-white mb-2">หมายเลขโทรศัพท์ *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-default bg-white text-gray-800"
            />
          </div>

          <div>
            <label className="block text-white mb-2">ที่อยู่บ้าน *</label>
            <input
              type="text"
              name="homeAddress"
              value={formData.homeAddress}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-default bg-white text-gray-800"
            />
          </div>

          <div>
            <label className="block text-white mb-2">จังหวัด *</label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-default bg-white text-gray-800"
            />
          </div>

          <div>
            <label className="block text-white mb-2">อำเภอ *</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-default bg-white text-gray-800"
            />
          </div>

          <div>
            <label className="block text-white mb-2">ตำบล *</label>
            <input
              type="text"
              name="subdistrict"
              value={formData.subdistrict}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-default bg-white text-gray-800"
            />
          </div>

          <div>
            <label className="block text-white mb-2">ถนน</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-default bg-white text-gray-800"
            />
          </div>

          <div>
            <label className="block text-white mb-2">เลขไปรษณีย์ *</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-default bg-white text-gray-800"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || orderDetails.length === 0}
            className="flex-1 bg-primary-default hover:bg-primary-darker disabled:bg-gray-400 text-white py-4 rounded-lg transition-colors font-medium text-lg"
          >
            {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/cart')}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-lg transition-colors font-medium text-lg"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}