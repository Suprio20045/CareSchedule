import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../common/Avatar';
import { BloodGroupBadge, StatusBadge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { calculateAge, formatDate, getTodayDateString } from '../../utils/dateUtils';
import { MEDICAL_DISCLAIMER_TEXT } from '../../data/vaccineSchedule';
import { 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Heart, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  Calendar, 
  MapPin, 
  Phone,
  ShieldCheck
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { patients, selectedPatientId, setSelectedPatientId, settings, addToast } = useApp();

  const currentPatient = useMemo(() => {
    if (!patients.length) return null;
    return patients.find(p => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  if (!currentPatient) {
    return (
      <EmptyState
        icon={FileSpreadsheet}
        title="No patients available"
        description="Add a patient to generate and print immunization certificates."
      />
    );
  }

  const age = calculateAge(currentPatient.dateOfBirth);
  const total = currentPatient.vaccines.length;
  const completed = currentPatient.vaccines.filter(v => v.status === 'Completed').length;
  const dueSoon = currentPatient.vaccines.filter(v => v.status === 'Due Soon').length;
  const overdue = currentPatient.vaccines.filter(v => v.status === 'Overdue').length;
  const upcoming = currentPatient.vaccines.filter(v => v.status === 'Upcoming').length;
  const coverage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Vaccine Name', 'Dose Number', 'Target Disease', 'Due Date', 'Status', 'Date Administered', 'Batch Number', 'Administered By'];
    const rows = currentPatient.vaccines.map(v => [
      `"${v.vaccineName}"`,
      v.doseNumber,
      `"${v.vaccineId}"`,
      v.dueDate,
      v.status,
      v.dateAdministered || '',
      `"${v.batchNumber || ''}"`,
      `"${v.administeredBy || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentPatient.fullName.replace(/\s+/g, '_')}_Immunization_Record.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: `Downloaded immunization record for ${currentPatient.fullName}.`
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Non-print Top Controls Bar */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Immunization Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Generate and print verified vaccination certificates and medical records.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          {/* Patient Selector */}
          <select
            value={currentPatient.id}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({calculateAge(p.dateOfBirth).shortText})
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div id="printable-report" className="bg-white dark:bg-slate-800/95 print:bg-white print:text-black rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700/80 shadow-md print:shadow-none print:border-none space-y-8 max-w-4xl mx-auto">
        
        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-teal-600">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white print:border print:border-teal-700">
              <Heart className="w-7 h-7 fill-current" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 print:text-black">
                {settings.clinicName || 'CareSchedule Health Center'}
              </h2>
              <p className="text-xs text-teal-700 dark:text-teal-400 print:text-teal-800 font-bold uppercase tracking-wider">
                Official Child & Family Immunization Record
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 dark:text-slate-400 print:text-gray-600">
            <div>Report Date: <strong className="text-slate-800 dark:text-slate-200 print:text-black">{formatDate(getTodayDateString(), 'long')}</strong></div>
            <div>Document Ref: <span className="font-mono font-bold">CS-{currentPatient.id.slice(-6).toUpperCase()}</span></div>
          </div>
        </div>

        {/* Patient Demographics Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 print:bg-gray-50 border border-slate-200/80 dark:border-slate-800 print:border-gray-200 text-xs">
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400 print:text-teal-800">
              Patient Identification
            </div>
            <div className="text-base font-black text-slate-900 dark:text-slate-100 print:text-black">
              {currentPatient.fullName}
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 print:text-gray-800">
              <div>Date of Birth: <strong>{formatDate(currentPatient.dateOfBirth)}</strong></div>
              <div>Age: <strong>{age.text}</strong></div>
              <div>Gender: <strong>{currentPatient.gender}</strong></div>
              <div>Blood Group: <strong className="text-rose-600 font-bold">{currentPatient.bloodGroup}</strong></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400 print:text-teal-800">
              Guardian & Contact Details
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 print:text-black">
              {currentPatient.guardianName} ({currentPatient.guardianRelation || 'Guardian'})
            </div>
            <div className="space-y-1 text-slate-600 dark:text-slate-400 print:text-gray-700">
              <div>Phone: <strong>{currentPatient.guardianPhone || 'Not provided'}</strong></div>
              <div>Address: <span>{currentPatient.address || 'Standard local registry'}</span></div>
              {currentPatient.notes && (
                <div className="italic pt-1 text-slate-500">Notes: {currentPatient.notes}</div>
              )}
            </div>
          </div>
        </div>

        {/* Immunization Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 print:bg-emerald-50 print:text-emerald-900 border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-[10px] uppercase font-bold block">Completed Doses</span>
            <span className="text-xl font-black">{completed} of {total}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 print:bg-amber-50 print:text-amber-900 border border-amber-200 dark:border-amber-800/60">
            <span className="text-[10px] uppercase font-bold block">Due Soon</span>
            <span className="text-xl font-black">{dueSoon}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 print:bg-rose-50 print:text-rose-900 border border-rose-200 dark:border-rose-800/60">
            <span className="text-[10px] uppercase font-bold block">Overdue</span>
            <span className="text-xl font-black">{overdue}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 print:bg-teal-50 print:text-teal-900 border border-teal-200 dark:border-teal-800/60">
            <span className="text-[10px] uppercase font-bold block">Coverage Rate</span>
            <span className="text-xl font-black">{coverage}%</span>
          </div>
        </div>

        {/* Detailed Immunization Log Table */}
        <div className="space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 print:text-black">
            Immunization History & Schedule Matrix
          </div>

          <div className="border border-slate-200 dark:border-slate-700 print:border-gray-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 print:bg-gray-100 font-bold uppercase text-[10px] text-slate-600 dark:text-slate-300 print:text-gray-700 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Vaccine Name</th>
                  <th className="py-2.5 px-3">Scheduled Due</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date Given</th>
                  <th className="py-2.5 px-3">Batch / Lot</th>
                  <th className="py-2.5 px-3">Administered By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-gray-200">
                {currentPatient.vaccines.map((v) => (
                  <tr key={v.id} className="print:text-black">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-100 print:text-black">
                      {v.vaccineName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 print:text-gray-700">
                      {formatDate(v.dueDate)}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={v.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-200 print:text-black font-medium">
                      {v.dateAdministered ? formatDate(v.dateAdministered) : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 print:text-gray-600">
                      {v.batchNumber || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 print:text-gray-700">
                      {v.administeredBy || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Signatures section */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-700 print:border-gray-300 grid grid-cols-2 gap-8 text-xs">
          <div className="space-y-8">
            <div>
              <div className="font-bold text-slate-700 dark:text-slate-300 print:text-black">
                Authorized Clinician / Medical Officer:
              </div>
              <div className="mt-8 border-b border-slate-400 dark:border-slate-600 print:border-gray-500 w-48" />
              <div className="text-[10px] text-slate-400 print:text-gray-500 mt-1">
                Signature & Registration Stamp
              </div>
            </div>
          </div>

          <div className="space-y-8 text-right">
            <div>
              <div className="font-bold text-slate-700 dark:text-slate-300 print:text-black">
                Parent / Guardian Acknowledgment:
              </div>
              <div className="mt-8 border-b border-slate-400 dark:border-slate-600 print:border-gray-500 w-48 ml-auto" />
              <div className="text-[10px] text-slate-400 print:text-gray-500 mt-1">
                Signature of Parent or Legal Guardian
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="text-[10px] text-slate-400 print:text-gray-500 text-center pt-4 border-t border-slate-100 dark:border-slate-800 print:border-gray-200">
          {MEDICAL_DISCLAIMER_TEXT} • Generated by CareSchedule Offline Application.
        </div>
      </div>
    </div>
  );
};
