import React from 'react';
import { FileText, Clock, Tag } from 'lucide-react';

/** Tiny progress bar (no deps) with accessible text */
const ProgressBar = ({ value = 0, max = 100 }) => {
  const safeMax = Math.max(1, max);
  const pct = Math.max(0, Math.min(100, (value / safeMax) * 100));

  return (
    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden" aria-hidden="true">
      <div
        className="h-full bg-blue-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

/** Pretty name for label keys */
const formatLabel = (key) =>
  key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

/** Soft color per label for visual grouping */
const labelColor = (key) => {
  switch (key) {
    case 'featured':
      return 'bg-purple-50 text-purple-900 border-purple-200';
    case 'diary_of_the_day':
      return 'bg-blue-50 text-blue-900 border-blue-200';
    case 'founder_of_the_day':
      return 'bg-orange-50 text-orange-900 border-orange-200';
    case 'trending':
      return 'bg-pink-50 text-pink-900 border-pink-200';
    case 'popular':
      return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    default:
      return 'bg-gray-50 text-gray-900 border-gray-200';
  }
};

const ContributorHome = ({ contributorId, analytics, loading, error }) => {
  // Support either the raw API response or just the .data object being passed in
  const dataNode = analytics?.data ?? analytics ?? {};
  const published = Number(dataNode?.published_biographies ?? 0);
  const pending   = Number(dataNode?.pending_biographies ?? 0);

  // Labels
  const labelsNode = dataNode?.labels ?? {};
  const labelKeys = ['trending', 'featured', 'diary_of_the_day', 'founder_of_the_day', 'popular'];
  const labelsData = labelKeys.map((k) => ({
    key: k,
    value: Number(labelsNode?.[k] ?? 0),
  }));

  const totalLabels = labelsData.reduce((acc, d) => acc + d.value, 0);

  const stats = [
    { name: 'Published Biographies', value: published, icon: FileText, color: 'bg-green-500' },
    { name: 'Pending Approval',      value: pending,   icon: Clock,    color: 'bg-yellow-500' },
  ];

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-1 sm:mt-2">Track your biography submissions and label performance.</p>

        {loading && <div className="mt-3 text-sm text-gray-500">Loading analytics…</div>}
        {error &&   <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>

      {/* Top stats — responsive 1→2 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                    {loading ? '—' : stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-full shrink-0`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels section header */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Labels Overview</h2>
          <p className="text-sm text-gray-600">
            Total labeled: <span className="font-medium text-gray-800">{loading ? '—' : totalLabels}</span>
          </p>
        </div>
      </div>

      {/* Label KPI Grid — responsive 1→2→3→5 cols */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        {labelsData.map(({ key, value }) => {
          const pct = totalLabels > 0 ? Math.round((value / totalLabels) * 100) : 0;
          const colorClasses = labelColor(key);
          return (
            <div
              key={key}
              className={`border ${colorClasses} rounded-lg p-4 sm:p-5 flex flex-col gap-3`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-md bg-white/70 border border-white/40 p-1.5">
                    <Tag className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-semibold">{formatLabel(key)}</h3>
                </div>
                <span className="text-xs font-medium opacity-80">{pct}%</span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{loading ? '—' : value}</p>
                  <p className="text-xs opacity-70">biographies</p>
                </div>
              </div>

              <ProgressBar value={value} max={Math.max(...labelsData.map((d) => d.value), 1)} />
              <span className="sr-only">{formatLabel(key)}: {value} ({pct}%)</span>
            </div>
          );
        })}
      </div>

      {/* Empty state for labels */}
      {!loading && totalLabels === 0 && (
        <div className="mt-6 text-sm text-gray-500">
          No labeled biographies yet. Add labels like <span className="font-medium">Trending</span> or{' '}
          <span className="font-medium">Featured</span> to see them here.
        </div>
      )}
    </div>
  );
};

export default ContributorHome;
