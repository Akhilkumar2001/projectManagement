import { useEffect, useState } from 'react';
import { Plus, X, Trash2, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import campaignService from '../../services/campaignService.js';

function InlineNum({ value, onSave, prefix = '' }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? 0);

  const save = () => { onSave(Number(val) || 0); setEditing(false); };

  if (!editing) {
    return (
      <span
        onClick={() => { setVal(value ?? 0); setEditing(true); }}
        className="group cursor-pointer inline-flex items-center gap-1.5 px-1.5 py-0.5 -mx-1.5 -my-0.5 rounded hover:bg-gray-50 transition-colors"
      >
        <span>{prefix}{Number(value || 0).toLocaleString()}</span>
        <Pencil size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-text-muted)' }} />
      </span>
    );
  }
  return (
    <input
      type="number"
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
  );
}

function AddBudgetModal({ campaignId, influencers, onClose, onAdded }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { paid: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await campaignService.createBudget(campaignId, {
        ...data,
        fee: Number(data.fee) || 0,
        impressions: Number(data.impressions) || 0,
        reach: Number(data.reach) || 0,
        engagements: Number(data.engagements) || 0,
        conversions: Number(data.conversions) || 0,
        estimatedRevenue: Number(data.estimatedRevenue) || 0,
      });
      toast.success('Entry added');
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
          <h2 className="section-title">Add Budget Entry</h2>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Influencer *</label>
              <select className="input" {...register('influencerId', { required: 'Required' })}>
                <option value="">Select</option>
                {influencers.map((i) => <option key={i._id} value={i._id}>{i.name}</option>)}
              </select>
              {errors.influencerId && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.influencerId.message}</p>}
            </div>
            <div>
              <label className="label">Content Type</label>
              <input className="input" placeholder="Reel, Post, etc." {...register('contentType')} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Fee ($)</label>
              <input type="number" className="input" {...register('fee')} />
            </div>
            <div>
              <label className="label">Paid?</label>
              <select className="input" {...register('paid')}>
                <option value="">—</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="label">Est. Revenue ($)</label>
              <input type="number" className="input" {...register('estimatedRevenue')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Impressions</label><input type="number" className="input" {...register('impressions')} /></div>
            <div><label className="label">Reach</label><input type="number" className="input" {...register('reach')} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Engagements</label><input type="number" className="input" {...register('engagements')} /></div>
            <div><label className="label">Conversions</label><input type="number" className="input" {...register('conversions')} /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? 'Adding…' : 'Add Entry'}</button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BudgetTab({ campaignId, influencers }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = () => {
    setLoading(true);
    campaignService.getBudgets(campaignId)
      .then(({ data }) => setBudgets(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [campaignId]);

  const updateField = async (id, field, value) => {
    try { await campaignService.updateBudget(id, { [field]: value }); load(); }
    catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this entry?')) return;
    try { await campaignService.deleteBudget(id); toast.success('Removed'); load(); }
    catch { toast.error('Failed'); }
  };

  // Totals row
  const totals = budgets.reduce((acc, b) => ({
    fee: acc.fee + b.fee,
    impressions: acc.impressions + b.impressions,
    reach: acc.reach + b.reach,
    engagements: acc.engagements + b.engagements,
    conversions: acc.conversions + b.conversions,
    revenue: acc.revenue + b.estimatedRevenue,
  }), { fee: 0, impressions: 0, reach: 0, engagements: 0, conversions: 0, revenue: 0 });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Budget & Performance</h2>
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
                {['Influencer', 'Type', 'Fee', 'Paid?', 'Impressions', 'Reach', 'Engagements', 'Conversions', 'Cost/Eng.', 'Est. Revenue', 'ROI', ''].map((h) => (
                  <th key={h} className="text-left px-3 py-2.5 font-medium" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => (
                <tr key={b._id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-3 py-2 font-medium" style={{ color: 'var(--color-text)' }}>{b.influencerId?.name || '—'}</td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text-muted)' }}>{b.contentType || '—'}</td>
                  <td className="px-3 py-2"><InlineNum value={b.fee} prefix="$" onSave={(v) => updateField(b._id, 'fee', v)} /></td>
                  <td className="px-3 py-2">
                    <span
                      className="badge cursor-pointer"
                      style={b.paid === 'Yes' ? { background: '#dcfce7', color: '#15803d' } : { background: '#f3f4f6', color: '#374151' }}
                      onClick={() => updateField(b._id, 'paid', b.paid === 'Yes' ? 'No' : 'Yes')}
                    >
                      {b.paid || '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2"><InlineNum value={b.impressions} onSave={(v) => updateField(b._id, 'impressions', v)} /></td>
                  <td className="px-3 py-2"><InlineNum value={b.reach} onSave={(v) => updateField(b._id, 'reach', v)} /></td>
                  <td className="px-3 py-2"><InlineNum value={b.engagements} onSave={(v) => updateField(b._id, 'engagements', v)} /></td>
                  <td className="px-3 py-2"><InlineNum value={b.conversions} onSave={(v) => updateField(b._id, 'conversions', v)} /></td>
                  <td className="px-3 py-2 font-medium" style={{ color: 'var(--color-text)' }}>
                    ${b.costPerEngagement?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-3 py-2"><InlineNum value={b.estimatedRevenue} prefix="$" onSave={(v) => updateField(b._id, 'estimatedRevenue', v)} /></td>
                  <td className="px-3 py-2 font-bold" style={{ color: (b.targetROI || 0) > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {b.targetROI || 0}%
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => handleDelete(b._id)} style={{ color: 'var(--color-danger)' }}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}

              {/* Totals */}
              {budgets.length > 0 && (
                <tr style={{ background: 'var(--color-bg)' }} className="font-bold">
                  <td className="px-3 py-2" style={{ color: 'var(--color-text)' }}>TOTAL</td>
                  <td className="px-3 py-2" />
                  <td className="px-3 py-2" style={{ color: 'var(--color-text)' }}>${totals.fee.toLocaleString()}</td>
                  <td className="px-3 py-2" />
                  <td className="px-3 py-2" style={{ color: 'var(--color-text)' }}>{totals.impressions.toLocaleString()}</td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text)' }}>{totals.reach.toLocaleString()}</td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text)' }}>{totals.engagements.toLocaleString()}</td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text)' }}>{totals.conversions.toLocaleString()}</td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text)' }}>
                    ${totals.engagements ? (totals.fee / totals.engagements).toFixed(2) : '0.00'}
                  </td>
                  <td className="px-3 py-2" style={{ color: 'var(--color-text)' }}>${totals.revenue.toLocaleString()}</td>
                  <td className="px-3 py-2" style={{ color: totals.revenue > totals.fee ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {totals.fee ? Math.round(((totals.revenue - totals.fee) / totals.fee) * 100) : 0}%
                  </td>
                  <td />
                </tr>
              )}

              {budgets.length === 0 && (
                <tr><td colSpan={12} className="px-3 py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>No entries</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <AddBudgetModal campaignId={campaignId} influencers={influencers} onClose={() => setShowAdd(false)} onAdded={load} />}
    </div>
  );
}
