import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailLayout } from '@/components/Layouts';
import { Check, Plus } from 'lucide-react';
import { useOnboarding, DietType, AllergyTag } from '@/contexts/OnboardingContext';
import { CTAButton, SelectableChip } from '@/components/UI';

const DietaryPreferences: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, setDietType, setAllergy } = useOnboarding();

  const diets: { title: DietType; description: string; image: string }[] = [
    { title: "Vegan", description: "Plant-based excellence for high energy and clean living.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop" },
    { title: "Vegetarian", description: "Meat-free favorites featuring fresh produce and dairy.", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&auto=format&fit=crop" },
    { title: "Keto", description: "Low carb, high fat. Optimized for metabolic performance.", image: "https://images.unsplash.com/photo-1552590635-27c2c2128b15?q=80&w=400&auto=format&fit=crop" },
    { title: "Organic", description: "Clean, non-GMO, and sustainably sourced ingredients.", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop" },
    { title: "Gluten-Free", description: "Coeliac-safe and wheat-free gourmet preparations.", image: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=400&auto=format&fit=crop" },
  ];

  const allergies: AllergyTag[] = ["Dairy Free", "Gluten Free", "Peanuts", "Soy Free", "Egg Free", "Shellfish", "Tree Nuts"];

  return (
    <DetailLayout onBack={() => navigate('/account')} title="Dietary Profile">
      <div className="p-8 space-y-12 pb-32">
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-foreground tracking-tighter leading-none">Food Style</h2>
          <p className="text-muted-foreground font-medium text-sm">Select one or more styles for your weekly menu.</p>
        </div>

        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {diets.map((diet) => {
              const isSelected = preferences.dietTypes.includes(diet.title);
              return (
                <button key={diet.title} onClick={() => setDietType(diet.title, !isSelected)} className={`group relative flex items-center gap-5 p-5 rounded-[32px] text-left transition-all duration-300 border-2 ${isSelected ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 border-border hover:border-muted-foreground/20'}`}>
                  <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm opacity-80">
                    <img src={diet.image} alt={diet.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <span className={`block font-black text-base ${isSelected ? 'text-primary' : 'text-foreground'}`}>{diet.title}</span>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight line-clamp-2">{diet.description}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground'}`}>
                    {isSelected ? <Check size={14} strokeWidth={4} /> : <Plus size={14} strokeWidth={4} />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Exclusions & Allergies</h3>
          <div className="flex flex-wrap gap-2.5">
            {allergies.map((allergy) => (
              <SelectableChip key={allergy} label={allergy} selected={preferences.allergies.includes(allergy)} onToggle={() => setAllergy(allergy, !preferences.allergies.includes(allergy))} />
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-card via-card/90 to-transparent pt-12 z-20 max-w-md mx-auto">
        <CTAButton text="Update Preferences" onClick={() => navigate('/account')} />
      </div>
    </DetailLayout>
  );
};

export default DietaryPreferences;
