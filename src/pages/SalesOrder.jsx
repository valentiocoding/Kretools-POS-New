import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  getAllAdditionals,
  getAllMenusActive,
  insertOrder,
} from "@/services/itemServices";
import MenuCard from "@/components/MenuCard";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient";

const SalesOrder = () => {
  const [bucket, setBucket] = useState([]);
  const [items, setItems] = useState([]);
  const [additionals, setAdditionals] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuData, additionalsData] = await Promise.all([
          getAllMenusActive(),
          getAllAdditionals(),
        ]);
        setItems(menuData);
        setAdditionals(additionalsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const rawCategories = [...new Set(items.map((i) => i.category))];
  const categories = rawCategories.includes("Main Dish")
    ? ["Main Dish", ...rawCategories.filter((cat) => cat !== "Main Dish")]
    : rawCategories;

  const handleAddToBucket = (item, qty, selectedAdditionals = [], note = "") => {
    if (qty === 0) return;
    const order = {
      item,
      qty,
      additionals: selectedAdditionals.filter((a) => a.qty > 0),
      note,
    };
    setBucket((prev) => [...prev, order]);
  };

  const handleRemoveFromBucket = (index) => {
    setBucket((prev) => {
      const newBucket = [...prev];
      newBucket.splice(index, 1);
      return newBucket;
    });
  };

  const safePrice = (price) => {
    const p = Number(price);
    return isNaN(p) ? 0 : p;
  };

  const totalPrice = bucket.reduce((sum, order) => {
    const mainPrice = order.qty * safePrice(order.item.price);
    const additionalPrice = order.additionals.reduce(
      (acc, a) => acc + a.qty * safePrice(a.price),
      0
    );
    return sum + mainPrice + additionalPrice;
  }, 0);

  const handleTestMidtrans = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const access_token = sessionData?.session?.access_token;

      if (!access_token) {
        throw new Error("❌ Token tidak ditemukan. Pastikan user sudah login.");
      }

      const dummyPayload = {
        order_id: customerName,
        gross_amount: totalPrice,
        customer_name: customerName,
      };

      const midtransRes = await fetch("https://norhnvdhmkjjeqmpovlh.supabase.co/functions/v1/create-midtrans-transaction", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dummyPayload),
      });

      const midtransData = await midtransRes.json();

      if (!midtransRes.ok) {
        throw new Error(midtransData.message || midtransData.error || "Gagal membuat transaksi Midtrans");
      }

      // ✅ Show Snap embed popup
      if (window.snap) {
        window.snap.pay(midtransData.token, {
          onSuccess: function (result) {
            console.log("✅ Success:", result);
            Swal.fire("Berhasil", "Pembayaran sukses", "success");
          },
          onPending: function (result) {
            console.log("⏳ Pending:", result);
            Swal.fire("Pending", "Menunggu pembayaran", "info");
          },
          onError: function (result) {
            console.error("❌ Error:", result);
            Swal.fire("Gagal", "Pembayaran gagal", "error");
          },
          onClose: function () {
            console.log("❌ Dibatalkan oleh user");
          },
        });
      } else {
        throw new Error("Midtrans snap.js tidak ditemukan di window.");
      }
    } catch (err) {
      console.error("❌ Error saat test Midtrans:", err.message);
      Swal.fire("Gagal", err.message || "Gagal test Midtrans", "error");
    }
  };

  const handleSaveOrder = async () => {
    if (!customerName || bucket.length === 0) {
      Swal.fire("Oops!", "Nama customer dan item tidak boleh kosong!", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Simpan Order?",
      text: "Apakah Anda yakin ingin menyimpan pesanan ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;
    setIsSaving(true);

    const payload = {
      order: {
        customer_name: customerName,
        total_price: totalPrice,
      },
      order_details: [],
    };

    bucket.forEach((order) => {
      payload.order_details.push({
        item_id: order.item.id,
        itemname: order.item.itemname,
        type: order.item.type,
        qty: order.qty,
        price: safePrice(order.item.price),
        subtotal: order.qty * safePrice(order.item.price),
        note: order.note || "",
      });

      order.additionals.forEach((a) => {
        payload.order_details.push({
          item_id: a.id,
          itemname: a.itemname,
          type: a.type,
          qty: a.qty,
          price: safePrice(a.price),
          subtotal: a.qty * safePrice(a.price),
          note: "",
        });
      });
    });

    try {
      await insertOrder(payload);
      await handleTestMidtrans();
      setCustomerName("");
      setBucket([]);
    } catch (err) {
      console.error("Failed to save order:", err.message);
      Swal.fire("Error", "Gagal menyimpan order", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">🔄 Loading menu dan tambahan...</p>;
  }

  if (categories.length === 0) {
    return <p className="text-center mt-10">⚠️ Tidak ada kategori menu ditemukan.</p>;
  }

  return (
    <div className="flex flex-col min-h-screen font-poppins">
      <header className="text-2xl font-bold text-center py-4 border-b">
        Sales Order
      </header>

      <Tabs defaultValue={categories[0]} className="flex-1 flex flex-col">
        <TabsList className="overflow-x-auto scrollbar-hide px-2 flex gap-2 border-b py-2">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="text-sm px-3 py-1 whitespace-nowrap rounded-full bg-muted hover:bg-muted/60">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto p-3">
          {categories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <MenuCard
                items={items.filter((item) => item.category === cat)}
                additionals={additionals}
                onAddToBucket={handleAddToBucket}
              />
            </TabsContent>
          ))}
        </div>

        <footer className="sticky bottom-0 bg-white border-t p-4 shadow-inner space-y-2">
          <input
            type="text"
            placeholder="Nama Customer"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 border rounded-xl text-sm"
          />

          <div className="max-h-40 overflow-y-auto border rounded-xl p-2 space-y-2 scrollbar-hide text-sm">
            {bucket.length === 0 ? (
              <p className="text-muted-foreground text-sm">Belum ada item.</p>
            ) : (
              bucket.map((order, idx) => (
                <div key={idx} className="border-b pb-1">
                  <div className="flex justify-between">
                    <span>{order.qty}x {order.item.itemname}</span>
                    <div className="flex items-center gap-2">
                      <span>Rp{(order.qty * safePrice(order.item.price)).toLocaleString("id-ID")}</span>
                      <Trash size={16} className="text-red-500 cursor-pointer" onClick={() => handleRemoveFromBucket(idx)} />
                    </div>
                  </div>
                  {order.note && <p className="text-xs text-muted-foreground mt-0.5">Note: {order.note}</p>}
                  {order.additionals.length > 0 && (
                    <ul className="ml-4 text-xs text-muted-foreground">
                      {order.additionals.map((a, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{a.qty}x {a.itemname}</span>
                          <span>Rp{(a.qty * safePrice(a.price)).toLocaleString("id-ID")}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between font-semibold text-base">
            <span>Total:</span>
            <span>Rp{totalPrice.toLocaleString("id-ID")}</span>
          </div>

          <button
            onClick={handleSaveOrder}
            className="w-full py-2 rounded-xl bg-yellow text-black font-semibold hover:bg-blue hover:text-white disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </footer>
      </Tabs>
    </div>
  );
};

export default SalesOrder;
