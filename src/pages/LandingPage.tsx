import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, ShieldCheck, Zap, MapPin, Star, ArrowRight } from 'lucide-react';
import { SiteFooter, MobileBottomDock } from '@/components/Layouts';
import { Badge, StickerCard } from '@/components/UI';

const heroImg =
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop';

const trending = [
  {
    id: 'jollof',
    title: 'Smoky Party Jollof',
    chef: 'Chef Ezinne',
    miles: '1.2 mi',
    price: 18,
    badge: { text: 'Spicy', color: 'mustard' as const },
    image:
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'egusi',
    title: 'Lemon Zest Gnocchi',
    chef: 'Pasta Lab',
    miles: '0.8 mi',
    price: 22,
    badge: { text: 'Vegan', color: 'sage' as const },
    image:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'suya',
    title: 'Umami Smash Burger',
    chef: 'Big Mike',
    miles: '2.4 mi',
    price: 16,
    badge: { text: 'Top Rated', color: 'orange' as const },
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const goStart = () => navigate('/auth');

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* HERO */}
      <header className="pt-16 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-block bg-mustard border-2 border-ink px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide mb-6 -rotate-2 shadow-stk-sm">
              ⭐ New in your neighborhood
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
              The neighborhood
              <br />
              <span className="text-tomato underline decoration-[6px] decoration-ink underline-offset-[10px]">
                on your plate.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-ink/70 max-w-xl mb-8 font-medium">
              Book chef-prepped meals from real cooks in your zip code — fresh, fast, and made with
              love. Lunch, dinner, or weekly plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 bg-card border-[3px] border-ink rounded-2xl p-4 shadow-stk-sm flex items-center gap-3">
                <MapPin size={20} className="text-tomato" />
                <input
                  type="text"
                  placeholder="Enter your zip code"
                  className="w-full font-semibold outline-none bg-transparent placeholder:text-ink/40"
                />
              </div>
              <button
                onClick={goStart}
                className="bg-sage text-white border-[3px] border-ink px-8 py-4 rounded-2xl font-extrabold uppercase shadow-stk hover:translate-x-1 hover:translate-y-1 hover:shadow-stk-sm active:translate-x-1.5 active:translate-y-1.5 active:shadow-none transition-all"
              >
                Find Food
              </button>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm font-bold text-ink/60">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/40?img=${i + 10}`}
                    className="w-8 h-8 rounded-full border-2 border-ink"
                    alt=""
                  />
                ))}
              </div>
              <span>10k+ hungry neighbors served this month</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rotate-[3deg] border-[4px] border-ink rounded-[40px] overflow-hidden shadow-stk-lg bg-card">
              <img src={heroImg} alt="Fresh chef-prepped meal" className="w-full aspect-[4/5] object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-tomato text-white border-[3px] border-ink p-5 rounded-3xl -rotate-6 shadow-stk">
              <p className="font-black text-2xl leading-none">12 Chefs</p>
              <p className="font-semibold text-xs uppercase tracking-wide mt-1">Cooking today</p>
            </div>
            <div className="absolute -top-4 -right-4 bg-mustard text-ink border-[3px] border-ink p-4 rounded-2xl rotate-[8deg] shadow-stk-sm flex items-center gap-2">
              <Star size={16} fill="currentColor" />
              <span className="font-black text-sm">4.9 / 5</span>
            </div>
          </div>
        </div>
      </header>

      {/* TRENDING */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter">Trending Flavors</h2>
            <p className="text-ink/60 font-medium text-lg mt-2">Freshly prepped by neighborhood favorites</p>
          </div>
          <button
            onClick={() => navigate('/meals')}
            className="self-start sm:self-auto border-[3px] border-ink px-6 py-2 rounded-full font-bold uppercase text-sm hover:bg-ink hover:text-cream transition-colors shadow-stk-sm"
          >
            View All
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trending.map((meal, i) => (
            <StickerCard
              key={meal.id}
              onClick={() => navigate(`/meals/${meal.id}`)}
              className={`overflow-hidden ${i === 2 ? 'lg:translate-y-8' : ''}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b-[3px] border-ink">
                <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <Badge text={meal.badge.text} color={meal.badge.color} />
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2 gap-3">
                  <h3 className="text-2xl font-extrabold leading-tight">{meal.title}</h3>
                  <span className="font-black text-xl text-tomato shrink-0">${meal.price}</span>
                </div>
                <p className="text-ink/70 font-medium mb-5">
                  By {meal.chef} • {meal.miles} away
                </p>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full border-2 border-ink bg-sage flex items-center justify-center font-bold text-xs uppercase text-white">
                    {meal.chef[0]}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide">Order within 20 mins</span>
                </div>
              </div>
            </StickerCard>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-sage/15 border-y-[3px] border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">How we play</h2>
            <p className="text-xl font-medium text-ink/70">Simple, community-driven, deliciously easy.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { n: '01', color: 'bg-tomato text-white', rot: '-rotate-3', title: 'Pick a Chef', desc: 'Discover top-rated talent cooking in your neighborhood today.', icon: ChefHat },
              { n: '02', color: 'bg-mustard text-ink', rot: 'rotate-2', title: 'Secure Your Meal', desc: 'Portions are limited. Book your slot before the kitchen closes.', icon: ShieldCheck },
              { n: '03', color: 'bg-card text-ink', rot: '-rotate-1', title: 'Eat Locally', desc: 'Pickup or get it delivered fresh. Support your local food scene.', icon: Zap },
            ].map((s) => {
              const I = s.icon;
              return (
                <div key={s.n} className="text-center">
                  <div
                    className={`size-20 ${s.color} border-[3px] border-ink rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-stk ${s.rot}`}
                  >
                    {s.n}
                  </div>
                  <h4 className="text-2xl font-extrabold mb-2 flex items-center justify-center gap-2">
                    <I size={22} /> {s.title}
                  </h4>
                  <p className="font-medium text-ink/70 max-w-xs mx-auto">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-tomato border-[4px] border-ink rounded-[40px] shadow-stk-lg p-10 sm:p-16 text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none">
              Ready to eat better?
            </h3>
            <p className="text-lg sm:text-xl font-medium opacity-90">
              No contracts. Pause or cancel any time. Real chefs, real food, real fast.
            </p>
            <button
              onClick={goStart}
              className="inline-flex items-center gap-2 bg-card text-ink border-[3px] border-ink px-8 py-4 rounded-2xl font-extrabold uppercase tracking-wide shadow-stk hover:translate-x-1 hover:translate-y-1 hover:shadow-stk-sm transition-all"
            >
              Start your plan <ArrowRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
      <MobileBottomDock />
    </div>
  );
};

export default LandingPage;
