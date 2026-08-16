'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TrackInfoPanel from '@/components/forum/TrackInfoPanel';
import type { Track } from '@/lib/supabase';

interface TrackProfileEditorProps {
  track: Track;
  canEdit: boolean;
}

export default function TrackProfileEditor({ track, canEdit }: TrackProfileEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(track);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const update = (field: keyof Track, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    const res = await fetch(`/api/tracks/${track.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        website: draft.website?.trim() || null,
        phone: draft.phone?.trim() || null,
        operator_name: draft.operator_name?.trim() || null,
        address: draft.address?.trim() || null,
        open_hours: draft.open_hours?.trim() || null,
        schedule: draft.schedule?.trim() || null,
        description: draft.description?.trim() || null,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error || 'Failed to save');
      return;
    }
    setDraft(data.track as Track);
    setMessage('Saved!');
    setEditing(false);
    router.refresh();
  };

  const hasPublicInfo =
    draft.website ||
    draft.fb_page_url ||
    draft.phone ||
    draft.operator_name ||
    draft.address ||
    draft.open_hours ||
    draft.schedule;

  if (!hasPublicInfo && !canEdit) return null;

  return (
    <div className="border-2 border-[#00ff0c]/30 rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-[#00ff0c]">Track Information</h2>
        {canEdit && !editing && (
          <button
            onClick={() => {
              setEditing(true);
              setMessage('');
            }}
            className="text-xs font-bold text-[#00ff0c] border border-[#00ff0c]/40 px-3 py-1 rounded hover:bg-[#00ff0c]/10"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <Field
            label="Website"
            value={draft.website ?? ''}
            onChange={(v) => update('website', v)}
            placeholder="https://… (Facebook URL is fine)"
            type="url"
          />
          <Field
            label="Phone"
            value={draft.phone ?? ''}
            onChange={(v) => update('phone', v)}
            placeholder="(720) 555-1234"
            type="tel"
          />
          <Field
            label="Operator"
            value={draft.operator_name ?? ''}
            onChange={(v) => update('operator_name', v)}
            placeholder="Track operator or club name"
          />
          <div>
            <label className="block text-sm font-bold text-[#00ff0c] mb-1">Address</label>
            <textarea
              value={draft.address ?? ''}
              onChange={(e) => update('address', e.target.value)}
              rows={2}
              placeholder="Street, city, CO zip"
              className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none resize-y text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#00ff0c] mb-1">Operating Hours</label>
            <textarea
              value={draft.open_hours ?? ''}
              onChange={(e) => update('open_hours', e.target.value)}
              rows={3}
              placeholder="Leave blank if not known"
              className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none resize-y text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#00ff0c] mb-1">Practice & Race Schedule</label>
            <textarea
              value={draft.schedule ?? ''}
              onChange={(e) => update('schedule', e.target.value)}
              rows={4}
              placeholder="e.g. Tuesday practice 6pm, Saturday race series 10am gate..."
              className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none resize-y text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#00ff0c] mb-1">Description</label>
            <textarea
              value={draft.description ?? ''}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none resize-y text-sm"
            />
          </div>
          {message && (
            <p className={`text-sm ${message === 'Saved!' ? 'text-[#00ff0c]' : 'text-red-400'}`}>
              {message}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => void handleSave()}
              disabled={loading}
              className="px-4 py-2 bg-[#00ff0c] text-black font-black text-sm rounded hover:bg-[#00cc0a] disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'SAVE'}
            </button>
            <button
              onClick={() => {
                setDraft(track);
                setEditing(false);
                setMessage('');
              }}
              className="px-4 py-2 border-2 border-gray-600 text-gray-400 font-bold text-sm rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <TrackInfoPanel track={draft} showEmpty={canEdit} />
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#00ff0c] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none text-sm"
      />
    </div>
  );
}
