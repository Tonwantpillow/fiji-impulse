  "use client";

  import { getProuctByID } from "@/utils/ProducMock";
  import { ProductModel } from "@/utils/ProductModel";
  import axios from "axios";
  import { Minus, Plus, ShoppingCart } from "lucide-react";
  import Image from "next/image";
  import React, { useEffect, useState } from "react";
  import { useSession } from "@/contexts/SessionContext";

  export default function ProductDetails({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = React.use(params);
    const [productModel, setProductModel] = useState<ProductModel | null>(null);
    const [qnty, setQnty] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { user, isLoading: sessionLoading, setShowLoginModal } = useSession();

    useEffect(() => {
      if (id) {
        const numericId = parseInt(id as string, 10);
        if (!isNaN(numericId)) {
          axios.get(`http://localhost:8081/product-model/${numericId}`)
          .then(res => {
            if (res.data) {
              setProductModel(res.data);
            }
          })
          .catch(err => {
            console.error('Error fetching product by ID:', err);
          });
        }
        setIsLoading(false);
      }
    }, [id]);

    // Show login modal if user is not authenticated on product-details page
    useEffect(() => {
      if (!sessionLoading && !user) {
        // Delay to ensure page renders first
        const timer = setTimeout(() => {
          setShowLoginModal(true);
        }, 200);
        return () => clearTimeout(timer);
      }
    }, [user, sessionLoading, setShowLoginModal]);
    
    const decreaseQnty = () => {
      if (qnty > 1) {
        setQnty(qnty - 1);
      }
    }

    const increaseQnty = () => {
      if (qnty <= 99) {
        setQnty(qnty + 1);
      }
    }

    if (isLoading) {
      return <div>Loading Products</div>;
    }
    if (!productModel) {
      return <div>Product not found</div>;
    }

    return (
      <div className="mx-40 my-20 flex flex-col sm:flex-row gap-3">
        <div className="flex flex-col gap-4 items-center w-full h-full">
          <Image
            src={"/images/" + productModel.modelImage}
            alt={productModel.modelName}
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
              <Minus className="size-[24px]"></Minus>
            </button>
            <div className="mx-5">
              <p className="headerline-regular">{qnty}</p>
            </div>
            <button
              className="rounded-full bg-success-default hover:bg-green-500 transition size-[50px] flex justify-center items-center"
              onClick={() => increaseQnty()}
            >
              <Plus className="size-[24px]"></Plus>
            </button>
          </div>
          <button
            className="flex items-center justify-center rounded-md gap-2 py-3 px-3  bg-warning-default hover:bg-warning-darker  transition"
            onClick={() => {
              if (!user) {
                setShowLoginModal(true);
              } else {
                // TODO: Add item to cart logic here
                console.log('Adding to cart:', productModel?.modelName, 'Quantity:', qnty);
              }
            }}
          >
            <p className="header4-regular">เพิ่มลงตะกร้า</p>
            <ShoppingCart />
          </button> 
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h2 className="header2-bold"> {productModel.modelName} </h2>
          <div className="h-[2px] w-full bg-primary-darker"></div>
          <h2 className="header2-bold text-primary-default">
            {productModel.price.toFixed(2)} Baht
          </h2>
          <h1 className="header4-regular">{productModel.description}</h1>
        </div>
      </div>
    );
  }
