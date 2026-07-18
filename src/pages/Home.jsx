import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Leaf, Clock, Heart, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/recipes/RecipeCard";
import { startOfWeek, addDays, format } from "date-fns";

const features = [
  {
    icon: Leaf,
    title: "100% Cétogène",
    desc: "Toutes nos recettes respectent les macros keto : riches en bons gras, modérées en protéines, très faibles en glucides.",
  },
  {
    icon: Clock,
    title: "Rapide & Simple",
    desc: "Des recettes faciles à préparer, même pour les débutants. La majorité en moins de 30 minutes.",
  },
  {
    icon: Heart,
    title: "Meal Planner",
    desc: "Planifiez vos repas de la semaine en un clic pour rester organisé et ne jamais manquer d'inspiration.",
  },
];

const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const mealTypes = ["dejeuner", "diner", "snack", "dessert"];

export default function Home() {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);

  const { data: recipes = [] } = useQuery({
    queryKey: ["recipes-featured"],
    queryFn: async () => {
      const response = await api.get('/recipes');
      return response.data.slice(0, 6);
    },
  });

  const generateWeekMenu = async () => {
    setGenerating(true);
    const response = await api.get('/recipes');
    const allRecipes = response.data;
    if (allRecipes.length === 0) { setGenerating(false); navigate("/planner"); return; }

    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekStart = format(monday, "yyyy-MM-dd");

    // Delete existing meals for this week
    const existing = await api.get('/meal-plan', { params: { weekStart } });
    for (const m of existing.data) await api.delete(`/meal-plan/${m.id}`);

    // Group recipes by category and shuffle each group
    // dejeuner slot = petit-déjeuner (pain keto, oeufs, gaufres, crêpes, yogourt)
    // diner + souper(slots) = repas complets (viande, poisson, tofu)
    // dessert slot = collations sucrées / desserts
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const byCategory = (cats) => shuffle(allRecipes.filter((r) => cats.includes(r.category)));
    const pools = {
      dejeuner: byCategory(["petit_dejeuner"]),
      diner: byCategory(["diner", "dejeuner"]),
      snack: byCategory(["diner", "dejeuner"]),
      dessert: byCategory(["dessert", "snack"]),
    };
    const counters = { dejeuner: 0, diner: 0, snack: 0, dessert: 0 };

    const newMeals = [];
    for (const day of days) {
      for (const meal_type of mealTypes) {
        const pool = pools[meal_type];
        if (pool.length > 0) {
          const recipe = pool[counters[meal_type] % pool.length];
          counters[meal_type]++;
          newMeals.push({ week_start: weekStart, day, meal_type, recipe_id: recipe.id, recipe_title: recipe.title });
        }
      }
    }
    for (const meal of newMeals) await api.post('/meal-plan', meal);
    setGenerating(false);
    navigate("/planner");
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Leaf className="w-3.5 h-3.5" />
              Diète Cétogène
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Des recettes keto
              <br />
              <span className="text-primary">simples & délicieuses</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-5 leading-relaxed max-w-lg">
              Découvrez des recettes cétogènes alléchantes, faciles à préparer au quotidien.
              Planifiez vos repas et restez en cétose sans effort.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/recettes">
                <Button size="lg" className="gap-2 rounded-full px-6">
                  Explorer les recettes
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/planner">
                <Button size="lg" variant="outline" className="rounded-full px-6">
                  Meal Planner
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-6 gap-2 border-accent text-accent hover:bg-accent/5"
                onClick={generateWeekMenu}
                disabled={generating}
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generating ? "En création…" : "Générer mon menu"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Recipes */}
      {recipes.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold">Recettes populaires</h2>
              <p className="text-muted-foreground mt-1">Nos dernières créations cétogènes</p>
            </div>
            <Link to="/recettes">
              <Button variant="ghost" className="gap-1 text-primary">
                Voir tout <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}