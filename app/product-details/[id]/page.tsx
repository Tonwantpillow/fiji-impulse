"use client";

import { getProuctByID } from "@/utils/ProducMock";
import { Product } from "@/utils/Product";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [qnty, setQnty] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const numericId = parseInt(id as string, 10);
      if (!isNaN(numericId)) {
        const prod = getProuctByID(numericId);
        setProduct(prod);
      }
      setIsLoading(false);
    }
  }, [id]);
  
  const decreaseQnty = () => {
    if (qnty > 1) {
      setQnty(qnty - 1);
    }
  }

  const increaseQnty = () => {
    
  }

  if (isLoading) {
    return <div>Loading Products</div>;
  }
  if (!product) {
    return <div>Product not found</div>;
  }
  
  return (
    <div className="mx-40 my-20 flex gap-3">
      <div className="flex flex-col gap-4 items-center w-full h-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={500}
          height={500}
          className=" w-[500px] h-[500px] border-2"
        />
        <div className="h-[2px] bg-primary-darker w-full"></div>
        <div className="flex items-center">
          <button
            className="rounded-full bg-error-default hover:bg-red-500 transition size-[50px] flex justify-center items-center"
            onClick={() => decreaseQnty()}
          >
            <Minus className="size-[24px]]"></Minus>
          </button>
          <div className="mx-5">
            <p className="headerline-regular">{qnty}</p>
          </div>
          <button
            className="rounded-full bg-success-default hover:bg-green-500 transition size-[50px] flex justify-center items-center"
            onClick={() => setQnty(qnty + 1)}
          >
            <Plus className="size-[24px]"></Plus>
          </button>
        </div>
        <button className="flex items-center justify-center rounded-md gap-2 py-3 px-3  bg-warning-default hover:bg-warning-darker  transition">
          <p className="header4-regular">เพิ่มลงตะกร้า</p>
          <ShoppingCart />
        </button> 
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h2 className="header2-bold"> {product.name} </h2>
        <div className="h-[2px] w-full bg-primary-darker"></div>
        <h2 className="header2-bold text-primary-default">
          {product.price} Baht
        </h2>
        <h1 className="header4-regular">{product.description}</h1>
      </div>
    </div>
  );
}
