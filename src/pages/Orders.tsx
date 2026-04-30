import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { Package, ChevronRight, Clock, CheckCircle2, AlertCircle, TrendingUp, ShoppingBag, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const history = [
    {
      month: "November 2023",
      orders: [
        { id: 'PLT-9912', title: "The Autumn Harvest Box", amount: "$72.00", status: "Delivered", items: 3, type: 'completed' },
        { id: 'PLT-9913', title: "Daily Protein Pack", amount: "$45.00", status: "In Transit", items: 2, type: 'active' }
      ]
    },
    {
      month: "October 2023",
      orders: [
        { id: 'PLT-8821', title: "Weekly Wellness Pack", amount: "$48.50", status: "Delivered", items: 4, type: 'completed' },
        { id: 'PLT-8822', title: "Vegan Feast", amount: "$35.00", status: "Cancelled", items: 2, type: 'completed' }
      ]
    }
  ];

  const stats = [
    { label: "Total Orders", value: "24", icon: <ShoppingBag size={14} />, color: "bg-mustard" },
    { label: "Total Spent", value: "$842.50", icon: <Receipt size={14} />, color: "bg-sage" },
    { label: "Saved", value: "$120.00", icon: <TrendingUp size={14} />, color: "bg-tomato" },
  ];

  const filteredHistory = history.map(group => ({
    ...group,
    orders: group.orders.filter(order => 
      activeTab === 'all' || 
      (activeTab === 'active' && order.type === 'active') || 
      (activeTab === 'completed' && order.type === 'completed')
    )
  })).filter(group => group.orders.length > 0);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100 border-green-200';
      case 'in transit': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-mustard-foreground bg-mustard/20 border-mustard/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle2 size={12} />;
      case 'in transit': return <Clock size={12} />;
      case 'cancelled': return <AlertCircle size={12} />;
      default: return <Package size={12} />;
    }
  };

  return (
    <MainLayout title="Order History">
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className={cn("p-5 rounded-3xl border-2 border-ink shadow-stk flex items-center justify-between", stat.color)}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-ink/70 mb-1">{stat.label}</p>
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
                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                activeTab === tab ? "bg-white text-ink border-2 border-ink shadow-stk-sm" : "text-ink/60 hover:text-ink"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="space-y-10">
          <AnimatePresence mode="popLayout">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((group, groupIdx) => (
                <motion.div
                  key={group.month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: groupIdx * 0.1 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-4 px-2">
                    <h3 className="text-[11px] font-black text-ink uppercase tracking-[0.2em]">{group.month}</h3>
                    <div className="h-[2px] flex-1 bg-ink/10 rounded-full" />
                  </div>
                  
                  <div className="space-y-4">
                    {group.orders.map((order, orderIdx) => (
                      <motion.button
                        key={order.id}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="w-full text-left bg-white p-5 rounded-[32px] border-[3px] border-ink shadow-stk flex items-center gap-5 hover:bg-cream transition-all group relative overflow-hidden"
                      >
                        <div className={cn(
                          "w-14 h-14 rounded-2xl border-2 border-ink flex items-center justify-center transition-all group-hover:rotate-6",
                          order.status === 'Delivered' ? 'bg-sage' : 'bg-mustard'
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
                              "flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-ink text-[9px] font-black uppercase tracking-wider",
                              getStatusColor(order.status)
                            )}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </div>
                            <span className="w-1 h-1 bg-ink/20 rounded-full" />
                            <span className="text-xs font-bold text-ink">{order.amount}</span>
                            <span className="w-1 h-1 bg-ink/20 rounded-full" />
                            <span className="text-[10px] font-black text-ink/60 uppercase tracking-widest">{order.items} items</span>
                          </div>
                        </div>

                        <div className="w-10 h-10 border-2 border-ink rounded-full flex items-center justify-center bg-white group-hover:bg-tomato group-hover:text-white transition-colors shrink-0 shadow-stk-sm">
                          <ChevronRight size={18} strokeWidth={3} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag size={40} className="text-ink/20" />
                </div>
                <h3 className="text-xl font-black text-ink">No orders found</h3>
                <p className="text-sm text-ink/60 max-w-xs mx-auto">Looks like you haven't placed any orders in this category yet.</p>
                <button 
                  onClick={() => navigate('/meals')}
                  className="mt-4 px-8 py-3 bg-tomato text-white border-[3px] border-ink rounded-full font-black uppercase tracking-widest shadow-stk hover:-translate-y-1 transition-transform"
                >
                  Start Ordering
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
};

export default Orders;
