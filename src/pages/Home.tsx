import { motion } from "framer-motion";
import { Search, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { meals } from "@/data/meals";
import MealCard from "@/components/MealCard";
import { MainLayout } from "@/components/Layouts";

const Home = () => {
  const navigate = useNavigate();
  const featured = meals.filter((m) => m.planTier === "premium");
  const popular = meals.filter((m) => m.planTier === "standard");

  return (
    <MainLayout title="Platera">
      {/* Promo Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-orange-400 p-5 mb-6"
      >
        <div className="relative z-10">
          <span className="text-xs font-semibold text-primary-foreground/80">LIMITED OFFER</span>
          <h2 className="mt-1 text-xl font-extrabold text-primary-foreground">50% OFF Your First Week</h2>
          <p className="mt-1 text-xs text-primary-foreground/80 font-poppins">
            Use code <span className="font-bold text-primary-foreground">PLATE50</span>
          </p>
        </div>
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      </motion.div>

      {/* Featured */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-primary" />
            <h2 className="text-base font-bold text-foreground">Chef's Picks</h2>
          </div>
          <button onClick={() => navigate("/meals")} className="text-xs font-semibold text-primary">See all</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.map((meal) => <MealCard key={meal.id} meal={meal} />)}
        </div>
      </section>

      {/* Popular */}
      <section className="mt-8">
        <h2 className="text-base font-bold text-foreground mb-4">Popular This Week</h2>
        <div className="flex flex-col gap-3">
          {popular.map((meal) => <MealCard key={meal.id} meal={meal} variant="wide" />)}
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
