import { Patient, AppSettings } from '../types';
import { DEFAULT_SETTINGS, getInitialDemoPatients } from '../data/demoData';
import { refreshPatientVaccineStatuses, generateVaccineSchedule } from './vaccinationUtils';
import { getTodayDateString } from './dateUtils';

const STORAGE_KEYS = {
  PATIENTS: 'careschedule_patients_v1',
  SETTINGS: 'careschedule_settings_v1',
  INITIALIZED: 'careschedule_initialized_v1'
};

export function loadSettingsFromStorage(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading settings from localStorage', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings to localStorage', err);
  }
}

export function loadPatientsFromStorage(): Patient[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    const settings = loadSettingsFromStorage();

    if (!raw) {
      // First time launch: Initialize with demo patients
      const demoPatients = getInitialDemoPatients();
      savePatientsToStorage(demoPatients);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      return demoPatients;
    }

    const patients: Patient[] = JSON.parse(raw);
    // Refresh all calculated statuses with current date & threshold
    const today = getTodayDateString();
    return patients.map(p => refreshPatientVaccineStatuses(p, settings.dueSoonThresholdDays, today));
  } catch (err) {
    console.error('Error loading patients from localStorage', err);
    return getInitialDemoPatients();
  }
}

export function savePatientsToStorage(patients: Patient[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  } catch (err) {
    console.error('Error saving patients to localStorage', err);
  }
}

export function resetApplicationStorage(): Patient[] {
  try {
    const demoPatients = getInitialDemoPatients();
    savePatientsToStorage(demoPatients);
    saveSettingsToStorage(DEFAULT_SETTINGS);
    return demoPatients;
  } catch (err) {
    console.error('Error resetting storage', err);
    return [];
  }
}

export function clearApplicationStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  } catch (err) {
    console.error('Error clearing storage', err);
  }
}

export function exportBackupJSON(): string {
  const patients = loadPatientsFromStorage();
  const settings = loadSettingsFromStorage();
  const data = {
    app: 'CareSchedule',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    settings,
    patients
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonString: string): { success: boolean; message: string; patients?: Patient[] } {
  try {
    const data = JSON.parse(jsonString);
    if (!data.patients || !Array.isArray(data.patients)) {
      return { success: false, message: 'Invalid backup format: missing patients array.' };
    }
    savePatientsToStorage(data.patients);
    if (data.settings) {
      saveSettingsToStorage(data.settings);
    }
    return { success: true, message: `Successfully imported ${data.patients.length} patient records.`, patients: data.patients };
  } catch (err) {
    return { success: false, message: 'Failed to parse JSON backup file.' };
  }
}
