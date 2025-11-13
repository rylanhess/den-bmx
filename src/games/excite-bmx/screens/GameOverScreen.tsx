'use client';

import { useEffect, useRef } from 'react';
import type { Rider, Track } from '../types';

interface GameOverScreenProps {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  rider: Rider;
  track: Track;
  onRetry: () => void;
  onExit: () => void;
}

export function GameOverScreen({ canvas, ctx, rider, track, onRetry, onExit }: GameOverScreenProps) {
  const animationRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw game over message
      ctx.fillStyle = '#FF0000';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '20px Arial';
      ctx.fillText(`You didn't finish in time at ${track.name}`, canvas.width / 2, canvas.height / 2 + 20);
      
      ctx.fillStyle = '#00FF0C';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('Press ENTER to retry', canvas.width / 2, canvas.height - 80);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px Arial';
      ctx.fillText('ESC to exit', canvas.width / 2, canvas.height - 40);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onRetry();
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
  }, [canvas, ctx, rider, track, onRetry, onExit]);

  return null;
}

