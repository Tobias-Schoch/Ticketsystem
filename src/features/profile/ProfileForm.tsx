import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../stores/toastStore';

export function ProfileForm() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const validate = () => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name muss mindestens 2 Zeichen lang sein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await updateUser({ name: name.trim() });
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
        value={user?.email || ''}
        disabled
        hint="E-Mail-Adresse kann derzeit nicht geändert werden"
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          Änderungen speichern
        </Button>
      </div>
    </form>
  );
}
