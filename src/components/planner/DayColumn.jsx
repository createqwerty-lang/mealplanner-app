import React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mealTypeLabels = {
  dejeuner: "Déjeuner",
  diner: "Dîner",
  snack: "Souper",
  dessert: "Dessert",
};

const mealTypes = ["dejeuner", "diner", "snack", "dessert"];

export default function DayColumn({ day, meals, onAdd, onRemove }) {
  const navigate = useNavigate();
  const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-4 min-w-[180px]">
      <h3 className="font-heading font-semibold text-center mb-4 text-sm sm:text-base">
        {dayLabel}
      </h3>

      <div className="space-y-3">
        {mealTypes.map((type) => {
          const meal = meals.find((m) => m.meal_type === type);
          return (
            <div key={type}>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                {mealTypeLabels[type]}
              </p>
              {meal ? (
                <div className="group relative bg-primary/5 rounded-xl px-3 py-2.5 text-sm border border-primary/10">
                  <p
                    className="font-medium text-xs leading-snug pr-5 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => meal.recipe_id && navigate(`/recettes/${meal.recipe_id}`)}
                  >{meal.recipe_title}</p>
                  <button
                    onClick={() => onRemove(meal.id)}
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAdd(day, type)}
                  className="w-full h-10 border border-dashed border-border text-muted-foreground hover:border-primary/30 hover:text-primary rounded-xl text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Ajouter
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}