// ─── App Config ────────────────────────────────────────────────
// In dev: VITE_API_URL is empty → API_URL = '/api' → Vite proxy forwards to backend (no CORS)
// In prod: set VITE_API_URL=https://yourserver.com → API_URL = 'https://yourserver.com/api'
export const BASE_URL = import.meta.env.VITE_API_URL || '';
export const API_URL  = `${BASE_URL}/api`;

// ─── Roles ─────────────────────────────────────────────────────
export const ROLES = {
  ADMIN:    'admin',
  EMPLOYEE: 'employee',
  CLIENT:   'client',
};

// ─── Statuses ──────────────────────────────────────────────────
export const TASK_STATUSES = ['todo', 'in_progress', 'submitted', 'approved', 'rejected'];

export const PROJECT_STATUSES = ['planning', 'active', 'on_hold', 'completed', 'cancelled'];

export const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export const STATUS_LABELS = {
  todo:        'To Do',
  in_progress: 'In Progress',
  submitted:   'Submitted',
  approved:    'Approved',
  rejected:    'Rejected',
  planning:    'Planning',
  active:      'Active',
  on_hold:     'On Hold',
  completed:   'Completed',
  cancelled:   'Cancelled',
};

export const PRIORITY_LABELS = {
  low:    'Low',
  medium: 'Medium',
  high:   'High',
  urgent: 'Urgent',
};

// ─── API Endpoints ─────────────────────────────────────────────
export const ENDPOINTS = {
  AUTH:      '/auth',
  USERS:     '/users',
  PROJECTS:  '/projects',
  TASKS:     '/tasks',
  SUBTASKS:  '/subtasks',
  ACTIVITY:  '/activity',
};
