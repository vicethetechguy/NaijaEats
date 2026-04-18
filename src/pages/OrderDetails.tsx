import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { MapPin, CheckCircle2, ChefHat, Info, Calendar } from 'lucide-react';
import { CTAButton } from '@/components/UI';

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
      <div className="p-6 space-y-10 pb-32">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-foreground tracking-tight">Success!</h2>
              <p className="text-muted-foreground font-medium text-sm">Your order was {orderData.status.toLowerCase()} on {orderData.date}.</p>
            </div>
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20">
              <CheckCircle2 size={32} />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Journey Timeline</h4>
          <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {orderData.timeline.map((step, i) => (
              <div key={i} className="relative flex items-center justify-between">
                <div className="absolute -left-8 flex items-center justify-center w-6 h-6">
                  <div className={`w-2.5 h-2.5 rounded-full ${step.completed ? 'bg-primary shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-muted border border-border'}`} />
                </div>
                <span className={`text-sm font-bold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{step.status}</span>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{step.time}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Order Items</h4>
          <div className="space-y-3">
            {orderData.items.map((item) => (
              <div key={item.id} onClick={() => navigate(`/meals/${item.id}`)} className="group cursor-pointer bg-muted/30 border border-border rounded-2xl p-4 flex items-center gap-4 hover:bg-muted/50 transition-all">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <h5 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors leading-tight">{item.title}</h5>
                  <div className="flex items-center gap-2">
                    <ChefHat size={12} className="text-primary" />
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{item.chef}</span>
                  </div>
                </div>
                <span className="text-sm font-black text-foreground">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Delivery Details</h4>
          <div className="bg-muted/30 border border-border rounded-3xl p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary rounded-xl text-primary"><MapPin size={18} /></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold text-foreground">{orderData.deliveryAddress}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Lagos, Nigeria</p>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary rounded-xl text-primary"><Calendar size={18} /></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold text-foreground">Tuesday Box Arrival</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Handed to receptionist</p>
              </div>
            </div>
          </div>
        </section>

        <section className="p-8 bg-secondary rounded-[32px] border border-border space-y-4 shadow-2xl">
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground"><span>Subtotal</span><span className="text-foreground font-bold">${orderData.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground"><span>Delivery Fee</span><span className="text-foreground font-bold">${orderData.deliveryFee.toFixed(2)}</span></div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between items-center"><span className="text-lg font-black text-foreground">Order Total</span><span className="text-2xl font-black text-primary">${orderData.total.toFixed(2)}</span></div>
        </section>

        <div className="flex flex-col gap-4">
          <CTAButton text="Reorder This Box" style="orange" onClick={() => navigate('/planner')} />
          <button className="flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
            <Info size={14} /> Report an issue with this order
          </button>
        </div>
      </div>
    </DetailLayout>
  );
};

export default OrderDetails;
