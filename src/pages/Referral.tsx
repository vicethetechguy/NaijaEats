import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { Copy, Share2, Check, Ticket, Info, RefreshCw, Users, Zap, Gift } from 'lucide-react';
import { toast } from 'sonner';

const Referral: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const referralCode = "NAIJAEATS-552";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const progress = 2; // Demo progress

  return (
    <DetailLayout onBack={() => navigate(-1)} title="Refer a Friend">
      <div className="p-6 space-y-10 pb-24 max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-block relative">
            <div className="w-24 h-24 bg-mustard border-[3px] border-ink rounded-[32px] shadow-stk flex items-center justify-center rotate-6">
              <Ticket size={48} strokeWidth={2.5} className="-rotate-6" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-tomato border-2 border-ink rounded-full flex items-center justify-center shadow-stk-sm">
              <span className="text-white font-black text-xs">FREE</span>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter leading-[0.95]">
              Get a <span className="text-tomato">Free meal</span> ticket
            </h1>
            <p className="text-lg font-bold text-ink/70">
              Refer 5 friends to order their first meal and unlock a ticket!
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-card border-[3px] border-ink rounded-[32px] shadow-stk p-6 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black tracking-widest text-ink/40">Current mission</p>
              <h3 className="text-xl font-black">Your progress</h3>
            </div>
            <p className="text-2xl font-black text-tomato">{progress}/5</p>
          </div>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div 
                key={step} 
                className={`h-4 flex-1 border-2 border-ink rounded-full transition-colors ${
                  step <= progress ? 'bg-sage shadow-stk-sm' : 'bg-cream'
                }`}
              />
            ))}
          </div>

          <p className="text-xs font-bold text-ink/60 text-center">
            {5 - progress} more friends to get your free meal ticket!
          </p>
        </div>

        {/* Explainers */}
        <div className="grid gap-4">
          <div className="p-5 bg-mustard/10 border-2 border-dashed border-mustard rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-ink">
              <Info size={18} strokeWidth={2.5} className="text-mustard" />
              <h4 className="font-black text-xs tracking-wider">How the value is calculated</h4>
            </div>
            <p className="text-sm font-medium leading-relaxed text-ink/80">
              Your free meal ticket value depends on the total meal cost of the first 5 friends you refer. We take the average of their first orders to determine your ticket's worth!
            </p>
          </div>

          <div className="p-5 bg-sage/10 border-2 border-dashed border-sage rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-ink">
              <RefreshCw size={18} strokeWidth={2.5} className="text-sage" />
              <h4 className="font-black text-xs tracking-wider">Infinity rewards</h4>
            </div>
            <p className="text-sm font-medium leading-relaxed text-ink/80">
              The cycle never ends! Every time you reach 5 successful referrals, a new meal ticket is generated for you. Keep sharing, keep eating for free!
            </p>
          </div>
        </div>

        {/* Referral Code */}
        <div className="space-y-4">
          <p className="text-xs font-black tracking-widest text-ink/40 text-center">Share your unique code</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-cream border-[3px] border-ink p-4 rounded-2xl font-black text-base tracking-wide text-center shadow-stk-sm">
              {referralCode}
            </div>
            <button 
              onClick={handleCopy}
              className="p-4 bg-tomato text-white border-[3px] border-ink rounded-2xl shadow-stk hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
            >
              {copied ? <Check size={24} strokeWidth={3} /> : <Copy size={24} strokeWidth={3} />}
            </button>
          </div>
        </div>

        <button className="w-full py-5 bg-ink text-white border-[4px] border-ink rounded-[28px] font-black text-sm tracking-wide shadow-stk flex items-center justify-center gap-3 hover:bg-tomato transition-colors">
          <Share2 size={20} strokeWidth={3} />
          Invite friends now
        </button>
      </div>
    </DetailLayout>
  );
};

export default Referral;
