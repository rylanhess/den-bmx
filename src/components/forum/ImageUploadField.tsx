'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const MAX_IMAGES = 4;
const MAX_SIZE_MB = 5;

interface ImageUploadFieldProps {
  images: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export async function uploadForumImage(file: File, userId: string): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('forum-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('forum-images').getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage.from('avatars').upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export default function ImageUploadField({ images, onChange, disabled }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError('');
    setUploading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Sign in to upload images');
      setUploading(false);
      return;
    }

    const remaining = MAX_IMAGES - images.length;
    const toUpload = Array.from(files).slice(0, remaining);

    try {
      const urls: string[] = [];
      for (const file of toUpload) {
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          throw new Error(`Image must be under ${MAX_SIZE_MB}MB`);
        }
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files allowed');
        }
        urls.push(await uploadForumImage(file, user.id));
      }
      onChange([...images, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (url: string) => {
    onChange(images.filter((u) => u !== url));
  };

  return (
    <div className="space-y-2">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url) => (
            <div key={url} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-20 w-20 object-cover rounded border border-[#00ff0c]/30" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {images.length < MAX_IMAGES && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            className="hidden"
            disabled={disabled || uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="text-sm text-[#00ff0c] font-bold hover:underline disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : '+ Attach images'}
          </button>
        </>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
