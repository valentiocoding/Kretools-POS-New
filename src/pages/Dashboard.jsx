import React, { useEffect, useState } from "react";
import { getAllOrders, deleteOrder } from "@/services/itemServices";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient";
import { format, parseISO, isSameDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [enabledDates, setEnabledDates] = useState([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);

      // Ambil unique date dari order.created_at
      const dates = data.map((o) => o.created_at.split("T")[0]);
      setEnabledDates([...new Set(dates)]);
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
        fetchOrders(); // auto refresh
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (date) {
      setFilteredOrders(
        orders.filter((o) =>
          isSameDay(new Date(o.created_at), date)
        )
      );
    } else {
      setFilteredOrders(orders);
    }
  }, [date, orders]);

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

  const totalOrder = filteredOrders.length;
  const totalOmzet = filteredOrders.reduce(
    (sum, o) => sum + Number(o.total_price),
    0
  );

  const parsedEnabledDates = enabledDates.map((d) => parseISO(d));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      {/* Date Picker */}
      <div className="mb-4">
        <p className="font-poppins">Pilih tanggal</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!date}
              className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) =>
                !parsedEnabledDates.some((enabled) => isSameDay(enabled, d))
              }
            />
          </PopoverContent>
        </Popover>
      </div>

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

          {/* Orders List */}
          <div className="space-y-4 max-h-[60vh] overflow-auto scrollbar-hide pr-2">
            <h2 className="text-lg font-semibold">🧾 Daftar Order</h2>
            {filteredOrders.length === 0 && (
              <p className="text-muted-foreground">Tidak ada order.</p>
            )}
            {filteredOrders.map((order) => (
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
                  <Trash2 size={16} />
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
