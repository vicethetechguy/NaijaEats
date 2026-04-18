import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { Truck, Gift, Clock } from 'lucide-react';

const Notifications: React.FC = () => {
  const navigate = useNavigate();

  const notifs = [
    { id: 1, title: "Out for Delivery!", desc: "Your Tuesday box is only 2 miles away. Prepare your fridge!", icon: <Truck size={20} className="text-primary" />, time: "10m ago", path: "/delivery/current" },
    { id: 2, title: "Invite a Friend", desc: "Get $20 credit when you share Platera with a gym buddy.", icon: <Gift size={20} className="text-green-500" />, time: "2h ago", path: "/referral" },
  ];

  return (
    <DetailLayout onBack={() => navigate(-1)} title="Activity Center">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-4 px-2">
          <p className="text-muted-foreground font-medium text-sm">2 unread updates.</p>
          <button className="text-[10px] font-black text-primary uppercase tracking-widest">Clear All</button>
        </div>
        <div className="space-y-4">
          {notifs.map((n) => (
            <button key={n.id} onClick={() => navigate(n.path)} className="w-full flex items-start text-left gap-5 p-6 bg-muted/30 border border-border rounded-[32px] hover:bg-muted/50 transition-all group">
              <div className="p-4 bg-secondary rounded-2xl group-hover:scale-110 transition-transform">{n.icon}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-foreground tracking-tight leading-tight">{n.title}</h5>
                  <span className="text-[8px] font-black text-muted-foreground flex items-center gap-1 uppercase tracking-widest">
                    <Clock size={10} /> {n.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">{n.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </DetailLayout>
  );
};

export default Notifications;
