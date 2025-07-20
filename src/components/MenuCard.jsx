import React, { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

const MenuCard = ({ items = [], additionals = [], onAddToBucket }) => {
  const [quantities, setQuantities] = useState({});
  const [additionalQuantities, setAdditionalQuantities] = useState({});
  const [notes, setNotes] = useState({});
  const [activeItemId, setActiveItemId] = useState(null);

  const handleQtyChange = (id, type) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const updated = type === "plus" ? current + 1 : Math.max(current - 1, 0);
      return { ...prev, [id]: updated };
    });
  };

  const handleAdditionalQtyChange = (itemId, additionalId, type) => {
    const key = `${itemId}-${additionalId}`;
    setAdditionalQuantities((prev) => {
      const current = prev[key] || 0;
      const updated = type === "plus" ? current + 1 : Math.max(current - 1, 0);
      return { ...prev, [key]: updated };
    });
  };

  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const toggleActive = (id) => {
    setActiveItemId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const isActive = activeItemId === item.id;
        const itemQty = quantities[item.id] || 0;
        const itemAdditionals = additionals.filter((add) => add.category === item.category);

        return (
          <Card
            key={item.id}
            onClick={() => toggleActive(item.id)}
            className={`transition-all p-4 border-2 ${
              isActive ? "border-primary bg-muted/40" : "border-transparent hover:bg-muted/10"
            } rounded-2xl cursor-pointer shadow-sm`}
          >
            {/* Header */}
            <div className="flex justify-between items-start font-poppins">
              <div>
                <div className="font-semibold text-base">{item.itemname}</div>
                <div className="text-xs text-muted-foreground capitalize">{item.category}</div>
              </div>
              <div className="font-semibold text-primary text-right text-sm min-w-[90px]">
                Rp{Number(item.price).toLocaleString("id-ID")}
              </div>
            </div>

            {/* Expandable Section */}
            {isActive && (
              <div className="transition-all duration-300 mt-4 space-y-4 text-sm">
                {/* Qty */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Qty</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQtyChange(item.id, "minus");
                      }}
                      className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                    >
                      <MinusIcon size={16} />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={itemQty}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setQuantities((prev) => ({
                          ...prev,
                          [item.id]: isNaN(val) ? 0 : val,
                        }));
                      }}
                      className="w-12 text-center border rounded px-2 py-1 text-sm"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQtyChange(item.id, "plus");
                      }}
                      className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                    >
                      <PlusIcon size={16} />
                    </button>
                  </div>
                </div>

                {/* Additionals */}
                {itemAdditionals.length > 0 && (
                  <div>
                    <div className="font-medium text-muted-foreground mb-2">Additionals</div>
                    <div className="space-y-2">
                      {itemAdditionals.map((add) => {
                        const key = `${item.id}-${add.id}`;
                        const qty = additionalQuantities[key] || 0;

                        return (
                          <div key={add.id} className="flex justify-between items-center">
                            <div className="flex-1 truncate">
                              {add.itemname}{" "}
                              <span className="text-primary font-medium">
                                (Rp{Number(add.price).toLocaleString("id-ID")})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdditionalQtyChange(item.id, add.id, "minus");
                                }}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                              >
                                <MinusIcon size={16} />
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={qty}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  setAdditionalQuantities((prev) => ({
                                    ...prev,
                                    [key]: isNaN(val) ? 0 : val,
                                  }));
                                }}
                                className="w-12 text-center border rounded px-2 py-1 text-sm"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdditionalQtyChange(item.id, add.id, "plus");
                                }}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
                              >
                                <PlusIcon size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="text-muted-foreground mb-1 block">Catatan (opsional)</label>
                  <textarea
                    rows={2}
                    value={notes[item.id] || ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleNoteChange(item.id, e.target.value)}
                    placeholder="Contoh: tanpa sambal, extra mie"
                    className="w-full border rounded-md px-2 py-1 text-sm"
                  />
                </div>

                {/* Add to Bucket */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!onAddToBucket || itemQty === 0) return;

                    const relatedAdditionals = itemAdditionals
                      .map((add) => {
                        const key = `${item.id}-${add.id}`;
                        return { ...add, qty: additionalQuantities[key] || 0 };
                      })
                      .filter((add) => add.qty > 0);

                    const note = notes[item.id] || "";

                    onAddToBucket(item, itemQty, relatedAdditionals, note);

                    setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
                    setAdditionalQuantities((prev) => {
                      const newState = { ...prev };
                      itemAdditionals.forEach((add) => {
                        const key = `${item.id}-${add.id}`;
                        newState[key] = 0;
                      });
                      return newState;
                    });
                    setNotes((prev) => ({ ...prev, [item.id]: "" }));
                    setActiveItemId(null);
                  }}
                  className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 text-sm mt-2"
                >
                  Tambahkan
                </button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default MenuCard;
