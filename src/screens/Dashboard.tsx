import React, { useMemo, useState } from 'react';
import { useLifeOS } from '../context/LifeContext';
import { calculateLifeScore } from '../lib/engine';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
import { Footprints, Zap, CheckCircle2, Droplet, Dumbbell, IndianRupee, Sparkles, AlertCircle, RefreshCw, CalendarDays, Wallet, Tv } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

interface Props {
  onNavigate: (screen: string) => void;
}

export const MOCK_UPI_TRANSACTIONS = [
  { id: '1', amount: 250, category: 'food', description: 'Zomato/Swiggy', date: '2026-05-01' },
  { id: '2', amount: 1500, category: 'shopping', description: 'Amazon - Sneakers', date: '2026-05-01' },
  { id: '3', amount: 350, category: 'travel', description: 'Uber/Ola', date: '2026-04-30' },
  { id: '4', amount: 120, category: 'food', description: 'College Canteen', date: '2026-04-30' },
  { id: '5', amount: 499, category: 'subscriptions', description: 'Netflix', date: '2026-04-29' },
  { id: '6', amount: 80, category: 'food', description: 'Cold Coffee', date: '2026-04-28' },
  { id: '7', amount: 650, category: 'shopping', description: 'Myntra', date: '2026-05-02' },
  { id: '8', amount: 110, category: 'food', description: 'Starbucks', date: '2026-05-02' },
  { id: '9', amount: 1200, category: 'grocery', description: 'Blinkit/Instamart', date: '2026-05-03' },
  { id: '10', amount: 200, category: 'entertainment', description: 'Movie Tickets', date: '2026-05-03' },
  { id: '11', amount: 3000, category: 'education', description: 'Udemy Course', date: '2026-05-04' },
  { id: '12', amount: 119, category: 'subscriptions', description: 'Spotify Premium', date: '2026-05-04' },
  { id: '13', amount: 850, category: 'travel', description: 'Train Ticket', date: '2026-05-04' },
];

