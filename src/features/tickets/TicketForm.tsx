import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { UserSelect } from '../../components/common/UserSelect';
import { useTickets } from '../../hooks/useTickets';
import { useAuth } from '../../hooks/useAuth';
import { PRIORITIES } from '../../constants';
import type { TicketPriority } from '../../types';

interface TicketFormProps {
  mode?: 'create' | 'edit';
  initialData?: {
    title: string;
    description: string;
    priority: TicketPriority;
    assigneeId: string | null;
    dueDate: string | null;
  };
  ticketId?: string;
}

export function TicketForm({ mode = 'create', initialData, ticketId }: TicketFormProps) {
  const navigate = useNavigate();
  const { createTicket, updateTicket } = useTickets();
  const { user } = useAuth();

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<TicketPriority>(initialData?.priority || 'medium');
  const [assigneeId, setAssigneeId] = useState(initialData?.assigneeId || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? initialData.dueDate.split('T')[0] : '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Bitte gib einen Titel ein';
    } else if (title.length < 3) {
      newErrors.title = 'Der Titel sollte mindestens 3 Zeichen haben';
    }

    if (!description.trim()) {
      newErrors.description = 'Bitte beschreibe die Aufgabe kurz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !user) return;

    setIsLoading(true);

    try {
      const dueDateISO = dueDate ? new Date(dueDate).toISOString() : null;

      if (mode === 'create') {
        const ticket = await createTicket({
          title: title.trim(),
          description: description.trim(),
          priority,
          assigneeId: assigneeId || null,
          creatorId: user.id,
          dueDate: dueDateISO,
        });
        navigate(`/aufgaben/${ticket.id}`);
      } else if (ticketId) {
        await updateTicket(ticketId, {
          title: title.trim(),
          description: description.trim(),
          priority,
          assigneeId: assigneeId || null,
          dueDate: dueDateISO,
        });
        navigate(`/aufgaben/${ticketId}`);
      }
    } catch {
      // Error is handled by useTickets hook with toast
    } finally {
      setIsLoading(false);
    }
  };

  // Get tomorrow's date as minimum for date picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Was soll erledigt werden?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="z.B. Blumen für das Büro bestellen"
        error={errors.title}
      />

      <Textarea
        label="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Weitere Details zur Aufgabe..."
        hint="Je genauer die Beschreibung, desto besser"
        error={errors.description}
        className="min-h-[120px]"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Wie wichtig ist es?"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TicketPriority)}
          options={PRIORITIES.map((p) => ({ value: p.value, label: p.label }))}
        />

        <div>
          <label className="block text-sm font-medium text-sage-600 dark:text-sage-300 mb-2">
            Bis wann?
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sage-400 dark:text-sage-500" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={minDate}
              className="w-full h-12 pl-12 pr-4 rounded-2xl text-sm bg-white/60 dark:bg-sage-800/60 backdrop-blur-sm border-2 border-sage-100 dark:border-sage-700 text-sage-800 dark:text-sage-100 focus:outline-none focus:border-calm-400 dark:focus:border-calm-500 focus:ring-4 focus:ring-calm-100 dark:focus:ring-calm-900/30 transition-all duration-300"
            />
          </div>
          <p className="mt-2 text-xs text-sage-400 dark:text-sage-500">Optional - leer lassen wenn kein Termin</p>
        </div>
      </div>

      <UserSelect
        label="Wer soll sich darum kümmern?"
        value={assigneeId}
        onChange={setAssigneeId}
        includeUnassigned
        placeholder="Noch niemand zugewiesen"
      />

      <p className="text-sm text-sage-500 dark:text-sage-400">
        Bilder können nach dem Erstellen der Aufgabe hinzugefügt werden.
      </p>

      <div className="flex justify-end gap-3 pt-6 border-t border-sage-100 dark:border-sage-700">
        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
          Abbrechen
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === 'create' ? 'Aufgabe erstellen' : 'Änderungen speichern'}
        </Button>
      </div>
    </form>
  );
}
