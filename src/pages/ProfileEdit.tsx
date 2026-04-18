import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { Mail, User, Camera, Loader2, Check } from 'lucide-react';

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: 'Eleanor T. Shellstrop',
    email: 'eleanor.s@thegoodplace.com',
    image: 'https://picsum.photos/seed/eleanor/400/400'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('platera_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setProfile({
          name: parsed.name || profile.name,
          email: parsed.email || profile.email,
          image: parsed.image || profile.image
        });
      } catch (e) { console.error(e); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('platera_user', JSON.stringify(profile));
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => navigate('/account'), 800);
    }, 1000);
  };

  return (
    <DetailLayout onBack={() => navigate(-1)} title="Edit Profile">
      <div className="p-8 space-y-12 pb-32">
        <div className="flex flex-col items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-[48px] overflow-hidden ring-8 ring-muted/30 shadow-2xl relative">
              <img src={profile.image} className="w-full h-full object-cover group-hover:opacity-40 transition-all duration-300" alt="Profile" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/20">
                <Camera className="text-foreground" size={32} />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 p-3 bg-primary rounded-2xl text-primary-foreground shadow-xl border-4 border-card group-hover:scale-110 transition-transform">
              <Camera size={16} />
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Personal Identity</p>
            <p className="text-xs text-primary font-bold">Tap photo to upload new picture</p>
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSave}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-4">Display Name</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-muted/30 rounded-[24px] border-2 border-transparent focus:border-primary/50 focus:bg-muted/50 transition-all font-bold text-foreground outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-16 pr-6 py-5 bg-muted/30 rounded-[24px] border-2 border-transparent focus:border-primary/50 focus:bg-muted/50 transition-all font-bold text-foreground outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving || isSaved}
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
              isSaved ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 active:scale-95'
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
