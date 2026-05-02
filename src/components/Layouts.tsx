import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Search, Home, CalendarDays, Package, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';

/**
 * Responsive site shell for Platera.
 * Desktop: sticky pill nav + content + footer.
 * Mobile: same nav collapsed + bottom dock.
 * No phone mockup frame.
 */

const navLinks = {
  eater: [
    { to: '/home', label: 'Home' },
    { to: '/meals', label: 'Discover' },
    { to: '/planner', label: 'Planner' },
    { to: '/orders', label: 'Orders' },
    { to: '/pricing', label: 'Plans' },
  ],
  chef: [
    { to: '/chef', label: 'Dashboard' },
    { to: '/orders', label: 'Customer Orders' },
  ],
  restaurant: [
    { to: '/restaurant', label: 'Dashboard' },
    { to: '/orders', label: 'Store Orders' },
  ],
  delivery: [
    { to: '/delivery', label: 'Active Jobs' },
    { to: '/orders', label: 'History' },
  ]
};

export const SiteHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useUser();
  const role = (profile?.role as keyof typeof navLinks) || 'eater';

  const isActive = (to: string) =>
    to === '/home' || to === '/chef' || to === '/restaurant' || to === '/delivery' 
      ? location.pathname === to 
      : location.pathname.startsWith(to);
  
  const isLanding = location.pathname === '/';
  const isSignedIn = !!profile;
  const currentNav = navLinks[role] || navLinks.eater;

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-7xl px-4">
      <div className="bg-card border-[3px] border-ink rounded-full px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-stk">
        <div className="flex items-center gap-2 sm:gap-8">
          <button
            onClick={() => navigate(isSignedIn ? '/home' : '/')}
            className="flex items-center gap-2 text-2xl tracking-tighter text-tomato pl-2"
          >
            <img 
              src="https://drive.google.com/thumbnail?id=19gaJsJHKStb_0MvwcmSCaCdt6EUeb-K5&sz=w200" 
              alt="Logo" 
              className="h-8 w-auto object-contain"
            />
            <div className="flex items-center">
              <span className="font-light">Naija</span><span className="font-black">Eats</span>
            </div>
          </button>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold tracking-wide">
            {currentNav.map((l) => (
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
          {isLanding ? (
            <button
              onClick={() => navigate('/auth')}
              className="bg-tomato text-white border-2 border-ink px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm tracking-wide hover:-translate-y-0.5 transition-transform active:translate-y-0"
            >
              Sign in
            </button>
          ) : (
            <>
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
                aria-label="Profile"
                className="size-10 rounded-full border-2 border-ink bg-mustard overflow-hidden hover:scale-105 transition-transform active:scale-95 flex items-center justify-center shadow-stk-sm"
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <User size={16} strokeWidth={2.5} />
                )}
              </button>
            </>
          )}
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
          <div className="flex items-center gap-2 text-3xl tracking-tighter text-tomato mb-4">
            <img 
              src="https://drive.google.com/thumbnail?id=19gaJsJHKStb_0MvwcmSCaCdt6EUeb-K5&sz=w200" 
              alt="Logo" 
              className="h-10 w-auto object-contain"
            />
            <div className="flex items-center">
              <span className="font-light">Naija</span><span className="font-black">Eats</span>
            </div>
          </div>
          <p className="text-cream/70 max-w-sm font-medium">
            Connecting hungry neighbors with talented chefs through high-quality, local food experiences.
          </p>
        </div>
        <div>
          <h5 className="font-bold text-xs tracking-wider text-mustard mb-5">Community</h5>
          <ul className="space-y-3 font-medium text-cream/80 text-sm">
            <li><a onClick={(e) => { e.preventDefault(); alert('Chef onboarding coming soon'); }} href="#" className="hover:text-white">Join as chef</a></li>
            <li><a onClick={(e) => { e.preventDefault(); alert('Food quality guidelines'); }} href="#" className="hover:text-white">Food quality</a></li>
            <li><a onClick={(e) => { e.preventDefault(); alert('Neighborhood tips loaded'); }} href="#" className="hover:text-white">Neighborhood tips</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold text-xs tracking-wider text-sage mb-5">Support</h5>
          <ul className="space-y-3 font-medium text-cream/80 text-sm">
            <li><a onClick={(e) => { e.preventDefault(); alert('Help center opened'); }} href="#" className="hover:text-white">Help center</a></li>
            <li><a onClick={(e) => { e.preventDefault(); alert('Report issue dialog'); }} href="#" className="hover:text-white">Order issues</a></li>
            <li><a onClick={(e) => { e.preventDefault(); alert('Safety protocols'); }} href="#" className="hover:text-white">Safety</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-cream/40 text-xs font-medium">© 2024 Naija Eats Social Club. Built with hunger.</p>
        <div className="flex gap-6 text-cream/40 text-xs font-bold tracking-wider">
          <a onClick={(e) => { e.preventDefault(); window.open('https://instagram.com', '_blank'); }} href="#" className="hover:text-white">Instagram</a>
          <a onClick={(e) => { e.preventDefault(); window.open('https://twitter.com', '_blank'); }} href="#" className="hover:text-white">Twitter</a>
          <a onClick={(e) => { e.preventDefault(); window.open('https://threads.net', '_blank'); }} href="#" className="hover:text-white">Threads</a>
        </div>
      </div>
    </div>
  </footer>
);

export const MobileBottomDock: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useUser();
  const role = profile?.role || 'eater';

  const items = role === 'eater' ? [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/meals', label: 'Browse', icon: Search },
    { to: '/planner', label: 'Plan', icon: CalendarDays },
    { to: '/orders', label: 'Orders', icon: Package },
    { to: '/account', label: 'You', icon: User },
  ] : role === 'chef' ? [
    { to: '/chef', label: 'Home', icon: Home },
    { to: '/orders', label: 'Orders', icon: Package },
    { to: '/account', label: 'You', icon: User },
  ] : role === 'restaurant' ? [
    { to: '/restaurant', label: 'Home', icon: Home },
    { to: '/orders', label: 'Orders', icon: Package },
    { to: '/account', label: 'You', icon: User },
  ] : [
    { to: '/delivery', label: 'Jobs', icon: Bike },
    { to: '/orders', label: 'History', icon: Package },
    { to: '/account', label: 'You', icon: User },
  ];

  const isActive = (to: string) =>
    to === '/home' || to === '/chef' || to === '/restaurant' || to === '/delivery' 
      ? location.pathname === to 
      : location.pathname.startsWith(to);

  const [expanded, setExpanded] = React.useState<string | null>(null);

  // Auto-expand the active route's icon
  React.useEffect(() => {
    const active = items.find((i) => isActive(i.to));
    setExpanded(active?.to ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleClick = (to: string) => {
    setExpanded(to);
    if (location.pathname !== to) {
      navigate(to);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md">
      <div className="bg-card border-[3px] border-ink rounded-2xl px-2 py-2 shadow-stk flex items-center justify-center gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isExpanded = expanded === item.to;
          return (
            <button
              key={item.to}
              onClick={() => handleClick(item.to)}
              className={cn(
                'flex items-center justify-center gap-1.5 h-11 rounded-xl transition-all duration-300 ease-out border-2 shrink-0',
                isExpanded
                  ? 'bg-mustard text-ink border-ink px-3'
                  : 'text-ink border-transparent hover:bg-mustard/30 w-11'
              )}
              aria-label={item.label}
            >
              <Icon size={18} strokeWidth={2.5} className="shrink-0" />
              {isExpanded && (
                <span className="text-xs font-extrabold tracking-wide whitespace-nowrap">
                  {item.label}
                </span>
              )}
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
