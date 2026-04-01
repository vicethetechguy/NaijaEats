import { LayoutGrid } from "lucide-react";
import { MainLayout } from "@/components/Layouts";

const Orders = () => {
  return (
    <MainLayout title="Orders">
      <div className="flex flex-col items-center justify-center mt-20">
        <LayoutGrid size={40} className="text-muted-foreground mb-3" />
        <h2 className="text-lg font-bold text-foreground mb-1">No orders yet</h2>
        <p className="text-sm text-muted-foreground text-center">Your order history will appear here once you place your first order.</p>
      </div>
    </MainLayout>
  );
};

export default Orders;
