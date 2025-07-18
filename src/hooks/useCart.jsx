import { useState } from "react";

export default function useCart() {
  const [bucket, setBucket] = useState([]);

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

  const totalPrice = bucket.reduce((sum, order) => {
    const mainPrice = order.qty * Number(order.item.price);
    const additionalPrice = order.additionals.reduce(
      (acc, a) => acc + a.qty * Number(a.price),
      0
    );
    return sum + mainPrice + additionalPrice;
  }, 0);

  const clearCart = () => setBucket([]);

  return {
    bucket,
    handleAddToBucket,
    handleRemoveFromBucket,
    totalPrice,
    clearCart,
  };
}
