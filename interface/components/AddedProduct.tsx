'use client'

import Image from "next/image";
import Checkbox from "./Checkbox";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Product } from "@/utils/Product";
import { useState } from "react";

export default function AddedProduct(prod: Product) {

  const [quantity, setQuantity] = useState<number>(prod.orderQuantity);
  const [tmpQuantity, setTmpQuantity] = useState<number>(quantity);
  
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

  return (
    <div className="w-full h-[200px] flex p-[10px] border-[1px] border-gray-200  rounded-[8px]">
      <Image src={prod.imageUrl} width={170} height={170} alt={prod.name} className="border-[1px] border-gray-200 rounded-[8px]"/>
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
            <button className="p-[10px] flex items-center justify-center rounded-[8px] bg-primary-default">
              ยืนยันการเปลี่ยนแปลง
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