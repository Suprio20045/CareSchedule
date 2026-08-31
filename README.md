# CareSchedule

> **"On Time for Every Shot. Ready for Every Emergency."**

CareSchedule is a lightweight, offline-first health-management application designed for families, daycare centers, and local healthcare clinics. It solves two critical problems:
1. **Vaccination Tracking**: Automated calculation of immunization and booster schedules based on date of birth, with dynamic status monitoring (Completed, Due Soon, Overdue, Upcoming).
2. **Offline First-Aid Guide**: Instant access to emergency step-by-step guidance for choking, CPR, burns, heavy bleeding, snake bites, and heat stroke without requiring an internet connection.

---

## 🌟 Key Features

### 📋 Module A — Vaccination Tracker
- **Patient Management**: Register patients with full name, date of birth, blood group, guardian contact, and medical notes.
- **Automated Schedule Generation**: Instantly calculates standard WHO/EPI recommended vaccine due dates from birth.
- **Dynamic Status Logic**:
  - 🟢 **Completed**: Recorded with administration date, lot/batch number, and clinician signature.
  - 🟡 **Due Soon**: Automatic alert window for vaccines due in the next 7 days (customizable).
  - 🔴 **Overdue**: Immediate visual flag for missed target dates.
  - 🔵 **Upcoming**: Future scheduled doses.
- **Reminders & Alert Center**: Quick access to overdue and due-soon immunization queues with one-click completion.
- **Printable Medical Reports**: Generate official A4 immunization certificates with doctor and guardian signature blocks.

### 🚑 Module B — Offline First-Aid Guide
- **100% Offline Access**: Zero external network or API dependencies.
- **Instant Search & Filtering**: Fast keyword search across emergency topics (Choking, Burns, CPR, Cuts & Bleeding, Snake Bites, Heat Exhaustion, Seizures, Anaphylaxis, Poisoning).
- **Clear Numbered Steps**: "What To Do", "What NOT To Do", and "Critical Emergency Warnings".

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Visuals & Charts**: Pure SVG responsive interactive Donut Chart
- **Data Persistence**: Browser `localStorage` with automated schema hydration & JSON Backup/Restore

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```

### Building for Production

```bash
npm run build
```

---

## 📱 Demonstration Flow

1. **Dashboard**: View overall statistics, interactive Donut Chart breakdown, upcoming doses, and recent patients.
2. **Patients**: Click `+ Add Patient` to register a new child and automatically generate their immunization schedule.
3. **Vaccinations**: Select a patient, review the timeline, and click `Mark Completed` to record administration.
4. **Reminders**: Inspect overdue and due-soon alerts.
5. **First Aid**: Search for `"Choking"` or `"CPR"` to review offline emergency protocols.
6. **Reports**: Open a patient's summary and click `Print Report` to view the formatted medical certificate.
7. **Settings**: Adjust the Due Soon threshold, toggle Dark/Light mode, or reset demo data.

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── common/         # StatCard, DonutChart, StatusBadge, Modal, ConfirmDialog, Avatar
│   ├── dashboard/      # DashboardView with KPIs, Upcoming queue, Recent patients
│   ├── patients/       # PatientsView, PatientFormModal, PatientDetailModal
│   ├── vaccinations/   # VaccinationsView, MarkCompletedModal
│   ├── reminders/      # RemindersView with Overdue / Due Soon alert queues
│   ├── firstAid/       # FirstAidView with offline search and step-by-step guides
│   ├── reports/        # ReportsView with printable Immunization Certificate
│   ├── settings/       # SettingsView with threshold slider & demo data controls
│   └── layout/         # Sidebar, Header, MobileNav, ToastContainer
├── context/
│   └── AppContext.tsx  # Central state management & reactive statistics
├── data/
│   ├── vaccineSchedule.ts # WHO/EPI standard vaccine definitions
│   ├── firstAidData.ts    # Comprehensive offline emergency protocols
│   └── demoData.ts        # Sample realistic patients for live presentation
├── utils/
│   ├── dateUtils.ts        # Age calculations, countdowns, date formatting
│   ├── vaccinationUtils.ts # Schedule generation & reactive status calculators
│   └── storage.ts          # LocalStorage persistence & JSON import/export
├── types/
│   └── index.ts        # TypeScript definitions
├── App.tsx             # Main application layout
├── main.tsx            # Entry point
└── index.css           # Tailwind CSS & Print styles
```

---

## ⚠️ Medical Disclaimer

> *Vaccination schedules and first-aid protocols shown in this student MVP demonstration are sample reference data and should be verified with a qualified healthcare professional and local immunization guidelines. This application is for demonstration and tracking convenience only and does not replace professional medical advice, diagnosis, or emergency medical services.*
