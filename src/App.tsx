import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import OrderDetails from "./pages/OrderDetails";
import AuthScreen from "./pages/AuthScreen";
import DeliveryTrack from "./pages/DeliveryTrack";
import Notifications from "./pages/Notifications";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import DietaryPreferences from "./pages/DietaryPreferences";
import Onboarding1 from "./pages/Onboarding1";
import Onboarding2 from "./pages/Onboarding2";
import Onboarding3 from "./pages/Onboarding3";
import Pricing from "./pages/Pricing";
import Referral from "./pages/Referral";
import ProfileEdit from "./pages/ProfileEdit";
import VerifyEmail from "./pages/VerifyEmail";
import ChefDashboard from "./pages/ChefDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import NotFound from "./pages/NotFound";

import { UserProvider } from "@/contexts/UserContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isSignedIn = !!localStorage.getItem('platera_user');
  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <OnboardingProvider>
          <MealProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthScreen />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

              {/* Protected Routes */}
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding1 /></ProtectedRoute>} />
              <Route path="/onboarding/preferences" element={<ProtectedRoute><Onboarding2 /></ProtectedRoute>} />
              <Route path="/onboarding/welcome" element={<ProtectedRoute><Onboarding3 /></ProtectedRoute>} />
              <Route path="/meals" element={<ProtectedRoute><DiscoverMeals /></ProtectedRoute>} />
              <Route path="/meals/:mealId" element={<ProtectedRoute><MealDetail /></ProtectedRoute>} />
              <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              <Route path="/account/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
              <Route path="/account/dietary" element={<ProtectedRoute><DietaryPreferences /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchScreen /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
              <Route path="/delivery/:orderId" element={<ProtectedRoute><DeliveryTrack /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
              <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
              <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
              
              {/* Role Portals */}
              <Route path="/chef" element={<ProtectedRoute><ChefDashboard /></ProtectedRoute>} />
              <Route path="/chef/menu" element={<ProtectedRoute><ChefDashboard /></ProtectedRoute>} />
              <Route path="/chef/wallet" element={<ProtectedRoute><ChefDashboard /></ProtectedRoute>} />
              <Route path="/chef/wallet/withdraw" element={<ProtectedRoute><ChefDashboard /></ProtectedRoute>} />
              <Route path="/chef/wallet/history" element={<ProtectedRoute><ChefDashboard /></ProtectedRoute>} />
              <Route path="/chef/profile" element={<ProtectedRoute><ChefDashboard /></ProtectedRoute>} />
              <Route path="/restaurant" element={<ProtectedRoute><RestaurantDashboard /></ProtectedRoute>} />
              <Route path="/restaurant/inventory" element={<ProtectedRoute><RestaurantDashboard /></ProtectedRoute>} />
              <Route path="/restaurant/orders" element={<ProtectedRoute><RestaurantDashboard /></ProtectedRoute>} />
              <Route path="/restaurant/profile" element={<ProtectedRoute><RestaurantDashboard /></ProtectedRoute>} />
              <Route path="/delivery" element={<ProtectedRoute><DeliveryDashboard /></ProtectedRoute>} />
              <Route path="/delivery/history" element={<ProtectedRoute><DeliveryDashboard /></ProtectedRoute>} />
              <Route path="/delivery/earnings" element={<ProtectedRoute><DeliveryDashboard /></ProtectedRoute>} />
              <Route path="/delivery/profile" element={<ProtectedRoute><DeliveryDashboard /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MealProvider>
      </OnboardingProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
