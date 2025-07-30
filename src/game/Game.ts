import { Vector2D } from '../utils/Vector2D';
import { Physics } from './Physics';
import { Projectile } from './Projectile';
import { Target } from './Target';

export enum GameState {
    READY = 'ready',
    AIMING = 'aiming',
    FLYING = 'flying',
    HIT = 'hit',
    MISS = 'miss'
}

export interface GameConfig {
    canvasWidth: number;
    canvasHeight: number;
    gravity: number;
    maxPower: number;
    targetPosition: Vector2D;
    startPosition: Vector2D;
}

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private config: GameConfig;
    
    // Game objects
    private projectile: Projectile;
    private target: Target;
    
    // Game state
    public state: GameState;
    public score: number;
    public attempts: number;
    
    // Input handling
    private isCharging: boolean;
    private chargePower: number;
    private currentAngle: number;
    private keys: Set<string>;
    
    // Timing
    private lastTime: number;
    private animationId: number | null;
    
    // UI elements
    private powerFillElement: HTMLElement | null;
    private powerValueElement: HTMLElement | null;
    private scoreElement: HTMLElement | null;
    private attemptsElement: HTMLElement | null;
    
    // Background image
    private backgroundImage!: HTMLImageElement;
    private imageLoaded: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context from canvas');
        }
        this.ctx = context;
        
        // Initialize configuration
        this.config = {
            canvasWidth: 800,
            canvasHeight: 600,
            gravity: Physics.GRAVITY,
            maxPower: 100,
            targetPosition: new Vector2D(400, 335), // Przesunięte o kolejne 5px w dół
            startPosition: new Vector2D(400, 550)
        };
        
        // Initialize game objects
        this.projectile = new Projectile(
            this.config.startPosition.x,
            this.config.startPosition.y,
            20
        );
        this.target = new Target(
            this.config.targetPosition.x,
            this.config.targetPosition.y,
            40
        );
        
        // Initialize game state
        this.state = GameState.READY;
        this.score = 0;
        this.attempts = 0;
        
        // Initialize input
        this.isCharging = false;
        this.chargePower = 0;
        this.currentAngle = 45; // Default angle
        this.keys = new Set();
        
        // Initialize timing
        this.lastTime = 0;
        this.animationId = null;
        
        // Get UI elements
        this.powerFillElement = document.getElementById('powerFill');
        this.powerValueElement = document.getElementById('powerValue');
        this.scoreElement = document.getElementById('score');
        this.attemptsElement = document.getElementById('attempts');
        
        this.setupCanvas();
        this.setupEventListeners();
        this.loadBackgroundImage();
        this.updateUI();
    }

    private setupCanvas(): void {
        this.canvas.width = this.config.canvasWidth;
        this.canvas.height = this.config.canvasHeight;
        
        // Setup canvas styling
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    }

    private setupEventListeners(): void {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Reset button
        const resetButton = document.getElementById('resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetGame());
        }
        
        // Prevent context menu on canvas
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    private handleKeyDown(e: KeyboardEvent): void {
        this.keys.add(e.code);
        
        if (e.code === 'Space') {
            e.preventDefault();
            this.startCharging();
        }
    }

    private handleKeyUp(e: KeyboardEvent): void {
        this.keys.delete(e.code);
        
        if (e.code === 'Space') {
            e.preventDefault();
            this.stopCharging();
        }
    }

    private handleMouseDown(_e: MouseEvent): void {
        this.startCharging();
    }

    private handleMouseUp(_e: MouseEvent): void {
        this.stopCharging();
    }

    private handleMouseMove(e: MouseEvent): void {
        // Calculate angle based on mouse position
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const mousePos = new Vector2D(mouseX, mouseY);
        this.currentAngle = Physics.calculateAngleToTarget(this.config.startPosition, mousePos);
    }

    private handleTouchStart(e: TouchEvent): void {
        e.preventDefault();
        this.startCharging();
    }

    private handleTouchEnd(e: TouchEvent): void {
        e.preventDefault();
        this.stopCharging();
    }

    private startCharging(): void {
        if (this.state === GameState.READY) {
            this.state = GameState.AIMING;
            this.isCharging = true;
            this.chargePower = 0;
        }
    }

    private stopCharging(): void {
        if (this.state === GameState.AIMING && this.isCharging) {
            this.launchProjectile();
            this.isCharging = false;
        }
    }

    private launchProjectile(): void {
        this.projectile.launch(this.chargePower, this.currentAngle);
        this.state = GameState.FLYING;
        this.attempts++;
        this.chargePower = 0;
        this.updateUI();
    }

    public start(): void {
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    public stop(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    private gameLoop = (currentTime: number): void => {
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        this.animationId = requestAnimationFrame(this.gameLoop);
    };

    private update(deltaTime: number): void {
        // Update charging power
        if (this.isCharging && this.state === GameState.AIMING) {
            this.chargePower = Math.min(100, this.chargePower + Physics.CHARGE_RATE * deltaTime);
            this.updateUI();
        }
        
        // Update game objects
        this.projectile.update(deltaTime, this.config.canvasWidth, this.config.canvasHeight);
        this.target.update(deltaTime);
        
        // Check game state transitions
        this.updateGameState();
    }

    private updateGameState(): void {
        if (this.state === GameState.FLYING) {
            // Check collision with target
            if (this.target.checkCollision(this.projectile.position, this.projectile.radius)) {
                this.onHit();
                return;
            }
            
            // Check if projectile stopped moving or went out of bounds
            if (!this.projectile.isActive || !this.projectile.isMoving()) {
                this.onMiss();
                return;
            }
        }
        
        // Auto-transition from hit/miss states
        if (this.state === GameState.HIT || this.state === GameState.MISS) {
            setTimeout(() => {
                this.resetForNextShot();
            }, 1500);
        }
    }

    private onHit(): void {
        this.state = GameState.HIT;
        this.score++;
        this.target.onHit();
        this.updateUI();
        this.updateCanvasClass();
    }

    private onMiss(): void {
        this.state = GameState.MISS;
        this.updateCanvasClass();
    }

    private resetForNextShot(): void {
        this.projectile.reset(this.config.startPosition.x, this.config.startPosition.y);
        this.target.reset();
        this.state = GameState.READY;
        this.chargePower = 0;
        this.updateCanvasClass();
        this.updateUI();
    }

    private updateCanvasClass(): void {
        this.canvas.className = `game-${this.state}`;
    }

    private updateUI(): void {
        // Update power meter
        if (this.powerFillElement) {
            this.powerFillElement.style.width = `${this.chargePower}%`;
        }
        if (this.powerValueElement) {
            this.powerValueElement.textContent = `${Math.round(this.chargePower)}%`;
        }
        
        // Update score and attempts
        if (this.scoreElement) {
            this.scoreElement.textContent = this.score.toString();
        }
        if (this.attemptsElement) {
            this.attemptsElement.textContent = this.attempts.toString();
        }
    }

    private render(): void {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);
        
        // Draw background
        this.renderBackground();
        
        // Draw game objects
        this.target.render(this.ctx);
        this.projectile.render(this.ctx);
        
        // Draw aiming line
        if (this.state === GameState.AIMING) {
            this.renderAimingLine();
        }
        
        // Draw game state feedback
        this.renderGameState();
    }

    private loadBackgroundImage(): void {
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            this.imageLoaded = true;
        };
        this.backgroundImage.src = '/assets/kibelek.jpg';
    }

    private renderBackground(): void {
        if (this.imageLoaded) {
            // Rysuj obraz jako tło
            this.ctx.drawImage(
                this.backgroundImage,
                0, 0,
                this.config.canvasWidth,
                this.config.canvasHeight
            );
        } else {
            // Fallback gradient jeśli obraz się nie załadował
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.config.canvasHeight);
            gradient.addColorStop(0, '#87CEEB'); // Sky blue
            gradient.addColorStop(1, '#98FB98'); // Pale green
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);
        }
    }

    private renderAimingLine(): void {
        const startPos = this.config.startPosition;
        const lineLength = 100;
        const angleRad = (this.currentAngle * Math.PI) / 180;
        const endX = startPos.x + Math.cos(angleRad) * lineLength;
        const endY = startPos.y - Math.sin(angleRad) * lineLength;
        
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(startPos.x, startPos.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    private renderGameState(): void {
        let message = '';
        let color = '#333';
        
        switch (this.state) {
            case GameState.READY:
                message = 'Hold SPACE or CLICK to aim';
                break;
            case GameState.AIMING:
                message = `Power: ${Math.round(this.chargePower)}% - Release to fire!`;
                color = '#f6e05e';
                break;
            case GameState.FLYING:
                message = 'Flying...';
                color = '#4299e1';
                break;
            case GameState.HIT:
                message = '🎉 HIT! Great shot!';
                color = '#48bb78';
                break;
            case GameState.MISS:
                message = '💩 MISS! Try again!';
                color = '#f56565';
                break;
        }
        
        if (message) {
            this.ctx.save();
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 4;
            this.ctx.strokeText(message, this.config.canvasWidth / 2, 50);
            this.ctx.fillText(message, this.config.canvasWidth / 2, 50);
            this.ctx.restore();
        }
    }

    public resetGame(): void {
        this.stop();
        this.score = 0;
        this.attempts = 0;
        this.resetForNextShot();
        this.updateUI();
        this.start();
    }
}