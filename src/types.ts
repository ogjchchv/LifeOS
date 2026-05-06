export interface TransactionRule {
  id: string;
  keyword: string; // The merchant name or description keyword to match
  category: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  timeSpentMins: number;
}

export interface DietLog {
  id: string;
  meal: string;
  type: 'heavy' | 'medium' | 'light';
  suggestion?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  calcium?: number;
  date: string;
}

export interface WorkoutLog {
  id: string;
  exercise: string;
  type?: 'weight' | 'bodyweight' | 'cardio';
  sets?: number;
  reps?: number;
  weight?: number;
  durationMins?: number;
  distanceKm?: number;
  oneRepMax: number;
  muscleGroup: string;
  date: string;
}

export interface ActivityLog {
  date: string; // YYYY-MM-DD
  steps: number;
  distanceKm: number;
  activeMins: number;
}

export interface WaterLog {
  date: string;
  cups: number;
  target: number;
}

export interface WeightLog {
  id: string;
  weight: number;
  date: string;
}

export interface CommuteLog {
  id: string;
  mode: string;
  durationMins: number;
  distanceKm?: number;
  date: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  type: 'expense' | 'income';
  category: string;
  startDate: string;
  nextRenewalDate: string;
  status: 'active' | 'cancelled';
  reminderDaysBefore?: number;
}

export interface Loan {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  monthlyEMI: number;
  dueDate: string; // Day of month (e.g., '5')
  startDate: string;
  durationMonths: number;
  paidMonths?: string[]; // Array of 'YYYY-MM' strings
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
}

export interface LifeStats {
  xp: number;
  level: number;
  financialScore: number; // 0-100
  savingsRatio: number;
  debtRatio: number;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  autoTrack: boolean;
  waterTarget: number;
  caloriesTarget?: number;
  proteinTarget?: number;
  stepsTarget?: number;
  activeMinsTarget?: number;
  workoutWeeklyTarget?: number;
}
