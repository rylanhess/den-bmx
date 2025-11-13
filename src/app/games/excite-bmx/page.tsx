'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@/games/excite-bmx/engine/GameEngine';
import { RiderSelectionScreen } from '@/games/excite-bmx/screens/RiderSelectionScreen';
import { SplashScreen } from '@/games/excite-bmx/screens/SplashScreen';
import { GameScreen } from '@/games/excite-bmx/screens/GameScreen';
import { GameOverScreen } from '@/games/excite-bmx/screens/GameOverScreen';
import { VictoryScreen } from '@/games/excite-bmx/screens/VictoryScreen';
import type { GameState, Rider, Track } from '@/games/excite-bmx/types';

export default function ExciteBMXPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState>('rider-selection');
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [raceResult, setRaceResult] = useState<'win' | 'lose' | null>(null);

  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const maxWidth = Math.min(800, window.innerWidth - 32);
      const maxHeight = Math.min(600, window.innerHeight - 200);
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      // Force a redraw after resize
      setCanvasReady(true);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize game engine
    gameEngineRef.current = new GameEngine(canvas, ctx);
    setCanvasReady(true);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      gameEngineRef.current?.cleanup();
    };
  }, []);

  const handleRiderSelect = (rider: Rider) => {
    setSelectedRider(rider);
    setGameState('splash');
    setCurrentTrack(null);
  };

  const handleSplashComplete = (track: Track) => {
    setCurrentTrack(track);
    setGameState('racing');
  };

  const handleRaceComplete = (result: 'win' | 'lose') => {
    setRaceResult(result);
    if (result === 'win') {
      setGameState('victory');
    } else {
      setGameState('game-over');
    }
  };

  const handleNextTrack = () => {
    if (!selectedRider) return;
    setGameState('splash');
  };

  const handleRetry = () => {
    if (!currentTrack) return;
    setGameState('racing');
  };

  const handleExit = () => {
    setGameState('rider-selection');
    setSelectedRider(null);
    setCurrentTrack(null);
    setRaceResult(null);
  };

  const renderCurrentScreen = () => {
    if (!canvasRef.current || !canvasReady) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || canvas.width === 0 || canvas.height === 0) return null;

    switch (gameState) {
      case 'rider-selection':
        return (
          <RiderSelectionScreen
            key="rider-selection"
            canvas={canvas}
            ctx={ctx}
            onSelect={handleRiderSelect}
            onExit={handleExit}
          />
        );
      case 'splash':
        if (!selectedRider) return null;
        return (
          <SplashScreen
            key="splash"
            canvas={canvas}
            ctx={ctx}
            selectedRider={selectedRider}
            currentTrack={currentTrack}
            onComplete={handleSplashComplete}
            onExit={handleExit}
          />
        );
      case 'racing':
        if (!selectedRider || !currentTrack || !gameEngineRef.current) return null;
        return (
          <GameScreen
            key="racing"
            canvas={canvas}
            ctx={ctx}
            gameEngine={gameEngineRef.current}
            rider={selectedRider}
            track={currentTrack}
            onComplete={handleRaceComplete}
            onExit={handleExit}
          />
        );
      case 'victory':
        if (!selectedRider || !currentTrack) return null;
        return (
          <VictoryScreen
            key="victory"
            canvas={canvas}
            ctx={ctx}
            rider={selectedRider}
            track={currentTrack}
            onNext={handleNextTrack}
            onExit={handleExit}
          />
        );
      case 'game-over':
        if (!selectedRider || !currentTrack) return null;
        return (
          <GameOverScreen
            key="game-over"
            canvas={canvas}
            ctx={ctx}
            rider={selectedRider}
            track={currentTrack}
            onRetry={handleRetry}
            onExit={handleExit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-black text-[#00ff0c] text-center mb-2">
          EXCITE BMX
        </h1>
        <div className="h-1 bg-[#00ff0c] max-w-xs mx-auto"></div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="border-4 border-[#00ff0c] bg-black max-w-full"
        style={{ imageRendering: 'pixelated' }}
      />

      {canvasReady && renderCurrentScreen()}

      <div className="mt-4 text-center text-white text-sm">
        <p className="mb-2">Desktop: ↑↓ Lanes | ←→ Bike Tilt | Spacebar: Power/Kick</p>
        <p>Mobile: Tap to control</p>
      </div>
    </div>
  );
}

