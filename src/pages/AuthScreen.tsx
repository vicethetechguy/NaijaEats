import { useState, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { Mail, Lock, Eye, EyeOff, Loader2, Check as CheckIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LOGO_URL = "https://drive.google.com/thumbnail?id=1jkLC0R1klmr8UOCJ2exnvjROu8VUjPWV&sz=w500";

type AuthMode = 'login' | 'signup';

const AuthScreen = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const finalUser = {
      email: formData.email,
      name: formData.name || 'Foodie Friend',
      image: `https://i.pravatar.cc/150?u=${formData.email}`
    };
    localStorage.setItem('platera_onboarded', 'true');
    localStorage.setItem('platera_user', JSON.stringify(finalUser));

    setSuccessMessage(authMode === 'login' ? 'Welcome back to Platera!' : 'Account created!');
    setTimeout(() => navigate('/home'), 1000);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-0 md:p-8">
      <div className="flex flex-col h-screen md:h-[844px] w-full max-w-md bg-card shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-none md:rounded-[32px] relative overflow-hidden border border-border">
        
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1543353071-10c8ba85a902?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 blur-[2px]" alt="Food Background" />
          <div className="absolute inset-0 bg-gradient-to-b from-card/80 via-card to-card" />
        </div>

        <button onClick={() => navigate(-1)} className="absolute top-8 left-8 p-3 bg-muted/30 backdrop-blur-xl border border-border rounded-2xl text-foreground active:scale-95 transition-all z-20">
          <ArrowLeft size={20} />
        </button>

        <div className="relative z-10 flex-1 overflow-y-auto pt-24 px-8 pb-12">
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
            <button onClick={() => setAuthMode('login')} className={cn("flex-1 py-3 rounded-lg text-xs font-normal transition-all", authMode === 'login' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>Sign in</button>
            <button onClick={() => setAuthMode('signup')} className={cn("flex-1 py-3 rounded-lg text-xs font-normal transition-all", authMode === 'signup' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>Register</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div className="relative">
                <input type="text" placeholder="Full name" className="w-full px-4 py-4 bg-muted/30 border border-border rounded-xl font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type="email" placeholder="Email address" className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-xl font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full pl-12 pr-12 py-4 bg-muted/30 border border-border rounded-xl font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground font-normal py-4 rounded-xl text-sm shadow-lg hover:bg-primary/90 transition-all h-14">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (authMode === 'login' ? 'Sign in' : 'Create account')}
            </button>
          </form>
        </div>

        <div className="p-8 text-center relative z-10 bg-gradient-to-t from-card to-transparent">
          <div className="flex items-center justify-center gap-1.5 opacity-30">
            <img src={LOGO_URL} alt="P" className="w-8 h-8 object-contain" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground font-poppins">Platera Secure Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
