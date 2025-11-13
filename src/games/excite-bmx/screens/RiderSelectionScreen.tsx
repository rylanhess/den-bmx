'use client';

import { useEffect, useRef } from 'react';
import { RIDERS } from '../data/riders';
import { RiderSprite } from '../sprites/RiderSprite';
import type { Rider, Racer } from '../types';

interface RiderSelectionScreenProps {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  onSelect: (rider: Rider) => void;
  onExit: () => void;
}

export function RiderSelectionScreen({ canvas, ctx, onSelect, onExit }: RiderSelectionScreenProps) {
  const selectedIndexRef = useRef(0);
  const keyHandlerRef = useRef<(e: KeyboardEvent) => void>();

  useEffect(() => {
    const draw = () => {
      if (canvas.width === 0 || canvas.height === 0) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw title
      ctx.fillStyle = '#00FF0C';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('SELECT YOUR RIDER', canvas.width / 2, 50);
      
      // Draw subtitle
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '20px Arial';
      ctx.fillText('Road to the Grands', canvas.width / 2, 80);
      
      // Draw riders
      const riderWidth = canvas.width / 4;
      const riderY = canvas.height / 2;
      
      RIDERS.forEach((rider, index) => {
        const riderX = (index * riderWidth) + (riderWidth / 2);
        const isSelected = index === selectedIndexRef.current;
        
        // Draw selection highlight
        if (isSelected) {
          ctx.strokeStyle = '#00FF0C';
          ctx.lineWidth = 4;
          ctx.strokeRect(
            (index * riderWidth) + 10,
            riderY - 60,
            riderWidth - 20,
            120
          );
        }
        
        // Draw rider sprite
        const mockRacer: Racer = {
          id: rider.id,
          rider,
          lane: 0,
          position: 0,
          speed: 0,
          targetSpeed: 0,
          yOffset: 0,
          isJumping: false,
          jumpVelocity: 0,
          animationFrame: 0,
          isKicking: false,
          kickCooldown: 0,
          onRamp: false,
          rampProgress: 0,
          rampType: null,
          bikeAngle: 0,
          landingSpeedPenalty: 0,
        };
        
        RiderSprite.draw(ctx, mockRacer, riderX, riderY, true);
        
        // Draw rider name
        ctx.fillStyle = isSelected ? '#00FF0C' : '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(rider.team, riderX, riderY + 80);
      });
      
      // Draw instructions
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Arrow Keys: Select | Enter: Choose | ESC: Exit', canvas.width / 2, canvas.height - 40);
    };

    // Ensure canvas is ready - wait a bit for canvas to be sized
    const checkAndDraw = () => {
      if (canvas.width === 0 || canvas.height === 0) {
        // Retry after a short delay
        setTimeout(checkAndDraw, 50);
        return;
      }
      draw();
    };

    checkAndDraw();

    // Handle keyboard input
    keyHandlerRef.current = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        selectedIndexRef.current = Math.max(0, selectedIndexRef.current - 1);
        draw();
      } else if (e.key === 'ArrowRight') {
        selectedIndexRef.current = Math.min(RIDERS.length - 1, selectedIndexRef.current + 1);
        draw();
      } else if (e.key === 'Enter') {
        onSelect(RIDERS[selectedIndexRef.current]);
      } else if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', keyHandlerRef.current);

    // Handle touch/click
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX - canvas.getBoundingClientRect().left : e.clientX - canvas.getBoundingClientRect().left;
      const riderWidth = canvas.width / 4;
      const clickedIndex = Math.floor(x / riderWidth);
      
      if (clickedIndex >= 0 && clickedIndex < RIDERS.length) {
        selectedIndexRef.current = clickedIndex;
        draw();
        // Auto-select after a moment
        setTimeout(() => {
          onSelect(RIDERS[selectedIndexRef.current]);
        }, 300);
      }
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleClick);

    return () => {
      if (keyHandlerRef.current) {
        window.removeEventListener('keydown', keyHandlerRef.current);
      }
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleClick);
    };
  }, [canvas, ctx, onSelect, onExit]);

  return null;
}

