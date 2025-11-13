import type { Obstacle, Track } from '../../types';

export class RhythmSection {
  static draw(
    ctx: CanvasRenderingContext2D,
    obstacle: Obstacle,
    x: number,
    trackY: number,
    trackHeight: number,
    track: Track,
    cameraX: number,
    sideWallDepth: number,
    isometricAngle: number
  ) {
    const laneHeight = trackHeight / 4;
    const topLaneY = trackY;
    const bottomLaneY = trackY + trackHeight;
    const obstacleScreenWidth = Math.max(40, (obstacle.width / 2000) * 800);
    
    // Rhythm section: multiple small whoops
    const numBumps = 8;
    const bumpWidth = obstacleScreenWidth / numBumps;
    const whoopsBaseY = bottomLaneY;
    const whoopsPeakY = whoopsBaseY - obstacle.height;
    const smallSideWallDepth = sideWallDepth * 0.3; // Smaller side walls for whoops
    
    for (let i = 0; i < numBumps; i++) {
      const bumpX = x + (i * bumpWidth);
      const bumpCenterX = bumpX + (bumpWidth / 2);
      const bumpEndX = bumpX + bumpWidth;
      
      // Top edge points (at top lane)
      const topStartY = topLaneY;
      const topPeakY = topLaneY - obstacle.height;
      const topEndY = topLaneY;
      
      // Bottom edge points (at bottom lane)
      const bottomStartY = whoopsBaseY;
      const bottomPeakY = whoopsPeakY;
      const bottomEndY = whoopsBaseY;
      
      // LEFT SIDE WALL - Small parallelogram (upward slope)
      ctx.beginPath();
      const leftWallTopStart = topStartY - (smallSideWallDepth * isometricAngle);
      ctx.moveTo(bumpX, leftWallTopStart);
      const leftWallTopPeak = topPeakY - (smallSideWallDepth * isometricAngle);
      ctx.lineTo(bumpCenterX, leftWallTopPeak);
      const leftWallBottomPeak = bottomPeakY + smallSideWallDepth;
      ctx.lineTo(bumpCenterX, leftWallBottomPeak);
      const leftWallBottomStart = bottomStartY + smallSideWallDepth;
      ctx.lineTo(bumpX, leftWallBottomStart);
      ctx.closePath();
      
      // Fill with gradient
      const whoopsWallGradient = ctx.createLinearGradient(bumpX, topLaneY, bumpX, bottomLaneY + smallSideWallDepth);
      const darkerTurnColor = this.darkenColor(track.turnColor, 0.3);
      whoopsWallGradient.addColorStop(0, track.turnColor);
      whoopsWallGradient.addColorStop(1, darkerTurnColor);
      ctx.fillStyle = whoopsWallGradient;
      ctx.fill();
      
      // RIGHT SIDE WALL - Small parallelogram (downward slope)
      ctx.beginPath();
      ctx.moveTo(bumpCenterX, leftWallTopPeak);
      const rightWallTopEnd = topEndY - (smallSideWallDepth * isometricAngle);
      ctx.lineTo(bumpEndX, rightWallTopEnd);
      const rightWallBottomEnd = bottomEndY + smallSideWallDepth;
      ctx.lineTo(bumpEndX, rightWallBottomEnd);
      ctx.lineTo(bumpCenterX, leftWallBottomPeak);
      ctx.closePath();
      ctx.fillStyle = whoopsWallGradient;
      ctx.fill();
    }
  }
  
  private static darkenColor(color: string, amount: number): string {
    if (color.startsWith('#')) {
      const num = parseInt(color.replace('#', ''), 16);
      const r = Math.max(0, ((num >> 16) & 0xFF) * (1 - amount));
      const g = Math.max(0, ((num >> 8) & 0xFF) * (1 - amount));
      const b = Math.max(0, (num & 0xFF) * (1 - amount));
      return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }
    return color;
  }
}

