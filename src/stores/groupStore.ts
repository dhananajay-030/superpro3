import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Group, GroupMember, ChatMessage, Challenge, Attendance, LeaderboardEntry } from '@/types';

interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  members: GroupMember[];
  messages: ChatMessage[];
  challenges: Challenge[];
  attendance: Attendance[];
  leaderboard: LeaderboardEntry[];
  loading: boolean;

  loadGroups: () => Promise<void>;
  createGroup: (group: Omit<Group, 'id' | 'created_at' | 'updated_at' | 'member_count'>) => Promise<Group>;
  joinGroup: () => Promise<{ error: string | null }>;
  leaveGroup: (groupId: string) => Promise<void>;
  setCurrentGroup: (group: Group | null) => void;
  loadMessages: (groupId: string) => Promise<void>;
  sendMessage: (groupId: string, content: string, imageUrl?: string, replyToId?: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  loadLeaderboard: () => Promise<void>;
  createChallenge: (challenge: Omit<Challenge, 'id' | 'created_at' | 'participants'>) => Promise<void>;
  checkIn: (groupId: string, photoUrl?: string) => Promise<void>;
  promoteMember: (groupId: string, userId: string, role: 'admin' | 'member') => Promise<void>;
  muteMember: (groupId: string, userId: string, until: string | null) => Promise<void>;
  kickMember: (groupId: string, userId: string) => Promise<void>;
  lockChat: () => Promise<void>;
}

// Demo data for development
const demoGroups: Group[] = [
  {
    id: '1',
    name: 'CS Study Group',
    description: 'Computer Science students helping each other',
    icon_url: null,
    created_by: 'demo',
    max_members: 50,
    is_private: false,
    password_hash: null,
    invite_code: 'CS2024',
    goal: 'Ace our finals together',
    penalty_rules: [],
    attendance_photo_required: false,
    photo_retention_hours: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    member_count: 12,
  },
  {
    id: '2',
    name: 'Math Masters',
    description: 'Advanced mathematics study group',
    icon_url: null,
    created_by: 'demo',
    max_members: 30,
    is_private: true,
    password_hash: null,
    invite_code: null,
    goal: 'Master calculus and linear algebra',
    penalty_rules: [],
    attendance_photo_required: true,
    photo_retention_hours: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    member_count: 8,
  },
];

