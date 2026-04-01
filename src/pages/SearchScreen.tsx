import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { meals } from "@/data/meals";
import MealCard from "@/components/MealCard";
import { MainLayout } from "@/components/Layouts";

const SearchScreen = () => {
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? meals.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <MainLayout title="Search">
      <div className="flex items-center gap-2 rounded-xl bg-muted/30 border border-border px-3 py-2.5 mb-5">
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

      {query.trim() === "" ? (
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">Search for your favorite meals</p>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">No results for "{query}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {results.map((meal) => <MealCard key={meal.id} meal={meal} />)}
        </div>
      )}
    </MainLayout>
  );
};

export default SearchScreen;
