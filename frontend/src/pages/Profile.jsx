import { useSelector } from 'react-redux';

export default function Profile() {
  const { user } = useSelector((s) => s.auth);

  if (!user) return null;

  const fields = [
    { label: 'Full Name',   value: user.name },
    { label: 'Email',       value: user.email },
    { label: 'Role',        value: user.role,       capitalize: true },
    { label: 'Department',  value: user.department || '—' },
    { label: 'Phone',       value: user.phone       || '—' },
  ];

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="page-title">Profile</h1>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: 'var(--color-primary)' }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>{user.name}</p>
            <p className="text-sm capitalize" style={{ color: 'var(--color-text-muted)' }}>{user.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map(({ label, value, capitalize }) => (
            <div key={label} className="flex justify-between text-sm">
              <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
              <span className={capitalize ? 'capitalize' : ''} style={{ color: 'var(--color-text)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
