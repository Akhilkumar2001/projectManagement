import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import userService from '../../services/userService.js';

const ROLES = ['admin', 'employee', 'client'];

function AddUserModal({ onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { role: 'employee' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await userService.create(data);
      toast.success('User created');
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Add User</h2>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input className="input" placeholder="John Doe"
              {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Email *</label>
            <input type="email" className="input" placeholder="john@company.com"
              {...register('email', { required: 'Email is required' })} />
            {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Password *</label>
            <input type="password" className="input" placeholder="Min 6 characters"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
            {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{errors.password.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Role *</label>
              <select className="input" {...register('role')}>
                {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" placeholder="+91 9999999999" {...register('phone')} />
            </div>
          </div>

          <div>
            <label className="label">Department</label>
            <input className="input" placeholder="Engineering" {...register('department')} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Creating…' : 'Create User'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Users() {
  const { user: me }          = useSelector((s) => s.auth);
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    userService.getAll()
      .then(({ data }) => setUsers(data.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleToggleActive = async (u) => {
    // Block self-deactivation on frontend too
    if (u._id === me?._id) {
      toast.error('You cannot deactivate your own account');
      return;
    }
    try {
      await userService.update(u._id, { isActive: !u.isActive });
      toast.success(`User ${u.isActive ? 'deactivated' : 'activated'}`);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Users</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add User
        </button>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                {['Name', 'Email', 'Role', 'Department', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-text)' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--color-primary)' }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      {u.name}
                      {u._id === me?._id && (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>{u.email}</td>
                  <td className="px-4 py-3 capitalize" style={{ color: 'var(--color-text-muted)' }}>{u.role}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>{u.department || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="badge" style={u.isActive
                      ? { background: '#dcfce7', color: '#15803d' }
                      : { background: '#fee2e2', color: '#b91c1c' }
                    }>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u._id !== me?._id ? (
                      <button
                        onClick={() => handleToggleActive(u)}
                        className="text-xs underline"
                        style={{ color: u.isActive ? 'var(--color-danger)' : 'var(--color-success)' }}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          onCreated={loadUsers}
        />
      )}
    </div>
  );
}
