import { useEffect, useState } from 'react';
import activityService from '../../services/activityService.js';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ActivityLog() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityService.getLogs({ limit: 100 })
      .then(({ data }) => setLogs(data.data))
      .catch(() => toast.error('Failed to load activity'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="page-title">Activity Log</h1>

      {loading ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
      ) : (
        <div className="card p-5 space-y-3">
          {logs.map((log) => (
            <div
              key={log._id}
              className="flex items-start gap-3 pb-3 border-b last:border-0"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: 'var(--color-primary)' }}
              >
                {log.userId?.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1">
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                  <span className="font-medium">{log.userId?.name}</span>
                  {' '}{log.action}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {format(new Date(log.createdAt), 'dd MMM yyyy, hh:mm a')}
                </p>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>No activity yet</p>
          )}
        </div>
      )}
    </div>
  );
}
