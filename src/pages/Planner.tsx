import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { StickerCard, CTAButton } from '@/components/UI';
import { Coffee, Sun, Moon, X, Plus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMeals, ScheduledMeal } from '@/contexts/MealContext';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mealTypes = [
  { label: 'Breakfast', icon: Coffee, color: 'bg-mustard text-ink' },
  { label: 'Lunch', icon: Sun, color: 'bg-sage text-white' },
  { label: 'Dinner', icon: Moon, color: 'bg-tomato text-white' },
];

const Planner: React.FC = () => {
  const navigate = useNavigate();
  const { schedule, removeMealFromPlan, setTargetDay, setTargetType } = useMeals();

  const handleAdd = (day: string, type: string) => {
    setTargetDay(day);
    setTargetType(type);
    navigate('/meals');
  };

  const total = schedule.reduce((a, m) => a + (m.price || 14.99), 0);

  const Filled = ({ item }: { item: ScheduledMeal }) => (
    <div className="bg-card border-[3px] border-ink rounded-2xl shadow-stk-sm overflow-hidden h-full flex flex-col group relative">
      <button
        onClick={(e) => { e.stopPropagation(); removeMealFromPlan(item.id); }}
        className="absolute top-1.5 right-1.5 size-6 rounded-full bg-card border-2 border-ink flex items-center justify-center hover:bg-tomato hover:text-white transition-colors z-10"
        aria-label="Remove"
      >
        <X size={12} strokeWidth={3} />
      </button>
      <div className="aspect-square overflow-hidden border-b-[3px] border-ink">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <h4 className="font-extrabold text-xs leading-tight line-clamp-2">{item.title}</h4>
        <p className="text-[11px] font-black text-tomato mt-1">${(item.price || 14.99).toFixed(2)}</p>
      </div>
    </div>
  );

  const Empty = ({ day, type, icon: Icon, color }: any) => (
    <button
      onClick={() => handleAdd(day, type)}
      className="h-full min-h-[140px] w-full bg-card border-[3px] border-dashed border-ink rounded-2xl flex flex-col items-center justify-center gap-2 text-ink/60 hover:bg-mustard/30 hover:text-ink hover:border-solid transition-all group"
    >
      <div className={`size-10 rounded-xl border-2 border-ink flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wide">{type}</span>
      <Plus size={14} strokeWidth={3} />
    </button>
  );

  return (
    <MainLayout title="Planner">
      <div className="space-y-10">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">Meal Planner</h1>
            <p className="text-lg text-ink/70 font-medium mt-2">Oct 23 — 28 • {schedule.length} meals scheduled</p>
          </div>
          <div className="flex gap-2">
            <button className="size-11 rounded-full bg-card border-[3px] border-ink flex items-center justify-center hover:bg-mustard transition-colors shadow-stk-sm"><ChevronLeft size={18} strokeWidth={3} /></button>
            <button className="size-11 rounded-full bg-card border-[3px] border-ink flex items-center justify-center hover:bg-mustard transition-colors shadow-stk-sm"><ChevronRight size={18} strokeWidth={3} /></button>
          </div>
        </header>

        <div className="space-y-8">
          {days.map((day) => (
            <StickerCard key={day} className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-ink text-cream px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">{day}</span>
                <div className="h-0.5 flex-1 bg-ink/15" />
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {mealTypes.map((t) => {
                  const slot = schedule.find((s) => s.day === day && s.type === t.label);
                  return slot ? <Filled key={t.label} item={slot} /> : <Empty key={t.label} day={day} type={t.label} icon={t.icon} color={t.color} />;
                })}
              </div>
            </StickerCard>
          ))}
        </div>

        {schedule.length > 0 && (
          <div className="lg:sticky lg:bottom-6">
            <div className="bg-tomato text-white border-[4px] border-ink rounded-3xl shadow-stk-lg p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Weekly total</p>
                <p className="text-3xl font-black">${total.toFixed(2)}</p>
              </div>
              <button onClick={() => navigate('/checkout')} className="bg-card text-ink border-[3px] border-ink rounded-2xl px-6 py-3 font-bold uppercase tracking-wide shadow-stk hover:translate-x-1 hover:translate-y-1 hover:shadow-stk-sm transition-all flex items-center gap-2">
                Checkout <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Planner;