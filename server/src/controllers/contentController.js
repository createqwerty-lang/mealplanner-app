import prisma from '../config/prisma.js';

export const listRecipes = async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
};

export const getRecipe = async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({ where: { id: req.params.id } });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
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
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
};

export const createSubscriber = async (req, res) => {
  try {
    const subscriber = await prisma.newsletterSubscriber.create({ data: req.body });
    res.status(201).json(subscriber);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create subscriber' });
  }
};
