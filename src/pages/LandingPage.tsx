import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, ChefHat, Truck } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: ChefHat, title: "Chef-Crafted", desc: "Meals designed by top chefs" },
    { icon: Leaf, title: "Fresh & Organic", desc: "Locally sourced ingredients" },
    { icon: Truck, title: "Free Delivery", desc: "Straight to your door" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            🥗 Nourishing Meal Delivery
          </span>
          <h1 className="mt-4 font-sans text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            Eat{" "}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              Brilliantly
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-base text-muted-foreground font-poppins">
            Chef-prepared meals tailored to your lifestyle, delivered fresh to your doorstep.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/home")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-shadow hover:shadow-primary/25"
          >
            Get Started <ArrowRight size={18} />
          </motion.button>
        </motion.div>

        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/8 blur-[100px]" />
        </div>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="px-6 pb-16"
      >
        <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="text-xs font-bold text-foreground">{title}</h3>
              <p className="text-[10px] text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
