'use client';

import { useEffect, useRef } from 'react';
import { getNextTrack } from '../data/tracks';
import type { Rider, Track } from '../types';

interface VictoryScreenProps {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  rider: Rider;
  track: Track;
  onNext: () => void;
  onExit: () => void;
}

export function VictoryScreen({ canvas, ctx, rider, track, onNext, onExit }: VictoryScreenProps) {
  const animationRef = useRef<number>();

  useEffect(() => {
    const nextTrack = getNextTrack(track);
    const hasNextTrack = nextTrack !== null;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw victory message
      ctx.fillStyle = '#00FF0C';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('VICTORY!', canvas.width / 2, canvas.height / 2 - 60);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '24px Arial';
      ctx.fillText(`You won at ${track.name}!`, canvas.width / 2, canvas.height / 2);
      
      if (hasNextTrack) {
        ctx.font = '18px Arial';
        ctx.fillText(`Next: ${nextTrack!.name}`, canvas.width / 2, canvas.height / 2 + 40);
        
        ctx.fillStyle = '#00FF0C';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Press ENTER to continue', canvas.width / 2, canvas.height - 60);
      } else {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('CONGRATULATIONS!', canvas.width / 2, canvas.height / 2 + 40);
        ctx.fillText('You completed all tracks!', canvas.width / 2, canvas.height / 2 + 70);
      }
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px Arial';
      ctx.fillText('ESC to exit', canvas.width / 2, canvas.height - 30);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && hasNextTrack) {
        onNext();
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
  }, [canvas, ctx, rider, track, onNext, onExit]);

  return null;
}

