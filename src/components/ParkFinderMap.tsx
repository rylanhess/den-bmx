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
      // Mobile-friendly settings
      touchZoomRotate: true,
      touchPitch: true,
      dragRotate: false, // Disable drag rotation on mobile for better UX
      pitchWithRotate: false,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to load before adding markers
    map.current.on('load', () => {
      // Define marker styles by park type
      const getMarkerStyle = (type: Park['type']) => {
        switch (type) {
          case 'Bike Park':
            return {
              backgroundColor: '#00ff0c', // Neon green
              borderColor: '#000',
              shadowColor: '#00ff0c',
              shape: 'circle' as const,
            };
          case 'Skate Park':
            return {
              backgroundColor: '#0066ff', // Blue
              borderColor: '#000',
              shadowColor: '#0066ff',
              shape: 'square' as const,
            };
          case 'Pump Track':
            return {
              backgroundColor: '#ffaa00', // Orange
              borderColor: '#000',
              shadowColor: '#ffaa00',
              shape: 'diamond' as const,
            };
          case 'BMX Track':
            return {
              backgroundColor: '#ff0000', // Red
              borderColor: '#000',
              shadowColor: '#ff0000',
              shape: 'triangle' as const,
            };
          case 'Indoor Park':
            return {
              backgroundColor: '#ff00ff', // Magenta for indoor
              borderColor: '#000',
              shadowColor: '#ff00ff',
              shape: 'square' as const,
            };
          default:
            return {
              backgroundColor: '#00ff0c',
              borderColor: '#000',
              shadowColor: '#00ff0c',
              shape: 'circle' as const,
            };
        }
      };

      // Create markers for each park
      parks.forEach((park) => {
      const markerStyle = getMarkerStyle(park.type);
      
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
      el.style.backgroundColor = markerStyle.backgroundColor;
      el.style.border = '3px solid ' + markerStyle.borderColor;
      el.style.boxShadow = `0 0 10px ${markerStyle.shadowColor}`;
      el.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      el.style.transformOrigin = 'center center';
      el.style.position = 'relative';
      
      // Apply shape based on type
      if (markerStyle.shape === 'circle') {
        el.style.borderRadius = '50%';
      } else if (markerStyle.shape === 'square') {
        el.style.borderRadius = '4px';
      } else if (markerStyle.shape === 'diamond') {
        el.style.borderRadius = '0';
        el.style.transform = 'rotate(45deg)';
        el.style.width = '21px';
        el.style.height = '21px';
      } else if (markerStyle.shape === 'triangle') {
        el.style.borderRadius = '0';
        el.style.width = '0';
        el.style.height = '0';
        el.style.borderLeft = '15px solid transparent';
        el.style.borderRight = '15px solid transparent';
        el.style.borderBottom = `26px solid ${markerStyle.backgroundColor}`;
        el.style.borderTop = 'none';
        el.style.backgroundColor = 'transparent';
        el.style.boxShadow = 'none';
      }
      
      container.appendChild(el);
      
      // Create popup with mobile-friendly configuration
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeOnClick: false,
        closeButton: true,
        closeOnMove: false,
        maxWidth: '280px', // Better for mobile
      })
        .setHTML(`
          <div style="color: #000; font-family: Arial, sans-serif; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #00ff0c; font-size: 16px;">${park.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Type:</strong> ${park.type}</p>
            <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Size:</strong> ${park.size}</p>
            <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Quality:</strong> ${park.quality}</p>
            <p style="margin: 0 0 8px 0; font-size: 12px;"><strong>Skill Levels:</strong> ${park.skillLevels.join(', ')}</p>
            ${park.toddlerApproved ? '<p style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #00aa00;">★ Toddler Approved</p>' : ''}
            <a href="${park.googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="color: #00ff0c; text-decoration: none; font-weight: bold; font-size: 12px; display: inline-block; padding: 4px 8px; background: #000; border: 2px solid #00ff0c;">View on Google Maps →</a>
          </div>
        `);

      const marker = new mapboxgl.Marker({
        element: container,
        anchor: 'center',
      })
        .setLngLat([park.coordinates[1], park.coordinates[0]] as [number, number]) // Convert [lat, lng] to [lng, lat]
        .setPopup(popup)
        .addTo(map.current!);

      // Add hover effects for desktop
      container.addEventListener('mouseenter', () => {
        setHoveredPark(park);
        if (markerStyle.shape === 'triangle') {
          // For triangle, only add glow via filter – do NOT scale container or element
          el.style.filter = `drop-shadow(0 0 10px ${markerStyle.shadowColor}) drop-shadow(0 0 20px ${markerStyle.shadowColor})`;
        } else if (markerStyle.shape === 'diamond') {
          el.style.transform = 'rotate(45deg) scale(1.3)';
          el.style.boxShadow = `0 0 20px ${markerStyle.shadowColor}, 0 0 30px ${markerStyle.shadowColor}`;
        } else {
          el.style.transform = 'scale(1.3)';
          el.style.boxShadow = `0 0 20px ${markerStyle.shadowColor}, 0 0 30px ${markerStyle.shadowColor}`;
        }
      });

      container.addEventListener('mouseleave', () => {
        setHoveredPark(null);
        if (markerStyle.shape === 'triangle') {
          el.style.filter = 'none';
        } else if (markerStyle.shape === 'diamond') {
          el.style.transform = 'rotate(45deg) scale(1)';
          el.style.boxShadow = `0 0 10px ${markerStyle.shadowColor}`;
        } else {
          el.style.transform = 'scale(1)';
          el.style.boxShadow = `0 0 10px ${markerStyle.shadowColor}`;
        }
      });

      // Add touch events for mobile - show popup on tap
      container.addEventListener('touchstart', (e) => {
        e.stopPropagation(); // Prevent map panning
      });

      container.addEventListener('touchend', (e) => {
        e.stopPropagation();
        // Open popup on mobile tap
        marker.togglePopup();
      });

      markersRef.current.push(marker);
      });
    });

    // Handle map resize on viewport changes (important for mobile)
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    // Also trigger resize after a short delay to handle initial mobile viewport issues
    const resizeTimeout = setTimeout(() => {
      if (map.current) {
        map.current.resize();
      }
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
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
        className="w-full h-[400px] sm:h-[500px] md:h-[600px] border-4 border-[#00ff0c]"
        style={{ 
          minHeight: '400px',
          touchAction: 'pan-x pan-y pinch-zoom',
        }}
      />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black border-4 border-[#00ff0c] p-3 z-10 max-w-[220px]">
        <div className="text-[#00ff0c] font-black text-sm mb-2">LEGEND</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#00ff0c] border-2 border-black flex-shrink-0"></div>
            <span className="text-white text-xs font-bold">Bike Park</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#0066ff] border-2 border-black rounded-sm flex-shrink-0"></div>
            <span className="text-white text-xs font-bold">Skate Park</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ffaa00] border-2 border-black transform rotate-45 flex-shrink-0"></div>
            <span className="text-white text-xs font-bold">Pump Track</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#ff0000] flex-shrink-0"></div>
            <span className="text-white text-xs font-bold">BMX Track</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#ff00ff] border-2 border-black rounded-sm flex-shrink-0"></div>
            <span className="text-white text-xs font-bold">Indoor Park</span>
          </div>
        </div>
      </div>
      {/* Desktop hover tooltip - hidden on mobile */}
      {hoveredPark && (
        <div className="hidden md:block absolute top-4 left-4 bg-black border-4 border-[#00ff0c] p-4 z-10 max-w-xs">
          <h3 className="text-[#00ff0c] font-black text-lg mb-2">{hoveredPark.name}</h3>
          <p className="text-white text-sm font-bold mb-1">{hoveredPark.type} • {hoveredPark.location}</p>
          <p className="text-white text-xs">{hoveredPark.description.substring(0, 150)}...</p>
        </div>
      )}
    </div>
  );
}

