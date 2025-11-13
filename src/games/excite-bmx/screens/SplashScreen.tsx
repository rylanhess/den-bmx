'use client';

import { useEffect, useRef } from 'react';
import { TRACKS, getNextTrack } from '../data/tracks';
import type { Rider, Track } from '../types';

interface SplashScreenProps {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  selectedRider: Rider;
  currentTrack: Track | null;
  onComplete: (track: Track) => void;
  onExit: () => void;
}

export function SplashScreen({ canvas, ctx, selectedRider, currentTrack, onComplete, onExit }: SplashScreenProps) {
  const animationRef = useRef<number>();
  const elapsedTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const targetTrack = getNextTrack(currentTrack);
    if (!targetTrack) {
      // All tracks completed
      return;
    }

    // Ensure canvas is ready before starting
    const checkAndStart = () => {
      if (canvas.width === 0 || canvas.height === 0) {
        setTimeout(checkAndStart, 50);
        return;
      }
      
      startTimeRef.current = Date.now();
      elapsedTimeRef.current = 0;
      animate();
    };

    const animate = () => {
      elapsedTimeRef.current = Date.now() - startTimeRef.current;

      if (canvas.width === 0 || canvas.height === 0) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw title based on track
      ctx.fillStyle = '#00FF0C';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      
      if (targetTrack.id === 'isabella-state') {
        ctx.fillText('ISABELLA STATE CHAMPIONSHIP', canvas.width / 2, 80);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Arial';
        ctx.fillText('Race against Isabella!', canvas.width / 2, 120);
        
        // Draw simple 8-bit characters
        // Isabella (girl)
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(canvas.width / 2 - 100, 200, 40, 60);
        // Head
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(canvas.width / 2 - 90, 200, 20, 20);
        
        // Twin Silo racer (boy)
        ctx.fillStyle = '#800080';
        ctx.fillRect(canvas.width / 2 + 60, 200, 40, 60);
        // Head
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(canvas.width / 2 + 70, 200, 20, 20);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.fillText('VS', canvas.width / 2, 240);
      } else {
        ctx.fillText(targetTrack.name.toUpperCase(), canvas.width / 2, 80);
      }
      
      // Draw description
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '18px Arial';
      ctx.fillText(targetTrack.description, canvas.width / 2, canvas.height / 2);
      
      // Draw track info
      ctx.font = '14px Arial';
      ctx.fillText(`Terrain: ${targetTrack.terrain}`, canvas.width / 2, canvas.height / 2 + 40);
      
      // Draw continue prompt
      if (elapsedTimeRef.current > 2000) {
        ctx.fillStyle = '#00FF0C';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Press ENTER to continue', canvas.width / 2, canvas.height - 60);
        ctx.fillText('ESC to exit', canvas.width / 2, canvas.height - 30);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    checkAndStart();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && elapsedTimeRef.current > 2000) {
        onComplete(targetTrack);
      } else if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, ctx, selectedRider, currentTrack, onComplete, onExit]);

  return null;
}

