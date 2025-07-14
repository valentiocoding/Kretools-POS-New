import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  getAllItems, addItem, updateItem, deleteItem
} from "@/services/itemServices";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ItemMasterData = () => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [form, setForm] = useState({
    itemname: "",
    itemcode: "",
    category: "",
    price: "",
    uom: "",
    status: "",
    type: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchItems = async () => {
    try {
      const data = await getAllItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAdd = async () => {
  try {
    const cleanForm = {
      itemname: form.itemname,
      itemcode: form.itemcode,
      category: form.category,
      price: form.price,
      uom: form.uom,
      status: form.status,
      type: form.type,
    };

    console.log("🔧 Clean Payload:", cleanForm);

    await addItem(cleanForm);

    setForm({
      itemname: "",
      itemcode: "",
      category: "",
      price: "",
      uom: "",
      status: "",
      type: "",
    });

    setAddOpen(false);
    fetchItems();
  } catch (error) {
    console.error("Failed to add item:", error);
  }
};


  const handleEdit = async () => {
    try {
      await updateItem(editItem.id, form);
      setEditOpen(false);
      fetchItems();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteItem(id);
      fetchItems();
    } catch (error) {
      console.error("Failed to delete item:", error);
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
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Item Master</h1>
        <Button onClick={() => setAddOpen(true)}>Add Item</Button>
      </div>

      <Input
        placeholder="Search item code or name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md"
      />

      <Card className="shadow-xl">
        <CardContent className="overflow-x-auto p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>UOM</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.itemcode}</TableCell>
                  <TableCell>{item.itemname}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>Rp{item.price?.toLocaleString()}</TableCell>
                  <TableCell>{item.uom}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditItem(item);
                          setForm(item);
                          setEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Add Item */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Item Name</Label>
            <Input name="itemname" value={form.itemname} onChange={handleChange} />
            <Label>Item Code</Label>
            <Input name="itemcode" value={form.itemcode} onChange={handleChange} />
            <Label>Category</Label>
            <Input name="category" value={form.category} onChange={handleChange} />
            <Label>Price</Label>
            <Input name="price" type="number" value={form.price} onChange={handleChange} />
            <Label>UOM</Label>
            <Input name="uom" value={form.uom} onChange={handleChange} />
            <Label>Status</Label>
            <Input name="status" value={form.status} onChange={handleChange} />
            <Label>Type</Label>
            <Input name="type" value={form.type} onChange={handleChange} />
          </div>
          <DialogFooter>
            <Button onClick={handleAdd}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Item */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Item Name</Label>
            <Input name="itemname" value={form.itemname} onChange={handleChange} />
            <Label>Item Code</Label>
            <Input name="itemcode" value={form.itemcode} onChange={handleChange} />
            <Label>Category</Label>
            <Input name="category" value={form.category} onChange={handleChange} />
            <Label>Price</Label>
            <Input name="price" type="number" value={form.price} onChange={handleChange} />
            <Label>UOM</Label>
            <Input name="uom" value={form.uom} onChange={handleChange} />
            <Label>Status</Label>
            <Input name="status" value={form.status} onChange={handleChange} />
            <Label>Type</Label>
            <Input name="type" value={form.type} onChange={handleChange} />
          </div>
          <DialogFooter>
            <Button onClick={handleEdit}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemMasterData;
