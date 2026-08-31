import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '../utils/supabaseClient';
<<<<<<< HEAD
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
=======
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f
import {
  saveVaccinations,
  updateVaccination,
  deleteVaccinationsForPatient
} from '../utils/vaccinationApi';
import { 
  Patient, 
  AppSettings, 
  NavigationTab, 
  ToastMessage, 
  PatientVaccineRecord 
} from '../types';
import { DEFAULT_SETTINGS } from '../data/demoData';
import { 
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
  addPatient: (patientData: Omit<Patient, 'id' | 'createdAt' | 'vaccines'>) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  deletePatient: (patientId: string) => Promise<void>;
  markVaccineCompleted: (
    patientId: string, 
    vaccineRecordId: string, 
    administeredDate: string, 
    notes?: string, 
    batchNumber?: string, 
    administeredBy?: string
  ) => Promise<void>;
  undoVaccineCompleted: (patientId: string, vaccineRecordId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetToDemo: () => Promise<void>;
  clearAll: () => Promise<void>;
  
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
// Convert a Supabase patient row into our React Patient format
const mapPatientFromDb = (patient: any, vaccines: PatientVaccineRecord[]): Patient => {
  return {
    id: patient.id,
    fullName: patient.full_name,
    dateOfBirth: patient.date_of_birth,
    gender: patient.gender,
    bloodGroup: patient.blood_group,
    guardianName: patient.guardian_name,
    guardianPhone: patient.guardian_phone,
    guardianRelation: patient.guardian_relation,
    address: patient.address,
    avatarSeed: patient.avatar_seed,
    notes: patient.notes,
    createdAt: patient.created_at,
    vaccines,
  };
};

// Convert a Supabase vaccination row into our React format
const mapVaccinationFromDb = (vaccine: any): PatientVaccineRecord => {
  return {
    id: vaccine.id,
    vaccineId: vaccine.vaccine_id,
    vaccineName: vaccine.vaccine_name,
    doseNumber: vaccine.dose_number,
    dueDate: vaccine.due_date,
    dateAdministered: vaccine.date_administered,
    status: vaccine.status,
    administeredBy: vaccine.administered_by,
    notes: vaccine.notes,
    batchNumber: vaccine.batch_number,
    location: vaccine.location,
  };
};
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState(true);
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f
  const [settings, setSettings] = useState<AppSettings>(() => loadSettingsFromStorage());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  useEffect(() => {
<<<<<<< HEAD
  const loadPatients = async (userId: string) => {
    // Load patients belonging to the logged-in Firebase user
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
=======
  const loadPatients = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    // Load patients belonging to the logged-in user
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', user.id)
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f
      .order('created_at', { ascending: false });

    if (patientError) {
      console.error('Error loading patients:', patientError);
      return;
    }

    if (!patientData || patientData.length === 0) {
      setPatients([]);
      return;
    }

    // Get patient IDs
    const patientIds = patientData.map((patient) => patient.id);

    // Load vaccination records for those patients
    const { data: vaccinationData, error: vaccinationError } = await supabase
      .from('vaccinations')
      .select('*')
      .in('patient_id', patientIds)
      .order('due_date', { ascending: true });

    if (vaccinationError) {
      console.error('Error loading vaccinations:', vaccinationError);
      return;
    }

    // Group vaccinations by patient
    const vaccinationsByPatient: Record<string, PatientVaccineRecord[]> = {};

    (vaccinationData || []).forEach((vaccine) => {
      if (!vaccinationsByPatient[vaccine.patient_id]) {
        vaccinationsByPatient[vaccine.patient_id] = [];
      }

      vaccinationsByPatient[vaccine.patient_id].push(
        mapVaccinationFromDb(vaccine)
      );
    });

    // Convert Supabase patients into our React format
    const formattedPatients: Patient[] = patientData.map((patient) => {
      return mapPatientFromDb(
        patient,
        vaccinationsByPatient[patient.id] || []
      );
    });

    setPatients(formattedPatients);
  };

<<<<<<< HEAD
  // Firebase's auth state is resolved asynchronously, so `auth.currentUser`
  // can briefly be null on initial page load even for a signed-in user.
  // onAuthStateChanged fires once auth has actually settled, so we wait for
  // that instead of reading auth.currentUser directly at mount time.
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (!firebaseUser) {
      setPatients([]);
      return;
    }
    loadPatients(firebaseUser.uid);
  });

  return () => unsubscribe();
=======
  loadPatients();
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f
}, []);

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

  // Supabase is the source of truth for patient/vaccination data now, so this
  // only needs to update in-memory state — no localStorage mirroring.
  const updateAndPersistPatients = useCallback((newPatients: Patient[]) => {
    setPatients(newPatients);
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
  const addPatient = useCallback(
    async (patientData: Omit<Patient, 'id' | 'createdAt' | 'vaccines'>) => {
      try {
<<<<<<< HEAD
        // Get currently logged-in Firebase user
        const user = auth.currentUser;
=======
        // Get currently logged-in user
        const {
          data: { user },
        } = await supabase.auth.getUser();
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f

        if (!user) {
          addToast({
            type: 'error',
            title: 'Authentication Required',
            message: 'You must be logged in to add a patient.'
          });
          return;
        }

        // Insert patient into Supabase
        const { data, error } = await supabase
          .from('patients')
          .insert({
<<<<<<< HEAD
            user_id: user.uid,
=======
            user_id: user.id,
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f
            full_name: patientData.fullName,
            date_of_birth: patientData.dateOfBirth,
            gender: patientData.gender,
            blood_group: patientData.bloodGroup,
            guardian_name: patientData.guardianName,
            guardian_phone: patientData.guardianPhone,
            guardian_relation: patientData.guardianRelation,
            address: patientData.address,
            avatar_seed: patientData.avatarSeed,
            notes: patientData.notes,
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          addToast({
            type: 'error',
            title: 'Error',
            message: 'Failed to save patient.'
          });
          return;
        }

        // Convert Supabase data back into our React Patient format
        const schedule = generateVaccineSchedule(patientData.dateOfBirth, settings.dueSoonThresholdDays);
        // Save generated vaccine schedule to Supabase
        const { error: vaccineError } = await saveVaccinations(
          data.id,
          schedule
        );

        const newPatient: Patient = {
          ...patientData,
          id: data.id,
          createdAt: data.created_at,
          vaccines: schedule
        };

        // Update UI immediately
        setPatients((currentPatients) => [
          newPatient,
          ...currentPatients,
        ]);

        if (vaccineError) {
          console.error('Error saving vaccinations:', vaccineError);

          // Patient was created, but vaccines failed - warn only, don't also claim success
          addToast({
            type: 'warning',
            title: 'Patient Added',
            message: 'Patient was saved, but the vaccination schedule could not be saved.'
          });
        } else {
          addToast({
            type: 'success',
            title: 'Patient Added',
            message: `${newPatient.fullName} added successfully.`
          });
        }

      } catch (error) {
        console.error('Error adding patient:', error);
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Something went wrong while adding the patient.'
        });
      }
    },
    [addToast, settings.dueSoonThresholdDays]
  );

  // Update Patient Details
  const updatePatient = useCallback(async (updated: Patient) => {
    const existing = patients.find(p => p.id === updated.id);

    if (!existing) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Patient record could not be found.'
      });
      return;
    }

    const dobChanged = existing.dateOfBirth !== updated.dateOfBirth;

    // Persist patient profile fields to Supabase first
    const { error: patientError } = await supabase
      .from('patients')
      .update({
        full_name: updated.fullName,
        date_of_birth: updated.dateOfBirth,
        gender: updated.gender,
        blood_group: updated.bloodGroup,
        guardian_name: updated.guardianName,
        guardian_phone: updated.guardianPhone,
        guardian_relation: updated.guardianRelation,
        address: updated.address,
        avatar_seed: updated.avatarSeed,
        notes: updated.notes,
      })
      .eq('id', updated.id);

    if (patientError) {
      console.error('Error updating patient:', patientError);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save patient details.'
      });
      return;
    }

    let finalVaccines = existing.vaccines;
    let scheduleRefreshFailed = false;

    if (dobChanged) {
      // DOB changed: regenerate schedule preserving any previously completed vaccines
      const freshSchedule = generateVaccineSchedule(updated.dateOfBirth, settings.dueSoonThresholdDays);
      const mergedVaccines = freshSchedule.map(fresh => {
        const old = existing.vaccines.find(
          v =>
            v.vaccineId === fresh.vaccineId &&
            v.doseNumber === fresh.doseNumber
        );
        if (old && old.dateAdministered) {
          return {
            ...fresh,
            dateAdministered: old.dateAdministered,
            administeredBy: old.administeredBy,
            batchNumber: old.batchNumber,
            notes: old.notes,
            location: old.location,
            status: 'Completed' as const
          };
        }
        return fresh;
      });

      // Replace vaccination rows in Supabase to match the regenerated schedule.
      // These two calls aren't wrapped in a real database transaction, so if the
      // insert after the delete fails, we make a best-effort attempt to restore
      // the old rows rather than silently leaving the patient with a new DOB
      // and no vaccination schedule at all.
      const { error: deleteError } = await deleteVaccinationsForPatient(updated.id);

      if (deleteError) {
        console.error('Error clearing old vaccinations:', deleteError);
        scheduleRefreshFailed = true;
        // Delete failed, so the old rows are still intact in Supabase.
        finalVaccines = existing.vaccines;
      } else {
        const { error: vaccineError } = await saveVaccinations(updated.id, mergedVaccines);

        if (vaccineError) {
          console.error('Error saving regenerated vaccinations:', vaccineError);
          scheduleRefreshFailed = true;

          // Best-effort rollback: the old rows are already gone, so try to
          // restore them so the database isn't left with an empty schedule.
          const { error: restoreError } = await saveVaccinations(updated.id, existing.vaccines);

          if (restoreError) {
            console.error('Error restoring previous vaccinations after failed refresh:', restoreError);
            // Restore also failed - Supabase now has no vaccination rows for
            // this patient, so reflect that reality in the UI rather than
            // showing vaccines that no longer exist in the database.
            finalVaccines = [];
          } else {
            finalVaccines = existing.vaccines;
          }
        } else {
          finalVaccines = mergedVaccines;
        }
      }
    }

    const nextList = patients.map(p => (p.id === updated.id ? { ...updated, vaccines: finalVaccines } : p));
    updateAndPersistPatients(nextList);

    if (scheduleRefreshFailed) {
      addToast({
        type: 'warning',
        title: 'Patient Updated',
        message: 'Profile saved, but the vaccination schedule could not be refreshed.'
      });
    } else {
      addToast({
        type: 'success',
        title: 'Patient Updated',
        message: `Profile details for ${updated.fullName} have been saved.`
      });
    }
  }, [patients, settings.dueSoonThresholdDays, updateAndPersistPatients, addToast]);

  // Delete Patient
  const deletePatient = useCallback(async (patientId: string) => {
    const target = patients.find(p => p.id === patientId);
    const targetName = target ? target.fullName : 'Patient';
    const { error } = await supabase
  .from('patients')
  .delete()
  .eq('id', patientId);

if (error) {
  console.error('Error deleting patient:', error);

  addToast({
    type: 'error',
    title: 'Error',
    message: 'Failed to delete patient.'
  });

  return;
}
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
  const markVaccineCompleted = useCallback(async (
    patientId: string,
    vaccineRecordId: string,
    administeredDate: string,
    notes?: string,
    batchNumber?: string,
    administeredBy?: string
  ) => {
    let vaccineName = 'Vaccine';
    let patientName = '';
    let finalAdministeredBy = administeredBy || settings.userName;

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
              batchNumber: batchNumber !== undefined
                ? batchNumber
                : v.batchNumber,
              administeredBy:
                administeredBy !== undefined
                  ? administeredBy
                  : (v.administeredBy || settings.userName)
            };
          }

          return v;
        });

        return {
          ...p,
          vaccines: updatedVaccines
        };
      }

      return p;
    });

    const updatedPatient = nextList.find(p => p.id === patientId);
    const updatedVaccine = updatedPatient?.vaccines.find(
      v => v.id === vaccineRecordId
    );

    if (!updatedVaccine) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Vaccination record could not be found.'
      });
      return;
    }

    // Save vaccination update to Supabase
    const { error } = await updateVaccination(
      vaccineRecordId,
      {
        dateAdministered: administeredDate,
        status: 'Completed',
        notes: updatedVaccine.notes || null,
        batchNumber: updatedVaccine.batchNumber || null,
        administeredBy: finalAdministeredBy || null,
        location: updatedVaccine.location || null
      }
    );

    if (error) {
      console.error('Error updating vaccination:', error);

      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save vaccination status.'
      });

      return;
    }

    // Update UI only after Supabase succeeds
    updateAndPersistPatients(nextList);

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

  }, [
    patients,
    settings.userName,
    updateAndPersistPatients,
    addToast
  ]);

  // Undo Vaccine Completed
  const undoVaccineCompleted = useCallback(async (
    patientId: string,
    vaccineRecordId: string
  ) => {
    const today = getTodayDateString();

    let vaccineName = 'Vaccine';

    const targetPatient = patients.find(
      p => p.id === patientId
    );

    const targetVaccine = targetPatient?.vaccines.find(
      v => v.id === vaccineRecordId
    );

    if (!targetVaccine) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Vaccination record could not be found.'
      });
      return;
    }

    vaccineName = targetVaccine.vaccineName;

    const newStatus = determineVaccineStatus(
      targetVaccine.dueDate,
      null,
      settings.dueSoonThresholdDays,
      today
    );

    // Update Supabase first
    const { error } = await updateVaccination(
      vaccineRecordId,
      {
        dateAdministered: null,
        status: newStatus,
        notes: targetVaccine.notes || null,
        batchNumber: targetVaccine.batchNumber || null,
        administeredBy: targetVaccine.administeredBy || null,
        location: targetVaccine.location || null
      }
    );

    if (error) {
      console.error('Error resetting vaccination:', error);

      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to reset vaccination status.'
      });

      return;
    }

    const nextList = patients.map(p => {
      if (p.id === patientId) {
        const updatedVaccines = p.vaccines.map(v => {
          if (v.id === vaccineRecordId) {
            return {
              ...v,
              dateAdministered: null,
              status: newStatus
            };
          }

          return v;
        });

        return {
          ...p,
          vaccines: updatedVaccines
        };
      }

      return p;
    });

    updateAndPersistPatients(nextList);

    addToast({
      type: 'info',
      title: 'Status Reset',
      message: `${vaccineName} status was reverted to pending.`
    });

  }, [
    patients,
    settings.dueSoonThresholdDays,
    updateAndPersistPatients,
    addToast
  ]);

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

  // Deletes every patient (and their vaccinations) belonging to the current
  // user from Supabase. Shared by resetToDemo and clearAll so that "clearing"
  // the app also clears the real backend, not just local/React state.
  const deleteAllPatientsForCurrentUser = useCallback(async (): Promise<{ error: string | null }> => {
<<<<<<< HEAD
    const user = auth.currentUser;
=======
    const {
      data: { user },
    } = await supabase.auth.getUser();
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f

    if (!user) {
      // Nothing to delete server-side if there's no logged-in user.
      return { error: null };
    }

    const { data: userPatients, error: fetchError } = await supabase
      .from('patients')
      .select('id')
<<<<<<< HEAD
      .eq('user_id', user.uid);
=======
      .eq('user_id', user.id);
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f

    if (fetchError) {
      console.error('Error fetching patients before clearing:', fetchError);
      return { error: 'Failed to load existing patients.' };
    }

    const patientIds = (userPatients || []).map(p => p.id);

    if (patientIds.length === 0) {
      return { error: null };
    }

    const { error: vaccinationDeleteError } = await supabase
      .from('vaccinations')
      .delete()
      .in('patient_id', patientIds);

    if (vaccinationDeleteError) {
      console.error('Error clearing vaccinations:', vaccinationDeleteError);
      return { error: 'Failed to clear vaccination records.' };
    }

    const { error: patientDeleteError } = await supabase
      .from('patients')
      .delete()
<<<<<<< HEAD
      .eq('user_id', user.uid);
=======
      .eq('user_id', user.id);
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f

    if (patientDeleteError) {
      console.error('Error clearing patients:', patientDeleteError);
      return { error: 'Failed to clear patients.' };
    }

    return { error: null };
  }, []);

  // Reset to Demo Data
  const resetToDemo = useCallback(async () => {
    const { error } = await deleteAllPatientsForCurrentUser();

    if (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: `Could not reset demo data: ${error}`
      });
      return;
    }

