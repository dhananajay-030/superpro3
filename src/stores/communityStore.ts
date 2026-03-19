import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { CommunityPost, LeaderboardEntry } from '@/types';

interface CommunityState {
  posts: CommunityPost[];
  globalLeaderboard: LeaderboardEntry[];
  loading: boolean;

  loadPosts: () => Promise<void>;
  createPost: (content: string, imageUrl?: string) => Promise<void>;
  likePost: (postId: string) => void;
  loadGlobalLeaderboard: () => Promise<void>;
}

const demoPosts: CommunityPost[] = [
  {
    id: '1',
    user_id: 'user1',
    content: 'Just finished a 4-hour study marathon on quantum mechanics! Feeling accomplished.',
    image_url: null,
    likes: 24,
    comments_count: 5,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    user: { id: 'user1', email: '', display_name: 'Alice Chen', avatar_url: null, created_at: '', updated_at: '', is_online: true, last_seen: null, total_study_time: 50400, max_focus_time: 14400, max_study_without_break: 7200 },
  },
  {
    id: '2',
    user_id: 'user2',
    content: 'Study tip: The Pomodoro technique really works! Try 25 min focus + 5 min break cycles.',
    image_url: null,
    likes: 42,
    comments_count: 12,
    created_at: new Date(Date.now() - 14400000).toISOString(),
    user: { id: 'user2', email: '', display_name: 'Bob Smith', avatar_url: null, created_at: '', updated_at: '', is_online: false, last_seen: null, total_study_time: 36000, max_focus_time: 10800, max_study_without_break: 5400 },
  },
  {
    id: '3',
    user_id: 'user3',
    content: 'My study setup for today. Ready to conquer organic chemistry!',
    image_url: null,
    likes: 18,
    comments_count: 3,
    created_at: new Date(Date.now() - 28800000).toISOString(),
    user: { id: 'user3', email: '', display_name: 'Carol Davis', avatar_url: null, created_at: '', updated_at: '', is_online: true, last_seen: null, total_study_time: 43200, max_focus_time: 12600, max_study_without_break: 6300 },
  },
];

const demoGlobalLeaderboard: LeaderboardEntry[] = [
  { user_id: '1', display_name: 'Alice Chen', avatar_url: null, total_time: 50400, rank: 1, change: 0 },
  { user_id: '3', display_name: 'Carol Davis', avatar_url: null, total_time: 43200, rank: 2, change: 2 },
  { user_id: '2', display_name: 'Bob Smith', avatar_url: null, total_time: 36000, rank: 3, change: -1 },
  { user_id: '4', display_name: 'David Lee', avatar_url: null, total_time: 28800, rank: 4, change: -1 },
  { user_id: '5', display_name: 'Eve Wilson', avatar_url: null, total_time: 25200, rank: 5, change: 1 },
  { user_id: '6', display_name: 'Frank Brown', avatar_url: null, total_time: 21600, rank: 6, change: 0 },
  { user_id: '7', display_name: 'Grace Kim', avatar_url: null, total_time: 18000, rank: 7, change: 3 },
  { user_id: '8', display_name: 'Henry Wang', avatar_url: null, total_time: 14400, rank: 8, change: -1 },
  { user_id: '9', display_name: 'Ivy Zhang', avatar_url: null, total_time: 10800, rank: 9, change: -1 },
  { user_id: '10', display_name: 'Jack Taylor', avatar_url: null, total_time: 7200, rank: 10, change: -1 },
];

export const useCommunityStore = create<CommunityState>()((set) => ({
  posts: demoPosts,
  globalLeaderboard: demoGlobalLeaderboard,
  loading: false,

  loadPosts: async () => {
    set({ loading: true });
    set({ posts: demoPosts, loading: false });
  },

  createPost: async (content: string, imageUrl?: string) => {
    const post: CommunityPost = {
      id: uuidv4(),
      user_id: 'current_user',
      content,
      image_url: imageUrl || null,
      likes: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      user: { id: 'current_user', email: '', display_name: 'You', avatar_url: null, created_at: '', updated_at: '', is_online: true, last_seen: null, total_study_time: 0, max_focus_time: 0, max_study_without_break: 0 },
    };
    set((state) => ({ posts: [post, ...state.posts] }));
  },

  likePost: (postId: string) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ),
    }));
  },

  loadGlobalLeaderboard: async () => {
    set({ globalLeaderboard: demoGlobalLeaderboard });
  },
}));
