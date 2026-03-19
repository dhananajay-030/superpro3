import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { db, addToSyncQueue } from '@/lib/db';
import type { StudySession, WhiteNoiseTrack } from '@/types';

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  elapsed: number; // seconds
  subject: string;
  category: string;
  currentSessionId: string | null;
  sessions: StudySession[];
  restTimerActive: boolean;
  restElapsed: number;
  maxFocusTime: number;
  maxStudyWithoutBreak: number;
  whiteNoiseTracks: WhiteNoiseTrack[];
  activeTrackId: string | null;
  whiteNoiseVolume: number;

  startTimer: (subject: string, category: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => Promise<StudySession>;
  addManualEntry: (entry: Omit<StudySession, 'id' | 'is_manual' | 'is_synced' | 'created_at'>) => Promise<void>;
  tick: () => void;
  startRestTimer: () => void;
  stopRestTimer: () => void;
  tickRest: () => void;
  setWhiteNoiseTrack: (trackId: string | null) => void;
  setWhiteNoiseVolume: (volume: number) => void;
  loadSessions: () => Promise<void>;
}

const defaultWhiteNoiseTracks: WhiteNoiseTrack[] = [
  { id: 'rain', name: 'Rain', icon: 'CloudRain', url: '', is_downloaded: false },
  { id: 'cafe', name: 'Cafe', icon: 'Coffee', url: '', is_downloaded: false },
  { id: 'library', name: 'Library', icon: 'BookOpen', url: '', is_downloaded: false },
  { id: 'forest', name: 'Forest', icon: 'TreePine', url: '', is_downloaded: false },
  { id: 'ocean', name: 'Ocean Waves', icon: 'Waves', url: '', is_downloaded: false },
  { id: 'fireplace', name: 'Fireplace', icon: 'Flame', url: '', is_downloaded: false },
];

export const useTimerStore = create<TimerState>()((set, get) => ({
  isRunning: false,
  isPaused: false,
  elapsed: 0,
  subject: '',
  category: '',
  currentSessionId: null,
  sessions: [],
  restTimerActive: false,
  restElapsed: 0,
  maxFocusTime: 0,
  maxStudyWithoutBreak: 0,
  whiteNoiseTracks: defaultWhiteNoiseTracks,
  activeTrackId: null,
  whiteNoiseVolume: 0.5,

  startTimer: (subject: string, category: string) => {
    const sessionId = uuidv4();
    set({
      isRunning: true,
      isPaused: false,
      elapsed: 0,
      subject,
      category,
      currentSessionId: sessionId,
    });
  },

  pauseTimer: () => {
    set({ isPaused: true });
  },

  resumeTimer: () => {
    set({ isPaused: false });
  },

  stopTimer: async () => {
    const { elapsed, subject, category, currentSessionId, maxFocusTime, maxStudyWithoutBreak } = get();
    const session: StudySession = {
      id: currentSessionId || uuidv4(),
      user_id: '',
      subject,
      category,
      start_time: new Date(Date.now() - elapsed * 1000).toISOString(),
      end_time: new Date().toISOString(),
      duration: elapsed,
      is_manual: false,
      is_synced: false,
      created_at: new Date().toISOString(),
      notes: '',
    };

    await db.studySessions.add(session);
    await addToSyncQueue('study_sessions', 'insert', session as unknown as Record<string, unknown>);

    const newMaxFocus = Math.max(maxFocusTime, elapsed);
    const newMaxStudy = Math.max(maxStudyWithoutBreak, elapsed);

    set((state) => ({
      isRunning: false,
      isPaused: false,
      elapsed: 0,
      subject: '',
      category: '',
      currentSessionId: null,
      sessions: [...state.sessions, session],
      maxFocusTime: newMaxFocus,
      maxStudyWithoutBreak: newMaxStudy,
    }));

    return session;
  },

  addManualEntry: async (entry) => {
    const session: StudySession = {
      ...entry,
      id: uuidv4(),
      is_manual: true,
      is_synced: false,
      created_at: new Date().toISOString(),
    };
    await db.studySessions.add(session);
    await addToSyncQueue('study_sessions', 'insert', session as unknown as Record<string, unknown>);
    set((state) => ({ sessions: [...state.sessions, session] }));
  },

  tick: () => {
    const { isRunning, isPaused } = get();
    if (isRunning && !isPaused) {
      set((state) => ({ elapsed: state.elapsed + 1 }));
    }
  },

  startRestTimer: () => {
    set({ restTimerActive: true, restElapsed: 0 });
  },

  stopRestTimer: () => {
    set({ restTimerActive: false, restElapsed: 0 });
  },

  tickRest: () => {
    const { restTimerActive } = get();
    if (restTimerActive) {
      set((state) => ({ restElapsed: state.restElapsed + 1 }));
    }
  },

  setWhiteNoiseTrack: (trackId: string | null) => {
    set({ activeTrackId: trackId });
  },

  setWhiteNoiseVolume: (volume: number) => {
    set({ whiteNoiseVolume: volume });
  },

  loadSessions: async () => {
    const sessions = await db.studySessions.toArray();
    set({ sessions });
  },
}));
