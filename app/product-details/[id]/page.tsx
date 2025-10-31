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
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
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

    // Note: Removed automatic login modal for product-details page
    // Users can now browse product details without login
    // Login modal will only appear when clicking "Add to Cart"
    
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

    const handleAddToCart = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!productModel) {
      alert('ไม่พบข้อมูลสินค้า');
      return;
    }

    setIsAddingToCart(true);

    try {
      // First, check if this product model already exists in user's orders
      const response = await axios.get(`http://localhost:8081/order-details/order/not-paid/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      let hasExistingProduct = false;

      if (response.data) {
        // Parse the response to check if this product model exists
        Object.entries(response.data).forEach(([key, modelName]) => {
          const match = key.match(/orderDetailId=(\d+).*orderId=(\d+).*modelId=(\d+).*orderQuantity=(\d+).*totalPrice=([\d.]+)/);
          if (match) {
            const modelId = parseInt(match[3]);
            if (modelId === productModel.modelId) {
              hasExistingProduct = true;
            }
          }
        });
      }

      // Choose the appropriate endpoint based on whether product exists
      const endpoint = hasExistingProduct
        ? 'http://localhost:8081/order-details/adjust-to-waiting-order'
        : 'http://localhost:8081/order-details/add-to-waiting-order';

      const result = await axios.post(
        endpoint,
        null,
        {
          params: {
            userId: user.id,
            modelId: productModel.modelId,
            quantity: qnty
          },
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      if (result.status === 200) {
        alert(result.data || 'เพิ่มสินค้าลงตะกร้าสำเร็จแล้ว');
      } else {
        alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
      }

    } catch (error: any) {
      console.error('Error adding to cart:', error);

      if (error.response?.data) {
        alert(error.response.data);
      } else {
        alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า กรุณาลองใหม่');
      }
    } finally {
      setIsAddingToCart(false);
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
            className="flex items-center justify-center rounded-md gap-2 py-3 px-3  bg-warning-default hover:bg-warning-darker  transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <p className="header4-regular">{isAddingToCart ? 'กำลังเพิ่ม...' : 'เพิ่มลงตะกร้า'}</p>
            {!isAddingToCart && <ShoppingCart />}
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
