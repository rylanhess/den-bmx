import type { Obstacle, Track } from '../../types';

export class StartHill {
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
    
    // Starting hill: DOWNWARD ramp for speed - isometric 3D perspective
    // This is a down ramp where riders get speed into the track
    // Ramp starts high and goes down to track level
    const rampStartY = bottomLaneY - obstacle.height; // Start high (elevated)
    const rampEndY = bottomLaneY; // End at track level
    const rampDownStartX = x;
    const rampDownEndX = x + obstacleScreenWidth;
    
    // Calculate clean downward ramp points
    // Top edge of ramp (at top lane) - starts high, goes down
    const topStartY = topLaneY - obstacle.height; // High at start
    const topEndY = topLaneY; // Down to track level at end
    
    // Bottom edge of ramp (at bottom lane) - starts high, goes down
    const bottomStartY = rampStartY;
    const bottomEndY = rampEndY;
    
    // LEFT SIDE WALL - Clean parallelogram spanning all lanes (downward slope)
    ctx.beginPath();
    // Top-left (top lane, ramp start - high)
    const leftWallTopStart = topStartY - (sideWallDepth * isometricAngle);
    ctx.moveTo(rampDownStartX, leftWallTopStart);
    // Top-right (top lane, ramp end - down to track level)
    const leftWallTopEnd = topEndY - (sideWallDepth * isometricAngle);
    ctx.lineTo(rampDownEndX, leftWallTopEnd);
    // Bottom-right (bottom lane, ramp end, extended down)
    const leftWallBottomEnd = bottomEndY + sideWallDepth;
    ctx.lineTo(rampDownEndX, leftWallBottomEnd);
    // Bottom-left (bottom lane, ramp start, extended down)
    const leftWallBottomStart = bottomStartY + sideWallDepth;
    ctx.lineTo(rampDownStartX, leftWallBottomStart);
    ctx.closePath();
    
    // Fill with clean gradient
    const rampWallGradient = ctx.createLinearGradient(rampDownStartX, topLaneY, rampDownStartX, bottomLaneY + sideWallDepth);
    const darkerTurnColor = this.darkenColor(track.turnColor, 0.4);
    rampWallGradient.addColorStop(0, track.turnColor);
    rampWallGradient.addColorStop(1, darkerTurnColor);
    ctx.fillStyle = rampWallGradient;
    ctx.fill();
    
    // RIGHT SIDE WALL - Clean parallelogram (same downward slope)
    ctx.beginPath();
    // Top-left (top lane, ramp start - high)
    ctx.moveTo(rampDownStartX, leftWallTopStart);
    // Top-right (top lane, ramp end - down to track level)
    ctx.lineTo(rampDownEndX, leftWallTopEnd);
    // Bottom-right (bottom lane, ramp end, extended down)
    ctx.lineTo(rampDownEndX, leftWallBottomEnd);
    // Bottom-left (bottom lane, ramp start, extended down)
    ctx.lineTo(rampDownStartX, leftWallBottomStart);
    ctx.closePath();
    ctx.fillStyle = rampWallGradient;
    ctx.fill();
    
    // Clean highlight on ramp top edge (going down)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rampDownStartX, topStartY);
    ctx.lineTo(rampDownEndX, topEndY);
    ctx.stroke();
    
    // Clean shadow on ramp bottom edge
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rampDownStartX, bottomStartY);
    ctx.lineTo(rampDownEndX, bottomEndY);
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

