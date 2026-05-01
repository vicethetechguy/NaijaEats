import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2, ArrowLeft, Check, ChefHat, Bike, Store, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

type AuthMode = 'login' | 'signup';
type UserRole = 'eater' | 'chef' | 'restaurant' | 'delivery';

const roles: { id: UserRole; label: string; icon: any }[] = [
  { id: 'eater', label: 'Eater', icon: UserCircle },
  { id: 'chef', label: 'Chef', icon: ChefHat },
  { id: 'restaurant', label: 'Restaurant', icon: Store },
  { id: 'delivery', label: 'Delivery', icon: Bike },
];

const AuthScreen = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('eater');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ email: '', password: '', name: '' });

  const update = useCallback((field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) throw error;

        // Fetch profile to get role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        const user = {
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          image: `https://i.pravatar.cc/150?u=${data.user.id}`,
          role: profile.role,
        };
        
        localStorage.setItem('platera_onboarded', 'true');
        localStorage.setItem('platera_user', JSON.stringify(user));
        
        setSuccess('Welcome back!');
        setTimeout(() => redirectUser(profile.role), 800);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.name,
              role: role,
            }
          }
        });

        if (error) throw error;
        
        setSuccess('Account created!');
        setTimeout(() => navigate('/verify-email', { state: { email: form.email } }), 800);
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (userRole: string) => {
    if (userRole === 'chef') {
      window.location.href = '/apps/chef/index.html';
    } else if (userRole === 'delivery') {
      window.location.href = '/apps/delivery/index.html';
    } else if (userRole === 'restaurant') {
      window.location.href = '/apps/restaurant/index.html';
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col">
      {/* Top bar */}
      <div className="px-4 sm:px-6 pt-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="p-2.5 bg-card border-2 border-ink rounded-full hover:bg-mustard transition-colors shadow-stk-sm"
          aria-label="Back"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => navigate('/')}
          className="text-2xl tracking-tighter text-tomato"
        >
          <span className="font-light">Naija</span>
          <span className="font-black">Eats</span>
        </button>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: marketing panel (desktop only) */}
          <div className="hidden lg:block">
            <div className="inline-block bg-mustard border-2 border-ink px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide mb-6 -rotate-2 shadow-stk-sm">
              🍳 Real food, real chefs
            </div>
            <h1 className="text-6xl font-black leading-[0.95] tracking-tighter mb-6">
              Eat what your <span className="text-tomato underline decoration-[6px] decoration-ink underline-offset-[8px]">block</span> is cooking.
            </h1>
            <p className="text-lg font-medium text-ink/70 mb-8">
              Sign in to plan meals, track orders, and discover chefs near you.
            </p>
            <div className="space-y-3">
              {['Personalized meal plans', 'Allergen-safe filtering', 'Pause or cancel anytime'].map((t) => (
                <div key={t} className="flex items-center gap-3 text-base font-bold">
                  <div className="w-7 h-7 rounded-full bg-sage border-2 border-ink flex items-center justify-center shadow-stk-sm">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right: form card */}
          <div className="bg-card border-[3px] border-ink rounded-3xl shadow-stk p-5 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tighter mb-1">
                {mode === 'login' ? 'Welcome back.' : 'Create account.'}
              </h2>
              <p className="text-sm font-medium text-ink/60">
                {mode === 'login' ? 'Sign in to continue your plan.' : 'Join Naija Eats in a few seconds.'}
              </p>
            </div>

            {success && (
              <div className="mb-5 p-3 bg-sage/30 border-2 border-ink rounded-xl flex items-center gap-2">
                <Check size={16} strokeWidth={3} />
                <span className="text-xs font-extrabold uppercase tracking-wide">{success}</span>
              </div>
            )}

            {/* Mode toggle */}
            <div className="flex bg-cream border-2 border-ink rounded-full p-1 mb-8">
              {(['login', 'signup'] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    'flex-1 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wide transition-all',
                    mode === m ? 'bg-tomato text-white' : 'text-ink/60 hover:text-ink'
                  )}
                >
                  {m === 'login' ? 'Sign in' : 'Register'}
                </button>
              ))}
            </div>

            {/* Role selection for signup */}
            {mode === 'signup' && (
              <div className="mb-8 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-1">Joining as a...</p>
                <div className="grid grid-cols-4 gap-2">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={cn(
                          'flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-1',
                          role === r.id ? 'bg-mustard border-ink shadow-stk-sm -translate-y-0.5' : 'bg-cream border-ink/5 text-ink/40 hover:border-ink/20'
                        )}
                      >
                        <Icon size={18} />
                        <span className="text-[8px] font-black uppercase tracking-tighter">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              {mode === 'signup' && (
                <FieldWrap icon={<UserIcon size={18} strokeWidth={2.5} />}>
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="w-full bg-transparent outline-none text-base font-semibold placeholder:text-ink/40 min-w-0"
                  />
                </FieldWrap>
              )}
              <FieldWrap icon={<Mail size={18} strokeWidth={2.5} />}>
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="w-full bg-transparent outline-none text-base font-semibold placeholder:text-ink/40 min-w-0"
                />
              </FieldWrap>
              <FieldWrap icon={<Lock size={18} strokeWidth={2.5} />}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className="w-full bg-transparent outline-none text-base font-semibold placeholder:text-ink/40 min-w-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-ink/50 hover:text-ink shrink-0"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </FieldWrap>

              {mode === 'login' && (
                <div className="flex justify-end pt-1">
                  <button type="button" className="text-xs font-bold uppercase tracking-wide text-tomato hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-tomato text-white border-[3px] border-ink rounded-2xl py-4 mt-2 font-extrabold uppercase tracking-wide text-sm shadow-stk hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-stk-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : mode === 'login' ? (
                  'Sign in'
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 mt-10 mb-7">
              <div className="flex-1 h-[2px] bg-ink/10" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-ink/40 whitespace-nowrap">or continue with</span>
              <div className="flex-1 h-[2px] bg-ink/10" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SocialBtn label="Google" />
              <SocialBtn label="Apple" />
            </div>

            <p className="text-center text-xs font-medium text-ink/60 mt-8">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-tomato font-extrabold uppercase tracking-wide hover:underline"
              >
                {mode === 'login' ? 'Register' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FieldWrap: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <div className="flex items-center gap-3 bg-cream border-2 border-ink rounded-xl px-4 h-14 focus-within:bg-mustard/30 transition-colors">
    <span className="text-ink/60 shrink-0">{icon}</span>
    {children}
  </div>
);

const SocialBtn: React.FC<{ label: string }> = ({ label }) => (
  <button
    type="button"
    className="bg-card border-2 border-ink rounded-xl py-3 font-extrabold uppercase tracking-wide text-xs hover:bg-mustard/40 transition-colors shadow-stk-sm"
  >
    {label}
  </button>
);

export default AuthScreen;