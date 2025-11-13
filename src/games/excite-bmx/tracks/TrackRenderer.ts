import type { Track, Obstacle } from '../types';

export class TrackRenderer {
  static draw(
    ctx: CanvasRenderingContext2D,
    track: Track,
    cameraX: number,
    canvasWidth: number,
    canvasHeight: number,
    obstacles: Obstacle[],
    trackLength: number = 2000
  ) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Draw background based on terrain
    TrackRenderer.drawBackground(ctx, track, canvasWidth, canvasHeight);

    // Draw track - Excitebike style: 4 vertical lanes (stacked top to bottom)
    // Track is more compact, doesn't take up entire screen
    const trackStartY = canvasHeight * 0.25; // Start track lower
    const trackHeight = canvasHeight * 0.35; // Track takes up only 35% of height (more compact)
    const laneHeight = trackHeight / 4; // 4 lanes stacked vertically

    // Draw track surface - but we'll draw it around obstacles
    // First, draw base track surface
    ctx.fillStyle = track.trackColor;
    ctx.fillRect(0, trackStartY, canvasWidth, trackHeight);

    // Draw obstacles FIRST (they replace track surface)
    obstacles.forEach(obstacle => {
      const obstacleX = obstacle.x - cameraX;
      if (obstacleX > -100 && obstacleX < canvasWidth + 100) {
        TrackRenderer.drawObstacle(ctx, obstacle, obstacleX, trackStartY, trackHeight, track);
      }
    });

