import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../stores/toastStore';
import { ROUTES } from '../../constants';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Bitte gib deine E-Mail ein';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Das sieht nicht wie eine E-Mail aus';
    }

    if (!password) {
      newErrors.password = 'Bitte gib dein Passwort ein';
    } else if (password.length < 6) {
      newErrors.password = 'Mindestens 6 Zeichen bitte';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success('Schön, dass du da bist!');
        navigate(ROUTES.DASHBOARD);
      } else {
        toast.error(result.error || 'Das hat leider nicht geklappt');
        setErrors({ password: result.error || 'E-Mail oder Passwort stimmt nicht' });
      }
    } catch {
      toast.error('Etwas ist schiefgelaufen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-sage-800 dark:text-sage-100">
          Willkommen zurück
        </h2>
        <p className="text-sm text-sage-400 dark:text-sage-500 mt-2">
          Schön, dass du wieder da bist
        </p>
      </div>

      <Input
        label="E-Mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="deine@email.de"
        icon={<Mail className="h-4 w-4" />}
        error={errors.email}
        autoComplete="email"
      />

      <div className="relative">
        <Input
          label="Passwort"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          error={errors.password}
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-[42px] text-sage-400 dark:text-sage-500 hover:text-sage-600 dark:hover:text-sage-300 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        {isLoading ? 'Einen Moment...' : 'Anmelden'}
      </Button>
    </form>
  );
}
