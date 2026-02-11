import type { Ticket } from '../types';

// Helper to create dates relative to today
const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const mockTickets: Ticket[] = [
  {
    id: 'ticket-1',
    title: 'Blumen für das Büro bestellen',
    description: 'Die Pflanzen im Empfangsbereich brauchen dringend Ersatz. Am besten pflegeleichte Grünpflanzen, die nicht so viel Licht brauchen.',
    status: 'open',
    priority: 'medium',
    assigneeId: 'user-3',
    creatorId: 'user-1',
    dueDate: daysFromNow(5),
    images: [],
    comments: [
      {
        id: 'comment-1',
        ticketId: 'ticket-1',
        authorId: 'user-3',
        content: 'Ich schau mal bei der Gärtnerei um die Ecke vorbei!',
        createdAt: daysAgo(1),
      },
    ],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
  {
    id: 'ticket-2',
    title: 'Geburtstagskarte für Frau Meier',
    description: 'Frau Meier hat nächste Woche Geburtstag. Bitte eine schöne Karte besorgen und alle unterschreiben lassen.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'user-2',
    creatorId: 'user-1',
    dueDate: daysFromNow(3),
    images: [],
    comments: [],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: 'ticket-3',
    title: 'Kaffeemaschine reparieren lassen',
    description: 'Die Kaffeemaschine in der Küche macht komische Geräusche und der Kaffee schmeckt nicht mehr richtig. Kundendienst anrufen!',
    status: 'review',
    priority: 'critical',
    assigneeId: 'user-4',
    creatorId: 'user-2',
    dueDate: daysFromNow(1),
    images: [],
    comments: [
      {
        id: 'comment-2',
        ticketId: 'ticket-3',
        authorId: 'user-4',
        content: 'Techniker kommt morgen zwischen 10 und 12 Uhr.',
        createdAt: daysAgo(0),
      },
    ],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(0),
  },
  {
    id: 'ticket-4',
    title: 'Parkplatzbeschilderung erneuern',
    description: 'Die Schilder auf dem Parkplatz sind verblasst und schwer lesbar. Neue Schilder bestellen.',
    status: 'done',
    priority: 'low',
    assigneeId: 'user-5',
    creatorId: 'user-1',
    dueDate: daysAgo(2),
    images: [],
    comments: [],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(3),
  },
  {
    id: 'ticket-5',
    title: 'Teamessen für Freitag organisieren',
    description: 'Wir wollen am Freitag gemeinsam essen gehen. Restaurant reservieren und alle informieren. Budget: ca. 25€ pro Person.',
    status: 'open',
    priority: 'medium',
    assigneeId: null,
    creatorId: 'user-2',
    dueDate: daysFromNow(4),
    images: [],
    comments: [],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'ticket-6',
    title: 'Erste-Hilfe-Kasten auffüllen',
    description: 'Bei der letzten Kontrolle fehlten Pflaster und Verbandsmaterial. Bitte zeitnah auffüllen - ist gesetzlich vorgeschrieben!',
    status: 'in-progress',
    priority: 'critical',
    assigneeId: 'user-2',
    creatorId: 'user-1',
    dueDate: daysFromNow(2),
    images: [],
    comments: [
      {
        id: 'comment-3',
        ticketId: 'ticket-6',
        authorId: 'user-2',
        content: 'Habe alles bei der Apotheke bestellt, kommt morgen.',
        createdAt: daysAgo(0),
      },
    ],
    createdAt: daysAgo(4),
    updatedAt: daysAgo(0),
  },
  {
    id: 'ticket-7',
    title: 'Fenster putzen lassen',
    description: 'Die Fenster im Großraumbüro sind ziemlich verschmutzt. Reinigungsfirma kontaktieren für einen Termin.',
    status: 'open',
    priority: 'low',
    assigneeId: 'user-5',
    creatorId: 'user-3',
    dueDate: daysFromNow(14),
    images: [],
    comments: [],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: 'ticket-8',
    title: 'Drucker-Papier nachbestellen',
    description: 'Nur noch 2 Pakete Kopierpapier im Lager. Mindestens 10 Pakete nachbestellen.',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-4',
    creatorId: 'user-1',
    dueDate: daysAgo(5),
    images: [],
    comments: [],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(6),
  },
];
