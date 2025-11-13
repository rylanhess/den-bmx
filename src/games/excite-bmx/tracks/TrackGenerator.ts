import type { Track, Obstacle } from '../types';

export class TrackGenerator {
  static generateObstacles(track: Track, trackLength: number): Obstacle[] {
    const obstacles: Obstacle[] = [];
    const laneWidth = trackLength / 4;

    // First straight: Starting hill, step up jump, triple
    obstacles.push({
      type: 'start-hill',
      x: trackLength * 0.05,
      width: trackLength * 0.08,
      height: 50, // Much larger for visible jumps (Excitebike style)
      lanes: [0, 1, 2, 3],
    });

    obstacles.push({
      type: 'step-up',
      x: trackLength * 0.15,
      width: trackLength * 0.08,
      height: 45, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
    });

    obstacles.push({
      type: 'triple',
      x: trackLength * 0.25,
      width: trackLength * 0.12,
      height: 40, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
    });

    // Turn 1
    // (no obstacles in turns, just visual)

    // Second straight: Three doubles
    obstacles.push({
      type: 'double',
      x: trackLength * 0.35,
      width: trackLength * 0.08,
      height: 35, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
    });

    obstacles.push({
      type: 'double',
      x: trackLength * 0.45,
      width: trackLength * 0.08,
      height: 35, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
    });

    obstacles.push({
      type: 'double',
      x: trackLength * 0.55,
      width: trackLength * 0.08,
      height: 35, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
    });

    // Turn 2
    // (no obstacles)

    // Third straight: Rhythm section whoops
    obstacles.push({
      type: 'whoops',
      x: trackLength * 0.65,
      width: trackLength * 0.15,
      height: 12, // Slightly increased for visibility
      lanes: [0, 1, 2, 3],
    });

    // Turn 3
    // (no obstacles)

    // Last straight: Water zone and finish line
    obstacles.push({
      type: 'water',
      x: trackLength * 0.85,
      width: trackLength * 0.08,
      height: 10,
      lanes: [0, 1, 2, 3],
    });

    obstacles.push({
      type: 'finish',
      x: trackLength * 0.95,
      width: 20, // Narrow finish line - just a single line
      height: 50,
      lanes: [0, 1, 2, 3],
    });

    return obstacles;
  }
}

