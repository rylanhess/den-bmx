import type { Obstacle, Track } from '../../types';
import { TriangleSideWall } from './double/TriangleSideWall';
import { ParallelogramUpRamp } from './double/ParallelogramUpRamp';
import { ParallelogramDownRamp } from './double/ParallelogramDownRamp';
import { TopLipRectangle } from './double/TopLipRectangle';

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
    
    // Double jump: Excitebike style - two humps with a valley/ditch between them
    // Structure: Up ramp -> Down into valley -> Up ramp -> Down to track
    const segmentWidth = obstacleScreenWidth / 4; // 4 segments: up, down, up, down
    const humpHeight = obstacle.height;
    const valleyDepth = obstacle.height * 0.4; // Valley goes down 40% of hump height
    const trackBaseY = bottomLaneY;
    const lipHeight = 3; // Height of the flat top lip on each hump
    
    // Segment 1: First up ramp (left hump, going up)
    const seg1StartX = x;
    const seg1EndX = x + segmentWidth;
    const seg1StartY = trackBaseY;
    const seg1PeakY = trackBaseY - humpHeight;
    
    // Top lip of first hump (small rectangle at peak)
    const lip1X = seg1EndX - (segmentWidth * 0.2); // Lip is 20% of segment width
    const lip1Width = segmentWidth * 0.2;
    
    // Segment 2: Down into valley (left side of valley)
    const seg2StartX = seg1EndX;
    const seg2EndX = x + (segmentWidth * 2);
    const seg2StartY = seg1PeakY;
    const seg2ValleyY = trackBaseY - valleyDepth;
    
    // Segment 3: Up from valley (right hump, going up)
    const seg3StartX = seg2EndX;
    const seg3EndX = x + (segmentWidth * 3);
    const seg3StartY = seg2ValleyY;
    const seg3PeakY = trackBaseY - humpHeight;
    
    // Top lip of second hump (small rectangle at peak)
    const lip2X = seg3EndX - (segmentWidth * 0.2);
    const lip2Width = segmentWidth * 0.2;
    
    // Segment 4: Down to track (right side, going down)
    const seg4StartX = seg3EndX;
    const seg4EndX = x + obstacleScreenWidth;
    const seg4StartY = seg3PeakY;
    const seg4EndY = trackBaseY;
    
    // Draw SEGMENT 1: First up ramp
    ParallelogramUpRamp.draw(
      ctx,
      seg1StartX,
      seg1StartY,
      seg1PeakY,
      segmentWidth * 0.8, // Ramp takes 80% of segment, lip takes 20%
      track,
      sideWallDepth,
      isometricAngle,
      topLaneY,
      bottomLaneY
    );
    
    // Draw TOP LIP 1: Flat rectangle at peak of first hump
    TopLipRectangle.draw(
      ctx,
      lip1X,
      seg1PeakY, // peakY
      lip1Width,
      lipHeight,
      track,
      topLaneY,
      bottomLaneY
    );
    
    // Draw SEGMENT 2: Down into valley
    ParallelogramDownRamp.draw(
      ctx,
      seg2StartX,
      seg2StartY,
      seg2ValleyY,
      segmentWidth,
      track,
      sideWallDepth,
      isometricAngle,
      topLaneY,
      bottomLaneY
    );
    
    // Draw SEGMENT 3: Up from valley
    ParallelogramUpRamp.draw(
      ctx,
      seg3StartX,
      seg3StartY,
      seg3PeakY,
      segmentWidth * 0.8, // Ramp takes 80% of segment, lip takes 20%
      track,
      sideWallDepth,
      isometricAngle,
      topLaneY,
      bottomLaneY
    );
    
    // Draw TOP LIP 2: Flat rectangle at peak of second hump
    TopLipRectangle.draw(
      ctx,
      lip2X,
      seg3PeakY, // peakY
      lip2Width,
      lipHeight,
      track,
      topLaneY,
      bottomLaneY
    );
    
    // Draw SEGMENT 4: Down to track
    ParallelogramDownRamp.draw(
      ctx,
      seg4StartX,
      seg4StartY,
      seg4EndY,
      segmentWidth,
      track,
      sideWallDepth,
      isometricAngle,
      topLaneY,
      bottomLaneY
    );
    
    // Draw TRIANGLE SIDE WALLS for key points
    // Left side wall (at start of first hump)
    TriangleSideWall.draw(
      ctx,
      seg1StartX,
      seg1StartY,
      seg1PeakY,
      track,
      sideWallDepth,
      isometricAngle,
      topLaneY,
      bottomLaneY
    );
    
    // Side wall at peak of first hump
    TriangleSideWall.draw(
      ctx,
      seg1EndX,
      seg1PeakY,
      seg1PeakY,
      track,
      sideWallDepth,
      isometricAngle,
      topLaneY,
      bottomLaneY
    );
    
    // Side wall at valley bottom
    TriangleSideWall.draw(
      ctx,
      seg2EndX,
      seg2ValleyY,
      seg2ValleyY,
      track,
      sideWallDepth,
      isometricAngle,
      topLaneY,
      bottomLaneY
    );
    
    // Side wall at peak of second hump
    TriangleSideWall.draw(
      ctx,
      seg3EndX,
      seg3PeakY,
      seg3PeakY,
      track,
      sideWallDepth,
      isometricAngle,
      topLaneY,
      bottomLaneY
    );
    
    // Right side wall (at end of second hump)
    TriangleSideWall.draw(
      ctx,
      seg4EndX,
      seg4EndY,
      seg4EndY,
      track,
      sideWallDepth,
      isometricAngle,
      topLaneY,
      bottomLaneY
    );
  }
}
