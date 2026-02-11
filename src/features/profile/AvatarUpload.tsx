import { useCallback, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../stores/toastStore';
import { compressImage, isValidImageType } from '../../utils/imageUtils';

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
        const compressedUrl = await compressImage(file);
        updateUser({ avatarUrl: compressedUrl });
        toast.success('Avatar aktualisiert');
      } catch {
        toast.error('Fehler beim Hochladen');
      } finally {
        setIsUploading(false);
      }
    },
    [updateUser, toast]
  );

  const handleRemove = useCallback(() => {
    updateUser({ avatarUrl: null });
    toast.success('Avatar entfernt');
  }, [updateUser, toast]);

  if (!user) return null;

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar src={user.avatarUrl} name={user.name} size="xl" />
        <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
          {isUploading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Camera className="h-4 w-4 text-white" />
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

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
