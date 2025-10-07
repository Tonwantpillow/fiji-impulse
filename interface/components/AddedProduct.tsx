import Image from "next/image";
import Checkbox from "./Checkbox";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function AddedProduct() {
  return (
    <div className="flex gap-3 rounded-[3px] p-[10px] shadow justify-center items-center">
      <Checkbox/>
      <div className="shadow rounded-2xl">
        <Image src="/images/sealer.jpg" alt="sealerimg" width={150} height={150}/>
      </div>      
      <div className="flex flex-col flex-1 gap-3 w-[360px] p-[10px] self-stretch">
        <p className="header4-regular">เครื่องซีลมหัศจรรย์</p>
        <div className="flex items-center gap-3">
          <button className="flex rounded-full bg-red-300 size-[30px] justify-center items-center"><Minus className="size-9"/></button>
          <p className="header4-regular">1</p>
          <button className="flex rounded-full bg-green-400 size-[30px] justify-center items-center"><Plus className="size-9"/></button>  
        </div>
        <div className="flex justify-between">
          <p className="header4-regular">590 Baht</p>
          <button className="text-red-600"><Trash2 className="size-[24px]"/></button>
        </div>
      </div>
    </div>
  )
}