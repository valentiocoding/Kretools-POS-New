import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  getAllItems, addItem, updateItem, deleteItem, getAllCategories, countItemsByCategory,
} from "@/services/itemServices";
import { Card, CardContent } from "@/components/ui/card";
import Swal from "sweetalert2";

const defaultForm = {
  itemname: "",
  itemcode: "",
  category: "",
  price: "",
  uom: "",
  status: "Active",
  type: "menu",
};

const ItemMasterData = () => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const resetForm = () => setForm(defaultForm);

  const fetchItems = async () => {
    try {
      const itemsData = await getAllItems();
      const categoriesData = await getAllCategories();
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await addItem(form);
      resetForm();
      setAddOpen(false);
      fetchItems();
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await updateItem(selectedItem.id, form);
      resetForm();
      setEditOpen(false);
      setSelectedItem(null);
      fetchItems();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Item masih digunakan tidak bisa dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteItem(selectedItem.id);
      setSelectedItem(null);
      fetchItems();
      Swal.fire("Dihapus!", "Item berhasil dihapus.", "success");
    } catch (error) {
      if (error?.code === "23503") {
        Swal.fire("Gagal!", "Item masih digunakan di transaksi lain.", "error");
      } else {
        Swal.fire("Error!", "Gagal menghapus item.", "error");
      }
    }
  };

  const handleCategoryChange = async (value) => {
    const selectedCategory = categories.find((c) => c.category === value);
    if (!selectedCategory) return;

    try {
      const count = await countItemsByCategory(value);
      const nextNumber = String(count + 1).padStart(3, "0");
      const generatedCode = `${selectedCategory.prefix}-${nextNumber}`;

      setForm({
        ...form,
        category: value,
        itemcode: generatedCode,
      });
    } catch (error) {
      console.error("Failed to generate item code:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredData = items.filter((item) =>
    item.itemname?.toLowerCase().includes(search.toLowerCase()) ||
    item.itemcode?.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h1 className="text-2xl font-bold text-primary">Item Master</h1>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => { setAddOpen(true); resetForm(); }}>Add</Button>
          <Button
            variant="outline"
            disabled={!selectedItem}
            onClick={() => {
              setForm(selectedItem);
              setEditOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            disabled={!selectedItem}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <Input
        placeholder="Search item code or name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md"
      />

      <Card className="shadow-md">
        <CardContent className="p-4 overflow-auto">
          <div className="w-full min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>UOM</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`cursor-pointer ${selectedItem?.id === item.id ? "bg-muted" : ""}`}
                  >
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.itemcode}</TableCell>
                    <TableCell>{item.itemname}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>Rp{Number(item.price).toLocaleString()}</TableCell>
                    <TableCell>{item.uom}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={addOpen || editOpen} onOpenChange={(val) => {
        if (!val) {
          setAddOpen(false);
          setEditOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{addOpen ? "Add Item" : "Edit Item"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(val) =>
                  addOpen ? handleCategoryChange(val) : setForm({ ...form, category: val })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
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
              <Input name="itemcode" value={form.itemcode} readOnly />
            </div>
            <div className="grid gap-1">
              <Label>Item Name</Label>
              <Input name="itemname" value={form.itemname} onChange={(e) => setForm({ ...form, itemname: e.target.value })} />
            </div>
            <div className="grid gap-1">
              <Label>Price</Label>
              <Input name="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="grid gap-1">
              <Label>UOM</Label>
              <Input name="uom" value={form.uom} onChange={(e) => setForm({ ...form, uom: e.target.value })} />
            </div>
            <div className="grid gap-1">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(val) => setForm({ ...form, status: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
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
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menu">menu</SelectItem>
                  <SelectItem value="additional">additional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addOpen ? handleAdd : handleEdit}>
              {addOpen ? "Save" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemMasterData;
