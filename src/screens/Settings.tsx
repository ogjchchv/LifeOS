import React, { useState, useRef } from 'react';
import { useLifeOS } from '../context/LifeContext';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, BellRing, RefreshCw, Smartphone, DownloadCloud, ShieldCheck, Trash2, FileText, Plus } from 'lucide-react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { InfographicPDF } from '../components/InfographicPDF';

export default function AppSettings() {
  const { settings, updateSettings, workouts, clearWorkouts, transactionRules, addTransactionRule, deleteTransactionRule } = useLifeOS();
  const [syncing, setSyncing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    workouts: true,
    activity: true,
    diet: true,
    finance: true,
  });
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const [ruleKeyword, setRuleKeyword] = useState('');
  const [ruleCategory, setRuleCategory] = useState('shopping');

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      // Removed window.alert to not block UI
    }, 2000);
  };
  
  const [syncingPlatform, setSyncingPlatform] = useState<string | null>(null);

  const handleSyncPlatform = (platform: string) => {
    setSyncingPlatform(platform);
    setTimeout(() => {
      setSyncingPlatform(null);
      // Removed window.alert to not block UI
    }, 2500);
  };
  
  const handleExportPDF = async () => {
    if (!pdfRef.current) return;
    setIsExporting(true);
    try {
      const el = pdfRef.current;
      const width = el.offsetWidth || 800;
      const height = el.scrollHeight || 1200; // Use scrollHeight for full content
      
      // html-to-image to handle oklch correctly
      const dataUrl = await toPng(el, {
        backgroundColor: '#0a0a0a',
        pixelRatio: 2,
        width,
        height,
        style: {
          transform: 'none',
        }
      });
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [width, height]
      });
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
      pdf.save(`lifeos-infographic-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Export failed", error);
      // Removed alert
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Settings</h1>
        <p className="text-neutral-500 text-sm">Configure your alarms, syncing, and privacy.</p>
      </header>

      {/* Hidden component for generating the PDF */}
      <div style={{ position: 'absolute', top: 0, left: '-9999px', zIndex: -100 }}>
        <InfographicPDF ref={pdfRef} options={exportOptions} />
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2"><Flame size={16} className="text-orange-500"/> Core Auto-Tracking</h3>
              <p className="text-xs text-neutral-500 mr-8">Uses background sensors to intelligently guess your movement and steps when on the go.</p>
            </div>
            <button 
               onClick={() => updateSettings({ autoTrack: !settings.autoTrack })}
               className={`min-w-12 h-6 rounded-full p-1 transition-colors ${settings.autoTrack ? 'bg-emerald-500' : 'bg-neutral-700'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full transition-transform ${settings.autoTrack ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          
          <div className="h-px w-full bg-neutral-800" />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2"><BellRing size={16} className="text-blue-500"/> Smart Nudges</h3>
              <p className="text-xs text-neutral-500 mr-8">Gentle, friendly reminders to drink water, log meals, or hit the gym if you're slipping.</p>
            </div>
            <button 
               onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
               className={`min-w-12 h-6 rounded-full p-1 transition-colors ${settings.notificationsEnabled ? 'bg-emerald-500' : 'bg-neutral-700'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full transition-transform ${settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-emerald-500"/> Privacy & Transparency
            </h3>
            <p className="text-xs text-neutral-500">
              We track only what's necessary (steps, activity, explicit input).
              No bank data, no messages, no call logs, no social media.
            </p>
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
              <RefreshCw size={16} className="text-purple-500"/> Health Data Sync
            </h3>
            <p className="text-xs text-neutral-500">
              Securely synchronize your records with third-party ecosystems or export a local CSV copy.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button onClick={() => handleSyncPlatform('Strava')} disabled={syncingPlatform !== null} className="w-full py-3 bg-[#FC4C02]/20 text-[#FC4C02] border border-[#FC4C02]/30 font-bold rounded-xl hover:bg-[#FC4C02]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              {syncingPlatform === 'Strava' ? <RefreshCw size={18} className="animate-spin" /> : <Smartphone size={18} />}
              {syncingPlatform === 'Strava' ? "Syncing..." : "Sync Workouts to Strava"}
            </button>

            <button onClick={() => handleSyncPlatform('MyFitnessPal')} disabled={syncingPlatform !== null} className="w-full py-3 bg-[#0B52D0]/20 text-blue-400 border border-[#0B52D0]/30 font-bold rounded-xl hover:bg-[#0B52D0]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              {syncingPlatform === 'MyFitnessPal' ? <RefreshCw size={18} className="animate-spin" /> : <Smartphone size={18} />}
              {syncingPlatform === 'MyFitnessPal' ? "Syncing..." : "Sync to MyFitnessPal"}
            </button>

            <button onClick={handleSync} disabled={syncing} className="w-full py-3 bg-purple-600/20 text-purple-400 border border-purple-500/30 font-bold rounded-xl hover:bg-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
              {syncing ? <RefreshCw size={18} className="animate-spin" /> : <Smartphone size={18} />}
              {syncing ? "Syncing..." : "Sync to Google Fit / Apple Health"}
            </button>
            
            <button onClick={() => setShowExportModal(true)} disabled={isExporting} className="w-full py-3 bg-neutral-800 text-neutral-300 font-bold rounded-xl hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2">
              {isExporting ? <RefreshCw size={18} className="animate-spin" /> : <FileText size={18} className="text-pink-400" />}
              {isExporting ? "Generating PDF..." : "Export Infographic (PDF)"}
            </button>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
              <RefreshCw size={16} className="text-emerald-500"/> Custom Transaction Categorization Rules
            </h3>
            <p className="text-xs text-neutral-500">
              Automatically categorize incoming UPI transactions based on matching keywords in their description.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <form onSubmit={e => { e.preventDefault(); if (ruleKeyword) { addTransactionRule({ keyword: ruleKeyword, category: ruleCategory }); setRuleKeyword(''); } }} className="flex flex-col sm:flex-row gap-2">
              <input type="text" value={ruleKeyword} onChange={e => setRuleKeyword(e.target.value)} placeholder="Merchant Keyword (e.g. Starbucks)" className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500" required />
              <div className="flex gap-2 w-full sm:w-auto">
                <select value={ruleCategory} onChange={e => setRuleCategory(e.target.value)} className="flex-1 sm:w-40 bg-neutral-950 border border-neutral-800 text-xs text-white p-3 rounded-xl outline-none focus:border-emerald-500">
                  <option value="food">Food</option>
                  <option value="travel">Travel</option>
                  <option value="shopping">Shopping</option>
                  <option value="subscriptions">Subscriptions</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="bills">Bills</option>
                  <option value="home">Home</option>
                  <option value="gifts">Gifts</option>
                  <option value="others">Others</option>
                </select>
                <button type="submit" className="shrink-0 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold px-4 py-3 rounded-xl transition-colors"><Plus size={20} /></button>
              </div>
            </form>

            <div className="space-y-2 mt-2">
              {transactionRules.length === 0 ? (
                <div className="text-xs text-neutral-600 text-center py-2 italic">No custom rules added yet.</div>
              ) : (
                transactionRules.map(rule => (
                  <div key={rule.id} className="flex justify-between items-center bg-neutral-950/50 p-3 rounded-xl border border-neutral-800/50">
                    <div className="text-sm">
                      <span className="text-neutral-300 font-bold">"{rule.keyword}"</span>
                      <span className="text-neutral-500 mx-2">→</span>
                      <span className="text-emerald-400 capitalize">{rule.category}</span>
                    </div>
                    <button onClick={() => deleteTransactionRule(rule.id)} className="text-neutral-600 hover:text-red-400 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-red-500 text-sm flex items-center gap-2 mb-2">
              <Trash2 size={16} className="text-red-500"/> Danger Zone
            </h3>
            <p className="text-xs text-neutral-500">
              Permanently delete all your logged workout data. This action cannot be undone.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setShowClearConfirm(true)} 
              className="w-full py-3 bg-red-600/20 text-red-400 border border-red-500/30 font-bold rounded-xl hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Clear All Workouts
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-pink-500" />
              <div className="flex items-center gap-4 mb-4 text-pink-500">
                <div className="p-3 bg-pink-500/10 rounded-2xl shrink-0">
                  <FileText size={28} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Export Options</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <p className="text-neutral-400 text-sm">Select the details you want to include in your generated PDF infographic.</p>
                
                <div className="space-y-3 pt-2">
                  <label className="flex items-center justify-between p-3 bg-neutral-900 rounded-xl border border-neutral-700 cursor-pointer hover:border-neutral-500 transition">
                    <span className="font-bold text-sm text-white">Select All</span>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-pink-500" 
                      checked={exportOptions.workouts && exportOptions.activity && exportOptions.diet && exportOptions.finance} 
                      onChange={e => {
                        const val = e.target.checked;
                        setExportOptions({ workouts: val, activity: val, diet: val, finance: val });
                      }} 
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
                    <span className="font-bold text-sm text-neutral-300">Include Workouts</span>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-pink-500" 
                      checked={exportOptions.workouts} 
                      onChange={e => setExportOptions({ ...exportOptions, workouts: e.target.checked })} 
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
                    <span className="font-bold text-sm text-neutral-300">Include Activity</span>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-pink-500" 
                      checked={exportOptions.activity} 
                      onChange={e => setExportOptions({ ...exportOptions, activity: e.target.checked })} 
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
                    <span className="font-bold text-sm text-neutral-300">Include Diet</span>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-pink-500" 
                      checked={exportOptions.diet} 
                      onChange={e => setExportOptions({ ...exportOptions, diet: e.target.checked })} 
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800 cursor-pointer hover:border-neutral-700 transition">
                    <span className="font-bold text-sm text-neutral-300">Include Finance</span>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-pink-500" 
                      checked={exportOptions.finance} 
                      onChange={e => setExportOptions({ ...exportOptions, finance: e.target.checked })} 
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 py-3 bg-neutral-800 text-neutral-300 font-bold rounded-xl hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowExportModal(false);
                    setTimeout(() => handleExportPDF(), 300); // Allow modal to close and state to settle before snapping
                  }}
                  disabled={!exportOptions.workouts && !exportOptions.activity && !exportOptions.diet && !exportOptions.finance}
                  className="flex-1 py-3 bg-neutral-100 text-black font-bold rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
              <div className="flex items-center gap-4 mb-4 text-red-500">
                <div className="p-3 bg-red-500/10 rounded-2xl shrink-0">
                  <Trash2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Wipe All Workouts?</h3>
              </div>
              
              <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                This will <strong className="text-red-400 font-bold">permanently delete</strong> all your logged workouts, history, sets, and progress tracking. This action <strong>cannot be undone</strong> under any circumstances.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 bg-neutral-800 text-neutral-300 font-bold rounded-xl hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clearWorkouts();
                    setShowClearConfirm(false);
                    // Removed alert
                  }}
                  className="flex-1 py-3 bg-red-600/20 text-red-400 border border-red-500/30 font-bold rounded-xl hover:bg-red-600/30 transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
