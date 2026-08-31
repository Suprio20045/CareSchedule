import React from 'react';
import { Modal } from '../common/Modal';
import { Patient } from '../../types';
import { Avatar } from '../common/Avatar';
import { BloodGroupBadge, StatusBadge } from '../common/Badge';
import { calculateAge, formatDate, formatRelativeCountdown } from '../../utils/dateUtils';
import { 
  Calendar, 
  Phone, 
  MapPin, 
  FileText, 
  Syringe, 
  Printer, 
  ExternalLink, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock 
} from 'lucide-react';

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSchedule: (patientId: string) => void;
  onOpenReport: (patientId: string) => void;
  onEdit: (patient: Patient) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  isOpen,
  onClose,
  onOpenSchedule,
  onOpenReport,
  onEdit
}) => {
  if (!patient) return null;

  const age = calculateAge(patient.dateOfBirth);
  const total = patient.vaccines.length;
  const completed = patient.vaccines.filter(v => v.status === 'Completed').length;
  const dueSoon = patient.vaccines.filter(v => v.status === 'Due Soon').length;
  const overdue = patient.vaccines.filter(v => v.status === 'Overdue').length;
  const upcoming = patient.vaccines.filter(v => v.status === 'Upcoming').length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Patient Profile & Immunization Record"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Header Profile Info Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <Avatar name={patient.fullName} seed={patient.avatarSeed} gender={patient.gender} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">
                  {patient.fullName}
                </h4>
                <BloodGroupBadge bloodGroup={patient.bloodGroup} size="sm" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {patient.gender} • Born {formatDate(patient.dateOfBirth)} ({age.text})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenSchedule(patient.id);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Syringe className="w-3.5 h-3.5" />
              <span>Vaccine Matrix</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenReport(patient.id);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Demographics & Guardian details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
              Guardian Information
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="font-semibold">{patient.guardianName}</span>
              <span className="text-slate-400">({patient.guardianRelation || 'Guardian'})</span>
            </div>
            {patient.guardianPhone && (
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{patient.guardianPhone}</span>
              </div>
            )}
            {patient.address && (
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{patient.address}</span>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
              Clinical Notes & Allergies
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
              {patient.notes || 'No specific medical warnings or allergies recorded.'}
            </p>
          </div>
        </div>

        {/* Immunization Progress Bar */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">
              Immunization Progress
            </span>
            <span className="text-teal-600 dark:text-teal-400">
              {completed} of {total} Doses ({progressPct}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(completed / total) * 100}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Completed: ${completed}`}
            />
            <div
              style={{ width: `${(dueSoon / total) * 100}%` }}
              className="bg-amber-500 transition-all duration-500"
              title={`Due Soon: ${dueSoon}`}
            />
            <div
              style={{ width: `${(overdue / total) * 100}%` }}
              className="bg-rose-500 transition-all duration-500"
              title={`Overdue: ${overdue}`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Completed: {completed}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Due Soon: {dueSoon}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Overdue: {overdue}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Upcoming: {upcoming}
            </span>
          </div>
        </div>

        {/* Chronological Vaccination Timeline */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Vaccination Timeline
          </h5>
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {patient.vaccines.map((v) => {
              const countdown = formatRelativeCountdown(v.dueDate);
              return (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60"
                >
                  <div className="flex items-center gap-3">
                    {v.status === 'Completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : v.status === 'Overdue' ? (
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                        {v.vaccineName}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        Target Due: {formatDate(v.dueDate)}
                        {v.dateAdministered && ` • Given: ${formatDate(v.dateAdministered)}`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <StatusBadge status={v.status} size="sm" />
                    {v.status !== 'Completed' && (
                      <div className={`text-[10px] font-bold mt-1 ${
                        countdown.isOverdue ? 'text-rose-600' :
                        countdown.isDueSoon ? 'text-amber-600' : 'text-slate-400'
                      }`}>
                        {countdown.text}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => onEdit(patient)}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Edit Demographic Info
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
