import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { Badge, CTAButton, StickerCard } from '@/components/UI';
import { ShoppingBasket, Check, UtensilsCrossed as Utensils, Clock, Loader2, Store } from 'lucide-react';
import { useMeals } from '@/contexts/MealContext';
import { supabase } from '@/lib/supabase';

interface MealData {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  seller_id: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

const MealDetail: React.FC = () => {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const { targetDay, targetType, addMealToPlan, setTargetDay, setTargetType } = useMeals();
  const [meal, setMeal] = useState<MealData | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function getMeal() {
      if (!mealId) return;
      const { data, error } = await supabase
        .from('meals')
        .select('*, profiles(full_name, avatar_url)')
        .eq('id', mealId)
        .single();
      
      if (data) setMeal(data);
      setLoading(false);
    }
    getMeal();
  }, [mealId]);

  const handleAdd = () => {
    if (!meal) return;
    const day = targetDay || 'Mon';
    const type = targetType || 'Dinner';
    addMealToPlan({
      title: meal.title, 
      day, 
      type,
      time: type === 'Breakfast' ? '8:30 AM' : type === 'Lunch' ? '1:00 PM' : '7:30 PM',
      image: meal.image_url, 
      chefName: meal.profiles?.full_name || 'Chef', 
      price: meal.price,
    });
    setAdded(true);
    setTimeout(() => { 
      setAdded(false); 
      setTargetDay(null); 
      setTargetType(null); 
      navigate('/planner'); 
    }, 800);
  };

  if (loading) {
    return (
      <DetailLayout title="Loading...">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 size={40} className="animate-spin text-tomato" />
          <p className="font-black tracking-wider text-ink/40">Fetching secret recipe...</p>
        </div>
      </DetailLayout>
    );
  }

  if (!meal) return <DetailLayout title="Not Found">Meal not found</DetailLayout>;

  return (
    <DetailLayout title={meal.title}>
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="border-[4px] border-ink rounded-[32px] overflow-hidden shadow-stk-lg bg-card aspect-[4/3] flex items-center justify-center">
            {meal.image_url ? (
              <img src={meal.image_url} alt={meal.title} className="w-full h-full object-cover" />
            ) : (
              <Utensils size={80} className="text-ink/10" />
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge text="Signature" color="orange" />
            <Badge text="Fresh" color="mustard" />
            <Badge text="High Protein" color="sage" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter mt-6">{meal.title}</h2>
          <p className="mt-4 text-lg font-medium text-ink/70 leading-relaxed">{meal.description}</p>

          <div className="grid grid-cols-4 gap-3 mt-8">
            {[
               { l: 'Calories', v: '650', u: 'kcal' },
               { l: 'Protein', v: '24', u: 'g' },
               { l: 'Carbs', v: '85', u: 'g' },
               { l: 'Fats', v: '18', u: 'g' }
            ].map((n) => (
              <div key={n.l} className="bg-card border-[3px] border-ink rounded-2xl p-4 text-center shadow-stk-sm">
                <p className="text-[10px] font-bold tracking-wide text-ink/60">{n.l}</p>
                <p className="text-xl font-black">{n.v}<span className="text-xs font-bold text-ink/60 ml-0.5">{n.u}</span></p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start space-y-6">
          <StickerCard className="p-6 flex items-center gap-4">
            <div className="size-16 rounded-2xl border-[3px] border-ink overflow-hidden shrink-0 bg-cream flex items-center justify-center">
              {meal.profiles?.avatar_url ? (
                <img src={meal.profiles.avatar_url} alt={meal.profiles?.full_name} className="w-full h-full object-cover" />
              ) : (
                <Utensils size={32} className="text-ink/10" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-tomato">
                <Store size={14} />
                <span className="text-[10px] font-black tracking-widest uppercase">Certified Kitchen</span>
              </div>
              <h4 className="text-xl font-black">{meal.profiles?.business_name || meal.profiles?.full_name || 'Partner chef'}</h4>
              <p className="text-xs font-bold text-ink/60">{meal.profiles?.business_name ? 'Certified Restaurant' : 'Certified Private Chef'}</p>
            </div>
          </StickerCard>

          <StickerCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-wider text-ink/60">Per plate</span>
              <span className="text-3xl font-black text-tomato">₦{meal.price.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-ink/70 mb-5">
              <Clock size={14} /> Ready for delivery
            </div>
            <CTAButton
              text={added ? 'Added to plan' : targetDay ? `Add to ${targetDay} ${targetType}` : 'Add to plan'}
              onClick={handleAdd}
              style={added ? 'sage' : 'orange'}
            />
            <button onClick={() => navigate('/planner')} className="w-full mt-3 text-sm font-bold tracking-wide text-ink/60 hover:text-ink py-2 flex items-center justify-center gap-2">
              <ShoppingBasket size={14} /> View planner
            </button>
            {added && <p className="text-center text-sage font-bold text-sm mt-2"><Check size={14} className="inline" /> Saved to your plan</p>}
          </StickerCard>
        </div>
      </div>
    </DetailLayout>
  );
};

export default MealDetail;