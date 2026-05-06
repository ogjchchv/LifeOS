import React, { useState } from 'react';
import { Footprints, Heart, ListTodo, Settings, LayoutDashboard, WalletCards } from 'lucide-react';
import { cn } from './lib/utils';
import Dashboard from './screens/Dashboard';
import Health from './screens/Health';
import Daily from './screens/Daily';
import Movement from './screens/Movement';
import AppSettings from './screens/Settings';
import Finance from './screens/Finance';

type ScreenName = 'dashboard' | 'daily' | 'movement' | 'health' | 'finance' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('dashboard');

  return (
    <div className="flex justify-center w-full min-h-screen font-sans selection:bg-emerald-500/30">
      <div className="w-full max-w-md bg-neutral-950 min-h-screen shadow-2xl relative flex flex-col overflow-hidden border-x border-neutral-900">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
          {currentScreen === 'dashboard' && <Dashboard onNavigate={setCurrentScreen} />}
          {currentScreen === 'daily' && <Daily />}
          {currentScreen === 'movement' && <Movement />}
          {currentScreen === 'health' && <Health />}
          {currentScreen === 'finance' && <Finance />}
          {currentScreen === 'settings' && <AppSettings />}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-neutral-950/80 backdrop-blur-xl border-t border-neutral-800/60 flex justify-around items-center px-1 py-3 pb-safe z-50">
          <NavItem 
            icon={<LayoutDashboard size={22} />} 
            label="Dash" 
            isActive={currentScreen === 'dashboard'} 
            onClick={() => setCurrentScreen('dashboard')} 
          />
          <NavItem 
            icon={<ListTodo size={22} />} 
            label="Daily" 
            isActive={currentScreen === 'daily'} 
            onClick={() => setCurrentScreen('daily')} 
          />
          <NavItem 
            icon={<Footprints size={22} />} 
            label="Move" 
            isActive={currentScreen === 'movement'} 
            onClick={() => setCurrentScreen('movement')} 
          />
          <NavItem 
            icon={<Heart size={22} />} 
            label="Health" 
            isActive={currentScreen === 'health'} 
            onClick={() => setCurrentScreen('health')} 
          />
          <NavItem 
            icon={<WalletCards size={22} />} 
            label="Spend" 
            isActive={currentScreen === 'finance'} 
            onClick={() => setCurrentScreen('finance')} 
          />
          <NavItem 
            icon={<Settings size={22} />} 
            label="Settings" 
            isActive={currentScreen === 'settings'} 
            onClick={() => setCurrentScreen('settings')} 
          />
        </nav>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center space-y-1.5 w-14 transition-all duration-300",
        isActive ? "text-emerald-400 scale-105" : "text-neutral-500 hover:text-neutral-300 hover:scale-100 scale-95"
      )}
    >
      <div className={cn("p-1.5 rounded-full transition-colors", isActive && "bg-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.15)]")}>
        {icon}
      </div>
      <span className="text-[9px] font-bold tracking-widest uppercase">{label}</span>
    </button>
  );
}
