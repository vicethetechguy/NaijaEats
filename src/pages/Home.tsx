import { motion } from "framer-motion";
import { Search, Bell, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { meals } from "@/data/meals";
import MealCard from "@/components/MealCard";

const Home = () => {
  const navigate = useNavigate();
  const featured = meals.filter((m) => m.planTier === "premium");
  const popular = meals.filter((m) => m.planTier === "standard");

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-poppins">Good evening 👋</p>
            <h1 className="text-lg font-bold text-foreground">What's for dinner?</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/search")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-card"
            >
              <Search size={18} className="text-muted-foreground" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card">
              <Bell size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-orange-400 p-5"
        >
          <div className="relative z-10">
            <span className="text-xs font-semibold text-primary-foreground/80">LIMITED OFFER</span>
            <h2 className="mt-1 text-xl font-extrabold text-primary-foreground">
              50% OFF Your First Week
            </h2>
            <p className="mt-1 text-xs text-primary-foreground/80 font-poppins">
              Use code <span className="font-bold text-primary-foreground">PLATE50</span>
            </p>
          </div>
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        </motion.div>

        {/* Featured Section */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-primary" />
              <h2 className="text-base font-bold text-foreground">Chef's Picks</h2>
            </div>
            <button
              onClick={() => navigate("/meals")}
              className="text-xs font-semibold text-primary"
            >
              See all
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {featured.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </section>

        {/* Popular Section */}
        <section className="mt-8">
          <h2 className="text-base font-bold text-foreground">Popular This Week</h2>
          <div className="mt-4 flex flex-col gap-3">
            {popular.map((meal) => (
              <MealCard key={meal.id} meal={meal} variant="wide" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
