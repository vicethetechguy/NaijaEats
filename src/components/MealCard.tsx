import { Meal } from "@/types/meal";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

interface MealCardProps {
  meal: Meal;
  variant?: "default" | "wide";
}

const MealCard = ({ meal, variant = "default" }: MealCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/meals/${meal.id}`)}
      className={`group relative overflow-hidden rounded-xl bg-card text-left transition-all hover:ring-1 hover:ring-primary/30 ${
        variant === "wide" ? "flex gap-4" : "block"
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          variant === "wide" ? "h-28 w-28 flex-shrink-0 rounded-xl" : "aspect-[4/3] w-full rounded-t-xl"
        }`}
      >
        <img
          src={meal.imageUrl}
          alt={meal.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {meal.planTier === "premium" && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-primary-foreground backdrop-blur">
            <Star size={10} fill="currentColor" /> PREMIUM
          </span>
        )}
      </div>
      <div className={`${variant === "wide" ? "flex flex-1 flex-col justify-center py-3 pr-3" : "p-3"}`}>
        <h3 className="font-semibold text-sm text-foreground line-clamp-1">{meal.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{meal.description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {meal.badges.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
};

export default MealCard;
