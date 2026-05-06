import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Task, DietLog, WorkoutLog, ActivityLog, AppSettings, WaterLog, WeightLog, Transaction, TransactionRule, Subscription, Loan, CommuteLog, LifeStats, FinancialGoal } from '../types';

export const MOCK_UPI_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 250, category: 'food', description: 'Zomato/Swiggy', date: new Date().toISOString() },
  { id: '2', amount: 1500, category: 'shopping', description: 'Amazon - Sneakers', date: new Date().toISOString() },
  { id: '3', amount: 350, category: 'travel', description: 'Uber/Ola', date: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', amount: 120, category: 'food', description: 'College Canteen', date: new Date(Date.now() - 86400000).toISOString() },
  { id: '5', amount: 499, category: 'subscriptions', description: 'Netflix', date: new Date(Date.now() - 172800000).toISOString() },
  { id: '6', amount: 80, category: 'food', description: 'Cold Coffee', date: new Date(Date.now() - 259200000).toISOString() },
];

interface LifeContextProps {
  // Tasks
  tasks: Task[];
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'completed' | 'timeSpentMins'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTaskTime: (id: string, mins: number) => void;

  // Health
  dietLogs: DietLog[];
  addDietLog: (l: Omit<DietLog, 'id'>) => void;
  deleteDietLog: (id: string) => void;
  workouts: WorkoutLog[];
  addWorkout: (w: Omit<WorkoutLog, 'id'>) => void;
  deleteWorkout: (id: string) => void;
  clearWorkouts: () => void;
  activity: ActivityLog[];
  updateActivity: (steps: number, distance: number, activeMins: number) => void;
  
  // New LifeOS types
  water: WaterLog[];
  updateWater: (cups: number) => void;
  weight: WeightLog[];
  addWeight: (w: number) => void;
  commute: CommuteLog[];
  addCommute: (log: Omit<CommuteLog, 'id'>) => void;

  // Finance
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id' | 'category' | 'date'> & { category?: string }) => void;
  deleteTransaction: (id: string) => void;
  transactionRules: TransactionRule[];
  addTransactionRule: (r: Omit<TransactionRule, 'id'>) => void;
  deleteTransactionRule: (id: string) => void;

  // Subscriptions & Loans & Goals
  subscriptions: Subscription[];
  addSubscription: (s: Omit<Subscription, 'id'>) => void;
  deleteSubscription: (id: string) => void;
  loans: Loan[];
  addLoan: (l: Omit<Loan, 'id'>) => void;
  deleteLoan: (id: string) => void;
  payLoanEMI: (id: string, monthKey: string) => void;
  goals: FinancialGoal[];
  addGoal: (g: Omit<FinancialGoal, 'id'>) => void;
  updateGoalProgress: (id: string, addedAmount: number) => void;
  deleteGoal: (id: string) => void;

  // Gamification & Stats
  stats: LifeStats;
  addXP: (amount: number) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}

const LifeContext = createContext<LifeContextProps | undefined>(undefined);

