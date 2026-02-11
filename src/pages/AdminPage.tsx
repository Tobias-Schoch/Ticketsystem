import { useState } from 'react';
import { UserPlus, Users, Shield, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { UserManagement, InviteUserForm } from '../features/admin';

export function AdminPage() {
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-warmth-50 via-sand-50 to-sand-100 dark:from-warmth-900/30 dark:via-sage-900/50 dark:to-sage-900/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-sand-200 dark:border-sage-700">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-warmth-600 dark:text-warmth-400 mb-1 sm:mb-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Team verwalten</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-sage-800 dark:text-sage-100">
              Dein Team
            </h1>
            <p className="text-sage-500 dark:text-sage-400 mt-1 text-sm sm:text-base">
              Lade neue Mitglieder ein und verwalte das Team
            </p>
          </div>
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-warmth-200/30 dark:bg-warmth-700/20 rounded-full blur-2xl" />
          <Sparkles className="absolute bottom-4 right-6 sm:right-8 h-5 sm:h-6 w-5 sm:w-6 text-warmth-300 dark:text-warmth-600 animate-float hidden sm:block" />
        </div>

        <Button onClick={() => setShowInviteDialog(true)} className="w-full sm:w-auto h-12 sm:h-14 px-4 sm:px-6">
          <UserPlus className="h-5 w-5 mr-2" />
          Einladen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-sage-400" />
            Team-Mitglieder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserManagement />
        </CardContent>
      </Card>

      <Dialog
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        title="Neues Mitglied einladen"
        description="Ein temporäres Passwort wird automatisch erstellt"
        size="sm"
      >
        <InviteUserForm />
      </Dialog>
    </div>
  );
}
