import React from "react";
import { Button } from "@/components/ui/button";
import { Egg, Sun, Moon, Cookie, CakeSlice } from "lucide-react";

const categories = [
  { value: "all", label: "Tout", icon: null },
  { value: "petit_dejeuner", label: "Petit-déj", icon: Egg },
  { value: "dejeuner", label: "Déjeuner", icon: Sun },
  { value: "diner", label: "Dîner", icon: Moon },
  { value: "snack", label: "Snack", icon: Cookie },
  { value: "dessert", label: "Dessert", icon: CakeSlice },
];

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={active === value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(value)}
          className={`gap-1.5 rounded-full ${
            active === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {label}
        </Button>
      ))}
    </div>
  );
}