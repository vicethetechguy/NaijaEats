import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'your email';

  const isGmail = email.toLowerCase().endsWith('@gmail.com');
  const mailProviderLink = isGmail 
    ? 'https://mail.google.com/mail/u/0/#search/from%3Anaijaeats+is%3Aunread' 
    : 'https://mail.google.com/'; // Fallback to general mail

  const handleResend = async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Verification link resent!');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-ink">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Floating Mail Icon */}
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-mustard border-[4px] border-ink rounded-[40px] shadow-stk flex items-center justify-center rotate-3 animate-bounce-slow">
            <Mail size={56} strokeWidth={2.5} />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-tomato border-[3px] border-ink rounded-full shadow-stk-sm flex items-center justify-center -rotate-12">
            <span className="text-white font-black text-xs">GO!</span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tighter leading-none uppercase">
            Check your <a 
              href={mailProviderLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-tomato underline decoration-[6px] decoration-ink underline-offset-8 hover:bg-mustard transition-colors cursor-pointer"
            >
              mail
            </a>
          </h1>
          <p className="text-lg font-medium text-ink/70 pt-2">
            We've sent a magic link to <span className="font-black text-ink">{email}</span>. 
            Click the link in the mail to activate your account.
          </p>
        </div>

        {/* Primary Action Button */}
        <a 
          href={mailProviderLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group block w-full bg-ink text-white border-[4px] border-ink p-6 rounded-[28px] shadow-stk hover:translate-x-1 hover:translate-y-1 hover:shadow-stk-sm transition-all"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl font-black uppercase tracking-wide">
              Open {isGmail ? 'Gmail' : 'Mailbox'}
            </span>
            <ExternalLink size={24} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
          </div>
        </a>

        {/* Secondary Actions */}
        <div className="pt-8 space-y-6">
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleResend}
              className="flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest text-ink/40 hover:text-tomato transition-colors"
            >
              <RefreshCw size={14} strokeWidth={3} />
              Didn't get the link? Resend
            </button>
            
            <button 
              onClick={() => navigate('/auth')}
              className="flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
            >
              Wrong email? Go back
            </button>
          </div>

          <div className="p-5 bg-sage/10 border-2 border-dashed border-sage/30 rounded-3xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-sage leading-relaxed">
              Tip: Check your spam or promotions folder if you don't see it in your primary inbox!
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
