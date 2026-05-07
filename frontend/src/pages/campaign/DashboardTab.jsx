import { useEffect, useState } from 'react';
import { Users, UserCheck, DollarSign, Heart, Eye, MousePointerClick, TrendingUp } from 'lucide-react';
import campaignService from '../../services/campaignService.js';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: color + '15', color }}>
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-xl font-bold truncate" style={{ color: 'var(--color-text)' }}>{value || 0}</p>
      <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
    </div>
  </div>
);

const MiniBar = ({ label, count, total, color }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-24 text-right font-medium" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
      <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-6 font-bold" style={{ color: 'var(--color-text)' }}>{count}</span>
    </div>
  );
};

export default function DashboardTab({ campaignId, campaign }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    campaignService.getDashboard(campaignId).then(({ data }) => setStats(data.data));
  }, [campaignId]);

  if (!stats) return <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading dashboard…</p>;

  const cards = [
    { label: 'Total Influencers',   value: stats.totalInfluencers,              icon: Users,             color: 'var(--color-primary)' },
    { label: 'Confirmed',           value: stats.confirmed,                      icon: UserCheck,         color: 'var(--color-success)' },
    { label: 'Planned Budget',      value: `$${campaign.totalBudget?.toLocaleString() || 0}`, icon: DollarSign, color: 'var(--color-warning)' },
    { label: 'Budget Spent',        value: `$${stats.budgetSpent?.toLocaleString() || 0}`,    icon: DollarSign, color: 'var(--color-danger)' },
    { label: 'Total Engagements',   value: stats.totalEngagements?.toLocaleString(),  icon: Heart,     color: 'var(--color-accent)' },
    { label: 'Avg. Engagement Rate',value: `${stats.avgEngagementRate}%`,        icon: TrendingUp,        color: 'var(--color-primary)' },
    { label: 'Total Impressions',   value: stats.totalImpressions?.toLocaleString(), icon: Eye,        color: '#6366f1' },
    { label: 'Conversions',         value: stats.totalConversions?.toLocaleString(), icon: MousePointerClick, color: 'var(--color-success)' },
  ];

  const infColors = { Lead: '#9ca3af', Contacted: '#3b82f6', Confirmed: '#22c55e', Declined: '#ef4444' };
  const delColors = { Planned: '#9ca3af', 'In Progress': '#3b82f6', Submitted: '#a855f7', Approved: '#22c55e', Posted: '#06b6d4' };

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Influencer Status Breakdown */}
        <div className="card p-5">
          <h3 className="section-title mb-4">Influencer Status</h3>
          <div className="space-y-2.5">
            {Object.entries(stats.influencerStatuses).map(([label, count]) => (
              <MiniBar key={label} label={label} count={count} total={stats.totalInfluencers} color={infColors[label]} />
            ))}
          </div>
        </div>

        {/* Deliverable Status Breakdown */}
        <div className="card p-5">
          <h3 className="section-title mb-4">Deliverables Status</h3>
          <div className="space-y-2.5">
            {Object.entries(stats.deliverableStatuses).map(([label, count]) => {
              const total = Object.values(stats.deliverableStatuses).reduce((a, b) => a + b, 0);
              return <MiniBar key={label} label={label} count={count} total={total} color={delColors[label]} />;
            })}
          </div>
        </div>
      </div>

      {/* Budget summary */}
      <div className="card p-5">
        <h3 className="section-title mb-4">Budget Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Planned</p>
            <p className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>${campaign.totalBudget?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Spent</p>
            <p className="text-lg font-bold" style={{ color: 'var(--color-danger)' }}>${stats.budgetSpent?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Remaining</p>
            <p className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>
              ${((campaign.totalBudget || 0) - (stats.budgetSpent || 0)).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Est. Revenue</p>
            <p className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>${stats.totalRevenue?.toLocaleString() || 0}</p>
          </div>
        </div>
        {/* Budget bar */}
        <div className="mt-4 h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${campaign.totalBudget ? Math.min((stats.budgetSpent / campaign.totalBudget) * 100, 100) : 0}%`,
              background: stats.budgetSpent > campaign.totalBudget ? 'var(--color-danger)' : 'var(--color-primary)',
            }}
          />
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {campaign.totalBudget ? Math.round((stats.budgetSpent / campaign.totalBudget) * 100) : 0}% of budget used
        </p>
      </div>
    </div>
  );
}
