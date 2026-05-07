import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FolderKanban, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import { fetchProjects } from '../store/slices/projectSlice.js';
import { fetchTasks } from '../store/slices/taskSlice.js';
import { StatusBadge } from '../components/common/StatusBadge.jsx';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: color + '20', color }}
    >
      <Icon size={22} />
    </div>
    <div>
      <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{value}</p>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { list: projects } = useSelector((s) => s.projects);
  const { list: tasks }    = useSelector((s) => s.tasks);

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const stats = [
    { label: 'Total Projects', value: projects.length,                                          icon: FolderKanban, color: 'var(--color-primary)' },
    { label: 'Active Projects', value: projects.filter((p) => p.status === 'active').length,    icon: TrendingUp,   color: 'var(--color-success)' },
    { label: 'Total Tasks',    value: tasks.length,                                              icon: CheckSquare,  color: 'var(--color-accent)'  },
    { label: 'In Progress',    value: tasks.filter((t) => t.status === 'in_progress').length,    icon: Clock,        color: 'var(--color-warning)' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="page-title">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Recent Projects */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Projects</h2>
          <Link to="/projects" className="text-sm" style={{ color: 'var(--color-primary)' }}>
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {projects.slice(0, 5).map((p) => (
            <Link
              key={p._id}
              to={`/projects/${p._id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {p.employees?.length || 0} members
                </p>
              </div>
              <StatusBadge status={p.status} />
            </Link>
          ))}
          {projects.length === 0 && (
            <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
              No projects yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
