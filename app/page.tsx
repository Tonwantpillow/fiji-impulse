'use client'

import Carousel from "@/interface/components/Carousel";
import ProductCard from "@/interface/components/ProductCard";
import SectionLine from "@/interface/components/SectionLine";
import ToTopBtn from "@/interface/components/ToTopBtn";
import { getAllProducts } from "@/utils/ProducMock";
import { Product } from "@/utils/Product";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axios from 'axios';
import { ProductModel } from "@/utils/ProductModel";

export default function Home() {
  const [prods, setProds] = useState<Product[]>([])
  const [prodsModel, setProdsModel] = useState<ProductModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(()=> {
    axios.get('http://localhost:8081/product-model')
      .then(res=> {
        console.log(res.data)
        if (res.data) {
          setProdsModel(res.data)
        }
      })
      .catch(err => {
        console.error('Error fetching products:', err);
      })
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
          {prodsModel.map((p)=>(
            <ProductCard key={p.modelId} {...p}/>
          ))}
        </div>
        <div className="fixed bottom-0 right-10">
          <ToTopBtn/>
        </div>
      </div>
  );
}
