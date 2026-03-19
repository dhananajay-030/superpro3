import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { db, addToSyncQueue } from '@/lib/db';
import type { PlannerTask } from '@/types';

interface PlannerState {
  tasks: PlannerTask[];
  loading: boolean;
  selectedDate: string;

  loadTasks: (userId: string) => Promise<void>;
  addTask: (task: Omit<PlannerTask, 'id' | 'created_at' | 'is_synced' | 'is_completed' | 'completed_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<PlannerTask>) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setSelectedDate: (date: string) => void;
}

export const usePlannerStore = create<PlannerState>()((set, get) => ({
  tasks: [],
  loading: false,
  selectedDate: new Date().toISOString().split('T')[0],

  loadTasks: async (_userId: string) => {
    set({ loading: true });
    const tasks = await db.plannerTasks.toArray();
    if (tasks.length === 0) {
      // Add demo tasks
      const demoTasks: PlannerTask[] = [
        {
          id: uuidv4(),
          user_id: _userId,
          title: 'Review Data Structures',
          description: 'Go through linked lists and trees',
          subject: 'Computer Science',
          scheduled_date: new Date().toISOString().split('T')[0],
          scheduled_time: '09:00',
          duration_estimate: 60,
          is_completed: false,
          completed_at: null,
          priority: 'high',
          created_at: new Date().toISOString(),
          is_synced: true,
        },
        {
          id: uuidv4(),
          user_id: _userId,
          title: 'Practice Calculus Problems',
          description: 'Chapter 5 integration exercises',
          subject: 'Mathematics',
          scheduled_date: new Date().toISOString().split('T')[0],
          scheduled_time: '11:00',
          duration_estimate: 90,
          is_completed: false,
          completed_at: null,
          priority: 'medium',
          created_at: new Date().toISOString(),
          is_synced: true,
        },
        {
          id: uuidv4(),
          user_id: _userId,
          title: 'Read Physics Chapter 3',
          description: 'Thermodynamics fundamentals',
          subject: 'Physics',
          scheduled_date: new Date().toISOString().split('T')[0],
          scheduled_time: '14:00',
          duration_estimate: 45,
          is_completed: true,
          completed_at: new Date().toISOString(),
          priority: 'low',
          created_at: new Date().toISOString(),
          is_synced: true,
        },
      ];
      set({ tasks: demoTasks, loading: false });
    } else {
      set({ tasks, loading: false });
    }
  },

  addTask: async (taskData) => {
    const task: PlannerTask = {
      ...taskData,
      id: uuidv4(),
      is_completed: false,
      completed_at: null,
      created_at: new Date().toISOString(),
      is_synced: navigator.onLine,
    };
    await db.plannerTasks.add(task);
    if (!navigator.onLine) {
      await addToSyncQueue('planner_tasks', 'insert', task as unknown as Record<string, unknown>);
    }
    set((state) => ({ tasks: [...state.tasks, task] }));
  },

  updateTask: async (id: string, updates: Partial<PlannerTask>) => {
    await db.plannerTasks.update(id, updates);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  toggleComplete: async (id: string) => {
    const { tasks } = get();
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updates = {
      is_completed: !task.is_completed,
      completed_at: !task.is_completed ? new Date().toISOString() : null,
    };
    await db.plannerTasks.update(id, updates);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  deleteTask: async (id: string) => {
    await db.plannerTasks.delete(id);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
  },
}));
