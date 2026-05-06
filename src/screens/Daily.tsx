import React, { useState, useEffect } from 'react';
import { useLifeOS } from '../context/LifeContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Clock, Flame, Play, Square, RotateCcw, Plus, Trash2, StopCircle } from 'lucide-react';

export default function Daily() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'timer'>('tasks');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const startTaskTimer = (id: string) => {
    setActiveTaskId(id);
    setActiveTab('timer');
  };

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Daily Focus</h1>
        <p className="text-sm text-neutral-500 mb-4">Manage your day, track your time.</p>
        <div className="flex bg-neutral-900 border border-neutral-800 p-1.5 rounded-2xl relative w-full mb-2">
          {['tasks', 'timer'].map(tab => {
            const isActive = activeTab === tab;
            return (
              <button 
                key={tab} onClick={() => setActiveTab(tab as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider relative z-10 transition-colors ${isActive ? 'text-white' : 'text-neutral-500'}`}
              >
                {isActive && <motion.div layoutId="focus_tab_bub" className="absolute inset-0 bg-neutral-800 rounded-xl border border-neutral-700 shadow-sm" />}
                <span className="relative z-10 flex items-center gap-1.5 flex-col md:flex-row">
                  {tab === 'tasks' && <CheckCircle2 size={16} className={isActive ? "text-blue-400" : ""} />}
                  {tab === 'timer' && <Clock size={16} className={isActive ? "text-blue-400" : ""} />}
                  {tab}
                </span>
              </button>
            );
          })}
        </div>
      </header>
      <main className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <TasksTab onStartTimer={startTaskTimer} />
            </motion.div>
          )}
          {activeTab === 'timer' && (
            <motion.div key="timer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center justify-center min-h-[50vh] space-y-12">
              <TimerTab presetTaskId={activeTaskId} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function TasksTab({ onStartTimer }: { onStartTimer: (id: string) => void }) {
  const { tasks, addTask, toggleTask, deleteTask } = useLifeOS();
  const [title, setTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (title) {
      addTask({ title, priority: 'medium', completed: false });
      setTitle('');
    }
  };

  return (
    <>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="E.g., Study 2 hours, Call parents..." 
          className="flex-1 min-w-0 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-neutral-700" 
          required 
        />
        <button type="submit" className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-xl transition-colors"><Plus size={20} /></button>
      </form>

      <div className="space-y-2 mt-6 pb-8">
        {tasks.map(t => (
          <div key={t.id} className={`flex flex-col p-4 rounded-xl border transition-all ${t.completed ? 'bg-neutral-950 border-neutral-900 opacity-50' : 'bg-neutral-900/50 border-neutral-800/80'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleTask(t.id)}>
                {t.completed ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-neutral-500" />}
                <span className={`text-sm tracking-wide ${t.completed ? 'line-through text-neutral-600' : 'text-neutral-200'}`}>{t.title}</span>
              </div>
              <div className="flex gap-3 items-center">
                {!t.completed && (
                  <button onClick={() => onStartTimer(t.id)} className="text-blue-500 hover:text-blue-400 bg-blue-500/10 p-1.5 rounded-lg flex items-center gap-1 transition-colors">
                    <Play size={14} /> <span className="text-[10px] font-bold">Focus</span>
                  </button>
                )}
                <button onClick={() => deleteTask(t.id)} className="text-neutral-600 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
              </div>
            </div>
            {t.timeSpentMins > 0 && (
              <div className="mt-3 text-xs text-neutral-500 pl-8 flex items-center gap-1.5">
                <Clock size={12} /> Logged {t.timeSpentMins} mins
              </div>
            )}
          </div>
        ))}
        {tasks.length === 0 && <div className="text-neutral-600 text-xs text-center mt-10">No tasks. Enjoy your day!</div>}
      </div>
    </>
  );
}

function TimerTab({ presetTaskId }: { presetTaskId: string | null }) {
  const { tasks, updateTaskTime } = useLifeOS();
  const [time, setTime] = useState(0); // in ms
  const [running, setRunning] = useState(false);
  
  const activeTask = tasks.find(t => t.id === presetTaskId);

  // Instead of updating the task store every second, we'll update it when the user stops.
  useEffect(() => {
    let interval: any;
    if (running) interval = setInterval(() => setTime(t => t + 100), 100);
    else clearInterval(interval);
    return () => clearInterval(interval);
  }, [running]);

  const handleStop = () => {
    setRunning(false);
    if (presetTaskId && time > 60000) { // If more than a minute, log it.
      const mins = Math.floor(time / 60000);
      updateTaskTime(presetTaskId, mins);
      // Removed window.alert to not block UI
      setTime(0);
    } else {
      setTime(0);
    }
  };

  const mins = Math.floor((time / 60000) % 60).toString().padStart(2, '0');
  const secs = Math.floor((time / 1000) % 60).toString().padStart(2, '0');

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <Flame size={20} className="text-blue-500 animate-pulse" />
          <span className="text-blue-500 font-bold tracking-widest uppercase text-xs">Deep Work Session</span>
        </div>
        {activeTask && (
          <p className="text-neutral-400 text-sm mt-2">Working on: <strong className="text-white">{activeTask.title}</strong></p>
        )}
      </div>
      
      <div className="text-7xl font-black text-white tracking-tighter tabular-nums flex space-x-2 items-baseline">
        <span>{mins}</span><span className="text-neutral-500 text-5xl">:</span>
        <span>{secs}</span>
      </div>

      <div className="flex gap-4">
        <button onClick={() => setRunning(!running)} className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${running ? 'bg-neutral-800 text-neutral-400 border border-neutral-700' : 'bg-blue-500 text-neutral-950 border border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]'}`}>
          {running ? <StopCircle size={24} /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        {time > 0 && (
           <button onClick={handleStop} className="h-16 w-16 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all font-bold text-[10px] uppercase">
             Save
           </button>
        )}
      </div>
    </>
  );
}
