import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Patient, PatientVaccineRecord } from '../../types';
import { getTodayDateString } from '../../utils/dateUtils';
import { Calendar, UserCheck, Tag, FileText, CheckCircle2 } from 'lucide-react';

interface MarkCompletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  vaccine: PatientVaccineRecord | null;
  onConfirm: (
    patientId: string,
    vaccineId: string,
    administeredDate: string,
    notes?: string,
    batchNumber?: string,
    administeredBy?: string
  ) => void;
  defaultAdministeredBy?: string;
}

export const MarkCompletedModal: React.FC<MarkCompletedModalProps> = ({
  isOpen,
  onClose,
  patient,
  vaccine,
  onConfirm,
  defaultAdministeredBy = 'Dr. Suprio'
}) => {
  const todayStr = getTodayDateString();
  const [administeredDate, setAdministeredDate] = useState(todayStr);
  const [administeredBy, setAdministeredBy] = useState(defaultAdministeredBy);
  const [batchNumber, setBatchNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (vaccine) {
      setAdministeredDate(vaccine.dateAdministered || todayStr);
      setAdministeredBy(vaccine.administeredBy || defaultAdministeredBy);
      setBatchNumber(vaccine.batchNumber || `LOT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setNotes(vaccine.notes || '');
    }
  }, [vaccine, defaultAdministeredBy, isOpen, todayStr]);

  if (!patient || !vaccine) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(
      patient.id,
      vaccine.id,
      administeredDate,
      notes,
      batchNumber,
      administeredBy
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mark Vaccination Completed"
      subtitle={`Recording immunization administration for ${patient.fullName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vaccine Banner */}
        <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex items-center justify-between">
          <div>
            <div className="text-xs text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
              Selected Vaccine
            </div>
            <div className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              {vaccine.vaccineName}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Patient Due Date
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {vaccine.dueDate}
            </div>
          </div>
        </div>

        {/* Date Administered */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Date Administered <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              max={todayStr}
              value={administeredDate}
              onChange={(e) => setAdministeredDate(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Administered By & Batch Lot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Administered By / Clinician
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={administeredBy}
                onChange={(e) => setAdministeredBy(e.target.value)}
                placeholder="Dr. Name / Staff"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Batch / Lot Number
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. LOT-2024-8841"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Clinical observations / notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Administration Notes & Site
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Right thigh, tolerated well, no acute reactions."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Complete</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
