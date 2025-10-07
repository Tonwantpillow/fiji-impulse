import { Check } from "lucide-react";

export default function Checkbox() {
  return (
    <button className="w-fit h-fit p-[3px] bg-primary-lighter rounded-[8px]">
      <Check className="size-[24px] text-white"/>
    </button>
  )
}