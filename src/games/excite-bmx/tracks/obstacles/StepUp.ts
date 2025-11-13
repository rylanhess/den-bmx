import type { Obstacle, Track } from '../../types';

export class StepUp {
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
    
    // Step-up jump: clean triangular pyramid ramp - isometric 3D perspective
    // Similar to start hill but can have different proportions
    const rampBaseY = bottomLaneY;
    const rampPeakY = rampBaseY - obstacle.height;
    const rampUpEndX = x + obstacleScreenWidth * 0.7;
    const rampDownEndX = x + obstacleScreenWidth;
    
    // Calculate clean triangular pyramid points
    // Top edge of ramp (at top lane)
    const topStartY = topLaneY - obstacle.height * 0.3; // Slight elevation at start
    const topPeakY = topLaneY - obstacle.height; // Peak elevation
    const topEndY = topLaneY - obstacle.height * 0.3; // Back to base at end
    
    // Bottom edge of ramp (at bottom lane)
    const bottomStartY = rampBaseY;
    const bottomPeakY = rampPeakY;
    const bottomEndY = rampBaseY;
    
    // LEFT SIDE WALL - Clean parallelogram spanning all lanes
    ctx.beginPath();
    // Top-left (top lane, ramp start)
    const leftWallTopStart = topStartY - (sideWallDepth * isometricAngle);
    ctx.moveTo(x, leftWallTopStart);
    // Top-right (top lane, ramp peak)
    const leftWallTopPeak = topPeakY - (sideWallDepth * isometricAngle);
    ctx.lineTo(rampUpEndX, leftWallTopPeak);
    // Bottom-right (bottom lane, ramp peak, extended down)
    const leftWallBottomPeak = bottomPeakY + sideWallDepth;
    ctx.lineTo(rampUpEndX, leftWallBottomPeak);
    // Bottom-left (bottom lane, ramp start, extended down)
    const leftWallBottomStart = bottomStartY + sideWallDepth;
    ctx.lineTo(x, leftWallBottomStart);
    ctx.closePath();
    
    // Fill with clean gradient
    const rampWallGradient = ctx.createLinearGradient(x, topLaneY, x, bottomLaneY + sideWallDepth);
    const darkerTurnColor = this.darkenColor(track.turnColor, 0.4);
    rampWallGradient.addColorStop(0, track.turnColor);
    rampWallGradient.addColorStop(1, darkerTurnColor);
    ctx.fillStyle = rampWallGradient;
    ctx.fill();
    
    // RIGHT SIDE WALL - Clean parallelogram (downward slope)
    ctx.beginPath();
    // Top-left (top lane, ramp peak)
    ctx.moveTo(rampUpEndX, leftWallTopPeak);
    // Top-right (top lane, ramp end)
    const rightWallTopEnd = topEndY - (sideWallDepth * isometricAngle);
    ctx.lineTo(rampDownEndX, rightWallTopEnd);
    // Bottom-right (bottom lane, ramp end, extended down)
    const rightWallBottomEnd = bottomEndY + sideWallDepth;
    ctx.lineTo(rampDownEndX, rightWallBottomEnd);
    // Bottom-left (bottom lane, ramp peak, extended down)
    ctx.lineTo(rampUpEndX, leftWallBottomPeak);
    ctx.closePath();
    ctx.fillStyle = rampWallGradient;
    ctx.fill();
    
    // Clean highlight on ramp top edge (left side - going up)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, topStartY);
    ctx.lineTo(rampUpEndX, topPeakY);
    ctx.stroke();
    
    // Clean shadow on ramp top edge (right side - going down)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rampUpEndX, topPeakY);
    ctx.lineTo(rampDownEndX, topEndY);
    ctx.stroke();
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

