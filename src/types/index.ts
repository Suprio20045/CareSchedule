export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type VaccineStatus = 'Completed' | 'Due Soon' | 'Upcoming' | 'Overdue';

export interface VaccineDefinition {
  id: string;
  code: string;
  name: string;
  doseNumber: number;
  totalDoses?: number;
  targetDisease: string;
  ageOffsetMonths: number; // Approximate months from birth
  ageOffsetDays?: number; // Precise days from birth if under 2 months
  ageDescription: string; // e.g. "At Birth", "6 Weeks", "10 Weeks", "9 Months", "15 Months"
  description: string;
  route?: string; // e.g., "Intramuscular (IM)", "Oral", "Subcutaneous"
  mandatory?: boolean;
}

export interface PatientVaccineRecord {
  id: string;
  vaccineId: string;
  vaccineName: string;
  doseNumber: number;
  dueDate: string; // YYYY-MM-DD
  dateAdministered?: string | null; // YYYY-MM-DD
  status: VaccineStatus;
  administeredBy?: string;
  notes?: string;
  batchNumber?: string;
  location?: string;
}

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  guardianName: string;
  guardianPhone: string;
  guardianRelation?: string;
  address?: string;
  avatarSeed?: string;
  notes?: string;
  createdAt: string;
  vaccines: PatientVaccineRecord[];
}

export interface FirstAidTopic {
  id: string;
  title: string;
  category: 'Respiratory' | 'Trauma & Bleeding' | 'Environmental' | 'Bites & Stings' | 'Neurological' | 'Cardiac';
  iconName: string;
  summary: string;
  emergency: boolean;
  color: string;
  quickAction: string;
  steps: string[];
  doNots: string[];
  warning: string;
  whenToCallAmbulance: string[];
}

export interface AppSettings {
  userName: string;
  role: string;
  clinicName: string;
  dueSoonThresholdDays: number;
  theme: 'light' | 'dark' | 'system';
  enableBrowserNotifications: boolean;
  enableSoundEffects: boolean;
  language: string;
}

export type NavigationTab = 
  | 'dashboard'
  | 'patients'
  | 'vaccinations'
  | 'reminders'
  | 'firstAid'
  | 'reports'
  | 'settings';

export interface VaccineQueueItem {
  patientId: string;
  patientName: string;
  patientAgeText: string;
  patientBloodGroup: string;
  patientGender: string;
  guardianName: string;
  guardianPhone: string;
  vaccine: PatientVaccineRecord;
  daysDiff: number;
}

export interface ToastMessage {

  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
