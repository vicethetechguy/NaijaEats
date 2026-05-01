import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ScheduledMeal {
  id: string;
  title: string;
  day: string;
  type: string;
  time: string;
  image: string;
  chefName?: string;
  price?: number;
}

interface MealContextType {
  schedule: ScheduledMeal[];
  addMealToPlan: (meal: Omit<ScheduledMeal, 'id'>) => void;
  removeMealFromPlan: (id: string) => void;
  clearPlan: () => void;
  targetDay: string | null;
  targetType: string | null;
  setTargetDay: (day: string | null) => void;
  setTargetType: (type: string | null) => void;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

const INITIAL_SCHEDULE: ScheduledMeal[] = [];

export const MealProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schedule, setSchedule] = useState<ScheduledMeal[]>(INITIAL_SCHEDULE);
  const [targetDay, setTargetDay] = useState<string | null>(null);
  const [targetType, setTargetType] = useState<string | null>(null);

  const addMealToPlan = (meal: Omit<ScheduledMeal, 'id'>) => {
    const newMeal = { ...meal, id: Math.random().toString(36).substr(2, 9), chefName: meal.chefName || "Naija Eats Chef", price: meal.price || 5500 };
    setSchedule(prev => [...prev, newMeal]);
  };

  const removeMealFromPlan = (id: string) => setSchedule(prev => prev.filter(m => m.id !== id));
  const clearPlan = () => setSchedule([]);

  return (
    <MealContext.Provider value={{ schedule, addMealToPlan, removeMealFromPlan, clearPlan, targetDay, targetType, setTargetDay, setTargetType }}>
      {children}
    </MealContext.Provider>
  );
};

export const useMeals = () => {
  const context = useContext(MealContext);
  if (!context) throw new Error("useMeals must be used within MealProvider");
  return context;
};
