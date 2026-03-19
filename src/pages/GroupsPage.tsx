import { useState } from 'react';
import { useGroupStore } from '@/stores/groupStore';
import {
  Users,
  Plus,
  Lock,
  Globe,
  Search,
  ChevronRight,
  Shield,
  Crown,
  X,
} from 'lucide-react';
import type { Group } from '@/types';

export function GroupsPage() {
  const { groups, createGroup } = useGroupStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    goal: '',
    max_members: 50,
    is_private: false,
  });

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) return;
    await createGroup({
      ...newGroup,
      icon_url: null,
      created_by: 'current_user',
      password_hash: null,
      invite_code: null,
      penalty_rules: [],
      attendance_photo_required: false,
      photo_retention_hours: 24,
    });
    setShowCreate(false);
    setNewGroup({ name: '', description: '', goal: '', max_members: 50, is_private: false });
  };

  if (selectedGroup) {
    return <GroupDetail group={selectedGroup} onBack={() => setSelectedGroup(null)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Study Groups</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Join or create study groups</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-medium hover:from-violet-600 hover:to-indigo-700 transition-all"
        >
          <Plus size={18} />
          Create Group
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search groups..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Groups List */}
      <div className="space-y-3">
        {filteredGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => setSelectedGroup(group)}
            className="w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-violet-300 dark:hover:border-violet-700 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {group.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{group.name}</h3>
                    {group.is_private ? (
                      <Lock size={14} className="text-zinc-400" />
                    ) : (
                      <Globe size={14} className="text-zinc-400" />
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{group.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Users size={12} /> {group.member_count}/{group.max_members}
                    </span>
                    {group.attendance_photo_required && (
                      <span className="text-xs text-amber-500 flex items-center gap-1">
                        <Shield size={12} /> Photo check-in
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-zinc-400" />
            </div>
          </button>
        ))}
        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500">No groups found</p>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Create Study Group</h3>
              <button onClick={() => setShowCreate(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Group Name</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="e.g., CS Study Group"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="What's this group about?"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Goal</label>
                <input
                  type="text"
                  value={newGroup.goal}
                  onChange={(e) => setNewGroup({ ...newGroup, goal: e.target.value })}
                  placeholder="What's the group's goal?"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Max Members</label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={newGroup.max_members}
                    onChange={(e) => setNewGroup({ ...newGroup, max_members: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Privacy</label>
                  <select
                    value={newGroup.is_private ? 'private' : 'public'}
                    onChange={(e) => setNewGroup({ ...newGroup, is_private: e.target.value === 'private' })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!newGroup.name.trim()}
                  className="flex-1 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Group Detail Component
function GroupDetail({ group, onBack }: { group: Group; onBack: () => void }) {
  const { messages, loadMessages, sendMessage, leaderboard, loadLeaderboard } = useGroupStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'members' | 'leaderboard' | 'challenges'>('chat');
  const [newMessage, setNewMessage] = useState('');

  useState(() => {
    loadMessages(group.id);
    loadLeaderboard();
  });

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(group.id, newMessage);
    setNewMessage('');
  };

  const tabs = [
    { id: 'chat' as const, label: 'Chat' },
    { id: 'members' as const, label: 'Members' },
    { id: 'leaderboard' as const, label: 'Leaderboard' },
    { id: 'challenges' as const, label: 'Challenges' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          {group.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{group.name}</h1>
          <p className="text-sm text-zinc-500">{group.member_count} members &middot; {group.goal}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col" style={{ height: '500px' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender_id === 'current_user' ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                  {msg.sender?.display_name?.charAt(0) || '?'}
                </div>
                <div className={`max-w-xs ${msg.sender_id === 'current_user' ? 'text-right' : ''}`}>
                  <p className="text-xs text-zinc-400 mb-1">{msg.sender?.display_name}</p>
                  <div
                    className={`px-3 py-2 rounded-xl text-sm ${
                      msg.sender_id === 'current_user'
                        ? 'bg-violet-600 text-white rounded-tr-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-sm'
                    }`}
                  >
                    {msg.is_deleted ? (
                      <span className="italic text-zinc-400">Message deleted</span>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.reactions.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {msg.reactions.map((r, i) => (
                        <span key={i} className="text-xs bg-zinc-100 dark:bg-zinc-800 rounded-full px-2 py-0.5">
                          {r.emoji} {r.user_ids.length}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="px-4 py-2 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.user_id}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  entry.rank <= 3 ? 'bg-amber-50 dark:bg-amber-900/10' : 'bg-zinc-50 dark:bg-zinc-800'
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  entry.rank === 1 ? 'bg-amber-400 text-amber-900' :
                  entry.rank === 2 ? 'bg-zinc-300 text-zinc-700' :
                  entry.rank === 3 ? 'bg-amber-600 text-amber-100' :
                  'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                }`}>
                  {entry.rank}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium">
                  {entry.display_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{entry.display_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-medium text-zinc-900 dark:text-zinc-100">
                    {Math.floor(entry.total_time / 3600)}h {Math.floor((entry.total_time % 3600) / 60)}m
                  </p>
                  <p className={`text-xs ${entry.change > 0 ? 'text-emerald-500' : entry.change < 0 ? 'text-red-500' : 'text-zinc-400'}`}>
                    {entry.change > 0 ? `+${entry.change}` : entry.change < 0 ? `${entry.change}` : '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="space-y-3">
            {[
              { name: 'You', role: 'owner' as const, online: true },
              { name: 'Alice', role: 'admin' as const, online: true },
              { name: 'Bob', role: 'member' as const, online: false },
              { name: 'Charlie', role: 'member' as const, online: true },
            ].map((member) => (
              <div key={member.name} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                    {member.name.charAt(0)}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-800 ${member.online ? 'bg-emerald-400' : 'bg-zinc-300'}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{member.name}</p>
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    {member.role === 'owner' && <Crown size={10} className="text-amber-500" />}
                    {member.role === 'admin' && <Shield size={10} className="text-blue-500" />}
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="text-center py-8">
            <p className="text-zinc-500">No active challenges</p>
            <button className="mt-3 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors">
              Create Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
