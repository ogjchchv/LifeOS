import React, { forwardRef } from 'react';
import { useLifeOS } from '../context/LifeContext';
import { Activity, Dumbbell, Utensils, Heart, Wallet, Tv, Landmark } from 'lucide-react';

interface PDFOptions {
  workouts: boolean;
  activity: boolean;
  diet: boolean;
  finance?: boolean;
}

interface PDFProps {
  options: PDFOptions;
}

export const InfographicPDF = forwardRef<HTMLDivElement, PDFProps>(({ options }, ref) => {
  const { workouts, dietLogs, activity, transactions, subscriptions, loans, stats, goals } = useLifeOS();

  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((sum, w) => sum + ((w.sets || 0) * (w.reps || 0) * (w.weight || 0)), 0);
  const totalDuration = workouts.reduce((sum, w) => sum + (w.durationMins || 0), 0);

  const totalCaloriesIntake = dietLogs.reduce((sum, d) => sum + (d.calories || 0), 0);
  const totalProteinIntake = dietLogs.reduce((sum, d) => sum + (d.protein || 0), 0);

  const totalSteps = activity.reduce((sum, a) => sum + (a.steps || 0), 0);
  const totalActiveMins = activity.reduce((sum, a) => sum + (a.activeMins || 0), 0);

  // Finance calculations
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
  const remainingDebt = loans.reduce((sum, l) => sum + l.remainingAmount, 0);
  
  const baseIncome = 20000;
  const totalIncome = baseIncome + recurringIncome;
  const netMonthlySavings = totalIncome - (monthlySpending + recurringExpenses + totalEMI);

  return (
    <div ref={ref} className="p-12 w-[900px] font-sans flex flex-col gap-10 rounded-[40px]" style={{ backgroundColor: '#050505', color: '#ffffff' }}>
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center border-b pb-10" style={{ borderColor: '#1f1f1f' }}>
        <div className="p-5 rounded-[2rem] mb-6 shadow-[0_0_60px_rgba(16,185,129,0.15)]" style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <Heart size={56} color="#34d399" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-3">LifeOS Intelligence</h1>
        <p className="text-xl tracking-wide uppercase font-bold" style={{ color: '#525252' }}>Performance & System Snapshot</p>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-2 gap-8">
        
        {/* Workouts */}
        {options.workouts && (
        <div className="border rounded-[32px] p-8 shadow-2xl relative overflow-hidden" style={{ backgroundColor: '#0a0a0a', borderColor: '#1f1f1f' }}>
          <div className="absolute -top-10 -right-10 opacity-5 blur-xl">
             <Dumbbell size={200} color="#60a5fa" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)' }}>
                <Dumbbell size={28} color="#60a5fa" />
              </div>
              <h2 className="text-2xl font-black tracking-tight" style={{ color: '#60a5fa' }}>Training</h2>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b pb-4" style={{ borderColor: '#1f1f1f' }}>
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#737373' }}>Total Sessions</span>
                <span className="text-3xl font-black">{totalWorkouts}</span>
              </div>
              <div className="flex justify-between items-end border-b pb-4" style={{ borderColor: '#1f1f1f' }}>
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#737373' }}>Total Volume</span>
                <span className="text-3xl font-black">{totalVolume.toLocaleString()} <span className="text-lg text-neutral-500">kg</span></span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#737373' }}>Time Under Tension</span>
                <span className="text-3xl font-black">{totalDuration} <span className="text-lg text-neutral-500">min</span></span>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Activity */}
        {options.activity && (
        <div className="border rounded-[32px] p-8 shadow-2xl relative overflow-hidden" style={{ backgroundColor: '#0a0a0a', borderColor: '#1f1f1f' }}>
           <div className="absolute -top-10 -right-10 opacity-5 blur-xl">
             <Activity size={200} color="#fb923c" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: 'rgba(251, 146, 60, 0.1)' }}>
                <Activity size={28} color="#fb923c" />
              </div>
              <h2 className="text-2xl font-black tracking-tight" style={{ color: '#fb923c' }}>Movement</h2>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b pb-4" style={{ borderColor: '#1f1f1f' }}>
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#737373' }}>Total Steps</span>
                <span className="text-3xl font-black">{totalSteps.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#737373' }}>Active Duration</span>
                <span className="text-3xl font-black">{totalActiveMins} <span className="text-lg text-neutral-500">min</span></span>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Diet */}
        {options.diet && (
        <div className="border rounded-[32px] p-8 col-span-2 shadow-2xl relative overflow-hidden" style={{ backgroundColor: '#0a0a0a', borderColor: '#1f1f1f' }}>
          <div className="absolute -top-10 -right-10 opacity-5 blur-xl">
             <Utensils size={200} color="#c084fc" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: 'rgba(192, 132, 252, 0.1)' }}>
                <Utensils size={28} color="#c084fc" />
              </div>
              <h2 className="text-2xl font-black tracking-tight" style={{ color: '#c084fc' }}>Fuel & Nutrition</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-[24px] flex flex-col items-center justify-center border" style={{ backgroundColor: '#050505', borderColor: '#1f1f1f' }}>
                <span className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#737373' }}>Energy Intake</span>
                <span className="text-4xl font-black" style={{ color: '#e879f9' }}>{totalCaloriesIntake.toLocaleString()} <span className="text-xl" style={{color: '#a3a3a3'}}>kcal</span></span>
              </div>
              <div className="p-6 rounded-[24px] flex flex-col items-center justify-center border" style={{ backgroundColor: '#050505', borderColor: '#1f1f1f' }}>
                <span className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#737373' }}>Protein synthesis</span>
                <span className="text-4xl font-black" style={{ color: '#c084fc' }}>{totalProteinIntake.toLocaleString()} <span className="text-xl" style={{color: '#a3a3a3'}}>g</span></span>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Finance Base */}
        {options.finance && (
        <div className="border rounded-[32px] p-8 col-span-2 shadow-2xl relative overflow-hidden" style={{ backgroundColor: '#0a0a0a', borderColor: '#1f1f1f' }}>
          <div className="absolute -top-10 -right-10 opacity-5 blur-xl">
             <Wallet size={200} color="#34d399" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)' }}>
                  <Wallet size={28} color="#34d399" />
                </div>
                <h2 className="text-2xl font-black tracking-tight" style={{ color: '#34d399' }}>Financial Health</h2>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Vitality Score</div>
                <div className={`text-3xl font-black ${stats.financialScore > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>{stats.financialScore}/100</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-5 rounded-[20px] border flex flex-col" style={{ backgroundColor: '#050505', borderColor: '#1f1f1f' }}>
                <span className="text-[10px] font-black uppercase tracking-widest mb-2 text-emerald-500">Gross Monthly Influx</span>
                <span className="text-2xl font-black text-white">₹{Math.round(totalIncome).toLocaleString()}</span>
              </div>
              <div className="p-5 rounded-[20px] border flex flex-col" style={{ backgroundColor: '#050505', borderColor: '#1f1f1f' }}>
                <span className="text-[10px] font-black uppercase tracking-widest mb-2 text-red-400">Current Spend Rate</span>
                <span className="text-2xl font-black text-white">₹{Math.round(monthlySpending).toLocaleString()}</span>
              </div>
              <div className="p-5 rounded-[20px] border flex flex-col" style={{ backgroundColor: '#050505', borderColor: '#1f1f1f' }}>
                <span className="text-[10px] font-black uppercase tracking-widest mb-2 text-blue-400">Net Estimated Savings</span>
                <span className="text-2xl font-black text-white">₹{Math.round(netMonthlySavings).toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-5 rounded-[20px] border flex flex-col justify-between" style={{ backgroundColor: '#050505', borderColor: '#1f1f1f' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Tv size={16} className="text-rose-400" />
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Active Subscriptions</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-black text-white">₹{Math.round(recurringExpenses).toLocaleString()}</div>
                      <div className="text-[10px] text-neutral-500 font-medium">/ month burn</div>
                    </div>
                    <div className="text-lg font-bold text-neutral-600">{subscriptions.filter(s=>s.type==='expense').length} active</div>
                  </div>
                </div>

                <div className="p-5 rounded-[20px] border flex flex-col justify-between" style={{ backgroundColor: '#050505', borderColor: '#1f1f1f' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Landmark size={16} className="text-indigo-400" />
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Debt Load</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-black text-white">₹{Math.round(remainingDebt).toLocaleString()}</div>
                      <div className="text-[10px] text-neutral-500 font-medium">remaining balance</div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-bold text-neutral-400">EMI: ₹{Math.round(totalEMI).toLocaleString()}</div>
                       <div className="text-[9px] font-black text-neutral-600 uppercase tracking-wider">{Math.round(stats.debtRatio * 100)}% DTI</div>
                    </div>
                  </div>
                </div>
            </div>
            
            {goals.length > 0 && (
              <div className="p-5 rounded-[20px] border mt-4" style={{ backgroundColor: '#050505', borderColor: '#1f1f1f' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Goal Progress</span>
                  <span className="text-xs font-bold text-emerald-500">{goals.length} Active</span>
                </div>
                <div className="space-y-3">
                  {goals.map((g, idx) => {
                    const percent = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-bold text-white mb-1">{g.name}</div>
                          <div className="w-full bg-[#1a1a1a] h-[6px] rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                           <div className="text-sm font-black text-emerald-400">₹{g.currentAmount.toLocaleString()}</div>
                           <div className="text-[10px] text-neutral-500">/ ₹{g.targetAmount.toLocaleString()}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
        )}

      </div>

      {/* Footer */}
      <div className="mt-12 text-center pb-8 pt-8 border-t" style={{ borderColor: '#1f1f1f' }}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: '#525252' }}>
          Confidential • Generated by LifeOS • {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
});

InfographicPDF.displayName = 'InfographicPDF';
