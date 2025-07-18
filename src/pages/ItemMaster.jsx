import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Swal from "sweetalert2";
import {
  getAllItems, getAllCategories, addItem, updateItem, deleteItem,
  countItemsByCategory,
} from "@/services/itemServices";
import ItemFormDialog from "@/components/ItemFormDialog";

const ItemMasterData = () => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchData = async () => {
    const [itemsData, catData] = await Promise.all([
      getAllItems(), getAllCategories(),
    ]);
    setItems(itemsData);
    setCategories(catData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = items.filter((item) =>
    item.itemname?.toLowerCase().includes(search.toLowerCase()) ||
    item.itemcode?.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Item masih digunakan tidak bisa dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteItem(selectedItem.id);
      setSelectedItem(null);
      fetchData();
      Swal.fire("Berhasil", "Item berhasil dihapus", "success");
    } catch (err) {
      Swal.fire("Gagal", err?.message || "Gagal menghapus item", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Item Master</h2>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => {
              setEditMode(false);
              setFormOpen(true);
              setSelectedItem(null);
            }}
          >
            Tambah
          </Button>
          <Button
            variant="outline"
            disabled={!selectedItem}
            onClick={() => {
              setEditMode(true);
              setFormOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            disabled={!selectedItem}
            onClick={handleDelete}
          >
            Hapus
          </Button>
        </div>
      </div>

      <Input
        placeholder="Cari kode/nama/kategori item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardContent className="overflow-auto p-0">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
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
                {filtered.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    onDoubleClick={() => {
                      setEditMode(true);
                      setFormOpen(true);
                      setSelectedItem(item);
                    }}
                    className={`cursor-pointer ${
                      selectedItem?.id === item.id ? "bg-muted" : ""
                    }`}
                  >
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

      <ItemFormDialog
        open={formOpen}
        setOpen={setFormOpen}
        categories={categories}
        selectedItem={editMode ? selectedItem : null}
        isEdit={editMode}
        onSuccess={() => {
          fetchData();
          setSelectedItem(null);
        }}
      />
    </div>
  );
};

export default ItemMasterData;
