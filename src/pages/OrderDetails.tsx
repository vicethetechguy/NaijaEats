import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { MapPin, CheckCircle2, ChefHat, Info, Calendar, Receipt, CreditCard, ChevronRight } from 'lucide-react';
import { CTAButton } from '@/components/UI';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const OrderDetails: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const orderData = {
    id: orderId || "PLT-8821-YX",
    date: "Oct 24, 2023",
    status: "Delivered",
    deliveryAddress: "123 Health Ave, Lekki Phase 1, Lagos",
    subtotal: 62.99,
    deliveryFee: 5.00,
    total: 67.99,
    items: [
      { id: 'jollof', title: "Smoky Party Jollof", chef: "Chef Ezinne", price: 18.50, image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=400&auto=format&fit=crop" },
      { id: 'suya', title: "Beef Suya Platter", chef: "Chef Funmilayo", price: 22.00, image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=400&auto=format&fit=crop" },
      { id: 'moimoi', title: "Akara & Pap", chef: "Chef Amaka", price: 12.00, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop" },
    ],
    timeline: [
      { status: "Ordered", time: "10:30 AM", completed: true },
      { status: "Prepared", time: "11:45 AM", completed: true },
      { status: "Picked Up", time: "12:15 PM", completed: true },
      { status: "Delivered", time: "12:55 PM", completed: true }
    ]
  };

  return (
    <DetailLayout onBack={() => navigate('/orders')} title={`Order #${orderData.id}`}>
      <div className="max-w-4xl mx-auto space-y-10 pb-32">
        {/* Status Hero */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sage border-[3px] border-ink rounded-[40px] p-8 shadow-stk relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
              <span className="bg-white border-2 border-ink px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-ink shadow-stk-sm">
                Successfully {orderData.status}
              </span>
              <h2 className="text-4xl font-black text-ink tracking-tight">Enjoy your meal!</h2>
              <p className="text-ink/60 font-bold text-sm">Delivered to your doorstep on {orderData.date}.</p>
            </div>
            <div className="hidden sm:flex w-24 h-24 bg-white border-[3px] border-ink rounded-[32px] items-center justify-center text-ink shadow-stk rotate-3">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full" />
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            {/* Timeline */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <h4 className="text-[11px] font-black text-ink uppercase tracking-[0.2em]">Journey Timeline</h4>
                <div className="h-[2px] flex-1 bg-ink/10 rounded-full" />
              </div>
              
              <div className="bg-white border-[3px] border-ink rounded-[32px] p-8 shadow-stk space-y-8">
                {orderData.timeline.map((step, i) => (
                  <div key={i} className="flex items-start gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 border-ink flex items-center justify-center z-10 transition-colors",
                        step.completed ? "bg-tomato" : "bg-white"
                      )}>
                        {step.completed && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      {i !== orderData.timeline.length - 1 && (
                        <div className={cn(
                          "w-0.5 h-10 -my-1",
                          step.completed ? "bg-tomato" : "bg-ink/10"
                        )} />
                      )}
                    </div>
                    <div className="flex-1 -mt-1 pb-4 border-b border-ink/5 last:border-0 flex justify-between items-center">
                      <div>
                        <p className={cn(
                          "font-black text-base tracking-tight",
                          step.completed ? "text-ink" : "text-ink/30"
                        )}>{step.status}</p>
                        <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">{step.time}</p>
                      </div>
                      {step.completed && <CheckCircle2 size={16} className="text-tomato" strokeWidth={3} />}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Items */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <h4 className="text-[11px] font-black text-ink uppercase tracking-[0.2em]">Order Items</h4>
                <div className="h-[2px] flex-1 bg-ink/10 rounded-full" />
              </div>

              <div className="space-y-4">
                {orderData.items.map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate(`/meals/${item.id}`)} 
                    className="group cursor-pointer bg-white border-[3px] border-ink rounded-[32px] p-4 flex items-center gap-5 hover:bg-mustard/10 transition-all shadow-stk-sm hover:shadow-stk hover:-translate-y-1"
                  >
                    <div className="w-20 h-20 rounded-2xl border-2 border-ink overflow-hidden flex-shrink-0 group-hover:rotate-2 transition-transform">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h5 className="font-black text-ink text-base tracking-tight leading-tight">{item.title}</h5>
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-sage/20 border border-sage/30 rounded-md">
                          <ChefHat size={10} className="text-sage" />
                        </div>
                        <span className="text-[9px] font-black text-ink/50 uppercase tracking-widest">{item.chef}</span>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-ink text-white rounded-2xl font-black text-sm">
                      ${item.price.toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            {/* Delivery Details */}
            <section className="space-y-4">
              <h4 className="text-[11px] font-black text-ink uppercase tracking-[0.2em] px-2">Delivery</h4>
              <div className="bg-mustard border-[3px] border-ink rounded-[32px] p-6 shadow-stk space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border-2 border-ink rounded-xl flex items-center justify-center text-ink shrink-0">
                    <MapPin size={20} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-ink/60 uppercase tracking-widest">Address</p>
                    <p className="text-sm font-bold text-ink leading-tight">{orderData.deliveryAddress}</p>
                  </div>
                </div>
                <div className="h-[2px] bg-ink/10" />
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border-2 border-ink rounded-xl flex items-center justify-center text-ink shrink-0">
                    <Calendar size={20} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-ink/60 uppercase tracking-widest">Arrival</p>
                    <p className="text-sm font-bold text-ink leading-tight">Tuesday Box Arrival</p>
                    <p className="text-[10px] font-black text-ink/40 uppercase">Handed to receptionist</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="space-y-4">
              <h4 className="text-[11px] font-black text-ink uppercase tracking-[0.2em] px-2">Payment</h4>
              <div className="bg-white border-[3px] border-ink rounded-[40px] p-8 shadow-stk space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-ink/60">
                    <span>Subtotal</span>
                    <span className="text-ink">${orderData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-ink/60">
                    <span>Delivery Fee</span>
                    <span className="text-ink">${orderData.deliveryFee.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="h-[2px] border-t-2 border-dashed border-ink/20" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-ink uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-black text-tomato tracking-tighter">${orderData.total.toFixed(2)}</span>
                </div>

                <div className="pt-2">
                   <div className="bg-sage/10 border-2 border-sage/20 rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white border-2 border-ink rounded-xl flex items-center justify-center text-sage">
                        <CreditCard size={20} strokeWidth={2.5} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-ink/40 uppercase tracking-widest">Paid via Card</p>
                        <p className="text-xs font-bold text-ink truncate">Visa ending in •••• 4242</p>
                      </div>
                   </div>
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-4 pt-4">
              <CTAButton text="Reorder This Box" style="orange" onClick={() => navigate('/planner')} className="h-14 text-sm" />
              <button className="flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-ink/40 hover:text-tomato transition-all group">
                <Info size={14} className="group-hover:rotate-12 transition-transform" /> 
                Report an issue
              </button>
            </div>
          </aside>
        </div>
      </div>
    </DetailLayout>
  );
};

export default OrderDetails;
