'use client';

import { useState } from 'react';
import type { Track } from '@/lib/supabase';

interface TrackScheduleEditorProps {
  track: Track;
  canEdit: boolean;
}

export default function TrackScheduleEditor({ track, canEdit }: TrackScheduleEditorProps) {
  const [openHours, setOpenHours] = useState(track.open_hours ?? '');
  const [schedule, setSchedule] = useState(track.schedule ?? '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    const res = await fetch(`/api/tracks/${track.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ open_hours: openHours.trim() || null, schedule: schedule.trim() || null }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.error || 'Failed to save');
      return;
    }
    setMessage('Saved!');
    setEditing(false);
  };

  const hasContent = openHours || schedule;

  if (!hasContent && !canEdit) return null;

  return (
    <div className="border-2 border-[#00ff0c]/30 rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-[#00ff0c]">Hours & Schedule</h2>
        {canEdit && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-bold text-[#00ff0c] border border-[#00ff0c]/40 px-3 py-1 rounded hover:bg-[#00ff0c]/10"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#00ff0c] mb-1">Open Hours</label>
            <textarea
              value={openHours}
              onChange={(e) => setOpenHours(e.target.value)}
              rows={3}
              placeholder="e.g. Tue–Thu 4–8pm, Sat–Sun 9am–5pm (weather permitting)"
              className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none resize-y text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#00ff0c] mb-1">Practice & Race Schedule</label>
            <textarea
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              rows={4}
              placeholder="e.g. Tuesday practice 6pm, Saturday race series 10am gate..."
              className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none resize-y text-sm"
            />
          </div>
          {message && <p className={`text-sm ${message === 'Saved!' ? 'text-[#00ff0c]' : 'text-red-400'}`}>{message}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-[#00ff0c] text-black font-black text-sm rounded hover:bg-[#00cc0a] disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'SAVE'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 border-2 border-gray-600 text-gray-400 font-bold text-sm rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <h3 className="font-bold text-white mb-1">Open Hours</h3>
            <p className="text-gray-300 whitespace-pre-wrap">
              {openHours || (canEdit ? 'Not set — click Edit to add hours' : 'Contact track for hours')}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-1">Practice & Race Schedule</h3>
            <p className="text-gray-300 whitespace-pre-wrap">
              {schedule || (canEdit ? 'Not set — click Edit to add schedule' : 'Check Facebook or USA BMX for schedule')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
