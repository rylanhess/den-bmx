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
      label: 'Start Hill',
    });

    // First straight: Step up jump, triple (spread out more)

    obstacles.push({
      type: 'step-up',
      x: trackLength * 0.15, // More space after starting hill
      width: trackLength * 0.06,
      height: 45, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
      label: 'Step-Up',
    });

    obstacles.push({
      type: 'triple',
      x: trackLength * 0.30, // More space after step-up
      width: trackLength * 0.10,
      height: 40, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
      label: 'Triple',
    });

    // Turn 1
    obstacles.push({
      type: 'turn',
      x: trackLength * 0.33,
      width: trackLength * 0.10,
      height: 0,
      lanes: [0, 1, 2, 3],
      turnNumber: 1,
      label: 'Turn 1',
    });

    // Second straight: Three doubles (spread out more)
    obstacles.push({
      type: 'double',
      x: trackLength * 0.45, // More space after triple
      width: trackLength * 0.06,
      height: 35, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
      label: 'Double 1',
    });

    obstacles.push({
      type: 'double',
      x: trackLength * 0.58, // More space between doubles
      width: trackLength * 0.06,
      height: 35, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
      label: 'Double 2',
    });

    obstacles.push({
      type: 'double',
      x: trackLength * 0.71, // More space between doubles
      width: trackLength * 0.06,
      height: 35, // Much larger for visible jumps
      lanes: [0, 1, 2, 3],
      label: 'Double 3',
    });

    // Turn 2
    obstacles.push({
      type: 'turn',
      x: trackLength * 0.75,
      width: trackLength * 0.05,
      height: 0,
      lanes: [0, 1, 2, 3],
      turnNumber: 2,
      label: 'Turn 2',
    });

    // Third straight: Rhythm section whoops (more space)
    obstacles.push({
      type: 'whoops',
      x: trackLength * 0.82, // More space after doubles
      width: trackLength * 0.12,
      height: 12, // Slightly increased for visibility
      lanes: [0, 1, 2, 3],
      label: 'Whoops',
    });

    // Turn 3
    obstacles.push({
      type: 'turn',
      x: trackLength * 0.90,
      width: trackLength * 0.05,
      height: 0,
      lanes: [0, 1, 2, 3],
      turnNumber: 3,
      label: 'Turn 3',
    });

    // Last straight: Water zone and finish line (more space)
    obstacles.push({
      type: 'water',
      x: trackLength * 0.92, // More space after whoops
      width: trackLength * 0.06,
      height: 10,
      lanes: [0, 1, 2, 3],
      label: 'Water',
    });

    obstacles.push({
      type: 'finish',
      x: trackLength * 0.98, // Finish line near the end
      width: 20, // Narrow finish line - just a single line
      height: 50,
      lanes: [0, 1, 2, 3],
      label: 'Finish',
    });

    return obstacles;
  }
}

