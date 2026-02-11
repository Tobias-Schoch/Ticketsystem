import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ProfileForm, AvatarUpload, PasswordChangeForm } from '../features/profile';
import { User, Sparkles, Lock } from 'lucide-react';

export function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sand-100 via-sand-50 to-warmth-50 dark:from-sage-900/30 dark:via-sage-900/50 dark:to-warmth-900/30 rounded-3xl p-8 border border-sand-200 dark:border-sage-700">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-warmth-600 dark:text-warmth-400 mb-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">Mein Profil</span>
          </div>
          <h1 className="text-2xl font-semibold text-sage-800 dark:text-sage-100">
            Dein persönlicher Bereich
          </h1>
          <p className="text-sage-500 dark:text-sage-400 mt-1">
            Passe dein Profil nach deinen Wünschen an
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-warmth-200/30 dark:bg-warmth-700/20 rounded-full blur-2xl" />
        <Sparkles className="absolute bottom-4 right-8 h-6 w-6 text-warmth-300 dark:text-warmth-600 animate-float" />
      </div>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Dein Bild</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUpload />
        </CardContent>
      </Card>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Persönliche Daten</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-sage-400" />
            Passwort ändern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>
    </div>
  );
}
