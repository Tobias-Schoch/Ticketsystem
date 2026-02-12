import { useCallback, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../stores/toastStore';
import { isValidImageType } from '../../utils/imageUtils';
import { usersApi } from '../../api';

export function AvatarUpload() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!isValidImageType(file)) {
        toast.error('Ungültiges Bildformat');
        return;
      }

      setIsUploading(true);
      try {
        // Upload image to backend
        const formData = new FormData();
        formData.append('avatar', file);
        const { avatarUrl } = await usersApi.uploadAvatar(formData);

        // Update user in backend and local state
        await usersApi.update(user!.id, { avatarUrl });
        updateUser({ avatarUrl });
        toast.success('Avatar aktualisiert');
      } catch {
        toast.error('Fehler beim Hochladen');
      } finally {
        setIsUploading(false);
      }
    },
    [user, updateUser, toast]
  );

  const handleRemove = useCallback(async () => {
    try {
      await usersApi.update(user!.id, { avatarUrl: null });
      updateUser({ avatarUrl: null });
      toast.success('Avatar entfernt');
    } catch {
      toast.error('Fehler beim Entfernen');
    }
  }, [user, updateUser, toast]);

  if (!user) return null;

  return (
    <div className="flex items-center gap-6">
      <label className="relative cursor-pointer group">
        <Avatar src={user.avatarUrl} name={user.name} size="xl" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          {isUploading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>

      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{user.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        {user.avatarUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="mt-2 text-red-500 hover:text-red-600"
          >
            <X className="h-4 w-4 mr-1" />
            Avatar entfernen
          </Button>
        )}
      </div>
    </div>
  );
}