    // Draw lane dividers ON TOP of obstacles (so they appear on ramps too)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
      const dividerY = trackStartY + (i * laneHeight);
      ctx.beginPath();
      ctx.moveTo(0, dividerY);
      ctx.lineTo(canvasWidth, dividerY);
      ctx.stroke();
    }

    // Draw turns (visual indicators)
    TrackRenderer.drawTurns(ctx, track, cameraX, trackStartY, trackHeight, trackLength, canvasWidth);

    ctx.restore();
  }

  private static drawBackground(
    ctx: CanvasRenderingContext2D,
    track: Track,
    width: number,
    height: number
  ) {
    // Sky - always at top
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, width, height * 0.6);
    
    // Background elements based on terrain
    switch (track.terrain) {
      case 'mountainous':
        // Gray mountains in background
        ctx.fillStyle = '#4A4A4A';
        // Draw simple mountain shapes
        for (let i = 0; i < 5; i++) {
          const mountainX = (i * (width / 5)) + (width / 10);
          const mountainHeight = 80 + (i % 2) * 20;
          ctx.beginPath();
          ctx.moveTo(mountainX - 40, height * 0.6);
          ctx.lineTo(mountainX, height * 0.6 - mountainHeight);
          ctx.lineTo(mountainX + 40, height * 0.6);
          ctx.closePath();
          ctx.fill();
        }
        // Ground
        ctx.fillStyle = '#5A5A5A';
        ctx.fillRect(0, height * 0.6, width, height * 0.4);
        break;
      
      case 'grassy-plains':
        // Green grass background
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, height * 0.6, width, height * 0.4);
        // Some grass detail
        ctx.fillStyle = '#7ACC7A';
        for (let i = 0; i < width; i += 30) {
          ctx.fillRect(i, height * 0.6, 2, 10);
        }
        break;
      
      case 'suburban':
        // Light green with some buildings
        ctx.fillStyle = '#98FB98';
        ctx.fillRect(0, height * 0.6, width, height * 0.4);
        // Simple building shapes
        ctx.fillStyle = '#888888';
        for (let i = 0; i < 3; i++) {
          const buildingX = (i * (width / 3)) + 50;
          ctx.fillRect(buildingX, height * 0.5, 30, 50);
        }
        break;
      
      case 'stadium':
        // Stadium with crowd
        ctx.fillStyle = '#2A2A2A';
        ctx.fillRect(0, height * 0.6, width, height * 0.4);
        // Crowd pattern
        ctx.fillStyle = '#FF0000';
        for (let i = 0; i < width; i += 20) {
          ctx.fillRect(i, height * 0.6, 10, 15);
        }
        ctx.fillStyle = '#0000FF';
        for (let i = 10; i < width; i += 20) {
          ctx.fillRect(i, height * 0.6, 10, 15);
        }
        break;
      
      case 'space':
        // Space background (dark with stars)
        ctx.fillStyle = '#000011';
        ctx.fillRect(0, 0, width, height);
        // Stars
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 100; i++) {
          const x = (i * 37) % width;
          const y = (i * 23) % height;
          ctx.fillRect(x, y, 2, 2);
        }
        // Planets
        ctx.fillStyle = '#4444FF';
        ctx.beginPath();
        ctx.arc(width * 0.8, height * 0.2, 20, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }

  private static drawObstacle(
    ctx: CanvasRenderingContext2D,
    obstacle: Obstacle,
    x: number,
    trackY: number,
    trackHeight: number,
    track: Track
  ) {
    // Draw obstacle in Excitebike style
    // x is already in screen coordinates (obstacle.x - cameraX)
    // Obstacles span horizontally across the track width
    // They affect specific lanes vertically
    const canvasWidth = ctx.canvas.width;
    const laneHeight = trackHeight / 4;
    const obstacleScreenWidth = Math.max(40, (obstacle.width / 2000) * 800);
    
    // Calculate which lanes this obstacle affects
    const affectedLanes = obstacle.lanes;
    const startLaneY = trackY + (affectedLanes[0] * laneHeight);
    const endLaneY = trackY + ((affectedLanes[affectedLanes.length - 1] + 1) * laneHeight);
    const obstacleHeight = endLaneY - startLaneY;
    
    switch (obstacle.type) {
      case 'start-hill':
      case 'step-up':
        // Draw ramp as ELEVATED TRACK SURFACE - Excitebike style
        // The ramp IS the track, just elevated
        const rampBaseY = startLaneY + obstacleHeight;
        const rampPeakY = rampBaseY - obstacle.height;
        const rampUpEndX = x + obstacleScreenWidth * 0.7;
        const rampDownEndX = x + obstacleScreenWidth;
        
        // Erase the flat track in this area first (draw background)
        ctx.fillStyle = track.trackColor; // Will be covered by ramp
        ctx.fillRect(x, startLaneY, obstacleScreenWidth, obstacleHeight);
        
        // Draw the elevated ramp surface (this IS the track)
        ctx.fillStyle = track.trackColor;
        ctx.beginPath();
        ctx.moveTo(x, rampBaseY);
        ctx.lineTo(rampUpEndX, rampPeakY);
        ctx.lineTo(rampDownEndX, rampBaseY);
        ctx.lineTo(rampDownEndX, rampBaseY + 2); // Slight thickness
        ctx.lineTo(rampUpEndX, rampPeakY + 2);
        ctx.lineTo(x, rampBaseY + 2);
        ctx.closePath();
        ctx.fill();
        
        // Draw track texture lines on ramp (horizontal lines following ramp)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 5; i++) {
          const progress = i / 5;
          const lineX = x + (obstacleScreenWidth * progress);
          const lineY = rampBaseY - (obstacle.height * Math.min(progress / 0.7, 1) * (progress < 0.7 ? 1 : (1 - (progress - 0.7) / 0.3)));
          ctx.beginPath();
          ctx.moveTo(lineX, lineY);
          ctx.lineTo(lineX, lineY + 1);
          ctx.stroke();
        }
        
        // Draw side edge of ramp (3D effect)
        ctx.fillStyle = track.turnColor;
        ctx.fillRect(x - 1, rampBaseY, 2, 3);
        break;
      
      case 'triple':
      case 'double': {
        // Draw humps as ELEVATED TRACK SURFACE - Excitebike style
        const numHumps = obstacle.type === 'triple' ? 3 : 2;
        const humpWidth = obstacleScreenWidth / numHumps;
        const humpBaseY = startLaneY + obstacleHeight;
        
        // Erase flat track in this area
        ctx.fillStyle = track.trackColor;
        ctx.fillRect(x, startLaneY, obstacleScreenWidth, obstacleHeight);
        
        for (let i = 0; i < numHumps; i++) {
          const humpX = x + (i * humpWidth);
          const humpCenterX = humpX + (humpWidth / 2);
          const peakY = humpBaseY - obstacle.height;
          
          // Hump surface IS the track (elevated)
          ctx.fillStyle = track.trackColor;
          ctx.beginPath();
          ctx.moveTo(humpX, humpBaseY);
          ctx.quadraticCurveTo(humpCenterX, peakY, humpX + humpWidth, humpBaseY);
          ctx.lineTo(humpX + humpWidth, humpBaseY + 2); // Thickness
          ctx.quadraticCurveTo(humpCenterX, peakY + 2, humpX, humpBaseY + 2);
          ctx.closePath();
          ctx.fill();
          
          // Track texture line at peak
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(humpCenterX, peakY);
          ctx.lineTo(humpCenterX, peakY + 1);
          ctx.stroke();
        }
        break;
      }
      
      case 'whoops': {
        // Draw rhythm section as ELEVATED TRACK SURFACE - Excitebike style
        // Whoops are small bumps that are part of the track
        const numBumps = 8;
        const bumpWidth = obstacleScreenWidth / numBumps;
        const whoopsBaseY = startLaneY + obstacleHeight;
        
        // Erase flat track in this area
        ctx.fillStyle = track.trackColor;
        ctx.fillRect(x, startLaneY, obstacleScreenWidth, obstacleHeight);
        
        for (let i = 0; i < numBumps; i++) {
          const bumpX = x + (i * bumpWidth);
          const bumpCenterX = bumpX + (bumpWidth / 2);
          const peakY = whoopsBaseY - obstacle.height;
          
          // Bump surface IS the track (elevated)
          ctx.fillStyle = track.trackColor;
          ctx.beginPath();
          ctx.moveTo(bumpX, whoopsBaseY);
          ctx.quadraticCurveTo(bumpCenterX, peakY, bumpX + bumpWidth, whoopsBaseY);
          ctx.lineTo(bumpX + bumpWidth, whoopsBaseY + 1); // Thickness
          ctx.quadraticCurveTo(bumpCenterX, peakY + 1, bumpX, whoopsBaseY + 1);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }
      
      case 'water':
        // Draw water zone (blue) - spans horizontally across affected lanes
        ctx.fillStyle = '#0066FF';
        ctx.fillRect(x, startLaneY, obstacleScreenWidth, obstacleHeight);
        // Water effect (wavy lines)
        ctx.strokeStyle = '#00AAFF';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(x, startLaneY + (i * (obstacleHeight / 3)));
          ctx.lineTo(x + obstacleScreenWidth, startLaneY + (i * (obstacleHeight / 3)));
          ctx.stroke();
        }
        break;
      
      case 'finish':
        // Draw finish line as a VERTICAL checkered line spanning ALL LANES (Excitebike style)
        // In Excitebike, lanes are vertical (stacked top to bottom), so finish line is vertical
        const checkSize = 12;
        const finishLineX = x; // X position of the finish line
        const finishLineWidth = 8; // Width (thickness) of the finish line
        
        // Draw checkered pattern spanning FULL TRACK HEIGHT (all 4 lanes vertically)
        // trackY is the start of the track, trackHeight is the full height of all lanes
        for (let i = 0; i < Math.floor(trackHeight / checkSize); i++) {
          ctx.fillStyle = (i % 2 === 0) ? '#FFFFFF' : '#000000';
          ctx.fillRect(
            finishLineX - (finishLineWidth / 2), // Center the line at x position
            trackY + (i * checkSize), // Start from top of track
            finishLineWidth,
            checkSize
          );
        }
        
        // Add "FINISH" text to the left of the line (centered vertically on track)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('FINISH', finishLineX - finishLineWidth - 5, trackY + (trackHeight / 2));
        break;
    }
  }

  private static drawTurns(
    ctx: CanvasRenderingContext2D,
    track: Track,
    cameraX: number,
    trackY: number,
    trackHeight: number,
    trackLength: number,
    canvasWidth: number
  ) {
    // Draw turn indicators (curved sections) - horizontal lines across track
    const turnPositions = [trackLength * 0.3, trackLength * 0.6, trackLength * 0.8];
    
    turnPositions.forEach(turnX => {
      const screenX = turnX - cameraX;
      if (screenX > -50 && screenX < canvasWidth + 50) {
        // Draw turn surface (different color) - vertical bar
        ctx.fillStyle = track.turnColor;
        ctx.fillRect(screenX - 25, trackY, 50, trackHeight);
        
        // Draw turn indicator lines (horizontal across track)
        ctx.strokeStyle = '#FFFF00';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(screenX - 25, trackY);
        ctx.lineTo(screenX + 25, trackY);
        ctx.moveTo(screenX - 25, trackY + trackHeight);
        ctx.lineTo(screenX + 25, trackY + trackHeight);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }
}

