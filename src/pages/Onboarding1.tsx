import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { CTAButton } from '@/components/UI';

const Onboarding1: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-0 md:p-8">
      <div className="flex flex-col h-screen md:h-[844px] w-full max-w-md bg-card shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-none md:rounded-[60px] relative overflow-hidden border border-border">
        <div className="px-6 py-10 flex items-center justify-between absolute top-0 left-0 right-0 z-10">
          <h1 className="text-2xl font-black text-foreground drop-shadow-2xl tracking-tighter">Platera</h1>
          <button onClick={() => navigate('/notifications')} className="p-3 bg-background/40 backdrop-blur-md rounded-2xl text-foreground border border-border active:scale-95 transition-all">
            <Bell size={18} />
          </button>
        </div>

        <div className="flex-1 relative">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"
            alt="Salad Plate"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

          <div className="absolute bottom-12 px-8 space-y-4">
            <h2 className="text-5xl font-black text-foreground mb-2 leading-[0.9] tracking-tighter">
              Nourish<br />your week.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
              Chef-prepared meals tailored to your dietary goals.
            </p>
          </div>
        </div>

        <div className="p-8 bg-card shrink-0">
          <CTAButton text="Get Started" onClick={() => navigate('/onboarding/preferences')} />
        </div>
      </div>
    </div>
  );
};

export default Onboarding1;