export function LifeProvider({ children }: { children: ReactNode }) {
  // Load initial states
  const [tasks, setTasks] = useState<Task[]>(() => JSON.parse(localStorage.getItem('omi_tasks') || '[]'));
  const [dietLogs, setDietLogs] = useState<DietLog[]>(() => JSON.parse(localStorage.getItem('omi_diet') || '[]'));
  const [workouts, setWorkouts] = useState<WorkoutLog[]>(() => JSON.parse(localStorage.getItem('omi_workouts') || '[]'));
  const [activity, setActivity] = useState<ActivityLog[]>(() => JSON.parse(localStorage.getItem('omi_activity') || '[]'));
  const [water, setWater] = useState<WaterLog[]>(() => JSON.parse(localStorage.getItem('omi_water') || '[]'));
  const [weight, setWeight] = useState<WeightLog[]>(() => JSON.parse(localStorage.getItem('omi_weight') || '[]'));
  const [commute, setCommute] = useState<CommuteLog[]>(() => JSON.parse(localStorage.getItem('omi_commute') || '[]'));
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('omi_transactions');
    return saved ? JSON.parse(saved) : MOCK_UPI_TRANSACTIONS;
  });
  const [transactionRules, setTransactionRules] = useState<TransactionRule[]>(() => JSON.parse(localStorage.getItem('omi_transaction_rules') || '[]'));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => JSON.parse(localStorage.getItem('omi_subscriptions') || '[]'));
  const [loans, setLoans] = useState<Loan[]>(() => JSON.parse(localStorage.getItem('omi_loans') || '[]'));
  const [goals, setGoals] = useState<FinancialGoal[]>(() => JSON.parse(localStorage.getItem('omi_goals') || '[]'));
  const [xp, setXP] = useState<number>(() => Number(localStorage.getItem('omi_xp') || '0'));

  const [settings, setSettings] = useState<AppSettings>(() => JSON.parse(localStorage.getItem('omi_settings') || '{"notificationsEnabled": false, "autoTrack": false, "waterTarget": 8}'));

  // Persist states
  useEffect(() => localStorage.setItem('omi_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('omi_diet', JSON.stringify(dietLogs)), [dietLogs]);
  useEffect(() => localStorage.setItem('omi_workouts', JSON.stringify(workouts)), [workouts]);
  useEffect(() => localStorage.setItem('omi_activity', JSON.stringify(activity)), [activity]);
  useEffect(() => localStorage.setItem('omi_water', JSON.stringify(water)), [water]);
  useEffect(() => localStorage.setItem('omi_weight', JSON.stringify(weight)), [weight]);
  useEffect(() => localStorage.setItem('omi_commute', JSON.stringify(commute)), [commute]);
  useEffect(() => localStorage.setItem('omi_transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('omi_transaction_rules', JSON.stringify(transactionRules)), [transactionRules]);
  useEffect(() => localStorage.setItem('omi_subscriptions', JSON.stringify(subscriptions)), [subscriptions]);
  useEffect(() => localStorage.setItem('omi_loans', JSON.stringify(loans)), [loans]);
  useEffect(() => localStorage.setItem('omi_goals', JSON.stringify(goals)), [goals]);
  useEffect(() => localStorage.setItem('omi_xp', xp.toString()), [xp]);
  useEffect(() => localStorage.setItem('omi_settings', JSON.stringify(settings)), [settings]);

  // -- TASKS --
  const addTask = (t: Omit<Task, 'id' | 'createdAt' | 'completed' | 'timeSpentMins'>) => {
    setTasks(p => [{ ...t, id: crypto.randomUUID(), createdAt: new Date().toISOString(), timeSpentMins: 0, completed: false }, ...p]);
    addXP(15);
  };
  const toggleTask = (id: string) => {
    setTasks(p => p.map(t => {
      if (t.id === id && !t.completed) addXP(25);
      return t.id === id ? { ...t, completed: !t.completed } : t;
    }));
  };
  const deleteTask = (id: string) => setTasks(p => p.filter(t => t.id !== id));
  const updateTaskTime = (id: string, mins: number) => {
    setTasks(p => p.map(t => t.id === id ? { ...t, timeSpentMins: t.timeSpentMins + mins } : t));
    addXP(mins); // 1 XP per minute focused
  };

  // -- HEALTH --
  const addDietLog = (l: Omit<DietLog, 'id'>) => {
    setDietLogs(p => [{ ...l, id: crypto.randomUUID() }, ...p]);
    addXP(10);
  };
  const deleteDietLog = (id: string) => setDietLogs(p => p.filter(l => l.id !== id));
  const addWorkout = (w: Omit<WorkoutLog, 'id'>) => {
    setWorkouts(p => [{ ...w, id: crypto.randomUUID() }, ...p]);
    addXP(50);
  };
  const deleteWorkout = (id: string) => setWorkouts(p => p.filter(w => w.id !== id));
  const clearWorkouts = () => setWorkouts([]);
  
  const updateActivity = (steps: number, distance: number, activeMins: number) => {
    const today = new Date().toISOString().split('T')[0];
    setActivity(prev => {
      const existing = prev.find(a => a.date === today);
      if (existing) {
        return prev.map(a => a.date === today ? { ...a, steps, distanceKm: distance, activeMins } : a);
      }
      return [...prev, { date: today, steps, distanceKm: distance, activeMins }];
    });
  };

  const updateWater = (cups: number) => {
    const today = new Date().toISOString().split('T')[0];
    setWater(prev => {
      let todayLog = prev.find(a => a.date === today) || { date: today, cups: 0, target: settings?.waterTarget || 8 };
      return [{ ...todayLog, cups: Number(cups.toFixed(1)) }, ...prev.filter(a => a.date !== today)];
    });
  };

  const addWeight = (w: number) => setWeight(p => [...p, { id: Date.now().toString(), weight: w, date: new Date().toISOString() }]);
  const addCommute = (log: Omit<CommuteLog, 'id'>) => setCommute(p => [{ ...log, id: Date.now().toString() }, ...p]);

  const addTransaction = (t: Omit<Transaction, 'id' | 'category' | 'date'> & { category?: string }) => {
    // Determine category based on custom rules, else default 'others'
    // A quick default categorizer, then override with custom rules
    let category = t.category || 'others';
    
    // Quick keyword default categorization
    const desc = t.description.toLowerCase();
    
    if (!t.category) {
      if (desc.includes('zomato') || desc.includes('swiggy') || desc.includes('food') || desc.includes('restaurant') || desc.includes('cafe')) category = 'food';
      else if (desc.includes('uber') || desc.includes('ola') || desc.includes('train') || desc.includes('metro') || desc.includes('flight')) category = 'travel';
      else if (desc.includes('amazon') || desc.includes('flipkart') || desc.includes('myntra') || desc.includes('mart')) category = 'shopping';
      else if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('prime')) category = 'subscriptions';
      else if (desc.includes('movie') || desc.includes('ticket') || desc.includes('cinema')) category = 'entertainment';

      // Override with custom rules
      for (const rule of transactionRules) {
        if (desc.includes(rule.keyword.toLowerCase())) {
          category = rule.category;
          break; // Match first rule
        }
      }
    } else {
      // Even if AI suggested a category, user custom rules should still take precedence
      for (const rule of transactionRules) {
        if (desc.includes(rule.keyword.toLowerCase())) {
          category = rule.category;
          break; // Match first rule
        }
      }
    }

    setTransactions(p => [{ ...t, id: Date.now().toString(), date: new Date().toISOString(), category }, ...p]);
    addXP(5);
  };
  const deleteTransaction = (id: string) => setTransactions(p => p.filter(t => t.id !== id));

  const addTransactionRule = (r: Omit<TransactionRule, 'id'>) => {
    setTransactionRules(p => {
      const newRules = [{ ...r, id: Date.now().toString() }, ...p];
      // Retroactively apply rule to recent transactions ? Optional, but let's just do it
      setTransactions(txs => txs.map(tx => {
        if (tx.description.toLowerCase().includes(r.keyword.toLowerCase())) {
          return { ...tx, category: r.category };
        }
        return tx;
      }));
      return newRules;
    });
  };
  const deleteTransactionRule = (id: string) => setTransactionRules(p => p.filter(r => r.id !== id));

  const addSubscription = (s: Omit<Subscription, 'id'>) => setSubscriptions(p => [{ ...s, id: crypto.randomUUID() }, ...p]);
  const deleteSubscription = (id: string) => setSubscriptions(p => p.filter(s => s.id !== id));

  const addLoan = (l: Omit<Loan, 'id'>) => setLoans(p => [{ ...l, id: crypto.randomUUID() }, ...p]);
  const deleteLoan = (id: string) => setLoans(p => p.filter(l => l.id !== id));
  const payLoanEMI = (id: string, monthKey: string) => {
    setLoans(p => p.map(l => {
      if (l.id === id) {
        const paidMonths = l.paidMonths || [];
        if (!paidMonths.includes(monthKey)) {
          return {
            ...l,
            remainingAmount: Math.max(0, l.remainingAmount - l.monthlyEMI),
            paidMonths: [...paidMonths, monthKey]
          };
        }
      }
      return l;
    }));
  };

  const addGoal = (g: Omit<FinancialGoal, 'id'>) => setGoals(p => [{ ...g, id: crypto.randomUUID() }, ...p]);
  const updateGoalProgress = (id: string, addedAmount: number) => {
    setGoals(p => p.map(g => g.id === id ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + addedAmount) } : g));
  };
  const deleteGoal = (id: string) => setGoals(p => p.filter(g => g.id !== id));

  // -- GAMIFICATION --
  const addXP = (amount: number) => setXP(p => p + amount);

  const stats: LifeStats = useMemo(() => {
    // Financial Score calculation
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlySpending = transactions
      .filter(tx => {
        const d = new Date(tx.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);

    const recurringIncome = subscriptions
      .filter(s => s.type === 'income' && s.status === 'active')
      .reduce((sum, s) => sum + (s.billingCycle === 'monthly' ? s.amount : s.amount / 12), 0);

    const recurringExpenses = subscriptions
      .filter(s => s.type === 'expense' && s.status === 'active')
      .reduce((sum, s) => sum + (s.billingCycle === 'monthly' ? s.amount : s.amount / 12), 0);

    const baseIncome = 20000; // BASE STIPEND/POCKET MONEY
    const totalMonthlyIncome = baseIncome + recurringIncome;
    const totalMonthlyOutflow = monthlySpending + recurringExpenses;

    const savings = totalMonthlyIncome - totalMonthlyOutflow;
    const savingsRatio = totalMonthlyIncome > 0 ? Math.max(0, savings / totalMonthlyIncome) : 0;
    
    const totalLoanEMI = loans.reduce((sum, l) => sum + l.monthlyEMI, 0);
    const debtRatio = totalMonthlyIncome > 0 ? totalLoanEMI / totalMonthlyIncome : 0;

    // Score components: Savings (50%), Debt Management (30%), Regularity (20%)
    const financialScore = Math.round(
      (savingsRatio * 50) + 
      (Math.max(0, 1 - debtRatio) * 30) + 
      (transactions.length > 5 ? 20 : (transactions.length / 5) * 20)
    );

    return {
      xp,
      level: Math.floor(xp / 1000) + 1,
      financialScore: Math.min(100, financialScore),
      savingsRatio,
      debtRatio
    };
  }, [transactions, subscriptions, loans, xp]);

  // -- SETTINGS --
  const updateSettings = (s: Partial<AppSettings>) => setSettings(p => ({ ...p, ...s }));

  // Auto Tracker using DeviceMotion
  useEffect(() => {
    if (!settings.autoTrack) return;
    
    let lastZ = 0;
    let lastTime = 0;
    const threshold = 1.2;
    
    const handleMotion = (e: DeviceMotionEvent) => {
      const z = e.accelerationIncludingGravity?.z || 0;
      const now = Date.now();
      
      if (Math.abs(z - lastZ) > threshold && (now - lastTime > 350)) {
        const today = new Date().toISOString().split('T')[0];
        setActivity(prev => {
          let todayLog = prev.find(a => a.date === today) || { date: today, steps: 0, distanceKm: 0, activeMins: 0 };
          const newSteps = todayLog.steps + 1; 
          const newDist = todayLog.distanceKm + 0.000762;
          const newMins = todayLog.activeMins + (1/60); // approx
          return [...prev.filter(a => a.date !== today), { ...todayLog, steps: newSteps, distanceKm: newDist, activeMins: Math.round(newMins) }];
        });
        lastTime = now;
      }
      lastZ = z;
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [settings.autoTrack]);


    return (
    <LifeContext.Provider value={{
      tasks, addTask, toggleTask, deleteTask, updateTaskTime,
      dietLogs, addDietLog, deleteDietLog, workouts, addWorkout, deleteWorkout, clearWorkouts, activity, updateActivity,
      water, updateWater, weight, addWeight, commute, addCommute,
      transactions, addTransaction, deleteTransaction, transactionRules, addTransactionRule, deleteTransactionRule,
      subscriptions, addSubscription, deleteSubscription,
      loans, addLoan, deleteLoan, payLoanEMI,
      goals, addGoal, updateGoalProgress, deleteGoal,
      stats, addXP,
      settings, updateSettings
    }}>
      {children}
    </LifeContext.Provider>
  );
}

export function useLifeOS() {
  const context = useContext(LifeContext);
  if (!context) throw new Error("useLifeOS must be used within LifeProvider");
  return context;
}

