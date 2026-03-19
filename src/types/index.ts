// ============================================================
// SuperPro - Type Definitions
// ============================================================

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_online: boolean;
  last_seen: string | null;
  total_study_time: number; // in seconds
  max_focus_time: number; // longest session without break in seconds
  max_study_without_break: number; // in seconds
}

export interface StudySession {
  id: string;
  user_id: string;
  subject: string;
  category: string;
  start_time: string;
  end_time: string | null;
  duration: number; // in seconds
  is_manual: boolean;
  is_synced: boolean;
  created_at: string;
  notes: string;
}

export interface StudyCategory {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  icon_url: string | null;
  created_by: string;
  max_members: number;
  is_private: boolean;
  password_hash: string | null;
  invite_code: string | null;
  goal: string;
  penalty_rules: PenaltyRule[];
  attendance_photo_required: boolean;
  photo_retention_hours: number;
  created_at: string;
  updated_at: string;
  member_count: number;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  is_muted: boolean;
  muted_until: string | null;
  user?: User;
}

export interface PenaltyRule {
  id: string;
  type: 'warning' | 'mute' | 'kick';
  condition: string;
  threshold: number;
  duration_hours: number | null;
}

export interface ChatMessage {
  id: string;
  group_id: string | null;
  sender_id: string;
  receiver_id: string | null;
  content: string;
  image_url: string | null;
  reply_to_id: string | null;
  reactions: MessageReaction[];
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  sender?: User;
  reply_to?: ChatMessage;
  is_draft: boolean;
  is_synced: boolean;
}

export interface MessageReaction {
  emoji: string;
  user_ids: string[];
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
  sender?: User;
}

export interface Challenge {
  id: string;
  group_id: string;
  created_by: string;
  title: string;
  description: string;
  target_days: number;
  target_study_time: number; // in seconds per day
  start_date: string;
  end_date: string;
  participants: ChallengeParticipant[];
  created_at: string;
}

export interface ChallengeParticipant {
  user_id: string;
  progress_days: number;
  total_time: number;
  user?: User;
}

export interface Attendance {
  id: string;
  group_id: string;
  user_id: string;
  date: string;
  photo_url: string | null;
  checked_in_at: string;
  is_verified: boolean;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  total_time: number;
  rank: number;
  change: number; // positive = moved up, negative = moved down
}

export interface HeatmapData {
  date: string;
  value: number; // study minutes
}

export interface WeeklyReport {
  week_start: string;
  week_end: string;
  total_time: number;
  subjects: { name: string; time: number; color: string }[];
  daily_breakdown: { day: string; time: number }[];
}

export interface PlannerTask {
  id: string;
  user_id: string;
  title: string;
  description: string;
  subject: string;
  scheduled_date: string;
  scheduled_time: string | null;
  duration_estimate: number; // in minutes
  is_completed: boolean;
  completed_at: string | null;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  is_synced: boolean;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  likes: number;
  comments_count: number;
  created_at: string;
  user?: User;
}

export interface WhiteNoiseTrack {
  id: string;
  name: string;
  icon: string;
  url: string;
  is_downloaded: boolean;
}

export type ThemeMode = 'light' | 'dark';

export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface NotificationItem {
  id: string;
  type: 'group_invite' | 'challenge' | 'message' | 'achievement' | 'system';
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  data?: Record<string, string>;
}
