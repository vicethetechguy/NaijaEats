export interface Meal {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  badges: string[];
  tags: string[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fats: string;
  };
  ingredients: string[];
  allergens: string[];
  planTier: "standard" | "premium";
}
