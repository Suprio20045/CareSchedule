import { Patient, AppSettings } from '../types';
import { generateVaccineSchedule, determineVaccineStatus } from '../utils/vaccinationUtils';
import { addDaysToDate, getTodayDateString } from '../utils/dateUtils';

export const DEFAULT_SETTINGS: AppSettings = {
  userName: 'Suprio',
  role: 'Administrator',
  clinicName: 'CareSchedule Health Center',
  dueSoonThresholdDays: 7,
  theme: 'light',
  enableBrowserNotifications: true,
  enableSoundEffects: true,
  language: 'en'
};

export function getInitialDemoPatients(): Patient[] {
  const today = getTodayDateString();

  // We craft realistic patients anchored to today
  // 1. Rahim Ahmed (~2y 3m)
  const rahimDob = addDaysToDate(today, -820);
  const rahimVaccines = generateVaccineSchedule(rahimDob);
  
  // Set some completed, one due soon, one upcoming
  rahimVaccines.forEach((v, index) => {
    if (index < 9) {
      v.dateAdministered = v.dueDate;
      v.administeredBy = 'Dr. S. Das';
      v.batchNumber = `VAC-2024-${index + 100}`;
    }
    // Make index 9 due in 2 days
    if (index === 9) {
      v.dueDate = addDaysToDate(today, 2);
      v.dateAdministered = null;
    }
    // Make index 10 due in 63 days
    if (index === 10) {
      v.dueDate = addDaysToDate(today, 63);
      v.dateAdministered = null;
    }
    v.status = determineVaccineStatus(v.dueDate, v.dateAdministered);
  });

  // 2. Ayesha Khan (~1y 8m)
  const ayeshaDob = addDaysToDate(today, -610);
  const ayeshaVaccines = generateVaccineSchedule(ayeshaDob);
  ayeshaVaccines.forEach((v, index) => {
    if (index < 12) {
      v.dateAdministered = v.dueDate;
      v.administeredBy = 'Nurse Maria';
      v.batchNumber = `AYE-98${index}`;
    }
    // Make Polio Booster due in 4 days
    if (index === 12) {
      v.dueDate = addDaysToDate(today, 4);
      v.dateAdministered = null;
    }
    v.status = determineVaccineStatus(v.dueDate, v.dateAdministered);
  });

  // 3. Rihan Islam (~6m)
  const rihanDob = addDaysToDate(today, -185);
  const rihanVaccines = generateVaccineSchedule(rihanDob);
  rihanVaccines.forEach((v, index) => {
    if (index < 6) {
      v.dateAdministered = v.dueDate;
      v.administeredBy = 'Dr. S. Das';
      v.batchNumber = `RIH-00${index + 1}`;
    }
    // Make Hepatitis B / Dose 3 due in 6 days
    if (index === 6) {
      v.dueDate = addDaysToDate(today, 6);
      v.dateAdministered = null;
    }
    v.status = determineVaccineStatus(v.dueDate, v.dateAdministered);
  });

  // 4. Fatima Akter (~3y 1m) - has overdue vaccine
  const fatimaDob = addDaysToDate(today, -1125);
  const fatimaVaccines = generateVaccineSchedule(fatimaDob);
  fatimaVaccines.forEach((v, index) => {
    if (index < 14) {
      v.dateAdministered = v.dueDate;
      v.administeredBy = 'Dr. Kamal';
      v.batchNumber = `FAT-2023-${index}`;
    }
    // Make index 14 overdue by 5 days
    if (index === 14) {
      v.dueDate = addDaysToDate(today, -5);
      v.dateAdministered = null;
    }
    // Make index 15 overdue by 18 days
    if (index === 15) {
      v.dueDate = addDaysToDate(today, -18);
      v.dateAdministered = null;
    }
    v.status = determineVaccineStatus(v.dueDate, v.dateAdministered);
  });

  // 5. Sakib Hassan (~1y 9m) - has overdue booster
  const sakibDob = addDaysToDate(today, -640);
  const sakibVaccines = generateVaccineSchedule(sakibDob);
  sakibVaccines.forEach((v, index) => {
    if (index < 13) {
      v.dateAdministered = v.dueDate;
      v.administeredBy = 'Nurse Hasan';
      v.batchNumber = `SAK-55${index}`;
    }
    // Overdue by 12 days
    if (index === 13) {
      v.dueDate = addDaysToDate(today, -12);
      v.dateAdministered = null;
    }
    v.status = determineVaccineStatus(v.dueDate, v.dateAdministered);
  });

  // 6. Nusrat Jahan (~4m) - has due soon vaccine
  const nusratDob = addDaysToDate(today, -120);
  const nusratVaccines = generateVaccineSchedule(nusratDob);
  nusratVaccines.forEach((v, index) => {
    if (index < 4) {
      v.dateAdministered = v.dueDate;
      v.administeredBy = 'Dr. S. Das';
    }
    if (index === 4) {
      v.dueDate = addDaysToDate(today, 3);
      v.dateAdministered = null;
    }
    v.status = determineVaccineStatus(v.dueDate, v.dateAdministered);
  });

  // 7. Tanvir Hossain (~5y)
  const tanvirDob = addDaysToDate(today, -1820);
  const tanvirVaccines = generateVaccineSchedule(tanvirDob);
  tanvirVaccines.forEach((v, index) => {
    if (index < 17) {
      v.dateAdministered = v.dueDate;
      v.administeredBy = 'Dr. Tanvir Sr.';
    }
    v.status = determineVaccineStatus(v.dueDate, v.dateAdministered);
  });

  // 8. Maya Chowdhury (~1m newborn)
  const mayaDob = addDaysToDate(today, -35);
  const mayaVaccines = generateVaccineSchedule(mayaDob);
  mayaVaccines.forEach((v, index) => {
    if (index < 3) {
      v.dateAdministered = v.dueDate;
      v.administeredBy = 'Midwife Selina';
    }
    if (index === 3) {
      v.dueDate = addDaysToDate(today, 5); // due in 5 days (at 6 weeks)
      v.dateAdministered = null;
    }
    v.status = determineVaccineStatus(v.dueDate, v.dateAdministered);
  });

  return [
    {
      id: 'pat-rahim-001',
      fullName: 'Rahim Ahmed',
      dateOfBirth: rahimDob,
      gender: 'Male',
      bloodGroup: 'O+',
      guardianName: 'Zahid Ahmed',
      guardianPhone: '+1 (555) 234-5678',
      guardianRelation: 'Father',
      address: '142 Green Park Road, Apt 4B',
      avatarSeed: 'rahim',
      notes: 'No known drug allergies. Healthy development.',
      createdAt: addDaysToDate(today, -300),
      vaccines: rahimVaccines
    },
    {
      id: 'pat-ayesha-002',
      fullName: 'Ayesha Khan',
      dateOfBirth: ayeshaDob,
      gender: 'Female',
      bloodGroup: 'A+',
      guardianName: 'Hana Khan',
      guardianPhone: '+1 (555) 345-6789',
      guardianRelation: 'Mother',
      address: '88 Meadow Lane',
      avatarSeed: 'ayesha',
      notes: 'Mild eczema behind knees; pediatrician advised moisturizing.',
      createdAt: addDaysToDate(today, -200),
      vaccines: ayeshaVaccines
    },
    {
      id: 'pat-rihan-003',
      fullName: 'Rihan Islam',
      dateOfBirth: rihanDob,
      gender: 'Male',
      bloodGroup: 'B+',
      guardianName: 'Imran Islam',
      guardianPhone: '+1 (555) 456-7890',
      guardianRelation: 'Father',
      address: '12 Sunrise Boulevard',
      avatarSeed: 'rihan',
      notes: 'Exclusive breastfeeding until 6 months.',
      createdAt: addDaysToDate(today, -150),
      vaccines: rihanVaccines
    },
    {
      id: 'pat-fatima-004',
      fullName: 'Fatima Akter',
      dateOfBirth: fatimaDob,
      gender: 'Female',
      bloodGroup: 'AB+',
      guardianName: 'Kamal Uddin',
      guardianPhone: '+1 (555) 567-8901',
      guardianRelation: 'Father',
      address: '77 Lakeview Drive',
      avatarSeed: 'fatima',
      notes: 'Follow-up needed for overdue booster.',
      createdAt: addDaysToDate(today, -400),
      vaccines: fatimaVaccines
    },
    {
      id: 'pat-sakib-005',
      fullName: 'Sakib Hassan',
      dateOfBirth: sakibDob,
      gender: 'Male',
      bloodGroup: 'O-',
      guardianName: 'Hasan Ali',
      guardianPhone: '+1 (555) 678-9012',
      guardianRelation: 'Father',
      address: '304 Riverdale Street',
      avatarSeed: 'sakib',
      notes: 'Reminder SMS sent to guardian.',
      createdAt: addDaysToDate(today, -250),
      vaccines: sakibVaccines
    },
    {
      id: 'pat-nusrat-006',
      fullName: 'Nusrat Jahan',
      dateOfBirth: nusratDob,
      gender: 'Female',
      bloodGroup: 'B-',
      guardianName: 'Farhana Jahan',
      guardianPhone: '+1 (555) 789-0123',
      guardianRelation: 'Mother',
      address: '56 Cedar Heights',
      avatarSeed: 'nusrat',
      notes: 'Normal growth curve on WHO percentile chart.',
      createdAt: addDaysToDate(today, -90),
      vaccines: nusratVaccines
    },
    {
      id: 'pat-tanvir-007',
      fullName: 'Tanvir Hossain',
      dateOfBirth: tanvirDob,
      gender: 'Male',
      bloodGroup: 'A-',
      guardianName: 'Rashid Hossain',
      guardianPhone: '+1 (555) 890-1234',
      guardianRelation: 'Father',
      address: '210 Hilltop Avenue',
      avatarSeed: 'tanvir',
      notes: 'Entering kindergarten this autumn.',
      createdAt: addDaysToDate(today, -500),
      vaccines: tanvirVaccines
    },
    {
      id: 'pat-maya-008',
      fullName: 'Maya Chowdhury',
      dateOfBirth: mayaDob,
      gender: 'Female',
      bloodGroup: 'O+',
      guardianName: 'Ananya Chowdhury',
      guardianPhone: '+1 (555) 901-2345',
      guardianRelation: 'Mother',
      address: '45 Orchid Valley',
      avatarSeed: 'maya',
      notes: 'Newborn checkup completed. Weight gaining well.',
      createdAt: addDaysToDate(today, -25),
      vaccines: mayaVaccines
    }
  ];
}
