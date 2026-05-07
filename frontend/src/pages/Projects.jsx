import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Search, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { fetchProjects, createProject } from '../store/slices/projectSlice.js';
import { StatusBadge, PriorityBadge } from '../components/common/StatusBadge.jsx';
import { ROLES, PROJECT_STATUSES, PRIORITIES } from '../utils/constants.js';
import userService from '../services/userService.js';

function CreateProjectModal({ onClose, onCreated }) {
  const dispatch = useDispatch();
  const [clients, setClients]     = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { priority: 'medium', status: 'planning' },
  });

  useEffect(() => {
    userService.getAll({ role: 'client' }).then(({ data }) => setClients(data.data));
    userService.getAll({ role: 'employee' }).then(({ data }) => setEmployees(data.data));
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // employees is a multi-select — convert to array
      const employees = Array.from(
        document.getElementById('employees-select').selectedOptions,
        (o) => o.value
      );
      await dispatch(createProject({ ...data, employees })).unwrap();
      toast.success('Project created');
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">New Project</h2>
          <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--color-text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Project Name *</label>
            <input className="input" placeholder="Enter project name"
              {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Project description"
              {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select className="input" {...register('status')}>
                {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" {...register('priority')}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
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
            <label className="label">Client *</label>
            <select className="input" {...register('clientId', { required: 'Client is required' })}>
              <option value="">Select client</option>
              {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            {errors.clientId && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.clientId.message}</p>}
          </div>

          <div>
            <label className="label">Assign Employees <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(Ctrl+click to select multiple)</span></label>
            <select id="employees-select" multiple className="input h-28">
              {employees.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Creating…' : 'Create Project'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Projects() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.projects);
  const { user }          = useSelector((s) => s.auth);
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const filtered = list.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Projects</h1>
        {user?.role === ROLES.ADMIN && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      <div className="relative max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
        <input
          className="input pl-9"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Link key={p._id} to={`/projects/${p._id}`} className="card p-5 block hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm leading-snug pr-2" style={{ color: 'var(--color-text)' }}>{p.name}</h3>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
                {p.description || 'No description'}
              </p>
              <div className="flex items-center justify-between">
                <PriorityBadge priority={p.priority} />
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {p.employees?.length || 0} members
                </span>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-sm text-center py-10" style={{ color: 'var(--color-text-muted)' }}>
              No projects found
            </p>
          )}
        </div>
      )}

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreated={() => dispatch(fetchProjects())}
        />
      )}
    </div>
  );
}
