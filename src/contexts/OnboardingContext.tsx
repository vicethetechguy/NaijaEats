import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DietType = "Vegan" | "Vegetarian" | "Keto" | "Organic" | "Gluten-Free";
export type AllergyTag = "Dairy Free" | "Gluten Free" | "Peanuts" | "Soy Free" | "Egg Free" | "Shellfish" | "Tree Nuts";

export interface UserPreferences {
  dietTypes: DietType[];
  allergies: AllergyTag[];
}

interface OnboardingContextType {
  preferences: UserPreferences;
  setDietType: (diet: DietType, selected: boolean) => void;
  setAllergy: (allergy: AllergyTag, selected: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietTypes: ["Vegan", "Vegetarian"],
    allergies: ["Dairy Free", "Soy Free"],
  });

  const setDietType = (diet: DietType, selected: boolean) => {
    setPreferences(prev => ({
      ...prev,
      dietTypes: selected ? [...prev.dietTypes, diet] : prev.dietTypes.filter(d => d !== diet)
    }));
  };

  const setAllergy = (allergy: AllergyTag, selected: boolean) => {
    setPreferences(prev => ({
      ...prev,
      allergies: selected ? [...prev.allergies, allergy] : prev.allergies.filter(a => a !== allergy)
    }));
  };

  return (
    <OnboardingContext.Provider value={{ preferences, setDietType, setAllergy }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("useOnboarding must be used within OnboardingProvider");
  return context;
};
