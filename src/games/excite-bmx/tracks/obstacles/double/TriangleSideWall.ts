import type { Track } from '../../../types';

export class TriangleSideWall {
  static draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    baseY: number,
    peakY: number,
    track: Track,
    sideWallDepth: number,
    isometricAngle: number,
    topLaneY: number,
    bottomLaneY: number
  ) {
    // Draw triangular side wall - Excitebike style
    // This creates the 3D depth effect on the sides of ramps
    // x: horizontal position
    // baseY: bottom Y position (at track level)
    // peakY: top Y position (at peak of ramp)
    
    ctx.beginPath();
    // Top corner (at top lane, peak elevation)
    const topY = (topLaneY - (baseY - bottomLaneY) + (baseY - peakY)) - (sideWallDepth * isometricAngle);
    ctx.moveTo(x, topY);
    // Bottom corner (at bottom lane, base elevation, extended down)
    const bottomY = baseY + sideWallDepth;
    ctx.lineTo(x, bottomY);
    // Bottom corner extended horizontally (for triangle base)
    ctx.lineTo(x - (sideWallDepth * 0.5), bottomY);
    // Back to top with isometric offset
    ctx.lineTo(x - (sideWallDepth * 0.5), topY + (sideWallDepth * isometricAngle));
    ctx.closePath();
    
    // Fill with gradient for depth
    const wallGradient = ctx.createLinearGradient(x, topLaneY, x, bottomLaneY + sideWallDepth);
    const darkerTurnColor = this.darkenColor(track.turnColor, 0.4);
    wallGradient.addColorStop(0, track.turnColor);
    wallGradient.addColorStop(1, darkerTurnColor);
    ctx.fillStyle = wallGradient;
    ctx.fill();
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

