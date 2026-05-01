import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { Package, ChevronRight, Clock, CheckCircle2, AlertCircle, TrendingUp, ShoppingBag, Receipt, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  title: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Orders", value: "0", icon: <ShoppingBag size={14} />, color: "bg-mustard" },
    { label: "Total Spent", value: "₦0", icon: <Receipt size={14} />, color: "bg-sage" },
    { label: "Saved", value: "₦0", icon: <TrendingUp size={14} />, color: "bg-tomato" },
  ]);

  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('eater_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        const fetchedOrders = data.map(o => ({
          id: o.id.slice(0, 8).toUpperCase(),
          title: "Meal Delivery",
          total_amount: o.total_amount,
          status: o.status,
          created_at: o.created_at
        }));
        setOrders(fetchedOrders);

        const totalSpent = fetchedOrders.reduce((acc, curr) => acc + curr.total_amount, 0);
        setStats([
          { label: "Total Orders", value: String(fetchedOrders.length), icon: <ShoppingBag size={14} />, color: "bg-mustard" },
          { label: "Total Spent", value: `₦${totalSpent.toLocaleString()}`, icon: <Receipt size={14} />, color: "bg-sage" },
          { label: "Saved", value: `₦${(totalSpent * 0.1).toLocaleString()}`, icon: <TrendingUp size={14} />, color: "bg-tomato" },
        ]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [navigate]);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'preparing', 'out_for_delivery'].includes(order.status.toLowerCase());
    if (activeTab === 'completed') return order.status.toLowerCase() === 'delivered';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100 border-green-200';
      case 'out_for_delivery': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'preparing': return 'text-mustard-foreground bg-mustard/20 border-mustard/30';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-ink/40 bg-ink/5 border-ink/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle2 size={12} />;
      case 'out_for_delivery': return <Clock size={12} />;
      case 'cancelled': return <AlertCircle size={12} />;
      default: return <Package size={12} />;
    }
  };

  return (
    <MainLayout title="Order history">
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className={cn("p-5 rounded-3xl border-2 border-ink shadow-stk flex items-center justify-between", stat.color)}>
              <div>
                <p className="text-[10px] font-black tracking-widest text-ink/70 mb-1">{stat.label}</p>
                <h4 className="text-xl font-black text-ink">{stat.value}</h4>
              </div>
              <div className="w-10 h-10 bg-white border-2 border-ink rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 bg-ink/5 border-2 border-ink rounded-2xl w-fit mx-auto sm:mx-0">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black tracking-wide transition-all",
                activeTab === tab ? "bg-white text-ink border-2 border-ink shadow-stk-sm" : "text-ink/60 hover:text-ink"
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="space-y-10">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-tomato" size={40} />
              <p className="font-bold text-ink/40 tracking-wider text-xs">Loading history...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="grid gap-4">
              {filteredOrders.map((order, orderIdx) => (
                <motion.button
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: orderIdx * 0.05 }}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="w-full text-left bg-white p-5 rounded-[32px] border-[3px] border-ink shadow-stk flex items-center gap-5 hover:bg-cream transition-all group relative overflow-hidden"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl border-2 border-ink flex items-center justify-center transition-all group-hover:rotate-6",
                    order.status === 'delivered' ? 'bg-sage' : 'bg-mustard'
                  )}>
                    <Package size={24} className="text-ink" strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-black text-ink text-base truncate tracking-tight">{order.title}</h4>
                      <span className="text-[10px] font-black text-ink/40 whitespace-nowrap">#{order.id}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-ink text-[9px] font-black tracking-wide",
                        getStatusColor(order.status)
                      )}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace(/_/g, ' ')}
                      </div>
                      <span className="w-1 h-1 bg-ink/20 rounded-full" />
                      <span className="text-xs font-bold text-ink">₦{order.total_amount.toLocaleString()}</span>
                      <span className="w-1 h-1 bg-ink/20 rounded-full" />
                      <span className="text-[10px] font-black text-ink/60 tracking-wider">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="w-10 h-10 border-2 border-ink rounded-full flex items-center justify-center bg-white group-hover:bg-tomato group-hover:text-white transition-colors shrink-0 shadow-stk-sm">
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-ink/20" />
              </div>
              <h3 className="text-xl font-black text-ink">No orders found</h3>
              <p className="text-sm text-ink/60 max-w-xs mx-auto">Looks like you haven't placed any orders in this category yet.</p>
              <button 
                onClick={() => navigate('/meals')}
                className="mt-4 px-8 py-3 bg-tomato text-white border-[3px] border-ink rounded-full font-black tracking-wide shadow-stk hover:-translate-y-1 transition-transform"
              >
                Start ordering
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Orders;
