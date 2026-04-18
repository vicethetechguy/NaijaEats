import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Plus } from 'lucide-react';
import { useOnboarding, DietType, AllergyTag } from '@/contexts/OnboardingContext';
import { CTAButton, SelectableChip } from '@/components/UI';

const Onboarding2: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, setDietType, setAllergy } = useOnboarding();

  const diets: { title: DietType; description: string; image: string }[] = [
    { title: "Vegan", description: "Plant-only meals packed with flavor.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop" },
    { title: "Vegetarian", description: "Meat-free, dairy and eggs allowed.", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&auto=format&fit=crop" },
    { title: "Keto", description: "Low-carb, high-fat for steady energy.", image: "https://images.unsplash.com/photo-1552590635-27c2c2128b15?q=80&w=400&auto=format&fit=crop" },
    { title: "Organic", description: "Clean, sustainably-sourced ingredients.", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop" },
    { title: "Gluten-Free", description: "No gluten, no compromise on taste.", image: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=400&auto=format&fit=crop" },
  ];

  const allergies: AllergyTag[] = ["Dairy Free", "Gluten Free", "Peanuts", "Soy Free", "Egg Free"];

  const handleContinue = () => navigate('/onboarding/welcome');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-0 md:p-8">
      <div className="flex flex-col h-screen md:h-[844px] w-full max-w-md bg-card shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] rounded-none md:rounded-[60px] relative overflow-hidden border border-border">
        <div className="px-6 py-6 flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur-md z-40 border-b border-border shrink-0">
          <button onClick={() => navigate('/')} className="p-2.5 bg-muted rounded-xl text-foreground active:scale-95 transition-all">
            <ArrowLeft size={18} />
          </button>
          <button onClick={handleContinue} className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] px-4 py-2 hover:text-primary transition-colors">
            Skip
          </button>
        </div>

        <div className="flex-1 p-8 space-y-12 overflow-y-auto pb-32">
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-foreground tracking-tighter leading-none">Your taste,<br />your rules.</h2>
            <p className="text-muted-foreground font-medium text-base">We'll filter our weekly menus for you.</p>
          </div>

          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Dietary Style</h3>
            <div className="grid grid-cols-1 gap-4">
              {diets.map((diet) => {
                const isSelected = preferences.dietTypes.includes(diet.title);
                return (
                  <button
                    key={diet.title}
                    onClick={() => setDietType(diet.title, !isSelected)}
                    className={`group relative flex items-center gap-5 p-5 rounded-3xl text-left transition-all duration-300 border-2 ${
                      isSelected ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 border-border hover:border-muted-foreground/40'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm opacity-80">
                      <img src={diet.image} alt={diet.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className={`block font-black text-lg ${isSelected ? 'text-primary' : 'text-foreground'}`}>{diet.title}</span>
                      <p className="text-[10px] text-muted-foreground font-medium leading-tight">{diet.description}</p>
                    </div>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground'}`}>
                      {isSelected ? <Check size={16} strokeWidth={4} /> : <Plus size={16} strokeWidth={4} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-6 pb-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Allergies</h3>
            <div className="flex flex-wrap gap-3">
              {allergies.map((allergy) => (
                <SelectableChip
                  key={allergy}
                  label={allergy}
                  selected={preferences.allergies.includes(allergy)}
                  onToggle={() => setAllergy(allergy, !preferences.allergies.includes(allergy))}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-card via-card/95 to-transparent pt-12">
          <CTAButton text="Continue" onClick={handleContinue} />
        </div>
      </div>
    </div>
  );
};

export default Onboarding2;
