'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Park } from '@/app/freestyle/page';

interface ParkFinderMapProps {
  parks: Park[];
}

export default function ParkFinderMap({ parks }: ParkFinderMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [hoveredPark, setHoveredPark] = useState<Park | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check if Mapbox token is available
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken) {
      setMapError('Mapbox token not configured. Map will not be displayed.');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    // Initialize map centered on Denver metro area
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Dark theme to match site
      center: [-105.0, 39.75], // Denver metro area
      zoom: 10,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to load before adding markers
    map.current.on('load', () => {
      // Create markers for each park
      parks.forEach((park) => {
      // Create outer container that Mapbox will position
      // Mapbox positions this element, so it should not have position: absolute
      const container = document.createElement('div');
      container.style.width = '30px';
      container.style.height = '30px';
      container.style.cursor = 'pointer';
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.overflow = 'visible';
      container.style.boxSizing = 'content-box';
      // Ensure container doesn't shrink or grow
      container.style.flexShrink = '0';
      container.style.flexGrow = '0';
      // Prevent any layout shifts
      container.style.minWidth = '30px';
      container.style.minHeight = '30px';
      container.style.maxWidth = '30px';
      container.style.maxHeight = '30px';
      
      // Create inner element for the visual marker
      const el = document.createElement('div');
      el.className = 'park-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.flexShrink = '0';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#00ff0c';
      el.style.border = '3px solid #000';
      el.style.boxShadow = '0 0 10px #00ff0c';
      el.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      el.style.transformOrigin = 'center center';
      // Ensure the inner element doesn't affect container size
      el.style.position = 'relative';
      
      container.appendChild(el);
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25, closeOnClick: false })
        .setHTML(`
          <div style="color: #000; font-family: Arial, sans-serif; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #00ff0c; font-size: 16px;">${park.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Type:</strong> ${park.type}</p>
            <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Size:</strong> ${park.size}</p>
            <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Quality:</strong> ${park.quality}</p>
            <p style="margin: 0 0 8px 0; font-size: 12px;"><strong>Skill Levels:</strong> ${park.skillLevels.join(', ')}</p>
            <a href="${park.googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="color: #00ff0c; text-decoration: none; font-weight: bold; font-size: 12px;">View on Google Maps →</a>
          </div>
        `);

      const marker = new mapboxgl.Marker({
        element: container,
        anchor: 'center',
      })
        .setLngLat(park.coordinates as [number, number])
        .setPopup(popup)
        .addTo(map.current!);

      // Add hover effects on the inner element only
      container.addEventListener('mouseenter', () => {
        setHoveredPark(park);
        el.style.transform = 'scale(1.3)';
        el.style.boxShadow = '0 0 20px #00ff0c, 0 0 30px #00ff0c';
      });

      container.addEventListener('mouseleave', () => {
        setHoveredPark(null);
        el.style.transform = 'scale(1)';
        el.style.boxShadow = '0 0 10px #00ff0c';
      });

      markersRef.current.push(marker);
      });
    });

    // Cleanup
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      if (map.current) {
        map.current.remove();
      }
    };
  }, [parks]);

  if (mapError) {
    return (
      <div className="bg-black border-4 border-[#00ff0c] p-8 text-center">
        <p className="text-[#00ff0c] font-bold">
          {mapError}
        </p>
        <p className="text-white text-sm mt-2">
          To enable the map, add NEXT_PUBLIC_MAPBOX_TOKEN to your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className="w-full h-[600px] border-4 border-[#00ff0c]"
        style={{ minHeight: '600px' }}
      />
      {hoveredPark && (
        <div className="absolute top-4 left-4 bg-black border-4 border-[#00ff0c] p-4 z-10 max-w-xs">
          <h3 className="text-[#00ff0c] font-black text-lg mb-2">{hoveredPark.name}</h3>
          <p className="text-white text-sm font-bold mb-1">{hoveredPark.type} • {hoveredPark.location}</p>
          <p className="text-white text-xs">{hoveredPark.description.substring(0, 150)}...</p>
        </div>
      )}
    </div>
  );
}

