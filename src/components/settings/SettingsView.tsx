import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { exportBackupJSON, importBackupJSON } from '../../utils/storage';
import { signOut } from '../../utils/auth';
import { auth } from '../../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
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
  User,
  LogOut
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetToDemo, clearAll, addToast } = useApp();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
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

    </div>
  );
};
