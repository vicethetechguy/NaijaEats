import { CalendarDays, Clock } from "lucide-react";
import { meals } from "@/data/meals";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Planner = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 px-5 py-4 backdrop-blur-xl">
        <h1 className="text-xl font-bold text-foreground">Meal Planner</h1>
        <p className="text-xs text-muted-foreground font-poppins">Plan your week ahead</p>
      </div>

      <div className="px-5 pt-5">
        {/* Day Selector */}
        <div className="flex gap-2 overflow-x-auto">
          {days.map((day, i) => (
            <button
              key={day}
              className={`flex h-14 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl text-xs font-semibold transition-colors ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground"
              }`}
            >
              <span>{day}</span>
              <span className="mt-0.5 text-[10px]">{i + 7}</span>
            </button>
          ))}
        </div>

        {/* Meal Slots */}
        <div className="mt-6 space-y-4">
          {["Breakfast", "Lunch", "Dinner"].map((slot, i) => {
            const meal = meals[i];
            return (
              <div key={slot} className="rounded-2xl bg-card p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={14} />
                  <span className="font-semibold">{slot}</span>
                </div>
                {meal ? (
                  <div className="mt-3 flex gap-3">
                    <img
                      src={meal.imageUrl}
                      alt={meal.title}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="flex flex-col justify-center">
                      <h3 className="text-sm font-semibold text-foreground">{meal.title}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{meal.nutrition.calories} cal</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">No meal planned</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-2xl bg-card p-4">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">Today's Summary</h3>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Calories", val: "1,410" },
              { label: "Protein", val: "96g" },
              { label: "Carbs", val: "128g" },
              { label: "Fats", val: "54g" },
            ].map(({ label, val }) => (
              <div key={label}>
                <p className="text-base font-bold text-foreground">{val}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
