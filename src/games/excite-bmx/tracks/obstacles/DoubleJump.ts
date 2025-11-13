import type { Obstacle, Track } from '../../types';

export class DoubleJump {
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
    
    // Double jump: 2 humps
    const numHumps = 2;
    const humpWidth = obstacleScreenWidth / numHumps;
    const humpBaseY = bottomLaneY;
    const humpPeakY = humpBaseY - obstacle.height;
    
    for (let i = 0; i < numHumps; i++) {
      const humpX = x + (i * humpWidth);
      const humpCenterX = humpX + (humpWidth / 2);
      const humpEndX = humpX + humpWidth;
      
      // Top edge points (at top lane)
      const topStartY = topLaneY;
      const topPeakY = topLaneY - obstacle.height;
      const topEndY = topLaneY;
      
      // Bottom edge points (at bottom lane)
      const bottomStartY = humpBaseY;
      const bottomPeakY = humpPeakY;
      const bottomEndY = humpBaseY;
      
      // LEFT SIDE WALL - Clean parallelogram (upward slope)
      ctx.beginPath();
      const leftWallTopStart = topStartY - (sideWallDepth * isometricAngle);
      ctx.moveTo(humpX, leftWallTopStart);
      const leftWallTopPeak = topPeakY - (sideWallDepth * isometricAngle);
      ctx.lineTo(humpCenterX, leftWallTopPeak);
      const leftWallBottomPeak = bottomPeakY + sideWallDepth;
      ctx.lineTo(humpCenterX, leftWallBottomPeak);
      const leftWallBottomStart = bottomStartY + sideWallDepth;
      ctx.lineTo(humpX, leftWallBottomStart);
      ctx.closePath();
      
      // Fill with gradient
      const humpWallGradient = ctx.createLinearGradient(humpX, topLaneY, humpX, bottomLaneY + sideWallDepth);
      const darkerTurnColor = this.darkenColor(track.turnColor, 0.4);
      humpWallGradient.addColorStop(0, track.turnColor);
      humpWallGradient.addColorStop(1, darkerTurnColor);
      ctx.fillStyle = humpWallGradient;
      ctx.fill();
      
      // RIGHT SIDE WALL - Clean parallelogram (downward slope)
      ctx.beginPath();
      ctx.moveTo(humpCenterX, leftWallTopPeak);
      const rightWallTopEnd = topEndY - (sideWallDepth * isometricAngle);
      ctx.lineTo(humpEndX, rightWallTopEnd);
      const rightWallBottomEnd = bottomEndY + sideWallDepth;
      ctx.lineTo(humpEndX, rightWallBottomEnd);
      ctx.lineTo(humpCenterX, leftWallBottomPeak);
      ctx.closePath();
      ctx.fillStyle = humpWallGradient;
      ctx.fill();
      
      // Clean highlight on hump top edge (left side)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(humpX, topStartY);
      ctx.lineTo(humpCenterX, topPeakY);
      ctx.stroke();
      
      // Clean shadow on hump top edge (right side)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(humpCenterX, topPeakY);
      ctx.lineTo(humpEndX, topEndY);
      ctx.stroke();
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

