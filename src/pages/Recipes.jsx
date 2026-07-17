import React, { useState } from "react";
import api from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import RecipeCard from "@/components/recipes/RecipeCard";
import CategoryFilter from "@/components/recipes/CategoryFilter";

export default function Recipes() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await api.get('/recipes');
      return response.data;
    },
  });

  const filtered = recipes.filter((r) => {
    const catMatch = category === "all" || r.category === category;
    const searchMatch =
      !search ||
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold">Recettes Keto</h1>
        <p className="text-muted-foreground mt-2">
          Toutes nos recettes cétogènes, faibles en glucides
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une recette..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-full"
          />
        </div>
        <CategoryFilter active={category} onChange={setCategory} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted animate-pulse h-72" />
            ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">Aucune recette trouvée</p>
          <p className="text-sm text-muted-foreground mt-1">
            Essayez de modifier vos filtres
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}