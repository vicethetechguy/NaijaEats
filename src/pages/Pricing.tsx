import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { CTAButton } from '@/components/UI';
import { Check, ShieldCheck, Zap, Heart, Sparkles, Crown, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Standard",
      price: "12.99",
      desc: "Perfect for casual eaters looking for quality.",
      features: ["5 Meals / week", "Standard Delivery", "24/7 Support", "Recyclable Packaging"],
      cta: "Current Plan",
      tag: null,
      theme: 'carbon',
      icon: <Package className="opacity-10 absolute -right-4 -top-4 w-32 h-32 rotate-12" />
    },
    {
      name: "Premium",
      price: "18.50",
      desc: "Our most popular choice for food enthusiasts.",
      features: ["Unlimited Meals", "Priority Delivery", "Nutritionist Advice", "Compostable Tubs", "Custom Portions"],
      cta: "Upgrade to Premium",
      tag: "Popular",
      theme: 'amber',
      icon: <Sparkles className="opacity-10 absolute -right-4 -top-4 w-32 h-32 rotate-12" />
    },
    {
      name: "Family Max",
      price: "29.99",
      desc: "Ultimate convenience for the whole household.",
      features: ["Family Portions", "Concierge Support", "Menu Planning", "Weekend Kit", "Guest Boxes"],
      cta: "Go Family Max",
      tag: "Best Value",
      theme: 'royal',
      icon: <Crown className="opacity-10 absolute -right-4 -top-4 w-32 h-32 rotate-12" />
    }
  ];

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'amber':
        return { card: "bg-card border-primary/30", accent: "text-primary", tag: "bg-primary/20 text-primary border-primary/20", check: "bg-primary/20 text-primary", glow: "bg-primary/10", gradient: "from-primary/20 via-transparent to-transparent" };
      case 'royal':
        return { card: "bg-card border-border", accent: "text-foreground", tag: "bg-muted text-muted-foreground border-border", check: "bg-muted text-foreground", glow: "bg-foreground/5", gradient: "from-muted/40 via-transparent to-transparent" };
      default:
        return { card: "bg-muted/30 border-border", accent: "text-foreground", tag: "bg-muted text-muted-foreground border-border", check: "bg-muted text-muted-foreground", glow: "bg-muted/40", gradient: "from-muted/30 via-transparent to-transparent" };
    }
  };

  const handleSelect = (tier: typeof tiers[0]) => {
    if (tier.cta === "Current Plan") return;
    toast.success(`Switched to ${tier.name} plan!`);
    setTimeout(() => navigate('/account'), 800);
  };

  return (
    <DetailLayout onBack={() => navigate(-1)} title="Platera Premium">
      <div className="p-8 space-y-8 pb-24 flex flex-col">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-foreground leading-tight tracking-tight">Elevate your eating.</h2>
          <p className="text-muted-foreground text-sm font-medium">Choose a plan that fits your life.</p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-8 px-8 items-start">
          {tiers.map((tier) => {
            const styles = getThemeStyles(tier.theme);
            return (
              <div key={tier.name} className={cn("snap-center min-w-[82%] md:min-w-[300px] p-7 rounded-[40px] border flex flex-col transition-all relative overflow-hidden shrink-0 shadow-2xl", styles.card)}>
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none", styles.gradient)} />
                <div className={cn("absolute -right-6 -top-6 w-40 h-40 rounded-full blur-[70px] pointer-events-none opacity-30", styles.glow)} />

                <div className={cn("relative z-10", styles.accent)}>{tier.icon}</div>

                <div className="space-y-1 relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className={cn("text-lg font-black tracking-tight", styles.accent)}>{tier.name}</h3>
                    {tier.tag && (
                      <span className={cn("text-[7px] font-black px-2 py-1 rounded-md uppercase tracking-widest border", styles.tag)}>{tier.tag}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-[11px] font-medium leading-tight h-6 line-clamp-2">{tier.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 relative z-10 mt-4 mb-4">
                  <span className="text-3xl font-black text-foreground tracking-tighter">${tier.price}</span>
                  <span className="text-muted-foreground text-[8px] font-black uppercase tracking-widest">/ plate</span>
                </div>

                <div className="space-y-2.5 relative z-10">
                  {tier.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <div className={cn("p-1 rounded-md shrink-0", styles.check)}>
                        <Check size={9} strokeWidth={4} />
                      </div>
                      <span className="font-bold text-[11px] text-foreground/80 tracking-tight">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="relative z-10 pt-6">
                  <CTAButton
                    text={tier.cta}
                    style={tier.theme === 'amber' ? 'orange' : 'outlined'}
                    disabled={tier.cta === "Current Plan"}
                    onClick={() => handleSelect(tier)}
                    className="h-11 text-[11px]"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <section className="grid grid-cols-1 gap-3">
          {[
            { icon: <ShieldCheck className="text-primary" size={18} />, title: "Secure Pay", sub: "Encrypted checkout" },
            { icon: <Zap className="text-primary" size={18} />, title: "Skip Weeks", sub: "Maximum flexibility" },
            { icon: <Heart className="text-primary" size={18} />, title: "Money Back", sub: "Quality guaranteed" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-5 bg-muted/30 rounded-[28px] border border-border shadow-xl">
              <div className="p-2.5 bg-card rounded-xl">{item.icon}</div>
              <div>
                <h5 className="font-bold text-foreground text-xs tracking-tight">{item.title}</h5>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">{item.sub}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </DetailLayout>
  );
};

export default Pricing;
