import type { Track } from '../../../types';

export class TopLipRectangle {
  static draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    peakY: number,
    width: number,
    height: number,
    track: Track,
    topLaneY: number,
    bottomLaneY: number
  ) {
    // Draw top lip rectangle - Excitebike style
    // This is the flat top surface of a hump/ramp peak
    // peakY: Y position at peak (lower Y value = higher elevation)
    
    // Calculate screen Y position relative to track lanes
    const peakScreenY = topLaneY - (peakY - bottomLaneY);
    
    // Draw the top surface as a rectangle spanning all lanes
    ctx.fillStyle = track.trackColor;
    ctx.fillRect(x, peakScreenY, width, height);
    
    // Add highlight on top edge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, peakScreenY);
    ctx.lineTo(x + width, peakScreenY);
    ctx.stroke();
    
    // Add shadow on bottom edge
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, peakScreenY + height);
    ctx.lineTo(x + width, peakScreenY + height);
    ctx.stroke();
  }
}

