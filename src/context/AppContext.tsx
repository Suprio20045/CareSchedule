import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Patient, 
  AppSettings, 
  NavigationTab, 
  ToastMessage, 
  PatientVaccineRecord 
} from '../types';
import { DEFAULT_SETTINGS } from '../data/demoData';
import { 
  loadPatientsFromStorage, 
  savePatientsToStorage, 
  loadSettingsFromStorage, 
  saveSettingsToStorage, 
  resetApplicationStorage, 
  clearApplicationStorage 
} from '../utils/storage';
import { 
  generateVaccineSchedule, 
  calculateAggregatedStats, 
  determineVaccineStatus, 
  refreshPatientVaccineStatuses,
  VaccinationSummaryStats,
  VaccineQueueItem
} from '../utils/vaccinationUtils';
import { getTodayDateString } from '../utils/dateUtils';

interface AppContextType {
  patients: Patient[];
  settings: AppSettings;
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Actions
  addPatient: (data: Omit<Patient, 'id' | 'createdAt' | 'vaccines'>) => Patient;
  updatePatient: (patient: Patient) => void;
  deletePatient: (patientId: string) => void;
  markVaccineCompleted: (
    patientId: string, 
    vaccineRecordId: string, 
    administeredDate: string, 
    notes?: string, 
    batchNumber?: string, 
    administeredBy?: string
  ) => void;
  undoVaccineCompleted: (patientId: string, vaccineRecordId: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetToDemo: () => void;
  clearAll: () => void;
  
  // Computed stats
  aggregated: {
    stats: VaccinationSummaryStats;
    upcomingQueue: VaccineQueueItem[];
    dueSoonQueue: VaccineQueueItem[];
    overdueQueue: VaccineQueueItem[];
  };
  
  // Helpers
  selectedPatient: Patient | null;
  navigateToPatientSchedule: (patientId: string) => void;
  navigateToPatientReport: (patientId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => loadPatientsFromStorage());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettingsFromStorage());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to html document element if theme is dark
  useEffect(() => {
    const isDark = settings.theme === 'dark' || 
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Sync patients to storage whenever changed
  const updateAndPersistPatients = useCallback((newPatients: Patient[]) => {
    setPatients(newPatients);
    savePatientsToStorage(newPatients);
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = {
      id,
      duration: 3500,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Compute aggregated stats reactively
  const aggregated = useMemo(() => {
    return calculateAggregatedStats(patients, settings.dueSoonThresholdDays, getTodayDateString());
  }, [patients, settings.dueSoonThresholdDays]);

  const selectedPatient = useMemo(() => {
    if (!selectedPatientId) return patients[0] || null;
    return patients.find(p => p.id === selectedPatientId) || patients[0] || null;
  }, [patients, selectedPatientId]);

  // Add Patient
  const addPatient = useCallback((data: Omit<Patient, 'id' | 'createdAt' | 'vaccines'>): Patient => {
    const today = getTodayDateString();
    const id = `pat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const schedule = generateVaccineSchedule(data.dateOfBirth, settings.dueSoonThresholdDays);

    const newPatient: Patient = {
      ...data,
      id,
      createdAt: today,
      vaccines: schedule
    };

    const nextList = [newPatient, ...patients];
    updateAndPersistPatients(nextList);
    setSelectedPatientId(id);

    addToast({
      type: 'success',
      title: 'Patient Added',
      message: `${newPatient.fullName} registered with full vaccination schedule.`
    });

    return newPatient;
  }, [patients, settings.dueSoonThresholdDays, updateAndPersistPatients, addToast]);

  // Update Patient Details
  const updatePatient = useCallback((updated: Patient) => {
    const nextList = patients.map(p => {
      if (p.id === updated.id) {
        // If DOB changed, regenerate schedule preserving any previously completed vaccines
        if (p.dateOfBirth !== updated.dateOfBirth) {
          const freshSchedule = generateVaccineSchedule(updated.dateOfBirth, settings.dueSoonThresholdDays);
          // transfer completed statuses if matched
          const mergedVaccines = freshSchedule.map(fresh => {
            const old = p.vaccines.find(v => v.vaccineId === fresh.vaccineId);
            if (old && old.dateAdministered) {
              return {
                ...fresh,
                dateAdministered: old.dateAdministered,
                administeredBy: old.administeredBy,
                batchNumber: old.batchNumber,
                status: 'Completed' as const
              };
            }
            return fresh;
          });
          return { ...updated, vaccines: mergedVaccines };
        }
        return updated;
      }
      return p;
    });

    updateAndPersistPatients(nextList);
    addToast({
      type: 'success',
      title: 'Patient Updated',
      message: `Profile details for ${updated.fullName} have been saved.`
    });
  }, [patients, settings.dueSoonThresholdDays, updateAndPersistPatients, addToast]);

  // Delete Patient
  const deletePatient = useCallback((patientId: string) => {
    const target = patients.find(p => p.id === patientId);
    const targetName = target ? target.fullName : 'Patient';
    const nextList = patients.filter(p => p.id !== patientId);
    updateAndPersistPatients(nextList);

    if (selectedPatientId === patientId) {
      setSelectedPatientId(nextList[0]?.id || null);
    }

    addToast({
      type: 'info',
      title: 'Patient Deleted',
      message: `${targetName} was removed from the database.`
    });
  }, [patients, selectedPatientId, updateAndPersistPatients, addToast]);

  // Mark Vaccine Completed
  const markVaccineCompleted = useCallback((
    patientId: string, 
    vaccineRecordId: string, 
    administeredDate: string, 
    notes?: string, 
    batchNumber?: string, 
    administeredBy?: string
  ) => {
    let vaccineName = 'Vaccine';
    let patientName = '';

    const nextList = patients.map(p => {
      if (p.id === patientId) {
        patientName = p.fullName;
        const updatedVaccines = p.vaccines.map(v => {
          if (v.id === vaccineRecordId) {
            vaccineName = v.vaccineName;
            return {
              ...v,
              dateAdministered: administeredDate,
              status: 'Completed' as const,
              notes: notes !== undefined ? notes : v.notes,
              batchNumber: batchNumber !== undefined ? batchNumber : v.batchNumber,
              administeredBy: administeredBy !== undefined ? administeredBy : (v.administeredBy || settings.userName)
            };
          }
          return v;
        });
        return { ...p, vaccines: updatedVaccines };
      }
      return p;
    });

    updateAndPersistPatients(nextList);

    // Trigger subtle celebratory confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0d9488', '#14b8a6', '#0284c7', '#3b82f6']
      });
    } catch {
      // ignore
    }

    addToast({
      type: 'success',
      title: 'Vaccination Completed',
      message: `${vaccineName} recorded as completed for ${patientName}.`
    });
  }, [patients, settings.userName, updateAndPersistPatients, addToast]);

  // Undo Vaccine Completed
  const undoVaccineCompleted = useCallback((patientId: string, vaccineRecordId: string) => {
    const today = getTodayDateString();
    let vaccineName = 'Vaccine';

    const nextList = patients.map(p => {
      if (p.id === patientId) {
        const updatedVaccines = p.vaccines.map(v => {
          if (v.id === vaccineRecordId) {
            vaccineName = v.vaccineName;
            const newStatus = determineVaccineStatus(v.dueDate, null, settings.dueSoonThresholdDays, today);
            return {
              ...v,
              dateAdministered: null,
              status: newStatus
            };
          }
          return v;
        });
        return { ...p, vaccines: updatedVaccines };
      }
      return p;
    });

    updateAndPersistPatients(nextList);

    addToast({
      type: 'info',
      title: 'Status Reset',
      message: `${vaccineName} status was reverted to pending.`
    });
  }, [patients, settings.dueSoonThresholdDays, updateAndPersistPatients, addToast]);

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettingsToStorage(updated);
      
      // If threshold changed, recalculate patient statuses
      if (newSettings.dueSoonThresholdDays !== undefined && newSettings.dueSoonThresholdDays !== prev.dueSoonThresholdDays) {
        const today = getTodayDateString();
        setPatients(currentPatients => {
          const refreshed = currentPatients.map(p => refreshPatientVaccineStatuses(p, updated.dueSoonThresholdDays, today));
          savePatientsToStorage(refreshed);
          return refreshed;
        });
      }
      
      return updated;
    });

    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your preferences have been updated successfully.'
    });
  }, [addToast]);

  // Reset to Demo Data
  const resetToDemo = useCallback(() => {
    const demo = resetApplicationStorage();
    setPatients(demo);
    setSettings(DEFAULT_SETTINGS);
    setSelectedPatientId(demo[0]?.id || null);
    addToast({
      type: 'success',
      title: 'Demo Data Restored',
      message: 'Loaded sample patients, immunization records, and default settings.'
    });
  }, [addToast]);

  // Clear All Data
  const clearAll = useCallback(() => {
    clearApplicationStorage();
    setPatients([]);
    setSelectedPatientId(null);
    addToast({
      type: 'warning',
      title: 'All Data Cleared',
      message: 'All local patients and records have been deleted.'
    });
  }, [addToast]);

  const navigateToPatientSchedule = useCallback((patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentTab('vaccinations');
  }, []);

  const navigateToPatientReport = useCallback((patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentTab('reports');
  }, []);

  const value = {
    patients,
    settings,
    currentTab,
    setCurrentTab,
    selectedPatientId,
    setSelectedPatientId,
    searchQuery,
    setSearchQuery,
    toasts,
    addToast,
    removeToast,
    addPatient,
    updatePatient,
    deletePatient,
    markVaccineCompleted,
    undoVaccineCompleted,
    updateSettings,
    resetToDemo,
    clearAll,
    aggregated,
    selectedPatient,
    navigateToPatientSchedule,
    navigateToPatientReport
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
