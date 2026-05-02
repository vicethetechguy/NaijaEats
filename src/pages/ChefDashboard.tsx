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
  ShieldCheck,
  CreditCard,
  History,
  ArrowLeft,
  Banknote,
  ShieldCheck as Shield,
  Lock,
  Bell,
  Power,
  Info,
  TrendingUp,
  Wallet,
  UtensilsCrossed as Utensils,
  Store
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ChefDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { profile, refreshProfile } = useUser();
  const [meals, setMeals] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const activeTab = 
    pathname.includes('/menu') ? 'menu' : 
    pathname.includes('/wallet/withdraw') ? 'wallet-withdraw' :
    pathname.includes('/wallet/history') ? 'wallet-history' :
    pathname.includes('/wallet') ? 'wallet' : 
    pathname.includes('/profile') ? 'profile' : 'orders';
  
  // Profile edit state
  const [editProfile, setEditProfile] = useState({
    name: '',
    bio: '',
    avatar_url: '',
    is_online: true,
    notifications: {
      orders: true,
      payouts: true
    },
    payment: {
      bank_name: '',
      account_number: '',
      account_name: ''
    }
  });

  // New Meal Form state
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const [newMeal, setNewMeal] = useState({ title: '', price: '', category: 'Main Dishes', image_url: '', description: '' });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Wallet state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const categories = ['Main Dishes', 'Soups & Stews', 'Swallows', 'Grills & Sides', 'Drinks', 'Desserts'];

  useEffect(() => {
    if (profile) {
      setEditProfile({
        name: profile.full_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        is_online: profile.is_online ?? true,
        notifications: profile.notifications || { orders: true, payouts: true },
        payment: profile.payment_details || { bank_name: '', account_number: '', account_name: '' }
      });
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const [mealsRes, ordersRes, payoutsRes] = await Promise.all([
        supabase
          .from('meals')
          .select('*')
          .eq('seller_id', profile.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('orders')
          .select('*')
          .or(`seller_id.eq.${profile.id},items->0->chef_id.eq.${profile.id}`)
          .order('created_at', { ascending: false }),
        supabase
          .from('payouts')
          .select('*')
          .eq('chef_id', profile.id)
          .order('created_at', { ascending: false })
      ]);

      if (mealsRes.data) setMeals(mealsRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (payoutsRes.data) setPayouts(payoutsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
          avatar_url: editProfile.avatar_url,
          is_online: editProfile.is_online,
          notifications: editProfile.notifications,
          payment_details: editProfile.payment
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      toast.success('Settings updated successfully');
      refreshProfile();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('meal-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('meal-images')
        .getPublicUrl(filePath);

      setEditProfile({ ...editProfile, avatar_url: publicUrl });
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;
      
      toast.success('Profile image updated!');
      refreshProfile();
    } catch (error: any) {
      toast.error('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `meals/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('meal-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('meal-images')
        .getPublicUrl(filePath);

      setNewMeal({ ...newMeal, image_url: publicUrl });
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeal.title || !newMeal.price) {
      toast.error('Please enter both title and price');
      return;
    }

    try {
      if (editingMeal) {
        const { data, error } = await supabase
          .from('meals')
          .update({
            title: newMeal.title,
            price: parseInt(newMeal.price) || 0,
            category: newMeal.category,
            image_url: newMeal.image_url,
            description: newMeal.description
          })
          .eq('id', editingMeal.id)
          .select()
          .single();
        
        if (error) throw error;
        setMeals(meals.map(m => m.id === editingMeal.id ? data : m));
        toast.success('Dish updated successfully');
        setEditingMeal(null);
      } else {
        const { data, error } = await supabase
          .from('meals')
          .insert({
            title: newMeal.title,
            price: parseInt(newMeal.price) || 0,
            seller_id: profile?.id,
            is_available: true,
            category: newMeal.category,
            image_url: newMeal.image_url,
            description: newMeal.description
          })
          .select()
          .single();
        
        if (error) throw error;
        setMeals([data, ...meals]);
        toast.success('Dish added to catalog');
      }
      setNewMeal({ title: '', price: '', category: 'Main Dishes', image_url: '', description: '' });
      setImagePreview(null);
      setIsAddingMeal(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const startEditing = (meal: any) => {
    setEditingMeal(meal);
    setNewMeal({
      title: meal.title,
      price: String(meal.price),
      category: meal.category || 'Main Dishes',
      image_url: meal.image_url || '',
      description: meal.description || ''
    });
    setImagePreview(meal.image_url || null);
    setIsAddingMeal(true);
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
      
      const statusMap: Record<string, string> = {
        preparing: 'Order Accepted',
        ready: 'Order Prepared',
        out_for_delivery: 'Rider Dispatched'
      };
      
      toast.success(statusMap[status] || `Order marked as ${status}`);
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
              <Store size={14} /> Chef Portal
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
              {activeTab === 'orders' ? 'Kitchen Orders' : 
               activeTab === 'menu' ? 'My Menu' : 
               activeTab === 'wallet' ? 'Earnings' : 
               activeTab === 'wallet-withdraw' ? 'Withdraw Cash' :
               activeTab === 'wallet-history' ? 'Payout History' : 'Your Profile'}
            </h1>
            <p className="text-ink/60 font-bold text-sm mt-2">
              {activeTab === 'orders' ? 'Manage your active and pending orders.' : 
               activeTab === 'menu' ? 'Update your dishes and pricing.' : 
               activeTab === 'wallet' ? 'Track your income and withdrawals.' : 
               activeTab === 'wallet-withdraw' ? 'Enter amount to transfer to your bank.' :
               activeTab === 'wallet-history' ? 'Review your previous earnings transfers.' : 'Personalize your chef identity.'}
            </p>
          </div>
          {(activeTab === 'wallet-withdraw' || activeTab === 'wallet-history') && (
            <button 
              onClick={() => navigate('/chef/wallet')}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
            >
              <ArrowLeft size={16} /> Back to Wallet
            </button>
          )}
        </header>

        {activeTab === 'orders' && (
          <div className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
            {/* 3 Sections: Pending, Preparing, Ready */}
            {(['pending', 'preparing', 'ready'] as const).map((status) => (
              <section key={status} className="flex-none w-[85vw] sm:w-[350px] space-y-6 snap-start">
                <div className="flex items-center justify-between bg-white border-[3px] border-ink rounded-2xl px-5 py-3 shadow-stk-sm">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full animate-pulse",
                      status === 'pending' ? 'bg-tomato' : status === 'preparing' ? 'bg-mustard' : 'bg-sage'
                    )} />
                    <h2 className="text-sm font-black tracking-widest uppercase">
                      {status}
                    </h2>
                  </div>
                  <span className="bg-ink text-white px-2 py-0.5 rounded-lg text-[10px] font-black">
                    {orders.filter(o => o.status === status).length}
                  </span>
                </div>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {orders.filter(o => o.status === status).length === 0 ? (
                    <div className="py-20 bg-ink/5 border-2 border-dashed border-ink/20 rounded-[32px] text-center">
                      <Package size={32} className="mx-auto text-ink/10 mb-3" />
                      <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest px-4">No {status} tickets</p>
                    </div>
                  ) : (
                    orders.filter(o => o.status === status).map((order) => (
                      <div key={order.id} className="bg-white border-[3px] border-ink rounded-[32px] p-5 shadow-stk space-y-4 hover:translate-y-[-2px] transition-transform">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black text-ink/40 uppercase tracking-widest mb-1">#{order.id.slice(0, 5)}</p>
                            <h3 className="text-lg font-black tracking-tight leading-none">{order.profiles?.full_name || 'Customer'}</h3>
                          </div>
                          <span className="text-[9px] font-black text-ink/40 bg-cream px-2 py-1 rounded-md border border-ink/5">
                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                           <div className="flex justify-between text-sm font-bold">
                              <span className="text-ink/60">Total</span>
                              <span>₦{order.total_amount?.toLocaleString()}</span>
                           </div>
                        </div>

                        <div className="pt-4 border-t border-dashed border-ink/10">
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="w-full bg-tomato text-white border-2 border-ink py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-stk-sm hover:bg-tomato/90"
                            >
                              Accept Order
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              className="w-full bg-mustard text-ink border-2 border-ink py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-stk-sm hover:bg-mustard/90"
                            >
                              Prepared
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                              className="w-full bg-sage text-white border-2 border-ink py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-stk-sm hover:bg-sage/90"
                            >
                              Go
                            </button>
                          )}
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
                  <button onClick={() => navigate('/chef/wallet/withdraw')} className="bg-mustard text-ink border-2 border-ink px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-stk-sm">Withdraw Cash</button>
                  <button onClick={() => navigate('/chef/wallet/history')} className="bg-white/10 hover:bg-white/20 border-2 border-white/20 px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-colors">Payout History</button>
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

        {activeTab === 'wallet-withdraw' && (
          <div className="max-w-2xl mx-auto space-y-8">
             <div className="bg-white border-[3px] border-ink rounded-[40px] p-8 shadow-stk space-y-8">
                <div className="text-center space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-ink/40">Available for Withdrawal</p>
                   <h2 className="text-5xl font-black tracking-tighter">₦{(orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + (o.total_amount || 0), 0) * 0.85).toLocaleString()}</h2>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!withdrawAmount || !profile) return;
                  
                  setIsWithdrawing(true);
                  try {
                    const { data, error } = await supabase
                      .from('payouts')
                      .insert({
                        user_id: profile.id,
                        amount: parseFloat(withdrawAmount),
                        status: 'pending',
                        bank_details: editProfile.payment
                      })
                      .select()
                      .single();

                    if (error) throw error;
                    
                    setPayouts([data, ...payouts]);
                    toast.success('Withdrawal request submitted! Funds will arrive in 24 hours.');
                    navigate('/chef/wallet');
                  } catch (error: any) {
                    toast.error(error.message);
                  } finally {
                    setIsWithdrawing(false);
                  }
                }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Amount to Withdraw (₦)</label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl">₦</span>
                       <input 
                        type="number" 
                        required
                        placeholder="0"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        max={orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + (o.total_amount || 0), 0) * 0.85}
                        className="w-full bg-cream border-2 border-ink rounded-2xl pl-10 pr-4 py-4 font-black text-xl outline-none focus:bg-mustard/10 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="bg-sage/10 border-2 border-sage/20 rounded-2xl p-4 flex gap-4">
                     <ShieldCheck className="text-sage shrink-0" size={24} />
                     <div>
                        <p className="text-xs font-black uppercase tracking-widest text-sage">Secure Transfer</p>
                        <p className="text-[10px] font-bold text-ink/60">Funds will be sent to your registered bank account: **** 5678 (Kuda Bank)</p>
                     </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isWithdrawing || !withdrawAmount}
                    className="w-full bg-ink text-white border-[3px] border-ink rounded-2xl py-5 font-black uppercase text-sm shadow-stk flex items-center justify-center gap-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-stk-sm transition-all disabled:opacity-50"
                  >
                    {isWithdrawing ? <><div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : <><Banknote size={20} /> Confirm Withdrawal</>}
                  </button>
                </form>
             </div>
          </div>
        )}

        {activeTab === 'wallet-history' && (
          <div className="max-w-3xl mx-auto space-y-6">
             <div className="bg-white border-[3px] border-ink rounded-[32px] overflow-hidden shadow-stk">
                <div className="p-6 border-b-2 border-ink bg-cream">
                   <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2"><History size={18} /> Past Withdrawals</h3>
                </div>
                <div className="divide-y-2 divide-ink/10">
                   {payouts.length === 0 ? (
                     <div className="p-12 text-center text-ink/20 font-black uppercase tracking-widest text-xs">
                        No payout history found
                     </div>
                   ) : (
                     payouts.map((tx, i) => (
                       <div key={tx.id || i} className="p-6 flex items-center justify-between hover:bg-cream/50 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className={cn(
                               "size-12 border-2 border-ink rounded-xl flex items-center justify-center",
                               tx.status === 'completed' ? "bg-sage/20 text-sage" : "bg-mustard/20 text-mustard"
                             )}>
                                <History size={20} />
                             </div>
                             <div>
                                <p className="font-black tracking-tight">₦{tx.amount?.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">
                                  {new Date(tx.created_at).toLocaleDateString()} • {tx.id?.slice(0, 8)}
                                </p>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className={cn(
                               "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-2 border-ink shadow-stk-xs",
                               tx.status === 'completed' ? "bg-sage text-white" : "bg-mustard text-ink"
                             )}>
                                {tx.status}
                             </span>
                          </div>
                       </div>
                     ))
                   )}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tighter uppercase">Your Menu</h2>
              <button 
                onClick={() => {
                  setIsAddingMeal(!isAddingMeal);
                  if (editingMeal) {
                    setEditingMeal(null);
                    setNewMeal({ title: '', price: '', category: 'Main Dishes', image_url: '', description: '' });
                    setImagePreview(null);
                  }
                }}
                className="bg-ink text-white border-2 border-ink px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-stk-sm flex items-center gap-2"
              >
                {isAddingMeal ? 'Cancel' : <><Plus size={14} /> Add Item</>}
              </button>
            </div>

            {isAddingMeal && (
              <form onSubmit={handleAddMeal} className="bg-mustard/10 border-[3px] border-ink rounded-[32px] p-6 shadow-stk space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Image Upload Area */}
                  <div className="w-full sm:w-40">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1 block mb-2">Food Image</label>
                    <div className="relative aspect-square bg-white border-2 border-dashed border-ink/20 rounded-2xl flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:border-tomato/40 transition-colors">
                      {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <Camera size={24} className="mx-auto text-ink/20 mb-2" />
                          <p className="text-[8px] font-bold text-ink/40">Upload Photo</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {uploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <div className="size-5 border-2 border-tomato border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
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

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Catalog Category</label>
                      <select 
                        value={newMeal.category}
                        onChange={(e) => setNewMeal({...newMeal, category: e.target.value})}
                        className="w-full bg-white border-2 border-ink rounded-xl px-4 py-2 font-bold outline-none appearance-none"
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Description</label>
                      <textarea 
                        placeholder="Describe your dish (ingredients, spice level, etc.)"
                        value={newMeal.description}
                        onChange={(e) => setNewMeal({...newMeal, description: e.target.value})}
                        className="w-full bg-white border-2 border-ink rounded-xl px-4 py-2 font-bold outline-none resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-ink text-white border-2 border-ink py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-stk-sm disabled:opacity-50"
                >
                  {uploading ? 'Processing Image...' : editingMeal ? 'Update Item' : 'Add to Catalog'}
                </button>
              </form>
            )}

            <div className="space-y-12">
              {categories.map((cat) => {
                const catMeals = meals.filter(m => m.category === cat);
                if (catMeals.length === 0) return null;

                return (
                  <section key={cat} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-black tracking-tight uppercase whitespace-nowrap">{cat}</h3>
                      <div className="h-[2px] bg-ink/10 w-full" />
                      <span className="text-[10px] font-black text-ink/40">{catMeals.length}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {catMeals.map((meal) => (
                        <div key={meal.id} className={cn(
                          "bg-white border-[3px] border-ink rounded-[32px] p-6 shadow-stk space-y-4 transition-all",
                          !meal.is_available && "opacity-60 grayscale-[0.5]"
                        )}>
                          <div className="flex gap-4">
                            <div className="w-24 h-24 bg-cream border-2 border-ink rounded-2xl flex items-center justify-center text-ink/20 overflow-hidden shrink-0 shadow-stk-sm">
                              {meal.image_url ? (
                                <img src={meal.image_url} className="w-full h-full object-cover" />
                              ) : (
                                <Utensils size={32} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-black tracking-tight truncate">{meal.title}</h3>
                              <p className="text-xl font-black text-tomato tracking-tighter">₦{meal.price?.toLocaleString()}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="bg-ink/5 text-ink/40 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest">
                                  {meal.category}
                                </span>
                              </div>
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
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => startEditing(meal)}
                                className="border-2 border-ink px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-stk-sm bg-mustard/10 text-ink hover:bg-mustard transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => toggleAvailability(meal.id, meal.is_available)}
                                className={cn(
                                  "border-2 border-ink px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-stk-sm transition-all active:scale-95",
                                  meal.is_available ? "bg-tomato/10 text-tomato" : "bg-sage/10 text-sage"
                                )}
                              >
                                {meal.is_available ? 'Set Out of Stock' : 'Set Available'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}

              {meals.filter(m => !categories.includes(m.category)).length > 0 && (
                 <section className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-black tracking-tight uppercase whitespace-nowrap">Others</h3>
                      <div className="h-[2px] bg-ink/10 w-full" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {meals.filter(m => !categories.includes(m.category)).map((meal) => (
                        <div key={meal.id} className="bg-white border-[3px] border-ink rounded-[32px] p-6 shadow-stk space-y-4">
                           {/* Simple card for legacy items */}
                           <div className="flex gap-4">
                            <div className="w-16 h-16 bg-cream border-2 border-ink rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                              {meal.image_url ? <img src={meal.image_url} className="w-full h-full object-cover" /> : <ChefHat size={24} />}
                            </div>
                            <div>
                              <h3 className="font-black tracking-tight">{meal.title}</h3>
                              <p className="font-black text-tomato">₦{meal.price?.toLocaleString()}</p>
                            </div>
                           </div>
                        </div>
                      ))}
                    </div>
                 </section>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-8 pb-20">
            {/* Identity & Status */}
            <div className="bg-white border-[3px] border-ink rounded-[40px] p-8 shadow-stk space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative">
                  <div className="size-32 bg-cream border-4 border-ink rounded-[40px] overflow-hidden shadow-stk flex items-center justify-center">
                    {uploading ? (
                      <div className="animate-spin size-8 border-4 border-tomato border-t-transparent rounded-full" />
                    ) : editProfile.avatar_url ? (
                      <img src={editProfile.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <ChefHat size={48} className="text-ink/10" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-2 bg-tomato text-white border-2 border-ink rounded-full shadow-stk-sm hover:scale-110 transition-transform cursor-pointer">
                    <Camera size={16} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                
                <div className="flex-1 text-center sm:text-left space-y-4">
                   <div className="space-y-1">
                      <h2 className="text-3xl font-black tracking-tighter uppercase">{editProfile.name || 'Set Chef Name'}</h2>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                         <span className="flex items-center gap-1 bg-sage/10 text-sage px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-sage/20">
                            <Shield size={10} /> Verified Chef
                         </span>
                         <span className="text-[9px] font-black text-ink/40 uppercase tracking-widest">UID: {profile?.id.slice(0, 8)}</span>
                      </div>
                   </div>

                   <div className="flex items-center justify-center sm:justify-start gap-3">
                      <button 
                        onClick={() => setEditProfile({...editProfile, is_online: !editProfile.is_online})}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-ink shadow-stk-sm transition-all",
                          editProfile.is_online ? "bg-sage text-white" : "bg-ink/5 text-ink/40"
                        )}
                      >
                        {editProfile.is_online ? '● Kitchen Open' : '○ Kitchen Closed'}
                      </button>
                   </div>
                </div>
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
                    rows={3}
                    className="w-full bg-cream border-2 border-ink rounded-2xl px-4 py-3 font-bold outline-none focus:bg-mustard/10 transition-colors resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Payment Settings */}
            <div className="bg-white border-[3px] border-ink rounded-[40px] p-8 shadow-stk space-y-6">
               <div className="flex items-center gap-3 border-b-2 border-ink/5 pb-4">
                  <div className="p-2 bg-mustard/20 rounded-lg text-mustard">
                     <CreditCard size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-sm">Payout Settings</h3>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Bank Name</label>
                    <select 
                      value={editProfile.payment.bank_name}
                      onChange={(e) => setEditProfile({...editProfile, payment: {...editProfile.payment, bank_name: e.target.value}})}
                      className="w-full bg-cream border-2 border-ink rounded-2xl px-4 py-3 font-bold outline-none appearance-none"
                    >
                      <option value="">Select Bank</option>
                      <option value="Kuda Bank">Kuda Bank</option>
                      <option value="GTBank">GTBank</option>
                      <option value="Access Bank">Access Bank</option>
                      <option value="Zenith Bank">Zenith Bank</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Account Number</label>
                    <input 
                      type="text" 
                      placeholder="0000000000"
                      value={editProfile.payment.account_number}
                      onChange={(e) => setEditProfile({...editProfile, payment: {...editProfile.payment, account_number: e.target.value}})}
                      className="w-full bg-cream border-2 border-ink rounded-2xl px-4 py-3 font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Account Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter Full Name"
                      value={editProfile.payment.account_name}
                      onChange={(e) => setEditProfile({...editProfile, payment: {...editProfile.payment, account_name: e.target.value}})}
                      className="w-full bg-cream border-2 border-ink rounded-2xl px-4 py-3 font-bold outline-none"
                    />
                  </div>
               </div>
            </div>

            {/* Verification & Legal */}
            <div className="bg-white border-[3px] border-ink rounded-[40px] p-8 shadow-stk space-y-6">
               <div className="flex items-center gap-3 border-b-2 border-ink/5 pb-4">
                  <div className="p-2 bg-sage/20 rounded-lg text-sage">
                     <Shield size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-sm">Verification Status</h3>
               </div>
               
               <div className="flex items-center justify-between p-4 bg-sage/5 border-2 border-dashed border-sage/20 rounded-2xl">
                  <div className="flex gap-4 items-center">
                     <div className="size-10 bg-sage text-white rounded-full flex items-center justify-center">
                        <Check size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-black uppercase tracking-widest text-sage">Identity Verified</p>
                        <p className="text-[10px] font-bold text-ink/40">Verified on {new Date().toLocaleDateString()}</p>
                     </div>
                  </div>
                  <button className="text-[10px] font-black uppercase text-ink/40 underline">View Docs</button>
               </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white border-[3px] border-ink rounded-[40px] p-8 shadow-stk space-y-6">
               <div className="flex items-center gap-3 border-b-2 border-ink/5 pb-4">
                  <div className="p-2 bg-tomato/20 rounded-lg text-tomato">
                     <Bell size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-sm">Notifications</h3>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs font-black uppercase tracking-widest">New Order Alerts</p>
                        <p className="text-[10px] font-bold text-ink/40">Get notified when a customer places an order</p>
                     </div>
                     <button 
                       onClick={() => setEditProfile({...editProfile, notifications: {...editProfile.notifications, orders: !editProfile.notifications.orders}})}
                       className={cn("size-6 rounded-md border-2 border-ink transition-colors", editProfile.notifications.orders ? "bg-sage" : "bg-white")}
                     />
                  </div>
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs font-black uppercase tracking-widest">Payout Confirmations</p>
                        <p className="text-[10px] font-bold text-ink/40">Get notified when your funds are sent</p>
                     </div>
                     <button 
                       onClick={() => setEditProfile({...editProfile, notifications: {...editProfile.notifications, payouts: !editProfile.notifications.payouts}})}
                       className={cn("size-6 rounded-md border-2 border-ink transition-colors", editProfile.notifications.payouts ? "bg-sage" : "bg-white")}
                     />
                  </div>
               </div>
            </div>

            <div className="flex gap-4">
               <button 
                  onClick={handleUpdateProfile}
                  className="flex-1 bg-ink text-white border-[3px] border-ink rounded-2xl py-5 font-black uppercase text-sm shadow-stk flex items-center justify-center gap-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-stk-sm transition-all"
                >
                  <Save size={18} /> Save All Changes
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('platera_user');
                    navigate('/auth');
                    toast.success('Signed out successfully');
                  }}
                  className="px-6 bg-white text-tomato border-[3px] border-ink rounded-2xl py-5 font-black uppercase text-sm shadow-stk flex items-center justify-center hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-stk-sm transition-all"
                >
                  <Power size={18} />
                </button>
            </div>
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
