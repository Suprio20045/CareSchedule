import { Patient } from '../types';

export function mapSupabasePatient(row: any): Patient {
  return {
    id: row.id,
    fullName: row.full_name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    bloodGroup: row.blood_group,
    guardianName: row.guardian_name,
    guardianPhone: row.guardian_phone,
    guardianRelation: row.guardian_relation,
    address: row.address,
    avatarSeed: row.avatar_seed,
    notes: row.notes,
    createdAt: row.created_at,
    vaccines: [],
  };
}