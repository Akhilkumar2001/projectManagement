import { useEffect, useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import campaignService from '../../services/campaignService.js';

const CONTENT_TYPES = ['Reel', 'Short', 'Story', 'Challenge', 'Carousel', 'Post', 'Video', 'Blog', 'Other'];
const STATUSES      = ['Planned', 'In Progress', 'Submitted', 'Approved', 'Posted'];
const APPROVALS     = ['Pending', 'Approved', 'Declined'];

const STATUS_C = {
  Planned: { bg: '#f3f4f6', text: '#374151' },
  'In Progress': { bg: '#dbeafe', text: '#1d4ed8' },
  Submitted: { bg: '#fae8ff', text: '#7e22ce' },
  Approved: { bg: '#dcfce7', text: '#15803d' },
  Posted: { bg: '#dbeafe', text: '#1d4ed8' },
};
const APPR_C = {
  Pending: { bg: '#fef9c3', text: '#92400e' },
  Approved: { bg: '#dcfce7', text: '#15803d' },
  Declined: { bg: '#fee2e2', text: '#b91c1c' },
};

function InlineSelect({ value, options, colors, onSave }) {
  const [editing, setEditing] = useState(false);
  const c = colors?.[value] || { bg: '#f3f4f6', text: '#374151' };

  if (!editing) {
    return (
      <span
        onClick={() => setEditing(true)}
        className="badge cursor-pointer hover:opacity-80 transition-opacity"
        style={{ background: c.bg, color: c.text }}
        title="Click to change"
      >
        {value || '—'}
      </span>
    );
  }

  return (
    <select
      className="text-xs border-2 rounded px-1.5 py-1 outline-none"
      style={{ borderColor: 'var(--color-primary)' }}
      value={value}
      onChange={(e) => { onSave(e.target.value); setEditing(false); }}
      onBlur={() => setEditing(false)}
      autoFocus
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function AddDeliverableModal({ campaignId, influencers, onClose, onAdded }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { contentType: 'Post', status: 'Planned', approval: 'Pending' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await campaignService.createDeliverable(campaignId, data);
      toast.success('Deliverable added');
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
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Add Deliverable</h2>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="label">Influencer *</label>
            <select className="input" {...register('influencerId', { required: 'Required' })}>
              <option value="">Select</option>
              {influencers.map((i) => <option key={i._id} value={i._id}>{i.name} ({i.platform})</option>)}
            </select>
            {errors.influencerId && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.influencerId.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Content Type</label>
              <select className="input" {...register('contentType')}>
                {CONTENT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input type="date" className="input" {...register('dueDate')} />
            </div>
          </div>
          <div>
            <label className="label">Link to Draft</label>
            <input className="input" placeholder="https://..." {...register('linkToDraft')} />
          </div>
          <div>
            <label className="label">Notes</label>
            <input className="input" {...register('notes')} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? 'Adding…' : 'Add'}</button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DeliverablesTab({ campaignId, influencers }) {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showAdd, setShowAdd]           = useState(false);

  const load = () => {
    setLoading(true);
    campaignService.getDeliverables(campaignId)
      .then(({ data }) => setDeliverables(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [campaignId]);

  const updateField = async (id, field, value) => {
    try {
      await campaignService.updateDeliverable(id, { [field]: value });
      load();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this deliverable?')) return;
    try { await campaignService.deleteDeliverable(id); toast.success('Removed'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Deliverables Tracker</h2>
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
                {['Influencer', 'Platform', 'Content Type', 'Due Date', 'Status', 'Approval', 'Link to Draft', 'Notes', ''].map((h) => (
                  <th key={h} className="text-left px-3 py-2.5 font-medium" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deliverables.map((d) => (
                <tr key={d._id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-3 py-2 font-medium" style={{ color: 'var(--color-text)' }}>
                    {d.influencerId?.name || '—'}
                  </td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text-muted)' }}>
                    {d.influencerId?.platform || d.platform || '—'}
                  </td>
                  <td className="px-3 py-2">
                    <InlineSelect value={d.contentType} options={CONTENT_TYPES} onSave={(v) => updateField(d._id, 'contentType', v)} />
                  </td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text-muted)' }}>
                    {d.dueDate ? new Date(d.dueDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-3 py-2">
                    <InlineSelect value={d.status} options={STATUSES} colors={STATUS_C} onSave={(v) => updateField(d._id, 'status', v)} />
                  </td>
                  <td className="px-3 py-2">
                    <InlineSelect value={d.approval} options={APPROVALS} colors={APPR_C} onSave={(v) => updateField(d._id, 'approval', v)} />
                  </td>
                  <td className="px-3 py-2">
                    {d.linkToDraft ? (
                      <a href={d.linkToDraft} target="_blank" rel="noreferrer" className="underline" style={{ color: 'var(--color-primary)' }}>
                        Link
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text-muted)' }}>{d.notes || '—'}</td>
                  <td className="px-3 py-2">
                    <button onClick={() => handleDelete(d._id)} style={{ color: 'var(--color-danger)' }}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
              {deliverables.length === 0 && (
                <tr><td colSpan={9} className="px-3 py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>No deliverables</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <AddDeliverableModal campaignId={campaignId} influencers={influencers} onClose={() => setShowAdd(false)} onAdded={load} />}
    </div>
  );
}
