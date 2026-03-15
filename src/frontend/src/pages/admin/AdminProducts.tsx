import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../../backend.d";
import {
  useCreateProduct,
  useDeleteProduct,
  useListProducts,
  useUpdateProduct,
} from "../../hooks/useQueries";

const EMPTY_FORM: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: BigInt(0),
  category: "",
  stockQuantity: BigInt(0),
  imageUrl: "",
  isAvailable: true,
};

const LOADING_KEYS = ["l1", "l2", "l3", "l4", "l5"];

export default function AdminProducts() {
  const { data: products, isLoading } = useListProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      stockQuantity: p.stockQuantity,
      imageUrl: p.imageUrl,
      isAvailable: p.isAvailable,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateProduct.mutateAsync({ ...editing, ...form });
        toast.success("Product updated!");
      } else {
        const id = crypto.randomUUID();
        await createProduct.mutateAsync({ id, ...form });
        toast.success("Product created!");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteId(null);
    }
  };

  const isSaving = createProduct.isPending || updateProduct.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your book inventory</p>
        </div>
        <Button
          onClick={openAdd}
          data-ocid="admin.products.open_modal_button"
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Book
        </Button>
      </div>

      {isLoading ? (
        <div data-ocid="admin.products.loading_state" className="space-y-3">
          {LOADING_KEYS.map((k) => (
            <Skeleton key={k} className="h-12" />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table data-ocid="admin.products.table">
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(products ?? []).length === 0 ? (
                <TableRow data-ocid="admin.products.empty_state">
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-12"
                  >
                    No products yet. Add your first book!
                  </TableCell>
                </TableRow>
              ) : (
                (products ?? []).map((p, i) => (
                  <TableRow
                    key={p.id}
                    data-ocid={`admin.products.row.${i + 1}`}
                  >
                    <TableCell>
                      <img
                        src={
                          p.imageUrl ||
                          "/assets/generated/book-fiction.dim_400x300.jpg"
                        }
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/assets/generated/book-fiction.dim_400x300.jpg";
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{p.category}</Badge>
                    </TableCell>
                    <TableCell>₹{p.price.toString()}</TableCell>
                    <TableCell>{p.stockQuantity.toString()}</TableCell>
                    <TableCell>
                      <Badge variant={p.isAvailable ? "default" : "secondary"}>
                        {p.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(p)}
                          data-ocid={`admin.products.edit_button.${i + 1}`}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteId(p.id)}
                          data-ocid={`admin.products.delete_button.${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.products.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Book" : "Add New Book"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name</Label>
              <Input
                data-ocid="admin.product.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Book title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                data-ocid="admin.product.description.textarea"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                placeholder="Short description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (₹)</Label>
                <Input
                  data-ocid="admin.product.price.input"
                  type="number"
                  min="0"
                  value={form.price.toString()}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      price: BigInt(e.target.value || "0"),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Stock Qty</Label>
                <Input
                  data-ocid="admin.product.stock.input"
                  type="number"
                  min="0"
                  value={form.stockQuantity.toString()}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      stockQuantity: BigInt(e.target.value || "0"),
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Input
                data-ocid="admin.product.category.input"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
                placeholder="e.g. Fiction, Science"
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                data-ocid="admin.product.image.input"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                data-ocid="admin.product.available.switch"
                checked={form.isAvailable}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isAvailable: v }))
                }
              />
              <Label>Available for sale</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.products.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              data-ocid="admin.products.save_button"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {editing ? "Save Changes" : "Create Book"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="admin.products.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.products.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="admin.products.delete.confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
