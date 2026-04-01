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

const INITIAL_SCHEDULE: ScheduledMeal[] = [
  { id: '1', day: "Mon", title: "Smoky Party Jollof", type: "Lunch", time: "1:00 PM", image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&auto=format&fit=crop", chefName: "Chef Ezinne", price: 18.50 },
  { id: '2', day: "Mon", title: "Beef Suya Platter", type: "Dinner", time: "7:30 PM", image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&auto=format&fit=crop", chefName: "Chef Funmilayo", price: 22.00 },
  { id: '3', day: "Tue", title: "Akara & Pap", type: "Breakfast", time: "8:30 AM", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop", chefName: "Chef Amaka", price: 12.00 },
];

export const MealProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schedule, setSchedule] = useState<ScheduledMeal[]>(INITIAL_SCHEDULE);
  const [targetDay, setTargetDay] = useState<string | null>(null);
  const [targetType, setTargetType] = useState<string | null>(null);

  const addMealToPlan = (meal: Omit<ScheduledMeal, 'id'>) => {
    const newMeal = { ...meal, id: Math.random().toString(36).substr(2, 9), chefName: meal.chefName || "Platera Kitchen", price: meal.price || 14.99 };
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
