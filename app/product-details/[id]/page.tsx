  "use client";

  import { getProuctByID } from "@/utils/ProducMock";
  import { ProductModel } from "@/utils/ProductModel";
  import axios from "axios";
  import { Minus, Plus, ShoppingCart } from "lucide-react";
  import Image from "next/image";
  import React, { useEffect, useState } from "react";
  import { useSession } from "@/contexts/SessionContext";

  interface ProductModelWithImage extends ProductModel {
  modelImageData?: string; // Base64 encoded image data
}

  export default function ProductDetails({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = React.use(params);
    const [productModel, setProductModel] = useState<ProductModelWithImage | null>(null);
    const [qnty, setQnty] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const { user, isLoading: sessionLoading, setShowLoginModal } = useSession();

    useEffect(() => {
      const fetchProductWithImage = async () => {
        if (id) {
          const numericId = parseInt(id as string, 10);
          if (!isNaN(numericId)) {
            try {
              // First fetch product model information
              const modelResponse = await axios.get(`http://localhost:8081/product-model/${numericId}`);
              const productData: ProductModel = modelResponse.data;

              let modelImageData: string | undefined;

              try {
                // Fetch product model image using the same endpoint as other pages
                const imageResponse = await axios.get(`http://localhost:8081/product-model/image/${numericId}`, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  responseType: 'arraybuffer' // Important for binary image data
                });

                // Convert the array buffer to base64
                const imageData = imageResponse.data;
                const base64String = btoa(
                  new Uint8Array(imageData).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );

                // Get content type from response headers
                const contentType = imageResponse.headers['content-type'] || 'image/jpeg';

                // Create base64 data URL
                modelImageData = `data:${contentType};base64,${base64String}`;

              } catch (imageError) {
                console.warn(`Warning: Could not fetch image for modelId ${numericId}:`, imageError);
                // Continue without image - this is not a critical error
              }

              // Create product model with image data
              const productWithImage: ProductModelWithImage = {
                ...productData,
                modelImageData: modelImageData
              };

              setProductModel(productWithImage);

            } catch (err) {
              console.error('Error fetching product by ID:', err);
            }
          }
          setIsLoading(false);
        }
      };

      fetchProductWithImage();
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
    } catch (error: any) {
      console.error('Error adding to cart:', error);
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
          {productModel.modelImageData ? (
            // Use base64 image data if available (from new endpoint)
            <Image
              src={productModel.modelImageData}
              alt={productModel.modelName}
              width={500}
              height={500}
              className="w-[500px] h-[500px] border-2 object-cover rounded-lg"
              onError={(e) => {
                console.error("Base64 image failed to load:", productModel.modelImageData);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : productModel.modelImage && productModel.modelImage !== 'undefined' && productModel.modelImage.trim() !== '' ? (
            // Fallback to legacy image path if available
            <Image
              src={productModel.modelImage.startsWith('http') ? productModel.modelImage : `/images/${productModel.modelImage}`}
              alt={productModel.modelName}
              width={500}
              height={500}
              className="w-[500px] h-[500px] border-2 object-cover rounded-lg"
              onError={(e) => {
                console.error("Image failed to load:", productModel.modelImage);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            // Fallback placeholder if no image available
            <div className="w-[500px] h-[500px] border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-200">
              <div className="text-center">
                <span className="text-gray-500 text-lg">ไม่มีรูปภาพสินค้า</span>
              </div>
            </div>
          )}
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
