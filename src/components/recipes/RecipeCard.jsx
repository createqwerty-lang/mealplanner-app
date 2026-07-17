import React from "react";
import { Link } from "react-router-dom";
import { Clock, Flame, Droplets } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categoryLabels = {
  petit_dejeuner: "Petit-déjeuner",
  dejeuner: "Déjeuner",
  diner: "Dîner",
  snack: "Snack",
  dessert: "Dessert",
  Breakfast: "Petit-déjeuner",
  Lunches: "Déjeuner",
  Dinners: "Dîner",
  "Appetizers and Snacks": "Entrées et snacks",
  Desserts: "Desserts",
  Drinks: "Boissons",
  "Side Dishes": "Accompagnements",
  "Dairy Free": "Sans lactose",
};

export default function RecipeCard({ recipe, compact = false }) {
  return (
    <Link to={`/recettes/${recipe.id}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
        <div className={`relative overflow-hidden ${compact ? "h-36" : "h-48"}`}>
          <img
            src={recipe.imageUrl || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600"}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary/90 text-primary-foreground text-xs font-medium">
              {categoryLabels[recipe.category] || recipe.category}
            </Badge>
          </div>
        </div>

        <div className={`${compact ? "p-3" : "p-4"}`}>
          <h3 className={`font-heading font-semibold leading-snug group-hover:text-primary transition-colors ${compact ? "text-sm" : "text-lg"}`}>
            {recipe.title}
          </h3>

          {!compact && recipe.description && (
            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">
              {recipe.description}
            </p>
          )}

          <div className={`flex items-center gap-3 text-xs text-muted-foreground ${compact ? "mt-2" : "mt-3"}`}>
            {(recipe.prepTime || recipe.cookTime) && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
              </span>
            )}
            {recipe.calories && (
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {recipe.calories} kcal
              </span>
            )}
            {recipe.carbs !== undefined && (
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" />
                {recipe.carbs}g glucides
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}