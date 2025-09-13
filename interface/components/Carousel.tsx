import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  '/images/banner1.png',
  '/images/banner2.jpeg',
  '/images/banner3.jpg',
]
export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 2000); // เลื่อนทุก 2 วินาที

    return () => clearInterval(interval); // cleanup
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev -1));
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="relative w-full    mx-auto overflow-hidden">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${current * 100}%)`}}>
        {images.map((src,index) => (
          <div key={index} className="w-full flex-shrink-0 relative h-64">
          <Image
            src={src}
            alt={`Slide ${index}`}
            fill
            className="object-cover"
            priority={index === 0} // preload เฉพาะรูปแรก
          />
        </div>
        ))}
      </div>
    </div>    
  )
}