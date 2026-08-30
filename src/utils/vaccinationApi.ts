import { supabase } from './supabaseClient';
import { PatientVaccineRecord } from '../types';

export async function saveVaccinations(
  patientId: string,
  vaccines: PatientVaccineRecord[]
) {
  const rows = vaccines.map((vaccine) => ({
    patient_id: patientId,
    vaccine_id: vaccine.vaccineId,
    vaccine_name: vaccine.vaccineName,
    dose_number: vaccine.doseNumber,
    due_date: vaccine.dueDate,
    date_administered: vaccine.dateAdministered || null,
    status: vaccine.status,
    administered_by: vaccine.administeredBy || null,
    notes: vaccine.notes || null,
    batch_number: vaccine.batchNumber || null,
    location: vaccine.location || null,
  }));

  return await supabase
    .from('vaccinations')
    .insert(rows);
}


export async function updateVaccination(
  vaccineRecordId: string,
  updates: {
    dateAdministered?: string | null;
    status?: string;
    notes?: string | null;
    batchNumber?: string | null;
    administeredBy?: string | null;
    location?: string | null;
  }
) {
  return await supabase
    .from('vaccinations')
    .update({
      date_administered: updates.dateAdministered ?? null,
      status: updates.status,
      notes: updates.notes ?? null,
      batch_number: updates.batchNumber ?? null,
      administered_by: updates.administeredBy ?? null,
      location: updates.location ?? null,
    })
    .eq('id', vaccineRecordId);
}


export async function deleteVaccinationsForPatient(
  patientId: string
) {
  return await supabase
    .from('vaccinations')
    .delete()
    .eq('patient_id', patientId);
}