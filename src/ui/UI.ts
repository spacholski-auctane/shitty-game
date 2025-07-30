export class UI {
    private powerFillElement: HTMLElement | null;
    private powerValueElement: HTMLElement | null;
    private scoreElement: HTMLElement | null;
    private attemptsElement: HTMLElement | null;
    private resetButton: HTMLElement | null;

    constructor() {
        this.powerFillElement = document.getElementById('powerFill');
        this.powerValueElement = document.getElementById('powerValue');
        this.scoreElement = document.getElementById('score');
        this.attemptsElement = document.getElementById('attempts');
        this.resetButton = document.getElementById('resetButton');
    }

    public updatePower(powerPercent: number): void {
        if (this.powerFillElement) {
            this.powerFillElement.style.width = `${powerPercent}%`;
        }
        if (this.powerValueElement) {
            this.powerValueElement.textContent = `${Math.round(powerPercent)}%`;
        }
    }

    public updateScore(score: number): void {
        if (this.scoreElement) {
            this.scoreElement.textContent = score.toString();
        }
    }

    public updateAttempts(attempts: number): void {
        if (this.attemptsElement) {
            this.attemptsElement.textContent = attempts.toString();
        }
    }

    public setResetButtonHandler(handler: () => void): void {
        if (this.resetButton) {
            this.resetButton.addEventListener('click', handler);
        }
    }

    public showMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // Set colors based on type
        switch (type) {
            case 'success':
                messageDiv.style.background = '#48bb78';
                messageDiv.style.color = 'white';
                break;
            case 'error':
                messageDiv.style.background = '#f56565';
                messageDiv.style.color = 'white';
                break;
            case 'info':
            default:
                messageDiv.style.background = '#4299e1';
                messageDiv.style.color = 'white';
                break;
        }

        document.body.appendChild(messageDiv);

        // Remove message after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                }, 300);
            }
        }, 3000);
    }

    public updateCanvasClass(gameState: string): void {
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.className = `game-${gameState}`;
        }
    }

    public static addAnimationStyles(): void {
        if (document.getElementById('ui-animations')) return;

        const style = document.createElement('style');
        style.id = 'ui-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .message {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-left: 4px solid rgba(255, 255, 255, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize animation styles when module loads
UI.addAnimationStyles();