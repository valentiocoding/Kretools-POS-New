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
    <div className="grid gap-3">
      {items.map((item) => {
        const isActive = activeItemId === item.id;
        const itemQty = quantities[item.id] || 0;
        const itemAdditionals = additionals.filter(
          (add) => add.category === item.category
        );

        return (
          <Card
            key={item.id}
            onClick={() => toggleActive(item.id)}
            className={`transition-shadow p-4 ${
              isActive ? "cursor-default bg-muted/40" : "cursor-pointer"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-start font-poppins px-2">
              <div className="flex flex-col gap-0.5">
                <div className="font-semibold leading-tight">{item.itemname}</div>
                <div className="text-xs text-muted-foreground capitalize leading-tight">
                  {item.category}
                </div>
              </div>
              <div className="font-semibold text-primary text-right min-w-[90px]">
                Rp{Number(item.price).toLocaleString("id-ID")}
              </div>
            </div>

            {/* Expandable Detail Section */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isActive ? "max-h-[1000px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
              }`}
            >
              <div className="transition-opacity duration-300 delay-100">
                {/* Qty */}
                <div className="flex justify-between items-center font-poppins mt-4 px-2">
                  <div className="text-sm text-muted-foreground">Qty</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQtyChange(item.id, "minus");
                      }}
                      className="bg-muted hover:bg-gray-200 text-sm rounded-full p-1"
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
                      className="w-12 text-center border border-gray-300 rounded px-2 py-1 text-sm appearance-none 
                        [&::-webkit-inner-spin-button]:appearance-none 
                        [&::-webkit-outer-spin-button]:appearance-none"
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQtyChange(item.id, "plus");
                      }}
                      className="bg-muted hover:bg-gray-200 text-sm rounded-full p-1"
                    >
                      <PlusIcon size={16} />
                    </button>
                  </div>
                </div>

                {/* Additionals */}
                {itemAdditionals.length > 0 && (
                  <div className="font-poppins px-2 mt-4">
                    <h2 className="font-semibold text-sm text-muted-foreground mb-1">
                      Additionals
                    </h2>
                    <div className="grid gap-2">
                      {itemAdditionals.map((add) => {
                        const key = `${item.id}-${add.id}`;
                        const qty = additionalQuantities[key] || 0;

                        return (
                          <div
                            key={add.id}
                            className="flex justify-between items-center text-sm"
                          >
                            {/* Nama dan harga */}
                            <div className="flex-1 flex items-center gap-1 text-muted-foreground truncate">
                              <span className="truncate">{add.itemname}</span>
                              <span className="text-primary font-medium whitespace-nowrap">
                                (Rp{Number(add.price).toLocaleString("id-ID")})
                              </span>
                            </div>

                            {/* Control qty */}
                            <div className="flex items-center gap-x-2 min-w-[110px] justify-end pl-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdditionalQtyChange(item.id, add.id, "minus");
                                }}
                                className="bg-muted hover:bg-gray-200 text-sm rounded-full p-1"
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
                                  const key = `${item.id}-${add.id}`;
                                  setAdditionalQuantities((prev) => ({
                                    ...prev,
                                    [key]: isNaN(val) ? 0 : val,
                                  }));
                                }}
                                className="w-12 text-center border border-gray-300 rounded px-2 py-1 text-sm appearance-none 
                                  [&::-webkit-inner-spin-button]:appearance-none 
                                  [&::-webkit-outer-spin-button]:appearance-none"
                              />

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdditionalQtyChange(item.id, add.id, "plus");
                                }}
                                className="bg-muted hover:bg-gray-200 text-sm rounded-full p-1"
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
                <div className="px-2 mt-4">
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Notes (Opsional)
                  </label>
                  <textarea
                    className="w-full border rounded-md text-sm px-2 py-1"
                    rows={2}
                    value={notes[item.id] || ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleNoteChange(item.id, e.target.value)}
                    placeholder="Contoh: Tanpa sambal, ekstra bawang..."
                  />
                </div>

                {/* Button */}
                <div className="px-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!onAddToBucket || itemQty === 0) return;

                      const relatedAdditionals = itemAdditionals
                        .map((add) => {
                          const key = `${item.id}-${add.id}`;
                          return {
                            ...add,
                            qty: additionalQuantities[key] || 0,
                          };
                        })
                        .filter((add) => add.qty > 0);

                      const note = notes[item.id] || "";

                      onAddToBucket(item, itemQty, relatedAdditionals, note);

                      // Reset state
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

                      // Close card
                      setActiveItemId(null);
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-white text-sm rounded-md py-2 mt-2"
                  >
                    Add to Bucket
                  </button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default MenuCard;
