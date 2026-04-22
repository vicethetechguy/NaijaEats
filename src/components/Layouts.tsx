import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Search, Home, CalendarDays, Package, User } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Responsive site shell for Platera.
 * Desktop: sticky pill nav + content + footer.
 * Mobile: same nav collapsed + bottom dock.
 * No phone mockup frame.
 */

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/meals', label: 'Discover' },
  { to: '/planner', label: 'Planner' },
  { to: '/orders', label: 'Orders' },
  { to: '/pricing', label: 'Plans' },
];

export const SiteHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (to: string) =>
    to === '/home' ? location.pathname === '/home' : location.pathname.startsWith(to);

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-7xl px-4">
      <div className="bg-card border-[3px] border-ink rounded-full px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-stk">
        <div className="flex items-center gap-2 sm:gap-8">
          <button
            onClick={() => navigate('/home')}
            className="text-2xl font-black tracking-tighter text-tomato pl-2"
          >
            PLATERA
          </button>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold uppercase tracking-wide">
            {navLinks.map((l) => (
              <button
                key={l.to}
                onClick={() => navigate(l.to)}
                className={cn(
                  'hover:text-tomato transition-colors',
                  isActive(l.to) ? 'text-tomato' : 'text-ink'
                )}
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
            className="relative p-2 rounded-full border-2 border-ink bg-cream hover:bg-mustard transition-colors"
          >
            <Bell size={16} strokeWidth={2.5} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-tomato rounded-full border border-ink" />
          </button>
          <button
            onClick={() => navigate('/account')}
            className="hidden sm:inline-flex font-bold text-sm uppercase tracking-wide hover:text-tomato"
          >
            Account
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-tomato text-white border-2 border-ink px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wide hover:-translate-y-0.5 transition-transform active:translate-y-0"
          >
            Order Now
          </button>
        </div>
      </div>
    </header>
  );
};

export const SiteFooter: React.FC = () => (
  <footer className="bg-ink text-cream mt-24 pt-16 pb-10 border-t-[3px] border-ink">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-14">
        <div className="col-span-2">
          <span className="text-3xl font-black tracking-tighter text-tomato block mb-4">PLATERA</span>
          <p className="text-cream/70 max-w-sm font-medium">
            Connecting hungry neighbors with talented chefs through high-quality, local food experiences.
          </p>
        </div>
        <div>
          <h5 className="font-bold uppercase text-xs tracking-widest text-mustard mb-5">Community</h5>
          <ul className="space-y-3 font-medium text-cream/80 text-sm">
            <li><a href="#" className="hover:text-white">Join as Chef</a></li>
            <li><a href="#" className="hover:text-white">Food Quality</a></li>
            <li><a href="#" className="hover:text-white">Neighborhood Tips</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold uppercase text-xs tracking-widest text-sage mb-5">Support</h5>
          <ul className="space-y-3 font-medium text-cream/80 text-sm">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Order Issues</a></li>
            <li><a href="#" className="hover:text-white">Safety</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-cream/40 text-xs font-medium">© 2024 Platera Social Club. Built with hunger.</p>
        <div className="flex gap-6 text-cream/40 text-xs font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-white">Instagram</a>
          <a href="#" className="hover:text-white">Twitter</a>
          <a href="#" className="hover:text-white">Threads</a>
        </div>
      </div>
    </div>
  </footer>
);

export const MobileBottomDock: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/meals', label: 'Browse', icon: Search },
    { to: '/planner', label: 'Plan', icon: CalendarDays },
    { to: '/orders', label: 'Orders', icon: Package },
    { to: '/account', label: 'You', icon: User },
  ];
  const isActive = (to: string) =>
    to === '/home' ? location.pathname === '/home' : location.pathname.startsWith(to);

  return (
    <div className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md">
      <div className="bg-card border-[3px] border-ink rounded-full px-2 py-2 shadow-stk flex items-center justify-between">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 rounded-full transition-all min-w-[52px]',
                active ? 'bg-tomato text-white' : 'text-ink hover:bg-mustard/40'
              )}
            >
              <Icon size={18} strokeWidth={2.5} />
              <span className="text-[9px] font-bold uppercase tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/** Standard responsive page wrapper (used by main app pages). */
export const MainLayout: React.FC<{
  children: React.ReactNode;
  title?: string;
  hideFooter?: boolean;
}> = ({ children, hideFooter }) => {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-32 lg:pb-16">{children}</main>
      {!hideFooter && <SiteFooter />}
      <MobileBottomDock />
    </div>
  );
};

/** Detail layout: same shell + back button row above content. */
export const DetailLayout: React.FC<{
  children: React.ReactNode;
  onBack?: () => void;
  title?: string;
}> = ({ children, onBack, title }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-32 lg:pb-16">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack ?? (() => navigate(-1))}
            className="p-2.5 bg-card border-2 border-ink rounded-full hover:bg-mustard transition-colors shadow-stk-sm"
            aria-label="Back"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          {title && (
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{title}</h1>
          )}
        </div>
        {children}
      </main>
      <SiteFooter />
      <MobileBottomDock />
    </div>
  );
};
