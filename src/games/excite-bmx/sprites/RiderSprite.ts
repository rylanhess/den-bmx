import type { Rider, Racer } from '../types';

export class RiderSprite {
  private static readonly SPRITE_WIDTH = 16;
  private static readonly SPRITE_HEIGHT = 16;
  private static readonly SCALE = 3;

  static draw(
    ctx: CanvasRenderingContext2D,
    racer: Racer,
    x: number,
    y: number,
    isPlayer: boolean = false
  ) {
    const scale = RiderSprite.SCALE;
    
    // Adjust y for jumps
    const drawY = y - racer.yOffset * scale;

    // Draw rider based on animation frame (pedaling animation)
    const frame = Math.floor(racer.animationFrame / 8) % 2; // 0 or 1 for pedaling

    RiderSprite.drawRider(ctx, racer.rider, x, drawY, scale, frame, racer.isJumping, racer.isKicking);
  }

  private static drawRider(
    ctx: CanvasRenderingContext2D,
    rider: Rider,
    x: number,
    y: number,
    scale: number,
    frame: number,
    isJumping: boolean,
    isKicking: boolean
  ) {
    const { colors } = rider;
    
    // Save context
    ctx.save();
    
    // Set pixel-perfect rendering
    ctx.imageSmoothingEnabled = false;

    // Draw pixel by pixel to match Excitebike style
    // Using a 16x16 grid, centered at x, y
    
    // WHEELS (large, dark gray/black, positioned at bottom)
    // Front wheel (left side)
    this.drawPixel(ctx, x + 1 * scale, y + 12 * scale, scale, '#333333');
    this.drawPixel(ctx, x + 2 * scale, y + 11 * scale, scale, '#333333');
    this.drawPixel(ctx, x + 2 * scale, y + 12 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 2 * scale, y + 13 * scale, scale, '#333333');
    this.drawPixel(ctx, x + 3 * scale, y + 11 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 3 * scale, y + 12 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 3 * scale, y + 13 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 4 * scale, y + 11 * scale, scale, '#333333');
    this.drawPixel(ctx, x + 4 * scale, y + 12 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 4 * scale, y + 13 * scale, scale, '#333333');
    this.drawPixel(ctx, x + 5 * scale, y + 12 * scale, scale, '#333333');
    
    // Rear wheel (right side)
    this.drawPixel(ctx, x + 10 * scale, y + 12 * scale, scale, '#333333');
    this.drawPixel(ctx, x + 11 * scale, y + 11 * scale, scale, '#333333');
    this.drawPixel(ctx, x + 11 * scale, y + 12 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 11 * scale, y + 13 * scale, scale, '#333333');
    this.drawPixel(ctx, x + 12 * scale, y + 11 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 12 * scale, y + 12 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 12 * scale, y + 13 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 13 * scale, y + 11 * scale, scale, '#333333');
    this.drawPixel(ctx, x + 13 * scale, y + 12 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 13 * scale, y + 13 * scale, scale, '#333333');
    this.drawPixel(ctx, x + 14 * scale, y + 12 * scale, scale, '#333333');

    // BIKE FRAME (black, simple lines)
    // Top tube
    this.drawPixel(ctx, x + 5 * scale, y + 9 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 6 * scale, y + 9 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 7 * scale, y + 9 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 8 * scale, y + 9 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 9 * scale, y + 9 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 10 * scale, y + 9 * scale, scale, '#000000');
    
    // Down tube
    this.drawPixel(ctx, x + 5 * scale, y + 10 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 6 * scale, y + 10 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 7 * scale, y + 10 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 8 * scale, y + 10 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 9 * scale, y + 10 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 10 * scale, y + 10 * scale, scale, '#000000');
    
    // Seat tube
    this.drawPixel(ctx, x + 10 * scale, y + 8 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 10 * scale, y + 9 * scale, scale, '#000000');
    
    // Head tube
    this.drawPixel(ctx, x + 5 * scale, y + 8 * scale, scale, '#000000');
    this.drawPixel(ctx, x + 5 * scale, y + 9 * scale, scale, '#000000');

    // HELMET (white for most, yellow for Mile High to match Excitebike style)
    const helmetColor = rider.id === 'mile-high' ? '#FFD700' : '#FFFFFF';
    this.drawPixel(ctx, x + 5 * scale, y + 1 * scale, scale, helmetColor);
    this.drawPixel(ctx, x + 6 * scale, y + 1 * scale, scale, helmetColor);
    this.drawPixel(ctx, x + 7 * scale, y + 1 * scale, scale, helmetColor);
    this.drawPixel(ctx, x + 8 * scale, y + 1 * scale, scale, helmetColor);
    this.drawPixel(ctx, x + 9 * scale, y + 1 * scale, scale, helmetColor);
    this.drawPixel(ctx, x + 10 * scale, y + 1 * scale, scale, helmetColor);
    
    this.drawPixel(ctx, x + 5 * scale, y + 2 * scale, scale, helmetColor);
    this.drawPixel(ctx, x + 6 * scale, y + 2 * scale, scale, helmetColor);
    this.drawPixel(ctx, x + 7 * scale, y + 2 * scale, scale, helmetColor);
    this.drawPixel(ctx, x + 8 * scale, y + 2 * scale, scale, helmetColor);
    this.drawPixel(ctx, x + 9 * scale, y + 2 * scale, scale, helmetColor);
    this.drawPixel(ctx, x + 10 * scale, y + 2 * scale, scale, helmetColor);
    
    this.drawPixel(ctx, x + 5 * scale, y + 3 * scale, scale, helmetColor);
    this.drawPixel(ctx, x + 6 * scale, y + 3 * scale, scale, '#000000'); // visor
    this.drawPixel(ctx, x + 7 * scale, y + 3 * scale, scale, '#000000'); // visor
    this.drawPixel(ctx, x + 8 * scale, y + 3 * scale, scale, '#000000'); // visor
    this.drawPixel(ctx, x + 9 * scale, y + 3 * scale, scale, '#000000'); // visor
    this.drawPixel(ctx, x + 10 * scale, y + 3 * scale, scale, helmetColor);

    // TORSO/JERSEY (primary color - blue for Mile High)
    this.drawPixel(ctx, x + 5 * scale, y + 4 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 6 * scale, y + 4 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 7 * scale, y + 4 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 8 * scale, y + 4 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 9 * scale, y + 4 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 10 * scale, y + 4 * scale, scale, colors.primary);
    
    this.drawPixel(ctx, x + 5 * scale, y + 5 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 6 * scale, y + 5 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 7 * scale, y + 5 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 8 * scale, y + 5 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 9 * scale, y + 5 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 10 * scale, y + 5 * scale, scale, colors.primary);
    
    this.drawPixel(ctx, x + 5 * scale, y + 6 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 6 * scale, y + 6 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 7 * scale, y + 6 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 8 * scale, y + 6 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 9 * scale, y + 6 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 10 * scale, y + 6 * scale, scale, colors.primary);
    
    this.drawPixel(ctx, x + 5 * scale, y + 7 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 6 * scale, y + 7 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 7 * scale, y + 7 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 8 * scale, y + 7 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 9 * scale, y + 7 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 10 * scale, y + 7 * scale, scale, colors.primary);

    // Draw jersey design on torso
    this.drawJerseyDesign(ctx, rider, x + 5 * scale, y + 4 * scale, scale);

    // ARMS (primary color, on handlebars)
    this.drawPixel(ctx, x + 3 * scale, y + 5 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 4 * scale, y + 5 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 3 * scale, y + 6 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 4 * scale, y + 6 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 3 * scale, y + 7 * scale, scale, colors.primary);
    
    this.drawPixel(ctx, x + 11 * scale, y + 5 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 12 * scale, y + 5 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 11 * scale, y + 6 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 12 * scale, y + 6 * scale, scale, colors.primary);
    this.drawPixel(ctx, x + 12 * scale, y + 7 * scale, scale, colors.primary);

    // LEGS (secondary color, pedaling animation)
    if (!isJumping) {
      if (frame === 0) {
        // Frame 0: legs in normal position
        this.drawPixel(ctx, x + 6 * scale, y + 8 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 7 * scale, y + 8 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 8 * scale, y + 8 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 9 * scale, y + 8 * scale, scale, colors.secondary);
        
        this.drawPixel(ctx, x + 6 * scale, y + 9 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 7 * scale, y + 9 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 8 * scale, y + 9 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 9 * scale, y + 9 * scale, scale, colors.secondary);
        
        this.drawPixel(ctx, x + 7 * scale, y + 10 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 8 * scale, y + 10 * scale, scale, colors.secondary);
        
        this.drawPixel(ctx, x + 7 * scale, y + 11 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 8 * scale, y + 11 * scale, scale, colors.secondary);
      } else {
        // Frame 1: pedaling - one leg up, one down
        this.drawPixel(ctx, x + 6 * scale, y + 8 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 7 * scale, y + 8 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 8 * scale, y + 7 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 9 * scale, y + 7 * scale, scale, colors.secondary);
        
        this.drawPixel(ctx, x + 6 * scale, y + 9 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 7 * scale, y + 9 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 8 * scale, y + 8 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 9 * scale, y + 8 * scale, scale, colors.secondary);
        
        this.drawPixel(ctx, x + 7 * scale, y + 10 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 8 * scale, y + 9 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 9 * scale, y + 9 * scale, scale, colors.secondary);
        
        this.drawPixel(ctx, x + 7 * scale, y + 11 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 8 * scale, y + 10 * scale, scale, colors.secondary);
        this.drawPixel(ctx, x + 9 * scale, y + 10 * scale, scale, colors.secondary);
      }
    } else {
      // Jumping: legs pulled up
      this.drawPixel(ctx, x + 6 * scale, y + 6 * scale, scale, colors.secondary);
      this.drawPixel(ctx, x + 7 * scale, y + 6 * scale, scale, colors.secondary);
      this.drawPixel(ctx, x + 8 * scale, y + 6 * scale, scale, colors.secondary);
      this.drawPixel(ctx, x + 9 * scale, y + 6 * scale, scale, colors.secondary);
      
      this.drawPixel(ctx, x + 7 * scale, y + 7 * scale, scale, colors.secondary);
      this.drawPixel(ctx, x + 8 * scale, y + 7 * scale, scale, colors.secondary);
    }
    
    // Kicking animation
    if (isKicking) {
      this.drawPixel(ctx, x + 10 * scale, y + 8 * scale, scale, colors.secondary);
      this.drawPixel(ctx, x + 11 * scale, y + 8 * scale, scale, colors.secondary);
      this.drawPixel(ctx, x + 10 * scale, y + 9 * scale, scale, colors.secondary);
    }

    ctx.restore();
  }

