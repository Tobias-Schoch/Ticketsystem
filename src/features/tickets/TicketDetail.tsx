import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Avatar } from '../../components/ui/Avatar';
import { Lightbox } from '../../components/common/Lightbox';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { UserSelect } from '../../components/common/UserSelect';
import { CommentThread } from './CommentThread';
import { useAuth } from '../../hooks/useAuth';
import { useTickets } from '../../hooks/useTickets';
import { useUserStore } from '../../stores/userStore';
import { formatDateTime } from '../../utils/dateUtils';
import { STATUSES, PRIORITIES, STATUS_LABELS, PRIORITY_LABELS, ROUTES } from '../../constants';
import type { Ticket, TicketStatus, TicketPriority } from '../../types';

interface TicketDetailProps {
  ticket: Ticket;
}

export function TicketDetail({ ticket }: TicketDetailProps) {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const { updateTicket, deleteTicket } = useTickets();
  const getUserById = useUserStore((state) => state.getUserById);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const creator = getUserById(ticket.creatorId);
  const assignee = ticket.assigneeId ? getUserById(ticket.assigneeId) : null;
  const canEdit = isAdmin || ticket.creatorId === user?.id;

  const handleStatusChange = async (status: TicketStatus) => {
    try {
      await updateTicket(ticket.id, { status });
    } catch {
      // Error handled by useTickets
    }
  };

  const handlePriorityChange = async (priority: TicketPriority) => {
    try {
      await updateTicket(ticket.id, { priority });
    } catch {
      // Error handled by useTickets
    }
  };

  const handleAssigneeChange = async (assigneeId: string) => {
    try {
      await updateTicket(ticket.id, { assigneeId: assigneeId || null });
    } catch {
      // Error handled by useTickets
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTicket(ticket.id);
      navigate(ROUTES.TICKETS);
    } catch {
      // Error handled by useTickets
      setIsDeleting(false);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Zurück
      </Button>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left column - Ticket info */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
          <Card>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge variant="status" status={ticket.status}>
                  {STATUS_LABELS[ticket.status]}
                </Badge>
                <Badge variant="priority" priority={ticket.priority}>
                  {PRIORITY_LABELS[ticket.priority]}
                </Badge>
              </div>

              {canEdit && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/aufgaben/${ticket.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-sage-900 dark:text-sage-100 mb-3 sm:mb-4">
              {ticket.title}
            </h1>

            {/* Description */}
            <p className="text-sage-600 dark:text-sage-300 whitespace-pre-wrap">
              {ticket.description}
            </p>

            {/* Images */}
            {ticket.images.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-sage-900 dark:text-sage-100 mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Bilder ({ticket.images.length})
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {ticket.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => openLightbox(index)}
                      className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Meta info */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-sage-200 dark:border-sage-700">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-sage-500 dark:text-sage-400">
                {creator && (
                  <div className="flex items-center gap-2">
                    <Avatar src={creator.avatarUrl} name={creator.name} size="sm" />
                    <span>Erstellt von {creator.name}</span>
                  </div>
                )}
                <span>am {formatDateTime(ticket.createdAt)}</span>
              </div>
            </div>
          </Card>

          {/* Comments */}
          <Card>
            <CommentThread ticketId={ticket.id} comments={ticket.comments} />
          </Card>
        </div>

        {/* Right column - Actions */}
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          <Card>
            <h3 className="font-semibold text-sage-900 dark:text-sage-100 mb-4">
              Details
            </h3>

            <div className="space-y-4">
              <Select
                label="Status"
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                options={STATUSES.map((s) => ({ value: s.value, label: s.label }))}
              />

              <Select
                label="Priorität"
                value={ticket.priority}
                onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
                options={PRIORITIES.map((p) => ({ value: p.value, label: p.label }))}
              />

              <UserSelect
                label="Zugewiesen an"
                value={ticket.assigneeId || ''}
                onChange={handleAssigneeChange}
                includeUnassigned
              />
            </div>
          </Card>

          {assignee && (
            <Card>
              <h3 className="font-semibold text-sage-900 dark:text-sage-100 mb-4">
                Zugewiesen
              </h3>
              <div className="flex items-center gap-3">
                <Avatar src={assignee.avatarUrl} name={assignee.name} />
                <div>
                  <p className="font-medium text-sage-900 dark:text-sage-100">
                    {assignee.name}
                  </p>
                  <p className="text-sm text-sage-500 dark:text-sage-400">
                    {assignee.email}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={ticket.images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Aufgabe löschen"
        description="Möchtest du diese Aufgabe wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmLabel="Löschen"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
