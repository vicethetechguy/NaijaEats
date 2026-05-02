import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { 
  Store, 
  Package, 
  BarChart3, 
  TrendingUp, 
  Plus, 
  Camera, 
  Save,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const RestaurantDashboard: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { profile, refreshProfile } = useUser();
  const [inventory, setInventory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const activeTab = 
    pathname.includes('/inventory') ? 'inventory' : 
    pathname.includes('/orders') ? 'orders' : 
    pathname.includes('/profile') ? 'profile' : 'sales';
  
  // Business edit state
  const [editBusiness, setEditBusiness] = useState({
    name: '',
    bio: '',
    avatar_url: ''
  });

  // New Item Form state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', price: '' });

  useEffect(() => {
    if (profile) {
      setEditBusiness({
        name: profile.business_name || profile.full_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || ''
      });
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const { data: mealsData } = await supabase
        .from('meals')
        .select('*')
        .eq('seller_id', profile.id)
        .order('created_at', { ascending: false });
      
      if (mealsData) setInventory(mealsData);

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });
      
      if (ordersData) setOrders(ordersData);
    } catch (error: any) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: editBusiness.name,
          bio: editBusiness.bio,
          avatar_url: editBusiness.avatar_url
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      toast.success('Business info updated');
      refreshProfile();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.price) {
      toast.error('Please enter both title and price');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('meals')
        .insert({
          title: newItem.title,
          price: parseInt(newItem.price) || 0,
          seller_id: profile?.id,
          is_available: true,
          category: 'Restaurant'
        })
        .select()
        .single();
      
      if (error) throw error;
      setInventory([data, ...inventory]);
      setNewItem({ title: '', price: '' });
      setIsAddingItem(false);
      toast.success('Item added to inventory');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (itemId: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('meals')
        .update({ is_available: !current })
        .eq('id', itemId);
      
      if (error) throw error;
      setInventory(inventory.map(i => i.id === itemId ? { ...i, is_available: !current } : i));
      toast.success('Inventory updated');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const totalSales = orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + (o.total_amount || 0), 0);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-sage border-2 border-ink px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 shadow-stk-sm text-white">
              <Store size={14} /> Restaurant Portal
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
              {activeTab === 'sales' ? 'Overview' : 
               activeTab === 'inventory' ? 'Inventory' : 
               activeTab === 'orders' ? 'Store Orders' : 'Business Profile'}
            </h1>
            <p className="text-ink/60 font-bold text-sm mt-2">
               {activeTab === 'sales' ? 'Your business performance at a glance.' : 
                activeTab === 'inventory' ? 'Manage your available menu items.' : 
                activeTab === 'orders' ? 'Track and fulfill customer orders.' : 'Manage your business identity.'}
            </p>
          </div>
        </header>

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-tomato border-[3px] border-ink rounded-[32px] p-8 shadow-stk text-white">
                <div className="flex justify-between items-start mb-6">
                  <TrendingUp size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-md">Realtime</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Revenue</p>
                <h3 className="text-5xl font-black tracking-tighter">₦{totalSales?.toLocaleString()}</h3>
              </div>
              <div className="bg-mustard border-[3px] border-ink rounded-[32px] p-8 shadow-stk">
                <div className="flex justify-between items-start mb-6">
                  <BarChart3 size={32} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-ink/40 mb-1">Active Orders</p>
                <h3 className="text-5xl font-black tracking-tighter">{orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length}</h3>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tighter uppercase ml-2">Recent Activity</h2>
              {orders.length === 0 ? (
                <div className="py-20 text-center bg-ink/5 border-2 border-dashed border-ink/20 rounded-[40px]">
                  <p className="text-ink/40 font-bold uppercase text-xs tracking-widest">No transactions yet</p>
                </div>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="bg-white border-[3px] border-ink rounded-2xl p-4 shadow-stk-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl border-2 border-ink flex items-center justify-center text-white",
                        order.status === 'delivered' ? 'bg-sage' : 'bg-mustard'
                      )}>
                        {order.status === 'delivered' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight">{order.profiles?.full_name}</p>
                        <p className="text-[10px] font-black text-ink/40 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-lg font-black tracking-tighter">₦{order.total_amount?.toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tighter uppercase">Menu Inventory</h2>
              <button 
                onClick={() => setIsAddingItem(!isAddingItem)}
                className="bg-ink text-white border-2 border-ink px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-stk-sm flex items-center gap-2"
              >
                {isAddingItem ? 'Cancel' : <><Plus size={14} /> Add Item</>}
              </button>
            </div>

            {isAddingItem && (
              <form onSubmit={handleAddInventory} className="bg-sage/10 border-[3px] border-ink rounded-[32px] p-6 shadow-stk space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Item Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Suya Platter"
                      value={newItem.title}
                      onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                      className="w-full bg-white border-2 border-ink rounded-xl px-4 py-2 font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Price (₦)</label>
                    <input 
                      type="number" 
                      placeholder="3500"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                      className="w-full bg-white border-2 border-ink rounded-xl px-4 py-2 font-bold outline-none"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-ink text-white border-2 border-ink py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-stk-sm"
                >
                  Add to Inventory
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {inventory.map((item) => (
                <div key={item.id} className={cn(
                  "bg-white border-[3px] border-ink rounded-2xl p-5 shadow-stk-sm flex items-center justify-between",
                  !item.is_available && "opacity-60 bg-ink/5 grayscale"
                )}>
                  <div className="flex items-center gap-4">
                    <div className="size-16 bg-cream border-2 border-ink rounded-xl flex items-center justify-center text-ink/20">
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 className="font-black tracking-tight">{item.title}</h3>
                      <p className="text-sm font-black text-tomato tracking-tighter">₦{item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleAvailability(item.id, item.is_available)}
                    className={cn(
                      "size-10 rounded-xl border-2 border-ink flex items-center justify-center shadow-stk-xs transition-all active:translate-y-0.5",
                      item.is_available ? "bg-sage text-white" : "bg-tomato text-white"
                    )}
                  >
                    {item.is_available ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
             <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black tracking-tighter uppercase">All Orders</h2>
                <div className="h-[2px] bg-ink/10 flex-1" />
             </div>
             <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="py-20 text-center bg-ink/5 border-2 border-dashed border-ink/20 rounded-[40px]">
                    <p className="text-ink/40 font-bold uppercase text-xs tracking-widest">No orders yet</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white border-[3px] border-ink rounded-[32px] p-6 shadow-stk space-y-4">
                       <div className="flex justify-between items-start">
                          <div>
                             <p className="text-[10px] font-black text-ink/40 uppercase tracking-widest mb-1">Order #{order.id.slice(0, 8)}</p>
                             <h3 className="text-xl font-black tracking-tight">{order.profiles?.full_name || 'Customer'}</h3>
                          </div>
                          <span className={cn(
                             "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-ink",
                             order.status === 'delivered' ? 'bg-sage text-white' : 'bg-mustard text-ink'
                          )}>
                             {order.status}
                          </span>
                       </div>
                       <div className="flex justify-between items-center pt-4 border-t border-dashed border-ink/10">
                          <p className="text-lg font-black tracking-tighter">₦{order.total_amount?.toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-ink/40 uppercase">{new Date(order.created_at).toLocaleString()}</p>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white border-[3px] border-ink rounded-[40px] p-8 shadow-stk space-y-8">
            <form onSubmit={handleUpdateBusiness} className="space-y-6">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="size-32 bg-cream border-4 border-ink rounded-[40px] overflow-hidden shadow-stk mx-auto flex items-center justify-center">
                    {editBusiness.avatar_url ? (
                      <img src={editBusiness.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <Store size={48} className="text-ink/10" />
                    )}
                  </div>
                  <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-tomato text-white border-2 border-ink rounded-full shadow-stk-sm hover:scale-110 transition-transform">
                    <Camera size={16} />
                  </button>
                </div>
                <h2 className="text-2xl font-black tracking-tighter uppercase">Business Profile</h2>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Business Name</label>
                <input 
                  type="text" 
                  value={editBusiness.name}
                  onChange={(e) => setEditBusiness({...editBusiness, name: e.target.value})}
                  className="w-full bg-cream border-2 border-ink rounded-2xl px-4 py-3 font-bold outline-none focus:bg-mustard/10 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">About the Business</label>
                <textarea 
                  value={editBusiness.bio}
                  onChange={(e) => setEditBusiness({...editBusiness, bio: e.target.value})}
                  rows={4}
                  className="w-full bg-cream border-2 border-ink rounded-2xl px-4 py-3 font-bold outline-none focus:bg-mustard/10 transition-colors resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-ink text-white border-[3px] border-ink rounded-2xl py-4 font-black uppercase text-sm shadow-stk flex items-center justify-center gap-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-stk-sm transition-all"
              >
                <Save size={18} /> Update Business Info
              </button>
            </form>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RestaurantDashboard;
