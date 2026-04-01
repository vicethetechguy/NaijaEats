import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import DiscoverMeals from "./pages/DiscoverMeals";
import MealDetail from "./pages/MealDetail";
import Planner from "./pages/Planner";
import Account from "./pages/Account";
import SearchScreen from "./pages/SearchScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/meals" element={<DiscoverMeals />} />
          <Route path="/meals/:mealId" element={<MealDetail />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/account" element={<Account />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
