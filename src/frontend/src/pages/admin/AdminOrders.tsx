import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { OrderStatus } from "../../backend.d";
import { useListOrders, useUpdateOrderStatus } from "../../hooks/useQueries";

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.confirmed]: "bg-blue-100 text-blue-800",
  [OrderStatus.shipped]: "bg-indigo-100 text-indigo-800",
  [OrderStatus.delivered]: "bg-green-100 text-green-800",
  [OrderStatus.cancelled]: "bg-red-100 text-red-800",
};

const STATUS_OPTIONS = [
  { value: OrderStatus.pending, label: "Pending" },
  { value: OrderStatus.confirmed, label: "Confirmed" },
  { value: OrderStatus.shipped, label: "Shipped" },
  { value: OrderStatus.delivered, label: "Delivered" },
  { value: OrderStatus.cancelled, label: "Cancelled" },
];

const LOADING_KEYS = ["l1", "l2", "l3", "l4", "l5"];

export default function AdminOrders() {
  const { data: orders, isLoading } = useListOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Orders</h1>
      <p className="text-muted-foreground mb-8">Manage customer orders</p>

      {isLoading ? (
        <div data-ocid="admin.orders.loading_state" className="space-y-3">
          {LOADING_KEYS.map((k) => (
            <Skeleton key={k} className="h-14" />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table data-ocid="admin.orders.table">
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(orders ?? []).length === 0 ? (
                <TableRow data-ocid="admin.orders.empty_state">
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-12"
                  >
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                (orders ?? []).map((order, i) => (
                  <TableRow
                    key={order.id}
                    data-ocid={`admin.orders.row.${i + 1}`}
                  >
                    <TableCell className="font-mono text-xs">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.customerName}
                    </TableCell>
                    <TableCell>{order.phoneNumber}</TableCell>
                    <TableCell>
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{order.totalAmount.toString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(
                        Number(order.createdAt) / 1_000_000,
                      ).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(v) =>
                          handleStatusChange(order.id, v as OrderStatus)
                        }
                      >
                        <SelectTrigger
                          className="w-36"
                          data-ocid={`admin.orders.status.select.${i + 1}`}
                        >
                          <SelectValue>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}
                            >
                              {order.status}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[opt.value]}`}
                              >
                                {opt.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
