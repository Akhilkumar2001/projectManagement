/**
 * CENTRALIZED THEME CONFIG
 * Change colors/fonts here → updates everywhere (Tailwind + CSS vars + components)
 */
export const theme = {
  colors: {
    // Brand primary — change this to rebrand the whole app
    primary: {
      50:  '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // main
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50:  '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',  // main
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    accent: {
      50:  '#fdf4ff',
      100: '#fae8ff',
      500: '#a855f7',  // main
      600: '#9333ea',
    },
    success: {
      50:  '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50:  '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    danger: {
      50:  '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
    neutral: {
      0:   '#ffffff',
      50:  '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  fonts: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },

  radius: {
    brand: '0.625rem', // 10px — used on cards, buttons, inputs
  },

  // Status badge colors mapped to task/project statuses
  statusColors: {
    todo:        { bg: '#f3f4f6', text: '#374151' },
    in_progress: { bg: '#dbeafe', text: '#1d4ed8' },
    submitted:   { bg: '#fae8ff', text: '#7e22ce' },
    approved:    { bg: '#dcfce7', text: '#15803d' },
    rejected:    { bg: '#fee2e2', text: '#b91c1c' },
    planning:    { bg: '#f3f4f6', text: '#374151' },
    active:      { bg: '#dbeafe', text: '#1d4ed8' },
    on_hold:     { bg: '#fef9c3', text: '#92400e' },
    completed:   { bg: '#dcfce7', text: '#15803d' },
    cancelled:   { bg: '#fee2e2', text: '#b91c1c' },
  },

  // Priority badge colors
  priorityColors: {
    low:    { bg: '#f0fdf4', text: '#15803d' },
    medium: { bg: '#fffbeb', text: '#92400e' },
    high:   { bg: '#fff7ed', text: '#c2410c' },
    urgent: { bg: '#fef2f2', text: '#b91c1c' },
  },
};

// CSS custom properties injected into :root — used in index.css
export const cssVars = `
  --color-primary:    ${theme.colors.primary[500]};
  --color-primary-dark: ${theme.colors.primary[700]};
  --color-primary-light: ${theme.colors.primary[100]};
  --color-secondary:  ${theme.colors.secondary[500]};
  --color-accent:     ${theme.colors.accent[500]};
  --color-success:    ${theme.colors.success[500]};
  --color-warning:    ${theme.colors.warning[500]};
  --color-danger:     ${theme.colors.danger[500]};
  --color-bg:         ${theme.colors.neutral[50]};
  --color-surface:    ${theme.colors.neutral[0]};
  --color-border:     ${theme.colors.neutral[200]};
  --color-text:       ${theme.colors.neutral[900]};
  --color-text-muted: ${theme.colors.neutral[500]};
  --font-sans:        ${theme.fonts.sans.join(', ')};
  --radius-brand:     ${theme.radius.brand};
`;
