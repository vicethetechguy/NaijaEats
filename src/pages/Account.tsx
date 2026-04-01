import { User, ChevronRight, Heart, CreditCard, Settings, LogOut, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/Layouts";

const menuItems = [
  { icon: Heart, label: "Dietary Preferences", desc: "Manage your diet & allergies" },
  { icon: CreditCard, label: "Subscription", desc: "Standard Plan · Active" },
  { icon: Award, label: "Referral", desc: "Invite friends, earn rewards" },
  { icon: Settings, label: "Settings", desc: "Notifications, privacy & more" },
];

const Account = () => {
  const navigate = useNavigate();

  return (
    <MainLayout title="Profile">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 rounded-2xl bg-muted/30 border border-border p-5 mb-5"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <User size={28} className="text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-foreground">Alex Johnson</h2>
          <p className="text-xs text-muted-foreground font-poppins">alex@platera.com</p>
        </div>
        <button className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-secondary-foreground border border-border">
          Edit
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { val: "47", label: "Meals" },
          { val: "12", label: "Weeks" },
          { val: "4.9", label: "Rating" },
        ].map(({ val, label }) => (
          <div key={label} className="rounded-xl bg-muted/30 border border-border p-3 text-center">
            <p className="text-xl font-extrabold text-primary">{val}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="space-y-2 mb-6">
        {menuItems.map(({ icon: Icon, label, desc }) => (
          <button
            key={label}
            className="flex w-full items-center gap-3 rounded-xl bg-muted/30 border border-border p-4 text-left transition-colors hover:bg-muted/50"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Auth */}
      <button
        onClick={() => navigate('/auth')}
        className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-sm font-semibold mb-3"
      >
        Sign In / Register
      </button>

      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5">
        <LogOut size={16} />
        Sign Out
      </button>
    </MainLayout>
  );
};

export default Account;
