import type { TicketStatus, TicketPriority } from '../types';

export const STORAGE_KEYS = {
  AUTH: 'aufgaben_auth',
  TICKETS: 'aufgaben_tickets',
  USERS: 'aufgaben_users',
  THEME: 'aufgaben_theme',
  SIDEBAR: 'aufgaben_sidebar',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  BOARD: '/board',
  TICKETS: '/aufgaben',
  TICKET_NEW: '/aufgaben/neu',
  TICKET_DETAIL: '/aufgaben/:id',
  PROFILE: '/profil',
  ADMIN: '/team',
} as const;

export const PRIORITIES: { value: TicketPriority; label: string; color: string }[] = [
  { value: 'critical', label: 'Dringend', color: '#e07a5f' },
  { value: 'high', label: 'Wichtig', color: '#f2b880' },
  { value: 'medium', label: 'Normal', color: '#c9cba3' },
  { value: 'low', label: 'Irgendwann', color: '#89c5c4' },
];

export const STATUSES: { value: TicketStatus; label: string; color: string }[] = [
  { value: 'open', label: 'Offen', color: '#89c5c4' },
  { value: 'in-progress', label: 'In Arbeit', color: '#c9cba3' },
  { value: 'review', label: 'Zur Prüfung', color: '#dda0a0' },
  { value: 'done', label: 'Erledigt', color: '#a8c69f' },
];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  'open': 'Offen',
  'in-progress': 'In Arbeit',
  'review': 'Zur Prüfung',
  'done': 'Erledigt',
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  'critical': 'Dringend',
  'high': 'Wichtig',
  'medium': 'Normal',
  'low': 'Irgendwann',
};
