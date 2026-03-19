import { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Plus,
  Coffee,
  CloudRain,
  BookOpen,
  TreePine,
  Waves,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useTimerStore } from '@/stores/timerStore';
import { formatSeconds, formatHoursMinutes } from '@/utils/formatTime';

const iconMap: Record<string, React.ElementType> = {
  CloudRain,
  Coffee,
  BookOpen,
  TreePine,
  Waves,
  Flame,
};

export function TimerPage() {
  const {
    isRunning,
    isPaused,
    elapsed,
    subject,
    category,
    sessions,
    restTimerActive,
    restElapsed,
    maxFocusTime,
    maxStudyWithoutBreak,
    whiteNoiseTracks,
    activeTrackId,
    whiteNoiseVolume,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    tick,
    startRestTimer,
    stopRestTimer,
    tickRest,
    addManualEntry,
    setWhiteNoiseTrack,
    setWhiteNoiseVolume,
  } = useTimerStore();

  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualSubject, setManualSubject] = useState('');
  const [manualCategory, setManualCategory] = useState('General');
  const [manualHours, setManualHours] = useState('0');
  const [manualMinutes, setManualMinutes] = useState('30');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualNotes, setManualNotes] = useState('');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused, tick]);

  useEffect(() => {
    if (restTimerActive) {
      restIntervalRef.current = setInterval(tickRest, 1000);
    } else if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
    }
    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [restTimerActive, tickRest]);

  const handleStart = () => {
    if (!newSubject.trim()) return;
    startTimer(newSubject, newCategory);
  };

  const handleStop = async () => {
    await stopTimer();
  };

  const handleManualEntry = async () => {
    const duration = parseInt(manualHours) * 3600 + parseInt(manualMinutes) * 60;
    if (duration <= 0 || !manualSubject.trim()) return;
    await addManualEntry({
      user_id: '',
      subject: manualSubject,
      category: manualCategory,
      start_time: new Date(`${manualDate}T09:00:00`).toISOString(),
      end_time: new Date(`${manualDate}T09:00:00`).toISOString(),
      duration,
      notes: manualNotes,
    });
    setShowManualEntry(false);
    setManualSubject('');
    setManualHours('0');
    setManualMinutes('30');
    setManualNotes('');
  };

  const categories = ['General', 'Mathematics', 'Science', 'Computer Science', 'Languages', 'History', 'Literature', 'Other'];

  const todaySessions = sessions.filter((s) => s.start_time.startsWith(new Date().toISOString().split('T')[0]));
  const todayTotal = todaySessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Study Timer</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Focus, track, and improve</p>
        </div>
        <button
          onClick={() => setShowManualEntry(!showManualEntry)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <Plus size={18} />
          Manual Entry
        </button>
      </div>

      {/* Main Timer */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
        {/* Timer Display */}
        <div className="mb-8">
          <div className="text-7xl font-mono font-bold text-zinc-900 dark:text-zinc-100 tracking-wider">
            {formatSeconds(elapsed)}
          </div>
          {isRunning && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Studying: <span className="text-violet-600 dark:text-violet-400 font-medium">{subject}</span>
              {' '}&middot; {category}
            </p>
          )}
        </div>

        {/* Controls */}
        {!isRunning ? (
          <div className="space-y-4">
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="What are you studying?"
                className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleStart}
              disabled={!newSubject.trim()}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-medium text-lg hover:from-violet-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"
            >
              <Play size={24} />
              Start Studying
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={isPaused ? resumeTimer : pauseTimer}
              className="p-4 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
            >
              {isPaused ? <Play size={28} /> : <Pause size={28} />}
            </button>
            <button
              onClick={handleStop}
              className="p-4 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <Square size={28} />
            </button>
          </div>
        )}
      </div>

      {/* Rest Timer */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Coffee size={20} className="text-amber-500" />
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Rest Timer</h3>
              <p className="text-sm text-zinc-500">Track your breaks automatically</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {restTimerActive && (
              <span className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400">
                {formatSeconds(restElapsed)}
              </span>
            )}
            <button
              onClick={restTimerActive ? stopRestTimer : startRestTimer}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                restTimerActive
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {restTimerActive ? (
                <span className="flex items-center gap-2"><Square size={16} /> Stop Break</span>
              ) : (
                <span className="flex items-center gap-2"><RotateCcw size={16} /> Start Break</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* White Noise */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">Ambient Sounds</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
          {whiteNoiseTracks.map((track) => {
            const Icon = iconMap[track.icon] || Volume2;
            const isActive = activeTrackId === track.id;
            return (
              <button
                key={track.id}
                onClick={() => setWhiteNoiseTrack(isActive ? null : track.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs font-medium">{track.name}</span>
              </button>
            );
          })}
        </div>
        {activeTrackId && (
          <div className="flex items-center gap-3">
            <VolumeX size={16} className="text-zinc-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={whiteNoiseVolume}
              onChange={(e) => setWhiteNoiseVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none bg-zinc-200 dark:bg-zinc-700 accent-violet-500"
            />
            <Volume2 size={16} className="text-zinc-400" />
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{formatHoursMinutes(todayTotal)}</p>
          <p className="text-sm text-zinc-500 mt-1">Today's Total</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{formatHoursMinutes(maxFocusTime)}</p>
          <p className="text-sm text-zinc-500 mt-1">Max Focus</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 text-center">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{formatHoursMinutes(maxStudyWithoutBreak)}</p>
          <p className="text-sm text-zinc-500 mt-1">Max Without Break</p>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showManualEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Add Manual Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={manualSubject}
                  onChange={(e) => setManualSubject(e.target.value)}
                  placeholder="What did you study?"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Date</label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={manualHours}
                    onChange={(e) => setManualHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={manualMinutes}
                    onChange={(e) => setManualMinutes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Notes</label>
                <textarea
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Optional notes..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowManualEntry(false)}
                  className="flex-1 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualEntry}
                  disabled={!manualSubject.trim()}
                  className="flex-1 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Sessions */}
      {todaySessions.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">Today's Sessions</h3>
          <div className="space-y-2">
            {todaySessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {session.subject}
                    {session.is_manual && <span className="ml-2 text-xs text-zinc-400">(manual)</span>}
                  </p>
                  <p className="text-xs text-zinc-500">{session.category}</p>
                </div>
                <p className="text-sm font-mono font-medium text-violet-600 dark:text-violet-400">
                  {formatHoursMinutes(session.duration)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
