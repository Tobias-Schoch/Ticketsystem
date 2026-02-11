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
    title: 'Büropflanze "Herbert" gießen',
    description: 'Herbert, die Monstera im Eingangsbereich, sieht traurig aus. Letzte Woche hat ihn niemand gegossen und jetzt hängen die Blätter. Bitte rettet Herbert! 🌱',
    status: 'open',
    priority: 'critical',
    assigneeId: 'user-3',
    creatorId: 'user-1',
    dueDate: daysFromNow(1),
    images: [],
    comments: [
      {
        id: 'comment-1',
        ticketId: 'ticket-1',
        authorId: 'user-3',
        content: 'Ich übernehme die Herbert-Rettungsmission! 🚑',
        createdAt: daysAgo(0),
      },
    ],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(0),
  },
  {
    id: 'ticket-2',
    title: 'Kühlschrank-Archäologie durchführen',
    description: 'Im Kühlschrank befinden sich Objekte unbekannten Alters. Etwas Grünes in der hinteren Ecke hat angefangen, mit mir zu kommunizieren. Dringende Expedition erforderlich.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'user-2',
    creatorId: 'user-1',
    dueDate: daysFromNow(2),
    images: [],
    comments: [
      {
        id: 'comment-2',
        ticketId: 'ticket-2',
        authorId: 'user-2',
        content: 'Habe Schutzhandschuhe bestellt. Wir gehen kein Risiko ein.',
        createdAt: daysAgo(1),
      },
    ],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
  {
    id: 'ticket-3',
    title: 'Kaffeemaschine besänftigen',
    description: 'Die Kaffeemaschine macht seit heute Morgen bedrohliche Geräusche und hat zweimal den Milchaufschäumer als Wasserwerfer eingesetzt. Diplomatie oder Exorzismus erforderlich.',
    status: 'review',
    priority: 'critical',
    assigneeId: 'user-4',
    creatorId: 'user-2',
    dueDate: daysFromNow(1),
    images: [],
    comments: [
      {
        id: 'comment-3',
        ticketId: 'ticket-3',
        authorId: 'user-4',
        content: 'Entkalker war die Lösung. Sie schnurrt wieder wie ein Kätzchen.',
        createdAt: daysAgo(0),
      },
    ],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(0),
  },
  {
    id: 'ticket-4',
    title: 'Meeting-Marathon überleben',
    description: 'Am Donnerstag stehen 6 Meetings hintereinander an. Snack-Vorräte anlegen, Koffein-Infusion vorbereiten und einen Fluchtplan für den Notfall erstellen.',
    status: 'open',
    priority: 'medium',
    assigneeId: null,
    creatorId: 'user-2',
    dueDate: daysFromNow(3),
    images: [],
    comments: [],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'ticket-5',
    title: 'Bürostuhl-Quietschen eliminieren',
    description: 'Der Bürostuhl von Arbeitsplatz 7 quietscht bei jeder Bewegung wie eine traurige Möwe. Die Kollegen planen bereits eine Intervention. WD-40 oder neuer Stuhl?',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-5',
    creatorId: 'user-3',
    dueDate: daysAgo(2),
    images: [],
    comments: [],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
  },
  {
    id: 'ticket-6',
    title: 'Geheimes Snack-Versteck auffüllen',
    description: 'Die Notfall-Schokolade in der dritten Schublade ist aufgebraucht. Dies ist ein Code-Rot-Situation. Bitte diskret nachfüllen, bevor jemand einen schlechten Tag hat.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'user-2',
    creatorId: 'user-1',
    dueDate: daysFromNow(1),
    images: [],
    comments: [
      {
        id: 'comment-4',
        ticketId: 'ticket-6',
        authorId: 'user-2',
        content: 'Mission läuft. Habe Schoko-Nachschub im Rucksack. Niemand hat etwas bemerkt. 🍫',
        createdAt: daysAgo(0),
      },
    ],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(0),
  },
  {
    id: 'ticket-7',
    title: 'Drucker-Papierstau-Flüsterer finden',
    description: 'Der Drucker hat wieder Papierstau. Zum 47. Mal diese Woche. Wir brauchen jemanden, der sanft mit ihm redet und seine Gefühle versteht. Oder einen Hammer.',
    status: 'open',
    priority: 'medium',
    assigneeId: 'user-4',
    creatorId: 'user-3',
    dueDate: daysFromNow(5),
    images: [],
    comments: [],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'ticket-8',
    title: 'WLAN-Passwort für Besucher merken',
    description: 'Das WLAN-Passwort ist "Kb7$mP2x!qL9nR" und niemand kann es sich merken. Entweder einen QR-Code erstellen oder das Passwort auf "Gast1234" ändern. Diskussion erwünscht.',
    status: 'done',
    priority: 'low',
    assigneeId: 'user-1',
    creatorId: 'user-4',
    dueDate: daysAgo(5),
    images: [],
    comments: [],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(6),
  },
];
