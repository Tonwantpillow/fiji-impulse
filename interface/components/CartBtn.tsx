'use client'

import { ShoppingBasket } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CartBtn() {
  const router = useRouter();

  return (
    <button className="cursor-pointer" onClick={() => router.push('/cart')}>
      <ShoppingBasket className="text-primary-subtle size-[35px]"/>
    </button>
  );
}