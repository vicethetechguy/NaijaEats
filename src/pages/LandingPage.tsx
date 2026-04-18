import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, ShieldCheck, Star, Zap, Play, CheckCircle2 } from 'lucide-react';
import { CTAButton } from '@/components/UI';

const LOGO_URL = "https://drive.google.com/thumbnail?id=1jkLC0R1klmr8UOCJ2exnvjROu8VUjPWV&sz=w500";
const foodImg = "https://www.remitly.com/blog/wp-content/uploads/2022/09/different-Nigerian-dishes.jpeg";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const goStart = () => {
    const onboarded = localStorage.getItem('platera_onboarded');
    navigate(onboarded ? '/home' : '/onboarding');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const stagger = {
    whileInView: { transition: { staggerChildren: 0.1 } }
  };

  const chefs = [
    { name: "Chef Ezinne", spec: "Rice & Grills", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnBfy2y1_WsK76Sxb8-cyd6-afx_dj_dazdQ&s" },
    { name: "Chef Funmi", spec: "Traditional Soups", img: "https://media.cnn.com/api/v1/images/stellar/prod/240209100557-chishuru-michelin-restaurant-1.jpg?c=16x9" },
    { name: "Chef Amaka", spec: "Fusion Bowls", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN6tGEFhm0wylpw1gthnY_ZpKOaqtNrNhILA&s" },
    { name: "Chef Ozin", spec: "Gourmet Pastries", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKeWm_LhDIBSiUb1DMStIw7w7FjhreUt2Q1w&s" },
    { name: "Chef Dele", spec: "Seafood Specialties", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf3hDFr4bsi2K6J8oktRJNeBBAjNZtpz1Zxg&s" },
    { name: "Chef Bayo", spec: "Plant-based Delights", img: "https://static01.nyt.com/images/2024/01/07/nyregion/07routine-nigerian-chef-02/07routine-nigerian-chef-02-superJumbo-v2.jpg" }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-0 md:p-8">
      <div className="flex flex-col h-screen md:h-[844px] w-full max-w-md bg-card shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-none md:rounded-[40px] relative overflow-hidden border border-border">
        
        <div className="flex-1 overflow-y-auto">
          
          <header className="sticky top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between bg-card/80 backdrop-blur-xl border-b border-border transition-all duration-300">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <img src={LOGO_URL} alt="Platera" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
              <h1 className="text-xl font-black text-foreground tracking-tighter">Platera</h1>
            </motion.div>
            
            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/auth')}
              className="px-5 py-2 bg-muted hover:bg-muted/80 rounded-lg text-[10px] font-normal tracking-wide text-foreground border border-border shadow-xl active:scale-95 transition-all font-poppins"
            >
              Sign in
            </motion.button>
          </header>

          {/* HERO */}
          <section className="relative min-h-[700px] flex flex-col justify-end p-8 pb-16 -mt-20">
            <div className="absolute inset-0">
              <img src={foodImg} className="w-full h-full object-cover opacity-60" alt="Premium Food" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full border border-primary/30">
                <Star size={10} className="text-primary fill-primary" />
                <span className="text-[9px] font-normal text-primary tracking-wide font-poppins">Voted #1 meal planner 2026</span>
              </div>
              <h2 className="text-6xl font-black text-foreground leading-[0.85] tracking-tighter font-sans">
                Dining,<br/>Evolved.
              </h2>
              <p className="text-muted-foreground text-lg font-normal leading-relaxed max-w-[280px] font-poppins">
                World-class chefs. Tailored nutrition. Delivered fresh to your door.
              </p>
              <div className="pt-4 flex flex-col gap-4">
                <CTAButton text="Begin your journey" onClick={goStart} />
                <button className="flex items-center justify-center gap-2 py-4 text-[11px] font-normal tracking-wide text-muted-foreground hover:text-foreground transition-all font-poppins">
                  <Play size={12} fill="currentColor" /> Watch how it works
                </button>
              </div>
            </motion.div>
          </section>

          {/* VALUE PROPS */}
          <section className="p-8 space-y-12">
            <motion.div {...fadeInUp} className="text-center space-y-2">
              <h3 className="text-[10px] font-normal text-primary tracking-widest font-poppins uppercase">The experience</h3>
              <h4 className="text-3xl font-black text-foreground tracking-tighter leading-tight font-sans">Elevated from the first bite.</h4>
            </motion.div>

            <motion.div variants={stagger} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="grid grid-cols-1 gap-4">
              {[
                { icon: <ChefHat className="text-primary" />, title: "Master chefs", desc: "Our culinary experts from 5-star backgrounds design every meal." },
                { icon: <ShieldCheck className="text-primary" />, title: "Bio-matched", desc: "Meals calculated to hit your specific macro and health goals." },
                { icon: <Zap className="text-primary" />, title: "Zero prep", desc: "No chopping. No cooking. Just heat and indulge in minutes." }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp} className="bg-muted/30 p-6 rounded-xl border border-border flex gap-5 items-start">
                  <div className="p-4 bg-secondary rounded-lg shadow-xl">{item.icon}</div>
                  <div className="space-y-1">
                    <h5 className="font-black text-foreground text-lg tracking-tight font-sans">{item.title}</h5>
                    <p className="text-muted-foreground text-xs font-normal leading-relaxed font-poppins">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* CHEF SHOWCASE */}
          <section className="bg-secondary/50 border-y border-border py-12 space-y-8">
            <div className="px-8 space-y-2">
              <h3 className="text-3xl font-black text-foreground tracking-tighter font-sans">Chef-led kitchens.</h3>
              <p className="text-muted-foreground text-sm font-poppins">Authentic flavors from Nigeria's top culinary talent.</p>
            </div>
            <div className="flex gap-4 overflow-x-auto px-8 pb-4">
              {chefs.map((chef, i) => (
                <div key={i} className="min-w-[180px] bg-muted/30 rounded-xl overflow-hidden border border-border shrink-0 group">
                  <div className="h-40 relative">
                    <img src={chef.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={chef.name} />
                  </div>
                  <div className="p-4">
                    <h5 className="font-normal text-foreground text-sm font-sans">{chef.name}</h5>
                    <p className="text-[9px] font-normal text-primary tracking-widest font-poppins">{chef.spec}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SOCIAL PROOF */}
          <section className="p-8 space-y-8">
            <div className="bg-primary rounded-2xl p-8 text-primary-foreground relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <h4 className="text-4xl font-black leading-none tracking-tighter font-sans">Loved by 10k+ foodies.</h4>
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-primary" alt="Avatar" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-primary bg-primary-foreground/20 backdrop-blur-md flex items-center justify-center text-[10px] font-black font-poppins">+10k</div>
                </div>
                <p className="text-primary-foreground/80 text-sm font-normal font-poppins">"Finally, a healthy meal service that doesn't compromise on the real Naija taste. Absolute game changer."</p>
                <p className="text-xs font-normal tracking-widest font-poppins">— Amadi K.</p>
              </div>
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="p-8 pb-32 text-center space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-foreground tracking-tighter font-sans">Ready for better?</h3>
              <p className="text-muted-foreground text-sm font-normal px-8 font-poppins">No long-term contracts. Pause or cancel your plan at any time.</p>
            </div>
            <div className="space-y-4 max-w-[280px] mx-auto">
              {["Eco-friendly packaging", "Real-time tracking", "Custom portions"].map(feat => (
                <div key={feat} className="flex items-center gap-3 justify-center text-[10px] font-normal text-muted-foreground tracking-widest font-poppins">
                  <CheckCircle2 size={14} className="text-primary" />
                  {feat}
                </div>
              ))}
            </div>
            <CTAButton text="Start your plan" onClick={goStart} />
            <div className="pt-12 border-t border-border opacity-30 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={LOGO_URL} alt="P" className="w-8 h-8 object-contain" />
                <span className="text-[10px] font-normal tracking-widest text-muted-foreground font-poppins uppercase">Platera culinary group</span>
              </div>
              <p className="text-[8px] font-normal text-muted-foreground tracking-tighter font-poppins">© 2024 Platera. All rights reserved.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
