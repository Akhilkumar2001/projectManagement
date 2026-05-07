import { useSelector } from 'react-redux';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge.jsx';

export default function Tasks() {
  const { list: tasks, loading } = useSelector((s) => s.tasks);

  return (
    <div className="space-y-5">
      <h1 className="page-title">All Tasks</h1>

      {loading ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                {['Title', 'Assigned To', 'Priority', 'Status', 'Due Date'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium"
                    style={{ color: 'var(--color-text-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((t, i) => (
                <tr
                  key={t._id}
                  style={{
                    borderBottom: i < tasks.length - 1 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-text)' }}>{t.title}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>{t.assignedTo?.name || '—'}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
