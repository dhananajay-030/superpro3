import { useState } from 'react';
import {
  Globe,
  Heart,
  MessageCircle,
  Send,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Image,
} from 'lucide-react';
import { useCommunityStore } from '@/stores/communityStore';
import { getRelativeTime } from '@/utils/formatTime';

export function CommunityPage() {
  const { posts, globalLeaderboard, createPost, likePost } = useCommunityStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'ranking'>('feed');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    await createPost(newPostContent);
    setNewPostContent('');
    setShowNewPost(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Community</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Connect with fellow learners</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'feed'
              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          <Globe size={16} /> Feed
        </button>
        <button
          onClick={() => setActiveTab('ranking')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'ranking'
              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          <Trophy size={16} /> Global Ranking
        </button>
      </div>

      {/* Feed Tab */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {/* New Post */}
          {!showNewPost ? (
            <button
              onClick={() => setShowNewPost(true)}
              className="w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 text-left text-zinc-400 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
            >
              Share your study journey...
            </button>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What have you been studying? Share tips, progress, or photos..."
                rows={3}
                autoFocus
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  <Image size={18} /> Add Photo
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowNewPost(false); setNewPostContent(''); }}
                    className="px-4 py-1.5 rounded-lg text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
                  >
                    <Send size={14} /> Post
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts */}
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                  {post.user?.display_name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {post.user?.display_name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-zinc-400">{getRelativeTime(post.created_at)}</p>
                </div>
              </div>
              <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-6 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-red-500 transition-colors"
                >
                  <Heart size={16} /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-blue-500 transition-colors">
                  <MessageCircle size={16} /> {post.comments_count}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Global Ranking Tab */}
      {activeTab === 'ranking' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          {/* Top 3 Podium */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-end justify-center gap-4">
              {/* 2nd Place */}
              {globalLeaderboard[1] && (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 flex items-center justify-center text-white text-lg font-bold">
                    {globalLeaderboard[1].display_name.charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-2">{globalLeaderboard[1].display_name}</p>
                  <p className="text-xs text-zinc-500">{Math.floor(globalLeaderboard[1].total_time / 3600)}h</p>
                  <div className="w-20 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-t-lg mt-2 flex items-center justify-center text-lg font-bold text-zinc-500">
                    2
                  </div>
                </div>
              )}
              {/* 1st Place */}
              {globalLeaderboard[0] && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xl font-bold ring-4 ring-amber-300 dark:ring-amber-700">
                    {globalLeaderboard[0].display_name.charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-2">{globalLeaderboard[0].display_name}</p>
                  <p className="text-xs text-zinc-500">{Math.floor(globalLeaderboard[0].total_time / 3600)}h</p>
                  <div className="w-20 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-t-lg mt-2 flex items-center justify-center text-lg font-bold text-amber-600">
                    1
                  </div>
                </div>
              )}
              {/* 3rd Place */}
              {globalLeaderboard[2] && (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-lg font-bold">
                    {globalLeaderboard[2].display_name.charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-2">{globalLeaderboard[2].display_name}</p>
                  <p className="text-xs text-zinc-500">{Math.floor(globalLeaderboard[2].total_time / 3600)}h</p>
                  <div className="w-20 h-12 bg-amber-50 dark:bg-amber-900/10 rounded-t-lg mt-2 flex items-center justify-center text-lg font-bold text-amber-700">
                    3
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rest of leaderboard */}
          <div className="p-4 space-y-2">
            {globalLeaderboard.slice(3).map((entry) => (
              <div
                key={entry.user_id}
                className="flex items-center gap-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800"
              >
                <span className="w-8 text-center text-sm font-bold text-zinc-400">{entry.rank}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium">
                  {entry.display_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{entry.display_name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-mono text-zinc-700 dark:text-zinc-300">
                    {Math.floor(entry.total_time / 3600)}h {Math.floor((entry.total_time % 3600) / 60)}m
                  </p>
                  {entry.change > 0 ? (
                    <TrendingUp size={14} className="text-emerald-500" />
                  ) : entry.change < 0 ? (
                    <TrendingDown size={14} className="text-red-500" />
                  ) : (
                    <Minus size={14} className="text-zinc-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
