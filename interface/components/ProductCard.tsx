import { ProductModel } from "@/utils/ProductModel"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductModelWithImage extends ProductModel {
  modelImageData?: string; // Base64 encoded image data
}

export default function ProductCard(prod: ProductModelWithImage) {
  return (

    <div className="relative w-[300px] h-[300px] bg-primary-subtle rounded-[15px] overflow-hidden flex flex-col items-center gap-3 shadow-md">
      <Link href={`/product-details/${prod.modelId}`} className="flex-1 w-full py-3 hover:bg-gray-200 transition">
        <div className="flex flex-col items-center gap-3 w-full cursor-pointer">
          {prod.modelImageData ? (
            // Use base64 image data if available (from new endpoint)
            <Image
              src={prod.modelImageData}
              alt={prod.modelName}
              width={150}
              height={150}
              className="rounded-xl w-[150px] h-[150px] object-cover"
              onError={(e) => {
                console.error("Base64 image failed to load:", prod.modelImageData);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : prod.modelImage && prod.modelImage !== 'undefined' && prod.modelImage.trim() !== '' ? (
            // Fallback to legacy image path if available
            <Image
              src={"/images/" + prod.modelImage}
              alt={prod.modelName}
              width={150}
              height={150}
              className="rounded-xl w-[150px] h-[150px] object-cover"
              onError={(e) => {
                console.error("Image failed to load:", prod.modelImage);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            // Fallback placeholder if no image available
            <div className="w-[150px] h-[150px] bg-gray-300 rounded-xl flex items-center justify-center">
              <span className="text-gray-500 text-xs text-center">ไม่มีรูปภาพ</span>
            </div>
          )}
          <p className="body-regular text-black">{prod.modelName}</p>
          <p className="body-regular text-primary-darker">{prod.price.toFixed(2) + " Baht"}</p>
        </div>
      </Link>
      {/* <button className="bg-primary-lighter w-full h-[50px] absolute bottom-0 flex justify-center items-center gap-[5px] hover:bg-primary-default transition cursor-pointer"
        onClick={()=>{}}>
        <p className="body-regular">เพิ่มลงตะกร้า</p>
        <ShoppingCart className="size-[16px]"/>
      </button> */}
      <button className="bg-primary-lighter w-full h-[50px] absolute bottom-0 flex justify-center items-center gap-[5px] hover:bg-primary-default transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
        <p className="body-regular">ดูรายละเอียด</p>
      </button>
    </div>
  )
}
