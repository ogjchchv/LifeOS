import { Task, ActivityLog, DietLog, WaterLog, WorkoutLog } from '../types';

export const DEFAULT_CATEGORIES: string[] = ['food', 'travel', 'shopping', 'subscriptions', 'others'];

export const EXERCISE_DATABASE = [
  { name: 'Bench Press', type: 'weight', muscleGroup: 'Chest' },
  { name: 'Incline Bench Press', type: 'weight', muscleGroup: 'Chest' },
  { name: 'Dumbbell Flyes', type: 'weight', muscleGroup: 'Chest' },
  { name: 'Push-up', type: 'bodyweight', muscleGroup: 'Chest' },
  { name: 'Deadlift', type: 'weight', muscleGroup: 'Back' },
  { name: 'Pull-up', type: 'bodyweight', muscleGroup: 'Back' },
  { name: 'Barbell Row', type: 'weight', muscleGroup: 'Back' },
  { name: 'Lat Pulldown', type: 'weight', muscleGroup: 'Back' },
  { name: 'Squat', type: 'weight', muscleGroup: 'Legs' },
  { name: 'Leg Press', type: 'weight', muscleGroup: 'Legs' },
  { name: 'Lunges', type: 'weight', muscleGroup: 'Legs' },
  { name: 'Calf Raise', type: 'weight', muscleGroup: 'Legs' },
  { name: 'Bodyweight Squat', type: 'bodyweight', muscleGroup: 'Legs' },
  { name: 'Shoulder Press', type: 'weight', muscleGroup: 'Shoulders' },
  { name: 'Lateral Raise', type: 'weight', muscleGroup: 'Shoulders' },
  { name: 'Bicep Curl', type: 'weight', muscleGroup: 'Biceps' },
  { name: 'Tricep Extension', type: 'weight', muscleGroup: 'Triceps' },
  { name: 'Dips', type: 'bodyweight', muscleGroup: 'Triceps' },
  { name: 'Plank', type: 'bodyweight', muscleGroup: 'Core' },
  { name: 'Crunches', type: 'bodyweight', muscleGroup: 'Core' },
  { name: 'Running', type: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Cycling', type: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Swimming', type: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Walking', type: 'cardio', muscleGroup: 'Cardio' },
  { name: 'Burpees', type: 'bodyweight', muscleGroup: 'Cardio' }
];

export function estimateCalories(foodName: string): { cals: number, calcium: number } {
  if (!foodName) return { cals: 0, calcium: 0 };
  const food = foodName.toLowerCase();
  
  const db: Record<string, {cals: number, calc: number}> = {
    apple: { cals: 52, calc: 6 }, banana: { cals: 89, calc: 5 }, orange: { cals: 47, calc: 40 }, 
    mango: { cals: 60, calc: 11 }, chicken: { cals: 239, calc: 15 }, chicken_breast: { cals: 165, calc: 15 },
    egg: { cals: 78, calc: 28 }, rice: { cals: 130, calc: 10 }, roti: { cals: 120, calc: 30 }, 
    dal: { cals: 100, calc: 40 }, pizza: { cals: 266, calc: 188 }, burger: { cals: 295, calc: 80 }, 
    fries: { cals: 312, calc: 18 }, salad: { cals: 20, calc: 30 }, milk: { cals: 42, calc: 125 }, 
    paneer: { cals: 296, calc: 480 }, cheese: { cals: 402, calc: 721 }, beef: { cals: 250, calc: 18 }, 
    fish: { cals: 200, calc: 15 }, salmon: { cals: 208, calc: 9 }, protein: { cals: 120, calc: 100 }, 
    whey: { cals: 120, calc: 100 }, bread: { cals: 265, calc: 260 }, oats: { cals: 389, calc: 54 },
    coffee: { cals: 2, calc: 2 }, tea: { cals: 2, calc: 0 }, pasta: { cals: 131, calc: 7 }, 
    maggi: { cals: 345, calc: 150 }, noodles: { cals: 138, calc: 12 }, icecream: { cals: 207, calc: 128 }, 
    chocolate: { cals: 546, calc: 189 }
  };

  for (const key in db) {
    if (food.includes(key) || key.includes(food)) {
      return { cals: db[key].cals, calcium: db[key].calc };
    }
  }

  let hash = 0;
  for (let i = 0; i < food.length; i++) {
    hash = food.charCodeAt(i) + ((hash << 5) - hash);
  }
  return { cals: 100 + (Math.abs(hash) % 400), calcium: 10 + (Math.abs(hash) % 50) }; 
}

export function estimateMacros(foodName: string): { calories: number, protein: number, carbs: number, fats: number, calcium: number } {
  const { cals, calcium } = estimateCalories(foodName);
  const food = foodName.toLowerCase();
  
  let pRatio = 0.15;
  let cRatio = 0.55;
  let fRatio = 0.30;

  if (food.includes('chicken') || food.includes('egg') || food.includes('whey') || food.includes('paneer') || food.includes('beef') || food.includes('fish') || food.includes('salmon') || food.includes('protein')) {
    pRatio = 0.60; cRatio = 0.05; fRatio = 0.35;
  } else if (food.includes('rice') || food.includes('bread') || food.includes('oats') || food.includes('pasta') || food.includes('roti') || food.includes('dal') || food.includes('maggi') || food.includes('noodles')) {
    pRatio = 0.15; cRatio = 0.70; fRatio = 0.15;
  } else if (food.includes('pizza') || food.includes('burger') || food.includes('fries') || food.includes('cheese') || food.includes('chocolate') || food.includes('icecream') || food.includes('salad')) {
    pRatio = 0.10; cRatio = 0.45; fRatio = 0.45;
  }

  return {
    calories: cals,
    protein: Math.round((cals * pRatio) / 4),
    carbs: Math.round((cals * cRatio) / 4),
    fats: Math.round((cals * fRatio) / 9),
    calcium: calcium
  };
}

export function estimate1RM(weight: number, reps: number): number {
  if (reps <= 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

export function getMuscleGroup(exercise: string): string {
  const ex = exercise.toLowerCase();
  
  // Chest
  if (ex.includes('bench') || ex.includes('push') || ex.includes('chest') || ex.includes('pec') || ex.includes('fly') || ex.includes('pullover')) return 'Chest';
  
  // Back
  if (ex.includes('deadlift') || ex.includes('row') || ex.includes('pull up') || ex.includes('pullup') || ex.includes('lat') || ex.includes('back') || ex.includes('chin up') || ex.includes('shrug')) return 'Back';
  
  // Legs
  if (ex.includes('squat') || ex.includes('leg') || ex.includes('calf') || ex.includes('calves') || ex.includes('lunge') || ex.includes('hack') || ex.includes('glute') || ex.includes('hip thrust') || ex.includes('step') || ex.includes('press')) {
    // "press" might be shoulder press or leg press. Let's be careful.
    if (ex.includes('leg press')) return 'Legs';
    if (ex.includes('shoulder press')) return 'Shoulders';
    if (ex.includes('press') && !ex.includes('leg') && !ex.includes('bench')) {
      // By default overhead press? Just skip to Shoulders instead. Let's remove press from general Leg check.
    } else {
      return 'Legs';
    }
  }
  
  // Shoulders
  if (ex.includes('shoulder') || ex.includes('press') || ex.includes('raise') || ex.includes('deltoid') || ex.includes('arnold') || ex.includes('military')) return 'Shoulders';
  
  // Arms
  if (ex.includes('curl') || ex.includes('bicep') || ex.includes('preacher')) return 'Biceps';
  if (ex.includes('tricep') || ex.includes('extension') || ex.includes('skull') || ex.includes('dip') || ex.includes('pushdown')) return 'Triceps';
  if (ex.includes('arm')) return 'Arms';
  
  // Core
  if (ex.includes('crunch') || ex.includes('sit') || ex.includes('plank') || ex.includes('core') || ex.includes('abs') || ex.includes('raise') && ex.includes('leg') || ex.includes('twist') || ex.includes('wheel')) return 'Core';
  
  // Cardio & Body
  if (ex.includes('run') || ex.includes('jog') || ex.includes('walk') || ex.includes('cycle') || ex.includes('bike') || ex.includes('swim') || ex.includes('rowing') || ex.includes('treadmill') || ex.includes('burpee') || ex.includes('jump')) return 'Cardio';

  return 'Full Body';
}

export function getFoodSuggestion(
  meal: string,
  calories: number,
  todayLogs: DietLog[],
  pastLogs: DietLog[]
): string {
    const food = meal.toLowerCase();
    
    // Check history (e.g. repeated bad meals)
    const recentMeals = pastLogs.slice(0, 10).map(m => m.meal.toLowerCase());
    const isJunk = food.includes('pizza') || food.includes('burger') || food.includes('fries') || food.includes('chocolate');
    const junkCount = recentMeals.filter(m => m.includes('pizza') || m.includes('burger') || m.includes('fries') || m.includes('chocolate')).length;

    if (isJunk) {
      if (junkCount > 3) {
        return "You've had a few heavy meals recently. Maybe swap this for a lighter salad or protein bowl tomorrow to stay balanced.";
      }
      return "Indulging a bit! Just make sure to hit your protein targets for the day and stay well-hydrated.";
    }

    if (food.includes('salad') || food.includes('fruit') || food.includes('apple') || food.includes('veg')) {
      return "Excellent choice. High fiber foods like this improve digestion and keep your energy levels exceptionally stable.";
    }

    if (food.includes('dal') || food.includes('chicken') || food.includes('egg') || food.includes('protein') || food.includes('whey')) {
      const todayProtein = todayLogs.reduce((acc, curr) => acc + (curr.protein || 0), 0);
      if (todayProtein > 100) {
         return "Great protein intake! You are well on your way to optimal muscle recovery for today.";
      }
      return "Solid protein source. Crucial for maintaining lean muscle mass and boosting your metabolism.";
    }

    if (calories > 800) {
        return "This is a heavy and calorie-dense meal. Try taking a 10-minute walk afterwards to help stabilize your blood sugar.";
    }

    return "Looks like a balanced meal. Consistency is key, keep tracking to stay on top of your nutritional goals!";
}

export function getWorkoutNudge(
  exercise: string,
  currentVol: number,
  pastWorkouts: WorkoutLog[]
): string {
  const ex = exercise.toLowerCase();
  
  // Find previous workouts for this exact exercise
  const pastEx = pastWorkouts.filter(w => w.exercise.toLowerCase() === ex);
  
  if (pastEx.length > 0) {
    const prevWorkout = pastEx.reduce((prev, current) => (new Date(prev.date) > new Date(current.date) ? prev : current));
    const prevVol = (prevWorkout.sets || 0) * (prevWorkout.reps || 0) * (prevWorkout.weight || 0);
    
    if (currentVol > prevVol) {
      const inc = Math.round(((currentVol - prevVol) / prevVol) * 100);
      return `Awesome! You increased your volume on ${exercise} by ${inc}% compared to last time. Progressive overload achieved!`;
    } else if (currentVol < prevVol) {
      return `Good burn. You did slightly less volume than your last session (${prevVol} kg). Make sure you are recovering adequately.`;
    } else {
      return `Consistent effort! You matched your previous volume exactly. Try adding one more rep next time to push your limits.`;
    }
  }

  const group = getMuscleGroup(exercise);
  if (group === 'Legs') return `First time logging ${exercise}! Leg days are metabolically taxing—make sure to eat enough carbs post-workout.`;
  if (group === 'Chest') return `New chest exercise tracked! Focus on the deep stretch at the bottom of the movement.`;
  if (group === 'Back') return `Tracking ${exercise} for the first time. Keep your core tight and lead with your elbows to engage the lats.`;
  
  return `New movement added: ${exercise}. Focus on perfect form over heavy weight for the first few sessions.`;
}

export function calculateLifeScore(
  tasks: Task[],
  activity: ActivityLog[],
  water: WaterLog[],
  workouts: WorkoutLog[],
  financeScore: number = 70
) {
  const today = new Date().toISOString().split('T')[0];
  
  // Productivity Score (max 30)
  const todayTasks = tasks.filter(t => t.createdAt.startsWith(today));
  let productivityScore = 10;
  if (todayTasks.length > 0) {
    const completed = todayTasks.filter(t => t.completed).length;
    productivityScore = (completed / todayTasks.length) * 30;
  }

  // Health Score calculation (max 40)
  let healthScore = 0;
  
  // Activity (max 20)
  const todayAct = activity.find(a => a.date === today);
  if (todayAct) {
    healthScore += Math.min(20, (todayAct.steps / 8000) * 20); 
  }

  // Water (max 10)
  const todayWater = water.find(w => w.date === today);
  if (todayWater && todayWater.target > 0) {
    healthScore += Math.min(10, (todayWater.cups / todayWater.target) * 10);
  }

  // Workouts (max 10)
  const todayWorkouts = workouts.filter(w => w.date.startsWith(today));
  if (todayWorkouts.length > 0) {
    healthScore += 10;
  }

  // Finance Score (max 30)
  const financeComponent = (financeScore / 100) * 30;

  const overall = productivityScore + healthScore + financeComponent;

  return {
    productivity: Math.round(productivityScore),
    health: Math.round(healthScore),
    finance: Math.round(financeComponent),
    overall: Math.min(100, Math.round(overall))
  };
}
