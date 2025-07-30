# 💩 Toilet Toss - Implementation Plan

## Project Overview
**Game Name**: Toilet Toss  
**Genre**: Physics-based arcade game  
**Platform**: Web (HTML5 Canvas)  
**Technology Stack**: TypeScript, HTML5 Canvas, CSS/Tailwind  
**Graphics**: Emoji (💩, 🚽) or simple sprites  

## Game Mechanics Summary
- **View**: 2D top-down perspective
- **Objective**: Throw poop from bottom of screen into toilet at top
- **Controls**: Hold space/click to charge power, angle adjusts automatically (0-180°)
- **Physics**: Gravity simulation with parabolic trajectory
- **Scoring**: Hit toilet = point, miss = try again

---

## Phase 1: Project Foundation & Setup
**Duration**: 1-2 hours  
**Goal**: Establish development environment and basic project structure

### Tasks:
1. **Project Structure Setup**
   ```
   toilet-toss/
   ├── src/
   │   ├── main.ts
   │   ├── game/
   │   │   ├── Game.ts
   │   │   ├── Projectile.ts
   │   │   ├── Target.ts
   │   │   └── Physics.ts
   │   ├── ui/
   │   │   └── UI.ts
   │   └── utils/
   │       └── Vector2D.ts
   ├── assets/
   ├── dist/
   ├── index.html
   ├── style.css
   ├── package.json
   ├── tsconfig.json
   └── webpack.config.js
   ```

2. **TypeScript Configuration**
   - Setup `tsconfig.json` with strict mode
   - Configure build pipeline (Webpack/Vite)
   - Setup development server with hot reload

3. **HTML5 Canvas Setup**
   - Create responsive canvas element
   - Setup basic rendering loop (60 FPS)
   - Implement canvas scaling for different screen sizes

4. **Basic CSS Styling**
   - Center canvas on page
   - Add basic UI styling
   - Implement responsive design

### Deliverables:
- ✅ Working development environment
- ✅ Canvas rendering basic shapes
- ✅ TypeScript compilation working
- ✅ Live reload functionality

---

## Phase 2: Core Game Objects & Physics Engine
**Duration**: 3-4 hours  
**Goal**: Implement fundamental game objects and physics simulation

### Tasks:
1. **Vector2D Utility Class**
   ```typescript
   class Vector2D {
     x: number;
     y: number;
     // Methods: add, subtract, multiply, magnitude, normalize
   }
   ```

2. **Projectile Class (Poop 💩)**
   ```typescript
   class Projectile {
     position: Vector2D;
     velocity: Vector2D;
     radius: number;
     isActive: boolean;
     // Methods: update, render, reset
   }
   ```

3. **Target Class (Toilet 🚽)**
   ```typescript
   class Target {
     position: Vector2D;
     radius: number;
     // Methods: render, checkCollision
   }
   ```

4. **Physics Engine**
   ```typescript
   class Physics {
     gravity: number = 9.81;
     // Methods: applyGravity, calculateTrajectory, checkBounds
   }
   ```

### Physics Implementation:
- **Gravity**: Constant downward acceleration
- **Trajectory**: Parabolic motion using kinematic equations
- **Collision**: Circle-to-circle collision detection
- **Bounds**: Screen boundary checking

### Deliverables:
- ✅ Projectile moves with realistic physics
- ✅ Gravity affects projectile motion
- ✅ Collision detection working
- ✅ Objects render as emoji or simple shapes

---

## Phase 3: Input System & Launch Mechanics
**Duration**: 2-3 hours  
**Goal**: Implement player controls and launch system

### Tasks:
1. **Input Handler**
   ```typescript
   class InputHandler {
     isCharging: boolean;
     chargePower: number;
     currentAngle: number;
     // Methods: handleKeyDown, handleKeyUp, handleMouse
   }
   ```

2. **Launch System**
   - Power charging: Hold space/click increases force (0-100%)
   - Angle calculation: Automatic sweep or manual control
   - Launch execution: Convert power + angle to initial velocity
   - Visual feedback: Power meter and trajectory preview

3. **Power Mechanics**
   ```typescript
   // Power increases over time while held
   chargePower = Math.min(100, chargePower + chargeRate * deltaTime);
   
   // Convert to launch velocity
   const launchSpeed = (chargePower / 100) * maxLaunchSpeed;
   const radians = (angle * Math.PI) / 180;
   velocity.x = Math.cos(radians) * launchSpeed;
   velocity.y = Math.sin(radians) * launchSpeed;
   ```

4. **Trajectory Preview (Optional)**
   - Calculate predicted path
   - Render dotted line showing trajectory
   - Update in real-time during aiming

### Deliverables:
- ✅ Space bar/click controls working
- ✅ Power charging system functional
- ✅ Angle adjustment working
- ✅ Projectile launches with correct velocity
- ✅ Visual feedback for power level

---

## Phase 4: Game Logic & State Management
**Duration**: 2-3 hours  
**Goal**: Implement complete game flow and state management

### Tasks:
1. **Game States**
   ```typescript
   enum GameState {
     READY,     // Waiting for player input
     AIMING,    // Player charging power
     FLYING,    // Projectile in motion
     HIT,       // Successful hit
     MISS,      // Projectile missed target
     GAME_OVER  // End of game session
   }
   ```

