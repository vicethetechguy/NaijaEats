import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { Badge, StickerCard } from '@/components/UI';
import { Check, Plus, ChefHat, Loader2, Search } from 'lucide-react';
import { useMeals } from '@/contexts/MealContext';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface Meal {
  id: string;
  title: string;
  image_url: string;
  price: number;
  description: string;
  profiles: {
    full_name: string;
    business_name: string;
  };
  category: string;
}

const tabs = ['All meals', 'Rice dishes', 'Soups & swallows', 'Grills'];

const DiscoverMeals: React.FC = () => {
  const navigate = useNavigate();
  const { targetDay, targetType, addMealToPlan, setTargetDay, setTargetType } = useMeals();
  const [tab, setTab] = useState('All meals');
  const [search, setSearch] = useState('');
  const [added, setAdded] = useState<string | null>(null);
  const [dbMeals, setDbMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('meals')
        .select('*, profiles(full_name, business_name)')
        .eq('is_available', true);
      
      if (data) {
        setDbMeals(data as any);
      }
      setLoading(false);
    };

    fetchMeals();
  }, []);

  const list = dbMeals.filter((m) => {
    const matchesTab = tab === 'All meals' || m.category === tab;
    const matchesSearch = 
      m.title.toLowerCase().includes(search.toLowerCase()) || 
      (m.profiles?.business_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.profiles?.full_name || '').toLowerCase().includes(search.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleAdd = (e: React.MouseEvent, m: Meal) => {
    e.stopPropagation();
    const day = targetDay || 'Mon';
    const type = targetType || 'Lunch';
    addMealToPlan({
      title: m.title, day, type,
      time: type === 'Breakfast' ? '8:30 AM' : type === 'Lunch' ? '1:00 PM' : '7:30 PM',
      image: m.image_url, 
      chefName: m.profiles?.business_name || m.profiles?.full_name || 'Chef', 
      price: m.price,
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

        <div className="relative">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-ink/40" size={20} strokeWidth={3} />
          </div>
          <input 
            type="text"
            placeholder="Search for Jollof, Egusi, or your favorite Chef..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border-[3px] border-ink rounded-2xl py-4 pl-14 pr-6 text-base font-bold placeholder:text-ink/30 focus:bg-mustard/10 outline-none shadow-stk-sm transition-all"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn('whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide border-[3px] border-ink transition-all', tab === t ? 'bg-tomato text-white shadow-stk-sm' : 'bg-card text-ink hover:bg-mustard shadow-stk-sm')}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-tomato" size={40} />
              <p className="font-bold text-ink/40 uppercase tracking-widest text-xs">Finding fresh meals...</p>
            </div>
          ) : list.length === 0 ? (
             <div className="col-span-full py-20 text-center space-y-4">
               <div className="size-16 bg-card border-2 border-ink rounded-full flex items-center justify-center mx-auto mb-4 opacity-40">
                 <Search size={32} />
               </div>
               <p className="font-bold text-ink/40 uppercase tracking-widest text-xs">
                 No results for "{search}" in {tab}
               </p>
               <button 
                 onClick={() => {setSearch(''); setTab('All meals');}}
                 className="text-tomato font-black uppercase tracking-widest text-[10px] hover:underline"
               >
                 Clear all filters
               </button>
             </div>
          ) : (
            list.map((m) => (
              <StickerCard key={m.id} onClick={() => navigate(`/meals/${m.id}`)} className="overflow-hidden flex flex-col group">
                <div className="aspect-square relative border-b-[3px] border-ink overflow-hidden">
                  <img src={m.image_url} alt={m.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4"><Badge text={m.category || "New"} color="orange" className="text-[7px] sm:text-[10px] px-2 py-0.5 sm:px-3 sm:py-1" /></div>
                </div>
                <div className="p-3 sm:p-5 space-y-1.5 sm:space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5 text-ink/60 text-[8px] sm:text-xs font-bold uppercase tracking-wide">
                    <ChefHat size={12} className="sm:w-[14px] sm:h-[14px]" /> {m.profiles?.business_name || m.profiles?.full_name || 'Chef'}
                  </div>
                  <h3 className="text-sm sm:text-lg font-black leading-tight line-clamp-2">{m.title}</h3>
                  <p className="text-[10px] sm:text-sm text-ink/70 font-medium line-clamp-1 sm:line-clamp-2 flex-1">{m.description}</p>
                  <div className="pt-2 sm:pt-3 border-t-2 border-ink/10 flex items-center justify-between">
                    <span className="text-lg sm:text-2xl font-black text-tomato">₦{Number(m.price).toLocaleString()}</span>
                    <button onClick={(e) => handleAdd(e, m)} className={cn('size-8 sm:size-11 rounded-full border-[3px] border-ink flex items-center justify-center transition-all shadow-stk-sm', added === m.id ? 'bg-sage text-white' : 'bg-mustard text-ink hover:bg-tomato hover:text-white')}>
                      {added === m.id ? <Check size={14} className="sm:w-[18px] sm:h-[18px]" strokeWidth={3} /> : <Plus size={14} className="sm:w-[18px] sm:h-[18px]" strokeWidth={3} />}
                    </button>
                  </div>
                </div>
              </StickerCard>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DiscoverMeals;