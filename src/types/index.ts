// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: 'admin' | 'member';
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Ticket Types
export type TicketStatus = 'open' | 'in-progress' | 'review' | 'done';
export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';

export interface TicketImage {
  id: string;
  url: string;
  name: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId: string | null;
  creatorId: string;
  dueDate: string | null;
  images: TicketImage[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

// Filter Types
export interface TicketFilters {
  status: TicketStatus | 'all';
  priority: TicketPriority | 'all';
  assigneeId: string | 'all';
  search: string;
}

// Toast Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// UI Types
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
}
