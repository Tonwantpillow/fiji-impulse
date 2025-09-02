'use client'

import Link from "next/link"

export default function LogoBtn() {
  return (
   <Link href={"/"} className="px-3 py-3  mx-2 my-auto rounded-xl bg-primary-subtle flex items-center justify-center cursor-pointer" onClick={() => {}}>
    <h2 className="body-regular">
      <span className="text-primary-default">Fiji</span> <span className="text-primary-darker">Impulse</span>
    </h2>
   </Link> 
  )
}