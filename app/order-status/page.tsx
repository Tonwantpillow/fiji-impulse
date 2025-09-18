"use client";

import OrderTile from "@/interface/components/OrderTile";
import { Order } from "@/utils/Order";
import { MockOrder } from "@/utils/OrderMock";
import { useEffect, useState } from "react";

export default function OrderStatus() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchContext, setSearchContext] = useState("");

  const filteredOrders = orders.filter((od) =>
    od.orderId.toLowerCase().includes(searchContext.toLowerCase())
  );

  useEffect(() => {
    const ods = MockOrder;
    setOrders(ods);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading Orders...</div>;
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <h1 className="header1-bold">Order Status</h1>
      <div className="w-full max-w-sm">
        <input
          type="text"
          placeholder="Search order by ID"
          value={searchContext}
          onChange={(e) => setSearchContext(e.target.value)}
          className="w-full rounded-2xl border border-gray-300 px-4 py-2 header4-regular focus:ring-2 focus-ring-primary-default focus:border-primary-darker"
        />
      </div>
      <div className="overflow-x-auto rounded-2xl shadow">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="header3-bold">Order ID</th>
              <th className="header3-bold">Order Date</th>
              <th className="header3-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((od) => (
                <tr key={od.orderId} className="border-t border-gray-300 hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-3 header4-regular">{od.orderId}</td>
                  <td className="px-6 py-3 header4-regular">{od.orderDate}</td>
                  <td className="px-6 py-3 header4-regular">
                    <div className="flex bg-primary-deafult items-center justify-center rounded-xl">
                      {od.orderStatus}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-3 text-center text-gray-400">
                  ไม่พบคำสั่งซื้อ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
