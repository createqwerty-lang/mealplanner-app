import React from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MacroBadge from "@/components/recipes/MacroBadge";

const categoryLabels = {
  petit_dejeuner: "Petit-déjeuner",
  dejeuner: "Déjeuner",
  diner: "Dîner",
  snack: "Snack",
  dessert: "Dessert",
};

export default function RecipeDetail() {
  const { id } = useParams();

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-72 bg-muted rounded-2xl" />
          <div className="h-4 w-96 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-muted-foreground text-lg">Recette non trouvée</p>
        <Link to="/recettes">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeft className="w-4 h-4" /> Retour aux recettes
          </Button>
        </Link>
      </div>
    );
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link to="/recettes">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Button>
      </Link>

      {/* Header Image */}
      <div className="rounded-2xl overflow-hidden h-64 sm:h-80 mb-8">
        <img
          src={recipe.imageUrl || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800"}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title & Meta */}
      <div className="mb-8">
        <Badge className="bg-primary/10 text-primary border-0 mb-3">
          {categoryLabels[recipe.category] || recipe.category}
        </Badge>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight">
          {recipe.title}
        </h1>
        {recipe.description && (
          <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
            {recipe.description}
          </p>
        )}

        <div className="flex flex-wrap gap-4 mt-5 text-sm text-muted-foreground">
          {totalTime > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {totalTime} min
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {recipe.servings} portions
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <ChefHat className="w-4 h-4" /> Cétogène
          </span>
        </div>
      </div>

      {/* Macros */}
      {(recipe.calories || recipe.fat || recipe.protein || recipe.carbs !== undefined) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {recipe.calories && <MacroBadge label="Calories" value={recipe.calories} unit="kcal" color="red" />}
          {recipe.fat && <MacroBadge label="Lipides" value={recipe.fat} unit="g" color="orange" />}
          {recipe.protein && <MacroBadge label="Protéines" value={recipe.protein} unit="g" color="blue" />}
          {recipe.carbs !== undefined && <MacroBadge label="Glucides nets" value={recipe.carbs} unit="g" color="green" />}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Ingredients */}
        {recipe.ingredients?.length > 0 && (
          <div className="md:col-span-2">
            <h2 className="font-heading text-xl font-semibold mb-4">Ingrédients</h2>
            <ul className="space-y-2.5">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Steps */}
        {recipe.steps?.length > 0 && (
          <div className="md:col-span-3">
            <h2 className="font-heading text-xl font-semibold mb-4">Préparation</h2>
            <ol className="space-y-5">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-semibold">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Tags */}
      {recipe.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}