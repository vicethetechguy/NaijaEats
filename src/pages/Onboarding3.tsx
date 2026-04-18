import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CTAButton } from '@/components/UI';

const Onboarding3: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem('platera_onboarded', 'true');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-0 md:p-8">
      <div className="flex flex-col h-screen md:h-[844px] w-full max-w-md bg-card shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-none md:rounded-[60px] relative overflow-hidden border border-border">
        <div className="flex-1 overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"
            alt="Healthy Bowl"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        </div>

        <div className="p-10 space-y-8 bg-card relative z-10 shrink-0">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-foreground leading-[0.85] tracking-tighter">
              Eat well,<br />without effort.
            </h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              Custom meal plans and fresh ingredients delivered straight to your door.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <CTAButton text="Start Discovering" onClick={handleStart} />
            <button
              onClick={() => navigate('/auth')}
              className="w-full py-5 text-muted-foreground font-black text-xs uppercase tracking-[0.2em] hover:text-foreground transition-colors"
            >
              Already a member? Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding3;
