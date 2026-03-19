import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Sun,
  Moon,
  Monitor,
  Wifi,
  WifiOff,
  Database,
} from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';

export function SettingsPage() {
  const { mode, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [isOnline] = useState(navigator.onLine);

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data & Sync', icon: Database },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === 'profile' && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Profile</h2>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.display_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{user?.display_name || 'User'}</p>
                  <p className="text-sm text-zinc-500">{user?.email || 'email@example.com'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Display Name</label>
                  <input
                    type="text"
                    defaultValue={user?.display_name || ''}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <button className="px-4 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Appearance</h2>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => { if (mode !== 'light') toggleTheme(); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      mode === 'light'
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <Sun size={24} className={mode === 'light' ? 'text-violet-600' : 'text-zinc-400'} />
                    <span className={`text-sm font-medium ${mode === 'light' ? 'text-violet-700' : 'text-zinc-500'}`}>Light</span>
                  </button>
                  <button
                    onClick={() => { if (mode !== 'dark') toggleTheme(); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      mode === 'dark'
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <Moon size={24} className={mode === 'dark' ? 'text-violet-400' : 'text-zinc-400'} />
                    <span className={`text-sm font-medium ${mode === 'dark' ? 'text-violet-300' : 'text-zinc-500'}`}>Dark</span>
                  </button>
                  <button
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
                  >
                    <Monitor size={24} className="text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-500">System</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Notifications</h2>
              {[
                { label: 'Study reminders', desc: 'Get reminded to start studying' },
                { label: 'Group messages', desc: 'Notifications for new group chat messages' },
                { label: 'Challenge updates', desc: 'Updates on challenge progress' },
                { label: 'Leaderboard changes', desc: 'When your ranking changes' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.label}</p>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-zinc-200 dark:bg-zinc-700 peer-checked:bg-violet-600 rounded-full peer-focus:ring-2 peer-focus:ring-violet-500/50 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Privacy</h2>
              {[
                { label: 'Show online status', desc: 'Let others see when you\'re online' },
                { label: 'Show study stats', desc: 'Make your study stats visible to group members' },
                { label: 'Allow direct messages', desc: 'Let other users send you direct messages' },
                { label: 'Show on global leaderboard', desc: 'Appear in the community ranking' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.label}</p>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-zinc-200 dark:bg-zinc-700 peer-checked:bg-violet-600 rounded-full peer-focus:ring-2 peer-focus:ring-violet-500/50 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'data' && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Data & Sync</h2>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                {isOnline ? (
                  <Wifi size={20} className="text-emerald-500" />
                ) : (
                  <WifiOff size={20} className="text-red-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {isOnline ? 'Connected' : 'Offline'}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {isOnline ? 'All data is syncing in real-time' : 'Changes will sync when online'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <div className="text-left">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Force Sync</p>
                    <p className="text-xs text-zinc-500">Manually sync all pending data</p>
                  </div>
                  <Database size={18} className="text-zinc-400" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <div className="text-left">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Export Data</p>
                    <p className="text-xs text-zinc-500">Download all your study data</p>
                  </div>
                  <Settings size={18} className="text-zinc-400" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">Clear Local Data</p>
                    <p className="text-xs text-zinc-500">Remove all offline cached data</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
