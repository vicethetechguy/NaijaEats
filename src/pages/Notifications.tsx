import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { Truck, Gift, Clock, Bell, Settings, CheckCheck, Inbox, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'delivery' | 'offers'>('all');

  const notifs = [
    { id: 1, title: "Out for Delivery!", desc: "Your Tuesday box is only 2 miles away. Prepare your fridge!", icon: <Truck size={18} />, category: 'delivery', time: "10m ago", unread: true, color: "bg-sage", path: "/delivery/current" },
    { id: 2, title: "Invite a Friend", desc: "Get $20 credit when you share Naija Eats with a gym buddy.", icon: <Gift size={18} />, category: 'offers', time: "2h ago", unread: true, color: "bg-mustard", path: "/referral" },
    { id: 3, title: "New Menu Alert!", desc: "Check out our winter harvest specials. Limited time only!", icon: <Zap size={18} />, category: 'offers', time: "1d ago", unread: false, color: "bg-tomato", path: "/meals" },
    { id: 4, title: "Quality Guarantee", desc: "How was your last meal? We'd love your feedback!", icon: <Heart size={18} />, category: 'all', time: "2d ago", unread: false, color: "bg-white", path: "/account" },
  ];

  const filteredNotifs = notifs.filter(n => 
    activeFilter === 'all' || n.category === activeFilter
  );

  return (
    <DetailLayout onBack={() => navigate(-1)} title="Activity Center">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-2">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-ink/60 flex items-center gap-2">
              <Inbox size={14} />
              You have {notifs.filter(n => n.unread).length} unread updates
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-white border-2 border-ink rounded-xl hover:bg-cream transition-colors shadow-stk-sm active:translate-y-0.5 active:shadow-none">
              <CheckCheck size={18} className="text-ink" />
            </button>
            <button className="p-2.5 bg-white border-2 border-ink rounded-xl hover:bg-cream transition-colors shadow-stk-sm active:translate-y-0.5 active:shadow-none">
              <Settings size={18} className="text-ink" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
          {(['all', 'delivery', 'offers'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all shrink-0",
                activeFilter === filter 
                  ? "bg-ink text-white border-ink shadow-stk-sm" 
                  : "bg-white text-ink border-ink hover:bg-cream"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => navigate(n.path)}
                    className={cn(
                      "w-full flex items-start text-left gap-5 p-5 rounded-[32px] border-[3px] border-ink transition-all group relative",
                      n.unread ? "bg-white shadow-stk" : "bg-ink/5 border-ink/20 opacity-80"
                    )}
                  >
                    {n.unread && (
                      <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-tomato rounded-full border-2 border-ink animate-pulse" />
                    )}
                    
                    <div className={cn(
                      "p-4 rounded-2xl border-2 border-ink group-hover:rotate-6 transition-transform shadow-stk-sm shrink-0",
                      n.color
                    )}>
                      {React.cloneElement(n.icon as React.ReactElement, { strokeWidth: 3 })}
                    </div>

                    <div className="flex-1 space-y-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between">
                        <h5 className={cn(
                          "font-black tracking-tight leading-tight truncate",
                          n.unread ? "text-ink text-base" : "text-ink/60 text-sm"
                        )}>
                          {n.title}
                        </h5>
                      </div>
                      <p className={cn(
                        "text-xs leading-relaxed font-medium line-clamp-2",
                        n.unread ? "text-ink/70" : "text-ink/40"
                      )}>
                        {n.desc}
                      </p>
                      <div className="pt-2 flex items-center gap-3">
                        <span className="text-[9px] font-black text-ink/40 flex items-center gap-1.5 uppercase tracking-widest">
                          <Clock size={10} strokeWidth={3} /> {n.time}
                        </span>
                        {n.category !== 'all' && (
                          <span className="text-[8px] font-black px-2 py-0.5 bg-ink/10 rounded-md uppercase tracking-tighter">
                            {n.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-ink/5 border-2 border-ink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell size={24} className="text-ink/20" />
                </div>
                <h3 className="font-black text-ink/40 uppercase tracking-widest">No notifications</h3>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DetailLayout>
  );
};

export default Notifications;
