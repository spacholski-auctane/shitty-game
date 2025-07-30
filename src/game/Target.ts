import { Vector2D } from '../utils/Vector2D';
import { Physics } from './Physics';

export class Target {
    public position: Vector2D;
    public radiusX: number; // Szerokość elipsy
    public radiusY: number; // Wysokość elipsy
    private animationTime: number;
    private isHit: boolean;
    private hitAnimationDuration: number;

    constructor(x: number, y: number, radius: number = 40) {
        this.position = new Vector2D(x, y);
        this.radiusX = radius + 30; // Dodatkowe 30 pikseli szerokości (20 + 10)
        this.radiusY = (radius * 0.6) - 15; // Spłaszczona elipsa o dodatkowe 15px
        this.animationTime = 0;
        this.isHit = false;
        this.hitAnimationDuration = 1000; // 1 second
    }

    // Update target animation
    public update(deltaTime: number): void {
        this.animationTime += deltaTime;
        
        // Reset hit animation after duration
        if (this.isHit && this.animationTime > this.hitAnimationDuration) {
            this.isHit = false;
            this.animationTime = 0;
        }
    }

    // Render the target (toilet emoji)
    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        
        // Calculate scale for subtle breathing animation
        const breatheScale = 1 + Math.sin(this.animationTime * 0.003) * 0.05;
        
        // Hit animation - scale up and add glow
        let scale = breatheScale;
        if (this.isHit) {
            const hitProgress = this.animationTime / this.hitAnimationDuration;
            const hitScale = 1 + Math.sin(hitProgress * Math.PI) * 0.3;
            scale = breatheScale * hitScale;
            
            // Add glow effect
            ctx.shadowColor = '#48bb78';
            ctx.shadowBlur = 20;
        }
        
        // Apply scaling
        ctx.translate(this.position.x, this.position.y);
        ctx.scale(scale, scale);
        
        // Target area - invisible circle for collision detection only
        // No visual rendering needed as background image shows the toilet
        
        ctx.restore();

        // Debug rendering disabled - no visual target shown
    }

    // Debug rendering disabled - target is completely invisible
    private renderDebugEllipse(ctx: CanvasRenderingContext2D): void {
        // No visual rendering - target area is invisible
    }

    // Check collision with a projectile (ellipse collision)
    public checkCollision(projectilePosition: Vector2D, projectileRadius: number): boolean {
        // Ellipse collision detection
        const dx = projectilePosition.x - this.position.x;
        const dy = projectilePosition.y - this.position.y;
        
        // Normalize to unit circle
        const normalizedX = dx / this.radiusX;
        const normalizedY = dy / this.radiusY;
        
        // Check if point is inside ellipse (with projectile radius buffer)
        const distance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
        const buffer = projectileRadius / Math.min(this.radiusX, this.radiusY);
        
        return distance <= (1 + buffer);
    }

    // Trigger hit animation
    public onHit(): void {
        this.isHit = true;
        this.animationTime = 0;
    }

    // Check if currently showing hit animation
    public isShowingHitAnimation(): boolean {
        return this.isHit;
    }

    // Set new position
    public setPosition(x: number, y: number): void {
        this.position.set(x, y);
    }

    // Get bounding box for positioning
    public getBounds(): { left: number; right: number; top: number; bottom: number } {
        return {
            left: this.position.x - this.radiusX,
            right: this.position.x + this.radiusX,
            top: this.position.y - this.radiusY,
            bottom: this.position.y + this.radiusY
        };
    }

    // Reset target state
    public reset(): void {
        this.isHit = false;
        this.animationTime = 0;
    }
}