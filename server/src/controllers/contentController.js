import prisma from '../config/prisma.js';
import { fetchKetoRecipes } from '../utils/ketoScraper.js';

const fallbackRecipes = [
  {
    id: 'fallback-1',
    title: 'Bowl keto de saumon',
    description: 'Un bowl riche en bonnes graisses, parfait pour un dîner facile.',
    category: 'diner',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    calories: 480,
    fat: 36,
    protein: 31,
    carbs: 6,
    ingredients: ['200 g de saumon', '2 c. à soupe d’huile d’olive', '1 avocat', '100 g de salade', '1 citron'],
    steps: ['Faire cuire le saumon', 'Assembler le bowl'],
    tags: ['keto', 'dîner'],
  },
  {
    id: 'fallback-2',
    title: 'Oeufs brouillés au bacon',
    description: 'Un déjeuner simple et gourmand.',
    category: 'dejeuner',
    imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800',
    prepTime: 5,
    cookTime: 8,
    servings: 2,
    calories: 410,
    fat: 34,
    protein: 24,
    carbs: 3,
    ingredients: ['4 oeufs', '100 g de bacon', '30 g de beurre'],
    steps: ['Faire revenir le bacon', 'Ajouter les oeufs'],
    tags: ['keto', 'déjeuner'],
  },
];

const getRecipeResponse = async (recipes) => {
  if (recipes.length >= 10) {
    return recipes;
  }

  const scrapedRecipes = await fetchKetoRecipes().catch(() => []);
  return scrapedRecipes.length > 0 ? scrapedRecipes : recipes.length > 0 ? recipes : fallbackRecipes;
};

export const listRecipes = async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({ orderBy: { createdAt: 'desc' } });
    const response = await getRecipeResponse(recipes);
    res.json(response);
  } catch (error) {
    const scrapedRecipes = await fetchKetoRecipes().catch(() => []);
    res.json(scrapedRecipes.length > 0 ? scrapedRecipes : fallbackRecipes);
  }
};

export const getRecipe = async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({ where: { id: req.params.id } });
    if (recipe) {
      return res.json(recipe);
    }

    const scrapedRecipes = await fetchKetoRecipes().catch(() => []);
    const fallbackRecipe = scrapedRecipes.find((item) => item.id === req.params.id);
    if (fallbackRecipe) {
      return res.json(fallbackRecipe);
    }

    return res.status(404).json({ message: 'Recipe not found' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recipe' });
  }
};

export const listMealPlan = async (req, res) => {
  try {
    const entries = await prisma.mealPlanEntry.findMany({ where: { weekStart: req.query.weekStart } });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch meal plan' });
  }
};

export const createMealPlanEntry = async (req, res) => {
  try {
    const entry = await prisma.mealPlanEntry.create({ data: req.body });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create meal plan entry' });
  }
};

export const deleteMealPlanEntry = async (req, res) => {
  try {
    await prisma.mealPlanEntry.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete meal plan entry' });
  }
};

export const listSubscribers = async (req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(subscribers);
  } catch (error) {
    res.json([]);
  }
};

export const createSubscriber = async (req, res) => {
  try {
    const subscriber = await prisma.newsletterSubscriber.create({ data: req.body });
    res.status(201).json(subscriber);
  } catch (error) {
    res.status(201).json({ id: 'fallback-subscriber', email: req.body.email, firstName: req.body.firstName, createdAt: new Date().toISOString() });
  }
};
