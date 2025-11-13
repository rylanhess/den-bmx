import type { Racer, Obstacle } from '../types';

export class PhysicsEngine {
  private static readonly GRAVITY = 0.5;
  private static readonly BASE_SPEED = 2.5;
  private static readonly MAX_SPEED = 6.0;
  private static readonly MIN_SPEED = 1.0;
  private static readonly ACCELERATION = 0.20; // speed increase per frame when accelerating (increased for more responsive feel)
  private static readonly DECELERATION = 0.06; // natural deceleration (friction/drag) - reduced for better momentum
  private static readonly JUMP_VELOCITY = -8;
  private static readonly KICK_FORCE = -1.5;
  private static readonly KICK_COOLDOWN = 60; // frames
  private static readonly BIKE_ANGLE_SPEED = 2.0; // degrees per frame for bike tilt
  private static readonly MAX_BIKE_ANGLE = 45; // max tilt angle

  static updateRacer(racer: Racer, deltaTime: number, obstacles: Obstacle[], isPlayer: boolean, isAccelerating: boolean = false) {
    const dt = deltaTime * 0.1; // Normalized delta time
    
    // Update animation frame
    racer.animationFrame += dt;

    // Update kick cooldown
    if (racer.kickCooldown > 0) {
      racer.kickCooldown -= dt;
    }

    // Initialize target speed if not set
    if (racer.targetSpeed === undefined) {
      racer.targetSpeed = isPlayer ? PhysicsEngine.BASE_SPEED + 0.5 : PhysicsEngine.BASE_SPEED;
    }

    // MOMENTUM-BASED SPEED SYSTEM (Excitebike style)
    // Speed gradually accelerates/decelerates instead of being constant
    if (isAccelerating && isPlayer) {
      // Accelerating - gradually increase speed
      racer.targetSpeed = Math.min(racer.targetSpeed + PhysicsEngine.ACCELERATION * dt, PhysicsEngine.MAX_SPEED);
    } else {
      // Natural deceleration (friction/drag)
      racer.targetSpeed = Math.max(racer.targetSpeed - PhysicsEngine.DECELERATION * dt, PhysicsEngine.MIN_SPEED);
    }

    // Smoothly interpolate current speed toward target speed
    const speedDiff = racer.targetSpeed - racer.speed;
    racer.speed += speedDiff * 0.2; // Smooth acceleration/deceleration

    // Apply landing speed penalty (from bad landings)
    if (racer.landingSpeedPenalty > 0) {
      racer.speed *= (1 - racer.landingSpeedPenalty);
      racer.landingSpeedPenalty = Math.max(0, racer.landingSpeedPenalty - 0.05 * dt); // Gradually recover
    }

    // Check for obstacles (ramps)
    const currentObstacle = this.getCurrentObstacle(racer, obstacles);
    
    // Excitebike-style physics: Riders only elevate when on ramps
    // On flat track, yOffset is always 0
    if (currentObstacle && (currentObstacle.type === 'start-hill' || currentObstacle.type === 'step-up' || 
        currentObstacle.type === 'triple' || currentObstacle.type === 'double')) {
      // On a ramp - follow the ramp surface
      if (!racer.onRamp) {
        racer.onRamp = true;
        racer.rampType = currentObstacle.type;
        racer.rampProgress = 0;
        racer.isJumping = false; // Not jumping, just on ramp
        racer.jumpVelocity = 0;
        // Store approach speed for jump calculation
        racer.rampApproachSpeed = racer.speed;
      }
      
      // Calculate progress along ramp (0 to 1)
      // Use racer's front edge position for accurate progress calculation
      const racerSpriteWidth = 30; // Match the width used in detection
      const racerFrontEdge = racer.position + racerSpriteWidth;
      const buffer = 50; // Match the buffer used in detection
      const rampStart = currentObstacle.x + buffer;
      const rampEnd = currentObstacle.x + currentObstacle.width - 10; // Match end buffer
      racer.rampProgress = (racerFrontEdge - rampStart) / (rampEnd - rampStart);
      racer.rampProgress = Math.max(0, Math.min(1, racer.rampProgress));
      
      // Follow ramp surface - Excitebike style: smooth elevation following track
      // Jump height/distance affected by approach speed (more pronounced effect)
      const speedMultiplier = Math.min(1.0 + ((racer.rampApproachSpeed - PhysicsEngine.BASE_SPEED) / PhysicsEngine.BASE_SPEED) * 0.8, 1.6);
      
      switch (currentObstacle.type) {
        case 'start-hill':
        case 'step-up':
          // Single ramp: smooth diagonal up, then smooth diagonal down
          // Ramp goes up to 70% then down to 100%
          if (racer.rampProgress < 0.7) {
            // Going up the ramp - speed affects height
            racer.yOffset = (racer.rampProgress / 0.7) * currentObstacle.height * speedMultiplier;
          } else {
            // Coming down the ramp
            const downProgress = (racer.rampProgress - 0.7) / 0.3;
            racer.yOffset = currentObstacle.height * speedMultiplier * (1 - downProgress);
            
            // Check landing - bad angle causes speed penalty
            if (downProgress > 0.8 && Math.abs(racer.bikeAngle) > 20) {
              racer.landingSpeedPenalty = Math.min(0.3, racer.landingSpeedPenalty + 0.1);
            }
          }
          break;
          
        case 'triple':
        case 'double':
          // Multiple humps: follow each hump smoothly
          const numJumps = currentObstacle.type === 'triple' ? 3 : 2;
          const segmentProgress = (racer.rampProgress * numJumps) % 1;
          // Smooth arc for each hump - affected by speed
          racer.yOffset = Math.sin(segmentProgress * Math.PI) * currentObstacle.height * speedMultiplier;
          
          // Landing check between humps
          if (segmentProgress > 0.9 && Math.abs(racer.bikeAngle) > 25) {
            racer.landingSpeedPenalty = Math.min(0.2, racer.landingSpeedPenalty + 0.05);
          }
          break;
      }

      // Mid-air bike angle control (Excitebike style)
      // Bike naturally returns to level when not controlled
      if (racer.bikeAngle !== 0) {
        const returnSpeed = PhysicsEngine.BIKE_ANGLE_SPEED * dt;
        if (racer.bikeAngle > 0) {
          racer.bikeAngle = Math.max(0, racer.bikeAngle - returnSpeed);
        } else {
          racer.bikeAngle = Math.min(0, racer.bikeAngle + returnSpeed);
        }
      }
    } else {
      // NOT on a ramp - must be on flat track
      // Excitebike: riders are always on track surface when not on ramps
      if (racer.onRamp) {
        // Just left a ramp - check landing quality
        const landingAngle = Math.abs(racer.bikeAngle);
        if (landingAngle > 30) {
          // Bad landing - significant speed penalty
          racer.landingSpeedPenalty = Math.min(0.4, racer.landingSpeedPenalty + 0.2);
        } else if (landingAngle > 15) {
          // Slight penalty
          racer.landingSpeedPenalty = Math.min(0.2, racer.landingSpeedPenalty + 0.1);
        }
        
        racer.onRamp = false;
        racer.rampType = null;
        racer.rampProgress = 0;
        racer.rampApproachSpeed = undefined;
      }
      
      // CRITICAL: Force yOffset to 0 when NOT on a ramp
      // This prevents random hopping - racers should ONLY be elevated when on ramps
      racer.yOffset = 0;
      racer.isJumping = false;
      racer.jumpVelocity = 0;
      
      // Bike angle returns to level on flat track
      if (racer.bikeAngle !== 0) {
        const returnSpeed = PhysicsEngine.BIKE_ANGLE_SPEED * 2 * dt; // Faster return on ground
        if (racer.bikeAngle > 0) {
          racer.bikeAngle = Math.max(0, racer.bikeAngle - returnSpeed);
        } else {
          racer.bikeAngle = Math.min(0, racer.bikeAngle + returnSpeed);
        }
      }
    }
    
    // DOUBLE-CHECK: Ensure yOffset is 0 if we're not on a ramp
    // This is a safety check to prevent any random elevation
    if (!racer.onRamp && racer.yOffset !== 0) {
      racer.yOffset = 0;
      racer.isJumping = false;
      racer.jumpVelocity = 0;
    }

    // Handle other obstacles (whoops, water)
    if (currentObstacle) {
      this.handleObstacle(racer, currentObstacle, dt);
    }

    // AI speed management (simpler for AI)
    if (!isPlayer) {
      // AI gradually accelerates
      racer.targetSpeed = Math.min(racer.targetSpeed + 0.05 * dt, PhysicsEngine.BASE_SPEED + 0.3);
      racer.speed = racer.targetSpeed;
    }

    // Update position based on current speed
    racer.position += racer.speed * dt;
  }

