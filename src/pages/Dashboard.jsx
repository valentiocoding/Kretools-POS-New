import React, { useEffect, useState } from "react";
import { getAllOrders } from "@/services/itemServices";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setIsLoading(false));
    
  }, []);
  const totalOrder = orders.length;
  const totalOmzet = orders.reduce((sum, o) => sum + Number(o.total_price), 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4">
              <h2 className="text-sm text-muted-foreground">Total Order</h2>
              <p className="text-xl font-bold">{totalOrder}</p>
            </Card>
            <Card className="p-4">
              <h2 className="text-sm text-muted-foreground">Total Omzet</h2>
              <p className="text-xl font-bold">Rp{totalOmzet.toLocaleString("id-ID")}</p>
            </Card>
          </div>

          {/* Latest Orders */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">🧾 Order Terbaru</h2>
            {orders.slice(0, 5).map((order) => (
              <Card key={order.id} className="p-4 space-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="font-medium text-primary">
                    Rp{Number(order.total_price).toLocaleString("id-ID")}
                  </div>
                </div>

                {/* Order Details */}
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  {order.order_details.map((detail) => (
                    <li key={detail.id} className="flex justify-between">
                      <span>
                        {detail.qty}x {detail.itemname}
                        {detail.note ? ` (Catatan: ${detail.note})` : ""}
                      </span>
                      <span>
                        Rp{(detail.qty * detail.price).toLocaleString("id-ID")}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
