import { useState } from "react";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { meals } from "@/data/meals";
import MealCard from "@/components/MealCard";

const SearchScreen = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? meals.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 border-b border-border bg-background/80 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-card px-3 py-2.5">
            <SearchIcon size={16} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search meals, diets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        {query.trim() === "" ? (
          <div className="mt-20 text-center">
            <p className="text-sm text-muted-foreground">Search for your favorite meals</p>
          </div>
        ) : results.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="text-sm text-muted-foreground">No results for "{query}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {results.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;
