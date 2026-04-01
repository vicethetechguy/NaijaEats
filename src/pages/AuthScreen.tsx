import { useState, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { Mail, Lock, Eye, EyeOff, Loader2, Check as CheckIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';

type AuthMode = 'login' | 'signup';

const AuthScreen = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSuccessMessage(authMode === 'login' ? 'Welcome back to Platera!' : 'Account created!');
    setTimeout(() => navigate('/home'), 1000);
    setIsLoading(false);
  };

  return (
    <DetailLayout onBack={() => navigate('/')} title="Account">
      <div className="p-6">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
            <CheckIcon size={14} strokeWidth={4} className="text-green-500" />
            <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">{successMessage}</span>
          </div>
        )}

        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-foreground tracking-tighter leading-none mb-2">
            {authMode === 'login' ? 'Welcome back.' : 'Join Platera.'}
          </h2>
          <p className="text-muted-foreground text-sm">Delicious meals await.</p>
        </div>

        <div className="flex bg-muted/30 rounded-xl p-1 mb-8">
          <button
            onClick={() => setAuthMode('login')}
            className={cn("flex-1 py-3 rounded-lg text-xs font-normal transition-all", authMode === 'login' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
          >
            Sign in
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={cn("flex-1 py-3 rounded-lg text-xs font-normal transition-all", authMode === 'signup' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-xl font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-4 bg-muted/30 border border-border rounded-xl font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground font-normal py-4 rounded-xl text-sm shadow-lg hover:bg-primary/90 transition-all h-14"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (authMode === 'login' ? 'Sign in' : 'Create account')}
          </button>
        </form>
      </div>
    </DetailLayout>
  );
};

export default AuthScreen;
