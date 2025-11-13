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
    // Track takes up 1/3 of height, background takes up 2/3 (Excitebike layout)
    const trackStartY = canvasHeight * (2/3); // Track starts at 2/3 down (background is top 2/3)
    const trackHeight = canvasHeight * (1/3); // Track takes up exactly 1/3 of height
    const laneHeight = trackHeight / 4; // 4 lanes stacked vertically

    // EXCITEBIKE 3D STYLE: Draw track with isometric perspective
    // Side walls are trapezoids/parallelograms that span ALL 4 lanes
    TrackRenderer.drawTrackWithIsometric3D(ctx, track, cameraX, trackStartY, trackHeight, obstacles, canvasWidth, trackLength);

    // Draw obstacles (ramps) - they modify the track surface with 3D pyramid shapes
    obstacles.forEach(obstacle => {
      const obstacleX = obstacle.x - cameraX;
      if (obstacleX > -100 && obstacleX < canvasWidth + 100) {
        TrackRenderer.drawObstacle3D(ctx, obstacle, obstacleX, trackStartY, trackHeight, track, cameraX, trackLength);
      }
    });

    // Draw lane dividers ON TOP of track surface (following elevation)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
      const baseDividerY = trackStartY + (i * laneHeight);
      
      // Draw divider following track elevation
      ctx.beginPath();
      const samples = 100;
      for (let j = 0; j <= samples; j++) {
        const screenX = (j / samples) * canvasWidth;
        const worldX = cameraX + screenX;
        const elevation = TrackRenderer.getTrackElevation(worldX, obstacles, trackStartY + trackHeight, trackHeight);
        const dividerY = baseDividerY - elevation;
        if (j === 0) {
          ctx.moveTo(screenX, dividerY);
        } else {
          ctx.lineTo(screenX, dividerY);
        }
      }
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
    // Background takes up 2/3 of height (Excitebike layout)
    const backgroundHeight = height * (2/3);
    
    // Sky - always at top portion of background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, width, backgroundHeight * 0.4);
    
    // Background elements based on terrain
    switch (track.terrain) {
      case 'mountainous':
        // Gray mountains in background
        ctx.fillStyle = '#4A4A4A';
        // Draw simple mountain shapes
        for (let i = 0; i < 5; i++) {
          const mountainX = (i * (width / 5)) + (width / 10);
          const mountainHeight = 60 + (i % 2) * 15;
          const mountainBaseY = backgroundHeight * 0.4;
          ctx.beginPath();
          ctx.moveTo(mountainX - 40, mountainBaseY);
          ctx.lineTo(mountainX, mountainBaseY - mountainHeight);
          ctx.lineTo(mountainX + 40, mountainBaseY);
          ctx.closePath();
          ctx.fill();
        }
        // Ground (rest of background area)
        ctx.fillStyle = '#5A5A5A';
        ctx.fillRect(0, backgroundHeight * 0.4, width, backgroundHeight * 0.6);
        break;
      
      case 'grassy-plains':
        // Green grass background (rest of background area)
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, backgroundHeight * 0.4, width, backgroundHeight * 0.6);
        // Some grass detail
        ctx.fillStyle = '#7ACC7A';
        for (let i = 0; i < width; i += 30) {
          ctx.fillRect(i, backgroundHeight * 0.4, 2, 10);
        }
        break;
      
      case 'suburban':
        // Light green with some buildings
        ctx.fillStyle = '#98FB98';
        ctx.fillRect(0, backgroundHeight * 0.4, width, backgroundHeight * 0.6);
        // Simple building shapes
        ctx.fillStyle = '#888888';
        for (let i = 0; i < 3; i++) {
          const buildingX = (i * (width / 3)) + 50;
          ctx.fillRect(buildingX, backgroundHeight * 0.3, 30, 50);
        }
        break;
      
      case 'stadium':
        // Stadium with crowd (Excitebike style - crowd at top of background)
        // Crowd pattern at top
        ctx.fillStyle = '#FF0000';
        for (let i = 0; i < width; i += 20) {
          ctx.fillRect(i, backgroundHeight * 0.1, 10, 15);
        }
        ctx.fillStyle = '#0000FF';
        for (let i = 10; i < width; i += 20) {
          ctx.fillRect(i, backgroundHeight * 0.1, 10, 15);
        }
        // Stadium ground
        ctx.fillStyle = '#2A2A2A';
        ctx.fillRect(0, backgroundHeight * 0.4, width, backgroundHeight * 0.6);
        break;
      
      case 'space':
        // Space background (dark with stars) - fills entire background area
        ctx.fillStyle = '#000011';
        ctx.fillRect(0, 0, width, backgroundHeight);
        // Stars
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 100; i++) {
          const x = (i * 37) % width;
          const y = (i * 23) % backgroundHeight;
          ctx.fillRect(x, y, 2, 2);
        }
        // Planets
        ctx.fillStyle = '#4444FF';
        ctx.beginPath();
        ctx.arc(width * 0.8, backgroundHeight * 0.2, 20, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }

  // Calculate track surface elevation at a given world X position
  private static getTrackElevation(
    worldX: number,
    obstacles: Obstacle[],
    baseY: number,
    trackHeight: number
  ): number {
    // Find if there's a ramp at this X position
    for (const obstacle of obstacles) {
      if (obstacle.type === 'start-hill' || obstacle.type === 'step-up' || 
          obstacle.type === 'triple' || obstacle.type === 'double') {
        const obstacleStart = obstacle.x;
        const obstacleEnd = obstacle.x + obstacle.width;
        
        if (worldX >= obstacleStart && worldX <= obstacleEnd) {
          // Calculate progress through obstacle (0 to 1)
          const progress = (worldX - obstacleStart) / (obstacleEnd - obstacleStart);
          
          switch (obstacle.type) {
            case 'start-hill':
            case 'step-up':
              // Single ramp: up to 70%, then down
              if (progress < 0.7) {
                return (progress / 0.7) * obstacle.height;
              } else {
                const downProgress = (progress - 0.7) / 0.3;
                return obstacle.height * (1 - downProgress);
              }
              
            case 'triple':
            case 'double':
              // Multiple humps
              const numJumps = obstacle.type === 'triple' ? 3 : 2;
              const segmentProgress = (progress * numJumps) % 1;
              return Math.sin(segmentProgress * Math.PI) * obstacle.height;
          }
        }
      }
    }
    return 0; // Flat track
  }

  // Draw track with isometric 3D perspective - Excitebike style
  // Side walls are trapezoids/parallelograms that span ALL 4 lanes
  private static drawTrackWithIsometric3D(
    ctx: CanvasRenderingContext2D,
    track: Track,
    cameraX: number,
    trackY: number,
    trackHeight: number,
    obstacles: Obstacle[],
    canvasWidth: number,
    trackLength: number
  ) {
    const laneHeight = trackHeight / 4;
    const topLaneY = trackY; // Top of top lane
    const bottomLaneY = trackY + trackHeight; // Bottom of bottom lane
    const sideWallDepth = 25; // Depth of side walls (isometric perspective)
    const isometricAngle = 0.3; // Angle for isometric perspective (0-1, where 1 = 45 degrees)
    const samples = 200;
    
    // STEP 1: Draw LEFT SIDE WALL as a TRAPEZOID spanning all 4 lanes
    // This creates the 3D depth effect - the wall is visible from the side
    ctx.beginPath();
    
    // Top edge of side wall (follows top lane elevation)
    for (let i = 0; i <= samples; i++) {
      const screenX = (i / samples) * canvasWidth;
      const worldX = cameraX + screenX;
      const elevation = TrackRenderer.getTrackElevation(worldX, obstacles, bottomLaneY, trackHeight);
      const topSurfaceY = topLaneY - elevation;
      const sideWallTopY = topSurfaceY - (sideWallDepth * isometricAngle); // Isometric offset
      
      if (i === 0) {
        ctx.moveTo(screenX, sideWallTopY);
      } else {
        ctx.lineTo(screenX, sideWallTopY);
      }
    }
    
    // Bottom edge of side wall (extends down and outward for depth)
    for (let i = samples; i >= 0; i--) {
      const screenX = (i / samples) * canvasWidth;
      const worldX = cameraX + screenX;
      const elevation = TrackRenderer.getTrackElevation(worldX, obstacles, bottomLaneY, trackHeight);
      const bottomSurfaceY = bottomLaneY - elevation;
      const sideWallBottomY = bottomSurfaceY + sideWallDepth; // Extends down
      
      ctx.lineTo(screenX, sideWallBottomY);
    }
    
    ctx.closePath();
    
    // Fill with gradient (darker at bottom, lighter at top) for depth
    const sideWallGradient = ctx.createLinearGradient(0, topLaneY, 0, bottomLaneY + sideWallDepth);
    const darkerTurnColor = this.darkenColor(track.turnColor, 0.4);
    sideWallGradient.addColorStop(0, track.turnColor);
    sideWallGradient.addColorStop(1, darkerTurnColor);
    ctx.fillStyle = sideWallGradient;
    ctx.fill();
    
    // Add texture lines to side wall for more depth
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const progress = i / 8;
      const screenX = progress * canvasWidth;
      const worldX = cameraX + screenX;
      const elevation = TrackRenderer.getTrackElevation(worldX, obstacles, bottomLaneY, trackHeight);
      const topY = topLaneY - elevation - (sideWallDepth * isometricAngle);
      const bottomY = bottomLaneY - elevation + sideWallDepth;
      ctx.beginPath();
      ctx.moveTo(screenX, topY);
      ctx.lineTo(screenX, bottomY);
      ctx.stroke();
    }
    
    // STEP 2: Draw RIGHT SIDE WALL as a TRAPEZOID spanning all 4 lanes
    // Right side wall follows the right edge of the track (full width)
    ctx.beginPath();
    
    // Top edge of right side wall (follows top lane elevation at right edge)
    for (let i = 0; i <= samples; i++) {
      const screenX = (i / samples) * canvasWidth;
      const worldX = cameraX + screenX;
      const elevation = TrackRenderer.getTrackElevation(worldX, obstacles, bottomLaneY, trackHeight);
      const topSurfaceY = topLaneY - elevation;
      const sideWallTopY = topSurfaceY - (sideWallDepth * isometricAngle);
      
      if (i === 0) {
        ctx.moveTo(screenX, sideWallTopY);
      } else {
        ctx.lineTo(screenX, sideWallTopY);
      }
    }
    
    // Bottom edge of right side wall (extends down and outward)
    for (let i = samples; i >= 0; i--) {
      const screenX = (i / samples) * canvasWidth;
      const worldX = cameraX + screenX;
      const elevation = TrackRenderer.getTrackElevation(worldX, obstacles, bottomLaneY, trackHeight);
      const bottomSurfaceY = bottomLaneY - elevation;
      const sideWallBottomY = bottomSurfaceY + sideWallDepth;
      
      ctx.lineTo(screenX, sideWallBottomY);
    }
    
    ctx.closePath();
    ctx.fillStyle = sideWallGradient;
    ctx.fill();
    
    // Add texture lines to right side wall
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const progress = i / 8;
      const screenX = progress * canvasWidth;
      const worldX = cameraX + screenX;
      const elevation = TrackRenderer.getTrackElevation(worldX, obstacles, bottomLaneY, trackHeight);
      const topY = topLaneY - elevation - (sideWallDepth * isometricAngle);
      const bottomY = bottomLaneY - elevation + sideWallDepth;
      ctx.beginPath();
      ctx.moveTo(screenX, topY);
      ctx.lineTo(screenX, bottomY);
      ctx.stroke();
    }
    
    // STEP 3: Draw TRACK SURFACE for each lane (on top of side walls)
    for (let lane = 0; lane < 4; lane++) {
      const laneTopY = trackY + (lane * laneHeight);
      const laneBottomY = laneTopY + laneHeight;
      
      // Draw track surface as a parallelogram (isometric perspective)
      ctx.beginPath();
      
      // Top edge of track surface
      for (let i = 0; i <= samples; i++) {
        const screenX = (i / samples) * canvasWidth;
        const worldX = cameraX + screenX;
        const elevation = TrackRenderer.getTrackElevation(worldX, obstacles, bottomLaneY, trackHeight);
        const surfaceY = laneBottomY - elevation;
        const isometricOffset = (sideWallDepth * isometricAngle) * (1 - (lane / 3)); // Less offset for lower lanes
        const topY = surfaceY - isometricOffset;
        
        if (i === 0) {
          ctx.moveTo(screenX, topY);
        } else {
          ctx.lineTo(screenX, topY);
        }
      }
      
      // Bottom edge of track surface
      for (let i = samples; i >= 0; i--) {
        const screenX = (i / samples) * canvasWidth;
        const worldX = cameraX + screenX;
        const elevation = TrackRenderer.getTrackElevation(worldX, obstacles, bottomLaneY, trackHeight);
        const surfaceY = laneBottomY - elevation;
        
        ctx.lineTo(screenX, surfaceY);
      }
      
      ctx.closePath();
      
      // Fill with track color and gradient
      const trackGradient = ctx.createLinearGradient(0, laneTopY, 0, laneBottomY);
      trackGradient.addColorStop(0, track.trackColor);
      const lighterColor = this.lightenColor(track.trackColor, 0.1);
      trackGradient.addColorStop(1, lighterColor);
      ctx.fillStyle = trackGradient;
      ctx.fill();
      
      // Add highlight on top edge
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, laneBottomY);
      for (let i = 0; i <= samples; i++) {
        const screenX = (i / samples) * canvasWidth;
        const worldX = cameraX + screenX;
        const elevation = TrackRenderer.getTrackElevation(worldX, obstacles, bottomLaneY, trackHeight);
        const surfaceY = laneBottomY - elevation;
        const isometricOffset = (sideWallDepth * isometricAngle) * (1 - (lane / 3));
        const topY = surfaceY - isometricOffset;
        if (i === 0) {
          ctx.moveTo(screenX, topY);
        } else {
          ctx.lineTo(screenX, topY);
        }
      }
      ctx.stroke();
    }
  }
  
  // Helper to lighten a color
  private static lightenColor(color: string, amount: number): string {
    // Simple color lightening - if it's a hex color, lighten it
    if (color.startsWith('#')) {
      const num = parseInt(color.replace('#', ''), 16);
      const r = Math.min(255, ((num >> 16) & 0xFF) + (255 * amount));
      const g = Math.min(255, ((num >> 8) & 0xFF) + (255 * amount));
      const b = Math.min(255, (num & 0xFF) + (255 * amount));
      return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }
    return color;
  }
  
  // Helper to darken a color
  private static darkenColor(color: string, amount: number): string {
    // Simple color darkening - if it's a hex color, darken it
    if (color.startsWith('#')) {
      const num = parseInt(color.replace('#', ''), 16);
      const r = Math.max(0, ((num >> 16) & 0xFF) * (1 - amount));
      const g = Math.max(0, ((num >> 8) & 0xFF) * (1 - amount));
      const b = Math.max(0, (num & 0xFF) * (1 - amount));
      return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }
    return color;
  }

  // Draw obstacles with isometric 3D perspective - triangular pyramid ramps
  private static drawObstacle3D(
    ctx: CanvasRenderingContext2D,
    obstacle: Obstacle,
    x: number,
    trackY: number,
    trackHeight: number,
    track: Track,
    cameraX: number,
    trackLength: number
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
    
    const sideWallDepth = 25;
    const isometricAngle = 0.3;
    const topLaneY = trackY;
    const bottomLaneY = trackY + trackHeight;
    
    switch (obstacle.type) {
      case 'start-hill':
      case 'step-up': {
        // Triangular pyramid ramp - isometric 3D perspective
        // Ramp spans all affected lanes with side walls as parallelograms
        const rampBaseY = bottomLaneY;
        const rampPeakY = rampBaseY - obstacle.height;
        const rampUpEndX = x + obstacleScreenWidth * 0.7;
        const rampDownEndX = x + obstacleScreenWidth;
        
        // Get elevation at ramp start and peak
        const worldXStart = cameraX + x;
        const worldXPeak = cameraX + rampUpEndX;
        const elevationStart = TrackRenderer.getTrackElevation(worldXStart, [obstacle], bottomLaneY, trackHeight);
        const elevationPeak = TrackRenderer.getTrackElevation(worldXPeak, [obstacle], bottomLaneY, trackHeight);
        
        // LEFT SIDE WALL of ramp as PARALLELOGRAM spanning all lanes
        // This creates the triangular pyramid effect
        ctx.beginPath();
        // Top-left corner (at top lane, ramp start)
        const leftTopY = topLaneY - elevationStart - (sideWallDepth * isometricAngle);
        ctx.moveTo(x, leftTopY);
        // Top-right corner (at top lane, ramp peak)
        const leftPeakTopY = topLaneY - elevationPeak - (sideWallDepth * isometricAngle);
        ctx.lineTo(rampUpEndX, leftPeakTopY);
        // Bottom-right corner (at bottom lane, ramp peak, extended down)
        const leftPeakBottomY = rampPeakY + sideWallDepth;
        ctx.lineTo(rampUpEndX, leftPeakBottomY);
        // Bottom-left corner (at bottom lane, ramp start, extended down)
        const leftBottomY = rampBaseY + sideWallDepth;
        ctx.lineTo(x, leftBottomY);
        ctx.closePath();
        
        // Fill with gradient for depth
        const rampWallGradient = ctx.createLinearGradient(x, topLaneY, x, bottomLaneY + sideWallDepth);
        const darkerTurnColor = this.darkenColor(track.turnColor, 0.5);
        rampWallGradient.addColorStop(0, track.turnColor);
        rampWallGradient.addColorStop(1, darkerTurnColor);
        ctx.fillStyle = rampWallGradient;
        ctx.fill();
        
        // RIGHT SIDE WALL of ramp (downward slope side)
        ctx.beginPath();
        // Top-left corner (at top lane, ramp peak)
        ctx.moveTo(rampUpEndX, leftPeakTopY);
        // Top-right corner (at top lane, ramp end)
        const rightEndTopY = topLaneY - elevationStart - (sideWallDepth * isometricAngle);
        ctx.lineTo(rampDownEndX, rightEndTopY);
        // Bottom-right corner (at bottom lane, ramp end, extended down)
        const rightEndBottomY = rampBaseY + sideWallDepth;
        ctx.lineTo(rampDownEndX, rightEndBottomY);
        // Bottom-left corner (at bottom lane, ramp peak, extended down)
        ctx.lineTo(rampUpEndX, leftPeakBottomY);
        ctx.closePath();
        ctx.fillStyle = rampWallGradient;
        ctx.fill();
        
        // Add depth shadow on left wall
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.moveTo(x, leftTopY);
        ctx.lineTo(x, leftBottomY);
        ctx.lineTo(x + 6, leftBottomY - 3);
        ctx.lineTo(x + 6, leftTopY - 3);
        ctx.closePath();
        ctx.fill();
        
        // Draw highlight on ramp top edge (left side)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, topLaneY - elevationStart);
        ctx.lineTo(rampUpEndX, topLaneY - elevationPeak);
        ctx.stroke();
        
        // Draw shadow on ramp top edge (right side)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rampUpEndX, topLaneY - elevationPeak);
        ctx.lineTo(rampDownEndX, topLaneY - elevationStart);
        ctx.stroke();
        break;
      }
      
      case 'triple':
      case 'double': {
        // Humps are part of track surface - add prominent 3D side walls
        const numHumps = obstacle.type === 'triple' ? 3 : 2;
        const humpWidth = obstacleScreenWidth / numHumps;
        const humpBaseY = startLaneY + obstacleHeight;
        const humpSideWallHeight = 12; // Prominent 3D side walls
        
        for (let i = 0; i < numHumps; i++) {
          const humpX = x + (i * humpWidth);
          const humpCenterX = humpX + (humpWidth / 2);
          const peakY = humpBaseY - obstacle.height;
          
          // Draw SIDE WALLS of hump (prominent 3D effect - darker)
          ctx.fillStyle = track.turnColor;
          ctx.beginPath();
          ctx.moveTo(humpX, humpBaseY);
          ctx.lineTo(humpX, humpBaseY + humpSideWallHeight);
          ctx.quadraticCurveTo(humpCenterX, peakY + humpSideWallHeight, humpX + humpWidth, humpBaseY + humpSideWallHeight);
          ctx.quadraticCurveTo(humpCenterX, peakY, humpX + humpWidth, humpBaseY);
          ctx.closePath();
          ctx.fill();
          
          // Draw depth shadow on left side
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.moveTo(humpX, humpBaseY);
          ctx.lineTo(humpX, humpBaseY + humpSideWallHeight);
          ctx.quadraticCurveTo(humpX + 3, peakY + humpSideWallHeight - 2, humpX + humpWidth / 2, humpBaseY + humpSideWallHeight / 2);
          ctx.quadraticCurveTo(humpX + 3, peakY - 2, humpX, humpBaseY);
          ctx.closePath();
          ctx.fill();
          
          // Draw highlight on left side of hump (shows elevation)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(humpX, humpBaseY);
          ctx.quadraticCurveTo(humpCenterX, peakY, humpX + humpWidth / 2, humpBaseY - obstacle.height / 2);
          ctx.stroke();
          
          // Draw shadow on right side of hump
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(humpX + humpWidth / 2, humpBaseY - obstacle.height / 2);
          ctx.quadraticCurveTo(humpCenterX, peakY, humpX + humpWidth, humpBaseY);
          ctx.stroke();
        }
        break;
      }
      
      case 'whoops': {
        // Draw rhythm section as SMALL BUMPY TRACK - Excitebike style
        // Whoops are small bumps that are part of the track (not big jumps)
        const numBumps = 8;
        const bumpWidth = obstacleScreenWidth / numBumps;
        const whoopsBaseY = startLaneY + obstacleHeight;
        const sideWallHeight = 3; // Small 3D effect for whoops
        
        // Erase flat track in this area
        ctx.fillStyle = track.trackColor;
        ctx.fillRect(x, startLaneY, obstacleScreenWidth, obstacleHeight);
        
        for (let i = 0; i < numBumps; i++) {
          const bumpX = x + (i * bumpWidth);
          const bumpCenterX = bumpX + (bumpWidth / 2);
          const peakY = whoopsBaseY - obstacle.height;
          
          // Draw side walls for 3D effect (small)
          ctx.fillStyle = track.turnColor;
          ctx.beginPath();
          ctx.moveTo(bumpX, whoopsBaseY);
          ctx.lineTo(bumpX, whoopsBaseY + sideWallHeight);
          ctx.quadraticCurveTo(bumpCenterX, peakY + sideWallHeight, bumpX + bumpWidth, whoopsBaseY + sideWallHeight);
          ctx.quadraticCurveTo(bumpCenterX, peakY, bumpX + bumpWidth, whoopsBaseY);
          ctx.closePath();
          ctx.fill();
          
          // Draw top surface of bump
          ctx.fillStyle = track.trackColor;
          ctx.beginPath();
          ctx.moveTo(bumpX, whoopsBaseY);
          ctx.quadraticCurveTo(bumpCenterX, peakY, bumpX + bumpWidth, whoopsBaseY);
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

