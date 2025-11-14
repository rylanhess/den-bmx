import type { Track } from '../../../types';

export class ParallelogramDownRamp {
  static draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    startY: number,
    endY: number,
    width: number,
    track: Track,
    sideWallDepth: number,
    isometricAngle: number,
    topLaneY: number,
    bottomLaneY: number
  ) {
    // Draw parallelogram down ramp - Excitebike style
    // This is the downward-sloping ramp surface
    // startY: top Y position (at peak, lower Y value = higher elevation)
    // endY: bottom Y position (at track level)
    
    // Calculate screen Y positions relative to track lanes
    const startScreenY = topLaneY - (startY - bottomLaneY);
    const endScreenY = topLaneY - (endY - bottomLaneY);
    
    // Draw LEFT SIDE WALL - parallelogram spanning all lanes
    ctx.beginPath();
    // Top-left (at top lane, start position - elevated)
    const leftWallTopStart = startScreenY - (sideWallDepth * isometricAngle);
    ctx.moveTo(x, leftWallTopStart);
    // Top-right (at top lane, end position - lower)
    const leftWallTopEnd = endScreenY - (sideWallDepth * isometricAngle);
    ctx.lineTo(x + width, leftWallTopEnd);
    // Bottom-right (at bottom lane, end position, extended down)
    const leftWallBottomEnd = endY + sideWallDepth;
    ctx.lineTo(x + width, leftWallBottomEnd);
    // Bottom-left (at bottom lane, start position, extended down)
    const leftWallBottomStart = startY + sideWallDepth;
    ctx.lineTo(x, leftWallBottomStart);
    ctx.closePath();
    
    // Fill with gradient
    const wallGradient = ctx.createLinearGradient(x, topLaneY, x, bottomLaneY + sideWallDepth);
    const darkerTurnColor = this.darkenColor(track.turnColor, 0.4);
    wallGradient.addColorStop(0, track.turnColor);
    wallGradient.addColorStop(1, darkerTurnColor);
    ctx.fillStyle = wallGradient;
    ctx.fill();
    
    // Draw shadow on top edge (going down)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, startScreenY);
    ctx.lineTo(x + width, endScreenY);
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

