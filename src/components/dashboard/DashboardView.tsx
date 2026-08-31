import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { DonutChart } from '../common/DonutChart';
import { Avatar } from '../common/Avatar';
import { BloodGroupBadge } from '../common/Badge';
import { 
  Users, 
  Syringe, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  ChevronRight, 
  Plus, 
  ShieldAlert, 
  FileText,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { calculateAge, formatDate, formatRelativeCountdown } from '../../utils/dateUtils';
import { MEDICAL_DISCLAIMER_TEXT } from '../../data/vaccineSchedule';

interface DashboardViewProps {
  onOpenAddPatient: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenAddPatient }) => {
  const { 
    patients, 
    settings, 
    aggregated, 
    setCurrentTab, 
    navigateToPatientSchedule, 
    setSelectedPatientId 
  } = useApp();

  const { stats, upcomingQueue, dueSoonQueue, overdueQueue } = aggregated;

  // Upcoming items to display in the upcoming card (top 4)
  const displayUpcoming = [...dueSoonQueue, ...upcomingQueue].slice(0, 4);

  // Recent patients (top 4 by creation or newest)
  const displayRecentPatients = patients.slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              Good morning, {settings.userName}
            </h1>
            <span className="text-2xl sm:text-3xl">👋</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening with your patients and immunization schedules today.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddPatient}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white text-sm font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          subtext="+3 registered this month"
          icon={Users}
          variant="emerald"
          trend="+12%"
          onClick={() => setCurrentTab('patients')}
        />
        <StatCard
          title="Total Vaccinations"
          value={stats.totalVaccinations}
          subtext={`${stats.completed} doses completed`}
          icon={Syringe}
          variant="blue"
          trend={`${stats.completedPercentage}% done`}
          onClick={() => setCurrentTab('vaccinations')}
        />
        <StatCard
          title="Due Soon"
          value={stats.dueSoon}
          subtext={`Next ${settings.dueSoonThresholdDays} days window`}
          icon={Clock}
          variant="amber"
          trend="Upcoming"
          onClick={() => setCurrentTab('reminders')}
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          subtext="Requires immediate follow-up"
          icon={AlertTriangle}
          variant="rose"
          trend={stats.overdue > 0 ? "Action needed" : "All clear"}
          onClick={() => setCurrentTab('reminders')}
        />
      </div>

      {/* 3 Major Content Cards Grid (Matching the exact design) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Upcoming Vaccinations */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                  Upcoming Vaccinations
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('reminders')}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 cursor-pointer flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {displayUpcoming.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                No upcoming doses in the near queue.
              </div>
            ) : (
              <div className="space-y-3.5">
                {displayUpcoming.map((item) => {
                  const countdown = formatRelativeCountdown(item.vaccine.dueDate);
                  return (
                    <div
                      key={`${item.patientId}-${item.vaccine.id}`}
                      onClick={() => navigateToPatientSchedule(item.patientId)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={item.patientName} size="md" />
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-teal-600 transition-colors">
                            {item.vaccine.vaccineName}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {item.patientName}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {formatDate(item.vaccine.dueDate, 'short')}
                        </div>
                        <div className={`text-[11px] font-bold ${
                          countdown.isOverdue ? 'text-rose-600 dark:text-rose-400' :
                          countdown.isDueSoon ? 'text-amber-600 dark:text-amber-400' :
                          'text-teal-600 dark:text-teal-400'
                        }`}>
                          {countdown.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
            <button
              onClick={() => setCurrentTab('vaccinations')}
              className="w-full py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Open Complete Vaccine Matrix</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Recent Patients */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                  Recent Patients
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('patients')}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 cursor-pointer flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {displayRecentPatients.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                No patient records yet. Click "+ Add Patient" above.
              </div>
            ) : (
              <div className="space-y-3.5">
                {displayRecentPatients.map((patient) => {
                  const ageInfo = calculateAge(patient.dateOfBirth);
                  return (
                    <div
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setCurrentTab('patients');
                      }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={patient.fullName} seed={patient.avatarSeed} gender={patient.gender} size="md" />
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-teal-600 transition-colors">
                            {patient.fullName}
                          </h4>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                            {ageInfo.text}
                          </p>
                        </div>
                      </div>

                      <BloodGroupBadge bloodGroup={patient.bloodGroup} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
            <button
              onClick={onOpenAddPatient}
              className="w-full py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Patient</span>
            </button>
          </div>
        </div>

        {/* Card 3: Vaccination Status Overview Chart */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                  Vaccination Status Overview
                </h3>
              </div>
            </div>

            {/* Dynamic Donut Chart */}
            <div className="py-2">
              <DonutChart
                completed={stats.completed}
                dueSoon={stats.dueSoon}
                overdue={stats.overdue}
                upcoming={stats.upcoming}
                total={stats.totalVaccinations}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Overall Immunization Coverage</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats.completedPercentage}% On Track
            </span>
          </div>
        </div>
      </div>

      {/* Quick Access Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Offline First Aid Quick Banner */}
        <div 
          onClick={() => setCurrentTab('firstAid')}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200/80 dark:border-emerald-800/40 flex items-center justify-between cursor-pointer hover:shadow-xs transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Offline First Aid Protocols
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immediate step-by-step guidance for Choking, Burns, CPR & Bleeding without internet.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
        </div>

        {/* Immunization Reports Quick Banner */}
        <div 
          onClick={() => setCurrentTab('reports')}
          className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-sky-500/10 dark:from-blue-950/40 dark:to-sky-950/40 border border-blue-200/80 dark:border-blue-800/40 flex items-center justify-between cursor-pointer hover:shadow-xs transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Print Official Vaccine Records
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate clean medical passports and print A4 summary sheets for daycare & schools.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
        </div>
      </div>

      {/* Medical Disclaimer Bar */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
        <span className="font-bold">Demonstration Notice: </span>
        {MEDICAL_DISCLAIMER_TEXT}
      </div>
    </div>
  );
};
