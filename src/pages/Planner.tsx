import { CalendarDays, Clock, Trash2 } from "lucide-react";
import { MainLayout } from "@/components/Layouts";
import { useMeals } from "@/contexts/MealContext";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Planner = () => {
  const { schedule, removeMealFromPlan } = useMeals();

  const getMealsForDay = (day: string) => schedule.filter(m => m.day === day);

  return (
    <MainLayout title="Meal Plan">
      {/* Day chips */}
      <div className="flex gap-2 overflow-x-auto mb-6 -mx-1 px-1">
        {days.map((day, i) => {
          const count = getMealsForDay(day).length;
          return (
            <div
              key={day}
              className={`flex h-14 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl text-xs font-semibold transition-colors ${
                i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              <span>{day}</span>
              {count > 0 && <span className="mt-0.5 text-[9px] opacity-70">{count}</span>}
            </div>
          );
        })}
      </div>

      {/* Scheduled meals */}
      {schedule.length === 0 ? (
        <div className="text-center mt-20">
          <CalendarDays size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No meals planned yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.map(meal => (
            <div key={meal.id} className="flex gap-3 rounded-2xl bg-muted/30 border border-border p-3">
              <img src={meal.image} alt={meal.title} className="h-16 w-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
                  <Clock size={10} />
                  <span>{meal.day} · {meal.type} · {meal.time}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground truncate">{meal.title}</h3>
                {meal.chefName && <p className="text-[10px] text-muted-foreground">{meal.chefName}</p>}
              </div>
              <button onClick={() => removeMealFromPlan(meal.id)} className="self-center p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Planner;
