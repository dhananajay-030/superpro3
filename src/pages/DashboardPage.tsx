import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Timer,
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react';
import { useTimerStore } from '@/stores/timerStore';
import { useGroupStore } from '@/stores/groupStore';
import { usePlannerStore } from '@/stores/plannerStore';
import { formatHoursMinutes } from '@/utils/formatTime';

export function DashboardPage() {
  const { sessions, maxFocusTime, maxStudyWithoutBreak } = useTimerStore();
  const { groups } = useGroupStore();
  const { tasks, loadTasks } = usePlannerStore();

  useEffect(() => {
    loadTasks('demo');
  }, [loadTasks]);

  const todaySessions = sessions.filter((s) => {
    const today = new Date().toISOString().split('T')[0];
    return s.start_time.startsWith(today);
  });

  const todayStudyTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const totalStudyTime = sessions.reduce((acc, s) => acc + s.duration, 0);
  const todayTasks = tasks.filter((t) => t.scheduled_date === new Date().toISOString().split('T')[0]);
  const completedTasks = todayTasks.filter((t) => t.is_completed);

  const stats = [
    {
      label: 'Today\'s Study',
      value: formatHoursMinutes(todayStudyTime),
      icon: Clock,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-100 dark:bg-violet-900/30',
      textColor: 'text-violet-700 dark:text-violet-300',
    },
    {
      label: 'Total Study Time',
      value: formatHoursMinutes(totalStudyTime),
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      label: 'Max Focus',
      value: formatHoursMinutes(maxFocusTime),
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      textColor: 'text-amber-700 dark:text-amber-300',
    },
    {
      label: 'Max Without Break',
      value: formatHoursMinutes(maxStudyWithoutBreak),
      icon: Target,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      textColor: 'text-emerald-700 dark:text-emerald-300',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track your study progress and stay productive</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon size={20} className={stat.textColor} />
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/timer"
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white hover:from-violet-600 hover:to-indigo-700 transition-colors"
            >
              <Timer size={24} />
              <div>
                <p className="font-medium">Start Timer</p>
                <p className="text-sm text-white/70">Begin study session</p>
              </div>
            </Link>
            <Link
              to="/groups"
              className="flex items-center gap-3 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Users size={24} className="text-violet-500" />
              <div>
                <p className="font-medium">My Groups</p>
                <p className="text-sm text-zinc-500">{groups.length} groups</p>
              </div>
            </Link>
            <Link
              to="/planner"
              className="flex items-center gap-3 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Calendar size={24} className="text-blue-500" />
              <div>
                <p className="font-medium">Planner</p>
                <p className="text-sm text-zinc-500">{todayTasks.length} tasks today</p>
              </div>
            </Link>
            <Link
              to="/insights"
              className="flex items-center gap-3 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <BarChart3 size={24} className="text-emerald-500" />
              <div>
                <p className="font-medium">Insights</p>
                <p className="text-sm text-zinc-500">View analytics</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Today's Tasks</h2>
            <Link to="/planner" className="text-sm text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {todayTasks.length === 0 ? (
            <p className="text-zinc-400 text-sm py-8 text-center">No tasks scheduled for today</p>
          ) : (
            <div className="space-y-3">
              {todayTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    task.is_completed
                      ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      task.priority === 'high'
                        ? 'bg-red-500'
                        : task.priority === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        task.is_completed
                          ? 'line-through text-zinc-400'
                          : 'text-zinc-900 dark:text-zinc-100'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-zinc-500">{task.subject} &middot; {task.scheduled_time}</p>
                  </div>
                </div>
              ))}
              <p className="text-xs text-zinc-400 text-center mt-2">
                {completedTasks.length}/{todayTasks.length} completed
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Recent Study Sessions</h2>
          <Link to="/insights" className="text-sm text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
            View insights <ArrowRight size={14} />
          </Link>
        </div>
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <Timer size={48} className="text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500 dark:text-zinc-400">No study sessions yet</p>
            <Link to="/timer" className="text-sm text-violet-600 dark:text-violet-400 hover:underline mt-1 inline-block">
              Start your first session
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.slice(-5).reverse().map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{session.subject || 'Untitled'}</p>
                  <p className="text-xs text-zinc-500">{session.category} &middot; {new Date(session.start_time).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-mono font-medium text-zinc-700 dark:text-zinc-300">
                  {formatHoursMinutes(session.duration)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
