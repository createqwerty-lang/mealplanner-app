import React, { useState } from "react";
import api from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categoryLabels = {
  petit_dejeuner: "Petit-déj",
  dejeuner: "Déjeuner",
  diner: "Dîner",
  snack: "Snack",
  dessert: "Dessert",
};

export default function RecipePicker({ open, onClose, onSelect, mealType }) {
  const [search, setSearch] = useState("");

  const { data: recipes = [] } = useQuery({
    queryKey: ["recipes-all"],
    queryFn: async () => {
      const response = await api.get('/recipes');
      return response.data;
    },
  });

  const filtered = recipes.filter((r) => {
    const matchSearch =
      !search || r.title?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-heading">
            Choisir une recette
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-full"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              Aucune recette trouvée
            </p>
          ) : (
            filtered.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => onSelect(recipe)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
              >
                <img
                  src={recipe.imageUrl || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100"}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{recipe.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {categoryLabels[recipe.category]}
                    </span>
                    {recipe.carbs !== undefined && (
                      <span className="text-xs text-primary font-medium">
                        {recipe.carbs}g glucides
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}