import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Megaphone, Calendar, Users, FileText, TrendingUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import campaignService from '../services/campaignService.js';

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'X', 'Pinterest', 'LinkedIn', 'Threads', 'Reddit'];

function CreateCampaignModal({ onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await campaignService.create(data);
      toast.success('Campaign created');
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">New Campaign</h2>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Campaign Name *</label>
            <input className="input" placeholder="e.g. Summer Launch 2026"
              {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Start Date</label>
              <input type="date" className="input" {...register('startDate')} />
            </div>
            <div>
              <label className="label">End Date</label>
              <input type="date" className="input" {...register('endDate')} />
            </div>
          </div>
          <div>
            <label className="label">Objective</label>
            <input className="input" placeholder="Brand Awareness" {...register('objective')} />
          </div>
          <div>
            <label className="label">Target Audience</label>
            <input className="input" placeholder="18-34 female, urban" {...register('targetAudience')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Primary Platform</label>
              <select className="input" {...register('primaryPlatform')}>
                <option value="">Select</option>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                <option value="Instagram/TikTok">Instagram/TikTok</option>
              </select>
            </div>
            <div>
              <label className="label">Total Budget ($)</label>
              <input type="number" className="input" placeholder="1000" {...register('totalBudget', { valueAsNumber: true })} />
            </div>
          </div>
          <div>
            <label className="label">Key Brand Message</label>
            <textarea className="input resize-none" rows={2} {...register('keyBrandMessage')} />
          </div>
          <div>
            <label className="label">KPIs</label>
            <input className="input" placeholder="Reach 1M, 50K engagements" {...register('kpis')} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Creating…' : 'Create Campaign'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CampaignCard({ campaign }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    campaignService.getDashboard(campaign._id)
      .then(({ data }) => setStats(data.data))
      .catch(() => {});
  }, [campaign._id]);

  const budgetPct = campaign.totalBudget && stats
    ? Math.min((stats.budgetSpent / campaign.totalBudget) * 100, 100)
    : 0;

  return (
    <Link to={`/campaigns/${campaign._id}`} className="card p-5 block hover:shadow-lg hover:-translate-y-0.5 transition-all">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-accent)' + '20', color: 'var(--color-accent)' }}>
          <Megaphone size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>{campaign.name}</h3>
          <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
            {campaign.objective || 'No objective'}
          </p>
        </div>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {campaign.primaryPlatform && (
          <span className="badge" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            {campaign.primaryPlatform}
          </span>
        )}
        {campaign.startDate && (
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <Calendar size={11} />
            {new Date(campaign.startDate).toLocaleDateString()}
            {campaign.endDate && <> – {new Date(campaign.endDate).toLocaleDateString()}</>}
          </span>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 mb-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <Users size={11} /> Influencers
          </div>
          <p className="text-base font-semibold mt-0.5" style={{ color: 'var(--color-text)' }}>
            {stats ? stats.totalInfluencers : '—'}
          </p>
        </div>
        <div className="text-center border-x" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <FileText size={11} /> Confirmed
          </div>
          <p className="text-base font-semibold mt-0.5" style={{ color: 'var(--color-success)' }}>
            {stats ? stats.confirmed : '—'}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <TrendingUp size={11} /> Eng. Rate
          </div>
          <p className="text-base font-semibold mt-0.5" style={{ color: 'var(--color-primary)' }}>
            {stats ? `${stats.avgEngagementRate}%` : '—'}
          </p>
        </div>
      </div>

      {/* Budget bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span style={{ color: 'var(--color-text-muted)' }}>Budget</span>
          <span style={{ color: 'var(--color-text)' }}>
            <span className="font-semibold" style={{ color: 'var(--color-danger)' }}>
              ${stats?.budgetSpent?.toLocaleString() || 0}
            </span>
            {' / '}
            ${campaign.totalBudget?.toLocaleString() || 0}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-bg)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${budgetPct}%`,
              background: budgetPct > 100 ? 'var(--color-danger)' : 'var(--color-primary)',
            }}
          />
        </div>
      </div>
    </Link>
  );
}

export default function Campaigns() {
  const [campaigns, setCampaigns]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [search, setSearch]         = useState('');

  const load = () => {
    setLoading(true);
    campaignService.getAll()
      .then(({ data }) => setCampaigns(data.data))
      .catch(() => toast.error('Failed to load campaigns'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Influencer Campaigns</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Manage your influencer marketing campaigns end-to-end
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* Search bar */}
      {campaigns.length > 0 && (
        <input
          className="input max-w-sm"
          placeholder="Search campaigns…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-11 w-11 rounded-xl bg-gray-200 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-2 bg-gray-100 rounded w-1/2 mb-4" />
              <div className="h-12 bg-gray-100 rounded mb-3" />
              <div className="h-1.5 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="card py-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <Megaphone size={28} />
          </div>
          <p className="text-base font-medium mb-1" style={{ color: 'var(--color-text)' }}>No campaigns yet</p>
          <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
            Create your first influencer campaign to get started
          </p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Create Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => <CampaignCard key={c._id} campaign={c} />)}
          {filtered.length === 0 && (
            <p className="col-span-full text-sm text-center py-10" style={{ color: 'var(--color-text-muted)' }}>
              No campaigns match your search
            </p>
          )}
        </div>
      )}

      {showModal && <CreateCampaignModal onClose={() => setShowModal(false)} onCreated={load} />}
    </div>
  );
}
