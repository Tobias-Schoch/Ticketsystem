import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useUserStore } from '../../stores/userStore';
import { useToast } from '../../stores/toastStore';
import { verifyPassword } from '../../utils/passwordGenerator';
import { getStorageItem } from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants';
import type { UserWithPassword } from '../../data/mockUsers';

export function PasswordChangeForm() {
  const { user } = useAuth();
  const changePassword = useUserStore((state) => state.changePassword);
  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Aktuelles Passwort ist erforderlich';
    } else {
      // Verify current password
      const users = getStorageItem<UserWithPassword[]>(STORAGE_KEYS.USERS) || [];
      const currentUser = users.find((u) => u.id === user?.id);
      if (currentUser && !verifyPassword(currentPassword, currentUser.passwordHash)) {
        newErrors.currentPassword = 'Falsches Passwort';
      }
    }

    if (!newPassword) {
      newErrors.newPassword = 'Neues Passwort ist erforderlich';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mindestens 6 Zeichen erforderlich';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Passwort bestätigen ist erforderlich';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !user) return;

    setIsLoading(true);
    try {
      changePassword(user.id, newPassword);
      toast.success('Passwort geändert');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          label="Aktuelles Passwort"
          type={showPasswords ? 'text' : 'password'}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={errors.currentPassword}
        />
      </div>

      <div className="relative">
        <Input
          label="Neues Passwort"
          type={showPasswords ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
        />
      </div>

      <div className="relative">
        <Input
          label="Neues Passwort bestätigen"
          type={showPasswords ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowPasswords(!showPasswords)}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
        >
          {showPasswords ? (
            <>
              <EyeOff className="h-4 w-4" /> Passwörter verbergen
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" /> Passwörter anzeigen
            </>
          )}
        </button>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          Passwort ändern
        </Button>
      </div>
    </form>
  );
}
