import { User, ChevronRight, Heart, CreditCard, Settings, LogOut, Award } from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { icon: Heart, label: "Dietary Preferences", desc: "Manage your diet & allergies" },
  { icon: CreditCard, label: "Subscription", desc: "Standard Plan · Active" },
  { icon: Award, label: "Referral", desc: "Invite friends, earn rewards" },
  { icon: Settings, label: "Settings", desc: "Notifications, privacy & more" },
];

const Account = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl bg-card p-5"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User size={28} className="text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">Alex Johnson</h2>
            <p className="text-xs text-muted-foreground font-poppins">alex@platera.com</p>
          </div>
          <button className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
            Edit
          </button>
        </motion.div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { val: "47", label: "Meals" },
            { val: "12", label: "Weeks" },
            { val: "4.9", label: "Rating" },
          ].map(({ val, label }) => (
            <div key={label} className="rounded-xl bg-card p-3 text-center">
              <p className="text-xl font-extrabold text-primary">{val}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="mt-6 space-y-2">
          {menuItems.map(({ icon: Icon, label, desc }) => (
            <button
              key={label}
              className="flex w-full items-center gap-3 rounded-xl bg-card p-4 text-left transition-colors hover:bg-secondary"
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

        {/* Logout */}
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Account;
