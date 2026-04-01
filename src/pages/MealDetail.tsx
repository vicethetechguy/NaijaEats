import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/UI';
import { ShoppingBasket, Check, ChefHat, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useMeals } from '@/contexts/MealContext';
import { cn } from '@/lib/utils';

const MealDetail: React.FC = () => {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const { targetDay, targetType, addMealToPlan, setTargetDay, setTargetType } = useMeals();
  const [isAdded, setIsAdded] = useState(false);

  const meal = {
    id: mealId || 'jollof',
    title: "Smoky Party Jollof",
    chefName: "Chef Ezinne",
    chefRole: "Executive Saucier",
    chefImage: "https://images.unsplash.com/photo-1583394293214-28dea15ee548?q=80&w=200&auto=format&fit=crop",
    image: "https://www.remitly.com/blog/wp-content/uploads/2022/09/different-Nigerian-dishes.jpeg",
    description: "The pride of West Africa. Long-grain parboiled rice cooked in a rich, spicy tomato and bell pepper base, flavored with bay leaves, thyme, and a distinct smoky aroma achieved through traditional bottom-pot steaming.",
    tags: ["High Protein", "Spicy", "Authentic"],
    prepTime: "45 Mins",
    nutrition: [
      { label: "Calories", value: "650", unit: "KCAL" },
      { label: "Protein", value: "24", unit: "G" },
      { label: "Carbs", value: "85", unit: "G" },
      { label: "Fats", value: "18", unit: "G" },
    ],
    ingredients: [
      "Long grain parboiled rice", "Scotch bonnet peppers", "Red bell peppers",
      "Premium vegetable oil", "Traditional Nigerian seasoning", "Grilled hard chicken portion", "Fried sweet plantains"
    ],
    allergens: ["Contains Poultry", "Medium spice level"]
  };

  const handleAddToPlan = () => {
    const day = targetDay || "Mon";
    const type = targetType || "Dinner";
    addMealToPlan({
      title: meal.title, day, type,
      time: type === "Breakfast" ? "8:30 AM" : type === "Lunch" ? "1:00 PM" : "7:30 PM",
      image: meal.image, chefName: meal.chefName, price: 18.99
    });
    setIsAdded(true);
    setTimeout(() => { setIsAdded(false); setTargetDay(null); setTargetType(null); navigate('/planner'); }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-0 md:p-8">
      <div className="flex flex-col h-screen md:h-[844px] w-full max-w-md bg-card shadow-2xl rounded-none md:rounded-[40px] relative overflow-hidden border border-border">
        
        <div className="absolute top-0 left-0 right-0 z-[60] px-6 py-8 flex items-center justify-between pointer-events-none">
          <button onClick={() => navigate(-1)} className="p-3 bg-background/20 backdrop-blur-xl rounded-2xl text-foreground border border-border active:scale-90 transition-all pointer-events-auto">
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <button className="p-3 bg-background/20 backdrop-blur-xl rounded-2xl text-foreground border border-border active:scale-90 transition-all pointer-events-auto">
            <ShieldCheck size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scroll-smooth">
          <section className="h-[50vh] relative shrink-0">
            <motion.img initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} src={meal.image} className="w-full h-full object-cover" alt={meal.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            <div className="absolute bottom-8 px-8 w-full">
              <div className="flex items-center gap-2 mb-3">
                <Badge text="Signature" color="orange" />
                <span className="text-[10px] text-foreground/50 uppercase tracking-widest flex items-center gap-1 font-normal">
                  <Clock size={12} /> {meal.prepTime}
                </span>
              </div>
              <h1 className="text-4xl font-black text-foreground leading-tight tracking-tighter">{meal.title}</h1>
            </div>
          </section>

          <div className="px-8 space-y-12 pb-40 pt-4">
            <section className="grid grid-cols-4 gap-3">
              {meal.nutrition.map((item, i) => (
                <div key={i} className="bg-muted/30 border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-normal text-muted-foreground uppercase tracking-widest mb-1">{item.label}</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-black text-foreground">{item.value}</span>
                    <span className="text-[8px] font-normal text-muted-foreground">{item.unit}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-normal text-muted-foreground uppercase tracking-[0.3em]">Description</h3>
              <p className="text-lg font-normal text-muted-foreground leading-relaxed font-poppins">{meal.description}</p>
            </section>

            <section className="p-6 bg-muted/30 rounded-[32px] border border-border flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border">
                <img src={meal.chefImage} className="w-full h-full object-cover" alt={meal.chefName} />
              </div>
              <div>
                <div className="flex items-center gap-1 text-primary mb-0.5">
                  <ChefHat size={12} />
                  <span className="text-[9px] font-normal uppercase tracking-widest">Master chef</span>
                </div>
                <h4 className="text-xl font-black text-foreground">{meal.chefName}</h4>
                <p className="text-[10px] text-muted-foreground uppercase font-normal">{meal.chefRole}</p>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] font-normal text-muted-foreground uppercase tracking-[0.3em]">Ingredients</h3>
              <div className="space-y-3">
                {meal.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm font-normal text-muted-foreground">{ing}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-card via-card to-transparent pt-12 z-[70]">
          <button
            onClick={handleAddToPlan}
            className={cn(
              "w-full h-16 rounded-[24px] font-normal text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl",
              isAdded ? "bg-green-500 text-primary-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isAdded ? (<><Check size={18} strokeWidth={3} /> Plan updated</>) : (<><ShoppingBasket size={18} /> {targetDay && targetType ? `Add to ${targetDay} ${targetType}` : "Add to plan"}</>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealDetail;
