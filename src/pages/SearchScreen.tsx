import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/Layouts";
import { Badge } from "@/components/UI";
import { useMeals } from "@/contexts/MealContext";

const allMeals = [
  { id: 'jollof', title: "Signature Jollof Rice", image: "https://www.remitly.com/blog/wp-content/uploads/2022/09/different-Nigerian-dishes.jpeg", chef: "Chef Ezinne", price: 18.99, tags: ["Rice", "Spicy"] },
  { id: 'egusi', title: "Egusi & Pounded Yam", image: "https://www.remitly.com/blog/wp-content/uploads/2022/09/different-Nigerian-dishes.jpeg", chef: "Chef Funmilayo", price: 24.50, tags: ["Soup", "Traditional"] },
  { id: 'suya', title: "Lagos Street Beef Suya", image: "https://www.remitly.com/blog/wp-content/uploads/2022/09/different-Nigerian-dishes.jpeg", chef: "Chef Amaka", price: 15.99, tags: ["Grill", "Spicy"] },
  { id: 'moimoi', title: "Seven-Life Moimoi", image: "https://www.remitly.com/blog/wp-content/uploads/2022/09/different-Nigerian-dishes.jpeg", chef: "Chef Sarah", price: 12.50, tags: ["Healthy", "Beans"] },
];

const SearchScreen = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? allMeals.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          m.chef.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <MainLayout title="Search">
      <div className="flex items-center gap-2 rounded-xl bg-muted/30 border border-border px-3 py-2.5 mb-5">
        <SearchIcon size={16} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search meals, chefs, diets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {query.trim() === "" ? (
        <div className="mt-16 text-center space-y-4">
          <p className="text-sm text-muted-foreground">Search for your favorite meals</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Jollof", "Suya", "Egusi", "Healthy"].map(tag => (
              <button key={tag} onClick={() => setQuery(tag)} className="px-4 py-2 bg-muted/30 border border-border rounded-2xl text-xs text-muted-foreground hover:text-foreground transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">No results for "{query}"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((meal) => (
            <div key={meal.id} onClick={() => navigate(`/meals/${meal.id}`)} className="group cursor-pointer bg-muted/30 backdrop-blur-xl rounded-[28px] p-4 flex items-center gap-4 border border-border hover:bg-muted/50 transition-all shadow-xl">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{meal.title}</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{meal.chef}</p>
              </div>
              <span className="text-primary font-black">${meal.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default SearchScreen;