  private static drawJerseyDesign(
    ctx: CanvasRenderingContext2D,
    rider: Rider,
    x: number,
    y: number,
    scale: number
  ) {
    const { colors, jerseyDesign } = rider;
    // Use yellow for 5280, white for others
    const designColor = jerseyDesign === '5280' ? '#FFD700' : colors.secondary;

    switch (jerseyDesign) {
      case '5280':
        // Draw "5280" in yellow on blue jersey (pixel by pixel, more visible)
        // Position centered on jersey (y + 1 to y + 3, x + 1 to x + 5)
        // 5 - left side
        this.drawPixel(ctx, x + 1 * scale, y + 1 * scale, scale, designColor);
        this.drawPixel(ctx, x + 1 * scale, y + 2 * scale, scale, designColor);
        this.drawPixel(ctx, x + 1 * scale, y + 3 * scale, scale, designColor);
        this.drawPixel(ctx, x + 2 * scale, y + 1 * scale, scale, designColor);
        this.drawPixel(ctx, x + 2 * scale, y + 2 * scale, scale, designColor);
        this.drawPixel(ctx, x + 2 * scale, y + 3 * scale, scale, designColor);
        // 2 - second digit
        this.drawPixel(ctx, x + 3 * scale, y + 1 * scale, scale, designColor);
        this.drawPixel(ctx, x + 3 * scale, y + 2 * scale, scale, designColor);
        this.drawPixel(ctx, x + 3 * scale, y + 3 * scale, scale, designColor);
        // 8 - third digit
        this.drawPixel(ctx, x + 4 * scale, y + 1 * scale, scale, designColor);
        this.drawPixel(ctx, x + 4 * scale, y + 2 * scale, scale, designColor);
        this.drawPixel(ctx, x + 4 * scale, y + 3 * scale, scale, designColor);
        // 0 - fourth digit
        this.drawPixel(ctx, x + 5 * scale, y + 1 * scale, scale, designColor);
        this.drawPixel(ctx, x + 5 * scale, y + 2 * scale, scale, designColor);
        this.drawPixel(ctx, x + 5 * scale, y + 3 * scale, scale, designColor);
        break;
      
      case 'oil-derrick':
        // Draw oil derrick in white on red jersey
        this.drawPixel(ctx, x + 2 * scale, y + 2 * scale, scale, designColor);
        this.drawPixel(ctx, x + 3 * scale, y + 2 * scale, scale, designColor);
        this.drawPixel(ctx, x + 2 * scale, y + 1 * scale, scale, designColor);
        this.drawPixel(ctx, x + 3 * scale, y + 1 * scale, scale, designColor);
        this.drawPixel(ctx, x + 2.5 * scale, y + 0 * scale, scale, designColor);
        break;
      
      case 'mountain':
        // Draw mountain in white on blue jersey
        this.drawPixel(ctx, x + 1 * scale, y + 3 * scale, scale, designColor);
        this.drawPixel(ctx, x + 2 * scale, y + 2 * scale, scale, designColor);
        this.drawPixel(ctx, x + 3 * scale, y + 2 * scale, scale, designColor);
        this.drawPixel(ctx, x + 3 * scale, y + 1 * scale, scale, designColor);
        break;
      
      case 'silos':
        // Draw two silos in white on purple jersey
        this.drawPixel(ctx, x + 1 * scale, y + 1 * scale, scale, designColor);
        this.drawPixel(ctx, x + 1 * scale, y + 2 * scale, scale, designColor);
        this.drawPixel(ctx, x + 1 * scale, y + 3 * scale, scale, designColor);
        this.drawPixel(ctx, x + 4 * scale, y + 1 * scale, scale, designColor);
        this.drawPixel(ctx, x + 4 * scale, y + 2 * scale, scale, designColor);
        this.drawPixel(ctx, x + 4 * scale, y + 3 * scale, scale, designColor);
        break;
    }
  }

  private static drawPixel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), scale, scale);
  }
}
