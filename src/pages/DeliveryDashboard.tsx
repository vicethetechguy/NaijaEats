import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { 
  Bike, 
  Map as MapIcon, 
  History, 
  Wallet, 
  Navigation, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const DeliveryDashboard: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { profile, refreshProfile } = useUser();
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const activeTab = 
    pathname.includes('/history') ? 'history' : 
    pathname.includes('/earnings') ? 'earnings' : 
    pathname.includes('/profile') ? 'profile' : 'active';

  useEffect(() => {
    if (profile) {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch "Ready" orders for the active map (potential offers)
      const { data: readyOrders } = await supabase
        .from('orders')
        .select('*, profiles(full_name, address)')
        .in('status', ['ready', 'out_for_delivery']);
      
      if (readyOrders) setActiveDeliveries(readyOrders);

      // Fetch delivery history
      const { data: historyData } = await supabase
        .from('orders')
        .select('*, profiles(full_name)')
        .eq('status', 'delivered')
        .order('updated_at', { ascending: false });
      
      if (historyData) setHistory(historyData);
    } catch (error: any) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'out_for_delivery' })
        .eq('id', orderId);
      
      if (error) throw error;
      setActiveDeliveries(activeDeliveries.filter(o => o.id !== orderId));
      toast.success('Order accepted! Head to the pickup location.');
      fetchData(); // Refresh history/earnings
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const completeOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', orderId);
      
      if (error) throw error;
      toast.success('Delivery completed! Earnings added.');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const totalEarnings = history.length * 1500; // Mock ₦1,500 per delivery

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-ink border-2 border-ink px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 shadow-stk-sm text-white">
              <Bike size={14} /> Rider Portal
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
              {activeTab === 'active' ? 'Active Jobs' : 
               activeTab === 'history' ? 'Delivery History' : 
               activeTab === 'earnings' ? 'My Earnings' : 'Rider Profile'}
            </h1>
            <p className="text-ink/60 font-bold text-sm mt-2">
               {activeTab === 'active' ? 'Find and manage your current deliveries.' : 
                activeTab === 'history' ? 'Review your completed trips.' : 
                activeTab === 'earnings' ? 'Track your income and payouts.' : 'Manage your rider identity.'}
            </p>
          </div>
        </header>

        {activeTab === 'active' && (
          <div className="space-y-6">
            <div className="relative h-[400px] bg-cream border-[3px] border-ink rounded-[48px] overflow-hidden shadow-stk">
               {/* Map Mockup with Dots */}
               <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] bg-[size:32px_32px] opacity-10" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -top-12 -left-20 bg-tomato text-white border-2 border-ink p-2 rounded-xl shadow-stk-sm animate-bounce">
                      <Clock size={16} />
                    </div>
                    <div className="size-8 bg-ink border-4 border-white rounded-full shadow-xl" />
                  </div>
               </div>
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white border-[3px] border-ink rounded-2xl p-4 shadow-stk-sm flex items-center gap-4">
                  <Navigation size={24} className="text-tomato" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-ink/40">Current Location</p>
                    <p className="font-bold text-sm truncate">Lekki Phase 1, Lagos</p>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tighter uppercase ml-2">Active Tasks</h2>
              {activeDeliveries.filter(o => o.status === 'out_for_delivery').length > 0 ? (
                activeDeliveries.filter(o => o.status === 'out_for_delivery').map((order) => (
                  <div key={order.id} className="bg-white border-[3px] border-ink rounded-[32px] p-6 shadow-stk space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-ink/40 mb-1">In Progress</p>
                        <h3 className="text-2xl font-black tracking-tight leading-none">Deliver to {order.profiles?.full_name}</h3>
                      </div>
                      <div className="bg-sage text-white px-4 py-2 rounded-2xl font-black text-xl tracking-tighter shadow-stk-sm">
                        ₦1,500
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-ink/60">
                      <MapIcon size={16} />
                      <p className="text-sm font-bold truncate">{order.profiles?.address || 'Customer Location'}</p>
                    </div>
                    <button 
                      onClick={() => completeOrder(order.id)}
                      className="w-full bg-sage text-white border-2 border-ink py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-stk-sm hover:translate-y-0.5 transition-all"
                    >
                      Mark as Delivered
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-ink/5 border-2 border-dashed border-ink/20 rounded-[40px]">
                  <p className="text-ink/40 font-bold uppercase text-xs tracking-widest">No active tasks</p>
                </div>
              )}

              <h2 className="text-xl font-black tracking-tighter uppercase ml-2 mt-8">Available Offers</h2>
              {activeDeliveries.filter(o => o.status === 'ready').length === 0 ? (
                <div className="py-12 text-center bg-ink/5 border-2 border-dashed border-ink/20 rounded-[40px]">
                  <p className="text-ink/40 font-bold uppercase text-xs tracking-widest">Searching for nearby orders...</p>
                </div>
              ) : (
                activeDeliveries.filter(o => o.status === 'ready').map((order) => (
                  <div key={order.id} className="bg-mustard border-[3px] border-ink rounded-[32px] p-6 shadow-stk relative overflow-hidden group">
                    <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-ink/60 mb-1">Pick up from</p>
                          <h3 className="text-2xl font-black tracking-tight leading-none">Local Kitchen</h3>
                        </div>
                        <div className="bg-ink text-white px-4 py-2 rounded-2xl font-black text-xl tracking-tighter shadow-stk-sm">
                          +₦1,500
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight size={16} />
                        <p className="text-sm font-bold truncate">{order.profiles?.address || 'Customer Location'}</p>
                      </div>
                      <button 
                        onClick={() => acceptOrder(order.id)}
                        className="w-full bg-ink text-white border-2 border-ink py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-stk-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                      >
                        Accept Offer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="py-20 text-center bg-ink/5 border-2 border-dashed border-ink/20 rounded-[40px]">
                <p className="text-ink/40 font-bold uppercase text-xs tracking-widest">No delivery history yet</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="bg-white border-[3px] border-ink rounded-2xl p-5 shadow-stk-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-sage/20 border-2 border-ink rounded-xl flex items-center justify-center text-sage">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black tracking-tight">Order #{item.id.slice(0, 8)}</p>
                      <p className="text-[10px] font-black text-ink/40 uppercase tracking-widest">{new Date(item.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-lg font-black text-sage tracking-tighter">+₦1,500</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-8">
            <div className="bg-sage border-[3px] border-ink rounded-[48px] p-10 shadow-stk text-white text-center">
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Available Balance</p>
              <h2 className="text-6xl font-black tracking-tighter mb-8">₦{totalEarnings?.toLocaleString()}</h2>
              <button 
                onClick={() => toast.success('Cash out request sent!')}
                className="w-full bg-white text-ink border-[3px] border-ink py-4 rounded-2xl font-black uppercase text-sm shadow-stk hover:translate-y-0.5 active:translate-y-1 transition-all"
              >
                Cash Out Now
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border-[3px] border-ink rounded-[32px] p-6 shadow-stk-sm">
                <div className="p-3 bg-tomato/10 rounded-xl w-fit mb-4">
                  <TrendingUp size={24} className="text-tomato" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-ink/40">Deliveries</p>
                <h3 className="text-3xl font-black tracking-tighter">{history.length}</h3>
              </div>
              <div className="bg-white border-[3px] border-ink rounded-[32px] p-6 shadow-stk-sm">
                <div className="p-3 bg-mustard/10 rounded-xl w-fit mb-4">
                  <Wallet size={24} className="text-mustard" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-ink/40">Tips</p>
                <h3 className="text-3xl font-black tracking-tighter">₦0</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white border-[3px] border-ink rounded-[40px] p-8 shadow-stk space-y-8 text-center">
             <div className="size-32 bg-cream border-4 border-ink rounded-[40px] overflow-hidden shadow-stk mx-auto flex items-center justify-center">
                {profile?.avatar_url ? (
                   <img src={profile.avatar_url} className="w-full h-full object-cover" />
                ) : (
                   <User size={48} className="text-ink/10" />
                )}
             </div>
             <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter uppercase">{profile?.full_name}</h2>
                <p className="text-ink/40 font-bold uppercase text-xs tracking-widest">Registered Rider</p>
             </div>
             
             <div className="p-6 bg-sage/5 border-2 border-dashed border-sage/20 rounded-[32px] flex items-center justify-center gap-4 text-sage">
                <CheckCircle2 size={24} />
                <p className="font-black uppercase tracking-widest text-xs">Background Checked & Verified</p>
             </div>

             <button 
                onClick={() => {
                  localStorage.removeItem('platera_user');
                  navigate('/auth');
                  toast.success('Signed out successfully');
                }}
                className="w-full bg-tomato text-white border-[3px] border-ink rounded-2xl py-5 font-black uppercase text-sm shadow-stk flex items-center justify-center hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-stk-sm transition-all"
             >
                Sign Out
             </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DeliveryDashboard;
