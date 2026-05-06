import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  IndianRupee, ChevronLeft, ChevronRight, ShoppingBag, Utensils, 
  Plane, Tv, Coffee, ReceiptText, CalendarDays, PieChart as PieChartIcon,
  Pizza, CarTaxiFront, Film, ShoppingCart, TrainFront, Smartphone,
  Library, Shirt, Gamepad2, Ticket, Fuel, Plus, LayoutDashboard, TrendingUp, TrendingDown,
  Stethoscope, Pill, Zap, Home, Gift, BriefcaseMedical, Wallet, Dumbbell, Settings, Trash2, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import { format, subDays, addDays, isSameDay, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths, isSameMonth, addMonths } from 'date-fns';
import { useLifeOS } from '../context/LifeContext';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const getIconForTransaction = (category: string, description: string) => {
  const desc = description.toLowerCase();
  
  if (category === 'food' || category === 'dining' || category === 'grocery') {
    if (desc.includes('coffee') || desc.includes('starbucks') || desc.includes('cafe')) return <Coffee size={18} className="text-amber-500" />;
    if (desc.includes('pizza') || desc.includes('dominos')) return <Pizza size={18} className="text-orange-500" />;
    if (desc.includes('zomato') || desc.includes('swiggy')) return <Utensils size={18} className="text-red-500" />;
    if (desc.includes('groceries') || desc.includes('mart') || desc.includes('blinkit') || desc.includes('instamart') || desc.includes('zepto')) return <ShoppingCart size={18} className="text-emerald-500" />;
    return <Utensils size={18} className="text-orange-400" />;
  }
  
  if (category === 'travel' || category === 'transport') {
    if (desc.includes('uber') || desc.includes('ola') || desc.includes('cab') || desc.includes('rapido')) return <CarTaxiFront size={18} className="text-yellow-500" />;
    if (desc.includes('train') || desc.includes('irctc') || desc.includes('metro')) return <TrainFront size={18} className="text-blue-600" />;
    if (desc.includes('flight') || desc.includes('air') || desc.includes('indigo') || desc.includes('vistara')) return <Plane size={18} className="text-blue-400" />;
    if (desc.includes('fuel') || desc.includes('petrol') || desc.includes('pump')) return <Fuel size={18} className="text-stone-500" />;
    return <Plane size={18} className="text-blue-400" />;
  }
  
  if (category === 'shopping') {
    if (desc.includes('amazon') || desc.includes('flipkart') || desc.includes('meesho')) return <ShoppingCart size={18} className="text-yellow-400" />;
    if (desc.includes('sneakers') || desc.includes('myntra') || desc.includes('clothes') || desc.includes('ajio') || desc.includes('zara')) return <Shirt size={18} className="text-pink-400" />;
    return <ShoppingBag size={18} className="text-pink-400" />;
  }
  
  if (category === 'subscriptions' || category === 'entertainment') {
    if (desc.includes('netflix') || desc.includes('prime') || desc.includes('hotstar') || desc.includes('cinema')) return <Film size={18} className="text-red-600" />;
    if (desc.includes('spotify') || desc.includes('music') || desc.includes('apple')) return <Smartphone size={18} className="text-green-500" />;
    if (desc.includes('gaming') || desc.includes('steam') || desc.includes('course') || desc.includes('psn')) return <Gamepad2 size={18} className="text-purple-500" />;
    if (desc.includes('movie') || desc.includes('ticket') || desc.includes('bookmyshow')) return <Ticket size={18} className="text-amber-500" />;
    return <Tv size={18} className="text-purple-400" />;
  }

  if (category === 'education') {
    if (desc.includes('udemy') || desc.includes('coursera') || desc.includes('course')) return <Library size={18} className="text-indigo-400" />;
    return <Library size={18} className="text-indigo-400" />;
  }

  if (category === 'health' || category === 'medical') {
    if (desc.includes('pharmacy') || desc.includes('apollo') || desc.includes('meds') || desc.includes('1mg')) return <Pill size={18} className="text-teal-400" />;
    if (desc.includes('doctor') || desc.includes('clinic') || desc.includes('hospital')) return <Stethoscope size={18} className="text-emerald-400" />;
    if (desc.includes('gym') || desc.includes('cult') || desc.includes('fitness')) return <Dumbbell size={18} className="text-slate-400" />;
    return <BriefcaseMedical size={18} className="text-teal-500" />;
  }

  if (category === 'bills' || category === 'utilities') {
    if (desc.includes('electricity') || desc.includes('power') || desc.includes('bescom')) return <Zap size={18} className="text-yellow-400" />;
    if (desc.includes('recharge') || desc.includes('jio') || desc.includes('airtel') || desc.includes('vi')) return <Smartphone size={18} className="text-blue-400" />;
    return <ReceiptText size={18} className="text-neutral-400" />;
  }

  if (category === 'home' || category === 'rent') {
    return <Home size={18} className="text-orange-300" />;
  }

  if (category === 'gifts' || category === 'donations') {
    return <Gift size={18} className="text-rose-400" />;
  }

  return <Wallet size={18} className="text-neutral-400" />;
};

