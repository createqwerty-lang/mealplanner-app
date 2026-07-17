import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UtensilsCrossed, CalendarDays, BookOpen, Menu, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Accueil", icon: UtensilsCrossed },
  { to: "/recettes", label: "Recettes", icon: BookOpen },
  { to: "/planner", label: "Meal Planner", icon: CalendarDays },
  { to: "/newsletter", label: "Newsletter", icon: Mail },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight">
              Keto<span className="text-primary">Kitchen</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className={`gap-2 ${active ? "font-medium" : "text-muted-foreground"}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-2 ${active ? "font-medium" : "text-muted-foreground"}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}