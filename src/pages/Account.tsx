import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layouts';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Settings, History, Heart, Edit2, ShieldCheck, Gift, LogOut } from 'lucide-react';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { preferences } = useOnboarding();
  const [user, setUser] = useState({
    name: 'Eleanor T. Shellstrop',
    email: 'eleanor.s@goodplace.com',
    image: 'https://picsum.photos/seed/eleanor/400/400'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('platera_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({
          name: parsed.name || 'Eleanor T. Shellstrop',
          email: parsed.email || 'eleanor.s@goodplace.com',
          image: parsed.image || 'https://picsum.photos/seed/eleanor/400/400'
        });
      } catch (e) { console.error("Failed to parse saved user", e); }
    }
  }, []);

  const dietarySummary = preferences.dietTypes.length > 0 ? preferences.dietTypes.join(', ') : 'Set taste profile';

  const menuItems = [
    { title: "Profile", subtitle: "Personal details", icon: <Settings size={18} />, path: "/account/edit" },
    { title: "Orders", subtitle: "Track deliveries", icon: <History size={18} />, path: "/orders" },
    { title: "Dietary", subtitle: dietarySummary, icon: <Heart size={18} />, path: "/account/dietary" },
    { title: "Subscription", subtitle: "Premium Plan", icon: <ShieldCheck size={18} />, path: "/pricing" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('platera_onboarded');
    localStorage.removeItem('platera_user');
    navigate('/');
  };

  return (
    <MainLayout title="Profile">
      <div className="space-y-10 pb-32">
        <header className="flex flex-col items-center gap-6 py-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-[40px] overflow-hidden ring-8 ring-muted/30 shadow-2xl relative border-2 border-border">
              <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button onClick={() => navigate('/account/edit')} className="absolute -bottom-1 -right-1 p-3.5 bg-primary rounded-2xl text-primary-foreground shadow-xl hover:scale-110 transition-transform border-4 border-card">
              <Edit2 size={12} strokeWidth={3} />
            </button>
          </div>
          
          <div className="text-center space-y-1">
            <h3 className="text-3xl font-black text-foreground tracking-tighter font-sans">{user.name}</h3>
            <p className="text-muted-foreground text-sm font-medium font-poppins">{user.email}</p>
            <div className="pt-3">
              <span className="bg-primary/10 backdrop-blur-md text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-primary/20 shadow-sm shadow-primary/5 font-poppins">
                Platinum Member
              </span>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-6 font-poppins">Account Workspace</h4>
          <div className="grid grid-cols-1 gap-3 px-2">
            {menuItems.map((item, i) => (
              <button key={i} onClick={() => navigate(item.path)} className="w-full flex items-center text-left gap-4 p-5 bg-muted/30 backdrop-blur-xl hover:bg-muted/50 border border-border rounded-[28px] transition-all group shadow-xl">
                <div className="p-3.5 bg-muted/50 backdrop-blur-md rounded-2xl text-muted-foreground group-hover:text-primary group-hover:bg-muted/80 transition-all border border-border shadow-lg">
                  {item.icon}
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="font-bold text-foreground block group-hover:text-primary transition-colors font-sans">{item.title}</span>
                  <span className="text-[10px] text-muted-foreground block uppercase tracking-widest truncate font-poppins opacity-60 mt-0.5">{item.subtitle}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-primary rounded-[32px] p-8 text-primary-foreground space-y-4 shadow-2xl shadow-primary/30 mx-2 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <h4 className="font-black text-lg font-sans">Family Fresh</h4>
            <span className="text-[9px] font-black bg-primary-foreground text-primary px-3 py-1.5 rounded-full uppercase tracking-widest font-poppins">Active</span>
          </div>
          <p className="text-3xl font-black font-sans relative z-10 tracking-tight">$128.50<span className="text-sm font-normal opacity-70 font-poppins"> /mo</span></p>
          <div className="pt-2 relative z-10">
            <button className="w-full py-4 bg-primary-foreground/10 backdrop-blur-md text-primary-foreground border border-primary-foreground/30 font-black rounded-2xl text-xs hover:bg-primary-foreground/20 transition-all font-poppins uppercase tracking-widest">Manage Plan</button>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-primary-foreground/10 rounded-full blur-2xl" />
        </div>

        <div className="px-2 space-y-4">
          <div onClick={() => navigate('/referral')} className="bg-muted/30 backdrop-blur-xl rounded-[28px] p-6 text-foreground flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors border border-border shadow-xl">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg border border-primary">
              <Gift size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h5 className="font-bold text-base font-sans leading-none mb-1">Refer a Friend</h5>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest font-poppins">Get $20 Credit</p>
            </div>
          </div>

          <button onClick={() => navigate('/auth')} className="w-full flex items-center justify-center gap-3 p-5 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-[28px] text-primary hover:bg-primary/20 transition-all active:scale-[0.98] font-poppins shadow-xl">
            <span className="font-black text-xs uppercase tracking-[0.2em]">Sign In / Register</span>
          </button>

          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 p-6 bg-destructive/5 backdrop-blur-xl border border-destructive/20 rounded-[28px] text-destructive hover:bg-destructive/10 transition-all active:scale-[0.98] font-poppins shadow-xl">
            <LogOut size={20} />
            <span className="font-black text-xs uppercase tracking-[0.2em]">Sign Out</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Account;
