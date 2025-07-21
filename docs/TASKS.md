# Tasks for Logistics Sim Implementation

Based on the specification in `docs/SPEC.md`, here are the tasks required to implement the base game:

## Phase 1: Foundation Setup
- [x] Set up 3D rendering engine (Three.js or similar) in the frontend
- [x] Create configurable X-Y plane with height/width parameters
- [x] Implement 3D camera with initial positioning above the plane

## Phase 2: Camera Controls
- [x] Add WASD keyboard controls for camera panning
- [x] Implement Q and E keys for camera rotation around a focal point
- [x] Add Ctrl and Space keys for zoom in/out functionality
- [x] Enforce 15-degree minimum angle constraint to prevent camera clipping below plane

## Phase 3A: Static Entities (JSON-Based)
- [x] Design Entity class with position, type, size, color properties
- [x] Create EntityManager class for entity lifecycle management
- [x] Implement entity rendering system using Three.js geometries
- [x] Create JSON configuration file for pre-defined entities
- [x] Load and parse JSON entity data on application start
- [x] Render static entities on the plane from JSON configuration
- [x] Add basic entity types (box, cylinder, sphere) with different colors

## Phase 3B: Interactive Entity Management
- [ ] Add entity management UI panel to the interface
- [ ] Implement click-to-place entity creation using mouse raycasting
- [ ] Add entity type selector (dropdown for box/cylinder/sphere)
- [ ] Create entity selection system with visual feedback (highlighting)
- [ ] Implement entity deletion functionality (select and delete)
- [ ] Add entity property editor (position, color, type modification)
- [ ] Create entity list/manager showing all current entities
- [ ] Add bulk operations (clear all entities, duplicate selected)

## Phase 3C: Moving Entities
- [ ] Add movement state tracking to Entity class (isMoving, targetPosition)
- [ ] Implement three-click movement system (select entity, target, confirm)
- [ ] Add visual movement preview (line from entity to target position)
- [ ] Create smooth entity movement animation between positions
- [ ] Add movement validation (ensure target is within plane boundaries)
- [ ] Implement movement cancellation (right-click or escape to cancel)
- [ ] Add movement queue system (multiple entities can move simultaneously)
- [ ] Create movement feedback UI (show which entity is selected for movement)

## Phase 4: Vite Frontend Migration
- [x] Move HTML structure from `public/index.html` to `logisim-frontend/index.html`.
- [x] Install `three` and `@types/three` in `logisim-frontend`.
- [x] Copy `entities.json` to `logisim-frontend/public`.
- [x] Create `logisim-frontend/src/style.css` and move styles.
- [x] Convert and combine `EntityManager.js` and `main.js` into `logisim-frontend/src/main.ts`.
- [x] Update `logisim-frontend/src/main.ts` to import the new CSS file.
- [x] Remove the old `public` directory.