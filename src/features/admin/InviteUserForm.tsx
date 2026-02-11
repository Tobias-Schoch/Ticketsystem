import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { useUserStore } from '../../stores/userStore';
import { useToast } from '../../stores/toastStore';

export function InviteUserForm() {
  const createUser = useUserStore((state) => state.createUser);
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({});
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; name?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
    }

    if (!name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await createUser(email.trim(), name.trim(), role);
      if ('error' in result) {
        toast.error(result.error);
        if (result.error.toLowerCase().includes('email') || result.error.toLowerCase().includes('e-mail')) {
          setErrors({ email: result.error });
        }
      } else {
        setGeneratedPassword(result.password);
        toast.success('Benutzer erfolgreich eingeladen');
      }
    } catch {
      toast.error('Fehler beim Einladen des Benutzers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPassword = async () => {
    if (generatedPassword) {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setEmail('');
    setName('');
    setRole('member');
    setGeneratedPassword(null);
    setErrors({});
  };

  if (generatedPassword) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Benutzer eingeladen!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Teile die Zugangsdaten mit dem neuen Benutzer
          </p>
        </div>

        <Card className="bg-gray-50 dark:bg-gray-800/50">
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">E-Mail</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Temporäres Passwort</p>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                  {generatedPassword}
                </code>
                <Button variant="ghost" size="sm" onClick={handleCopyPassword}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Der Benutzer sollte das Passwort nach dem ersten Login ändern.
        </p>

        <Button onClick={handleReset} className="w-full">
          Weiteren Benutzer einladen
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Max Mustermann"
        error={errors.name}
      />

      <Input
        label="E-Mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="max@example.com"
        error={errors.email}
      />

      <Select
        label="Rolle"
        value={role}
        onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
        options={[
          { value: 'member', label: 'Mitglied' },
          { value: 'admin', label: 'Administrator' },
        ]}
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Benutzer einladen
      </Button>
    </form>
  );
}
