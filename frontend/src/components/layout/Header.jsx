import { useDispatch, useSelector } from 'react-redux';
import { LogOut, Bell } from 'lucide-react';
import { logout } from '../../store/slices/authSlice.js';

export default function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <div />

      <div className="flex items-center gap-3">
        <button
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Bell size={18} />
        </button>

        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
          {user?.name}
        </span>

        <button
          onClick={() => dispatch(logout())}
          className="btn-outline flex items-center gap-2 text-sm px-3 py-1.5"
          title="Logout"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </header>
  );
}
