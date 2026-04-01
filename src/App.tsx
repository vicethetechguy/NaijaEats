import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MealProvider } from "@/contexts/MealContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import DiscoverMeals from "./pages/DiscoverMeals";
import MealDetail from "./pages/MealDetail";
import Planner from "./pages/Planner";
import Account from "./pages/Account";
import SearchScreen from "./pages/SearchScreen";
import Orders from "./pages/Orders";
import AuthScreen from "./pages/AuthScreen";
import DeliveryTrack from "./pages/DeliveryTrack";
import Notifications from "./pages/Notifications";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import DietaryPreferences from "./pages/DietaryPreferences";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OnboardingProvider>
        <MealProvider>
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
              <Route path="/account/dietary" element={<DietaryPreferences />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/auth" element={<AuthScreen />} />
              <Route path="/delivery/:orderId" element={<DeliveryTrack />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MealProvider>
      </OnboardingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
