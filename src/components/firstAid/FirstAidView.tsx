import React, { useState, useMemo } from 'react';
import { FIRST_AID_TOPICS, FIRST_AID_DISCLAIMER } from '../../data/firstAidData';
import { FirstAidTopic } from '../../types';
import { 
  Search, 
  ShieldAlert, 
  Wind, 
  HeartPulse, 
  Flame, 
  Droplets, 
  Sun, 
  Activity, 
  Zap, 
  AlertCircle, 
  Skull, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  PhoneCall, 
  WifiOff, 
  ArrowLeft,
  BookOpen,
  Printer
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Wind,
  HeartPulse,
  Flame,
  Droplets,
  ShieldAlert,
  Sun,
  Activity,
  Zap,
  AlertCircle,
  Skull
};

export const FirstAidView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeTopic, setActiveTopic] = useState<FirstAidTopic | null>(FIRST_AID_TOPICS[0]); // default to Choking

  const categories = ['ALL', 'Respiratory', 'Trauma & Bleeding', 'Cardiac', 'Environmental', 'Bites & Stings', 'Neurological'];

  const filteredTopics = useMemo(() => {
    return FIRST_AID_TOPICS.filter((t) => {
      const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.steps.some(s => s.toLowerCase().includes(q)) ||
        t.quickAction.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title & Offline Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Offline First Aid Guide
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <WifiOff className="w-3 h-3" />
              100% Offline
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Instant step-by-step emergency response instructions when every second counts.
          </p>
        </div>

        {/* Emergency Callout */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-bold shrink-0">
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span>Emergency Services: 911 / 112</span>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-3 bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search first aid topics (e.g. choking, burns, cpr, bleeding)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Left Sidebar of Topics, Right Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Topic List (4 columns) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
            Topics ({filteredTopics.length})
          </div>

          {filteredTopics.length === 0 ? (
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl text-center text-xs text-slate-400 border border-slate-100 dark:border-slate-700">
              No matching first aid guide found.
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const Icon = ICON_MAP[topic.iconName] || ShieldAlert;
              const isSelected = activeTopic?.id === topic.id;

              return (
                <div
                  key={topic.id}
                  onClick={() => setActiveTopic(topic)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-300 dark:border-teal-700/60 shadow-xs'
                      : 'bg-white dark:bg-slate-800/80 border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className={`text-xs sm:text-sm font-bold truncate ${
                          isSelected ? 'text-teal-900 dark:text-teal-200' : 'text-slate-800 dark:text-slate-100'
                        }`}>
                          {topic.title}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {topic.category}
                      </p>
                    </div>
                  </div>

                  {topic.emergency && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Emergency Protocol" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Procedure Viewer (8 columns) */}
        <div className="lg:col-span-8">
          {activeTopic ? (
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 sm:p-7 border border-slate-100 dark:border-slate-700/60 shadow-xs space-y-6 animate-in fade-in duration-200">
              {/* Header with Title & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = ICON_MAP[activeTopic.iconName] || ShieldAlert;
                    return (
                      <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                    );
                  })()}
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                        {activeTopic.title}
                      </h2>
                    </div>
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {activeTopic.category} Protocol
                    </span>
                  </div>
                </div>

                {activeTopic.emergency && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 self-start sm:self-auto">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Emergency Action Required
                  </span>
                )}
              </div>

              {/* Quick Action Highlight Banner */}
              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60">
                <div className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400 tracking-wider">
                  Immediate Priority Action
                </div>
                <div className="text-sm sm:text-base font-bold text-teal-950 dark:text-teal-100 mt-0.5">
                  {activeTopic.quickAction}
                </div>
              </div>

              {/* What to Do: Numbered Step-by-Step Guidance */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>What To Do — Step-by-Step Instructions</span>
                </h3>

                <div className="space-y-3">
                  {activeTopic.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80"
                    >
                      <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Do NOTs (Precautions) */}
              {activeTopic.doNots && activeTopic.doNots.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>What NOT To Do (Dangerous Mistakes)</span>
                  </h3>

                  <div className="space-y-2">
                    {activeTopic.doNots.map((dont, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs sm:text-sm text-rose-900 dark:text-rose-200"
                      >
                        <span className="font-bold text-rose-600">•</span>
                        <span className="leading-relaxed">{dont}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Red Warning Banner */}
              {activeTopic.warning && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                      Critical Emergency Warning
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                      {activeTopic.warning}
                    </p>
                  </div>
                </div>
              )}

              {/* When to Call Ambulance Checklist */}
              {activeTopic.whenToCallAmbulance && activeTopic.whenToCallAmbulance.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-teal-600" />
                    <span>When To Call Emergency Medical Help Immediately</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeTopic.whenToCallAmbulance.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 bg-white dark:bg-slate-800 rounded-2xl text-center text-slate-400">
              Select a first-aid topic from the list to view instructions.
            </div>
          )}
        </div>
      </div>

      {/* Medical Disclaimer Box */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">
        <span className="font-bold">Medical Disclaimer: </span>
        {FIRST_AID_DISCLAIMER}
      </div>
    </div>
  );
};
