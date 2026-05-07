import { theme } from '../../styles/theme.js';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants.js';

export function StatusBadge({ status }) {
  const colors = theme.statusColors[status] || { bg: '#f3f4f6', text: '#374151' };
  return (
    <span
      className="badge"
      style={{ background: colors.bg, color: colors.text }}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const colors = theme.priorityColors[priority] || { bg: '#f3f4f6', text: '#374151' };
  return (
    <span
      className="badge"
      style={{ background: colors.bg, color: colors.text }}
    >
      {PRIORITY_LABELS[priority] || priority}
    </span>
  );
}
