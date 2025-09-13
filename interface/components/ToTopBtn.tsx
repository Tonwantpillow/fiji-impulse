'use client'

import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { ArrowUpAZ, ChevronUp } from "lucide-react"
gsap.registerPlugin(ScrollToPlugin)
export default function ToTopBtn() {
  const scrollToTop = () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: 0 },
      ease: "power2.inOut"
    })
  }
  return (
    <button onClick={scrollToTop} className=" w-[40px] h-[40px] my-10 rounded-full border-black border-[2px] flex justify-center items-center">
      <ChevronUp className="size-[30px]"/>
    </button>
  )
}