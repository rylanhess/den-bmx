'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { RiderSprite } from '../sprites/RiderSprite';
import { TrackRenderer } from '../tracks/TrackRenderer';
import { TrackGenerator } from '../tracks/TrackGenerator';
import { PhysicsEngine } from '../physics/PhysicsEngine';
import { RIDERS } from '../data/riders';
import type { Rider, Track, Racer, RaceState } from '../types';

interface GameScreenProps {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gameEngine: GameEngine;
  rider: Rider;
  track: Track;
  onComplete: (result: 'win' | 'lose') => void;
  onExit: () => void;
}

export function GameScreen({ canvas, ctx, gameEngine, rider, track, onComplete, onExit }: GameScreenProps) {
  const raceStateRef = useRef<RaceState | null>(null);
  const playerRacerRef = useRef<Racer | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const trackLengthRef = useRef<number>(2000);
  const finishLineRef = useRef<number>(1900);
  const [raceTime, setRaceTime] = useState(0);

  useEffect(() => {
    // Initialize race
    trackLengthRef.current = 2000;
    const obstacles = TrackGenerator.generateObstacles(track, trackLengthRef.current);
    finishLineRef.current = trackLengthRef.current * 0.95;
    
    // Create player racer
    const playerRacer: Racer = {
      id: 'player',
      rider,
      lane: 1,
      position: 0,
      speed: 2.5,
      targetSpeed: 3.0,
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

    // Create AI racers (other teams)
    const aiRiders = RIDERS.filter(r => r.id !== rider.id);
    const aiRacers: Racer[] = aiRiders.slice(0, 3).map((r, i) => ({
      id: `ai-${i}`,
      rider: r,
      lane: i === 0 ? 0 : i === 1 ? 2 : 3,
      position: -50 - (i * 20), // Start slightly behind
      speed: 2.0,
      targetSpeed: 2.5,
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
    }));

    const raceState: RaceState = {
      racers: [playerRacer, ...aiRacers],
      obstacles,
      cameraX: 0,
      raceTime: 0,
      raceDuration: 45000, // 45 seconds
      isFinished: false,
      winner: null,
    };

    raceStateRef.current = raceState;
    playerRacerRef.current = playerRacer;

    // Handle input
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
      e.preventDefault();
    };

    // Handle touch - Excitebike style: tap top/bottom to switch lanes
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      
      const rect = canvas.getBoundingClientRect();
      const y = touch.clientY - rect.top;
      const height = canvas.height;
      
      if (y < height / 3) {
        // Top third - move up (lane up)
        keysRef.current.add('ArrowUp');
        setTimeout(() => keysRef.current.delete('ArrowUp'), 100);
      } else if (y > (height * 2) / 3) {
        // Bottom third - move down (lane down)
        keysRef.current.add('ArrowDown');
        setTimeout(() => keysRef.current.delete('ArrowDown'), 100);
      } else {
        // Middle - power move/jump
        keysRef.current.add(' ');
        setTimeout(() => keysRef.current.delete(' '), 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });

    // Game loop
    let lastTime = performance.now();
    
    const update = (deltaTime: number) => {
      if (!raceStateRef.current || !playerRacerRef.current) return;
      
      const state = raceStateRef.current;
      const player = playerRacerRef.current;
      
      // Update race time
      state.raceTime += deltaTime;
      setRaceTime(state.raceTime);
      
      // Check if race is finished (crossed finish line or time up)
      const hasFinished = state.racers.some(r => r.position >= finishLineRef.current);
      const timeUp = state.raceTime >= state.raceDuration;
      
      if ((hasFinished || timeUp) && !state.isFinished) {
        state.isFinished = true;
        // Determine winner (furthest position)
        const sortedRacers = [...state.racers].sort((a, b) => b.position - a.position);
        state.winner = sortedRacers[0];
        
        // Check if player won (player must be in top position)
        const playerWon = state.winner.id === 'player' || (hasFinished && player.position >= finishLineRef.current);
        setTimeout(() => {
          onComplete(playerWon ? 'win' : 'lose');
        }, 2000);
      }
      
      if (state.isFinished) {
        return;
      }

      // Handle player input - Excitebike style: Up/Down switch lanes
      if (keysRef.current.has('ArrowUp') && player.lane > 0) {
        player.lane--;
      }
      if (keysRef.current.has('ArrowDown') && player.lane < 3) {
        player.lane++;
      }
      if (keysRef.current.has(' ')) {
        // Power boost or kick - NO manual jumping (ramps handle elevation automatically)
        const nearbyRacer = state.racers.find(r => 
          r.id !== 'player' && 
          Math.abs(r.lane - player.lane) === 0 && // Same lane
          Math.abs(r.position - player.position) < 30
        );
        
        if (nearbyRacer) {
          PhysicsEngine.kick(player, nearbyRacer);
        } else {
          // Just power boost - ramps automatically elevate riders
          PhysicsEngine.powerBoost(player);
        }
      }
      
      // Bike tilt controls (Excitebike style - mid-air control)
      if (keysRef.current.has('ArrowLeft')) {
        // Tilt forward (for better landing)
        PhysicsEngine.tiltBike(player, 'forward');
      }
      if (keysRef.current.has('ArrowRight')) {
        // Tilt backward
        PhysicsEngine.tiltBike(player, 'backward');
      }

      // Update all racers
      const isAccelerating = player ? keysRef.current.has(' ') : false;
      
      state.racers.forEach(racer => {
        PhysicsEngine.updateRacer(
          racer,
          deltaTime,
          state.obstacles,
          racer.id === 'player',
          racer.id === 'player' ? isAccelerating : false
        );
      });

      // Update camera to follow player
      state.cameraX = Math.max(0, player.position - canvas.width / 3);
    };

    const render = () => {
      if (!raceStateRef.current || !playerRacerRef.current) return;
      
      const state = raceStateRef.current;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw track
      TrackRenderer.draw(
        ctx,
        track,
        state.cameraX,
        canvas.width,
        canvas.height,
        state.obstacles,
        trackLengthRef.current
      );
      
      // Draw racers - Excitebike style: 4 vertical lanes (stacked top to bottom)
      const trackStartY = canvas.height * 0.25;
      const trackHeight = canvas.height * 0.35;
      const laneHeight = trackHeight / 4;
      
      state.racers.forEach(racer => {
        // X position: horizontal position on track (scrolling)
        const racerX = (racer.position - state.cameraX) + 50; // Offset from left edge
        // Y position: vertical position based on lane (0 = top lane, 3 = bottom lane)
        // Subtract yOffset so riders appear to go UP when jumping (yOffset increases = higher on screen)
        const racerY = trackStartY + (racer.lane * laneHeight) + (laneHeight / 2) - racer.yOffset;
        
        if (racerX > -50 && racerX < canvas.width + 50) {
          RiderSprite.draw(ctx, racer, racerX, racerY, racer.id === 'player');
        }
      });
      
      // Draw HUD
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, 60);
      
      // Time
      const timeLeft = Math.max(0, (state.raceDuration - state.raceTime) / 1000);
      ctx.fillStyle = '#00FF0C';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Time: ${timeLeft.toFixed(1)}s`, 10, 35);
      
      // Position
      const sortedRacers = [...state.racers].sort((a, b) => b.position - a.position);
      const playerPosition = sortedRacers.findIndex(r => r.id === 'player') + 1;
      ctx.fillText(`Position: ${playerPosition}/4`, 200, 35);
      
      // Instructions
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.fillText('↑↓: Lanes | ←→: Bike Tilt | Space: Power/Kick', 10, 55);
      
      // Exit button
      ctx.fillStyle = '#FF0000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('ESC: Exit', canvas.width - 10, 35);
    };

    gameEngine.start(update, render);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouch);
      gameEngine.stop();
    };
  }, [canvas, ctx, gameEngine, rider, track, onComplete, onExit]);

  return null;
}

