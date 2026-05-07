import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Pencil, X, Save } from 'lucide-react';
import campaignService from '../../services/campaignService.js';

const FIELDS = [
  { key: 'startDate',       label: 'Start Date',         type: 'date' },
  { key: 'endDate',         label: 'End Date',           type: 'date' },
  { key: 'objective',       label: 'Objective',          type: 'text' },
  { key: 'targetAudience',  label: 'Target Audience',    type: 'text' },
  { key: 'primaryPlatform', label: 'Primary Platform',   type: 'text' },
  { key: 'totalBudget',     label: 'Total Budget',       type: 'number', prefix: '$ ' },
  { key: 'keyBrandMessage', label: 'Key Brand Message',  type: 'text' },
  { key: 'creativeBrief',   label: 'Creative Brief',     type: 'text' },
  { key: 'kpis',            label: 'KPIs',               type: 'text' },
];

const buildDefaults = (c) => ({
  ...c,
  startDate: c.startDate?.slice(0, 10) || '',
  endDate:   c.endDate?.slice(0, 10) || '',
});

export default function OverviewTab({ campaign, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm({ defaultValues: buildDefaults(campaign) });

  // Reset form whenever entering edit mode (or campaign data changes)
  useEffect(() => {
    if (editing) reset(buildDefaults(campaign));
  }, [editing, campaign, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await campaignService.update(campaign._id, data);
      toast.success('Campaign updated');
      onUpdated();
      setEditing(false);
    } catch {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const formatVal = (f) => {
    const v = campaign[f.key];
    if (f.type === 'date' && v) return new Date(v).toLocaleDateString();
    if (f.prefix && v) return `${f.prefix}${Number(v).toLocaleString()}`;
    return v || '—';
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{campaign.name}</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Campaign details and configuration</p>
        </div>
        <button
          onClick={() => setEditing((v) => !v)}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors"
          style={{
            borderColor: editing ? 'var(--color-danger)' : 'var(--color-border)',
            color: editing ? 'var(--color-danger)' : 'var(--color-primary)',
            background: editing ? 'transparent' : 'var(--color-primary-light)',
          }}
        >
          {editing ? <><X size={14} /> Cancel</> : <><Pencil size={14} /> Edit</>}
        </button>
      </div>

      {!editing ? (
        <div className="space-y-1">
          {FIELDS.map((f) => (
            <div key={f.key} className="flex justify-between items-center py-2.5 border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>{f.label}</span>
              <span className="text-sm text-right max-w-md truncate" style={{ color: 'var(--color-text)' }}>{formatVal(f)}</span>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.key === 'keyBrandMessage' || f.key === 'creativeBrief' || f.key === 'kpis' ? 'md:col-span-2' : ''}>
                <label className="label">{f.label}</label>
                <input type={f.type} className="input" {...register(f.key, f.type === 'number' ? { valueAsNumber: true } : {})} />
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              <Save size={14} /> {loading ? 'Saving…' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