  static jump(racer: Racer) {
    if (!racer.isJumping) {
      racer.isJumping = true;
      racer.jumpVelocity = PhysicsEngine.JUMP_VELOCITY;
    }
  }

  static kick(racer: Racer, targetRacer: Racer) {
    if (racer.kickCooldown <= 0 && !racer.isKicking) {
      racer.isKicking = true;
      racer.kickCooldown = PhysicsEngine.KICK_COOLDOWN;
      
      // Push target back
      targetRacer.position += PhysicsEngine.KICK_FORCE;
      if (targetRacer.position < 0) targetRacer.position = 0;
      
      // Reset kicking animation after a short time
      setTimeout(() => {
        racer.isKicking = false;
      }, 200);
    }
  }

  static powerBoost(racer: Racer) {
    // Increase target speed for momentum-based acceleration
    racer.targetSpeed = Math.min(racer.targetSpeed + 0.5, PhysicsEngine.MAX_SPEED);
  }

  static tiltBike(racer: Racer, direction: 'forward' | 'backward') {
    // Mid-air bike control (Excitebike style)
    if (racer.onRamp || racer.yOffset > 0) {
      const angleChange = PhysicsEngine.BIKE_ANGLE_SPEED * 0.1;
      if (direction === 'forward') {
        racer.bikeAngle = Math.min(PhysicsEngine.MAX_BIKE_ANGLE, racer.bikeAngle + angleChange);
      } else {
        racer.bikeAngle = Math.max(-PhysicsEngine.MAX_BIKE_ANGLE, racer.bikeAngle - angleChange);
      }
    }
  }

