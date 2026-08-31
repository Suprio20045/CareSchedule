<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { exportBackupJSON, importBackupJSON } from '../../utils/storage';
import { signOut } from '../../utils/auth';
import { auth } from '../../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
=======
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { exportBackupJSON, importBackupJSON } from '../../utils/storage';
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Laptop, 
  Clock, 
  Bell, 
  Volume2, 
  Database, 
  RotateCcw, 
  Trash2, 
  Download, 
  Upload, 
  ShieldCheck, 
  Info, 
  Check,
  Building,
<<<<<<< HEAD
  User,
  LogOut
=======
  User
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetToDemo, clearAll, addToast } = useApp();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
<<<<<<< HEAD
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false);
  const [userName, setUserName] = useState(settings.userName);
  const [clinicName, setClinicName] = useState(settings.clinicName);
  const [role, setRole] = useState(settings.role);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);

  useEffect(() => {
    // Keep the signed-in account's email in view so the Account card can
    // show who is currently logged in.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentEmail(user?.email ?? null);
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      addToast({
        type: 'info',
        title: 'Signed Out',
        message: 'You have been signed out of CareSchedule.'
      });
    } catch (error) {
      console.error('Error signing out:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to sign out. Please try again.'
      });
    }
  };
=======
  const [userName, setUserName] = useState(settings.userName);
  const [clinicName, setClinicName] = useState(settings.clinicName);
  const [role, setRole] = useState(settings.role);
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      userName: userName.trim() || 'Suprio',
      clinicName: clinicName.trim() || 'CareSchedule Health Center',
      role: role.trim() || 'Administrator'
    });
  };

  const handleExportBackup = () => {
    const jsonString = exportBackupJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareSchedule_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Backup Downloaded',
      message: 'Complete patient and vaccination records exported as JSON.'
    });
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importBackupJSON(content);
        if (result.success) {
          window.location.reload();
        } else {
          addToast({
            type: 'error',
            title: 'Import Failed',
            message: result.message
          });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Top Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure application parameters, appearance, and local demo data management.
        </p>
      </div>

      {/* Profile & Clinic Configuration Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <Building className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
            Clinic & Operator Profile
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinician / Admin Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Title / Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Administrator, Pediatric Nurse"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinic / Health Facility Name
              </label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

<<<<<<< HEAD
      {/* Account Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
            Account
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {currentEmail || 'Unknown user'}
            </p>
          </div>

          <button
            onClick={() => setConfirmSignOutOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-extrabold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

=======
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f
      {/* Appearance & Schedule Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Appearance Mode */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <Sun className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Appearance Theme
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select light or dark interface theme for clinic lighting conditions.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Laptop },
            ].map((theme) => {
              const Icon = theme.icon;
              const isSelected = settings.theme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => updateSettings({ theme: theme.id as any })}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1.5" />
                  <span>{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Due Soon Threshold */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Due Soon Alert Window
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Vaccines scheduled within this number of days will be flagged as <strong>"Due Soon"</strong>.
          </p>

          <div className="flex items-center gap-3">
            {[3, 7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => updateSettings({ dueSoonThresholdDays: days })}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                  settings.dueSoonThresholdDays === days
                    ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo & Data Management Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Demo Data & Local Storage
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Easily populate, backup, or reset data during live presentations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Reset to Demo Data */}
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800/60 text-teal-800 dark:text-teal-300 text-center transition-colors cursor-pointer"
          >
            <RotateCcw className="w-6 h-6 mb-2 text-teal-600" />
            <span className="text-xs font-extrabold">Reset Demo Data</span>
            <span className="text-[10px] opacity-75 mt-0.5">Load sample patients</span>
          </button>

          {/* Export Backup JSON */}
          <button
            onClick={handleExportBackup}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-center transition-colors cursor-pointer"
          >
            <Download className="w-6 h-6 mb-2 text-slate-600 dark:text-slate-300" />
            <span className="text-xs font-extrabold">Export Backup</span>
            <span className="text-[10px] opacity-75 mt-0.5">Save as JSON file</span>
          </button>

          {/* Import Backup JSON */}
          <label className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-center transition-colors cursor-pointer">
            <Upload className="w-6 h-6 mb-2 text-slate-600 dark:text-slate-300" />
            <span className="text-xs font-extrabold">Import Backup</span>
            <span className="text-[10px] opacity-75 mt-0.5">Restore from JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          {/* Clear All Data */}
          <button
            onClick={() => setConfirmClearOpen(true)}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 text-center transition-colors cursor-pointer"
          >
            <Trash2 className="w-6 h-6 mb-2 text-rose-600" />
            <span className="text-xs font-extrabold">Clear Database</span>
            <span className="text-[10px] opacity-75 mt-0.5">Wipe all local data</span>
          </button>
        </div>
      </div>

      {/* Student Project & System Architecture Details */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/30 dark:from-slate-800/60 dark:to-teal-950/20 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            CareSchedule Architecture Notes
          </h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          CareSchedule is designed with an <strong>Offline-First architecture</strong> using browser local storage and client-side reactive computation. All demographic data and immunization timestamps remain 100% private to the client device, requiring zero external server dependencies, cloud accounts, or internet bandwidth during emergency first aid lookups.
        </p>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={resetToDemo}
        title="Reset to Sample Demo Data"
        message="This will reload the initial demo patients (Rahim Ahmed, Ayesha Khan, etc.) with varied completed, due soon, and overdue vaccination statuses for presentation."
        confirmText="Reset to Demo"
        variant="primary"
      />

      <ConfirmDialog
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={clearAll}
        title="Clear All Local Data"
        message="Are you sure you want to completely erase all local patients and records? You will start with an empty database."
        confirmText="Clear All Data"
        variant="danger"
      />
<<<<<<< HEAD

      <ConfirmDialog
        isOpen={confirmSignOutOpen}
        onClose={() => setConfirmSignOutOpen(false)}
        onConfirm={handleSignOut}
        title="Sign Out"
        message="Are you sure you want to sign out of CareSchedule?"
        confirmText="Sign Out"
        variant="danger"
      />
=======
>>>>>>> d41ad45b5bbb319b58c52aadf5729ef5f013323f
    </div>
  );
};
