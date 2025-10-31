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

interface ProductModelWithImage extends ProductModel {
  modelImageData?: string; // Base64 encoded image data
}

export default function Home() {
  const [prods, setProds] = useState<Product[]>([])
  const [prodsModel, setProdsModel] = useState<ProductModelWithImage[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(()=> {
    const fetchProductsWithImages = async () => {
      try {
        // First fetch product models
        const modelsResponse = await axios.get('http://localhost:8081/product-model');
        const productModels: ProductModel[] = modelsResponse.data || [];

        // For each product model, fetch its image
        const productsWithImages: ProductModelWithImage[] = await Promise.all(
          productModels.map(async (model) => {
            let modelImageData: string | undefined;

            try {
              // Fetch product model image using the same endpoint as order details
              const imageResponse = await axios.get(`http://localhost:8081/product-model/image/${model.modelId}`, {
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
              console.warn(`Warning: Could not fetch image for modelId ${model.modelId}:`, imageError);
              // Continue without image - this is not a critical error
            }

            return {
              ...model,
              modelImageData: modelImageData
            } as ProductModelWithImage;
          })
        );

        setProdsModel(productsWithImages);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProductsWithImages();

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