2. **Game Loop**
   ```typescript
   class Game {
     state: GameState;
     score: number;
     attempts: number;
     // Methods: update, render, handleInput, reset
   }
   ```

3. **Collision System**
   - Precise circle-to-circle collision
   - Hit detection with toilet target
   - Boundary collision (walls, floor)
   - Scoring logic

4. **Game Flow**
   - Start: Player aims and charges power
   - Launch: Projectile follows physics
   - Result: Hit (score++) or Miss (try again)
   - Reset: Return to aiming state

### Deliverables:
- ✅ Complete game loop working
- ✅ State transitions smooth
- ✅ Scoring system functional
- ✅ Hit/miss detection accurate
- ✅ Game reset functionality

---

## Phase 5: UI & Visual Polish
**Duration**: 2-3 hours  
**Goal**: Create polished user interface and visual feedback

### Tasks:
1. **UI Components**
   - Power meter (visual bar or circle)
   - Score display
   - Attempt counter
   - "Try Again" button
   - Game instructions

2. **Visual Effects**
   - Successful hit animation
   - Miss feedback
   - Power charging visual
   - Trajectory trail (optional)

3. **Graphics Implementation**
   ```typescript
   // Emoji rendering
   ctx.font = '48px Arial';
   ctx.fillText('💩', projectile.position.x, projectile.position.y);
   ctx.fillText('🚽', target.position.x, target.position.y);
   ```

4. **Responsive Design**
   - Mobile-friendly controls
   - Touch input support
   - Canvas scaling for different screens

### Deliverables:
- ✅ Clean, intuitive UI
- ✅ Visual feedback for all actions
- ✅ Mobile-responsive design
- ✅ Emoji graphics working
- ✅ Smooth animations

---

## Phase 6: Testing & Optimization
**Duration**: 1-2 hours  
**Goal**: Ensure game quality and performance

### Tasks:
1. **Physics Testing**
   - Verify trajectory calculations
   - Test collision accuracy
   - Validate power scaling
   - Check boundary conditions

2. **Performance Optimization**
   - Optimize rendering loop
   - Minimize garbage collection
   - Efficient collision detection
   - Frame rate consistency

3. **Game Balance**
   - Adjust gravity strength
   - Fine-tune power scaling
   - Optimize target size
   - Balance difficulty curve

4. **Cross-Platform Testing**
   - Desktop browsers
   - Mobile devices
   - Different screen sizes
   - Touch vs mouse input

### Deliverables:
- ✅ Stable 60 FPS performance
- ✅ Accurate physics simulation
- ✅ Balanced gameplay
- ✅ Cross-platform compatibility

---

## Phase 7: Documentation & Deployment
**Duration**: 1 hour  
**Goal**: Prepare for release and future development

### Tasks:
1. **Documentation**
   - README.md with setup instructions
   - Code comments and documentation
   - Game rules and controls
   - Development notes

2. **Build & Deployment**
   - Production build configuration
   - Asset optimization
   - Deployment to GitHub Pages/Netlify
   - Testing deployed version

3. **Future Enhancements Planning**
   - Moving toilet target
   - Multiple difficulty levels
   - Sound effects
   - Particle effects
   - High score system

### Deliverables:
- ✅ Complete documentation
- ✅ Production-ready build
- ✅ Deployed game
- ✅ Enhancement roadmap

---

## Technical Specifications

### Canvas Setup
```typescript
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
canvas.width = 800;
canvas.height = 600;
```

### Physics Constants
```typescript
const GRAVITY = 500; // pixels/second²
const MAX_LAUNCH_SPEED = 800; // pixels/second
const CHARGE_RATE = 100; // power units/second
const TARGET_RADIUS = 40; // pixels
const PROJECTILE_RADIUS = 20; // pixels
```

### Game Configuration
```typescript
interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  gravity: number;
  maxPower: number;
  targetPosition: Vector2D;
  startPosition: Vector2D;
}
```

---

## Success Criteria

### MVP Requirements:
- [x] Projectile launches with physics
- [x] Power charging system works
- [x] Collision detection accurate
- [x] Score tracking functional
- [x] Basic UI complete
- [x] Emoji graphics display

### Quality Metrics:
- **Performance**: Consistent 60 FPS
- **Accuracy**: <5% collision detection error
- **Responsiveness**: <50ms input lag
- **Compatibility**: Works on 95% of modern browsers

---

## Risk Mitigation

### Technical Risks:
1. **Physics Accuracy**: Use proven kinematic equations
2. **Performance Issues**: Profile and optimize early
3. **Cross-browser Compatibility**: Test on multiple browsers
4. **Mobile Touch**: Implement touch-friendly controls

### Timeline Risks:
1. **Scope Creep**: Stick to MVP first
2. **Complex Physics**: Use simple, reliable calculations
3. **Polish Time**: Allocate sufficient time for UI/UX

---

## Post-MVP Enhancements

### Phase 8: Advanced Features (Future)
- **Moving Target**: Toilet moves horizontally
- **Wind Effects**: Environmental factors
- **Multiple Projectiles**: Different poop types
- **Sound System**: Audio feedback
- **Particle Effects**: Visual polish
- **Leaderboard**: High score tracking
- **Mobile App**: PWA or native wrapper

### Estimated Total Development Time: 12-18 hours
### MVP Completion Target: 8-10 hours