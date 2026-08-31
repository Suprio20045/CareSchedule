import { STANDARD_VACCINE_SCHEDULE } from '../data/vaccineSchedule';
import { Patient, PatientVaccineRecord, VaccineStatus } from '../types';
import { addDaysToDate, getDaysDifference, getTodayDateString } from './dateUtils';

export function calculateVaccineDueDate(dob: string, offsetDays?: number, offsetMonths?: number): string {
  if (offsetDays !== undefined && offsetDays !== null) {
    return addDaysToDate(dob, offsetDays);
  }
  const months = offsetMonths || 0;
  const approxDays = Math.round(months * 30.4375);
  return addDaysToDate(dob, approxDays);
}

export function determineVaccineStatus(
  dueDate: string,
  dateAdministered?: string | null,
  thresholdDays: number = 7,
  todayStr: string = getTodayDateString()
): VaccineStatus {
  if (dateAdministered && dateAdministered.trim() !== '') {
    return 'Completed';
  }

  const daysDiff = getDaysDifference(dueDate, todayStr);

  if (daysDiff < 0) {
    return 'Overdue';
  }

  if (daysDiff <= thresholdDays) {
    return 'Due Soon';
  }

  return 'Upcoming';
}

export function generateVaccineSchedule(dob: string, thresholdDays: number = 7): PatientVaccineRecord[] {
  const todayStr = getTodayDateString();

  return STANDARD_VACCINE_SCHEDULE.map((def, index) => {
    const dueDate = calculateVaccineDueDate(dob, def.ageOffsetDays, def.ageOffsetMonths);
    const status = determineVaccineStatus(dueDate, null, thresholdDays, todayStr);

    return {
      id: `vac-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      vaccineId: def.id,
      vaccineName: def.name,
      doseNumber: def.doseNumber,
      dueDate,
      dateAdministered: null,
      status,
      administeredBy: '',
      notes: '',
      batchNumber: '',
      location: ''
    };
  });
}

export function refreshPatientVaccineStatuses(
  patient: Patient,
  thresholdDays: number = 7,
  todayStr: string = getTodayDateString()
): Patient {
  const updatedVaccines = patient.vaccines.map((v) => {
    const status = determineVaccineStatus(v.dueDate, v.dateAdministered, thresholdDays, todayStr);
    return {
      ...v,
      status
    };
  });

  return {
    ...patient,
    vaccines: updatedVaccines
  };
}

export interface VaccinationSummaryStats {
  totalPatients: number;
  totalVaccinations: number;
  completed: number;
  dueSoon: number;
  overdue: number;
  upcoming: number;
  completedPercentage: number;
  dueSoonPercentage: number;
  overduePercentage: number;
  upcomingPercentage: number;
}

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

export function calculateAggregatedStats(
  patients: Patient[],
  thresholdDays: number = 7,
  todayStr: string = getTodayDateString()
): {
  stats: VaccinationSummaryStats;
  upcomingQueue: VaccineQueueItem[];
  dueSoonQueue: VaccineQueueItem[];
  overdueQueue: VaccineQueueItem[];
} {
  let totalVaccinations = 0;
  let completed = 0;
  let dueSoon = 0;
  let overdue = 0;
  let upcoming = 0;

  const upcomingQueue: VaccineQueueItem[] = [];
  const dueSoonQueue: VaccineQueueItem[] = [];
  const overdueQueue: VaccineQueueItem[] = [];

  patients.forEach((patient) => {
    patient.vaccines.forEach((v) => {
      totalVaccinations++;
      const currentStatus = determineVaccineStatus(v.dueDate, v.dateAdministered, thresholdDays, todayStr);
      const daysDiff = getDaysDifference(v.dueDate, todayStr);

      const queueItem: VaccineQueueItem = {
        patientId: patient.id,
        patientName: patient.fullName,
        patientAgeText: patient.gender, // placeholder or calculated
        patientBloodGroup: patient.bloodGroup,
        patientGender: patient.gender,
        guardianName: patient.guardianName,
        guardianPhone: patient.guardianPhone,
        vaccine: { ...v, status: currentStatus },
        daysDiff
      };

      if (currentStatus === 'Completed') {
        completed++;
      } else if (currentStatus === 'Overdue') {
        overdue++;
        overdueQueue.push(queueItem);
      } else if (currentStatus === 'Due Soon') {
        dueSoon++;
        dueSoonQueue.push(queueItem);
      } else {
        upcoming++;
        upcomingQueue.push(queueItem);
      }
    });
  });

  // Sort queues:
  // Overdue: most overdue first (lowest negative daysDiff)
  overdueQueue.sort((a, b) => a.daysDiff - b.daysDiff);

  // Due Soon: closest to today first
  dueSoonQueue.sort((a, b) => a.daysDiff - b.daysDiff);

  // Upcoming: closest to today first
  upcomingQueue.sort((a, b) => a.daysDiff - b.daysDiff);

  const completedPercentage = totalVaccinations > 0 ? Math.round((completed / totalVaccinations) * 100) : 0;
  const dueSoonPercentage = totalVaccinations > 0 ? Math.round((dueSoon / totalVaccinations) * 100) : 0;
  const overduePercentage = totalVaccinations > 0 ? Math.round((overdue / totalVaccinations) * 100) : 0;
  const upcomingPercentage = totalVaccinations > 0 ? Math.max(0, 100 - completedPercentage - dueSoonPercentage - overduePercentage) : 0;

  return {
    stats: {
      totalPatients: patients.length,
      totalVaccinations,
      completed,
      dueSoon,
      overdue,
      upcoming,
      completedPercentage,
      dueSoonPercentage,
      overduePercentage,
      upcomingPercentage
    },
    upcomingQueue,
    dueSoonQueue,
    overdueQueue
  };
}
