import React, { useEffect, useState } from "react";
import { getAllOrders, deleteOrder } from "@/services/itemServices";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient"; // gunakan supabase dari 1 tempat

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("realtime-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders(); // auto refresh if new data
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin hapus?",
      text: "Order ini dan semua detail-nya akan dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteOrder(id);
      await fetchOrders();

      Swal.fire("Terhapus!", "Order berhasil dihapus.", "success");
    } catch (err) {
      console.error("Gagal hapus order:", err);
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus.", "error");
    }
  };

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
              <p className="text-xl font-bold">
                Rp{totalOmzet.toLocaleString("id-ID")}
              </p>
            </Card>
          </div>

          {/* Latest Orders */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">🧾 Order Terbaru</h2>
            {orders.slice(0, 5).map((order) => (
              <Card key={order.id} className="p-4 space-y-1 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium text-primary">
                      Rp{Number(order.total_price).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(order.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <Trash2  size={16} />
                </button>

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
