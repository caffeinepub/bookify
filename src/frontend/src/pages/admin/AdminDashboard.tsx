import {
  BookOpen,
  Clock,
  Loader2,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { useGetStats } from "../../hooks/useQueries";

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) => (
  <div className="bg-card border border-border rounded-xl p-6">
    <div className={`inline-flex p-3 rounded-lg mb-4 ${color}`}>
      <Icon className="h-6 w-6" />
    </div>
    <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetStats();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        data-ocid="dashboard.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">
        Dashboard
      </h1>
      <p className="text-muted-foreground mb-8">
        Overview of your Bookify store
      </p>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        data-ocid="dashboard.section"
      >
        <StatCard
          icon={BookOpen}
          label="Total Products"
          value={stats?.totalProducts?.toString() ?? "0"}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats?.totalOrders?.toString() ?? "0"}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={stats?.pendingOrders?.toString() ?? "0"}
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={`₹${stats?.totalRevenue?.toString() ?? "0"}`}
          color="bg-purple-100 text-purple-600"
        />
      </div>
    </div>
  );
}
