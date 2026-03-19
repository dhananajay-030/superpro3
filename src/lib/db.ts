import Dexie, { type Table } from 'dexie';
import type { StudySession, ChatMessage, PlannerTask } from '@/types';

export class SuperProDB extends Dexie {
  studySessions!: Table<StudySession>;
  chatDrafts!: Table<ChatMessage>;
  plannerTasks!: Table<PlannerTask>;
  syncQueue!: Table<{ id?: number; table: string; action: string; data: string; created_at: string }>;

  constructor() {
    super('superproDB');
    this.version(1).stores({
      studySessions: 'id, user_id, subject, category, start_time, is_synced',
      chatDrafts: 'id, group_id, sender_id, is_draft, is_synced',
      plannerTasks: 'id, user_id, scheduled_date, is_completed, is_synced',
      syncQueue: '++id, table, action, created_at',
    });
  }
}

export const db = new SuperProDB();

export async function addToSyncQueue(table: string, action: string, data: Record<string, unknown>) {
  await db.syncQueue.add({
    table,
    action,
    data: JSON.stringify(data),
    created_at: new Date().toISOString(),
  });
}

export async function processSyncQueue() {
  const items = await db.syncQueue.toArray();
  for (const item of items) {
    try {
      // In a real implementation, this would call Supabase
      console.log(`Syncing: ${item.table} - ${item.action}`, JSON.parse(item.data));
      if (item.id !== undefined) {
        await db.syncQueue.delete(item.id);
      }
    } catch (error) {
      console.error('Sync failed for item:', item, error);
    }
  }
}

// Listen for online events to trigger sync
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    processSyncQueue();
  });
}
