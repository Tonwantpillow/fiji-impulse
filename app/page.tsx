'use client'

import Carousel from "@/interface/components/Carousel";
import ProductCard from "@/interface/components/ProductCard";
import SectionLine from "@/interface/components/SectionLine";
import ToTopBtn from "@/interface/components/ToTopBtn";
import { getAllProducts } from "@/utils/ProducMock";
import { Product } from "@/utils/Product";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Home() {
  const [prods, setProds] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(()=> {
    const products = getAllProducts()
    setProds(products)
    if (products) {
      setIsLoading(false)
    }
  }, [])
  if (isLoading) {
    return <div>Loading Products...</div>
  }
  return (
      <div className="flex flex-col justify-center items-center">
        <div className="py-[30px] w-full"> 
          <Carousel/> 
        </div>
        <SectionLine/>
        <div className="grid grid-cols-3 gap-10 p-4">
          {prods.map((p)=>(
            <ProductCard key={p.id} {...p}/>
          ))}
        </div>
        <ToTopBtn/>
      </div>
  );
}
