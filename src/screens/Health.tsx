import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeContext';
import { motion, AnimatePresence } from 'motion/react';
import { Apple, Dumbbell, Droplet, Scale, Plus, Trash2, TrendingUp, Sparkles, Droplets, History, Bot, Search, PieChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid, LineChart, Line } from 'recharts';
import { GoogleGenAI } from '@google/genai';

import { estimateMacros, estimate1RM, getMuscleGroup, getFoodSuggestion, getWorkoutNudge, EXERCISE_DATABASE } from '../lib/engine';
import { Settings } from 'lucide-react';
import { TargetEditor } from '../components/TargetEditor';

export default function Health() {
  const { dietLogs, workouts, activity } = useLifeOS();
  const [activeTab, setActiveTab] = useState<'diet' | 'water' | 'workout' | 'weight' | 'ai'>('water');

  const today = new Date().toISOString().split('T')[0];
  
  const todayDiet = dietLogs.filter(d => d.date.startsWith(today));
  const intakeCals = todayDiet.reduce((sum, d) => sum + (d.calories || 0), 0);
  const todayProtein = todayDiet.reduce((sum, d) => sum + (d.protein || 0), 0);
  const todayCarbs = todayDiet.reduce((sum, d) => sum + (d.carbs || 0), 0);
  const todayFats = todayDiet.reduce((sum, d) => sum + (d.fats || 0), 0);
  const todayCalcium = todayDiet.reduce((sum, d) => sum + (d.calcium || 0), 0);

  const todayWorkouts = workouts.filter(w => w.date.startsWith(today));
  let workoutCals = 0;
  todayWorkouts.forEach(w => {
    if (w.type === 'cardio') workoutCals += (w.durationMins || 0) * 10;
    else if (w.type === 'bodyweight') workoutCals += (w.sets || 0) * (w.reps || 0) * 1;
    else workoutCals += (w.sets || 0) * (w.reps || 0) * 0.5;
  });

  const bmr = 1800;
  const todayAct = activity.find(a => a.date === today);
  const stepsCals = (todayAct?.steps || 0) * 0.04;
  const totalBurned = Math.round(bmr + stepsCals + workoutCals);
  const netCals = intakeCals - totalBurned;

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-4">Health OS</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 relative overflow-hidden">
            <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Consumed</div>
            <div className="text-2xl font-black text-emerald-400">{intakeCals} <span className="text-xs text-emerald-500/50">kcal</span></div>
            <div className="flex items-center gap-1.5 mt-2">
               <span className="text-[9px] text-red-400 font-bold">P: {todayProtein}g</span>
               <span className="text-[9px] text-orange-400 font-bold">F: {todayFats}g</span>
               <span className="text-[9px] text-blue-400 font-bold">C: {todayCarbs}g</span>
               <span className="text-[9px] text-purple-400 font-bold">Ca: {todayCalcium}mg</span>
            </div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 relative overflow-hidden">
            <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Burned (BMR+)</div>
            <div className="text-2xl font-black text-orange-400">{totalBurned} <span className="text-xs text-orange-500/50">kcal</span></div>
            <div className="text-[10px] mt-1 text-neutral-500 font-bold tracking-wide">Net: <span className={netCals > 0 ? "text-red-400" : "text-emerald-400"}>{netCals > 0 ? `+${Math.abs(netCals)} (Surplus)` : `-${Math.abs(netCals)} (Deficit)`}</span></div>
          </div>
        </div>

        <div className="flex bg-neutral-900 border border-neutral-800 p-1.5 rounded-2xl relative w-full mb-2 overflow-x-auto nice-scroll">
          {['water', 'diet', 'workout', 'weight', 'ai'].map(tab => {
            const isActive = activeTab === tab;
            return (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-bold uppercase tracking-wider relative z-10 transition-colors ${isActive ? 'text-white' : 'text-neutral-500'}`}
              >
                {isActive && (
                  <motion.div layoutId="health_tab_bub" className="absolute inset-0 bg-neutral-800 rounded-xl border border-neutral-700 shadow-sm" />
                )}
                <span className="relative z-10 flex items-center gap-1 flex-col">
                  {tab === 'water' && <Droplet size={16} className={isActive ? "text-blue-400" : ""} />}
                  {tab === 'diet' && <Apple size={16} className={isActive ? "text-emerald-400" : ""} />}
                  {tab === 'workout' && <Dumbbell size={16} className={isActive ? "text-red-400" : ""} />}
                  {tab === 'weight' && <Scale size={16} className={isActive ? "text-purple-400" : ""} />}
                  {tab === 'ai' && <Bot size={16} className={isActive ? "text-yellow-400" : ""} />}
                  {tab === 'ai' ? 'AI Search' : tab}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'water' && <WaterTab key="water" />}
          {activeTab === 'diet' && <DietTab key="diet" />}
          {activeTab === 'workout' && <WorkoutTab key="workout" />}
          {activeTab === 'weight' && <WeightTab key="weight" />}
          {activeTab === 'ai' && <AITab key="ai" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function WaterTab() {
  const { water, settings, updateWater, updateSettings } = useLifeOS();
  const today = new Date().toISOString().split('T')[0];
  const todayLog = water.find(w => w.date === today) || { cups: 0, target: settings?.waterTarget || 8 };

  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('Cup');

  const handleDrink = (addedVal: number) => {
    updateWater(todayLog.cups + addedVal);
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && !isNaN(Number(amount))) {
      let cupsToAdd = 0;
      if (unit === 'Cup') cupsToAdd = Number(amount);
      if (unit === 'Glass') cupsToAdd = Number(amount) * 1.4; // 1 glass = 350ml = 1.4 cups
      if (unit === 'ml') cupsToAdd = Number(amount) / 250;
      updateWater(todayLog.cups + cupsToAdd);
      setAmount('');
    }
  };

  const progress = Math.min((todayLog.cups / todayLog.target) * 100, 100);

  const sortedWater = [...water].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const pastWater = sortedWater.filter(w => w.date !== today).slice(0, 7);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 pb-8">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <Droplets size={120} className="text-blue-500/10 absolute -left-4 -bottom-4 animate-pulse" />
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-2">Hydration Target</h2>
        <div className="text-7xl font-black text-white tracking-tighter mb-1 flex items-baseline gap-2">
          {todayLog.cups.toFixed(1)} 
          <TargetEditor value={todayLog.target} onChange={(val) => updateSettings({ ...settings, waterTarget: val })} />
        </div>
        <div className="text-sm text-blue-500 font-medium tracking-wide">
          Cups of water (250ml)
        </div>
        
        <div className="w-full bg-neutral-950 h-3 rounded-full mt-6 overflow-hidden">
           <motion.div initial={{width: 0}} animate={{width: `${progress}%`}} className="h-full bg-blue-500 rounded-full" />
        </div>
      </div>
      
      <div className="flex gap-2 w-full">
        <button onClick={() => handleDrink(1)} className="flex-1 py-4 bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold rounded-2xl hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2">
          <Droplet size={18} fill="currentColor" /> +1 Cup
        </button>
        <button onClick={() => handleDrink(1.4)} className="flex-1 py-4 bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold rounded-2xl hover:bg-blue-600/30 transition-colors flex items-center justify-center gap-2">
          <Droplet size={18} fill="currentColor" /> +1 Glass
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-3xl">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 px-2">Manual Entry</h3>
        <form onSubmit={handleCustomAdd} className="flex gap-2">
           <select value={unit} onChange={e => setUnit(e.target.value)} className="bg-neutral-950 border border-neutral-800 text-xs text-white p-3 rounded-xl outline-none focus:border-blue-500">
              <option value="Cup">Cups</option>
              <option value="Glass">Glasses</option>
              <option value="ml">ml</option>
           </select>
           <input 
              type="number" min="0.1" max="10000" step="0.1"
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="Amount" 
              className="flex-1 min-w-0 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500" 
              required 
            />
            <button type="submit" className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-xl transition-colors min-w-[50px] flex justify-center"><Plus size={20} /></button>
        </form>
      </div>

      {todayLog.cups >= todayLog.target && (
         <div className="text-center text-emerald-400 text-sm font-bold animate-pulse">Hydration goal reached! Awesome!</div>
      )}

      {/* History Tracker */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
           <History size={20} className="text-blue-500" />
           <h2 className="font-bold text-white tracking-wide">Last 7 Days History</h2>
        </div>
        <div className="space-y-3">
           {pastWater.map(w => (
             <div key={w.date} className="flex justify-between items-center bg-neutral-950/50 border border-neutral-800 p-3 rounded-xl">
               <span className="text-sm font-semibold text-neutral-300">
                  {new Date(w.date).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}
               </span>
               <div className="text-right flex items-baseline gap-1">
                 <div className="text-sm text-blue-400 font-bold">{w.cups.toFixed(1)} <span className="text-[10px] text-neutral-500 font-medium tracking-wide">/ {w.target || 8} cups</span></div>
               </div>
             </div>
           ))}
           {pastWater.length === 0 && <div className="text-center text-xs text-neutral-600 pt-2 pb-2">No history yet.</div>}
        </div>
      </div>
    </motion.div>
  );
}

function WeightTab() {
  const { weight, addWeight } = useLifeOS();
  const [val, setVal] = useState('');

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if(val && !isNaN(Number(val))) {
      addWeight(Number(val));
      setVal('');
    }
  };

  const sorted = [...weight].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const current = sorted.length > 0 ? sorted[0].weight : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
       <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <Scale size={120} className="text-purple-500/10 absolute -right-4 -bottom-4" />
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-2">Current Weight</h2>
        <div className="text-7xl font-black text-white tracking-tighter mb-1 select-all">
          {current > 0 ? current.toFixed(1) : '--'} <span className="text-2xl text-neutral-600">kg</span>
        </div>
      </div>

      <form onSubmit={handleAddWeight} className="flex gap-2">
        <input 
          type="number" step="0.1" min="1" max="500"
          value={val} 
          onChange={e => setVal(e.target.value)} 
          placeholder="Enter weight in kg..." 
          className="flex-1 min-w-0 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-700" 
          required 
        />
        <button type="submit" className="shrink-0 bg-purple-600 hover:bg-purple-500 text-white font-bold p-3 rounded-xl transition-colors"><Plus size={20} /></button>
      </form>

      <div className="space-y-2 mt-6 pb-8">
         <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 pl-2">History</h3>
         {sorted.slice(0, 10).map((w,i) => (
           <div key={w.id} className="flex justify-between items-center p-4 rounded-xl border bg-neutral-900/50 border-neutral-800/80">
              <span className="text-sm text-neutral-400">{new Date(w.date).toLocaleDateString()}</span>
              <span className="text-white font-bold">{w.weight.toFixed(1)} kg</span>
           </div>
         ))}
         {sorted.length === 0 && <div className="text-center text-xs text-neutral-600">No weight logs yet.</div>}
      </div>
    </motion.div>
  )
}

function DietTab() {
  const { dietLogs, settings, updateSettings, addDietLog, deleteDietLog } = useLifeOS();
  const [meal, setMeal] = useState('');
  const [cals, setCals] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const targetCals = settings?.caloriesTarget || 2000;
  const targetProtein = settings?.proteinTarget || 150;

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = dietLogs.filter(d => d.date.startsWith(today));
  const todayCals = todayLogs.reduce((acc, curr) => acc + curr.calories, 0);
  const todayProtein = todayLogs.reduce((acc, curr) => acc + (curr.protein || 0), 0);
  const todayCarbs = todayLogs.reduce((acc, curr) => acc + (curr.carbs || 0), 0);
  const todayFats = todayLogs.reduce((acc, curr) => acc + (curr.fats || 0), 0);
  const todayCalcium = todayLogs.reduce((acc, curr) => acc + (curr.calcium || 0), 0);

  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLogs = dietLogs.filter(d => d.date.startsWith(dateStr));
    const cals = dayLogs.reduce((acc, curr) => acc + (curr.calories || 0), 0);
    trendData.push({
      dateStr,
      day: d.toLocaleDateString(undefined, {weekday: 'short'}),
      Calories: cals,
      protein: dayLogs.reduce((sum, curr) => sum + (curr.protein || 0), 0),
      carbs: dayLogs.reduce((sum, curr) => sum + (curr.carbs || 0), 0),
      fats: dayLogs.reduce((sum, curr) => sum + (curr.fats || 0), 0),
    });
  }

  const sortedDiet = [...dietLogs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const pastDiet = sortedDiet.filter(d => !d.date.startsWith(today)).slice(0, 7);

  const total7DaysCals = trendData.reduce((acc, curr) => acc + curr.Calories, 0);
  const avgCals = Math.round(total7DaysCals / 7);
  const avgProtein = Math.round(trendData.reduce((acc, curr) => acc + curr.protein, 0) / 7);
  const avgCarbs = Math.round(trendData.reduce((acc, curr) => acc + curr.carbs, 0) / 7);
  const avgFats = Math.round(trendData.reduce((acc, curr) => acc + curr.fats, 0) / 7);


  const handleMealBlur = () => {
    let currentCals = cals;
    if (meal && !cals) {
      const macros = estimateMacros(meal);
      currentCals = macros.calories.toString();
      setCals(currentCals);
    }
    
    if (meal) {
      setSuggestion(getFoodSuggestion(meal, parseInt(currentCals) || 0, todayLogs, dietLogs));
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (meal && cals && !isNaN(parseInt(cals))) {
      const macros = estimateMacros(meal);
      const parsedCals = parseInt(cals);
      const ratio = parsedCals / (macros.calories || 1);
      
      addDietLog({ 
        meal, 
        calories: parsedCals, 
        protein: Math.round(macros.protein * ratio),
        carbs: Math.round(macros.carbs * ratio),
        fats: Math.round(macros.fats * ratio),
        calcium: Math.round((macros.calcium || 0) * ratio),
        date: new Date().toISOString() 
      });
      setMeal(''); setCals(''); setSuggestion('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden relative">
        <Sparkles size={120} className="text-emerald-500/5 absolute -right-4 -top-4 pointer-events-none" />
        
        <div className="p-6">
          <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Today's Intake</h2>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-black text-white">{todayCals}</span>
            <TargetEditor value={targetCals} onChange={(val) => updateSettings({ ...settings, caloriesTarget: val })} unit="kcal" />
          </div>

          <div className="flex gap-4">
             <div className="flex-1">
               <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1 flex items-center justify-between">
                 Protein <div className="text-blue-500 inline-block translate-y-[2px]"><TargetEditor hideSlash value={targetProtein} onChange={(val) => updateSettings({ ...settings, proteinTarget: val })} unit="g" /></div>
               </div>
               <div className="text-sm font-semibold text-blue-400">{todayProtein}g</div>
               <div className="h-1 bg-neutral-800 mt-1 rounded"><div className="h-full bg-blue-500 rounded" style={{width: `${Math.min((todayProtein / targetProtein) * 100, 100)}%`}}/></div>
             </div>
             <div className="flex-1">
               <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Carbs</div>
               <div className="text-sm font-semibold text-emerald-400">{todayCarbs}g</div>
               <div className="h-1 bg-neutral-800 mt-1 rounded"><div className="h-full bg-emerald-500 rounded" style={{width: `${Math.min(todayCarbs, 300)/3}%`}}/></div>
             </div>
             <div className="flex-1">
               <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Fats</div>
               <div className="text-sm font-semibold text-orange-400">{todayFats}g</div>
               <div className="h-1 bg-neutral-800 mt-1 rounded"><div className="h-full bg-orange-500 rounded" style={{width: `${Math.min(todayFats, 100)}%`}}/></div>
             </div>
             <div className="flex-1">
               <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Calcium</div>
               <div className="text-sm font-semibold text-purple-400">{todayCalcium}mg</div>
               <div className="h-1 bg-neutral-800 mt-1 rounded"><div className="h-full bg-purple-500 rounded" style={{width: `${Math.min(todayCalcium, 1000)/10}%`}}/></div>
             </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="bg-neutral-900 rounded-3xl p-5 border border-neutral-800 space-y-3">
        <input type="text" value={meal} onChange={e => setMeal(e.target.value)} onBlur={handleMealBlur} placeholder="Meal description (AI est. macros)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none" required />
        <div className="flex gap-3">
          <input type="number" min="0" max="10000" value={cals} onChange={e => setCals(e.target.value)} placeholder="Est. Calories" className="w-full flex-1 min-w-0 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none" required />
          <button type="submit" className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold px-6 rounded-xl transition-colors min-w-[64px] flex items-center justify-center"><Plus size={20} /></button>
        </div>
        {suggestion && <p className="text-xs text-emerald-400 flex items-center gap-1"><Sparkles size={12}/> {suggestion}</p>}
      </form>

      <div className="space-y-3">
        {todayLogs.map(l => (
          <div key={l.id} className="flex flex-col bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800/50 gap-2">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-neutral-200">{l.meal}</div>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold text-sm">{l.calories} kcal</span>
                <button onClick={() => deleteDietLog(l.id)} className="text-neutral-600 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="flex gap-3 text-[10px] font-bold text-neutral-500">
               <span>P: <span className="text-white">{l.protein}g</span></span>
               <span>C: <span className="text-white">{l.carbs}g</span></span>
               <span>F: <span className="text-white">{l.fats}g</span></span>
               <span>Ca: <span className="text-white">{l.calcium || 0}mg</span></span>
            </div>
          </div>
        ))}
        {todayLogs.length === 0 && <div className="text-center text-xs text-neutral-600 pb-4">No meals logged today.</div>}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative flex flex-col">
          <div className="flex items-center gap-2 mb-4">
             <TrendingUp size={20} className="text-emerald-500" />
             <h2 className="font-bold text-white tracking-wide text-sm">Calorie Trend (7 Days)</h2>
          </div>
          <div className="h-32 w-full -ml-2">
             <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
               <AreaChart data={trendData}>
                 <defs>
                   <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#525252' }} dy={10} />
                 <RechartsTooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px', fontSize: '12px' }} itemStyle={{ color: '#10b981' }} />
                 <Area type="monotone" dataKey="Calories" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCals)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative flex flex-col">
          <div className="flex items-center gap-2 mb-4">
             <PieChart size={20} className="text-blue-500" />
             <h2 className="font-bold text-white tracking-wide text-sm">Macro Distribution (7 Days)</h2>
          </div>
          <div className="h-40 w-full -ml-2 mb-4">
             <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
               <BarChart data={trendData}>
                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#525252' }} dy={10} />
                 <RechartsTooltip cursor={{fill: '#171717'}} contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '12px', fontSize: '12px' }} />
                 <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" />
                 <Bar dataKey="protein" name="Protein (g)" stackId="a" fill="#3b82f6" radius={[0,0,4,4]} />
                 <Bar dataKey="carbs" name="Carbs (g)" stackId="a" fill="#10b981" />
                 <Bar dataKey="fats" name="Fats (g)" stackId="a" fill="#f97316" radius={[4,4,0,0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-4 border-t border-neutral-800 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">7-Day Daily Averages</span>
                <span className="text-white font-bold text-sm bg-neutral-800 px-3 py-1.5 rounded-xl">{avgCals} <span className="text-neutral-500 text-xs">kcal/day</span></span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex flex-col relative overflow-hidden">
                     <span className="text-[10px] text-blue-400/80 uppercase font-black tracking-widest mb-1">Protein</span>
                     <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-blue-400">{avgProtein}</span>
                        <span className="text-xs text-blue-500/50 font-bold mb-1 pb-0.5">g/day</span>
                     </div>
                     <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-950/50">
                       <div className="bg-blue-500 h-full transition-all" style={{ width: `${Math.min(100, Math.round((avgProtein / (avgProtein+avgCarbs+avgFats || 1)) * 100))}%` }} />
                     </div>
                     <span className="absolute top-3 right-3 text-[10px] font-bold text-blue-500/50">{Math.round((avgProtein / (avgProtein+avgCarbs+avgFats || 1)) * 100)}%</span>
                 </div>
                 
                 <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col relative overflow-hidden">
                     <span className="text-[10px] text-emerald-400/80 uppercase font-black tracking-widest mb-1">Carbs</span>
                     <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-emerald-400">{avgCarbs}</span>
                        <span className="text-xs text-emerald-500/50 font-bold mb-1 pb-0.5">g/day</span>
                     </div>
                     <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-950/50">
                       <div className="bg-emerald-500 h-full transition-all" style={{ width: `${Math.min(100, Math.round((avgCarbs / (avgProtein+avgCarbs+avgFats || 1)) * 100))}%` }} />
                     </div>
                     <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-500/50">{Math.round((avgCarbs / (avgProtein+avgCarbs+avgFats || 1)) * 100)}%</span>
                 </div>

                 <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex flex-col relative overflow-hidden">
                     <span className="text-[10px] text-orange-400/80 uppercase font-black tracking-widest mb-1">Fats</span>
                     <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-orange-400">{avgFats}</span>
                        <span className="text-xs text-orange-500/50 font-bold mb-1 pb-0.5">g/day</span>
                     </div>
                     <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-950/50">
                       <div className="bg-orange-500 h-full transition-all" style={{ width: `${Math.min(100, Math.round((avgFats / (avgProtein+avgCarbs+avgFats || 1)) * 100))}%` }} />
                     </div>
                     <span className="absolute top-3 right-3 text-[10px] font-bold text-orange-500/50">{Math.round((avgFats / (avgProtein+avgCarbs+avgFats || 1)) * 100)}%</span>
                 </div>
              </div>
          </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden pb-8">
        <div className="flex items-center gap-2 mb-4">
           <History size={20} className="text-emerald-500" />
           <h2 className="font-bold text-white tracking-wide text-sm">Recent Meals</h2>
        </div>
        <div className="space-y-3">
           {pastDiet.map(d => (
             <div key={d.id} className="flex justify-between items-center bg-neutral-950/50 border border-neutral-800 p-3 rounded-xl">
               <div className="flex flex-col">
                  <span className="text-sm font-semibold text-neutral-300">{d.meal}</span>
                  <span className="text-[10px] text-neutral-500 font-medium">
                     {new Date(d.date).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}
                  </span>
               </div>
               <div className="text-right flex items-baseline gap-1">
                 <div className="text-sm text-emerald-400 font-bold">{d.calories} <span className="text-[10px] text-neutral-500 font-medium tracking-wide">kcal</span></div>
               </div>
             </div>
           ))}
           {pastDiet.length === 0 && <div className="text-center text-xs text-neutral-600 pt-2 pb-2">No history yet.</div>}
        </div>
      </div>
    </motion.div>
  );
}

function WorkoutTab() {
  const { workouts, settings, updateSettings, addWorkout, deleteWorkout } = useLifeOS();
  const [exercise, setExercise] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const targetVolume = settings?.workoutWeeklyTarget || 10000;

  const today = new Date().toISOString().split('T')[0];
  const todayWorkouts = workouts.filter(w => w.date.startsWith(today));
  
  const totalVolume = todayWorkouts.reduce((acc, curr) => (curr.type === 'weight' || !curr.type) ? acc + ((curr.sets || 0) * (curr.reps || 0) * (curr.weight || 0)) : acc, 0);
  const totalSets = todayWorkouts.reduce((acc, curr) => ((curr.type === 'weight' || curr.type === 'bodyweight' || !curr.type) ? acc + (curr.sets || 0) : acc), 0);
  const totalReps = todayWorkouts.reduce((acc, curr) => ((curr.type === 'weight' || curr.type === 'bodyweight' || !curr.type) ? acc + (curr.reps || 0) : acc), 0);
  const totalDuration = todayWorkouts.reduce((acc, curr) => curr.type === 'cardio' ? acc + (curr.durationMins || 0) : acc, 0);

  const trendData = [];
  const oneRmTrendData: any[] = [];

  const last7DaysWorkouts = workouts.filter(w => new Date(w.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const weightWorkouts = last7DaysWorkouts.filter(w => w.type === 'weight' || !w.type);
  
  const exCounts: Record<string, number> = {};
  weightWorkouts.forEach(w => {
     exCounts[w.exercise] = (exCounts[w.exercise] || 0) + 1;
  });
  const topExercises = Object.entries(exCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
  const exColors = ['#3b82f6', '#10b981', '#f59e0b'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayWorkouts = workouts.filter(w => w.date.startsWith(dateStr));
    const dayWeightWorkouts = weightWorkouts.filter(w => w.date.startsWith(dateStr));

    const vol = dayWorkouts.reduce((acc, curr) => (curr.type === 'weight' || !curr.type) ? acc + ((curr.sets||0) * (curr.reps||0) * (curr.weight||0)) : acc, 0);
    const dayShort = d.toLocaleDateString(undefined, {weekday: 'short'});
    
    trendData.push({
      dateStr,
      day: dayShort,
      Volume: vol
    });

    const rmDayData: any = { day: dayShort };
    topExercises.forEach(ex => {
       // Find the max 1RM for this exercise on this day
       const max1RM = dayWeightWorkouts.filter(w => w.exercise === ex).reduce((max, curr) => Math.max(max, curr.oneRepMax || 0), 0);
       if (max1RM > 0) rmDayData[ex] = max1RM;
    });
    oneRmTrendData.push(rmDayData);
  }

  const exMatch = EXERCISE_DATABASE.find(e => e.name.toLowerCase() === exercise.toLowerCase());
  let exType = exMatch ? (exMatch.type as any) : 'weight';
  if (!exMatch) {
    const mg = getMuscleGroup(exercise);
    if (mg === 'Cardio') exType = 'cardio';
    else if (exercise.toLowerCase().includes('bodyweight') || exercise.toLowerCase().includes('push-up') || exercise.toLowerCase().includes('pull-up') || exercise.toLowerCase().includes('plank')) exType = 'bodyweight';
  }

  const handleWorkoutBlur = () => {
    if (exercise) {
      if (exType === 'weight' && sets && reps && weight) {
        const vol = parseInt(sets) * parseInt(reps) * parseInt(weight);
        setSuggestion(getWorkoutNudge(exercise, vol, workouts));
      }
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (exercise) {
      const pSets = sets && !isNaN(parseInt(sets)) ? parseInt(sets) : undefined;
      const pReps = reps && !isNaN(parseInt(reps)) ? parseInt(reps) : undefined;
      const pWeight = weight && !isNaN(parseInt(weight)) ? parseInt(weight) : undefined;
      const pDuration = duration && !isNaN(parseInt(duration)) ? parseInt(duration) : undefined;
      const pDistance = distance && !isNaN(parseFloat(distance)) ? parseFloat(distance) : undefined;

      addWorkout({ 
        exercise, 
        type: exType,
        sets: pSets, 
        reps: pReps, 
        weight: pWeight, 
        durationMins: pDuration,
        distanceKm: pDistance,
        oneRepMax: (pWeight && pReps) ? estimate1RM(pWeight, pReps) : 0,
        muscleGroup: getMuscleGroup(exercise),
        date: new Date().toISOString() 
      });
      setExercise(''); setSets(''); setReps(''); setWeight(''); setDuration(''); setDistance(''); setSuggestion('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Total Volume</div>
          <div className="text-2xl font-black text-red-500">{totalVolume.toLocaleString()} <span className="text-sm font-medium text-red-500/50">kg</span></div>
          <div className="text-[10px] text-neutral-500 font-bold uppercase mt-2 pt-2 border-t border-red-500/10 flex items-center justify-between">
            Target <div className="text-red-500 inline-block translate-y-[2px]"><TargetEditor hideSlash value={targetVolume} onChange={(val) => updateSettings({ ...settings, workoutWeeklyTarget: val })} unit="kg" /></div>
          </div>
          <div className="w-full h-1 bg-neutral-800 rounded-full mt-1 overflow-hidden">
             <div className="h-full bg-red-500 rounded-full" style={{width: `${Math.min((totalVolume/targetVolume)*100, 100)}%`}}></div>
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="text-[10px] text-neutral-500 font-bold uppercase mb-1">Cardio Duration</div>
          <div className="text-2xl font-black text-emerald-400">{totalDuration} <span className="text-sm font-medium text-emerald-500/50">min</span></div>
          <div className="text-[10px] mt-1 text-neutral-500 font-bold tracking-wide border-t border-emerald-500/10 pt-2">
             Active Time
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative flex flex-col space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <History size={20} className="text-red-500" />
               <h2 className="font-bold text-white tracking-wide text-sm">Volume Trend (7 Days)</h2>
            </div>
            <div className="h-40 w-full -ml-2">
               <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                 <BarChart data={trendData}>
                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#525252' }} dy={10} />
                   <RechartsTooltip 
                     cursor={{fill: '#171717'}}
                     contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px' }}
                     itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                     labelStyle={{ display: 'none' }}
                     formatter={(value: number) => [`${value.toLocaleString()} kg`, 'Volume']}
                   />
                   <Bar dataKey="Volume" fill="#ef4444" radius={[4,4,0,0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>

          {topExercises.length > 0 && (
            <div className="border-t border-neutral-800 pt-6">
              <div className="flex items-center gap-2 mb-4">
                 <TrendingUp size={20} className="text-blue-500" />
                 <h2 className="font-bold text-white tracking-wide text-sm">1RM Progress (7 Days)</h2>
              </div>
              <div className="h-40 w-full -ml-2">
                 <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                   <LineChart data={oneRmTrendData}>
                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#525252' }} dy={10} />
                     <YAxis hide domain={['auto', 'auto']} />
                     <RechartsTooltip 
                       contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px', fontSize: '10px' }}
                       labelStyle={{ display: 'none' }}
                     />
                     <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" />
                     {topExercises.map((ex, idx) => (
                       <Line 
                         key={ex} 
                         type="monotone" 
                         dataKey={ex} 
                         name={ex} 
                         stroke={exColors[idx % exColors.length]} 
                         strokeWidth={3} 
                         dot={{ r: 4, fill: exColors[idx % exColors.length], strokeWidth: 0 }} 
                         activeDot={{ r: 6 }} 
                         connectNulls 
                       />
                     ))}
                   </LineChart>
                 </ResponsiveContainer>
              </div>
            </div>
          )}
      </div>

      <form onSubmit={handleAdd} className="bg-neutral-900 rounded-3xl p-5 border border-neutral-800 space-y-3">
        <div className="relative">
           <input 
              type="text" 
              value={exercise} 
              onChange={e => {
                setExercise(e.target.value);
                setShowDropdown(true);
              }} 
              onFocus={() => setShowDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowDropdown(false), 200);
                handleWorkoutBlur();
              }}
              placeholder="Exercise (e.g. Bench Press)" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-red-500 outline-none pr-24 relative z-10" 
              required 
           />
           {exercise && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                 <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-1 rounded-md uppercase font-bold tracking-wider">{getMuscleGroup(exercise)}</span>
              </div>
           )}
           {showDropdown && (
              <div className="absolute top-full mt-2 left-0 w-full bg-neutral-950 border border-neutral-800 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] max-h-60 overflow-y-auto z-50 p-2">
                 {EXERCISE_DATABASE.filter(ex => ex.name.toLowerCase().includes(exercise.toLowerCase())).map((ex) => (
                    <div 
                       key={ex.name} 
                       className="px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg cursor-pointer flex justify-between items-center"
                       onClick={() => {
                          setExercise(ex.name);
                          setShowDropdown(false);
                       }}
                    >
                       <span>{ex.name}</span>
                       <span className="text-neutral-600 text-[10px] uppercase font-bold tracking-wider">{ex.muscleGroup}</span>
                    </div>
                 ))}
                 {exercise && EXERCISE_DATABASE.filter(ex => ex.name.toLowerCase().includes(exercise.toLowerCase())).length === 0 && (
                     <div className="px-3 py-2 text-xs text-neutral-500">Press Enter or log activity to add as custom exercise.</div>
                 )}
              </div>
           )}
        </div>
        
        {exType === 'weight' && (
          <div className="grid grid-cols-3 gap-2">
            <input type="number" min="1" max="100" value={sets} onChange={e => setSets(e.target.value)} onBlur={handleWorkoutBlur} placeholder="Sets" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-red-500 outline-none" required />
            <input type="number" min="1" max="1000" value={reps} onChange={e => setReps(e.target.value)} onBlur={handleWorkoutBlur} placeholder="Reps" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-red-500 outline-none" required />
            <input type="number" min="1" max="1000" step="0.5" value={weight} onChange={e => setWeight(e.target.value)} onBlur={handleWorkoutBlur} placeholder="Wt (kg)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-red-500 outline-none" required />
          </div>
        )}
        
        {exType === 'bodyweight' && (
          <div className="grid grid-cols-2 gap-2">
            <input type="number" min="1" max="100" value={sets} onChange={e => setSets(e.target.value)} placeholder="Sets" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-red-500 outline-none" required />
            <input type="number" min="1" max="5000" value={reps} onChange={e => setReps(e.target.value)} placeholder="Reps" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-red-500 outline-none" required />
          </div>
        )}

        {exType === 'cardio' && (
          <div className="grid grid-cols-2 gap-2">
            <input type="number" min="1" max="1440" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (min)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-red-500 outline-none" required />
            <input type="number" min="0.1" max="1000" step="0.1" value={distance} onChange={e => setDistance(e.target.value)} placeholder="Distance (km)" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-red-500 outline-none" />
          </div>
        )}

        <button type="submit" className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-colors flex items-center justify-center gap-2">
           Log Activity
        </button>
        {suggestion && <p className="text-xs text-red-400 mt-2 flex items-center gap-1"><Sparkles size={12}/> {suggestion}</p>}
      </form>

      <div className="space-y-3 pb-8">
        {todayWorkouts.map(w => (
          <div key={w.id} className="flex flex-col bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800/50 gap-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-white mb-1 flex items-center gap-2">
                   {w.exercise}
                   <span className="text-[9px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded uppercase">{w.muscleGroup}</span>
                </div>
                <div className="text-xs text-neutral-400 tracking-wider">
                  {w.type === 'cardio' ? (
                     <>{w.durationMins} MINS {w.distanceKm ? ` • ${w.distanceKm} km` : ''}</>
                  ) : w.type === 'bodyweight' ? (
                     <>{w.sets} SETS × {w.reps} REPS</>
                  ) : (
                     <>{w.sets} SETS × {w.reps} REPS  •  <span className="text-white">{w.weight} kg</span></>
                  )}
                </div>
              </div>
              <button onClick={() => deleteWorkout(w.id)} className="text-neutral-600 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
            
            {(w.type === 'weight' || !w.type) && w.oneRepMax > 0 && (
              <div className="bg-neutral-950/50 p-2 rounded-xl flex items-center gap-2 border border-neutral-900">
                 <Sparkles size={14} className="text-blue-400" />
                 <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Est 1RM: <span className="text-blue-400">{w.oneRepMax} kg</span></span>
              </div>
            )}
          </div>
        ))}
        {todayWorkouts.length === 0 && <div className="text-center text-xs text-neutral-600 pb-4">No workout logged today.</div>}
      </div>
    </motion.div>
  );
}

function AITab() {
  const { weight } = useLifeOS();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setResponse('');
    setSources([]);

    const latestWeight = weight && weight.length > 0 ? [...weight].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight : 'Unknown';

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemContext = `Context about the user: Current Body Weight: ${latestWeight}kg. Use this context if their prompt suggests body composition goals, like building six packs, bulking, or cutting, to provide personalized guidance based on their physique data. CRITICAL: Keep your response extremely concise, strictly under 5-6 lines.`;
      
      // Using gemini-3.1-pro-preview with built-in googleSearch tool for real-time accurate information
      const res = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: systemContext + "\n\nUser Query: " + query + " \n\nPlease provide accurate, evidence-based health/fitness information. Ground your answer with sources. Keep your response very brief (maximum 5-6 lines).",
        config: {
          tools: [{ googleSearch: {} }],
        }
      });

      setResponse(res.text || 'No response generated.');

      const chunks = res.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const extractedSources = chunks.map(c => c.web).filter(Boolean);
        setSources(extractedSources as any);
      }
    } catch (err: any) {
      console.error(err);
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 p-5 rounded-3xl border border-indigo-500/30">
        <h2 className="text-lg font-black text-white flex items-center gap-2 mb-2"><Bot className="text-indigo-400" /> AI Health Search</h2>
        <p className="text-xs text-indigo-200/80 mb-4">
          Ask any health or fitness question. Powered by Gemini with live Google Search Grounding for highly accurate, real-time measurements and facts. No false allegations.
        </p>

        <form onSubmit={handleSearch} className="relative mt-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. How much protein does 100g of chicken breast have?"
            className="w-full bg-black/50 border border-indigo-500/50 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-indigo-400 outline-none pr-12"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-white transition-colors disabled:opacity-50">
            {loading ? <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /> : <Search size={18} />}
          </button>
        </form>
      </div>

      {response && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-4">
          <div className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">
            {response}
          </div>

          {sources.length > 0 && (
            <div className="pt-4 border-t border-neutral-800">
              <h3 className="text-[10px] uppercase font-bold text-neutral-500 mb-2">Sources (Google Search)</h3>
              <ul className="space-y-2">
                {sources.map((s, idx) => (
                  <li key={idx}>
                    <a href={s.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                      • {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
