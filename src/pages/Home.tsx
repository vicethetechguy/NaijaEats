import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { Badge, StickerCard } from '@/components/UI';
import { ChefHat, ArrowRight, Truck, Flame } from 'lucide-react';

const heroImg = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop';

const favorites = [
  { id: 'jollof', title: 'Smoky Jollof Rice', cal: '650 KCAL', chef: 'Chef Ezinne', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=600&auto=format&fit=crop' },
  { id: 'egusi', title: 'Egusi & Pounded Yam', cal: '820 KCAL', chef: 'Chef Funmi', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=600&auto=format&fit=crop' },
  { id: 'suya', title: 'Lagos Beef Suya', cal: '540 KCAL', chef: 'Chef Amaka', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Eleanor');
  useEffect(() => {
    const u = localStorage.getItem('platera_user');
    if (u) try { const p = JSON.parse(u); if (p.name) setName(p.name.split(' ')[0]); } catch {}
  }, []);

  return (
    <MainLayout title="Home">
      <div className="space-y-12">
        <section className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <Badge text="🔥 Specials today" color="mustard" />
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[0.95]">
              Welcome back, <span className="text-tomato">{name}</span>.
            </h1>
            <p className="text-lg text-ink/70 font-medium max-w-xl">
              Your next neighborhood feast arrives in <span className="font-black text-ink">2 days</span>. Ready to plan the week?
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
            { l: 'Calories', v: '2,450', s: 'Daily avg', icon: Flame, c: 'bg-tomato text-white' },
            { l: 'Protein', v: '142g', s: 'On track', icon: ChefHat, c: 'bg-sage text-white' },
            { l: 'Meals', v: '12', s: 'This week', icon: Truck, c: 'bg-mustard text-ink' },
            { l: 'Saved', v: '$84', s: 'vs eating out', icon: ArrowRight, c: 'bg-ink text-cream' },
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((m) => (
              <StickerCard key={m.id} onClick={() => navigate(`/meals/${m.id}`)} className="overflow-hidden">
                <div className="aspect-[4/3] border-b-[3px] border-ink overflow-hidden">
                  <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-2">
                  <Badge text={m.cal} color="mustard" />
                  <h3 className="text-xl font-extrabold leading-tight">{m.title}</h3>
                  <p className="text-sm font-medium text-ink/60">By {m.chef}</p>
                </div>
              </StickerCard>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;