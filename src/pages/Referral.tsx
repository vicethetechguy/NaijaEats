import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { Gift, Copy, Share2, Twitter, MessageCircle, Check, Users, ArrowRight, ShieldCheck, Zap, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Referral: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const referralCode = "PLATERA-4242";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = { title: 'Platera', text: `Use code ${referralCode} to get $20 off Platera!`, url: 'https://platera.io/join' };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { /* ignored */ }
    } else {
      handleCopy();
    }
  };

  const referralSteps = [
    { icon: <Share2 size={16} />, text: "Share your unique referral link" },
    { icon: <Users size={16} />, text: "Friend signs up and subscribes" },
    { icon: <Zap size={16} />, text: "Friend gets $20 off first week" },
    { icon: <CreditCard size={16} />, text: "You get $20 subscription credit" }
  ];

  const recentReferrals = [
    { id: 1, name: "Tunde", amount: "$45", date: "Oct 12", avatar: "https://i.pravatar.cc/100?u=1", status: "Joined Naija Eats" },
    { id: 2, name: "Amara", amount: "$20", date: "Oct 15", avatar: "https://i.pravatar.cc/100?u=2", status: "Joined Naija Eats" }
  ];

  return (
    <DetailLayout onBack={() => navigate(-1)} title="Refer & Earn">
      <div className="p-8 space-y-10 pb-32">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center text-primary-foreground mx-auto shadow-[0_20px_40px_rgba(249,115,22,0.3)] relative">
            <Gift size={40} strokeWidth={2.5} />
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-card border-4 border-primary rounded-full flex items-center justify-center text-[10px] font-black text-foreground">$20</div>
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-foreground tracking-tighter leading-[0.9]">Give $20,<br />Get $20.</h2>
            <p className="text-muted-foreground text-sm font-medium px-4">The ultimate win-win. Share the gift of effortless healthy eating.</p>
          </div>
        </div>

        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">How it works</h4>
          <div className="grid grid-cols-1 gap-3">
            {referralSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">{step.icon}</div>
                <span className="text-[11px] font-bold text-foreground/80 uppercase tracking-tight">{step.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-muted/30 p-8 rounded-[32px] border border-border space-y-6 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Gift size={120} /></div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest relative z-10">Your Unique Invite Code</p>
          <div className="flex items-center gap-3 bg-background p-3 rounded-2xl border border-border relative z-10 shadow-inner">
            <span className="flex-1 font-black text-2xl text-foreground tracking-tighter">{referralCode}</span>
            <button onClick={handleCopy} className={cn("p-3.5 rounded-xl text-primary-foreground shadow-xl active:scale-95 transition-all", copied ? "bg-green-500" : "bg-primary")}>
              {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{copied ? "Copied to clipboard!" : "Tap to copy and share"}</p>
        </section>

        <section className="space-y-6">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Instant Share</h4>
          <div className="flex justify-center gap-4">
            <button onClick={handleShare} className="w-16 h-16 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"><MessageCircle size={24} /></button>
            <button onClick={handleShare} className="w-16 h-16 bg-[#1DA1F2] rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"><Twitter size={24} /></button>
            <button onClick={handleShare} className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center text-foreground shadow-lg active:scale-90 transition-all border border-border"><Share2 size={24} /></button>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recent Activity</h4>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest">View All</button>
          </div>
          <div className="bg-muted/30 rounded-[32px] border border-border divide-y divide-border shadow-xl">
            {recentReferrals.map((ref, i) => (
              <div key={i} className="p-5 flex items-center justify-between group hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted border border-border overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${ref.name}`} alt="" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{ref.name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{ref.date} • {ref.status}</p>
                  </div>
                </div>
                <span className={cn("text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full", ref.amount.startsWith('+') ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground")}>
                  {ref.amount}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 bg-primary rounded-[40px] text-primary-foreground space-y-4 shadow-2xl shadow-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none"><ShieldCheck size={100} /></div>
          <div className="relative z-10 space-y-1">
            <h5 className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-80">Subscription Credit</h5>
            <div className="flex items-end justify-between">
              <span className="text-5xl font-black tracking-tighter leading-none">$140.00</span>
              <span className="text-[10px] font-black uppercase tracking-widest bg-primary-foreground/20 px-3 py-1.5 rounded-full">7 Successful</span>
            </div>
          </div>
          <div className="pt-4 relative z-10">
            <button onClick={() => navigate('/planner')} className="w-full py-4 bg-primary-foreground/20 backdrop-blur-md border border-primary-foreground/30 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary-foreground/30 transition-all active:scale-[0.98]">
              Use Credits <ArrowRight size={14} strokeWidth={3} />
            </button>
          </div>
        </section>
      </div>
    </DetailLayout>
  );
};

export default Referral;
