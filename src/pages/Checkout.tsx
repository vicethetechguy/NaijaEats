import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { CTAButton } from '@/components/UI';
import { useMeals, ScheduledMeal } from '@/contexts/MealContext';
import { CreditCard, Truck, ShieldCheck, ChefHat, MapPin, Trash2, Smartphone, Landmark, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { schedule, removeMealFromPlan } = useMeals();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState("123 Health Ave, SF");
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [cardDetails, setCardDetails] = useState({ name: "Apple Pay / VISA", last4: "4242" });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google' | 'transfer'>('card');

  useEffect(() => { if (schedule.length === 0) navigate('/planner'); }, [schedule, navigate]);

  const subtotal = schedule.reduce((acc, meal) => acc + (meal.price || 5500), 0);
  const deliveryFee = schedule.length > 0 ? 1500 : 0;
  const total = subtotal + deliveryFee;

  const mealsByChef: Record<string, ScheduledMeal[]> = schedule.reduce((acc, meal) => {
    const chef = meal.chefName || "Platera Kitchen";
    if (!acc[chef]) acc[chef] = [];
    acc[chef].push(meal);
    return acc;
  }, {} as Record<string, ScheduledMeal[]>);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to place an order");
        navigate('/auth');
        return;
      }

      // Create the order in Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert({
          eater_id: user.id,
          total_amount: total,
          delivery_fee: deliveryFee,
          delivery_address: address,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // In a real app, we'd also insert into order_items here
      
      toast.success("Order placed successfully!");
      navigate('/payment-success');
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentOptions = [
    { id: 'card', label: 'Card', icon: <CreditCard size={18} /> },
    { id: 'apple', label: 'Apple Pay', icon: <Smartphone size={18} /> },
    { id: 'google', label: 'Google Pay', icon: <Wallet size={18} /> },
    { id: 'transfer', label: 'Transfer', icon: <Landmark size={18} /> },
  ];

  return (
    <DetailLayout onBack={() => navigate(-1)} title="Checkout">
      <div className="p-8 space-y-10 pb-48">
        <header className="space-y-2">
          <h2 className="text-3xl font-black text-foreground tracking-tight">Review order</h2>
          <p className="text-muted-foreground text-sm font-medium">Curated from {Object.keys(mealsByChef).length} world-class chefs.</p>
        </header>

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-muted-foreground tracking-wider">Plan summary</h4>
            <span className="text-[10px] font-black text-primary tracking-wider">{schedule.length} Meals</span>
          </div>
          <div className="space-y-4">
            {Object.entries(mealsByChef).map(([chef, meals]) => (
              <div key={chef} className="bg-muted/30 border border-border rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 bg-muted/50 flex items-center gap-3 border-b border-border">
                  <ChefHat size={16} className="text-primary" />
                  <span className="text-xs font-black text-foreground">{chef}</span>
                </div>
                <div className="p-4 space-y-3">
                  {meals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <img src={meal.image} className="w-10 h-10 rounded-xl object-cover" alt="" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground leading-none truncate">{meal.title}</p>
                          <p className="text-[10px] text-muted-foreground font-bold mt-1">{meal.day} • {meal.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-sm font-black text-foreground">₦{(meal.price || 5500).toLocaleString()}</span>
                        <button onClick={() => removeMealFromPlan(meal.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-muted-foreground tracking-wider px-2">Delivery & payment</h4>
          <div className="bg-muted/30 border border-border rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary rounded-xl text-primary"><MapPin size={18} /></div>
              <div className="flex-1">
                {isEditingAddress ? (
                  <input type="text" autoFocus className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" value={address} onChange={(e) => setAddress(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingAddress(false)} />
                ) : (
                  <><p className="text-sm font-bold text-foreground">{address}</p><p className="text-[10px] text-muted-foreground font-bold">Estimated: Tue, Oct 24</p></>
                )}
              </div>
              <button onClick={() => setIsEditingAddress(!isEditingAddress)} className="text-[10px] font-black text-primary shrink-0">{isEditingAddress ? 'Save' : 'Change'}</button>
            </div>
            
            <div className="h-px bg-border" />
            
            <div className="space-y-4">
              <p className="text-[9px] font-black text-muted-foreground tracking-wider">Select method</p>
              <div className="grid grid-cols-4 gap-2">
                {paymentOptions.map((opt) => (
                  <button key={opt.id} onClick={() => setPaymentMethod(opt.id as any)} className={cn("flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all", paymentMethod === opt.id ? "bg-primary/10 border-primary text-primary" : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50")}>
                    {opt.icon}
                    <span className="text-[7px] font-black tracking-tighter whitespace-nowrap">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary rounded-xl text-primary">
                {paymentMethod === 'card' ? <CreditCard size={18} /> : paymentMethod === 'apple' ? <Smartphone size={18} /> : paymentMethod === 'google' ? <Wallet size={18} /> : <Landmark size={18} />}
              </div>
              <div className="flex-1">
                {isEditingCard ? (
                  <div className="space-y-2">
                    <input type="text" placeholder="Card Label" className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" value={cardDetails.name} onChange={(e) => setCardDetails(prev => ({...prev, name: e.target.value}))} />
                    <input type="text" placeholder="Last 4 Digits" className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" value={cardDetails.last4} onChange={(e) => setCardDetails(prev => ({...prev, last4: e.target.value.slice(0,4)}))} />
                  </div>
                ) : (
                  <><p className="text-sm font-bold text-foreground">{paymentMethod === 'card' ? `${cardDetails.name} •••• ${cardDetails.last4}` : paymentMethod === 'apple' ? "Apple Pay Primary" : paymentMethod === 'google' ? "Google Pay Wallet" : "Direct Bank Transfer"}</p><p className="text-[10px] text-muted-foreground font-bold">{paymentMethod === 'card' ? 'Default card' : 'Instant checkout'}</p></>
                )}
              </div>
              <button onClick={() => setIsEditingCard(!isEditingCard)} className="text-[10px] font-black text-primary shrink-0">{isEditingCard ? 'Done' : 'Edit'}</button>
            </div>
          </div>
        </section>

        <section className="p-8 bg-secondary rounded-2xl border border-border space-y-4 shadow-2xl mb-4">
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground"><span>Subtotal</span><span className="text-foreground font-bold">₦{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground"><span>Delivery fee</span><span className="text-foreground font-bold">₦{deliveryFee.toLocaleString()}</span></div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between items-center"><span className="text-lg font-black text-foreground">Total amount</span><span className="text-2xl font-black text-primary">₦{total.toLocaleString()}</span></div>
        </section>

        <div className="pb-8 px-4 text-center">
          <p className="text-[10px] text-muted-foreground font-medium max-w-[280px] mx-auto mb-6">
            By clicking place order you agree to Naija Eats' Terms of Service and Privacy Policy.
          </p>
          <CTAButton text={isProcessing ? "Processing..." : `Pay ₦${total.toLocaleString()}`} disabled={isProcessing || schedule.length === 0} onClick={handlePayment} />
          <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold tracking-widest">Secure 256-bit SSL payment</span>
          </div>
        </div>
      </div>
    </DetailLayout>
  );
};

export default Checkout;