<<<<<<< HEAD
    const user = auth.currentUser;
=======
    const {
      data: { user },
    } = await supabase.auth.getUser();
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f

    const demo = resetApplicationStorage();

    if (!user) {
      // No logged-in user to own the demo patients in Supabase - fall back
      // to local-only demo data rather than failing outright.
      setPatients(demo);
      setSettings(DEFAULT_SETTINGS);
      setSelectedPatientId(demo[0]?.id || null);
      addToast({
        type: 'success',
        title: 'Demo Data Restored',
        message: 'Loaded sample patients, immunization records, and default settings.'
      });
      return;
    }

    // Re-create the demo patients (and their vaccine schedules) in Supabase
    // so the backend and the UI agree on what demo data exists.
    const createdPatients: Patient[] = [];

    for (const demoPatient of demo) {
      const { data: insertedPatient, error: insertError } = await supabase
        .from('patients')
        .insert({
<<<<<<< HEAD
          user_id: user.uid,
=======
          user_id: user.id,
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f
          full_name: demoPatient.fullName,
          date_of_birth: demoPatient.dateOfBirth,
          gender: demoPatient.gender,
          blood_group: demoPatient.bloodGroup,
          guardian_name: demoPatient.guardianName,
          guardian_phone: demoPatient.guardianPhone,
          guardian_relation: demoPatient.guardianRelation,
          address: demoPatient.address,
          avatar_seed: demoPatient.avatarSeed,
          notes: demoPatient.notes,
        })
        .select()
        .single();

      if (insertError || !insertedPatient) {
        console.error('Error inserting demo patient:', insertError);
        continue;
      }

      const { error: vaccineError } = await saveVaccinations(insertedPatient.id, demoPatient.vaccines);

      if (vaccineError) {
        console.error('Error saving demo vaccinations:', vaccineError);
      }

      createdPatients.push({
        ...demoPatient,
        id: insertedPatient.id,
        createdAt: insertedPatient.created_at,
      });
    }

    setPatients(createdPatients);
    setSettings(DEFAULT_SETTINGS);
    setSelectedPatientId(createdPatients[0]?.id || null);

    addToast({
      type: 'success',
      title: 'Demo Data Restored',
      message: 'Loaded sample patients, immunization records, and default settings.'
    });
  }, [addToast, deleteAllPatientsForCurrentUser]);

  // Clear All Data
  const clearAll = useCallback(async () => {
    const { error } = await deleteAllPatientsForCurrentUser();

    if (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: `Could not clear all data: ${error}`
      });
      return;
    }

    clearApplicationStorage();
    setPatients([]);
    setSelectedPatientId(null);
    addToast({
      type: 'warning',
      title: 'All Data Cleared',
      message: 'All patients and vaccination records have been deleted.'
    });
  }, [addToast, deleteAllPatientsForCurrentUser]);

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
