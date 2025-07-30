import { Vector2D } from '../utils/Vector2D';

export class Physics {
    public static readonly GRAVITY = 500; // pixels/second²
    public static readonly MAX_LAUNCH_SPEED = 800; // pixels/second
    public static readonly CHARGE_RATE = 100; // power units/second

    // Apply gravity to a velocity vector
    public static applyGravity(velocity: Vector2D, deltaTime: number): Vector2D {
        return new Vector2D(
            velocity.x,
            velocity.y + Physics.GRAVITY * deltaTime
        );
    }

    // Calculate trajectory points for preview (optional feature)
    public static calculateTrajectory(
        startPosition: Vector2D,
        initialVelocity: Vector2D,
        steps: number = 50,
        timeStep: number = 0.1
    ): Vector2D[] {
        const points: Vector2D[] = [];
        let position = startPosition.clone();
        let velocity = initialVelocity.clone();

        for (let i = 0; i < steps; i++) {
            points.push(position.clone());
            
            // Update position
            position = position.add(velocity.multiply(timeStep));
            
            // Update velocity with gravity
            velocity = Physics.applyGravity(velocity, timeStep);
            
            // Stop if projectile goes below screen or too far
            if (position.y > 800 || position.x > 1200 || position.x < -200) {
                break;
            }
        }

        return points;
    }

    // Check if a point is within screen bounds
    public static isInBounds(position: Vector2D, canvasWidth: number, canvasHeight: number): boolean {
        return position.x >= 0 && 
               position.x <= canvasWidth && 
               position.y >= 0 && 
               position.y <= canvasHeight;
    }

    // Check circle-to-circle collision
    public static checkCircleCollision(
        pos1: Vector2D, 
        radius1: number, 
        pos2: Vector2D, 
        radius2: number
    ): boolean {
        const distance = pos1.distanceTo(pos2);
        return distance <= (radius1 + radius2);
    }

    // Convert power percentage and angle to velocity vector
    public static powerToVelocity(powerPercent: number, angleDegrees: number): Vector2D {
        const speed = (powerPercent / 100) * Physics.MAX_LAUNCH_SPEED;
        const angleRadians = (angleDegrees * Math.PI) / 180;
        
        return new Vector2D(
            Math.cos(angleRadians) * speed,
            -Math.sin(angleRadians) * speed // Negative because canvas Y increases downward
        );
    }

    // Calculate angle from start position to target position
    public static calculateAngleToTarget(start: Vector2D, target: Vector2D): number {
        const direction = target.subtract(start);
        let angle = Math.atan2(-direction.y, direction.x) * (180 / Math.PI);
        
        // Ensure angle is between 0 and 180 degrees (upward trajectory only)
        if (angle < 0) angle += 360;
        if (angle > 180) angle = 180 - (angle - 180);
        
        return Math.max(0, Math.min(180, angle));
    }

    // Update projectile position based on physics
    public static updateProjectile(
        position: Vector2D, 
        velocity: Vector2D, 
        deltaTime: number
    ): { position: Vector2D; velocity: Vector2D } {
        // Update position based on current velocity
        const newPosition = position.add(velocity.multiply(deltaTime));
        
        // Update velocity with gravity
        const newVelocity = Physics.applyGravity(velocity, deltaTime);
        
        return {
            position: newPosition,
            velocity: newVelocity
        };
    }
}