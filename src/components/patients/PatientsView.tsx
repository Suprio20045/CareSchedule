import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, BloodGroup } from '../../types';
import { Avatar } from '../common/Avatar';
import { BloodGroupBadge } from '../common/Badge';
import { PatientFormModal } from './PatientFormModal';
import { PatientDetailModal } from './PatientDetailModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { calculateAge, formatDate } from '../../utils/dateUtils';
import { 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Syringe, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Phone,
  Calendar
} from 'lucide-react';

interface PatientsViewProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  isAddModalOpen,
  setIsAddModalOpen
}) => {
  const { 
    patients, 
    addPatient, 
    updatePatient, 
    deletePatient, 
    navigateToPatientSchedule, 
    navigateToPatientReport,
    searchQuery,
    setSearchQuery 
  } = useApp();

  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter patients by search text, blood group, gender
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        p.fullName.toLowerCase().includes(q) ||
        p.guardianName.toLowerCase().includes(q) ||
        p.guardianPhone.toLowerCase().includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q));

      const matchesBlood = selectedBloodGroup === 'ALL' || p.bloodGroup === selectedBloodGroup;
      const matchesGender = selectedGender === 'ALL' || p.gender === selectedGender;

      return matchesSearch && matchesBlood && matchesGender;
    });
  }, [patients, searchQuery, selectedBloodGroup, selectedGender]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage, itemsPerPage]);

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
  };

  const handleDeleteConfirm = () => {
    if (deletingPatientId) {
      deletePatient(deletingPatientId);
      setDeletingPatientId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Patients
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage registered patients, demographic data, and immunization histories.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white text-sm font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search patients, guardians..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Blood group */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Blood:
            </span>
            <select
              value={selectedBloodGroup}
              onChange={(e) => {
                setSelectedBloodGroup(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-medium px-2.5 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="ALL">All Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Gender */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Gender:
            </span>
            <select
              value={selectedGender}
              onChange={(e) => {
                setSelectedGender(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-medium px-2.5 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="ALL">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table / Grid */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients found"
          description={
            searchQuery
              ? `No results match "${searchQuery}". Try clearing search filters.`
              : 'Add your first patient to start tracking vaccinations and booster shots.'
          }
          actionText="+ Add Patient"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Name</th>
                  <th className="py-3.5 px-4">Date of Birth</th>
                  <th className="py-3.5 px-4">Age</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">Guardian</th>
                  <th className="py-3.5 px-4">Progress</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedPatients.map((patient) => {
                  const age = calculateAge(patient.dateOfBirth);
                  const total = patient.vaccines.length;
                  const completed = patient.vaccines.filter(v => v.status === 'Completed').length;
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <tr 
                      key={patient.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div 
                          onClick={() => setViewingPatient(patient)}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <Avatar name={patient.fullName} seed={patient.avatarSeed} gender={patient.gender} size="md" />
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 transition-colors">
                              {patient.fullName}
                            </span>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500">
                              {patient.gender}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* DOB */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {formatDate(patient.dateOfBirth)}
                      </td>

                      {/* Age */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {age.shortText}
                      </td>

                      {/* Blood Group */}
                      <td className="py-3.5 px-4">
                        <BloodGroupBadge bloodGroup={patient.bloodGroup} size="sm" />
                      </td>

                      {/* Guardian */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-700 dark:text-slate-300">
                          {patient.guardianName}
                        </div>
                        {patient.guardianPhone && (
                          <div className="text-[11px] text-slate-400 dark:text-slate-500">
                            {patient.guardianPhone}
                          </div>
                        )}
                      </td>

                      {/* Progress Bar */}
                      <td className="py-3.5 px-4">
                        <div className="w-28">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                            <span>{completed}/{total}</span>
                            <span className="text-teal-600 dark:text-teal-400">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="h-full bg-teal-500 rounded-full"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigateToPatientSchedule(patient.id)}
                            className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-colors cursor-pointer"
                            title="Open Vaccination Schedule"
                          >
                            <Syringe className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setViewingPatient(patient)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(patient)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            title="Edit Profile"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingPatientId(patient.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="Delete Patient"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedPatients.map((patient) => {
              const age = calculateAge(patient.dateOfBirth);
              const total = patient.vaccines.length;
              const completed = patient.vaccines.filter(v => v.status === 'Completed').length;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <div key={patient.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={patient.fullName} seed={patient.avatarSeed} gender={patient.gender} size="md" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {patient.fullName}
                        </h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {age.text} • {patient.gender}
                        </p>
                      </div>
                    </div>
                    <BloodGroupBadge bloodGroup={patient.bloodGroup} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 py-1 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Date of Birth</span>
                      <span className="font-semibold">{formatDate(patient.dateOfBirth)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Guardian</span>
                      <span className="font-semibold truncate block">{patient.guardianName}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-400">Vaccine Progress</span>
                      <span className="text-teal-600">{completed}/{total} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div style={{ width: `${pct}%` }} className="h-full bg-teal-500 rounded-full" />
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => navigateToPatientSchedule(patient.id)}
                      className="px-3 py-1.5 bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Syringe className="w-3.5 h-3.5" />
                      <span>Vaccines</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewingPatient(patient)}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(patient)}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingPatientId(patient.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Footer */}
          <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div>
              Showing <span className="font-bold text-slate-700 dark:text-slate-200">
                {Math.min((currentPage - 1) * itemsPerPage + 1, filteredPatients.length)}
              </span> to <span className="font-bold text-slate-700 dark:text-slate-200">
                {Math.min(currentPage * itemsPerPage, filteredPatients.length)}
              </span> of <span className="font-bold text-slate-700 dark:text-slate-200">{filteredPatients.length}</span> patients
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-teal-600 text-white'
                      : 'hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Patient Modal */}
      <PatientFormModal
        isOpen={isAddModalOpen || !!editingPatient}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingPatient(null);
        }}
        onSubmit={async (data) => {
          if (editingPatient) {
            await updatePatient({ ...editingPatient, ...data });
          } else {
            await addPatient(data);
          }
        }}
        initialData={editingPatient}
        mode={editingPatient ? 'edit' : 'add'}
      />

      {/* Patient Profile Detail Modal */}
      <PatientDetailModal
        patient={viewingPatient}
        isOpen={!!viewingPatient}
        onClose={() => setViewingPatient(null)}
        onOpenSchedule={navigateToPatientSchedule}
        onOpenReport={navigateToPatientReport}
        onEdit={(p) => {
          setViewingPatient(null);
          setEditingPatient(p);
        }}
      />

      {/* Delete Patient Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingPatientId}
        onClose={() => setDeletingPatientId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient Record"
        message="Are you sure you want to delete this patient and all associated immunization records? This action cannot be undone."
        confirmText="Delete Patient"
        variant="danger"
      />
    </div>
  );
};
