import { useState } from "react";
import { meals } from "@/data/meals";
import MealCard from "@/components/MealCard";
import { MainLayout } from "@/components/Layouts";

const filters = ["All", "Vegan", "Keto", "Organic", "Gluten-Free"];

const DiscoverMeals = () => {
  const [active, setActive] = useState("All");

  const filtered = active === "All"
    ? meals
    : meals.filter((m) => m.tags.some((t) => t.toLowerCase().includes(active.toLowerCase())));

  return (
    <MainLayout title="Discover">
      <div className="flex gap-2 overflow-x-auto mb-5 -mx-1 px-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              active === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-20 text-center text-sm text-muted-foreground">No meals match this filter.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((meal) => <MealCard key={meal.id} meal={meal} />)}
        </div>
      )}
    </MainLayout>
  );
};

export default DiscoverMeals;
