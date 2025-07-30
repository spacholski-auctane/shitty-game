import { Vector2D } from '../utils/Vector2D';
import { Physics } from './Physics';

export class Projectile {
    public position: Vector2D;
    public velocity: Vector2D;
    public radius: number;
    public isActive: boolean;
    public trail: Vector2D[];
    private maxTrailLength: number;

    constructor(x: number = 0, y: number = 0, radius: number = 20) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.radius = radius;
        this.isActive = false;
        this.trail = [];
        this.maxTrailLength = 10;
    }

    // Launch the projectile with given power and angle
    public launch(powerPercent: number, angleDegrees: number): void {
        this.velocity = Physics.powerToVelocity(powerPercent, angleDegrees);
        this.isActive = true;
        this.trail = [this.position.clone()];
    }

    // Update projectile physics
    public update(deltaTime: number, canvasWidth: number, canvasHeight: number): void {
        if (!this.isActive) return;

        // Store current position for trail
        this.trail.push(this.position.clone());
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Update physics
        const physics = Physics.updateProjectile(this.position, this.velocity, deltaTime);
        this.position = physics.position;
        this.velocity = physics.velocity;

        // Check if projectile is out of bounds
        if (this.position.y > canvasHeight + 50 || 
            this.position.x < -50 || 
            this.position.x > canvasWidth + 50) {
            this.isActive = false;
        }
    }

    // Render the projectile
    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.isActive) return;

        // Draw trail
        this.renderTrail(ctx);

        // Draw projectile (poop emoji)
        ctx.save();
        ctx.font = `${this.radius * 2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText('💩', this.position.x, this.position.y);
        ctx.restore();

        // Debug: Draw collision circle (optional)
        const showDebug = window.location.hostname === 'localhost';
        if (showDebug) {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    // Render projectile trail
    private renderTrail(ctx: CanvasRenderingContext2D): void {
        if (this.trail.length < 2) return;

        ctx.save();
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.6)'; // Brown trail
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const alpha = (i + 1) / this.trail.length; // Fade trail
            
            ctx.globalAlpha = alpha * 0.6;
            
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.stroke();
        ctx.restore();
    }

    // Reset projectile to starting position
    public reset(startX: number, startY: number): void {
        this.position.set(startX, startY);
        this.velocity.zero();
        this.isActive = false;
        this.trail = [];
    }

    // Check collision with another circular object
    public checkCollision(otherPosition: Vector2D, otherRadius: number): boolean {
        if (!this.isActive) return false;
        return Physics.checkCircleCollision(this.position, this.radius, otherPosition, otherRadius);
    }

    // Get current speed
    public getSpeed(): number {
        return this.velocity.magnitude();
    }

    // Check if projectile is moving (has significant velocity)
    public isMoving(): boolean {
        return this.isActive && this.velocity.magnitude() > 10;
    }
}