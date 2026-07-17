import prisma from '../src/config/prisma.js';

const recipes = [
  {
    title: 'Bowl keto de saumon',
    description: 'Un repas rapide et riche en graisses',
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
    tags: ['rapide', 'keto']
  },
  {
    title: 'Oeufs brouillés au bacon',
    description: 'Petit-déjeuner gourmand',
    category: 'petit_dejeuner',
    imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800',
    prepTime: 5,
    cookTime: 8,
    servings: 2,
    calories: 410,
    fat: 34,
    protein: 24,
    carbs: 3,
    ingredients: ['4 oeufs', '100 g de bacon', '30 g de beurre', '1 pincée de sel'],
    steps: ['Faire revenir le bacon', 'Ajouter les oeufs'],
    tags: ['breakfast', 'keto']
  }
];

async function main() {
  await prisma.recipe.createMany({ data: recipes, skipDuplicates: true });
  await prisma.newsletterSubscriber.createMany({
    data: [{ email: 'demo@example.com', firstName: 'Demo' }],
    skipDuplicates: true,
  });
}

main().finally(() => prisma.$disconnect());
