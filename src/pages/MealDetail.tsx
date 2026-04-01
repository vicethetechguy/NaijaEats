import { useParams, useNavigate } from "react-router-dom";
import { meals } from "@/data/meals";
import { ArrowLeft, Star, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";

const MealDetail = () => {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const meal = meals.find((m) => m.id === mealId);

  if (!meal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Meal not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Hero Image */}
      <div className="relative h-72 w-full">
        <img src={meal.imageUrl} alt={meal.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/60 backdrop-blur"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative -mt-8 px-5"
      >
        <div className="flex items-start justify-between">
          <div>
            {meal.planTier === "premium" && (
              <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                <Star size={10} fill="currentColor" /> PREMIUM
              </span>
            )}
            <h1 className="text-2xl font-extrabold text-foreground">{meal.title}</h1>
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground font-poppins leading-relaxed">{meal.description}</p>

        {/* Nutrition Grid */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {[
            { icon: Flame, label: "Calories", value: meal.nutrition.calories },
            { icon: null, label: "Protein", value: meal.nutrition.protein },
            { icon: null, label: "Carbs", value: meal.nutrition.carbs },
            { icon: null, label: "Fats", value: meal.nutrition.fats },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-card p-3 text-center">
              <p className="text-lg font-bold text-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-foreground">Tags</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {[...meal.badges, ...meal.tags].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-foreground">Ingredients</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {meal.ingredients.map((ing) => (
              <span key={ing} className="rounded-lg bg-card px-3 py-1.5 text-xs text-foreground">
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Allergens */}
        {meal.allergens.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-destructive">Allergens</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {meal.allergens.map((a) => (
                <span key={a} className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 p-4 backdrop-blur-xl pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button className="w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground">
          Add to Meal Plan
        </button>
      </div>
    </div>
  );
};

export default MealDetail;
