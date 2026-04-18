import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { ChevronLeft, ChevronRight, X, ArrowRight, Coffee, Sun, Moon } from 'lucide-react';
import { useMeals, ScheduledMeal } from '@/contexts/MealContext';

const Planner: React.FC = () => {
  const navigate = useNavigate();
  const { schedule, removeMealFromPlan, setTargetDay, setTargetType } = useMeals();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const mealTypes = [
    { label: "Breakfast", icon: Coffee },
    { label: "Lunch", icon: Sun },
    { label: "Dinner", icon: Moon }
  ];

  const handleAddMeal = (day: string, type: string) => {
    setTargetDay(day);
    setTargetType(type);
    navigate('/meals');
  };

  const totalPrice = schedule.reduce((acc, meal) => acc + (meal.price || 14.99), 0);

  const MealCard = ({ item }: { item: ScheduledMeal }) => (
    <div className="bg-muted/40 backdrop-blur-xl p-2 rounded-2xl border border-border group cursor-pointer hover:bg-muted/60 transition-all relative flex flex-col h-full animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
      <button
        onClick={(e) => { e.stopPropagation(); removeMealFromPlan(item.id); }}
        className="absolute top-1 right-1 p-1.5 bg-background/60 backdrop-blur-md rounded-lg text-muted-foreground hover:text-destructive transition-all z-10 border border-border"
        aria-label="Remove meal"
      >
        <X size={12} strokeWidth={3} />
      </button>
      <div className="w-full h-20 rounded-xl overflow-hidden mb-2 shrink-0 border border-border">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="space-y-0.5 min-w-0 px-1">
        <h4 className="font-bold text-[10px] text-foreground leading-tight truncate tracking-tight">{item.title}</h4>
        <div className="flex items-center justify-between gap-1 pt-1">
          <p className="text-[8px] font-normal text-muted-foreground uppercase truncate">{item.type.charAt(0)}</p>
          <p className="text-[9px] font-black text-primary tracking-tight">${(item.price || 14.99).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );

  const EmptySlot = ({ day, type, icon: Icon }: { day: string; type: string; icon: any }) => (
    <button
      onClick={() => handleAddMeal(day, type)}
      className="w-full h-full min-h-[88px] bg-muted/20 backdrop-blur-md border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all group p-2 shadow-inner"
    >
      <Icon size={16} className="shrink-0 group-hover:scale-110 transition-transform" />
      <span className="text-[9px] font-normal uppercase tracking-widest truncate">{type}</span>
    </button>
  );

  return (
    <MainLayout title="Meal Planner">
      <div className="space-y-8 pb-12">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-foreground tracking-tight">Oct 23 — 28</h2>
            <p className="text-muted-foreground font-normal text-sm">{schedule.length} meals scheduled</p>
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-muted/30 backdrop-blur-md border border-border rounded-xl text-foreground hover:bg-muted/50 transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="p-3 bg-muted/30 backdrop-blur-md border border-border rounded-xl text-foreground hover:bg-muted/50 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </header>

        <div className="space-y-8">
          {days.map((day) => (
            <div key={day} className="space-y-3">
              <div className="flex items-center gap-4 px-2">
                <span className="text-xs font-normal text-foreground uppercase tracking-[0.2em]">{day}</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-3 gap-3 items-stretch">
                {mealTypes.map((typeObj) => {
                  const mealInSlot = schedule.find(s => s.day === day && s.type === typeObj.label);
                  return (
                    <div key={typeObj.label} className="h-full">
                      {mealInSlot ? (
                        <MealCard item={mealInSlot} />
                      ) : (
                        <EmptySlot day={day} type={typeObj.label} icon={typeObj.icon} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {schedule.length > 0 && (
          <div className="pt-4">
            <div className="bg-card/80 backdrop-blur-3xl border border-border rounded-3xl p-6 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  <p className="text-[9px] font-normal text-muted-foreground uppercase tracking-widest">Total</p>
                </div>
                <h4 className="text-2xl font-black text-foreground tracking-tighter">${totalPrice.toFixed(2)}</h4>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6 rounded-2xl font-normal text-sm flex items-center gap-2.5 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                Checkout
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Planner;
