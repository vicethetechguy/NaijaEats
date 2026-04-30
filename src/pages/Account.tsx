import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { useOnboarding } from '@/contexts/OnboardingContext';
import {
  Settings,
  History,
  Heart,
  Edit2,
  ShieldCheck,
  Gift,
  LogOut,
  Bell,
  CreditCard,
  MapPin,
  ChevronRight,
} from 'lucide-react';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { preferences } = useOnboarding();
  const [user, setUser] = useState({
    name: 'Eleanor Shellstrop',
    email: 'eleanor.s@goodplace.com',
    image: 'https://picsum.photos/seed/eleanor/400/400',
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('platera_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({
          name: parsed.name || 'Eleanor Shellstrop',
          email: parsed.email || 'eleanor.s@goodplace.com',
          image: parsed.image || 'https://picsum.photos/seed/eleanor/400/400',
        });
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
  }, []);

  const dietarySummary =
    preferences.dietTypes.length > 0
      ? preferences.dietTypes.join(', ')
      : 'Not set';

  const handleLogout = () => {
    localStorage.removeItem('platera_onboarded');
    localStorage.removeItem('platera_user');
    navigate('/');
  };

  const stats = [
    { label: 'Orders', value: '24' },
    { label: 'Saved', value: '12' },
    { label: 'Reviews', value: '8' },
  ];

  const accountItems = [
    { title: 'Edit Profile', subtitle: 'Name, email, photo', icon: Settings, path: '/account/edit' },
    { title: 'Dietary Preferences', subtitle: dietarySummary, icon: Heart, path: '/account/dietary' },
    { title: 'Delivery Addresses', subtitle: 'Manage locations', icon: MapPin, path: '/account/edit' },
    { title: 'Payment Methods', subtitle: 'Cards & wallets', icon: CreditCard, path: '/checkout' },
  ];

  const activityItems = [
    { title: 'Order History', subtitle: 'Track all deliveries', icon: History, path: '/orders' },
    { title: 'Notifications', subtitle: 'Alerts & updates', icon: Bell, path: '/notifications' },
    { title: 'Subscription', subtitle: 'Premium plan', icon: ShieldCheck, path: '/pricing' },
    { title: 'Refer a Friend', subtitle: 'Get $20 credit', icon: Gift, path: '/referral' },
  ];

  return (
    <MainLayout title="Profile">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Profile header */}
        <section className="bg-card border-[3px] border-ink rounded-[32px] shadow-stk p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-3xl overflow-hidden border-[3px] border-ink shadow-stk-sm">
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => navigate('/account/edit')}
                aria-label="Edit photo"
                className="absolute -bottom-2 -right-2 p-2.5 bg-tomato text-white border-[3px] border-ink rounded-full hover:-translate-y-0.5 transition-transform"
              >
                <Edit2 size={14} strokeWidth={3} />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">{user.name}</h1>
              <p className="text-ink/60 font-medium mt-1">{user.email}</p>
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="bg-mustard border-2 border-ink text-ink text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                  Platinum
                </span>
                <span className="bg-sage/20 border-2 border-ink text-ink text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                  Verified
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/account/edit')}
              className="hidden sm:inline-flex bg-ink text-cream border-[3px] border-ink px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wide hover:bg-tomato transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t-2 border-dashed border-ink/20">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-black tracking-tighter text-tomato">{s.value}</p>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ink/60 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Account section */}
        <section>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-ink/60 mb-4 px-1">
            Account
          </h2>
          <div className="bg-card border-[3px] border-ink rounded-[24px] shadow-stk-sm overflow-hidden divide-y-2 divide-ink/10">
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-4 p-5 hover:bg-mustard/20 transition-colors text-left"
                >
                  <div className="p-3 bg-cream border-2 border-ink rounded-2xl">
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-base">{item.title}</p>
                    <p className="text-sm font-medium text-ink/60 truncate">{item.subtitle}</p>
                  </div>
                  <ChevronRight size={18} strokeWidth={2.5} className="text-ink/40 shrink-0" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Activity section */}
        <section>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-ink/60 mb-4 px-1">
            Activity
          </h2>
          <div className="bg-card border-[3px] border-ink rounded-[24px] shadow-stk-sm overflow-hidden divide-y-2 divide-ink/10">
            {activityItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-4 p-5 hover:bg-mustard/20 transition-colors text-left"
                >
                  <div className="p-3 bg-cream border-2 border-ink rounded-2xl">
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-base">{item.title}</p>
                    <p className="text-sm font-medium text-ink/60 truncate">{item.subtitle}</p>
                  </div>
                  <ChevronRight size={18} strokeWidth={2.5} className="text-ink/40 shrink-0" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Subscription card */}
        <section className="bg-tomato text-white border-[3px] border-ink rounded-[28px] shadow-stk p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest opacity-80 mb-1">
              Family Fresh • Active
            </p>
            <p className="text-3xl sm:text-4xl font-black tracking-tighter">
              $128.50
              <span className="text-base font-semibold opacity-80"> /mo</span>
            </p>
            <p className="text-sm font-medium opacity-90 mt-1">Renews on Nov 12, 2025</p>
          </div>
          <button
            onClick={() => navigate('/pricing')}
            className="bg-cream text-ink border-[3px] border-ink px-6 py-3 rounded-full font-extrabold text-sm uppercase tracking-wide hover:-translate-y-0.5 transition-transform shadow-stk-sm"
          >
            Manage Plan
          </button>
        </section>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-5 bg-card border-[3px] border-ink rounded-[24px] text-tomato hover:bg-tomato hover:text-white transition-colors font-extrabold text-sm uppercase tracking-widest shadow-stk-sm"
        >
          <LogOut size={18} strokeWidth={2.5} />
          Sign Out
        </button>
      </div>
    </MainLayout>
  );
};

export default Account;
