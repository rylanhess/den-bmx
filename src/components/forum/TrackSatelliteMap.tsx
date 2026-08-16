'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  formatTrackShortName,
  hasTrackCoordinates,
  TRACK_SATELLITE_ZOOM,
} from '@/lib/trackDisplay';
import type { Track } from '@/lib/supabase';

const SATELLITE_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12';

export default function TrackSatelliteMap({
  track,
  className = '',
}: {
  track: Pick<Track, 'name' | 'lat' | 'lon'>;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!hasTrackCoordinates(track)) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setError('Map is not configured.');
      return;
    }

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: SATELLITE_STYLE,
      center: [track.lon, track.lat],
      zoom: TRACK_SATELLITE_ZOOM,
      cooperativeGestures: true,
      attributionControl: true,
      dragRotate: false,
      pitchWithRotate: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    const marker = new mapboxgl.Marker({ color: '#BF0A30' })
      .setLngLat([track.lon, track.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 28, closeButton: false }).setText(
          formatTrackShortName(track.name)
        )
      )
      .addTo(map);

    const resize = () => map.resize();
    map.on('load', resize);
    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current);

    mapRef.current = map;
    return () => {
      observer.disconnect();
      marker.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [track.lat, track.lon, track.name]);

  if (!hasTrackCoordinates(track)) return null;

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-[#002868]/10 text-sm text-gray-500 ${className}`}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`track-satellite-map ${className}`}
      role="region"
      aria-label={`Satellite map of ${formatTrackShortName(track.name)}`}
    />
  );
}
