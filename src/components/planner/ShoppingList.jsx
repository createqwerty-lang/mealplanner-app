import React, { useState, useEffect } from "react";
import api from "@/api/client";
import { ShoppingCart, Loader2, Check, RefreshCw, Printer, ChevronDown, ChevronUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ShoppingList({ open, onClose, meals, weekLabel }) {
  const [ingredients, setIngredients] = useState([]);
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(false);
  const [persons, setPersons] = useState("2");

  useEffect(() => {
    if (open && meals.length > 0) generateList(persons);
  }, [open, meals]);

  const generateList = async (nbPersons = persons) => {
    setLoading(true);
    setChecked({});

    // Collect unique recipe IDs
    const recipeIds = [...new Set(meals.map((m) => m.recipe_id).filter(Boolean))];

    // Fetch all recipes
    const recipeData = await Promise.all(
      recipeIds.map(async (id) => {
        try {
          const response = await api.get(`/recipes/${id}`);
          return response.data;
        } catch {
          return null;
        }
      })
    );

    // Build ingredient list with recipe name, base servings, and target persons
    const recipesForPrompt = recipeData
      .filter(Boolean)
      .map((r) => {
        const servings = r.servings || 2;
        return `Recette "${r.title}" (prévue pour ${servings} personne${servings > 1 ? "s" : ""}) :\n` +
          (r.ingredients || []).map((ing) => `  - ${ing}`).join("\n");
      })
      .join("\n\n");

    const categories = [
      { name: 'Viandes & Poissons', items: [] },
      { name: 'Œufs & Produits laitiers', items: [] },
      { name: 'Légumes & Fruits', items: [] },
      { name: 'Épicerie', items: [] },
      { name: 'Condiments & Huiles', items: [] },
      { name: 'Surgelés', items: [] },
    ];

    const lines = recipesForPrompt.split(/\n/).filter(Boolean);
    lines.forEach((line) => {
      if (line.includes('œufs') || line.includes('beurre') || line.includes('crème') || line.includes('lait') || line.includes('fromage')) {
        categories[1].items.push(line);
      } else if (line.includes('salade') || line.includes('avocat') || line.includes('citron') || line.includes('tomate') || line.includes('oignon')) {
        categories[2].items.push(line);
      } else if (line.includes('huile') || line.includes('sel') || line.includes('poivre') || line.includes('moutarde')) {
        categories[4].items.push(line);
      } else {
        categories[3].items.push(line);
      }
    });

    setIngredients(categories.filter((cat) => cat.items.length > 0));
    setLoading(false);
  };

  const toggleCheck = (key) => setChecked((p) => ({ ...p, [key]: !p[key] }));

  const totalItems = ingredients.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const handlePrint = () => {
    const content = ingredients
      .map((cat) => `${cat.name}\n${cat.items.map((i) => `  • ${i}`).join("\n")}`)
      .join("\n\n");
    const win = window.open("", "_blank");
    win.document.write(`<pre style="font-family:sans-serif;padding:20px;font-size:14px;"><h2>Liste de courses – ${weekLabel}</h2>\n\n${content}</pre>`);
    win.print();
    win.close();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Liste de courses
          </DialogTitle>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground">{weekLabel}</p>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <Select
                value={persons}
                onValueChange={(val) => {
                  setPersons(val);
                  if (ingredients.length > 0) generateList(val);
                }}
              >
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} personne{n > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Génération de votre liste…</p>
          </div>
        ) : ingredients.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Aucun ingrédient trouvé. Ajoutez des recettes à votre planner.
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">{checkedCount} / {totalItems} articles cochés</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => generateList(persons)} className="gap-1.5 text-xs">
                  <RefreshCw className="w-3 h-3" /> Regénérer
                </Button>
                <Button variant="ghost" size="sm" onClick={handlePrint} className="gap-1.5 text-xs">
                  <Printer className="w-3 h-3" /> Imprimer
                </Button>
              </div>
            </div>

            <div className="w-full bg-muted rounded-full h-1.5 mb-4">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: totalItems ? `${(checkedCount / totalItems) * 100}%` : "0%" }}
              />
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {ingredients.map((cat) => (
                <Category key={cat.name} cat={cat} checked={checked} onToggle={toggleCheck} />
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Category({ cat, checked, onToggle }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/50 hover:bg-muted transition-colors"
      >
        <span className="font-semibold text-sm">{cat.name}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{cat.items.filter((_, i) => checked[`${cat.name}-${i}`]).length}/{cat.items.length}</span>
          {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </div>
      </button>

      {!collapsed && (
        <ul className="divide-y divide-border/30">
          {cat.items.map((item, i) => {
            const key = `${cat.name}-${i}`;
            const isChecked = checked[key];
            return (
              <li key={key}>
                <button
                  onClick={() => onToggle(key)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isChecked ? "bg-primary border-primary" : "border-border"}`}>
                    {isChecked && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm transition-all ${isChecked ? "line-through text-muted-foreground" : ""}`}>
                    {item}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}