export default function Finance() {
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'monthly' | 'subscriptions' | 'loans' | 'goals'>('overview');

  return (
    <div className="p-6 space-y-6">
      <header className="pt-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Finances</h1>
        <p className="text-sm font-medium text-neutral-400">Track and manage your spending.</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-neutral-900 border border-neutral-800 rounded-2xl p-1 mb-6 mt-4 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 min-w-[80px] py-2 text-[10px] sm:text-xs font-bold rounded-xl transition flex justify-center items-center gap-2 ${
            activeTab === 'overview' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <LayoutDashboard size={14} /> Overview
        </button>
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 min-w-[80px] py-2 text-[10px] sm:text-xs font-bold rounded-xl transition flex justify-center items-center gap-2 ${
            activeTab === 'daily' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <CalendarDays size={14} /> Daily
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex-1 min-w-[80px] py-2 text-[10px] sm:text-xs font-bold rounded-xl transition flex justify-center items-center gap-2 ${
            activeTab === 'monthly' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <PieChartIcon size={14} /> Monthly
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex-1 min-w-[100px] py-2 text-[10px] sm:text-xs font-bold rounded-xl transition flex justify-center items-center gap-2 ${
            activeTab === 'subscriptions' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Tv size={14} /> Subs
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`flex-1 min-w-[80px] py-2 text-[10px] sm:text-xs font-bold rounded-xl transition flex justify-center items-center gap-2 ${
            activeTab === 'loans' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Wallet size={14} /> EMI
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 min-w-[80px] py-2 text-[10px] sm:text-xs font-bold rounded-xl transition flex justify-center items-center gap-2 ${
            activeTab === 'goals' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <TrendingUp size={14} /> Goals
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && <OverviewTab key="overview" />}
        {activeTab === 'daily' && <DailyTab key="daily" />}
        {activeTab === 'monthly' && <MonthlyTab key="monthly" />}
        {activeTab === 'subscriptions' && <SubscriptionsTab key="subs" />}
        {activeTab === 'loans' && <LoansTab key="loans" />}
        {activeTab === 'goals' && <GoalsTab key="goals" />}
      </AnimatePresence>

      <div className="h-6"></div>
    </div>
  );
}

function OverviewTab() {
  const { stats, transactions, subscriptions, loans, goals } = useLifeOS();
  
  const currentMonth = new Date().getMonth();
  const currentMonthTx = transactions.filter(tx => new Date(tx.date).getMonth() === currentMonth);
  const monthlySpending = currentMonthTx.reduce((sum, tx) => sum + tx.amount, 0);

  const recurringIncome = subscriptions
    .filter(s => s.type === 'income' && s.status === 'active')
    .reduce((sum, s) => sum + (s.billingCycle === 'monthly' ? s.amount : s.amount / 12), 0);

  const recurringExpenses = subscriptions
    .filter(s => s.type === 'expense' && s.status === 'active')
    .reduce((sum, s) => sum + (s.billingCycle === 'monthly' ? s.amount : s.amount / 12), 0);

  const totalEMI = loans.reduce((sum, l) => sum + l.monthlyEMI, 0);
  
  const baseIncome = 20000;
  const totalIncome = baseIncome + recurringIncome;
  const netMonthlySavings = totalIncome - (monthlySpending + recurringExpenses + totalEMI);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      {/* Prime Financial Score */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Zap size={100} className="text-emerald-500" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-1">Financial Vitality</h2>
              <p className="text-sm text-neutral-400">Your system health score</p>
            </div>
            <div className={`text-4xl font-black ${stats.financialScore > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {stats.financialScore}
            </div>
          </div>
          
          <div className="w-full bg-neutral-950 rounded-full h-2 mb-2">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${stats.financialScore}%` }}
              className={`h-full rounded-full ${stats.financialScore > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
            />
          </div>
          <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-tight">
            {stats.financialScore > 70 ? "Stable mode • Optimization active" : "Warning: Resource drain detected"}
          </p>
        </div>
      </div>

      {/* Net Balance Matrix */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
           <TrendingUp size={20} className="text-emerald-500 mb-3" />
           <span className="text-[10px] font-black text-neutral-600 uppercase">Estimated Savings</span>
           <div className="text-xl font-black text-white mt-1">₹{Math.round(netMonthlySavings).toLocaleString()}</div>
           <p className="text-[9px] text-neutral-500 mt-1">Post all commitments</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
           <TrendingDown size={20} className="text-red-400 mb-3" />
           <span className="text-[10px] font-black text-neutral-600 uppercase">Debt/Income Ratio</span>
           <div className="text-xl font-black text-white mt-1">{Math.round(stats.debtRatio * 100)}%</div>
           <p className="text-[9px] text-neutral-500 mt-1">System leverage load</p>
        </div>
      </div>

      {/* Burn Rate / Cashflow Map */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
         <h3 className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-6">Monthly Cashflow Map</h3>
         <div className="space-y-4">
            <CashflowRow label="Fixed Base Income" amount={baseIncome} color="text-emerald-500" />
            <CashflowRow label="Side Earnings (Recurrent)" amount={recurringIncome} color="text-emerald-400" />
            <div className="h-px bg-neutral-850 my-2" />
            <CashflowRow label="Active Spending" amount={monthlySpending} color="text-red-400" />
            <CashflowRow label="Sub Burn" amount={recurringExpenses} color="text-rose-400" />
            <CashflowRow label="Loan Commitments" amount={totalEMI} color="text-blue-500" />
         </div>
      </div>

      {/* Quick Access Pulse */}
      <div>
        <h3 className="text-xs font-black text-neutral-600 uppercase tracking-widest px-2 mb-4">Financial Vitals</h3>
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-5">
           <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-neutral-800 rounded-xl text-neutral-400"><ShoppingBag size={18} /></div>
                 <div>
                    <div className="text-sm font-bold text-white">Daily Average</div>
                    <div className="text-[10px] text-neutral-600 uppercase">Current Month</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-sm font-black text-white">₹{Math.round(monthlySpending/30).toLocaleString()}</div>
              </div>
           </div>

           <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-neutral-800 rounded-xl text-neutral-400"><Tv size={18} /></div>
                 <div>
                    <div className="text-sm font-bold text-white">Active Subscriptions</div>
                    <div className="text-[10px] text-neutral-600 uppercase">{subscriptions.length} Systems</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-sm font-black text-white">₹{Math.round(recurringExpenses).toLocaleString()}</div>
              </div>
           </div>

           <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-neutral-800 rounded-xl text-neutral-400"><Wallet size={18} /></div>
                 <div>
                    <div className="text-sm font-bold text-white">Loan Payments</div>
                    <div className="text-[10px] text-neutral-600 uppercase">{loans.length} Active</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-sm font-black text-white">₹{totalEMI.toLocaleString()}</div>
              </div>
           </div>

           <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-neutral-800 rounded-xl text-neutral-400"><TrendingUp size={18} /></div>
                 <div>
                    <div className="text-sm font-bold text-white">Financial Goals</div>
                    <div className="text-[10px] text-neutral-600 uppercase">{goals.length} Active</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-sm font-black text-emerald-400">₹{goals.reduce((sum, g) => sum + g.currentAmount, 0).toLocaleString()} <span className="text-[10px] text-neutral-500 font-bold uppercase block">Saved</span></div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function CashflowRow({ label, amount, color }: { label: string, amount: number, color: string }) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-xs font-bold text-neutral-400">{label}</span>
       <span className={`text-xs font-black ${color}`}>₹{amount.toLocaleString()}</span>
    </div>
  );
}

function DailyTab() {
  const { transactions, addTransaction, deleteTransaction } = useLifeOS();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const transactionsForDay = useMemo(() => {
    return transactions.filter(tx => isSameDay(parseISO(tx.date), selectedDate));
  }, [selectedDate, transactions]);

  const totalSpent = useMemo(() => {
    return transactionsForDay.reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactionsForDay]);

  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if(desc && amt) {
      setIsAdding(true);
      let suggestedCategory = undefined;

      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const res = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: `Categorize the following transaction description into exactly one of these categories: food, travel, shopping, subscriptions, entertainment, education, health, bills, home, gifts, or others. Respond with ONLY the category word in lowercase. Description: "${desc}"`,
        });
        
        if (res.text) {
          const text = res.text.trim().toLowerCase();
          const validCategories = ['food', 'travel', 'shopping', 'subscriptions', 'entertainment', 'education', 'health', 'bills', 'home', 'gifts', 'others'];
          if (validCategories.includes(text)) {
            suggestedCategory = text;
          }
        }
      } catch (err) {
        console.error('Failed to categorize with AI', err);
      } // Ignore AI failure and use fallback matching

      addTransaction({
        description: desc,
        amount: Number(amt),
        category: suggestedCategory,
      });
      setDesc('');
      setAmt('');
      setIsAdding(false);
    }
  };

  // Week strip for quick navigation
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 3; i >= -3; i--) {
      days.push(subDays(selectedDate, i));
    }
    return days;
  }, [selectedDate]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Date Navigation */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
          >
            <ChevronLeft size={18} className="text-neutral-300" />
          </button>
          
          <h2 className="text-lg font-bold text-white tracking-wide">
            {format(selectedDate, 'MMM dd, yyyy')}
          </h2>

          <button 
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
          >
            <ChevronRight size={18} className="text-neutral-300" />
          </button>
        </div>

        {/* Total Spending */}
        <div className="flex flex-col items-center justify-center py-6 bg-neutral-950/50 rounded-2xl border border-neutral-800/80 mb-4">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Daily Total</span>
          <div className="flex items-start text-emerald-400">
            <IndianRupee size={24} className="mt-1 mr-1" />
            <span className="text-5xl font-black">{totalSpent.toLocaleString()}</span>
          </div>
        </div>

        {/* Week Strip */}
        <div className="flex justify-between items-center bg-neutral-950/40 p-2 rounded-2xl border border-neutral-800/50 mb-4">
          {weekDays.map((date, idx) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center p-2 w-10 h-14 rounded-xl transition-all ${
                  isSelected 
                    ? 'bg-emerald-500 text-neutral-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : 'text-neutral-500 hover:bg-neutral-800'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-emerald-950' : ''}`}>
                  {format(date, 'EEE')}
                </span>
                <span className={`text-sm font-black ${isSelected ? 'text-emerald-950' : 'text-neutral-300'}`}>
                  {format(date, 'd')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Add Transaction Form */}
        {isSameDay(selectedDate, new Date()) && (
          <form onSubmit={handleAdd} className="flex gap-2">
            <input 
              type="text" 
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
              placeholder="Merchant / Item" 
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500" 
              required 
            />
            <input 
              type="number" min="1" max="1000000"
              value={amt} 
              onChange={e => setAmt(e.target.value)} 
              placeholder="₹ Amount" 
              className="w-28 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500" 
              required 
            />
            <button type="submit" disabled={isAdding} className="shrink-0 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-neutral-950 font-bold p-3 rounded-xl transition-colors">
              {isAdding ? <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"/> : <Plus size={20} />}
            </button>
          </form>
        )}
      </div>

      {/* Transaction List */}
      <div>
        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 pl-2 flex items-center gap-2">
          <ReceiptText size={16} /> Transactions
        </h3>
        
        <AnimatePresence mode="popLayout">
          {transactionsForDay.length > 0 ? (
            <div className="space-y-3">
              {transactionsForDay.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-neutral-800 rounded-xl">
                      {getIconForTransaction(tx.category, tx.description)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{tx.description}</h4>
                      <p className="text-xs text-neutral-500 capitalize">{tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center justify-end gap-3">
                    <div>
                      <span className="text-red-400 font-bold block">-₹{tx.amount.toLocaleString()}</span>
                      <span className="text-[10px] text-neutral-600 font-medium">UPI</span>
                    </div>
                    {isSameDay(selectedDate, new Date()) && (
                      <button onClick={() => deleteTransaction(tx.id)} className="text-neutral-600 hover:text-red-400 p-1">
                         <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-neutral-900 border border-neutral-800 border-dashed rounded-3xl p-8 flex flex-col items-center text-center"
            >
              <div className="p-4 bg-neutral-800/50 rounded-full mb-3 text-neutral-600">
                <ReceiptText size={28} />
              </div>
              <p className="text-neutral-400 font-medium">No transactions on this day.</p>
              <p className="text-xs text-neutral-600 mt-1">Great job saving money!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function MonthlyTab() {
  const { transactions } = useLifeOS();
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()));

  // Calculate current month's transactions
  const currentMonthTx = useMemo(() => {
    return transactions.filter(tx => isSameMonth(parseISO(tx.date), selectedMonth));
  }, [selectedMonth, transactions]);

  // Total current month
  const totalCurrent = useMemo(() => {
    return currentMonthTx.reduce((sum, tx) => sum + tx.amount, 0);
  }, [currentMonthTx]);

  // Previous month logic for comparison
  const previousMonthTx = useMemo(() => {
    const prevDate = subMonths(selectedMonth, 1);
    return transactions.filter(tx => isSameMonth(parseISO(tx.date), prevDate));
  }, [selectedMonth, transactions]);

  const totalPrevious = useMemo(() => {
    return previousMonthTx.reduce((sum, tx) => sum + tx.amount, 0);
  }, [previousMonthTx]);

  // Aggregate current month categories
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    currentMonthTx.forEach(tx => {
      map.set(tx.category, (map.get(tx.category) || 0) + tx.amount);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [currentMonthTx]);

  const pieColors = ['#f97316', '#f472b6', '#60a5fa', '#c084fc', '#4ade80'];

  const diffPercent = totalPrevious === 0 ? 0 : Math.round(((totalCurrent - totalPrevious) / totalPrevious) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-lg">
        {/* Month Selector */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
            className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
          >
            <ChevronLeft size={18} className="text-neutral-300" />
          </button>
          
          <h2 className="text-lg font-bold text-white tracking-wide">
            {format(selectedMonth, 'MMMM yyyy')}
          </h2>

          <button 
            onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
            className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition"
          >
            <ChevronRight size={18} className="text-neutral-300" />
          </button>
        </div>

        {/* Total & Comparison */}
        <div className="flex flex-col items-center justify-center pt-2 pb-4">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Monthly Total</span>
          <div className="flex items-start text-emerald-400">
            <IndianRupee size={24} className="mt-1 mr-1" />
            <span className="text-5xl font-black">{totalCurrent.toLocaleString()}</span>
          </div>
          
          {totalPrevious > 0 && (
            <div className={`mt-3 text-xs font-bold flex items-center justify-center gap-1 ${diffPercent > 0 ? 'text-red-400' : 'text-emerald-500'}`}>
               <span className="px-2 py-1 bg-neutral-800/50 rounded-full inline-flex items-center gap-1">
                 {diffPercent > 0 ? '↑' : '↓'} {Math.abs(diffPercent)}% vs last month (₹{totalPrevious.toLocaleString()})
               </span>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg">
          <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6 py-1 flex items-center gap-2">
            <PieChartIcon size={16} /> Category Breakdown
          </h3>
          
          <div className="h-48 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px', color: '#fff', border: 'none' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Spent']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-3">
            {categoryData.map((item, idx) => {
              const bgClass = pieColors[idx % pieColors.length];
              return (
                <div key={item.name} className="flex justify-between items-center bg-neutral-950/40 p-3 rounded-2xl border border-neutral-800/50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: bgClass }}
                    />
                    <span className="text-sm font-bold text-neutral-200 capitalize">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-white">₹{item.value.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 border-dashed rounded-3xl p-8 flex flex-col items-center text-center">
          <div className="p-4 bg-neutral-800/50 rounded-full mb-3 text-neutral-600">
            <PieChartIcon size={28} />
          </div>
          <p className="text-neutral-400 font-medium">No spending data for this month.</p>
        </div>
      )}

      {/* Financial Health Analysis */}
      <FinancialHealthCard />
    </motion.div>
  );
}

function SubscriptionsTab() {
  const { subscriptions, addSubscription, deleteSubscription } = useLifeOS();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [amt, setAmt] = useState('');
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState('Streaming');
  const [reminder, setReminder] = useState('3');
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  useEffect(() => {
    if (name.trim()) {
      const isDuplicate = subscriptions.some(s => 
        s.name.toLowerCase() === name.trim().toLowerCase() && 
        s.type === type && 
        s.status === 'active'
      );
      setDuplicateWarning(isDuplicate);
    } else {
      setDuplicateWarning(false);
    }
  }, [name, type, subscriptions]);

  const totalMonthlyExpense = subscriptions
    .filter(s => s.type === 'expense')
    .reduce((sum, s) => sum + (s.billingCycle === 'monthly' ? s.amount : s.amount / 12), 0);
  
  const totalMonthlyIncome = subscriptions
    .filter(s => s.type === 'income')
    .reduce((sum, s) => sum + (s.billingCycle === 'monthly' ? s.amount : s.amount / 12), 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if(name && amt && !duplicateWarning) {
      addSubscription({
        name,
        amount: Number(amt),
        billingCycle: cycle,
        type: type,
        category: type === 'income' ? 'gift' : category.toLowerCase(),
        startDate: new Date().toISOString(),
        nextRenewalDate: addMonths(new Date(), 1).toISOString(),
        status: 'active',
        reminderDaysBefore: Number(reminder)
      });
      setName('');
      setAmt('');
      setIsAdding(false);
      setCategory('Streaming');
      setReminder('3');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col items-center justify-center py-4 bg-neutral-950/50 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Monthly Burn</span>
            <div className="flex items-start text-red-400">
              <IndianRupee size={16} className="mt-1 mr-1" />
              <span className="text-2xl font-black">{Math.round(totalMonthlyExpense).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-4 bg-neutral-950/50 rounded-2xl border border-neutral-800/80">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Monthy Gains</span>
            <div className="flex items-start text-emerald-400">
              <IndianRupee size={16} className="mt-1 mr-1" />
              <span className="text-2xl font-black">{Math.round(totalMonthlyIncome).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-full py-4 bg-neutral-800 hover:bg-neutral-750 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors mb-4"
        >
          {isAdding ? <Trash2 size={18}/> : <Plus size={18}/>} {isAdding ? 'Cancel' : 'Add Recurrent Payment'}
        </button>

        <AnimatePresence>
          {isAdding && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAdd} className="space-y-3 overflow-hidden mb-4"
            >
              <div className="flex p-1 bg-neutral-950 border border-neutral-800 rounded-xl">
                <button 
                  type="button" 
                  onClick={() => setType('expense')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-colors ${type === 'expense' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-neutral-500'}`}
                >
                  EXPENSE
                </button>
                <button 
                  type="button" 
                  onClick={() => setType('income')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-colors ${type === 'income' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-neutral-500'}`}
                >
                  EARNING
                </button>
              </div>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={type === 'income' ? 'Source Name (e.g. Side Gig)' : 'App Name (e.g. Netflix)'} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500" required />
              
              {duplicateWarning && (
                <div className="flex items-center gap-2 text-amber-500 text-xs px-2 py-1">
                  <AlertCircle size={14} /> Potential duplicate detected
                </div>
              )}

              <div className="flex gap-2">
                <input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="₹ Amount" className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500" required />
                <select value={cycle} onChange={e => setCycle(e.target.value as 'monthly' | 'yearly')} className="bg-neutral-950 border border-neutral-800 text-xs text-white p-3 rounded-xl outline-none">
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {type === 'expense' && (
                <div className="flex gap-2">
                  <select value={category} onChange={e => setCategory(e.target.value)} className="flex-1 bg-neutral-950 border border-neutral-800 text-xs text-white p-3 rounded-xl outline-none">
                    <option value="Streaming">Streaming</option>
                    <option value="Software">Software</option>
                    <option value="News">News</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Gym">Gym</option>
                    <option value="Utility">Utility</option>
                    <option value="Other">Other</option>
                  </select>
                  <select value={reminder} onChange={e => setReminder(e.target.value)} className="flex-1 bg-neutral-950 border border-neutral-800 text-xs text-white p-3 rounded-xl outline-none">
                    <option value="1">1 Day Before</option>
                    <option value="3">3 Days Before</option>
                    <option value="7">7 Days Before</option>
                    <option value="0">No Reminder</option>
                  </select>
                </div>
              )}

              <button disabled={duplicateWarning} type="submit" className={`w-full ${type === 'income' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'} disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors`}>
                Confirm {type === 'income' ? 'Earnings' : 'Expense'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {subscriptions.map(s => (
            <div key={s.id} className="bg-neutral-950 border border-neutral-800/60 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${s.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-neutral-900 text-neutral-400'}`}>
                   {s.type === 'income' ? <Sparkles size={16} /> : getIconForTransaction(s.category || 'subscriptions', s.name)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{s.name}</h4>
                  <div className="flex gap-2">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-tighter">{s.billingCycle} {s.type}</span>
                    {s.type === 'expense' && s.category && (
                      <span className="text-[10px] text-neutral-600 uppercase tracking-tighter border-l border-neutral-800 pl-2">
                        {s.category}
                      </span>
                    )}
                    {s.reminderDaysBefore ? (
                      <span className="text-[10px] text-neutral-600 uppercase tracking-tighter border-l border-neutral-800 pl-2">
                        🔔 {s.reminderDaysBefore}d prior
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-black ${s.type === 'income' ? 'text-emerald-500' : 'text-white'}`}>
                  {s.type === 'income' ? '+' : ''}₹{s.amount}
                </span>
                <button onClick={() => deleteSubscription(s.id)} className="text-neutral-700 hover:text-red-500 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {subscriptions.length === 0 && (
            <div className="text-center py-8 text-neutral-600 text-sm">No recurring items tracked.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function LoansTab() {
  const { loans, addLoan, deleteLoan, payLoanEMI } = useLifeOS();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [total, setTotal] = useState('');
  const [emi, setEmi] = useState('');
  const [due, setDue] = useState('5');

  const totalEMI = loans.reduce((sum, l) => sum + l.monthlyEMI, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if(name && emi) {
      addLoan({
        name,
        totalAmount: Number(total) || Number(emi) * 12,
        remainingAmount: Number(total) || Number(emi) * 12,
        interestRate: 0,
        monthlyEMI: Number(emi),
        dueDate: due,
        startDate: new Date().toISOString(),
        durationMonths: 12
      });
      setName('');
      setTotal('');
      setEmi('');
      setIsAdding(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg">
        <div className="flex flex-col items-center justify-center py-4 bg-neutral-950/50 rounded-2xl border border-neutral-800/80 mb-6">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Total Monthly EMI Commit</span>
          <div className="flex items-start text-blue-400">
            <IndianRupee size={24} className="mt-1 mr-1" />
            <span className="text-5xl font-black">{totalEMI.toLocaleString()}</span>
          </div>
        </div>

        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-full py-4 bg-neutral-800 hover:bg-neutral-750 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors mb-4"
        >
          {isAdding ? <Trash2 size={18}/> : <Plus size={18}/>} {isAdding ? 'Cancel' : 'Add Loan / EMI'}
        </button>

        <AnimatePresence>
          {isAdding && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAdd} className="space-y-3 overflow-hidden mb-4"
            >
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Loan Name (e.g. iPhone EMI / Car Loan)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500" required />
              <div className="flex gap-2">
                <input type="number" value={emi} onChange={e => setEmi(e.target.value)} placeholder="₹ Monthly EMI" className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500" required />
                <input type="number" value={due} onChange={e => setDue(e.target.value)} placeholder="Due Date (Day)" className="w-24 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none" required />
              </div>
              <input type="number" value={total} onChange={e => setTotal(e.target.value)} placeholder="₹ Total remaining (optional)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none" />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">Register Loan</button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {loans.map(l => {
            const currentMonthKey = format(new Date(), 'yyyy-MM');
            const isPaid = l.paidMonths?.includes(currentMonthKey);
            const percentCleared = l.totalAmount > 0 
              ? Math.max(0, Math.min(100, Math.round(((l.totalAmount - l.remainingAmount) / l.totalAmount) * 100))) 
              : 0;
            return (
            <div key={l.id} className="bg-neutral-950 border border-neutral-800/60 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-900 rounded-lg text-blue-400">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{l.name}</h4>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-tighter">Due on day {l.dueDate} of month</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-white font-black block">₹{l.monthlyEMI.toLocaleString()}</span>
                    {!isPaid ? (
                      <button 
                         onClick={() => payLoanEMI(l.id, currentMonthKey)}
                         className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 mt-1 uppercase"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-neutral-500 mt-1 uppercase block flex justify-end gap-1">
                        <CheckCircle2 size={12} className="inline text-emerald-500" /> Paid
                      </span>
                    )}
                  </div>
                  <button onClick={() => deleteLoan(l.id)} className="text-neutral-700 hover:text-red-500 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${percentCleared}%` }} className="bg-blue-500 h-full" />
              </div>
              <div className="flex justify-between mt-1">
                 <span className="text-[9px] text-neutral-600">Remaining ₹{l.remainingAmount.toLocaleString()}</span>
                 <span className="text-[9px] text-neutral-600 italic">{percentCleared}% cleared</span>
              </div>
            </div>
            );
          })}
          {loans.length === 0 && (
            <div className="text-center py-8 text-neutral-600 text-sm">No loans tracked yet.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function GoalsTab() {
  const { goals, addGoal, updateGoalProgress, deleteGoal, addXP } = useLifeOS();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [date, setDate] = useState('');

  const [addingAmountId, setAddingAmountId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if(name && target) {
      addGoal({
        name,
        targetAmount: Number(target),
        currentAmount: Number(current) || 0,
        targetDate: date || undefined
      });
      addXP(15);
      setName('');
      setTarget('');
      setCurrent('');
      setDate('');
      setIsAdding(false);
    }
  };

  const handleAddProgress = (id: string, currentAmount: number, targetAmountVal: number) => {
    if (addAmount) {
      updateGoalProgress(id, Number(addAmount));
      addXP(10); // Base XP for contributing
      if (currentAmount + Number(addAmount) >= targetAmountVal) {
          addXP(50); // XP bonus for reaching a goal
      }
      setAddingAmountId(null);
      setAddAmount('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg">
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors mb-4"
        >
          {isAdding ? <Trash2 size={18}/> : <Plus size={18}/>} {isAdding ? 'Cancel' : 'Create New Goal'}
        </button>

        <AnimatePresence>
          {isAdding && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddGoal} className="space-y-3 overflow-hidden mb-6"
            >
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Goal Name (e.g. Europe Trip)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500" required />
              <div className="flex gap-2">
                <input type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="Target Amount ₹" className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500" required />
                <input type="number" value={current} onChange={e => setCurrent(e.target.value)} placeholder="Current ₹ (Opt)" className="w-1/3 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500" />
              </div>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 text-neutral-400" />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors">
                Save Goal
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {goals.map(g => {
            const percent = g.targetAmount > 0 ? Math.min(100, (g.currentAmount / g.targetAmount) * 100) : 0;
            return (
            <div key={g.id} className="bg-neutral-950 border border-neutral-800/60 p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-white font-bold text-lg">{g.name}</h3>
                  {g.targetDate && <p className="text-xs text-neutral-500 mt-1">Target: {new Date(g.targetDate).toLocaleDateString()}</p>}
                </div>
                <button onClick={() => deleteGoal(g.id)} className="text-neutral-700 hover:text-red-500 transition">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mb-4">
                 <div className="flex justify-between items-end mb-1">
                   <div className="text-2xl font-black text-emerald-400">₹{g.currentAmount.toLocaleString()}</div>
                   <div className="text-xs font-bold text-neutral-500">/ ₹{g.targetAmount.toLocaleString()}</div>
                 </div>
                 <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden relative">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className="bg-emerald-500 h-full rounded-full" />
                 </div>
                 <div className="text-[10px] text-neutral-500 mt-1 font-bold italic text-right">{Math.round(percent)}% completed</div>
              </div>

              {addingAmountId === g.id ? (
                <div className="flex gap-2">
                  <input autoFocus type="number" value={addAmount} onChange={e => setAddAmount(e.target.value)} placeholder="+ Amount ₹" className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-emerald-500" />
                  <button onClick={() => handleAddProgress(g.id, g.currentAmount, g.targetAmount)} className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold">Add</button>
                  <button onClick={() => setAddingAmountId(null)} className="px-3 bg-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs font-bold">X</button>
                </div>
              ) : (
                <button onClick={() => setAddingAmountId(g.id)} className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-bold rounded-xl transition">
                  + Add Funds
                </button>
              )}
            </div>
            );
          })}
          {goals.length === 0 && (
            <div className="text-center py-8 text-neutral-600 text-sm border border-dashed border-neutral-800 rounded-2xl">
               No financial goals set. Start building wealth!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function FinancialHealthCard() {
  const { stats, subscriptions } = useLifeOS();
  
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" /> Daily Financial Health
        </h3>
        <div className={`text-xl font-black ${stats.financialScore > 70 ? 'text-emerald-500' : 'text-red-400'}`}>
          {stats.financialScore} <span className="text-[10px] text-neutral-600 uppercase">Score</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-950/40 p-4 rounded-2xl border border-neutral-800/50">
          <div className="text-[10px] text-neutral-600 uppercase font-black mb-1">Savings Ratio</div>
          <div className="text-lg font-bold text-white">{Math.round((stats.savingsRatio || 0) * 100)}%</div>
          <div className="w-full bg-neutral-900 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${(stats.savingsRatio || 0) * 100}%` }} />
          </div>
        </div>
        <div className="bg-neutral-950/40 p-4 rounded-2xl border border-neutral-800/50">
          <div className="text-[10px] text-neutral-600 uppercase font-black mb-1">Debt Load</div>
          <div className="text-lg font-bold text-white">{Math.round((stats.debtRatio || 0) * 100)}%</div>
          <div className="w-full bg-neutral-900 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-red-500 h-full" style={{ width: `${(stats.debtRatio || 0) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-tight">AI Audit Observations</h4>
        <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl">
          <ul className="text-xs text-neutral-400 space-y-2 list-disc pl-4">
            {stats.savingsRatio < 0.2 && <li>Your savings ratio is below the 20% target. Consider cutting non-essential subscriptions.</li>}
            {stats.debtRatio > 0.4 && <li>Debt payments are exceeding 40% of income. High financial stress risk.</li>}
            {subscriptions.length > 5 && <li>Subscription sprawl detected ({subscriptions.length} active). Review for waste.</li>}
            {stats.financialScore > 80 && <li>Outstanding consistency. You are in the top 5% of savers!</li>}
            {stats.financialScore <= 80 && stats.financialScore > 40 && <li>Stable performance. Minor adjustments could push you to "Wealth Mode".</li>}
            {stats.financialScore <= 40 && <li>System alert: Financial vitals are low. Immediate budgeting required.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
