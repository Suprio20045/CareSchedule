import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Patient, BloodGroup } from '../../types';
import { getTodayDateString } from '../../utils/dateUtils';
import { User, Calendar, Droplet, Phone, Home, FileText } from 'lucide-react';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Patient, 'id' | 'createdAt' | 'vaccines'>) => Promise<void>;
  initialData?: Patient | null;
  mode: 'add' | 'edit';
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const todayStr = getTodayDateString();

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('Mother');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFullName(initialData.fullName || '');
      setDateOfBirth(initialData.dateOfBirth || '');
      setGender(initialData.gender || 'Male');
      setBloodGroup(initialData.bloodGroup || 'O+');
      setGuardianName(initialData.guardianName || '');
      setGuardianPhone(initialData.guardianPhone || '');
      setGuardianRelation(initialData.guardianRelation || 'Mother');
      setAddress(initialData.address || '');
      setNotes(initialData.notes || '');
    } else {
      setFullName('');
      setDateOfBirth(todayStr);
      setGender('Male');
      setBloodGroup('O+');
      setGuardianName('');
      setGuardianPhone('');
      setGuardianRelation('Mother');
      setAddress('');
      setNotes('');
    }
    setErrors({});
  }, [initialData, mode, isOpen, todayStr]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Patient full name is required';
    }
    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (dateOfBirth > todayStr) {
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    }
    if (!guardianName.trim()) {
      newErrors.guardianName = 'Guardian name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      fullName: fullName.trim(),
      dateOfBirth,
      gender,
      bloodGroup,
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim(),
      guardianRelation,
      address: address.trim(),
      notes: notes.trim(),
      avatarSeed: fullName.toLowerCase().replace(/\s+/g, '')
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Register New Patient' : 'Edit Patient Profile'}
      subtitle="Enter patient demographic information to automatically generate an immunization schedule."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahim Ahmed"
              className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border ${
                errors.fullName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* DOB & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Date of Birth <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                max={todayStr}
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border ${
                  errors.dateOfBirth ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500`}
              />
            </div>
            {errors.dateOfBirth && (
              <p className="text-xs text-rose-500 mt-1">{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Blood Group & Guardian Relation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Blood Group
            </label>
            <div className="relative">
              <Droplet className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Guardian Relationship
            </label>
            <select
              value={guardianRelation}
              onChange={(e) => setGuardianRelation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
            >
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Legal Guardian">Legal Guardian</option>
              <option value="Grandparent">Grandparent</option>
              <option value="Foster Parent">Foster Parent</option>
            </select>
          </div>
        </div>

        {/* Guardian Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Guardian Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Zahid Ahmed"
                className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border ${
                  errors.guardianName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500`}
              />
            </div>
            {errors.guardianName && (
              <p className="text-xs text-rose-500 mt-1">{errors.guardianName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Guardian Phone / Contact
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Residential Address
          </label>
          <div className="relative">
            <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 142 Green Park Road"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Medical Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Allergies & Medical Notes
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any known medication allergies, birth complications, or dietary notes..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Form Actions */}
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
            className="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-98 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            {mode === 'add' ? 'Generate Vaccination Schedule' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
