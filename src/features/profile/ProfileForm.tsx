import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../stores/toastStore';

export function ProfileForm() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const isAdministrator = user?.role === 'administrator';

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name muss mindestens 2 Zeichen lang sein';
    }

    if (isAdministrator) {
      if (!email.trim()) {
        newErrors.email = 'E-Mail ist erforderlich';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Ungültige E-Mail-Adresse';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      const updates: { name: string; email?: string } = { name: name.trim() };

      // Only include email if administrator and email changed
      if (isAdministrator && email.trim() !== user?.email) {
        updates.email = email.trim();
      }

      await updateUser(updates);
      toast.success('Profil aktualisiert');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fehler beim Speichern';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />

      <Input
        label="E-Mail"
        type="email"
        value={isAdministrator ? email : user?.email || ''}
        onChange={isAdministrator ? (e) => setEmail(e.target.value) : undefined}
        disabled={!isAdministrator}
        error={errors.email}
        hint={
          isAdministrator
            ? 'Als Administrator kannst du deine E-Mail-Adresse ändern'
            : 'Nur Administratoren können E-Mail-Adressen ändern'
        }
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          Änderungen speichern
        </Button>
      </div>
    </form>
  );
}
