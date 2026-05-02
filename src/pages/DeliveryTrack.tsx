import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Navigation, Target, Clock, Star, UtensilsCrossed } from 'lucide-react';

const TacticalMap = () => {
  const pathData = "M 50 350 Q 150 300 180 200 T 350 100";
  
  return (
    <div className="w-full h-full relative bg-card overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <svg className="w-full h-full" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(24 95% 53%)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(24 95% 53%)" stopOpacity="1" />
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect x="20" y="40" width="60" height="80" rx="4" className="fill-secondary" />
        <rect x="100" y="20" width="40" height="40" rx="4" className="fill-secondary" />
        <rect x="250" y="50" width="80" height="120" rx="4" className="fill-secondary" />
        <rect x="40" y="250" width="100" height="40" rx="4" className="fill-secondary" />
        <rect x="280" y="280" width="60" height="60" rx="4" className="fill-secondary" />
        <motion.path d={pathData} fill="transparent" stroke="url(#pathGradient)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeOut" }} style={{ filter: "url(#glow)" }} />
        <g transform="translate(350, 100)">
          <circle r="12" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.2" className="text-foreground" />
          <motion.circle r="6" className="fill-foreground" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </g>
        <g transform="translate(50, 350)">
          <rect x="-10" y="-10" width="20" height="20" rx="4" className="fill-secondary stroke-border" />
        </g>
        <motion.g initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "65%" }} transition={{ duration: 2.5, ease: "easeInOut" }} style={{ offsetPath: `path('${pathData}')` }}>
          <motion.circle r="24" className="fill-primary" fillOpacity="0.2" animate={{ scale: [1, 1.8], opacity: [0.4, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.circle r="16" className="fill-primary" fillOpacity="0.4" animate={{ scale: [1, 1.5], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
          <circle r="8" className="fill-primary stroke-foreground" strokeWidth="2" />
        </motion.g>
      </svg>
    </div>
  );
};

const DeliveryTrack: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DetailLayout onBack={() => navigate('/home')} title="Live Tracking">
      <div className="flex flex-col h-full overflow-hidden bg-background">
        <div className="flex-1 relative bg-card overflow-hidden">
          <TacticalMap />
          <div className="absolute right-6 top-6 flex flex-col gap-3 z-40">
            <div className="flex flex-col bg-secondary/90 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
              <button onClick={() => alert('Recentering map...')} className="p-4 text-muted-foreground hover:text-foreground transition-colors border-b border-border active:bg-muted">
                <Target size={20} />
              </button>
            </div>
          </div>
          <div className="absolute top-6 left-6 right-20 z-40">
            <div className="bg-secondary/90 backdrop-blur-xl border border-border h-14 rounded-2xl px-5 flex items-center gap-3 shadow-2xl">
              <Navigation size={18} className="text-primary animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-foreground">En route to Lekki Phase 1</span>
            </div>
          </div>
        </div>

        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-card rounded-t-[48px] p-8 space-y-8 shadow-[0_-20px_100px_rgba(0,0,0,0.9)] relative z-50 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Courier is near</span>
              </div>
              <h2 className="text-3xl font-black text-foreground tracking-tight leading-none">Musa's on the way</h2>
              <p className="text-muted-foreground font-bold text-sm">Estimated arrival <span className="text-primary">~6 minutes</span></p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 rounded-[24px] overflow-hidden border-2 border-primary shadow-xl">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Driver" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-primary-foreground p-1 rounded-lg border-2 border-card">
                <Star size={10} fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => alert('Calling driver...')} className="flex-[2] py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95">
              <Phone size={18} /> Call Musa
            </button>
            <button onClick={() => alert('Messaging driver...')} className="flex-1 py-4 bg-muted text-foreground border border-border rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-muted/80 transition-all active:scale-95">
              <MessageCircle size={18} />
            </button>
          </div>

          <div className="p-6 bg-muted/30 rounded-[32px] border border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-inner">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Next Stop</p>
                <p className="text-foreground font-black text-base">You are next!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Stops left</p>
              <p className="text-primary font-black text-xl">1</p>
            </div>
          </div>
        </motion.div>
      </div>
    </DetailLayout>
  );
};

export default DeliveryTrack;
