import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { CTAButton } from '@/components/UI';
import { CheckCircle2 } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DetailLayout title="Confirmed">
      <div className="flex flex-col items-center justify-center p-8 pt-20 space-y-8 text-center">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-foreground tracking-tighter">Order Confirmed!</h2>
          <p className="text-muted-foreground text-sm font-poppins max-w-[260px]">Your meals are being prepared by our chefs. Track your delivery in real-time.</p>
        </div>
        <div className="w-full max-w-[280px] space-y-3 pt-4">
          <CTAButton text="Track delivery" onClick={() => navigate('/delivery/current')} />
          <CTAButton text="Back to home" style="outlined" onClick={() => navigate('/home')} />
        </div>
      </div>
    </DetailLayout>
  );
};

export default PaymentSuccess;
