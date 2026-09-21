import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from './utils/firebase';
import AuthView from './components/auth/AuthView';
import { AppProvider, useApp } from './context/AppContext';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/layout/ToastContainer';

import { DashboardView } from './components/dashboard/DashboardView';
import { PatientsView } from './components/patients/PatientsView';
import { VaccinationsView } from './components/vaccinations/VaccinationsView';
import { RemindersView } from './components/reminders/RemindersView';
import { FirstAidView } from './components/firstAid/FirstAidView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

import { PatientFormModal } from './components/patients/PatientFormModal';

function AuthenticatedApp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading CareSchedule...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const AppContent: React.FC = () => {
  const { currentTab, addPatient } = useApp();
  const [isGlobalAddPatientOpen, setIsGlobalAddPatientOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenAddPatient={() => setIsGlobalAddPatientOpen(true)}
          />
        );

      case 'patients':
        return (
          <PatientsView
            isAddModalOpen={isGlobalAddPatientOpen}
            setIsAddModalOpen={setIsGlobalAddPatientOpen}
          />
        );

      case 'vaccinations':
        return (
          <VaccinationsView
            onOpenAddPatient={() => setIsGlobalAddPatientOpen(true)}
          />
        );

      case 'reminders':
        return <RemindersView />;

      case 'firstAid':
        return <FirstAidView />;

      case 'reports':
        return <ReportsView />;

      case 'settings':
        return <SettingsView />;

      default:
        return (
          <DashboardView
            onOpenAddPatient={() => setIsGlobalAddPatientOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      <MobileNav onOpenAddPatient={() => setIsGlobalAddPatientOpen(true)} />

      <PatientFormModal
        isOpen={isGlobalAddPatientOpen && currentTab !== 'patients'}
        onClose={() => setIsGlobalAddPatientOpen(false)}
        onSubmit={addPatient}
        mode="add"
      />

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return <AuthenticatedApp />;
}