# Project Tasks

This document tracks the implementation tasks for the Logistics Simulation project, based on the requirements in `SPEC.md`.

## Completed Milestones

### Foundation Setup
- [x] Set up 3D rendering engine (Three.js) in the frontend.
- [x] Create a configurable X-Y plane with height/width parameters.
- [x] Implement a 3D camera with initial positioning above the plane.

### Camera Controls
- [x] Add WASD keyboard controls for camera panning.
- [x] Implement Q and E keys for camera rotation around a focal point.
- [x] Add Ctrl and Space keys for zoom in/out functionality.
- [x] Enforce the 15-degree minimum angle constraint to prevent camera clipping.

### Static Entity Implementation
- [x] Design an `Entity` class with position, type, size, and color properties.
- [x] Create an `EntityManager` class for entity lifecycle management.
- [x] Implement an entity rendering system using Three.js geometries.
- [x] Create a JSON configuration file for pre-defined entities.
- [x] Load and parse JSON entity data on application start.
- [x] Render static entities on the plane from the JSON configuration.
- [x] Add basic entity types (box, cylinder, sphere) with different colors.

### Interactive Entity Management
- [x] **UI:** Add HTML for the entity management panel to `index.html`.
- [x] **UI:** Create a `UIManager.ts` class to manage UI interactions.
- [x] **Interaction:** Create an `InteractionManager.ts` to handle mouse input and raycasting.
- [x] **Interaction:** Implement entity selection with visual highlighting (e.g., `OutlinePass`).
- [x] **Entity Management:** Implement click-to-place functionality to add new entities.
- [x] **Entity Management:** Implement entity deletion via the 'Delete' key.
- [x] **Entity Management:** Add a "Clear All" button and functionality.
- [x] **UI:** Populate an entity list in the UI panel.
- [x] **Interaction:** Implement a property editor to modify the selected entity's properties (e.g., color).

### Vite Frontend Migration
- [x] Move HTML structure from `public/index.html` to `logisim-frontend/index.html`.
- [x] Install `three` and `@types/three` in `logisim-frontend`.
- [x] Copy `entities.json` to `logisim-frontend/public`.
- [x] Create `logisim-frontend/src/style.css` and move styles.
- [x] Convert and combine `EntityManager.js` and `main.js` into `logisim-frontend/src/main.ts`.
- [x] Update `logisim-frontend/src/main.ts` to import the new CSS file.
- [x] Remove the old `public` directory.

### Core Mechanics
- [x] **Task 1: Update Entity Class for Movement**
  - Modify the `Entity` class to include `velocity` (THREE.Vector3) and `acceleration` (THREE.Vector3) properties.
- [x] **Task 2: Implement Time-based Movement**
  - Add an `update(deltaTime: number)` method to the `Entity` class to handle physics-based position updates.
- [x] **Task 3: Integrate Entity Updates into Main Loop**
  - Call the `update(deltaTime)` method for all moving entities in the main animation loop.
- [x] **Task 4: Implement Orientation Alignment**
  - Orient the entity's mesh to face its direction of movement within the `update` method.
- [x] **Task 5: Basic Entity Spawning with Movement**
  - Add a mechanism to spawn entities with initial velocity and acceleration.

### Interactive Movement Control
- [x] **Task 6: Implement Three-Click Movement System**
  - Develop the state machine for selecting an entity, a target, and confirming movement.
- [x] **Task 7: Add Movement State Tracking**
  - Add properties like `isMoving` and `targetPosition` to the `Entity` class.
- [x] **Task 8: Create Visual Movement Preview**
  - Render a line or marker from the selected entity to the potential target position.
- [x] **Task 9: Implement Smooth Movement Animation**
  - Use interpolation to animate the entity smoothly from its current position to the target.
- [x] **Task 10: Add Movement Validation**
  - Ensure the selected target position is within the valid boundaries of the world plane.
- [x] **Task 11: Implement Movement Cancellation**
  - Allow the user to cancel a movement command with a right-click or the `Escape` key.

### UI and Advanced Features
- [x] **Task 12: Create Movement Feedback UI**
  - Provide clear UI feedback indicating which entity is selected for movement.
- [x] **Task 13: Refactor InteractionManager for Moving Entities**
  - Ensure the `InteractionManager` correctly handles interactions with entities that are in motion.
- [x] **Task 14: Implement Movement Queue System**
  - Allow multiple entities to have movement commands queued and executed simultaneously.

## Upcoming Tasks: Collision Mechanics

- [ ] **Task 1: Update Entity Class**
  - Add a `mass` property (defaulting to 1).
  - Add a `boundingVolume` property (to hold a `THREE.Box3` or `THREE.Sphere`).
- [ ] **Task 2: Generate Bounding Volumes**
  - In `EntityManager`, when creating an entity, compute its bounding volume and assign it.
  - Ensure the bounding volume is updated whenever an entity moves.
- [ ] **Task 3: Create CollisionManager Class**
  - Create a new `CollisionManager.ts` file.
  - The class will hold the logic for collision detection and response.
- [ ] **Task 4: Implement Collision Detection**
  - In `CollisionManager`, create a method to check for intersections between all entity bounding volumes.
  - It should handle Box-Box, Sphere-Sphere, and Box-Sphere collision checks.
- [ ] **Task 5: Implement Collision Response**
  - In `CollisionManager`, create a method that takes two colliding entities and calculates their new velocities based on an elastic collision formula.
- [ ] **Task 6: Refactor the Main Loop (`main.ts`)**
  - Instantiate the `CollisionManager`.
  - Change the `animate` loop order:
    1. Calculate intended velocity for each entity.
    2. Run collision detection and response, which may alter velocities.
    3. Update entity positions based on the final, adjusted velocities.
- [ ] **Task 7: Refactor Entity `update` Method**
  - Separate the concerns of "intent" (moving towards a target) and "execution" (updating position based on final velocity).
  - The collision response will modify the final velocity, but the entity's intent to reach its target should remain. 