import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  getAllAdditionals,
  insertOrder,
  getAllMenusActive,
} from "@/services/itemServices";
import MenuCard from "@/components/MenuCard";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";

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
      const orderId = await insertOrder(payload);
      Swal.fire("Berhasil!", `Order berhasil disimpan.`, "success");
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
    <div>
      <h1 className="text-3xl font-bold text-center my-6 font-poppins">Sales Order</h1>

      <main>
        <Tabs defaultValue={categories[0]} className="items-center">
          <TabsList className="w-full md:w-[50%] flex flex-wrap gap-2">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="whitespace-nowrap">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="overflow-y-auto border-2 rounded-2xl scrollbar-hide h-[60vh] p-2 mt-2">
            {categories.map((cat) => (
              <TabsContent key={cat} value={cat} className="p-5 my-2">
                <MenuCard
                  items={items.filter((item) => item.category === cat)}
                  additionals={additionals}
                  onAddToBucket={handleAddToBucket}
                />
              </TabsContent>
            ))}
          </div>

          <footer className="w-full md:w-[50%] p-2 mt-3 space-y-3">
            <h2 className="font-semibold text-lg">
              🧾 Ringkasan Order{" "}
              {bucket.length !== 0
                ? `(${bucket.length} item${bucket.length > 1 ? "s" : ""})`
                : ""}
            </h2>

            <input
              type="text"
              placeholder="Nama Customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border rounded-xl text-sm"
            />

            {bucket.length === 0 ? (
              <p className="text-muted-foreground text-sm">Belum ada item.</p>
            ) : (
              <>
                <ul className="text-sm space-y-2 h-28 scrollbar-hide overflow-y-auto pr-1 border-2 rounded-2xl p-2">
                  {bucket.map((order, idx) => (
                    <li key={idx}>
                      <div className="flex justify-between items-center">
                        <span>
                          {order.qty}x {order.item.itemname}
                        </span>
                        <div className="flex items-center gap-2">
                          <span>
                            {(order.qty * safePrice(order.item.price)).toLocaleString("id-ID")}
                          </span>
                          <Trash
                            onClick={() => handleRemoveFromBucket(idx)}
                            className="cursor-pointer text-red-600"
                            size={16}
                          />
                        </div>
                      </div>
                      {order.note && (
                        <div className="text-sm text-muted-foreground">
                          <p>Note: {order.note}</p>
                        </div>
                      )}
                      {order.additionals.length > 0 && (
                        <ul className="ml-4 text-xs text-muted-foreground">
                          {order.additionals.map((a, i) => (
                            <li key={i} className="flex justify-between">
                              <span>
                                {a.qty}x {a.itemname}
                              </span>
                              <span>Rp{(a.qty * safePrice(a.price)).toLocaleString("id-ID")}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-lg">
                    Rp{totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <button
                  onClick={handleSaveOrder}
                  className="bg-yellow w-full p-2 font-poppins rounded-2xl cursor-pointer hover:bg-blue hover:text-white disabled:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </>
            )}
          </footer>
        </Tabs>
      </main>
    </div>
  );
};

export default SalesOrder;
