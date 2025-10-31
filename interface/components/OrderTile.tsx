import { Order } from "@/utils/Order";
import { getStatusBadgeClasses } from "@/utils/OrderStatusColors";

export default function OrderTile(od: Order) {
  return (
    <div className="w-[50%] rounded-2xl bg-primary-default flex flex-col gap-2 justify-center px-5 py-6">
      <span className="inline-flex gap-2">
        <span className="text-primary-subtle header4-bold">หมายเลขคำสั่งซื้อ : </span>
        <span className="text-primary-darker header4-bold">{od.orderId}</span>
      </span>
      <p className="text-primary-subtle body-regular">{od.orderDate}</p>
      <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusBadgeClasses(od.orderStatus)}`}>
        {od.orderStatus}
      </span>
    </div>
  )
}