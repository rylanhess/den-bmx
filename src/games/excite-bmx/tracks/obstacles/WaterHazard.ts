import type { Obstacle, Track } from '../../types';

export class WaterHazard {
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
    
    // Water hazard: shallow water zone that slows racers
    const waterBaseY = bottomLaneY;
    const waterTopY = topLaneY;
    
    // Draw water surface as a flat area
    ctx.fillStyle = '#4169E1'; // Royal blue water
    ctx.beginPath();
    // Top edge
    const waterTopStart = waterTopY - (sideWallDepth * isometricAngle);
    ctx.moveTo(x, waterTopStart);
    ctx.lineTo(x + obstacleScreenWidth, waterTopStart);
    // Bottom edge
    const waterBottomStart = waterBaseY + sideWallDepth;
    ctx.lineTo(x + obstacleScreenWidth, waterBottomStart);
    ctx.lineTo(x, waterBottomStart);
    ctx.closePath();
    ctx.fill();
    
    // Add water texture (ripples)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const rippleX = x + (i * obstacleScreenWidth / 5);
      const rippleY = waterTopY + (trackHeight / 2);
      ctx.beginPath();
      ctx.arc(rippleX, rippleY, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Add side walls for water hazard
    const waterWallGradient = ctx.createLinearGradient(x, topLaneY, x, bottomLaneY + sideWallDepth);
    const darkerTurnColor = this.darkenColor(track.turnColor, 0.4);
    waterWallGradient.addColorStop(0, track.turnColor);
    waterWallGradient.addColorStop(1, darkerTurnColor);
    
    // Left side wall
    ctx.beginPath();
    ctx.moveTo(x, waterTopStart);
    ctx.lineTo(x, waterBottomStart);
    ctx.lineTo(x + 3, waterBottomStart - 2);
    ctx.lineTo(x + 3, waterTopStart - 2);
    ctx.closePath();
    ctx.fillStyle = waterWallGradient;
    ctx.fill();
    
    // Right side wall
    ctx.beginPath();
    ctx.moveTo(x + obstacleScreenWidth, waterTopStart);
    ctx.lineTo(x + obstacleScreenWidth, waterBottomStart);
    ctx.lineTo(x + obstacleScreenWidth - 3, waterBottomStart - 2);
    ctx.lineTo(x + obstacleScreenWidth - 3, waterTopStart - 2);
    ctx.closePath();
    ctx.fillStyle = waterWallGradient;
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

