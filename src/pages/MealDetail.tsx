import { useParams, useNavigate } from "react-router-dom";
import { meals } from "@/data/meals";
import { Star, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { DetailLayout } from "@/components/Layouts";
import { Badge } from "@/components/UI";
import { CTAButton } from "@/components/UI";

const MealDetail = () => {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const meal = meals.find((m) => m.id === mealId);

  if (!meal) {
    return (
      <DetailLayout onBack={() => navigate(-1)} title="Meal">
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Meal not found.</p>
        </div>
      </DetailLayout>
    );
  }

  return (
    <DetailLayout onBack={() => navigate(-1)} title={meal.title}>
      <div>
        {/* Hero Image */}
        <div className="relative h-56 w-full">
          <img src={meal.imageUrl} alt={meal.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          {meal.planTier === "premium" && (
            <span className="absolute left-4 bottom-4 flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold text-primary-foreground backdrop-blur">
              <Star size={10} fill="currentColor" /> PREMIUM
            </span>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
          <h1 className="text-2xl font-extrabold text-foreground">{meal.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground font-poppins leading-relaxed">{meal.description}</p>

          {/* Nutrition */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            {[
              { label: "Calories", value: meal.nutrition.calories },
              { label: "Protein", value: meal.nutrition.protein },
              { label: "Carbs", value: meal.nutrition.carbs },
              { label: "Fats", value: meal.nutrition.fats },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-muted/30 border border-border p-3 text-center">
                <p className="text-lg font-bold text-foreground">{value}</p>
                <p className="text-[10px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-foreground mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {[...meal.badges, ...meal.tags].map((tag) => (
                <Badge key={tag} text={tag} />
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-foreground mb-2">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {meal.ingredients.map((ing) => (
                <span key={ing} className="rounded-lg bg-muted/30 border border-border px-3 py-1.5 text-xs text-foreground">{ing}</span>
              ))}
            </div>
          </div>

          {/* Allergens */}
          {meal.allergens.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-destructive mb-2">Allergens</h3>
              <div className="flex flex-wrap gap-2">
                {meal.allergens.map((a) => (
                  <span key={a} className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">{a}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <CTAButton text="Add to meal plan" style="rounded orange" />
          </div>
        </motion.div>
      </div>
    </DetailLayout>
  );
};

export default MealDetail;
