import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { Check, Plus, ChefHat } from 'lucide-react';
import { Badge } from '@/components/UI';
import { useMeals } from '@/contexts/MealContext';

const DiscoverMeals: React.FC = () => {
  const navigate = useNavigate();
  const { targetDay, targetType, addMealToPlan, setTargetDay, setTargetType } = useMeals();
  const [activeTab, setActiveTab] = useState('All meals');
  const [addedMealId, setAddedMealId] = useState<string | null>(null);

  const foodImg = "https://www.remitly.com/blog/wp-content/uploads/2022/09/different-Nigerian-dishes.jpeg";
  const tabs = ["All meals", "Rice dishes", "Soups & swallows", "Grills"];

  const meals = [
    { id: 'jollof', title: "Signature Jollof Rice", image: foodImg, badge: "Most popular", desc: "Authentic smoky party-style Jollof rice served with grilled chicken and plantains.", chef: "Chef Ezinne", price: 18.99 },
    { id: 'egusi', title: "Egusi & Fresh Pounded Yam", image: foodImg, badge: "Chef special", desc: "Rich melon seed soup with assorted meats and silky pounded yam.", chef: "Chef Funmilayo", price: 24.50 },
    { id: 'suya', title: "Lagos Street Beef Suya", image: foodImg, badge: "Spicy", desc: "Thinly sliced beef marinated in Yaji spice, grilled to perfection with onions and tomatoes.", chef: "Chef Amaka", price: 15.99 },
    { id: 'moimoi', title: "Seven-Life Moimoi", image: foodImg, badge: "Healthy", desc: "Steamed bean pudding enriched with eggs, fish, and authentic Nigerian spices.", chef: "Chef Sarah", price: 12.50 },
  ];

  const handleAdd = (e: React.MouseEvent, meal: typeof meals[0]) => {
    e.stopPropagation();
    const day = targetDay || "Mon";
    const type = targetType || "Lunch";
    
    addMealToPlan({
      title: meal.title, day, type,
      time: type === "Breakfast" ? "8:30 AM" : type === "Lunch" ? "1:00 PM" : "7:30 PM",
      image: meal.image, chefName: meal.chef, price: meal.price
    });

    setAddedMealId(meal.id);
    setTimeout(() => {
      setAddedMealId(null);
      if (targetDay) { setTargetDay(null); setTargetType(null); navigate('/planner'); }
    }, 1000);
  };

  return (
    <MainLayout title="Discover">
      <div className="space-y-8 pb-20">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-normal transition-all border ${
                activeTab === tab 
                  ? 'bg-primary text-primary-foreground shadow-lg border-primary' 
                  : 'bg-muted/30 backdrop-blur-md text-muted-foreground hover:text-foreground border-border'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {meals.map((meal) => (
            <div key={meal.id} className="group cursor-pointer flex flex-col bg-muted/20 rounded-[40px] overflow-hidden border border-border hover:border-muted-foreground/20 transition-all shadow-2xl" onClick={() => navigate(`/meals/${meal.id}`)}>
              <div className="overflow-hidden aspect-video relative">
                <img src={meal.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={meal.title} />
                {meal.badge && (
                  <div className="absolute top-6 left-6">
                    <Badge text={meal.badge} />
                  </div>
                )}
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <ChefHat size={14} className="text-primary" />
                  <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-widest">{meal.chef}</span>
                </div>
                <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">{meal.title}</h3>
                <p className="text-muted-foreground text-sm font-normal leading-relaxed line-clamp-2">{meal.desc}</p>
                <div className="pt-6 flex items-center justify-between border-t border-border">
                  <div className="flex items-center gap-1">
                    <span className="text-primary font-black text-2xl tracking-tighter">${meal.price.toFixed(2)}</span>
                    <span className="text-muted-foreground text-[10px] uppercase font-normal tracking-widest">/ plate</span>
                  </div>
                  <button 
                    onClick={(e) => handleAdd(e, meal)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
                      addedMealId === meal.id 
                        ? 'bg-green-500 border-green-400 text-primary-foreground shadow-lg shadow-green-500/20' 
                        : 'bg-muted/40 backdrop-blur-md border-border text-foreground hover:bg-primary hover:border-primary shadow-xl active:scale-90'
                    }`}
                  >
                    {addedMealId === meal.id ? <Check size={18} /> : <Plus size={18} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default DiscoverMeals;
