import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { Badge, StickerCard } from '@/components/UI';
import { Check, Plus, ChefHat } from 'lucide-react';
import { useMeals } from '@/contexts/MealContext';
import { cn } from '@/lib/utils';

const meals = [
  { id: 'jollof', title: 'Signature Jollof Rice', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=800&auto=format&fit=crop', badge: 'Most popular', color: 'orange' as const, desc: 'Authentic smoky party-style Jollof with grilled chicken and plantains.', chef: 'Chef Ezinne', price: 6500, cat: 'Rice dishes' },
  { id: 'egusi', title: 'Egusi & Pounded Yam', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop', badge: 'Chef special', color: 'mustard' as const, desc: 'Rich melon seed soup with assorted meats and silky pounded yam.', chef: 'Chef Funmilayo', price: 8500, cat: 'Soups & swallows' },
  { id: 'suya', title: 'Lagos Street Beef Suya', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop', badge: 'Spicy', color: 'orange' as const, desc: 'Beef marinated in Yaji spice, grilled with onions and tomatoes.', chef: 'Chef Amaka', price: 5500, cat: 'Grills' },
  { id: 'moimoi', title: 'Seven-Life Moimoi', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop', badge: 'Healthy', color: 'sage' as const, desc: 'Steamed bean pudding with eggs, fish, and Nigerian spices.', chef: 'Chef Sarah', price: 4500, cat: 'Rice dishes' },
];
const tabs = ['All meals', 'Rice dishes', 'Soups & swallows', 'Grills'];

const DiscoverMeals: React.FC = () => {
  const navigate = useNavigate();
  const { targetDay, targetType, addMealToPlan, setTargetDay, setTargetType } = useMeals();
  const [tab, setTab] = useState('All meals');
  const [added, setAdded] = useState<string | null>(null);

  const list = tab === 'All meals' ? meals : meals.filter((m) => m.cat === tab);

  const handleAdd = (e: React.MouseEvent, m: typeof meals[0]) => {
    e.stopPropagation();
    const day = targetDay || 'Mon';
    const type = targetType || 'Lunch';
    addMealToPlan({
      title: m.title, day, type,
      time: type === 'Breakfast' ? '8:30 AM' : type === 'Lunch' ? '1:00 PM' : '7:30 PM',
      image: m.image, chefName: m.chef, price: m.price,
    });
    setAdded(m.id);
    setTimeout(() => {
      setAdded(null);
      if (targetDay) { setTargetDay(null); setTargetType(null); navigate('/planner'); }
    }, 800);
  };

  return (
    <MainLayout title="Discover">
      <div className="space-y-10">
        <header className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">Discover meals</h1>
          <p className="text-lg text-ink/70 font-medium">{targetDay ? `Adding to ${targetDay} ${targetType}` : 'Browse every kitchen in your area.'}</p>
        </header>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn('whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide border-[3px] border-ink transition-all', tab === t ? 'bg-tomato text-white shadow-stk-sm' : 'bg-card text-ink hover:bg-mustard shadow-stk-sm')}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {list.map((m) => (
            <StickerCard key={m.id} onClick={() => navigate(`/meals/${m.id}`)} className="overflow-hidden flex flex-col group">
              <div className="aspect-square relative border-b-[3px] border-ink overflow-hidden">
                <img src={m.image} alt={m.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4"><Badge text={m.badge} color={m.color} className="text-[7px] sm:text-[10px] px-2 py-0.5 sm:px-3 sm:py-1" /></div>
              </div>
              <div className="p-3 sm:p-5 space-y-1.5 sm:space-y-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 text-ink/60 text-[8px] sm:text-xs font-bold uppercase tracking-wide">
                  <ChefHat size={12} className="sm:w-[14px] sm:h-[14px]" /> {m.chef}
                </div>
                <h3 className="text-sm sm:text-lg font-black leading-tight line-clamp-2">{m.title}</h3>
                <p className="text-[10px] sm:text-sm text-ink/70 font-medium line-clamp-1 sm:line-clamp-2 flex-1">{m.desc}</p>
                <div className="pt-2 sm:pt-3 border-t-2 border-ink/10 flex items-center justify-between">
                  <span className="text-lg sm:text-2xl font-black text-tomato">₦{m.price.toLocaleString()}</span>
                  <button onClick={(e) => handleAdd(e, m)} className={cn('size-8 sm:size-11 rounded-full border-[3px] border-ink flex items-center justify-center transition-all shadow-stk-sm', added === m.id ? 'bg-sage text-white' : 'bg-mustard text-ink hover:bg-tomato hover:text-white')}>
                    {added === m.id ? <Check size={14} className="sm:w-[18px] sm:h-[18px]" strokeWidth={3} /> : <Plus size={14} className="sm:w-[18px] sm:h-[18px]" strokeWidth={3} />}
                  </button>
                </div>
              </div>
            </StickerCard>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default DiscoverMeals;