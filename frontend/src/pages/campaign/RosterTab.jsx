import { useEffect, useState } from 'react';
import { Plus, X, Trash2, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import campaignService from '../../services/campaignService.js';

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'X', 'Pinterest', 'LinkedIn', 'Threads', 'Reddit'];
const STATUSES = ['Lead', 'Contacted', 'Confirmed', 'Declined'];
const STATUS_COLORS = {
  Lead: { bg: '#f3f4f6', text: '#374151' },
  Contacted: { bg: '#dbeafe', text: '#1d4ed8' },
  Confirmed: { bg: '#dcfce7', text: '#15803d' },
  Declined: { bg: '#fee2e2', text: '#b91c1c' },
};

function AddInfluencerModal({ campaignId, onClose, onAdded }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { platform: 'Instagram', status: 'Lead' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await campaignService.createInfluencer(campaignId, {
        ...data,
        followerCount: Number(data.followerCount) || 0,
        totalEngagement: Number(data.totalEngagement) || 0,
      });
      toast.success('Influencer added');
      onAdded();
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
          <h2 className="section-title">Add Influencer</h2>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Name *</label>
              <input className="input" {...register('name', { required: 'Required' })} />
              {errors.name && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Handle</label>
              <input className="input" placeholder="@handle" {...register('handle')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Platform</label>
              <select className="input" {...register('platform')}>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" {...register('status')}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Contact Email</label>
            <input type="email" className="input" {...register('contactEmail')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Follower Count</label>
              <input type="number" className="input" {...register('followerCount')} />
            </div>
            <div>
              <label className="label">Total Engagement</label>
              <input type="number" className="input" {...register('totalEngagement')} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label">Niche</label>
              <input className="input" placeholder="Beauty" {...register('niche')} />
            </div>
            <div>
              <label className="label">Country</label>
              <input className="input" placeholder="USA" {...register('country')} />
            </div>
            <div>
              <label className="label">Gender %</label>
              <input className="input" placeholder="80% F" {...register('gender')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Shipping Address</label>
              <input className="input" {...register('shippingAddress')} />
            </div>
            <div>
              <label className="label">Product Shipped</label>
              <select className="input" {...register('productShipped')}>
                <option value="">—</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Adding…' : 'Add Influencer'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InlineEdit({ value, onSave, type = 'text', options }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? '');

  const save = () => {
    onSave(type === 'number' ? Number(val) : val);
    setEditing(false);
  };

  if (!editing) {
    return (
      <span
        onClick={() => setEditing(true)}
        className="group cursor-pointer inline-flex items-center gap-1.5 px-1.5 py-0.5 -mx-1.5 -my-0.5 rounded hover:bg-gray-50 transition-colors"
      >
        <span>{options ? (value || '—') : (type === 'number' ? Number(value || 0).toLocaleString() : (value || '—'))}</span>
        <Pencil size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-text-muted)' }} />
      </span>
    );
  }

  if (options) {
    // Save immediately on selection — avoids stale-closure issues with onBlur
    return (
      <select
        className="text-xs border rounded px-1.5 py-1 outline-none focus:ring-2"
        style={{ borderColor: 'var(--color-primary)' }}
        value={val}
        onChange={(e) => { onSave(e.target.value); setEditing(false); }}
        onBlur={() => setEditing(false)}
        autoFocus
      >
        {options.map((o) => <option key={o} value={o}>{o || '—'}</option>)}
      </select>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <input
        type={type}
        className="text-xs border-2 rounded px-1.5 py-1 w-24 outline-none"
        style={{ borderColor: 'var(--color-primary)' }}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save();
          if (e.key === 'Escape') setEditing(false);
        }}
        onBlur={save}
        autoFocus
      />
    </span>
  );
}

export default function RosterTab({ campaignId }) {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showAdd, setShowAdd]         = useState(false);

  const load = () => {
    setLoading(true);
    campaignService.getInfluencers(campaignId)
      .then(({ data }) => setInfluencers(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [campaignId]);

  const updateField = async (id, field, value) => {
    try {
      await campaignService.updateInfluencer(id, { [field]: value });
      load();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this influencer?')) return;
    try {
      await campaignService.deleteInfluencer(id);
      toast.success('Removed');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Influencer Roster</h2>
        <button className="btn-primary text-sm" onClick={() => setShowAdd(true)}>
          <Plus size={14} /> Add
        </button>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                {['Name', 'Platform', 'Email', 'Handle', 'Followers', 'Engagement', 'Rate', 'Niche', 'Country', 'Gender', 'Status', 'Shipped', ''].map((h) => (
                  <th key={h} className="text-left px-3 py-2.5 font-medium" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {influencers.map((inf) => (
                <tr key={inf._id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-3 py-2 font-medium" style={{ color: 'var(--color-text)' }}>{inf.name}</td>
                  <td className="px-3 py-2">
                    <InlineEdit value={inf.platform} options={PLATFORMS} onSave={(v) => updateField(inf._id, 'platform', v)} />
                  </td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text-muted)' }}>{inf.contactEmail || '—'}</td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-primary)' }}>{inf.handle || '—'}</td>
                  <td className="px-3 py-2">
                    <InlineEdit value={inf.followerCount} type="number" onSave={(v) => updateField(inf._id, 'followerCount', v)} />
                  </td>
                  <td className="px-3 py-2">
                    <InlineEdit value={inf.totalEngagement} type="number" onSave={(v) => updateField(inf._id, 'totalEngagement', v)} />
                  </td>
                  <td className="px-3 py-2 font-medium" style={{ color: 'var(--color-primary)' }}>
                    {inf.engagementRate}%
                  </td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text-muted)' }}>{inf.niche || '—'}</td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text-muted)' }}>{inf.country || '—'}</td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text-muted)' }}>{inf.gender || '—'}</td>
                  <td className="px-3 py-2">
                    <InlineEdit
                      value={inf.status}
                      options={STATUSES}
                      onSave={(v) => updateField(inf._id, 'status', v)}
                    />
                    <span className="ml-1 inline-block w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[inf.status]?.text }} />
                  </td>
                  <td className="px-3 py-2">
                    <InlineEdit value={inf.productShipped} options={['', 'Yes', 'No']} onSave={(v) => updateField(inf._id, 'productShipped', v)} />
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => handleDelete(inf._id)} style={{ color: 'var(--color-danger)' }}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
              {influencers.length === 0 && (
                <tr><td colSpan={13} className="px-3 py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>No influencers added</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <AddInfluencerModal campaignId={campaignId} onClose={() => setShowAdd(false)} onAdded={load} />}
    </div>
  );
}