function UPISpendingAnalyzer() {
  const { transactions } = useLifeOS();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState('');
  const [error, setError] = useState('');

  const generateInsights = async () => {
    setLoading(true);
    setError('');
    setInsights('');

    const currentMonth = new Date().getMonth();
    const recentTx = transactions.filter(t => new Date(t.date).getMonth() === currentMonth);
    const avgDaily = recentTx.length > 0 ? recentTx.reduce((s, t) => s + t.amount, 0) / 30 : 0;
    const todaySpend = transactions.filter(t => new Date(t.date).toDateString() === new Date().toDateString()).reduce((s, t) => s + t.amount, 0);
    const isSpike = todaySpend > (avgDaily * 1.5) && todaySpend > 500;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        Analyze the following recent transactions for a student/young adult:
        ${JSON.stringify(transactions.slice(0, 50), null, 2)}
        
        Today's Spending: ₹${todaySpend}
        Average Daily Spending: ₹${Math.round(avgDaily)}
        ${isSpike ? "WARNING: Detect a potential spending spike today!" : ""}

        Provide:
        1. A brief analysis of their spending patterns (CRUCIAL: Keep this extremely short, MAXIMUM 5-8 lines, in a tight summary format).
        2. ${isSpike ? "URGENT: Briefly explain the spike and how to recover (MAX 3-4 lines)." : "2-3 specific, short, actionable tips to save money (MAX 1-2 lines each)."}
        3. A "Financial Health Score" out of 100 based on this data.
        
        Keep the tone encouraging, snappy, and modern. You MUST ensure the overall response is very brief. Avoid using markdown formatting like asterisks or hashtags, just output plain readable text with numbered lists or bullet points.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
            temperature: 0.7
        }
      });

      if (response.text) {
        setInsights(response.text.trim());
      } else {
        setError('Could not generate insights at this time.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden flex flex-col space-y-6">
      <div className="flex items-center gap-2 mb-2">
         <IndianRupee size={20} className="text-emerald-500" />
         <h2 className="font-bold text-white tracking-wide text-sm">UPI Spending AI Analyst</h2>
      </div>

      <div className="bg-neutral-950/50 rounded-2xl p-4 border border-neutral-800/80">
        <h3 className="text-xs font-bold text-neutral-400 mb-3 uppercase tracking-wider">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.slice(0, 3).map(tx => (
            <div key={tx.id} className="flex justify-between items-center text-sm">
              <span className="text-neutral-300 font-medium">{tx.description}</span>
              <span className="text-red-400 font-bold">-₹{tx.amount}</span>
            </div>
          ))}
          {transactions.length === 0 && <div className="text-xs text-neutral-500 italic pb-2">No transactions to analyze.</div>}
          {transactions.length > 3 && <div className="text-xs text-neutral-600 italic text-center pt-2">...and {transactions.length - 3} more</div>}
        </div>
      </div>

      {!insights && !loading && !error && (
        <button 
          onClick={generateInsights}
          className="w-full py-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl hover:bg-emerald-600/30 transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={18} />
          Analyze Spending Patterns
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center p-4 text-emerald-500 gap-2">
           <RefreshCw size={18} className="animate-spin" />
           <span className="text-sm font-bold animate-pulse">AI is reviewing your transactions...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
           <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
           <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <AnimatePresence>
        {insights && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 overflow-hidden"
          >
            <div className="flex items-start gap-3">
               <Sparkles size={20} className="text-emerald-500 shrink-0 mt-1" />
               <div className="text-sm text-emerald-100/90 whitespace-pre-wrap leading-relaxed">
                 {insights.split('\n').map((line, i) => (
                   <span key={i} className="block mb-2">{line}</span>
                 ))}
               </div>
            </div>
            <button 
              onClick={generateInsights}
              className="mt-4 text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={12} /> Re-analyze
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UpcomingEvents() {
  const { subscriptions, loans } = useLifeOS();
  const today = new Date().getDate();

  const events = useMemo(() => {
    const list: any[] = [];
    subscriptions.forEach(s => {
      const renewalDate = new Date(s.nextRenewalDate);
      if (renewalDate.getMonth() === new Date().getMonth()) {
        list.push({ type: 'subscription', ...s, day: renewalDate.getDate() });
      }
    });
    loans.forEach(l => {
      list.push({ type: 'loan', ...l, day: Number(l.dueDate) });
    });
    return list.sort((a,b) => a.day - b.day).filter(e => e.day >= today).slice(0, 3);
  }, [subscriptions, loans, today]);

  if (events.length === 0) return null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
      <div className="flex items-center gap-2">
         <CalendarDays size={20} className="text-blue-500" />
         <h2 className="font-bold text-white tracking-wide text-sm">System Calendar Reminders</h2>
      </div>
      <div className="space-y-3">
        {events.map((e, i) => (
          <div key={i} className="flex justify-between items-center bg-neutral-950/50 p-3 rounded-xl border border-neutral-800/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${e.type === 'loan' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}`}>
                {e.type === 'loan' ? <Wallet size={16} /> : <Tv size={16} />}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{e.name}</div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-tighter">Due in {e.day - today} days</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-white">₹{e.type === 'loan' ? e.monthlyEMI : e.amount}</div>
              <div className="text-[9px] text-neutral-600 font-bold uppercase">{e.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate }: Props) {
  const { tasks, activity, water, workouts, settings, stats } = useLifeOS();

  const scores = useMemo(() => {
    return calculateLifeScore(tasks, activity, water, workouts, stats.financialScore);
  }, [tasks, activity, water, workouts, stats.financialScore]);

  const radarData = [
    { subject: 'Hydration', A: water.find(w=>w.date===new Date().toISOString().split('T')[0])?.cups || 0, fullMark: settings.waterTarget || 8 },
    { subject: 'Movement', A: activity.find(a=>a.date===new Date().toISOString().split('T')[0])?.steps || 0, fullMark: 8000 },
    { subject: 'Finance', A: stats.financialScore, fullMark: 100 },
    { subject: 'Focus', A: scores.productivity, fullMark: 35 },
  ];

  const today = new Date().toISOString().split('T')[0];
  const todaySteps = activity.find(a => a.date === today)?.steps || 0;
  const todayWater = water.find(w => w.date === today)?.cups || 0;
  const openTasks = tasks.filter(t => !t.completed).length;

  const todayWorkouts = workouts.filter(w => w.date.startsWith(today));
  const totalVolume = todayWorkouts.reduce((acc, curr) => (curr.type === 'weight' || !curr.type) ? acc + ((curr.sets || 0) * (curr.reps || 0) * (curr.weight || 0)) : acc, 0);

  return (
    <div className="p-6 space-y-8">
      <header className="pt-2 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">LifeOS</h1>
          <p className="text-sm font-medium text-neutral-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online • AutoTrack: {settings.autoTrack ? 'Active' : 'Off'}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Level {useLifeOS().stats.level}</div>
          <div className="w-24 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-1000" 
              style={{ width: `${(useLifeOS().stats.xp % 1000) / 10}%` }}
            />
          </div>
          <div className="text-[8px] text-neutral-600 mt-1 uppercase font-bold">{useLifeOS().stats.xp % 1000} / 1000 XP</div>
        </div>
      </header>

      {/* Hero Radar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden flex flex-col sm:flex-row gap-4"
      >
        <div className="absolute top-4 right-5 text-right z-10 bg-neutral-900/80 p-2 rounded-xl backdrop-blur">
          <div className="text-4xl font-black text-white">{scores.overall}</div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Life Score</div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10, fontWeight: 700 }} />
              <Radar name="Score" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard 
          icon={<Footprints className="text-emerald-400" size={20} />}
          label="Steps Today"
          value={todaySteps.toLocaleString()}
          subtext="Movement Core"
          delay={0.1}
          onClick={() => onNavigate('movement')}
        />
        <MetricCard 
          icon={<Droplet className="text-blue-400" size={20} />}
          label="Hydration"
          value={`${Number(todayWater.toFixed(1))} / ${settings.waterTarget || 8}`}
          subtext="Health Core"
          delay={0.2}
          onClick={() => onNavigate('health')}
        />
        <MetricCard 
          icon={<CheckCircle2 className="text-orange-400" size={20} />}
          label="Open Tasks"
          value={openTasks.toString()}
          subtext="Focus Core"
          delay={0.3}
          onClick={() => onNavigate('daily')}
        />
        <MetricCard 
          icon={<IndianRupee className="text-blue-400" size={20} />}
          label="Finance Score"
          value={`${stats.financialScore}/100`}
          subtext={stats.financialScore > 70 ? "Stable Mode" : "Wealth Drain"}
          delay={0.4}
          onClick={() => onNavigate('finance')}
        />
      </div>

      {/* Upcoming Events */}
      <UpcomingEvents />

      {/* AI Spending Analyst */}
      <UPISpendingAnalyzer />

    </div>
  );
}

function MetricCard({ icon, label, value, subtext, delay, onClick }: any) {
  return (
    <motion.button 
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col items-start justify-between text-left hover:bg-neutral-800/80 transition-colors"
    >
      <div className="p-2 bg-neutral-950/50 rounded-xl mb-3 shadow-inner">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
        <div className="text-xs font-semibold text-neutral-400">{label}</div>
        <div className="text-[10px] text-neutral-600 mt-1">{subtext}</div>
      </div>
    </motion.button>
  );
}
