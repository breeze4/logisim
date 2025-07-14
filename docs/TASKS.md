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

## Phase 3: Entity System
- [ ] Create entity system to support any number of fixed or moving objects on the plane
- [ ] Add UI controls for configuring plane dimensions (height/width)

## Detailed Requirements

### 3D Camera System
- Camera must be positioned above an X-Y plane
- Camera angle must never go below 15 degrees above the plane
- Camera should maintain focus on a specific point when rotating

### Camera Controls
- **WASD**: Pan camera movement
- **Q/E**: Rotate camera around focal point (wide circle movement)
- **Ctrl/Space**: Zoom in/out respectively

### World Plane
- X-Y axis plane serving as the game world
- Configurable height and width dimensions
- Support for unlimited entities (fixed or moving)

### Entity Support
- System must handle any number of entities
- Entities can be either fixed or moving
- Entities exist on the X-Y plane