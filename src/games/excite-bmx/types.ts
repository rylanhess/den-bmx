export type GameState = 'rider-selection' | 'splash' | 'racing' | 'victory' | 'game-over';

export type Rider = {
  id: string;
  name: string;
  team: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary?: string;
  };
  jerseyDesign: '5280' | 'oil-derrick' | 'mountain' | 'silos';
};

export type Track = {
  id: string;
  name: string;
  terrain: 'mountainous' | 'grassy-plains' | 'suburban' | 'stadium' | 'space';
  trackColor: string;
  turnColor: string;
  description: string;
  order: number;
};

export type Racer = {
  id: string;
  rider: Rider;
  lane: number; // 0-3
  position: number; // x position on track
  speed: number; // current speed
  targetSpeed: number; // desired speed (for acceleration)
  yOffset: number; // for jumps (vertical offset from lane)
  isJumping: boolean;
  jumpVelocity: number;
  animationFrame: number;
  isKicking: boolean;
  kickCooldown: number;
  onRamp: boolean; // true when on a ramp
  rampProgress: number; // 0-1, progress along ramp
  rampType: 'start-hill' | 'step-up' | 'triple' | 'double' | null;
  bikeAngle: number; // bike tilt angle in degrees (-45 to 45) for mid-air control
  landingSpeedPenalty: number; // speed penalty from bad landing (0-1)
  rampApproachSpeed?: number; // speed when entering ramp (for jump calculation)
};

export type Obstacle = {
  type: 'start-hill' | 'step-up' | 'triple' | 'double' | 'whoops' | 'water' | 'finish';
  x: number;
  width: number;
  height: number;
  lanes: number[]; // which lanes this obstacle affects
};

export type RaceState = {
  racers: Racer[];
  obstacles: Obstacle[];
  cameraX: number;
  raceTime: number;
  raceDuration: number; // 45 seconds
  isFinished: boolean;
  winner: Racer | null;
};

