import AddedProduct from "@/interface/components/AddedProduct";

export default function CartPage() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center mt-10">
      <h2 className="header2-bold">ตะกร้าสินค้า (10) ชิ้น</h2>
      <AddedProduct/>
    </div>
  )
}