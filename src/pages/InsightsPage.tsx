import { useState, useMemo } from 'react';
import {
  BarChart3,
  Flame,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTimerStore } from '@/stores/timerStore';
import { formatHoursMinutes } from '@/utils/formatTime';
import type { TimePeriod } from '@/types';

const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export function InsightsPage() {
  const { sessions } = useTimerStore();
  const [period, setPeriod] = useState<TimePeriod>('weekly');
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Generate heatmap data for current year
  const heatmapData = useMemo(() => {
    const data: Record<string, number> = {};
    sessions.forEach((s) => {
      const date = s.start_time.split('T')[0];
      data[date] = (data[date] || 0) + s.duration;
    });
    return data;
  }, [sessions]);

  // Weekly data for bar chart
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      const date = new Date();
      const dayOfWeek = date.getDay();
      const diff = (i + 1) - dayOfWeek;
      const targetDate = new Date(date);
      targetDate.setDate(date.getDate() + diff);
      const dateStr = targetDate.toISOString().split('T')[0];
      const minutes = Math.floor((heatmapData[dateStr] || 0) / 60);
      return { day, minutes, hours: Math.round(minutes / 60 * 10) / 10 };
    });
  }, [heatmapData]);

  // Category distribution
  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    sessions.forEach((s) => {
      const cat = s.category || 'General';
      cats[cat] = (cats[cat] || 0) + s.duration;
    });
    return Object.entries(cats).map(([name, time], i) => ({
      name,
      value: Math.round(time / 60),
      color: COLORS[i % COLORS.length],
    }));
  }, [sessions]);

  // Total stats
  const totalTime = sessions.reduce((acc, s) => acc + s.duration, 0);
  const avgDaily = sessions.length > 0 ? totalTime / 7 : 0;
  const totalSessions = sessions.length;

  // Passion indicator (% vs average - mock: 2h/day average)
  const avgTargetSeconds = 7200; // 2 hours
  const passionPercent = avgDaily > 0 ? Math.min(Math.round((avgDaily / avgTargetSeconds) * 100), 200) : 0;

  // Calendar data
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = (firstDay.getDay() + 6) % 7; // Monday start
    const days: { date: string; dayNum: number; inMonth: boolean; hours: number }[] = [];

    for (let i = -startPad; i <= lastDay.getDate() + (6 - ((lastDay.getDay() + 6) % 7)); i++) {
      const d = new Date(year, month, i + 1);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayNum: d.getDate(),
        inMonth: d.getMonth() === month,
        hours: Math.round((heatmapData[dateStr] || 0) / 3600 * 10) / 10,
      });
    }
    return days;
  }, [calendarMonth, heatmapData]);

  const navigateMonth = (dir: number) => {
    setCalendarMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
  };

  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Insights</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Your study analytics and patterns</p>
        </div>
        <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                period === p.value
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={18} className="text-violet-500" />
            <span className="text-sm text-zinc-500">Total Study</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{formatHoursMinutes(totalTime)}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-blue-500" />
            <span className="text-sm text-zinc-500">Daily Avg</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{formatHoursMinutes(Math.round(avgDaily))}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className="text-emerald-500" />
            <span className="text-sm text-zinc-500">Sessions</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalSessions}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={18} className="text-amber-500" />
            <span className="text-sm text-zinc-500">Passion Index</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{passionPercent}%</p>
            <div className="flex-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={`h-2 rounded-full transition-all ${
                  passionPercent >= 100 ? 'bg-emerald-500' : passionPercent >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(passionPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Study Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">Study Time This Week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#71717a" />
                <YAxis tick={{ fontSize: 12 }} stroke="#71717a" unit="m" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg, #fff)',
                    border: '1px solid #e4e4e7',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value} min`, 'Study Time']}
                />
                <Bar dataKey="minutes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">Subject Distribution</h3>
          {categoryData.length > 0 ? (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} min`, 'Time']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-zinc-700 dark:text-zinc-300">{cat.name}</span>
                    </div>
                    <span className="text-zinc-500">{cat.value}m</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-zinc-400">No data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Calendar */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Study Heatmap</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => navigateMonth(-1)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500">
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 min-w-32 text-center">
              {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => navigateMonth(1)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-zinc-400 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            const intensity = day.hours > 4 ? 4 : day.hours > 2 ? 3 : day.hours > 1 ? 2 : day.hours > 0 ? 1 : 0;
            const bgClass = !day.inMonth
              ? 'bg-transparent'
              : intensity === 0
              ? 'bg-zinc-100 dark:bg-zinc-800'
              : intensity === 1
              ? 'bg-violet-200 dark:bg-violet-900/40'
              : intensity === 2
              ? 'bg-violet-400 dark:bg-violet-700'
              : intensity === 3
              ? 'bg-violet-600 dark:bg-violet-500'
              : 'bg-violet-800 dark:bg-violet-400';

            return (
              <div
                key={i}
                className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs transition-colors ${bgClass} ${
                  !day.inMonth ? 'opacity-0' : ''
                } ${day.date === new Date().toISOString().split('T')[0] ? 'ring-2 ring-violet-500' : ''}`}
                title={day.inMonth ? `${day.date}: ${day.hours}h` : ''}
              >
                <span className={`font-medium ${intensity >= 2 ? 'text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                  {day.inMonth ? day.dayNum : ''}
                </span>
                {day.hours > 0 && day.inMonth && (
                  <span className={`text-[10px] ${intensity >= 2 ? 'text-white/80' : 'text-zinc-500'}`}>
                    {day.hours}h
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <span className="text-xs text-zinc-400">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-4 h-4 rounded-sm ${
                level === 0
                  ? 'bg-zinc-100 dark:bg-zinc-800'
                  : level === 1
                  ? 'bg-violet-200 dark:bg-violet-900/40'
                  : level === 2
                  ? 'bg-violet-400 dark:bg-violet-700'
                  : level === 3
                  ? 'bg-violet-600 dark:bg-violet-500'
                  : 'bg-violet-800 dark:bg-violet-400'
              }`}
            />
          ))}
          <span className="text-xs text-zinc-400">More</span>
        </div>
      </div>
    </div>
  );
}
