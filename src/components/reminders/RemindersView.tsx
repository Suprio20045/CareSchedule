import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { VaccineQueueItem, PatientVaccineRecord } from '../../types';
import { Avatar } from '../common/Avatar';
import { BloodGroupBadge } from '../common/Badge';
import { MarkCompletedModal } from '../vaccinations/MarkCompletedModal';
import { EmptyState } from '../common/EmptyState';
import { formatDate, formatRelativeCountdown } from '../../utils/dateUtils';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Check, 
  Phone, 
  UserCheck, 
  Search, 
  ChevronRight, 
  Send, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';

export const RemindersView: React.FC = () => {
  const { 
    patients, 
    aggregated, 
    markVaccineCompleted, 
    navigateToPatientSchedule, 
    settings,
    addToast 
  } = useApp();

  const [filterTab, setFilterTab] = useState<'ALL' | 'OVERDUE' | 'DUE_SOON' | 'UPCOMING'>('ALL');
  const [reminderSearch, setReminderSearch] = useState('');
  const [selectedQueueItemForCompletion, setSelectedQueueItemForCompletion] = useState<VaccineQueueItem | null>(null);

  const { overdueQueue, dueSoonQueue, upcomingQueue } = aggregated;

  const activePatientForModal = useMemo(() => {
    if (!selectedQueueItemForCompletion) return null;
    return patients.find(p => p.id === selectedQueueItemForCompletion.patientId) || null;
  }, [patients, selectedQueueItemForCompletion]);

  // Combined queue filtered by tab and search
  const filteredQueue = useMemo(() => {
    let list: (VaccineQueueItem & { type: 'overdue' | 'dueSoon' | 'upcoming' })[] = [];

    if (filterTab === 'ALL' || filterTab === 'OVERDUE') {
      list.push(...overdueQueue.map(item => ({ ...item, type: 'overdue' as const })));
    }
    if (filterTab === 'ALL' || filterTab === 'DUE_SOON') {
      list.push(...dueSoonQueue.map(item => ({ ...item, type: 'dueSoon' as const })));
    }
    if (filterTab === 'ALL' || filterTab === 'UPCOMING') {
      list.push(...upcomingQueue.map(item => ({ ...item, type: 'upcoming' as const })));
    }

    if (reminderSearch) {
      const q = reminderSearch.toLowerCase();
      list = list.filter(item => 
        item.patientName.toLowerCase().includes(q) ||
        item.vaccine.vaccineName.toLowerCase().includes(q) ||
        item.guardianName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [filterTab, reminderSearch, overdueQueue, dueSoonQueue, upcomingQueue]);

  const handleSimulateContact = (item: VaccineQueueItem) => {
    addToast({
      type: 'info',
      title: 'Contact Reminder',
      message: `Guardian: ${item.guardianName} (${item.guardianPhone || 'No phone'}) for ${item.vaccine.vaccineName}.`
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Reminders Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Active alert queue for overdue boosters, upcoming immunizations, and guardian notifications.
          </p>
        </div>

        {/* Total Pending Count Badge */}
        <div className="flex items-center gap-2">
          {overdueQueue.length > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-extrabold border border-rose-200 dark:border-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {overdueQueue.length} Overdue
            </span>
          )}
          {dueSoonQueue.length > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-extrabold border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {dueSoonQueue.length} Due Soon
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterTab === 'ALL'
                ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All Active ({overdueQueue.length + dueSoonQueue.length + upcomingQueue.length})
          </button>
          <button
            onClick={() => setFilterTab('OVERDUE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterTab === 'OVERDUE'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
            }`}
          >
            🔴 Overdue ({overdueQueue.length})
          </button>
          <button
            onClick={() => setFilterTab('DUE_SOON')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterTab === 'DUE_SOON'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
            }`}
          >
            🟡 Due Soon ({dueSoonQueue.length})
          </button>
          <button
            onClick={() => setFilterTab('UPCOMING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterTab === 'UPCOMING'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-sky-600'
            }`}
          >
            🔵 Upcoming ({upcomingQueue.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={reminderSearch}
            onChange={(e) => setReminderSearch(e.target.value)}
            placeholder="Search patient or vaccine..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
      </div>

      {/* Reminder Cards Grid */}
      {filteredQueue.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No pending reminders in this view"
          description="All patients are currently up to date on their scheduled immunization dates."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredQueue.map((item) => {
            const isOverdue = item.type === 'overdue';
            const isDueSoon = item.type === 'dueSoon';
            const countdown = formatRelativeCountdown(item.vaccine.dueDate);

            const cardBorder = isOverdue
              ? 'border-rose-200 dark:border-rose-900/60 hover:border-rose-400'
              : isDueSoon
              ? 'border-amber-200 dark:border-amber-900/60 hover:border-amber-400'
              : 'border-sky-200 dark:border-sky-900/60 hover:border-sky-400';

            const badgeBg = isOverdue
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
              : isDueSoon
              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
              : 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300';

            return (
              <div
                key={`${item.patientId}-${item.vaccine.id}`}
                className={`bg-white dark:bg-slate-800/90 rounded-2xl p-5 border ${cardBorder} shadow-xs transition-all flex flex-col justify-between`}
              >
                <div>
                  {/* Top Status & Date */}
                  <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-700/60">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${badgeBg}`}>
                      {isOverdue ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{countdown.text}</span>
                        </>
                      ) : isDueSoon ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Due {countdown.text}</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Due {countdown.text}</span>
                        </>
                      )}
                    </span>

                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {formatDate(item.vaccine.dueDate)}
                    </span>
                  </div>

                  {/* Vaccine Title */}
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                    {item.vaccine.vaccineName}
                  </h3>

                  {/* Patient Details */}
                  <div className="mt-3.5 flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar name={item.patientName} size="sm" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {item.patientName}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          Guardian: {item.guardianName}
                        </div>
                      </div>
                    </div>

                    <BloodGroupBadge bloodGroup={item.patientBloodGroup} size="sm" />
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigateToPatientSchedule(item.patientId)}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Patient</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {item.guardianPhone && (
                      <button
                        onClick={() => handleSimulateContact(item)}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                        title={`Call Guardian: ${item.guardianPhone}`}
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedQueueItemForCompletion(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Done</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Mark Completed Modal */}
      {selectedQueueItemForCompletion && (
        <MarkCompletedModal
          isOpen={!!selectedQueueItemForCompletion}
          onClose={() => setSelectedQueueItemForCompletion(null)}
          patient={activePatientForModal}
          vaccine={selectedQueueItemForCompletion.vaccine}
          onConfirm={markVaccineCompleted}
          defaultAdministeredBy={settings.userName}
        />
      )}
    </div>
  );
};
