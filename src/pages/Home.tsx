import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { CTAButton, Badge } from '@/components/UI';
import { ChefHat, Truck, ArrowRight, Play } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Eleanor');

  useEffect(() => {
    const savedUser = localStorage.getItem('platera_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) setUserName(parsed.name.split(' ')[0]);
      } catch (e) { console.error("Failed to parse user data", e); }
    }
  }, []);

  const foodImg = "https://www.remitly.com/blog/wp-content/uploads/2022/09/different-Nigerian-dishes.jpeg";

  const favorites = [
    { id: 'jollof', title: "Smoky Jollof Rice", image: foodImg, cal: "650 KCAL", protein: "24g" },
    { id: 'egusi', title: "Egusi & Pounded Yam", image: foodImg, cal: "820 KCAL", protein: "35g" },
  ];

  return (
    <MainLayout title="Platera">
      <div className="space-y-10">
        <section className="space-y-1">
          <h2 className="text-3xl font-black text-foreground tracking-tight font-sans">Welcome, {userName}</h2>
          <p className="text-muted-foreground font-medium text-sm font-poppins">Your next Nigerian feast arrives in <span className="text-primary font-bold">2 days</span>.</p>
        </section>

        <section className="relative group cursor-pointer overflow-hidden rounded-[32px] p-8 text-foreground min-h-[380px] flex flex-col justify-end shadow-2xl" onClick={() => navigate('/meals')}>
          <div className="absolute inset-0">
            <img src={foodImg} className="w-full h-full object-cover" alt="Banner" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex gap-2">
              <Badge text="New specials" color="orange" />
            </div>
            <h2 className="text-4xl font-black leading-none tracking-tighter font-sans text-foreground">Naija spice.</h2>
            <p className="text-secondary-foreground text-sm font-medium font-poppins">
              Authentic flavors from Lagos to Abuja, delivered to your doorstep.
            </p>
            <div className="flex gap-3 pt-2">
              <CTAButton 
                text="Explore" 
                className="w-auto px-6 h-12"
                onClick={(e) => { e.stopPropagation(); navigate('/meals'); }}
              />
              <button 
                onClick={(e) => { e.stopPropagation(); navigate('/planner'); }}
                className="flex items-center justify-center gap-2 px-6 h-12 bg-muted/40 backdrop-blur-xl rounded-2xl font-normal text-xs border border-border font-poppins hover:bg-muted/60 transition-all text-foreground"
              >
                <Play size={14} fill="currentColor" />
                Planner
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          {[
            { label: "Calories", val: "2,450", sub: "Avg" },
            { label: "Protein", val: "142g", sub: "Daily" },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-muted/30 backdrop-blur-xl border border-border rounded-[28px] hover:bg-muted/50 transition-all cursor-pointer group shadow-xl">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 font-poppins">{stat.label}</p>
              <h4 className="text-2xl font-black text-foreground tracking-tight font-sans">{stat.val}</h4>
              <p className="text-[9px] font-bold text-primary/80 font-poppins">{stat.sub}</p>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-foreground font-sans">Trending in Lagos</h3>
            <button onClick={() => navigate('/meals')} className="text-primary font-normal text-xs flex items-center gap-1 font-poppins">
              All <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {favorites.map((meal) => (
              <div key={meal.id} className="group cursor-pointer bg-muted/30 backdrop-blur-xl rounded-[28px] p-4 flex items-center gap-4 border border-border hover:bg-muted/50 transition-all shadow-xl" onClick={() => navigate(`/meals/${meal.id}`)}>
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <Badge text={meal.cal} color="gray" />
                  <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors font-sans">{meal.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] font-normal text-muted-foreground uppercase font-poppins">
                    <span className="flex items-center gap-1"><ChefHat size={12} /> 45m</span>
                    <span className="flex items-center gap-1"><Truck size={12} /> Ready</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
