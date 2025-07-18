import React, { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { addItem, updateItem, countItemsByCategory } from "@/services/itemServices";

const defaultForm = {
  itemname: "",
  itemcode: "",
  category: "",
  price: "",
  uom: "",
  status: "Active",
  type: "menu",
};

const ItemFormDialog = ({ open, setOpen, categories, selectedItem, isEdit, onSuccess }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (isEdit && selectedItem) {
      setForm(selectedItem);
    } else {
      setForm(defaultForm);
    }
  }, [isEdit, selectedItem]);

  const handleCategoryChange = async (value) => {
    const selected = categories.find((c) => c.category === value);
    if (!selected) return;
    const count = await countItemsByCategory(value);
    const nextCode = `${selected.prefix}-${String(count + 1).padStart(3, "0")}`;
    setForm((prev) => ({ ...prev, category: value, itemcode: nextCode }));
  };

  const handleSubmit = async () => {
    if (!form.itemname || !form.price || !form.uom || !form.category) return;

    if (isEdit) {
      await updateItem(form.id, form);
    } else {
      await addItem(form);
    }
    setOpen(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Item" : "Tambah Item"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(val) =>
                isEdit ? setForm({ ...form, category: val }) : handleCategoryChange(val)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.category}>
                    {cat.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label>Item Code</Label>
            <Input value={form.itemcode} readOnly  disabled/>
          </div>
          <div className="grid gap-1">
            <Label>Item Name</Label>
            <Input
              value={form.itemname}
              onChange={(e) => setForm({ ...form, itemname: e.target.value })}
            />
          </div>
          <div className="grid gap-1">
            <Label>Price</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div className="grid gap-1">
            <Label>UOM</Label>
            <Input
              value={form.uom}
              onChange={(e) => setForm({ ...form, uom: e.target.value })}
            />
          </div>
          <div className="grid gap-1">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(val) => setForm({ ...form, status: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(val) => setForm({ ...form, type: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menu">menu</SelectItem>
                <SelectItem value="additional">additional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemFormDialog;
