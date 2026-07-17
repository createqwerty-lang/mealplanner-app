import React, { useState } from "react";
import api from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { startOfWeek, addDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import DayColumn from "@/components/planner/DayColumn";
import RecipePicker from "@/components/planner/RecipePicker";
import ShoppingList from "@/components/planner/ShoppingList";

const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

export default function MealPlanner() {
  const queryClient = useQueryClient();
  const [weekOffset, setWeekOffset] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerContext, setPickerContext] = useState({ day: "", mealType: "" });
  const [shoppingOpen, setShoppingOpen] = useState(false);

  const monday = startOfWeek(addDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
  const weekStart = format(monday, "yyyy-MM-dd");
  const weekLabel = `${format(monday, "d MMM", { locale: fr })} — ${format(addDays(monday, 6), "d MMM yyyy", { locale: fr })}`;

  const { data: meals = [] } = useQuery({
    queryKey: ["mealplan", weekStart],
    queryFn: async () => {
      const response = await api.get('/meal-plan', { params: { weekStart } });
      return response.data;
    },
  });

  const addMeal = useMutation({
    mutationFn: (data) => api.post('/meal-plan', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mealplan", weekStart] }),
  });

  const removeMeal = useMutation({
    mutationFn: (id) => api.delete(`/meal-plan/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mealplan", weekStart] }),
  });

  const handleAdd = (day, mealType) => {
    setPickerContext({ day, mealType });
    setPickerOpen(true);
  };

  const handleSelect = (recipe) => {
    addMeal.mutate({
      week_start: weekStart,
      day: pickerContext.day,
      meal_type: pickerContext.mealType,
      recipe_id: recipe.id,
      recipe_title: recipe.title,
    });
    setPickerOpen(false);
  };

  const clearWeek = async () => {
    for (const meal of meals) {
      await api.delete(`/meal-plan/${meal.id}`);
    }
    queryClient.invalidateQueries({ queryKey: ["mealplan", weekStart] });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">Meal Planner</h1>
          <p className="text-muted-foreground mt-1">Planifiez vos repas keto de la semaine</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setWeekOffset((p) => p - 1)} className="rounded-full">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[180px] text-center">{weekLabel}</span>
          <Button variant="outline" size="icon" onClick={() => setWeekOffset((p) => p + 1)} className="rounded-full">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {meals.length > 0 && (
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShoppingOpen(true)}
            className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Liste de courses
          </Button>
          <Button variant="ghost" size="sm" onClick={clearWeek} className="text-muted-foreground hover:text-destructive gap-1.5">
            <Trash2 className="w-3.5 h-3.5" />
            Vider la semaine
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map((day) => (
          <DayColumn
            key={day}
            day={day}
            meals={meals.filter((m) => m.day === day)}
            onAdd={handleAdd}
            onRemove={(id) => removeMeal.mutate(id)}
          />
        ))}
      </div>

      <RecipePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
        mealType={pickerContext.mealType}
      />

      <ShoppingList
        open={shoppingOpen}
        onClose={() => setShoppingOpen(false)}
        meals={meals}
        weekLabel={weekLabel}
      />
    </div>
  );
}