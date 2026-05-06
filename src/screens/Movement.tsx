import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeContext';
import { motion } from 'motion/react';
import { Activity as ActivityIcon, MapPin, Plus, Trash2, Footprints, History } from 'lucide-react';
import { TargetEditor } from '../components/TargetEditor';

export default function Movement() {
  const { activity, settings, updateActivity, updateSettings, commute, addCommute } = useLifeOS();
  const today = new Date().toISOString().split('T')[0];
  const todayLog = activity.find(a => a.date === today) || { steps: 0, distanceKm: 0, activeMins: 0 };
  
  const targetSteps = settings?.stepsTarget || 10000;
  const targetMins = settings?.activeMinsTarget || 30;

  const addManualSteps = (amount: number) => {
    updateActivity(todayLog.steps + amount, todayLog.distanceKm + (0.000762 * amount), todayLog.activeMins + (amount / 100));
  };

  const [mode, setMode] = useState('Train');
  const [mins, setMins] = useState('');

  const handleAddCommute = (e: React.FormEvent) => {
    e.preventDefault();
    if(mins && !isNaN(Number(mins))) {
      addCommute({
        mode,
        durationMins: Number(mins),
        date: new Date().toISOString()
      });
      setMins('');
    }
  };

  const todayCommutes = commute.filter(c => c.date.startsWith(today));
  
  const sortedActivity = [...activity].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const pastActivity = sortedActivity.filter(a => a.date !== today).slice(0, 7);

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Movement</h1>
        <p className="text-sm text-neutral-500">Track your steps & daily commutes.</p>
      </header>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-8">
        
        {/* Steps Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <Footprints size={120} className="text-emerald-500/10 absolute -right-4 -bottom-4" />
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-2">Today&#x27;s Steps</h2>
          <div className="text-7xl font-black text-white tracking-tighter mb-1 select-all flex items-baseline gap-2">
            {todayLog.steps.toLocaleString()}
            <TargetEditor value={targetSteps} onChange={(val) => updateSettings({ ...settings, stepsTarget: val })} />
          </div>
          <div className="text-sm text-emerald-500 font-medium tracking-wide flex items-center gap-1">
             ~ {todayLog.distanceKm.toFixed(2)} km • 
             {Math.round(todayLog.activeMins)}
             <TargetEditor value={targetMins} onChange={(val) => updateSettings({ ...settings, activeMinsTarget: val })} unit="min" /> active
          </div>
        </div>
        
        {!settings.autoTrack && (
          <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-2xl text-center flex flex-col items-center gap-3">
            <p className="text-xs font-semibold text-neutral-400">Manual Entry</p>
            <div className="flex gap-2 w-full">
              <button onClick={() => addManualSteps(100)} className="flex-1 py-3 bg-neutral-800 rounded-xl text-xs font-bold text-white hover:bg-neutral-700 transition">
                +100 Steps
              </button>
              <button onClick={() => addManualSteps(1000)} className="flex-1 py-3 bg-neutral-800 rounded-xl text-xs font-bold text-white hover:bg-neutral-700 transition">
                +1000 Steps
              </button>
            </div>
          </div>
        )}
        
        {settings.autoTrack && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500/80 p-4 rounded-xl text-center text-xs font-semibold animate-pulse">
            Auto-Tracking actively reading movement via sensors.
          </div>
        )}

        {/* History Tracker */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
             <History size={20} className="text-emerald-500" />
             <h2 className="font-bold text-white tracking-wide">Last 7 Days History</h2>
          </div>
          <div className="space-y-3">
             {pastActivity.map(a => (
               <div key={a.date} className="flex justify-between items-center bg-neutral-950/50 border border-neutral-800 p-3 rounded-xl">
                 <span className="text-sm font-semibold text-neutral-300">
                    {new Date(a.date).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'})}
                 </span>
                 <div className="text-right">
                   <div className="text-sm text-emerald-400 font-bold">{a.steps.toLocaleString()} steps</div>
                   <div className="text-[10px] text-neutral-500">{a.distanceKm.toFixed(2)} km • {Math.round(a.activeMins)} min active</div>
                 </div>
               </div>
             ))}
             {pastActivity.length === 0 && <div className="text-center text-xs text-neutral-600 pt-2 pb-2">No history yet.</div>}
          </div>
        </div>

        {/* Commute Tracker */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden mt-6">
          <div className="flex items-center gap-2 mb-4">
             <MapPin size={20} className="text-blue-500" />
             <h2 className="font-bold text-white tracking-wide">Commute &amp; Travel</h2>
          </div>
          
          <form onSubmit={handleAddCommute} className="flex gap-2 mb-4">
            <select value={mode} onChange={e => setMode(e.target.value)} className="bg-neutral-950 border border-neutral-800 text-xs text-white p-3 rounded-xl outline-none focus:border-blue-500">
              <option value="Train">Train</option>
              <option value="Metro">Metro</option>
              <option value="Bus">Bus</option>
              <option value="Auto-Rickshaw">Auto-Rickshaw</option>
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
              <option value="Walking">Walking</option>
            </select>
            <input 
              type="number" min="1" max="1440"
              value={mins} 
              onChange={e => setMins(e.target.value)} 
              placeholder="Mins" 
              className="flex-1 min-w-0 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500" 
              required 
            />
            <button type="submit" className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-xl transition-colors"><Plus size={20} /></button>
          </form>

          <div className="space-y-2">
            {todayCommutes.map((c, i) => (
               <div key={c.id} className="flex justify-between items-center bg-neutral-950/50 border border-neutral-800 p-3 rounded-xl">
                 <span className="text-sm font-semibold text-neutral-300">{c.mode}</span>
                 <span className="text-sm text-blue-400 font-bold">{c.durationMins} mins</span>
               </div>
            ))}
            {todayCommutes.length === 0 && <div className="text-center text-xs text-neutral-600 pt-2 pb-2">No commutes logged today.</div>}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
