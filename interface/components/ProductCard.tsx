import { Product } from "@/utils/Product"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ProductCard(prod: Product) {
  return (

    <div className="relative w-[300px] h-[300px] bg-primary-subtle rounded-[15px] overflow-hidden flex flex-col items-center gap-3 ">
      <Link href={`/product-details/${prod.id}`} className="flex-1 w-full py-3 hover:bg-gray-200 transition">
        <div className="flex flex-col items-center gap-3 w-full cursor-pointer">
          <Image src={prod.imageUrl} alt={prod.name} width={150} height={150} className="rounded-xl w-[150px] h-[150px]"/>
          <p className="body-regular text-black">{prod.name}</p>
          <p className="body-regular text-primary-darker">{prod.price.toFixed(2) + " Baht"}</p>
        </div>
      </Link>
      <button className="bg-primary-lighter w-full h-[50px] absolute bottom-0 flex justify-center items-center gap-[5px] hover:bg-primary-default transition cursor-pointer"
        onClick={()=>{}}>
        <p className="body-regular">เพิ่มลงตะกร้า</p>
        <ShoppingCart className="size-[16px]"/>
      </button>
    </div>    
  )
}
