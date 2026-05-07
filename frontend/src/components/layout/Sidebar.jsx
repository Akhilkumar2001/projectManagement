import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard, FolderKanban, CheckSquare,
  Users, ActivitySquare, UserCircle, Megaphone,
} from 'lucide-react';
import logo from '../../assets/logo.svg';
import { ROLES } from '../../utils/constants.js';

const navSections = [
  {
    title: 'Workspace',
    items: [
      { to: '/',          label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'employee', 'client'] },
      { to: '/projects',  label: 'Projects',  icon: FolderKanban,    roles: ['admin', 'employee', 'client'] },
      { to: '/tasks',     label: 'Tasks',     icon: CheckSquare,     roles: ['admin', 'employee'] },
      { to: '/campaigns', label: 'Campaigns', icon: Megaphone,       roles: [ROLES.ADMIN] },
    ],
  },
  {
    title: 'Admin',
    items: [
      { to: '/users',    label: 'Users',    icon: Users,          roles: [ROLES.ADMIN] },
      { to: '/activity', label: 'Activity', icon: ActivitySquare, roles: [ROLES.ADMIN] },
    ],
  },
  {
    title: 'Account',
    items: [
      { to: '/profile', label: 'Profile', icon: UserCircle, roles: ['admin', 'employee', 'client'] },
    ],
  },
];

export default function Sidebar() {
  const { user } = useSelector((s) => s.auth);

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col border-r"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <img src={logo} alt="ProjectFlow" className="h-7" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => !user || item.roles.includes(user.role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-5 last:mb-0">
              <p className="px-3 mb-1.5 text-[10px] uppercase tracking-wider font-semibold"
                style={{ color: 'var(--color-text-muted)' }}>
                {section.title}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  >
                    <Icon size={17} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User badge */}
      {user && (
        <div
          className="px-4 py-3 border-t flex items-center gap-3"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
            style={{ background: 'var(--color-primary)' }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{user.name}</p>
            <p className="text-xs capitalize" style={{ color: 'var(--color-text-muted)' }}>{user.role}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
