import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { compressImage, isValidImageType } from '../../utils/imageUtils';
import { generateId } from '../../utils/dateUtils';
import type { TicketImage } from '../../types';

interface ImageUploadProps {
  images: TicketImage[];
  onChange: (images: TicketImage[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) return;

      setIsProcessing(true);

      const newImages: TicketImage[] = [];

      for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
        const file = files[i];

        if (!isValidImageType(file)) {
          continue;
        }

        try {
          const compressedUrl = await compressImage(file);
          newImages.push({
            id: generateId(),
            url: compressedUrl,
            name: file.name,
            createdAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Error compressing image:', error);
        }
      }

      onChange([...images, ...newImages]);
      setIsProcessing(false);
    },
    [images, maxImages, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = useCallback(
    (id: string) => {
      onChange(images.filter((img) => img.id !== id));
    },
    [images, onChange]
  );

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <label
        className={cn(
          'flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
          images.length >= maxImages && 'opacity-50 cursor-not-allowed'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bilder hierher ziehen oder{' '}
                <span className="text-blue-500">durchsuchen</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Max. {maxImages} Bilder
              </p>
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          disabled={images.length >= maxImages || isProcessing}
        />
      </label>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image) => (
            <div key={image.id} className="relative group aspect-square">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Placeholder for empty state
export function ImagePlaceholder() {
  return (
    <div className="flex items-center justify-center w-full h-32 rounded-xl bg-gray-100 dark:bg-gray-800">
      <ImageIcon className="h-8 w-8 text-gray-400" />
    </div>
  );
}
