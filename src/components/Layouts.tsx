import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Search, LayoutGrid, Home, UtensilsCrossed, CalendarDays, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Dock from '@/components/ui/dock';

const LOGO_URL = "https://drive.google.com/thumbnail?id=1jkLC0R1klmr8UOCJ2exnvjROu8VUjPWV&sz=w500";

export const MainLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveLabel = () => {
    if (location.pathname.startsWith('/home')) return 'Home';
    if (location.pathname.startsWith('/planner')) return 'Plan';
    if (location.pathname.startsWith('/search')) return 'Search';
    if (location.pathname.startsWith('/orders')) return 'Orders';
    if (location.pathname.startsWith('/account')) return 'Profile';
    return '';
  };

  const isHome = location.pathname === '/home';

  const dockItems = [
    { icon: Home, label: "Home", onClick: () => navigate('/home') },
    { icon: Search, label: "Search", onClick: () => navigate('/search') },
    { icon: CalendarDays, label: "Plan", onClick: () => navigate('/planner') },
    { icon: LayoutGrid, label: "Orders", onClick: () => navigate('/orders') },
    { icon: User, label: "Profile", onClick: () => navigate('/account') },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-0 md:p-8">
      <div className="flex w-full max-w-md h-screen md:h-[844px] bg-card text-foreground font-sans rounded-none md:rounded-[32px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden flex-col border border-border">
        
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/30 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[100px] rounded-full" />
        </div>

        <header className="h-20 bg-card/60 backdrop-blur-2xl border-b border-border sticky top-0 z-40 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/home')}>
            {isHome && (
              <img src={LOGO_URL} alt="Platera" className="w-11 h-11 object-contain" />
            )}
            <h2 className="text-xl font-black text-foreground tracking-tight">{title || "Platera"}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/notifications')} className="p-2.5 bg-muted rounded-xl text-muted-foreground relative active:scale-95 transition-all hover:text-foreground border border-border">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-card"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-4 bg-transparent relative z-10">
          {children}
        </main>

        <div className="shrink-0 z-50">
          <Dock items={dockItems} activeLabel={getActiveLabel()} />
        </div>
      </div>
    </div>
  );
};

export const DetailLayout: React.FC<{ children: React.ReactNode; onBack?: () => void; title?: string }> = ({ children, onBack, title }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-0 md:p-8">
      <div className="w-full max-w-md h-screen md:h-[844px] relative bg-card shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-none md:rounded-[32px] overflow-hidden flex flex-col border border-border">
        
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full" />
        </div>

        <header className="px-6 h-20 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-2xl sticky top-0 z-50 shrink-0">
          {onBack ? (
            <button 
              type="button"
              onClick={onBack}
              className="p-2.5 bg-muted backdrop-blur-md rounded-xl text-foreground border border-border hover:bg-primary transition-all active:scale-95 cursor-pointer z-[60]"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
          ) : (
            <div className="w-10 h-10" />
          )}
          <h3 className="font-black text-base text-foreground tracking-tight">{title}</h3>
          <div className="w-10 h-10" />
        </header>
        <main className="flex-1 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};
