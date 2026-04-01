import { NavLink, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, CalendarDays, User } from "lucide-react";

const navItems = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/meals", icon: UtensilsCrossed, label: "Meals" },
  { to: "/planner", icon: CalendarDays, label: "Planner" },
  { to: "/account", icon: User, label: "Account" },
];

const BottomNav = () => {
  const location = useLocation();
  const hiddenRoutes = ["/", "/onboarding"];

  if (hiddenRoutes.some((r) => location.pathname === r || location.pathname.startsWith("/onboarding"))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5"
            >
              <Icon
                size={22}
                className={isActive ? "text-primary" : "text-muted-foreground"}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
