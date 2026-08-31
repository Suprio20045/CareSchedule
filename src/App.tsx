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
    // Firebase is now the source of truth for auth. onAuthStateChanged fires
    // once on mount with the current user (or null) and again on every
    // sign-in/sign-out, so we don't need a separate "check current session"
    // call the way the old Supabase-auth version did.
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

  // Not logged in
  if (!user) {
    return <AuthView />;
  }

  // Logged in
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
const AppContent: React.FC = () => {
  const { currentTab, addPatient } = useApp();

  const [isGlobalAddPatientOpen, setIsGlobalAddPatientOpen] =
    useState(false);

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.16),transparent_32%),linear-gradient(135deg,#f8fafc_0%,#eef4ff_45%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.2),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.15),transparent_32%),linear-gradient(135deg,#020817_0%,#0f172a_30%,#020817_100%)] text-slate-900 dark:text-slate-100 transition-colors">
      <div className="mx-auto flex min-h-screen max-w-[1800px] flex-col md:flex-row md:gap-6 md:p-4">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-4">
          <div className="overflow-hidden rounded-none border-0 bg-transparent md:rounded-[28px] md:border md:border-white/60 md:bg-white/60 md:shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)] md:backdrop-blur-xl dark:md:border-slate-800/80 dark:md:bg-slate-900/60">
            <Header />

            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              {renderActiveView()}
            </main>
          </div>
        </div>

        <MobileNav
          onOpenAddPatient={() => setIsGlobalAddPatientOpen(true)}
        />

        <PatientFormModal
          isOpen={
            isGlobalAddPatientOpen &&
            currentTab !== 'patients'
          }
          onClose={() => setIsGlobalAddPatientOpen(false)}
          onSubmit={addPatient}
          mode="add"
        />

        <ToastContainer />
      </div>
    </div>
  );
};

export default function App() {
  return <AuthenticatedApp />;
}