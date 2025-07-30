export class Vector2D {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    // Add another vector to this vector
    add(vector: Vector2D): Vector2D {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    // Subtract another vector from this vector
    subtract(vector: Vector2D): Vector2D {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    // Multiply vector by a scalar
    multiply(scalar: number): Vector2D {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    // Divide vector by a scalar
    divide(scalar: number): Vector2D {
        if (scalar === 0) {
            throw new Error("Cannot divide by zero");
        }
        return new Vector2D(this.x / scalar, this.y / scalar);
    }

    // Get the magnitude (length) of the vector
    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Get the squared magnitude (more efficient when you don't need the actual magnitude)
    magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    // Normalize the vector (make it unit length)
    normalize(): Vector2D {
        const mag = this.magnitude();
        if (mag === 0) {
            return new Vector2D(0, 0);
        }
        return this.divide(mag);
    }

    // Get the distance to another vector
    distanceTo(vector: Vector2D): number {
        return this.subtract(vector).magnitude();
    }

    // Get the squared distance to another vector
    distanceToSquared(vector: Vector2D): number {
        return this.subtract(vector).magnitudeSquared();
    }

    // Dot product with another vector
    dot(vector: Vector2D): number {
        return this.x * vector.x + this.y * vector.y;
    }

    // Create a copy of this vector
    clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    // Set the values of this vector
    set(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    // Reset vector to zero
    zero(): void {
        this.x = 0;
        this.y = 0;
    }

    // Check if vector is zero
    isZero(): boolean {
        return this.x === 0 && this.y === 0;
    }

    // Convert to string for debugging
    toString(): string {
        return `Vector2D(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }
}