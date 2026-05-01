import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { Mail, User, Camera, Loader2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    image: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile({
          name: profileData.full_name || '',
          email: user.email || '',
          image: profileData.avatar_url || `https://ui-avatars.com/api/?name=${profileData.full_name || 'User'}&background=ff4d4d&color=fff`
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.name,
          avatar_url: profile.image
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local cache for immediate UI feedback
      const localUser = JSON.parse(localStorage.getItem('platera_user') || '{}');
      localStorage.setItem('platera_user', JSON.stringify({
        ...localUser,
        name: profile.name,
        image: profile.image
      }));

      setIsSaving(false);
      setIsSaved(true);
      toast.success('Profile updated successfully!');
      setTimeout(() => navigate('/account'), 800);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <DetailLayout onBack={() => navigate(-1)} title="Edit Profile">
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <Loader2 className="animate-spin text-tomato" size={40} />
          <p className="font-black uppercase tracking-widest text-ink/40">Loading Profile...</p>
        </div>
      </DetailLayout>
    );
  }

  return (
    <DetailLayout onBack={() => navigate(-1)} title="Edit Profile">
      <div className="p-8 space-y-12 pb-32">
        <div className="flex flex-col items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-[48px] overflow-hidden border-[4px] border-ink shadow-stk relative bg-cream">
              <img src={profile.image} className="w-full h-full object-cover group-hover:opacity-40 transition-all duration-300" alt="Profile" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-ink/20">
                <Camera className="text-ink" size={32} />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 p-3 bg-tomato text-white border-[3px] border-ink rounded-2xl shadow-stk-sm group-hover:scale-110 transition-transform">
              <Camera size={16} />
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-[10px] font-black text-ink/40 uppercase tracking-[0.2em]">Personal Identity</p>
            <p className="text-xs text-tomato font-bold">Tap photo to upload new picture</p>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSave}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-ink/40 uppercase tracking-widest px-4">Display Name</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-card border-[3px] border-ink rounded-[24px] shadow-stk-sm focus:bg-mustard/10 transition-all font-bold text-ink outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-ink/40 uppercase tracking-widest px-4">Email Address</label>
              <div className="relative opacity-50">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full pl-16 pr-6 py-5 bg-cream/50 border-[3px] border-ink/10 rounded-[24px] font-bold text-ink outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving || isSaved}
            className={`w-full py-5 border-[3px] border-ink rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-stk ${
              isSaved ? 'bg-sage text-white' : 'bg-tomato text-white hover:-translate-y-1 hover:shadow-stk-lg active:scale-95'
            }`}
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : isSaved ? <Check size={18} strokeWidth={3} /> : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </DetailLayout>
  );
};

export default ProfileEdit;