  private static getCurrentObstacle(racer: Racer, obstacles: Obstacle[]): Obstacle | null {
    // Only check for ramp-type obstacles (not whoops, water, finish)
    const rampObstacles = obstacles.filter(obs => 
      obs.type === 'start-hill' || obs.type === 'step-up' || 
      obs.type === 'triple' || obs.type === 'double'
    );
    
    for (const obstacle of rampObstacles) {
      // CRITICAL: Use racer's actual world position for detection
      // The +50 visual offset is ONLY for sprite rendering, not physics
      // racer.position is the world position, obstacle.x is also world position
      
      // Use racer's FRONT EDGE (position + sprite width) to detect when front wheel hits ramp
      // This ensures racers only jump when their front wheel actually contacts the ramp
      const racerSpriteWidth = 30; // Approximate sprite width in world units
      const racerFrontEdge = racer.position + racerSpriteWidth;
      
      // STRICT detection: Only detect when racer's FRONT EDGE visually reaches the ramp
      // Large buffer to ensure racer is actually visually at the ramp (not before)
      const buffer = 50; // Increased buffer to prevent premature detection
      const rampStart = obstacle.x + buffer;
      const rampEnd = obstacle.x + obstacle.width - 10; // Small buffer at end too
      
      // Racer is on ramp when front edge reaches ramp start and hasn't passed ramp end
      const isInObstacleX = racerFrontEdge >= rampStart && racerFrontEdge <= rampEnd;
      
      // Check if racer is in a lane affected by this obstacle
      const isInObstacleLane = obstacle.lanes.includes(racer.lane);
      
      if (isInObstacleX && isInObstacleLane) {
        return obstacle;
      }
    }
    return null;
  }

  private static handleObstacle(racer: Racer, obstacle: Obstacle, dt: number) {
    switch (obstacle.type) {
      case 'start-hill':
      case 'step-up':
      case 'triple':
      case 'double':
        // Ramps automatically route riders - no special handling needed here
        // The routing is handled in updateRacer above
        break;
      
      case 'whoops':
        // Rhythm section - continuous speed reduction while in whoops
        // In Excitebike, whoops don't make you jump, just slow you down
        racer.targetSpeed = Math.max(racer.targetSpeed - 0.1 * dt, PhysicsEngine.MIN_SPEED);
        // No yOffset change - riders stay on track surface
        break;
      
      case 'water':
        // Water zone - significant speed reduction (momentum-based)
        racer.targetSpeed = Math.max(racer.targetSpeed - 0.3 * dt, PhysicsEngine.MIN_SPEED * 0.7);
        break;
    }
  }

  static checkCollision(racer1: Racer, racer2: Racer): boolean {
    const laneDiff = Math.abs(racer1.lane - racer2.lane);
    const positionDiff = Math.abs(racer1.position - racer2.position);
    
    // Collision if in same lane and close position
    return laneDiff === 0 && positionDiff < 20;
  }
}

