import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { Badge, StickerCard } from '@/components/UI';
import { ChefHat, ArrowRight, Truck, Flame, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const heroImg = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    calories: '0',
    protein: '0g',
    mealsThisWeek: '0',
    totalSaved: '₦0'
  });

  useEffect(() => {
    async function loadHomeData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Load user profile
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (profile?.full_name) setName(profile.full_name.split(' ')[0]);

        // Load stats from orders
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('eater_id', user.id);
        
        if (orders) {
          const totalSpent = orders.reduce((acc, curr) => acc + curr.total_amount, 0);
          setUserStats({
            calories: String(orders.length * 650), // estimate
            protein: String(orders.length * 24) + 'g',
            mealsThisWeek: String(orders.filter(o => new Date(o.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length),
            totalSaved: `₦${(totalSpent * 0.12).toLocaleString()}`
          });
        }
      }

      // Load Trending Meals
      const { data: meals } = await supabase
        .from('meals')
        .select('*, profiles(full_name, business_name)')
        .eq('is_available', true)
        .limit(4);
      
      if (meals) setTrending(meals);
      setLoading(false);
    }
    loadHomeData();
  }, []);

  return (
    <MainLayout title="Home">
      <div className="space-y-12">
        <section className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <Badge text="🔥 Specials today" color="mustard" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[0.95]">
              Welcome back, <span className="text-tomato">
                {name || <div className="inline-block w-40 h-10 bg-tomato/10 animate-pulse rounded-lg align-middle" />}
              </span>.
            </h1>
            <p className="text-lg text-ink/70 font-medium max-w-xl">
              Ready to explore authentic Nigerian flavors? Discover what's cooking in your neighborhood today.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={() => navigate('/meals')} className="bg-tomato text-white border-[3px] border-ink px-6 py-3 rounded-2xl font-bold uppercase tracking-wide shadow-stk hover:translate-x-1 hover:translate-y-1 hover:shadow-stk-sm transition-all">Explore meals</button>
              <button onClick={() => navigate('/planner')} className="bg-card border-[3px] border-ink px-6 py-3 rounded-2xl font-bold uppercase tracking-wide shadow-stk-sm hover:bg-mustard transition-colors">Open planner</button>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="rotate-2 border-[4px] border-ink rounded-[36px] overflow-hidden shadow-stk-lg">
              <img src={heroImg} alt="Today's special" className="w-full aspect-[5/4] object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-sage text-white border-[3px] border-ink p-4 rounded-2xl -rotate-6 shadow-stk">
              <p className="font-black text-xl leading-none">Free</p>
              <p className="text-xs font-bold uppercase">Delivery today</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: 'Calories', v: userStats.calories, s: 'Estimated', icon: Flame, c: 'bg-tomato text-white' },
            { l: 'Protein', v: userStats.protein, s: 'On track', icon: ChefHat, c: 'bg-sage text-white' },
            { l: 'Meals', v: userStats.mealsThisWeek, s: 'This week', icon: Truck, c: 'bg-mustard text-ink' },
            { l: 'Saved', v: userStats.totalSaved, s: 'vs eating out', icon: ArrowRight, c: 'bg-ink text-cream' },
          ].map((s) => {
            const I = s.icon;
            return (
              <StickerCard key={s.l} className="p-5">
                <div className={`size-10 rounded-xl border-2 border-ink ${s.c} flex items-center justify-center mb-3`}><I size={18} /></div>
                <p className="text-xs font-bold uppercase tracking-wide text-ink/60">{s.l}</p>
                <p className="text-2xl font-black tracking-tight">{s.v}</p>
                <p className="text-xs font-bold text-ink/60">{s.s}</p>
              </StickerCard>
            );
          })}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight">Trending in your area</h2>
            <button onClick={() => navigate('/meals')} className="font-bold text-sm uppercase tracking-wide text-tomato hover:underline flex items-center gap-1">All <ArrowRight size={14} /></button>
          </div>
          
          {loading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-tomato" size={40} />
              <p className="font-bold text-ink/40 uppercase tracking-widest text-xs">Finding hot meals...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {trending.map((m) => (
                <StickerCard key={m.id} onClick={() => navigate(`/meals/${m.id}`)} className="overflow-hidden group">
                  <div className="aspect-square border-b-[3px] border-ink overflow-hidden">
                    <img src={m.image_url} alt={m.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <div className="p-3 sm:p-5 space-y-1 sm:space-y-2">
                    <Badge text={`₦${Number(m.price).toLocaleString()}`} color="mustard" className="text-[7px] sm:text-[10px] px-2 py-0.5" />
                    <h3 className="text-sm sm:text-xl font-black leading-tight line-clamp-1 sm:line-clamp-2">{m.title}</h3>
                    <p className="text-[10px] sm:text-sm font-medium text-ink/60">By {m.profiles?.business_name || m.profiles?.full_name || 'Chef'}</p>
                  </div>
                </StickerCard>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
Home;