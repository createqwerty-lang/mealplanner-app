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
    const {
      category,
      q,
      maxTime,
      maxCalories,
      maxCarbs,
      tags,
      sort,
      page = 1,
      limit = 100,
    } = req.query;

    const take = Math.min(Number(limit) || 100, 500);
    const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

    // If DB configured, run Prisma query with filters
    if (env.databaseUrl) {
      const where = {};
      if (category) where.category = { equals: category };
      if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }];
      if (maxCalories) where.calories = { lte: Number(maxCalories) };
      if (maxCarbs) where.carbs = { lte: Number(maxCarbs) };
      if (maxTime) where.AND = [{ OR: [{ prepTime: { lte: Number(maxTime) } }, { cookTime: { lte: Number(maxTime) } } ] }];
      if (tags) {
        const tagList = Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean);
        if (tagList.length) where.tags = { hasSome: tagList };
      }

      const orderBy = {};
      if (sort === 'time') orderBy.prepTime = 'asc';
      else if (sort === 'calories') orderBy.calories = 'desc';
      else orderBy.createdAt = 'desc';

      const recipes = await prisma.recipe.findMany({ where, orderBy, take, skip });
      return res.json(recipes);
    }

    // Fallback: use scraper or seeded data and filter in-memory
    let recipes = await fetchKetoRecipes().catch(() => fallbackRecipes);

    if (q) {
      const term = q.toLowerCase();
      recipes = recipes.filter((r) => (r.title || '').toLowerCase().includes(term) || (r.description || '').toLowerCase().includes(term));
    }

    if (category) recipes = recipes.filter((r) => String(r.category || '').toLowerCase() === String(category).toLowerCase());
    if (maxCalories) recipes = recipes.filter((r) => (r.calories || 0) <= Number(maxCalories));
    if (maxCarbs) recipes = recipes.filter((r) => (r.carbs || 0) <= Number(maxCarbs));
    if (maxTime) recipes = recipes.filter((r) => ((r.prepTime || 0) + (r.cookTime || 0)) <= Number(maxTime));
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean);
      recipes = recipes.filter((r) => tagList.every((t) => (r.tags || []).includes(t)));
    }

    if (sort === 'time') recipes = recipes.sort((a, b) => ((a.prepTime || 0) + (a.cookTime || 0)) - ((b.prepTime || 0) + (b.cookTime || 0)));
    else if (sort === 'calories') recipes = recipes.sort((a, b) => (b.calories || 0) - (a.calories || 0));
    else recipes = recipes; // keep order from scraper

    const start = skip;
    const paged = recipes.slice(start, start + take);
    return res.json(paged);
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
