'use client'

import Image from "next/image";
import Checkbox from "./Checkbox";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Product } from "@/utils/Product";
import { useState } from "react";
import axios from "axios";
import { useSession } from "@/contexts/SessionContext";

interface CartProduct extends Product {
  orderQuantity: number;
  totalPrice: number;
  orderId: number;
  orderDetailId: number;
  modelImageData?: string; // Base64 encoded image data
}

export default function AddedProduct(prod: CartProduct) {

  const [quantity, setQuantity] = useState<number>(prod.orderQuantity);
  const [tmpQuantity, setTmpQuantity] = useState<number>(quantity);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { user } = useSession();
  
  const increaseQuantity = () => {
    if (tmpQuantity < 99) {
      setTmpQuantity(tmpQuantity + 1);
    }
  }

  const decreaseQuantity = () => {
    if (tmpQuantity > 0) {
      setTmpQuantity(tmpQuantity - 1);
    }
  }

  const handleConfirmUpdate = async () => {
    if (!user || tmpQuantity === quantity) return;

    setIsUpdating(true);
    try {
      const response = await axios.post(
        'http://localhost:8081/order-details/adjust-to-waiting-order',
        null,
        {
          params: {
            userId: user.id,
            modelId: prod.id,
            quantity: tmpQuantity
          },
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      console.log('Quantity update response:', response.data);

      // Update local state after successful API call
      setQuantity(tmpQuantity);

      // Trigger parent component to refresh (optional - using custom event)
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { productId: prod.id, newQuantity: tmpQuantity } }));

      alert('อัปเดตจำนวนสินค้าเรียบร้อย');
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      alert(error.response?.data || 'เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า');
      // Reset tmpQuantity on error
      setTmpQuantity(quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full h-[200px] flex p-[10px] border-[1px] border-gray-200  rounded-[8px]">
      {prod.modelImageData ? (
        // Use base64 image data if available (from API)
        <Image
          src={prod.modelImageData}
          alt={prod.name}
          width={170}
          height={170}
          className="border-[1px] border-gray-200 rounded-[8px]"
          onError={(e) => {
            console.error("Base64 image failed to load:", prod.modelImageData);
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : prod.imageUrl && prod.imageUrl !== 'undefined' && prod.imageUrl.trim() !== '' ? (
        // Fallback to legacy image path if available
        <Image
          src={prod.imageUrl.startsWith('http') ? prod.imageUrl : `/images/${prod.imageUrl}`}
          alt={prod.name}
          width={170}
          height={170}
          className="border-[1px] border-gray-200 rounded-[8px]"
          onError={(e) => {
            console.error("Image failed to load:", prod.imageUrl);
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        // Fallback placeholder if no image available
        <div className="w-[170px] h-[170px] border-[1px] border-gray-200 rounded-[8px] flex items-center justify-center bg-gray-200">
          <div className="text-center">
            <span className="text-gray-500 text-sm">ไม่มีรูปภาพ</span>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-[10px] p-[10px] w-full">
        <p className="header4-regular">{prod.name}</p>
        <div className="bg-primary-lighter flex items-center justify-center gap-[30px] h-[50px] w-full rounded-[8px]">
          <button className="bg-[#EF5A84] rounded-full size-[30px] justify-center items-center flex" onClick={decreaseQuantity}>
            <Minus size={20} />      
          </button>
          <p className="headline-regular">{tmpQuantity}</p>
          <button className="bg-[#84EF5A] rounded-full size-[30px] flex justify-center items-center" onClick={increaseQuantity}>
            <Plus size={20} />
          </button>
        </div>
        {
          tmpQuantity !== quantity ? (
            <button
              className="p-[10px] flex items-center justify-center rounded-[8px] bg-primary-default transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleConfirmUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'กำลังอัปเดต...' : 'ยืนยันการเปลี่ยนแปลง'}
            </button>
          ): null
        }
        <div className="w-full flex justify-center items-center gap-[10px]">
          <p className="headline-regular text-primary-darker">{prod.price * tmpQuantity}</p>
          <p className="headline-regular">Baht</p>
        </div>
      </div>  
    </div>
  )
}