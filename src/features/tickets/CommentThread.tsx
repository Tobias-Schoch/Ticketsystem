import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { Avatar } from '../../components/ui/Avatar';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';
import { useTickets } from '../../hooks/useTickets';
import { useUserStore } from '../../stores/userStore';
import { formatRelativeTime } from '../../utils/dateUtils';
import type { Comment } from '../../types';

interface CommentThreadProps {
  ticketId: string;
  comments: Comment[];
}

export function CommentThread({ ticketId, comments }: CommentThreadProps) {
  const { user, isAdmin } = useAuth();
  const { addComment, deleteComment } = useTickets();
  const getUserById = useUserStore((state) => state.getUserById);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      addComment(ticketId, user.id, newComment.trim());
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteComment(ticketId, deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
        Kommentare ({comments.length})
      </h3>

      {/* Comment list */}
      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => {
            const author = getUserById(comment.authorId);
            const canDelete = isAdmin || comment.authorId === user?.id;

            return (
              <Card key={comment.id} padding="sm">
                <div className="flex items-start gap-3">
                  {author && (
                    <Avatar src={author.avatarUrl} name={author.name} size="sm" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {author?.name || 'Unbekannt'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                          onClick={() => setDeleteId(comment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Schreibe einen Kommentar..."
          className="min-h-[80px]"
        />
        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting} disabled={!newComment.trim()}>
            Kommentar hinzufügen
          </Button>
        </div>
      </form>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Kommentar löschen"
        description="Möchtest du diesen Kommentar wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmLabel="Löschen"
        variant="danger"
      />
    </div>
  );
}
