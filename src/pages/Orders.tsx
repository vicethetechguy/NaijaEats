import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { Package, ChevronRight } from 'lucide-react';

const Orders: React.FC = () => {
  const navigate = useNavigate();

  const history = [
    {
      month: "November 2023",
      orders: [
        { id: 'PLT-9912', title: "The Autumn Harvest Box", amount: "$72.00", status: "Delivered", items: 3 }
      ]
    },
    {
      month: "October 2023",
      orders: [
        { id: 'PLT-8821', title: "Weekly Wellness Pack", amount: "$48.50", status: "Delivered", items: 4 }
      ]
    }
  ];

  return (
    <MainLayout title="Order History">
      <div className="space-y-10">
        {history.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-4">{group.month}</h3>
            <div className="space-y-4">
              {group.orders.map(order => (
                <button
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="w-full text-left bg-muted/30 p-6 rounded-[32px] border border-border shadow-sm flex items-center gap-6 hover:bg-muted/50 transition-all group"
                >
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Package size={28} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{order.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tighter">
                      <span className="text-foreground">{order.amount}</span>
                      <span className="w-1 h-1 bg-border rounded-full" />
                      <span className="text-green-500">{order.status}</span>
                      <span className="w-1 h-1 bg-border rounded-full" />
                      <span className="text-muted-foreground">{order.items} Items</span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Orders;
