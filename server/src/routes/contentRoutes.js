import { Router } from 'express';
import { createMealPlanEntry, createSubscriber, deleteMealPlanEntry, getRecipe, listMealPlan, listRecipes, listSubscribers } from '../controllers/contentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();
router.get('/recipes', listRecipes);
router.get('/recipes/:id', getRecipe);
router.get('/meal-plan', listMealPlan);
router.post('/meal-plan', createMealPlanEntry);
router.delete('/meal-plan/:id', deleteMealPlanEntry);
router.get('/subscribers', authenticate, authorize('ADMIN'), listSubscribers);
router.post('/subscribers', createSubscriber);

export default router;
