import axios from 'axios';

(async () => {
  const base = 'http://localhost:4000/api';
  try {
    const recipesRes = await axios.get(`${base}/recipes`);
    const recipes = recipesRes.data;
    console.log('recipes:', recipes.length);
    if (!recipes || recipes.length === 0) return console.error('No recipes');

    const now = new Date();
    const diff = (now.getDay() + 6) % 7; // monday start
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    const weekStart = monday.toISOString().slice(0, 10);
    console.log('weekStart:', weekStart);

    let existing = [];
    try {
      const ex = await axios.get(`${base}/meal-plan`, { params: { weekStart } });
      existing = ex.data || [];
    } catch (e) {
      console.warn('existing fetch error', e.response?.data || e.message);
    }
    console.log('existing:', existing.length);
    for (const m of existing) {
      try {
        await axios.delete(`${base}/meal-plan/${m.id}`);
        console.log('deleted', m.id);
      } catch (e) {
        // ignore
      }
    }

    const days = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
    const syn = {
      dejeuner: ['petit_dejeuner','dejeuner','breakfast'],
      diner: ['diner','souper','dinner'],
      snack: ['snack','snacks'],
      dessert: ['dessert','desserts'],
    };

    const created = [];
    for (const day of days) {
      for (const meal of Object.keys(syn)) {
        let pool = recipes.filter(r => syn[meal].includes(String(r.category || '').toLowerCase()));
        if (!pool || pool.length === 0) pool = recipes;
        const recipe = pool[Math.floor(Math.random() * pool.length)];
        try {
          const body = { week_start: weekStart, day, meal_type: meal, recipe_id: recipe.id, recipe_title: recipe.title };
          const res = await axios.post(`${base}/meal-plan`, body);
          created.push(res.data);
          console.log(`added: ${meal} -> ${recipe.title}`);
        } catch (e) {
          console.warn('failed add', recipe.title, e.response?.data || e.message);
        }
      }
    }

    let final = [];
    try {
      const f = await axios.get(`${base}/meal-plan`, { params: { weekStart } });
      final = f.data || [];
    } catch (e) {
      console.warn('final fetch error', e.response?.data || e.message);
    }
    console.log('final count:', final.length);
    for (const f of final) console.log(`- ${f.day} ${f.meal_type}: ${f.recipe_title}`);
  } catch (e) {
    console.error('Top error', e.response?.data || e.message);
    process.exit(1);
  }
})();
