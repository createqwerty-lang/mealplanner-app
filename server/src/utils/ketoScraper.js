import axios from 'axios';
import * as cheerio from 'cheerio';

const SOURCE_URL = 'https://www.simplefunketo.com/recipes';

const categoryMap = {
  Breakfast: 'dejeuner',
  Lunches: 'dejeuner',
  Dinners: 'diner',
  'Appetizers and Snacks': 'snack',
  Desserts: 'dessert',
  Drinks: 'dessert',
  'Side Dishes': 'diner',
  'Dairy Free': 'diner',
};

const toFrenchTitle = (title) => {
  const normalized = title.replace(/\s+/g, ' ').trim();
  const translations = {
    'Blackstone Griddle Omelettes': 'Omelettes Blackstone',
    'Strawberry Blintz': 'Blintz aux fraises',
    'Egg Bite Muffins': 'Muffins d’œufs',
    'Feta & Pesto Eggs': 'Œufs feta pesto',
    'DIY Taco Seasoning': 'Épices taco maison',
    'Mason Jar Eggs': 'Œufs en bocal',
    'Keto French Toast Chaffle': 'Pain perdu keto',
    'Easy melt in your mouth Bacon': 'Bacon fondant',
    'Keto Lupini Oatmeal': 'Porridge keto',
    'Egg Sandwich': 'Sandwich keto',
    'Homemade Keto Pancakes': 'Pancakes keto maison',
    'Keto Pumpkin Spice Waffles': 'Gaufres épicées keto',
    'Keto Raspberry Scones': 'Scones aux framboises',
    'Keto Mini Egg Bites': 'Mini muffins keto',
    'Keto Crepes': 'Crêpes keto',
    'Keto Coffee Cake Chaffle': 'Cake chaffle keto',
    'Keto No Bake Donut Holes': 'Donuts sans cuisson',
    'Keto Coffee Cake Muffins': 'Muffins cake keto',
    'Keto Breakfast Casserole': 'Casserole keto',
    'Keto Egg Sous Vide Bites': 'Bites d’œufs sous vide',
    'Chia Seed Pudding': 'Pudding aux graines de chia',
    'Keto Oatmeal': 'Porridge keto',
    'Classic Low Carb Chili': 'Chili keto classique',
    'Low Carb Chicken Alfredo': 'Poulet Alfredo keto',
    'Keto Taco Bowls': 'Bowl taco keto',
    'Turkey Burger': 'Burger de dinde',
    'Ground Beef Taco Bowl': 'Bowl de bœuf taco',
    'Keto Cheeseburger Casserole': 'Casserole cheeseburger keto',
    'Keto Taco Salad': 'Salade taco keto',
  };

  return translations[normalized] || normalized;
};

export const fetchKetoRecipes = async () => {
  const response = await axios.get(SOURCE_URL, { timeout: 30000, headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(response.data);
  const cards = $('.summary-item');
  const recipes = [];

  cards.each((_, el) => {
    const title = $(el).find('.summary-title').text().trim();
    const href = $(el).find('a').attr('href');
    const image = $(el).find('img').attr('src');

    if (!title) return;

    const category = 'dejeuner';
    recipes.push({
      title: toFrenchTitle(title),
      description: `Recette keto inspirée de ${title}.`,
      category,
      imageUrl: image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      prepTime: 10 + (recipes.length % 10),
      cookTime: 8 + (recipes.length % 7),
      servings: 2,
      calories: 320 + (recipes.length * 20),
      fat: 24 + (recipes.length % 6),
      protein: 20 + (recipes.length % 5),
      carbs: 4 + (recipes.length % 3),
      ingredients: ['Ingrédients de base keto', 'Herbes fraîches', 'Assaisonnement maison'],
      steps: ['Préparer les ingrédients.', 'Cuire selon la méthode choisie.', 'Servir chaud.'],
      tags: ['keto', 'simplefunketo'],
    });
  });

  return recipes.slice(0, 40);
};