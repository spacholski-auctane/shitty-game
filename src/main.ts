import { Game } from './game/Game';
import './styles.css';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚽 Toilet Toss - Starting game...');
    
    // Get canvas element
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    // Initialize game
    let game: Game;
    
    try {
        game = new Game(canvas);
        console.log('✅ Game initialized successfully');
        
        // Start the game
        game.start();
        console.log('🎮 Game started!');
        
        // Add window resize handler for responsive canvas
        window.addEventListener('resize', () => {
            handleResize(canvas);
        });
        
        // Initial resize
        handleResize(canvas);
        
    } catch (error) {
        console.error('❌ Failed to initialize game:', error);
        showError('Failed to initialize game. Please refresh the page.');
    }
    
    // Handle visibility change (pause/resume when tab is hidden/shown)
    document.addEventListener('visibilitychange', () => {
        if (game) {
            if (document.hidden) {
                console.log('⏸️ Game paused (tab hidden)');
                game.stop();
            } else {
                console.log('▶️ Game resumed (tab visible)');
                game.start();
            }
        }
    });
});

// Handle canvas resizing for responsive design
function handleResize(canvas: HTMLCanvasElement): void {
    const container = canvas.parentElement;
    if (!container) return;
    
    const containerWidth = container.clientWidth - 40; // Account for padding
    const aspectRatio = 800 / 600; // Original canvas aspect ratio
    
    let newWidth = Math.min(containerWidth, 800);
    let newHeight = newWidth / aspectRatio;
    
    // Ensure minimum size for mobile
    if (newWidth < 320) {
        newWidth = 320;
        newHeight = 240;
    }
    
    // Apply CSS scaling while keeping internal resolution
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
    
    console.log(`📱 Canvas resized to: ${newWidth}x${newHeight}`);
}

// Show error message to user
function showError(message: string): void {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #f56565;
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Add some helpful console messages for developers
console.log(`
🚽💩 TOILET TOSS GAME 💩🚽
========================
Controls:
- Hold SPACE or CLICK to charge power
- Move mouse to aim
- Release to fire!

Debug info will appear in development mode.
Have fun! 🎮
`);

// Export for potential external access
declare global {
    interface Window {
        ToiletTossGame?: Game;
    }
}