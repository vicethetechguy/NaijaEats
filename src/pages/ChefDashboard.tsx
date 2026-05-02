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
  const [newMeal, setNewMeal] = useState({ title: '', price: '', category: 'Main Dishes', image_url: '' });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categories = ['Main Dishes', 'Soups & Stews', 'Swallows', 'Grills & Sides', 'Drinks', 'Desserts'];

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
      const filePath = `meal-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('meals')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('meals')
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
      const { data, error } = await supabase
        .from('meals')
        .insert({
          title: newMeal.title,
          price: parseInt(newMeal.price) || 0,
          seller_id: profile?.id,
          is_available: true,
          category: newMeal.category,
          image_url: newMeal.image_url
        })
        .select()
        .single();
      
      if (error) throw error;
      setMeals([data, ...meals]);
      setNewMeal({ title: '', price: '', category: 'Main Dishes', image_url: '' });
      setImagePreview(null);
      setIsAddingMeal(false);
      toast.success('Dish added to catalog');
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
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-ink text-white border-2 border-ink py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-stk-sm disabled:opacity-50"
                >
                  {uploading ? 'Processing Image...' : 'Add to Catalog'}
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
                                <ChefHat size={32} />
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
