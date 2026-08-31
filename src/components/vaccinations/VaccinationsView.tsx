import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientVaccineRecord, VaccineStatus } from '../../types';
import { Avatar } from '../common/Avatar';
import { BloodGroupBadge, StatusBadge } from '../common/Badge';
import { MarkCompletedModal } from './MarkCompletedModal';
import { EmptyState } from '../common/EmptyState';
import { calculateAge, formatDate, formatRelativeCountdown } from '../../utils/dateUtils';
import { 
  Syringe, 
  Check, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  ChevronDown, 
  Search, 
  Printer, 
  UserCheck, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { MEDICAL_DISCLAIMER_TEXT } from '../../data/vaccineSchedule';

interface VaccinationsViewProps {
  onOpenAddPatient: () => void;
}

export const VaccinationsView: React.FC<VaccinationsViewProps> = ({ onOpenAddPatient }) => {
  const { 
    patients, 
    selectedPatientId, 
    setSelectedPatientId, 
    markVaccineCompleted, 
    undoVaccineCompleted,
    setCurrentTab,
    settings
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | VaccineStatus>('ALL');
  const [vaccineSearch, setVaccineSearch] = useState('');
  const [selectedVaccineForCompletion, setSelectedVaccineForCompletion] = useState<PatientVaccineRecord | null>(null);

  // Active selected patient (fallback to first patient)
  const currentPatient = useMemo(() => {
    if (!patients.length) return null;
    return patients.find(p => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Filtered vaccines for current patient
  const filteredVaccines = useMemo(() => {
    if (!currentPatient) return [];
    return currentPatient.vaccines.filter((v) => {
      const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
      const matchesSearch = 
        !vaccineSearch ||
        v.vaccineName.toLowerCase().includes(vaccineSearch.toLowerCase()) ||
        v.dueDate.includes(vaccineSearch);
      return matchesStatus && matchesSearch;
    });
  }, [currentPatient, statusFilter, vaccineSearch]);

  if (!currentPatient) {
    return (
      <EmptyState
        icon={Syringe}
        title="No patients found"
        description="Add a patient to view and track their personalized vaccination timeline."
        actionText="+ Add Patient"
        onAction={onOpenAddPatient}
      />
    );
  }

  const patientAge = calculateAge(currentPatient.dateOfBirth);
  const total = currentPatient.vaccines.length;
  const completedCount = currentPatient.vaccines.filter(v => v.status === 'Completed').length;
  const dueSoonCount = currentPatient.vaccines.filter(v => v.status === 'Due Soon').length;
  const overdueCount = currentPatient.vaccines.filter(v => v.status === 'Overdue').length;
  const upcomingCount = currentPatient.vaccines.filter(v => v.status === 'Upcoming').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Patient Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('patients')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer mr-1"
              title="Back to Patients"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Vaccination Schedule
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 ml-8">
            Review due dates, record administered shots, and inspect future doses.
          </p>
        </div>

        {/* Patient Selection Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={currentPatient.id}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer min-w-[200px]"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({calculateAge(p.dateOfBirth).shortText})
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Avatar name={currentPatient.fullName} seed={currentPatient.avatarSeed} size="sm" />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => setCurrentTab('reports')}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-colors cursor-pointer"
            title="Print Patient Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Patient Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={currentPatient.fullName} seed={currentPatient.avatarSeed} gender={currentPatient.gender} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100">
                {currentPatient.fullName}
              </h2>
              <BloodGroupBadge bloodGroup={currentPatient.bloodGroup} size="sm" />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>DOB: <strong className="text-slate-700 dark:text-slate-300">{formatDate(currentPatient.dateOfBirth)}</strong></span>
              <span>•</span>
              <span>Age: <strong className="text-slate-700 dark:text-slate-300">{patientAge.text}</strong></span>
              <span>•</span>
              <span>Guardian: <strong className="text-slate-700 dark:text-slate-300">{currentPatient.guardianName}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Summary Numbers */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-center">
            <span className="text-[10px] uppercase font-bold block">Completed</span>
            <span className="text-sm font-extrabold">{completedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-center">
            <span className="text-[10px] uppercase font-bold block">Due Soon</span>
            <span className="text-sm font-extrabold">{dueSoonCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-center">
            <span className="text-[10px] uppercase font-bold block">Overdue</span>
            <span className="text-sm font-extrabold">{overdueCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 text-center">
            <span className="text-[10px] uppercase font-bold block">Upcoming</span>
            <span className="text-sm font-extrabold">{upcomingCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { key: 'ALL', label: 'All', count: total },
            { key: 'Completed', label: 'Completed', count: completedCount },
            { key: 'Due Soon', label: 'Due Soon', count: dueSoonCount },
            { key: 'Overdue', label: 'Overdue', count: overdueCount },
            { key: 'Upcoming', label: 'Upcoming', count: upcomingCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 opacity-60 text-[10px]">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* In-table Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={vaccineSearch}
            onChange={(e) => setVaccineSearch(e.target.value)}
            placeholder="Filter vaccines..."
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
      </div>

      {/* Vaccination Schedule Table */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Vaccine</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date Administered</th>
                <th className="py-3.5 px-4">Next Due / Days</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredVaccines.map((v) => {
                const countdown = formatRelativeCountdown(v.dueDate);
                const isCompleted = v.status === 'Completed';

                return (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    {/* Vaccine Name */}
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-800 dark:text-slate-100">
                        {v.vaccineName}
                      </div>
                      {v.batchNumber && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          Lot: {v.batchNumber} • By: {v.administeredBy || 'Staff'}
                        </div>
                      )}
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {formatDate(v.dueDate)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={v.status} size="sm" />
                    </td>

                    {/* Date Administered */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {v.dateAdministered ? formatDate(v.dateAdministered) : '—'}
                    </td>

                    {/* Next Due / Countdown */}
                    <td className="py-3.5 px-4">
                      {isCompleted ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <span className={`text-xs font-bold ${
                          countdown.isOverdue ? 'text-rose-600 dark:text-rose-400' :
                          countdown.isDueSoon ? 'text-amber-600 dark:text-amber-400' :
                          'text-teal-600 dark:text-teal-400'
                        }`}>
                          {countdown.text}
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-5 text-right">
                      {isCompleted ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedVaccineForCompletion(v)}
                            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => undoVaccineCompleted(currentPatient.id, v.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            title="Undo / Reset Status"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedVaccineForCompletion(v)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Completed</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Status Legend */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Due Soon (within {settings.dueSoonThresholdDays} days)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Overdue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              Upcoming
            </span>
          </div>

          <div className="text-[11px] italic text-slate-400">
            {filteredVaccines.length} of {total} doses shown
          </div>
        </div>
      </div>

      {/* Mark Completed Modal */}
      <MarkCompletedModal
        isOpen={!!selectedVaccineForCompletion}
        onClose={() => setSelectedVaccineForCompletion(null)}
        patient={currentPatient}
        vaccine={selectedVaccineForCompletion}
        onConfirm={markVaccineCompleted}
        defaultAdministeredBy={settings.userName}
      />
    </div>
  );
};
