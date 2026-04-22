import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { Badge, CTAButton, StickerCard } from '@/components/UI';
import { ShoppingBasket, Check, ChefHat, Clock } from 'lucide-react';
import { useMeals } from '@/contexts/MealContext';

const MealDetail: React.FC = () => {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const { targetDay, targetType, addMealToPlan, setTargetDay, setTargetType } = useMeals();
  const [added, setAdded] = useState(false);

  const meal = {
    id: mealId || 'jollof',
    title: 'Smoky Party Jollof',
    chef: 'Chef Ezinne',
    chefImg: 'https://i.pravatar.cc/200?img=32',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=1200&auto=format&fit=crop',
    desc: 'Long-grain parboiled rice cooked in a rich, spicy tomato-and-pepper base, finished with a distinct smoky aroma from traditional bottom-pot steaming.',
    prep: '45 min',
    price: 18.99,
    nutrition: [
      { l: 'Calories', v: '650', u: 'kcal' },
      { l: 'Protein', v: '24', u: 'g' },
      { l: 'Carbs', v: '85', u: 'g' },
      { l: 'Fats', v: '18', u: 'g' },
    ],
    ingredients: ['Long-grain parboiled rice', 'Scotch bonnet peppers', 'Red bell peppers', 'Premium vegetable oil', 'Nigerian seasoning blend', 'Grilled chicken portion', 'Fried sweet plantains'],
  };

  const handleAdd = () => {
    const day = targetDay || 'Mon';
    const type = targetType || 'Dinner';
    addMealToPlan({
      title: meal.title, day, type,
      time: type === 'Breakfast' ? '8:30 AM' : type === 'Lunch' ? '1:00 PM' : '7:30 PM',
      image: meal.image, chefName: meal.chef, price: meal.price,
    });
    setAdded(true);
    setTimeout(() => { setAdded(false); setTargetDay(null); setTargetType(null); navigate('/planner'); }, 800);
  };

  return (
    <DetailLayout title={meal.title}>
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="border-[4px] border-ink rounded-[32px] overflow-hidden shadow-stk-lg bg-card">
            <img src={meal.image} alt={meal.title} className="w-full aspect-[4/3] object-cover" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge text="Signature" color="orange" />
            <Badge text={meal.prep} color="mustard" />
            <Badge text="High Protein" color="sage" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter mt-6">{meal.title}</h2>
          <p className="mt-4 text-lg font-medium text-ink/70 leading-relaxed">{meal.desc}</p>

          <div className="grid grid-cols-4 gap-3 mt-8">
            {meal.nutrition.map((n) => (
              <div key={n.l} className="bg-card border-[3px] border-ink rounded-2xl p-4 text-center shadow-stk-sm">
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink/60">{n.l}</p>
                <p className="text-xl font-black">{n.v}<span className="text-xs font-bold text-ink/60 ml-0.5">{n.u}</span></p>
              </div>
            ))}
          </div>

          <h3 className="text-xs font-bold uppercase tracking-widest text-ink/60 mt-10 mb-4">Ingredients</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {meal.ingredients.map((i) => (
              <div key={i} className="flex items-center gap-3 bg-card border-2 border-ink rounded-2xl px-4 py-3">
                <span className="size-2 rounded-full bg-tomato" />
                <span className="font-semibold text-sm">{i}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start space-y-6">
          <StickerCard className="p-6 flex items-center gap-4">
            <div className="size-16 rounded-2xl border-[3px] border-ink overflow-hidden shrink-0">
              <img src={meal.chefImg} alt={meal.chef} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-tomato">
                <ChefHat size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Master chef</span>
              </div>
              <h4 className="text-xl font-black">{meal.chef}</h4>
              <p className="text-xs font-bold text-ink/60 uppercase">Executive Saucier</p>
            </div>
          </StickerCard>

          <StickerCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-ink/60">Per plate</span>
              <span className="text-3xl font-black text-tomato">${meal.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-ink/70 mb-5">
              <Clock size={14} /> Ready in {meal.prep}
            </div>
            <CTAButton
              text={added ? 'Added to plan' : targetDay ? `Add to ${targetDay} ${targetType}` : 'Add to plan'}
              onClick={handleAdd}
              style={added ? 'sage' : 'orange'}
            />
            <button onClick={() => navigate('/planner')} className="w-full mt-3 text-sm font-bold uppercase tracking-wide text-ink/60 hover:text-ink py-2 flex items-center justify-center gap-2">
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