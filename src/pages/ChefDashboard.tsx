import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { 
  ChefHat, 
  Package, 
  Users, 
  Settings, 
  Plus, 
  Check, 
  Clock, 
  Camera, 
  Save,
  Trash2,
  DollarSign,
  Wallet,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ChefDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { profile, refreshProfile } = useUser();
  const [meals, setMeals] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const activeTab = 
    pathname.includes('/menu') ? 'menu' : 
    pathname.includes('/wallet') ? 'wallet' : 
    pathname.includes('/profile') ? 'profile' : 'orders';
  
  // Profile edit state
  const [editProfile, setEditProfile] = useState({
    name: '',
    bio: '',
    avatar_url: ''
  });

  // New Meal Form state
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({ title: '', price: '' });

  useEffect(() => {
    if (profile) {
      setEditProfile({
        name: profile.full_name || '',
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
      
      if (mealsData) setMeals(mealsData);

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editProfile.name,
          bio: editProfile.bio,
          avatar_url: editProfile.avatar_url
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      toast.success('Profile updated successfully');
      refreshProfile();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeal.title || !newMeal.price) {
      toast.error('Please enter both title and price');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('meals')
        .insert({
          title: newMeal.title,
          price: parseInt(newMeal.price) || 0,
          seller_id: profile?.id,
          is_available: true,
          category: 'Chef Special'
        })
        .select()
        .single();
      
      if (error) throw error;
      setMeals([data, ...meals]);
      setNewMeal({ title: '', price: '' });
      setIsAddingMeal(false);
      toast.success('Dish added to menu');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (mealId: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('meals')
        .update({ is_available: !current })
        .eq('id', mealId);
      
      if (error) throw error;
      setMeals(meals.map(m => m.id === mealId ? { ...m, is_available: !current } : m));
      toast.success('Availability updated');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success(`Order marked as ${status}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-mustard border-2 border-ink px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 shadow-stk-sm">
              <ChefHat size={14} /> Chef Portal
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
              {activeTab === 'orders' ? 'Kitchen Orders' : 
               activeTab === 'menu' ? 'My Menu' : 
               activeTab === 'wallet' ? 'Earnings' : 'Your Profile'}
            </h1>
            <p className="text-ink/60 font-bold text-sm mt-2">
              {activeTab === 'orders' ? 'Manage your active and pending orders.' : 
               activeTab === 'menu' ? 'Update your dishes and pricing.' : 
               activeTab === 'wallet' ? 'Track your income and withdrawals.' : 'Personalize your chef identity.'}
            </p>
          </div>
        </header>

        {activeTab === 'orders' && (
          <div className="space-y-10">
            {/* 3 Sections: Pending, Preparing, Ready */}
            {(['pending', 'preparing', 'ready'] as const).map((status) => (
              <section key={status} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    status === 'pending' ? 'bg-tomato' : status === 'preparing' ? 'bg-mustard' : 'bg-sage'
                  )} />
                  <h2 className="text-xl font-black tracking-tight uppercase">
                    {status} ({orders.filter(o => o.status === status).length})
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.filter(o => o.status === status).length === 0 ? (
                    <div className="col-span-full py-10 bg-ink/5 border-2 border-dashed border-ink/20 rounded-[32px] text-center">
                      <p className="text-xs font-bold text-ink/40 uppercase tracking-widest">No {status} orders</p>
                    </div>
                  ) : (
                    orders.filter(o => o.status === status).map((order) => (
                      <div key={order.id} className="bg-white border-[3px] border-ink rounded-[32px] p-6 shadow-stk space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black text-ink/40 uppercase tracking-widest mb-1">Order #{order.id.slice(0, 8)}</p>
                            <h3 className="text-xl font-black tracking-tight">{order.profiles?.full_name || 'Customer'}</h3>
                          </div>
                          <span className="text-[10px] font-black text-ink/40">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-dashed border-ink/10">
                          <p className="text-lg font-black tracking-tighter">₦{order.total_amount?.toLocaleString()}</p>
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                className="bg-mustard border-2 border-ink px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-stk-sm"
                              >
                                Start Cooking
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                className="bg-sage border-2 border-ink px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-stk-sm text-white"
                              >
                                Mark Ready
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            ))}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-8">
            <div className="bg-ink text-white border-[3px] border-ink rounded-[48px] p-10 shadow-stk relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Wallet size={120} />
              </div>
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Total Earnings</p>
                <h2 className="text-6xl font-black tracking-tighter mb-8">₦{(orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + (o.total_amount || 0), 0) * 0.85).toLocaleString()}</h2>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => toast.success('Withdrawal requested!')} className="bg-mustard text-ink border-2 border-ink px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-stk-sm">Withdraw Cash</button>
                  <button className="bg-white/10 hover:bg-white/20 border-2 border-white/20 px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-colors">Payout History</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border-[3px] border-ink rounded-[32px] p-6 shadow-stk-sm">
                <div className="p-3 bg-sage/10 rounded-xl w-fit mb-4">
                  <TrendingUp size={24} className="text-sage" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-ink/40">Gross Sales</p>
                <h3 className="text-3xl font-black tracking-tighter">₦{orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + (o.total_amount || 0), 0).toLocaleString()}</h3>
              </div>
              <div className="bg-white border-[3px] border-ink rounded-[32px] p-6 shadow-stk-sm">
                <div className="p-3 bg-tomato/10 rounded-xl w-fit mb-4">
                  <CreditCard size={24} className="text-tomato" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-ink/40">Pending Payout</p>
                <h3 className="text-3xl font-black tracking-tighter">₦{(orders.filter(o => ['preparing', 'ready', 'out_for_delivery'].includes(o.status)).reduce((acc, o) => acc + (o.total_amount || 0), 0) * 0.85).toLocaleString()}</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tighter uppercase">Your Menu</h2>
              <button 
                onClick={() => setIsAddingMeal(!isAddingMeal)}
                className="bg-ink text-white border-2 border-ink px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-stk-sm flex items-center gap-2"
              >
                {isAddingMeal ? 'Cancel' : <><Plus size={14} /> Add Item</>}
              </button>
            </div>

            {isAddingMeal && (
              <form onSubmit={handleAddMeal} className="bg-mustard/10 border-[3px] border-ink rounded-[32px] p-6 shadow-stk space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Dish Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Smoky Jollof Rice"
                      value={newMeal.title}
                      onChange={(e) => setNewMeal({...newMeal, title: e.target.value})}
                      className="w-full bg-white border-2 border-ink rounded-xl px-4 py-2 font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Price (₦)</label>
                    <input 
                      type="number" 
                      placeholder="2500"
                      value={newMeal.price}
                      onChange={(e) => setNewMeal({...newMeal, price: e.target.value})}
                      className="w-full bg-white border-2 border-ink rounded-xl px-4 py-2 font-bold outline-none"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-ink text-white border-2 border-ink py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-stk-sm"
                >
                  Confirm Add Dish
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {meals.map((meal) => (
                <div key={meal.id} className={cn(
                  "bg-white border-[3px] border-ink rounded-[32px] p-6 shadow-stk space-y-4",
                  !meal.is_available && "opacity-60"
                )}>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-cream border-2 border-ink rounded-2xl flex items-center justify-center text-ink/20 overflow-hidden shrink-0">
                      {meal.image_url ? (
                        <img src={meal.image_url} className="w-full h-full object-cover" />
                      ) : (
                        <ChefHat size={32} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black tracking-tight truncate">{meal.title}</h3>
                      <p className="text-xl font-black text-tomato tracking-tighter">₦{meal.price?.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-dashed border-ink/10">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        meal.is_available ? "bg-sage" : "bg-tomato"
                      )} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-ink/40">
                        {meal.is_available ? 'Available' : 'Sold Out'}
                      </span>
                    </div>
                    <button 
                      onClick={() => toggleAvailability(meal.id, meal.is_available)}
                      className={cn(
                        "border-2 border-ink px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-stk-sm transition-all",
                        meal.is_available ? "bg-tomato/10 text-tomato" : "bg-sage/10 text-sage"
                      )}
                    >
                      {meal.is_available ? 'Set Out of Stock' : 'Set Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white border-[3px] border-ink rounded-[40px] p-8 shadow-stk space-y-8">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="size-32 bg-cream border-4 border-ink rounded-[40px] overflow-hidden shadow-stk mx-auto flex items-center justify-center">
                  {editProfile.avatar_url ? (
                    <img src={editProfile.avatar_url} className="w-full h-full object-cover" />
                  ) : (
                    <ChefHat size={48} className="text-ink/10" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-tomato text-white border-2 border-ink rounded-full shadow-stk-sm hover:scale-110 transition-transform">
                  <Camera size={16} />
                </button>
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase">Edit Profile</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Chef Name</label>
                <input 
                  type="text" 
                  value={editProfile.name}
                  onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                  className="w-full bg-cream border-2 border-ink rounded-2xl px-4 py-3 font-bold outline-none focus:bg-mustard/10 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Kitchen Bio</label>
                <textarea 
                  value={editProfile.bio}
                  onChange={(e) => setEditProfile({...editProfile, bio: e.target.value})}
                  rows={4}
                  className="w-full bg-cream border-2 border-ink rounded-2xl px-4 py-3 font-bold outline-none focus:bg-mustard/10 transition-colors resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-ink text-white border-[3px] border-ink rounded-2xl py-4 font-black uppercase text-sm shadow-stk flex items-center justify-center gap-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-stk-sm transition-all"
              >
                <Save size={18} /> Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

const StatCard: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className={cn("bg-white border-[3px] border-ink rounded-2xl p-4 shadow-stk-sm flex items-center justify-between", color)}>
    <span className="text-[10px] font-black uppercase tracking-widest text-ink/60">{label}</span>
    <span className="text-2xl font-black tracking-tighter">{value}</span>
  </div>
);

const EmptyState: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="py-20 text-center space-y-4 bg-ink/5 border-2 border-dashed border-ink/20 rounded-[40px]">
    <div className="text-ink/20 flex justify-center">{icon}</div>
    <div className="space-y-1">
      <h3 className="text-xl font-black tracking-tight">{title}</h3>
      <p className="text-ink/60 font-medium text-sm">{description}</p>
    </div>
  </div>
);

export default ChefDashboard;
