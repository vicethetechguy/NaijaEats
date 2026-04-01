import { useState } from "react";
import { meals } from "@/data/meals";
import MealCard from "@/components/MealCard";

const filters = ["All", "Vegan", "Keto", "Organic", "Gluten-Free"];

const DiscoverMeals = () => {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? meals
      : meals.filter((m) => m.tags.some((t) => t.toLowerCase().includes(active.toLowerCase())));

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 px-5 py-4 backdrop-blur-xl">
        <h1 className="text-xl font-bold text-foreground">Discover Meals</h1>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                active === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5">
        {filtered.length === 0 ? (
          <p className="mt-20 text-center text-sm text-muted-foreground">
            No meals match this filter.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverMeals;
