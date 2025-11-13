import type { Track, Obstacle } from '../types';

export class TrackGenerator {
  static generateObstacles(track: Track, trackLength: number): Obstacle[] {
    const obstacles: Obstacle[] = [];
    const laneWidth = trackLength / 4;

    // EVERY track starts with a starting hill (downward ramp for speed)
    obstacles.push({
      type: 'start-hill',
      x: trackLength * 0.01, // Very start of track
      width: trackLength * 0.06,
      height: 50, // Much larger for visible jumps (Excitebike style)
      lanes: [0, 1, 2, 3],
    });

    // First straight: Step up jump, triple (spread out more)

    obstacles.push({
      type: 'step-up',
      x: trackLength * 0.15, // More space after starting hill
      width: trackLength * 0.06,
      height: 45, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
    });

    obstacles.push({
      type: 'triple',
      x: trackLength * 0.30, // More space after step-up
      width: trackLength * 0.10,
      height: 40, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
    });

    // Turn 1
    // (no obstacles in turns, just visual)

    // Second straight: Three doubles (spread out more)
    obstacles.push({
      type: 'double',
      x: trackLength * 0.45, // More space after triple
      width: trackLength * 0.06,
      height: 35, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
    });

    obstacles.push({
      type: 'double',
      x: trackLength * 0.58, // More space between doubles
      width: trackLength * 0.06,
      height: 35, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
    });

    obstacles.push({
      type: 'double',
      x: trackLength * 0.71, // More space between doubles
      width: trackLength * 0.06,
      height: 35, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
    });

    // Turn 2
    // (no obstacles)

    // Third straight: Rhythm section whoops (more space)
    obstacles.push({
      type: 'whoops',
      x: trackLength * 0.82, // More space after doubles
      width: trackLength * 0.12,
      height: 12, // Slightly increased for visibility
      lanes: [0, 1, 2, 3],
    });

    // Turn 3
    // (no obstacles)

    // Last straight: Water zone and finish line (more space)
    obstacles.push({
      type: 'water',
      x: trackLength * 0.92, // More space after whoops
      width: trackLength * 0.06,
      height: 10,
      lanes: [0, 1, 2, 3],
    });

    obstacles.push({
      type: 'finish',
      x: trackLength * 0.98, // Finish line near the end
      width: 20, // Narrow finish line - just a single line
      height: 50,
      lanes: [0, 1, 2, 3],
    });

    return obstacles;
  }
}