export const useGroupStore = create<GroupState>()((set, get) => ({
  groups: demoGroups,
  currentGroup: null,
  members: [],
  messages: [],
  challenges: [],
  attendance: [],
  leaderboard: [],
  loading: false,

  loadGroups: async () => {
    set({ loading: true });
    // In production, fetch from Supabase
    set({ groups: demoGroups, loading: false });
  },

  createGroup: async (groupData) => {
    const group: Group = {
      ...groupData,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      member_count: 1,
    };
    set((state) => ({ groups: [...state.groups, group] }));
    return group;
  },

  joinGroup: async () => {
    return { error: null };
  },

  leaveGroup: async (groupId: string) => {
    set((state) => ({ groups: state.groups.filter((g) => g.id !== groupId) }));
  },

  setCurrentGroup: (group: Group | null) => {
    set({ currentGroup: group });
  },

  loadMessages: async (_groupId: string) => {
    // Demo messages
    const demoMessages: ChatMessage[] = [
      {
        id: '1',
        group_id: _groupId,
        sender_id: 'user1',
        receiver_id: null,
        content: 'Hey everyone! Ready for today\'s study session?',
        image_url: null,
        reply_to_id: null,
        reactions: [{ emoji: '👍', user_ids: ['user2', 'user3'] }],
        is_edited: false,
        is_deleted: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
        is_draft: false,
        is_synced: true,
        sender: { id: 'user1', email: 'alice@test.com', display_name: 'Alice', avatar_url: null, created_at: '', updated_at: '', is_online: true, last_seen: null, total_study_time: 0, max_focus_time: 0, max_study_without_break: 0 },
      },
      {
        id: '2',
        group_id: _groupId,
        sender_id: 'user2',
        receiver_id: null,
        content: 'Yes! I\'ve been reviewing Chapter 5. Anyone want to go over the practice problems?',
        image_url: null,
        reply_to_id: null,
        reactions: [],
        is_edited: false,
        is_deleted: false,
        created_at: new Date(Date.now() - 3000000).toISOString(),
        updated_at: new Date(Date.now() - 3000000).toISOString(),
        is_draft: false,
        is_synced: true,
        sender: { id: 'user2', email: 'bob@test.com', display_name: 'Bob', avatar_url: null, created_at: '', updated_at: '', is_online: true, last_seen: null, total_study_time: 0, max_focus_time: 0, max_study_without_break: 0 },
      },
    ];
    set({ messages: demoMessages });
  },

  sendMessage: async (groupId: string, content: string, imageUrl?: string, replyToId?: string) => {
    const message: ChatMessage = {
      id: uuidv4(),
      group_id: groupId,
      sender_id: 'current_user',
      receiver_id: null,
      content,
      image_url: imageUrl || null,
      reply_to_id: replyToId || null,
      reactions: [],
      is_edited: false,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_draft: false,
      is_synced: navigator.onLine,
      sender: { id: 'current_user', email: '', display_name: 'You', avatar_url: null, created_at: '', updated_at: '', is_online: true, last_seen: null, total_study_time: 0, max_focus_time: 0, max_study_without_break: 0 },
    };
    set((state) => ({ messages: [...state.messages, message] }));
  },

  editMessage: async (messageId: string, content: string) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, content, is_edited: true, updated_at: new Date().toISOString() } : m
      ),
    }));
  },

  deleteMessage: async (messageId: string) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, is_deleted: true, content: 'Message deleted' } : m
      ),
    }));
  },

  addReaction: (messageId: string, emoji: string, userId: string) => {
    set((state) => ({
      messages: state.messages.map((m) => {
        if (m.id !== messageId) return m;
        const existingReaction = m.reactions.find((r) => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.user_ids.includes(userId)) {
            return {
              ...m,
              reactions: m.reactions.map((r) =>
                r.emoji === emoji ? { ...r, user_ids: r.user_ids.filter((id) => id !== userId) } : r
              ).filter((r) => r.user_ids.length > 0),
            };
          }
          return {
            ...m,
            reactions: m.reactions.map((r) =>
              r.emoji === emoji ? { ...r, user_ids: [...r.user_ids, userId] } : r
            ),
          };
        }
        return { ...m, reactions: [...m.reactions, { emoji, user_ids: [userId] }] };
      }),
    }));
  },

  loadLeaderboard: async () => {
    const demoLeaderboard: LeaderboardEntry[] = [
      { user_id: '1', display_name: 'Alice', avatar_url: null, total_time: 14400, rank: 1, change: 0 },
      { user_id: '2', display_name: 'Bob', avatar_url: null, total_time: 12600, rank: 2, change: 1 },
      { user_id: '3', display_name: 'Charlie', avatar_url: null, total_time: 10800, rank: 3, change: -1 },
      { user_id: '4', display_name: 'Diana', avatar_url: null, total_time: 9000, rank: 4, change: 2 },
      { user_id: '5', display_name: 'Eve', avatar_url: null, total_time: 7200, rank: 5, change: 0 },
    ];
    set({ leaderboard: demoLeaderboard });
  },

  createChallenge: async (challengeData) => {
    const challenge: Challenge = {
      ...challengeData,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      participants: [],
    };
    set((state) => ({ challenges: [...state.challenges, challenge] }));
  },

  checkIn: async (_groupId: string, _photoUrl?: string) => {
    const record: Attendance = {
      id: uuidv4(),
      group_id: _groupId,
      user_id: 'current_user',
      date: new Date().toISOString().split('T')[0],
      photo_url: _photoUrl || null,
      checked_in_at: new Date().toISOString(),
      is_verified: !_photoUrl,
    };
    set((state) => ({ attendance: [...state.attendance, record] }));
  },

  promoteMember: async (_groupId: string, userId: string, role: 'admin' | 'member') => {
    set((state) => ({
      members: state.members.map((m) =>
        m.user_id === userId ? { ...m, role } : m
      ),
    }));
  },

  muteMember: async (_groupId: string, userId: string, until: string | null) => {
    set((state) => ({
      members: state.members.map((m) =>
        m.user_id === userId ? { ...m, is_muted: !!until, muted_until: until } : m
      ),
    }));
  },

  kickMember: async (_groupId: string, userId: string) => {
    set((state) => ({
      members: state.members.filter((m) => m.user_id !== userId),
    }));
  },

  lockChat: async () => {
    // Toggle chat lock for group
    const { currentGroup } = get();
    if (currentGroup) {
      set({ currentGroup: { ...currentGroup } });
    }
  },
}));
