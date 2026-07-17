import prisma from '../src/config/prisma.js';
import { hashPassword } from '../src/utils/auth.js';

const recipes = [
  {
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
    steps: ['Faire cuire le saumon à la poêle.', 'Couper l’avocat et assembler le bowl.', 'Ajouter un filet de citron.'],
    tags: ['rapide', 'keto', 'dîner']
  },
  {
    title: 'Oeufs brouillés au bacon',
    description: 'Un plat simple et savoureux pour un déjeuner ou un brunch keto.',
    category: 'dejeuner',
    imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800',
    prepTime: 5,
    cookTime: 8,
    servings: 2,
    calories: 410,
    fat: 34,
    protein: 24,
    carbs: 3,
    ingredients: ['4 oeufs', '100 g de bacon', '30 g de beurre', '1 pincée de sel'],
    steps: ['Faire revenir le bacon jusqu’à ce qu’il soit croustillant.', 'Ajouter les oeufs battus et brouiller doucement.', 'Assaisonner et servir chaud.'],
    tags: ['keto', 'déjeuner']
  },
  {
    title: 'Omelettes Blackstone',
    description: 'Omelettes riches en protéines, idéales pour un déjeuner keto.',
    category: 'dejeuner',
    imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
    prepTime: 8,
    cookTime: 10,
    servings: 2,
    calories: 390,
    fat: 28,
    protein: 24,
    carbs: 4,
    ingredients: ['4 oeufs', '50 g de fromage', '50 g de champignons', '1 c. à soupe de crème fraîche', 'persil'],
    steps: ['Battre les oeufs avec la crème.', 'Cuire les légumes et le fromage.', 'Verser les oeufs et cuire l’omelette.'],
    tags: ['keto', 'déjeuner']
  },
  {
    title: 'Oeufs feta pesto',
    description: 'Un déjeuner savoureux avec une touche méditerranéenne.',
    category: 'dejeuner',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-c9e7f0c6aca8?w=800',
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    calories: 435,
    fat: 34,
    protein: 22,
    carbs: 5,
    ingredients: ['4 oeufs', '80 g de feta', '2 c. à soupe de pesto', 'quelques tomates cerises'],
    steps: ['Mélanger les oeufs et la feta.', 'Cuire doucement à la poêle.', 'Ajouter le pesto et servir.'],
    tags: ['keto', 'déjeuner']
  },
  {
    title: 'Muffins d’oeufs',
    description: 'Petits muffins salés parfaits comme snack ou déjeuner sur le pouce.',
    category: 'snack',
    imageUrl: 'https://images.unsplash.com/photo-1601792687539-580fda5691d5?w=800',
    prepTime: 10,
    cookTime: 18,
    servings: 6,
    calories: 140,
    fat: 11,
    protein: 8,
    carbs: 2,
    ingredients: ['6 oeufs', '100 g de jambon', '50 g de fromage', 'sel', 'poivre'],
    steps: ['Préchauffer le four.', 'Mélanger tous les ingrédients.', 'Verser dans des moules et cuire 18 minutes.'],
    tags: ['keto', 'snack']
  },
  {
    title: 'Bacon fondant',
    description: 'Une garniture croustillante et riche pour accompagner un dîner keto.',
    category: 'diner',
    imageUrl: 'https://images.unsplash.com/photo-1516684669134-de6aea1e0c38?w=800',
    prepTime: 5,
    cookTime: 12,
    servings: 2,
    calories: 320,
    fat: 28,
    protein: 16,
    carbs: 1,
    ingredients: ['200 g de bacon', '1 c. à soupe d’huile de coco', 'quelques herbes'],
    steps: ['Faire cuire le bacon jusqu’à ce qu’il soit croustillant.', 'Égoutter et servir avec une salade verte.'],
    tags: ['keto', 'dîner']
  },
  {
    title: 'Chaffles pain perdu keto',
    description: 'Un dessert keto sucré et moelleux pour les gourmands.',
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    prepTime: 8,
    cookTime: 10,
    servings: 2,
    calories: 280,
    fat: 22,
    protein: 12,
    carbs: 4,
    ingredients: ['2 oeufs', '50 g de fromage râpé', '1 c. à soupe de sirop d’érable keto', '1 c. à soupe de beurre'],
    steps: ['Mélanger les oeufs et le fromage.', 'Cuire en chaffle.', 'Servir avec un peu de sirop keto.'],
    tags: ['keto', 'dessert']
  },
  {
    title: 'Pudding aux graines de chia',
    description: 'Un dessert léger et rassasiant, riche en fibres.',
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    calories: 220,
    fat: 14,
    protein: 6,
    carbs: 8,
    ingredients: ['4 c. à soupe de graines de chia', '250 ml de lait d’amande', '1 c. à café de vanille', 'quelques fruits rouges'],
    steps: ['Mélanger les graines de chia et le lait.', 'Laisser reposer au moins 2 heures.', 'Servir avec des fruits rouges.'],
    tags: ['keto', 'dessert']
  }
];

async function main() {
  await prisma.recipe.createMany({ data: recipes, skipDuplicates: true });
  await prisma.newsletterSubscriber.createMany({
    data: [{ email: 'demo@example.com', firstName: 'Demo' }],
    skipDuplicates: true,
  });

  const adminEmail = 'angel.jmartel@gmail.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await hashPassword('Allo123!');
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Admin',
        role: 'ADMIN',
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
