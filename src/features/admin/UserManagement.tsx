import { useState } from 'react';
import { UserX, UserCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ConfirmDialog } from '../../components/feedback/ConfirmDialog';
import { useUserStore } from '../../stores/userStore';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../stores/toastStore';
import { formatDate } from '../../utils/dateUtils';

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const { users, deactivateUser, activateUser } = useUserStore();
  const toast = useToast();

  const [actionUser, setActionUser] = useState<{ id: string; action: 'deactivate' | 'activate' } | null>(null);

  const handleAction = () => {
    if (!actionUser) return;

    if (actionUser.action === 'deactivate') {
      deactivateUser(actionUser.id);
      toast.success('Benutzer deaktiviert');
    } else {
      activateUser(actionUser.id);
      toast.success('Benutzer aktiviert');
    }
    setActionUser(null);
  };

  return (
    <div className="space-y-4">
      {users.map((user) => {
        const isCurrentUser = user.id === currentUser?.id;

        return (
          <Card key={user.id}>
            <div className="flex items-center gap-4">
              <Avatar src={user.avatarUrl} name={user.name} size="lg" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                  </h3>
                  {isCurrentUser && (
                    <Badge>Du</Badge>
                  )}
                  <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : ''}>
                    {user.role === 'admin' ? 'Admin' : 'Mitglied'}
                  </Badge>
                  {!user.isActive && (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      Inaktiv
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Mitglied seit {formatDate(user.createdAt)}
                </p>
              </div>

              {!isCurrentUser && (
                <div className="relative">
                  {user.isActive ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActionUser({ id: user.id, action: 'deactivate' })}
                      className="text-red-500 hover:text-red-600"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Deaktivieren
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActionUser({ id: user.id, action: 'activate' })}
                      className="text-green-500 hover:text-green-600"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Aktivieren
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        );
      })}

      <ConfirmDialog
        isOpen={!!actionUser}
        onClose={() => setActionUser(null)}
        onConfirm={handleAction}
        title={actionUser?.action === 'deactivate' ? 'Benutzer deaktivieren' : 'Benutzer aktivieren'}
        description={
          actionUser?.action === 'deactivate'
            ? 'Der Benutzer kann sich nicht mehr anmelden. Du kannst ihn später wieder aktivieren.'
            : 'Der Benutzer kann sich wieder anmelden.'
        }
        confirmLabel={actionUser?.action === 'deactivate' ? 'Deaktivieren' : 'Aktivieren'}
        variant={actionUser?.action === 'deactivate' ? 'danger' : 'default'}
      />
    </div>
  );
}
