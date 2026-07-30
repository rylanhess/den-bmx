'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AVATAR_BUCKET_LIMIT_MB,
  AVATAR_PREVIEW_SIZE,
  DEFAULT_AVATAR_CROP,
  getAvatarDrawRect,
  loadImageFromFile,
  renderAvatarBlob,
  type AvatarCropState,
} from '@/lib/avatarImage';

interface AvatarCropModalProps {
  file: File;
  onCancel: () => void;
  onSave: (blob: Blob) => Promise<void>;
}

export default function AvatarCropModal({ file, onCancel, onSave }: AvatarCropModalProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<AvatarCropState>(DEFAULT_AVATAR_CROP);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null
  );
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setImage(null);
    setPreviewUrl(null);

    loadImageFromFile(file)
      .then(({ image: img, previewUrl: url }) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        previewUrlRef.current = url;
        setImage(img);
        setPreviewUrl(url);
        setCrop(DEFAULT_AVATAR_CROP);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load image');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, [file]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!image || loading) return;
      e.preventDefault();
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: crop.offsetX,
        originY: crop.offsetY,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [crop.offsetX, crop.offsetY, image, loading]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setCrop((prev) => ({
      ...prev,
      offsetX: dragRef.current!.originX + dx,
      offsetY: dragRef.current!.originY + dy,
    }));
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleSave = async () => {
    if (!image) return;
    setSaving(true);
    setError('');
    try {
      const blob = await renderAvatarBlob(image, crop);
      await onSave(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const draw = image ? getAvatarDrawRect(image, crop, AVATAR_PREVIEW_SIZE) : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-crop-title"
    >
      <div className="w-full max-w-sm border-2 border-[#00ff0c] rounded-xl bg-black p-5 shadow-2xl shadow-[#00ff0c]/10">
        <h2 id="avatar-crop-title" className="text-lg font-black text-[#00ff0c] mb-1">
          Position your photo
        </h2>
        <p className="text-gray-400 text-xs mb-4">
          Drag to reposition. Saved as a {AVATAR_BUCKET_LIMIT_MB}MB max square crop.
        </p>

        <div
          className="relative mx-auto rounded-full overflow-hidden border-2 border-[#00ff0c]/50 bg-[#111] touch-none cursor-grab active:cursor-grabbing"
          style={{ width: AVATAR_PREVIEW_SIZE, height: AVATAR_PREVIEW_SIZE }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
              Loading…
            </div>
          )}
          {draw && previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              draggable={false}
              className="absolute max-w-none select-none pointer-events-none"
              style={{
                width: draw.drawW,
                height: draw.drawH,
                left: draw.x,
                top: draw.y,
              }}
            />
          )}
        </div>

        <label className="block mt-4 text-xs font-bold text-[#00ff0c]">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.02}
            value={crop.scale}
            onChange={(e) => setCrop((prev) => ({ ...prev, scale: Number(e.target.value) }))}
            className="w-full mt-1 accent-[#00ff0c]"
          />
        </label>

        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

        <div className="flex gap-2 mt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 py-2.5 border-2 border-gray-600 text-gray-300 font-bold rounded hover:border-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading || !image}
            className="flex-1 py-2.5 bg-[#00ff0c] text-black font-black rounded hover:bg-[#00cc0a] disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Avatar'}
          </button>
        </div>
      </div>
    </div>
  );
}
