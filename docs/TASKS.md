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

### Phase 3A: Static Entities (JSON-Based)

#### Requirements
- Load entities from JSON configuration file on application start
- Support basic entity types: box, cylinder, sphere
- Entity properties: position (x, y), type, size, color
- Entities positioned on X-Y plane (y=0 world position)
- No user interaction required - purely display pre-configured entities

#### JSON Structure
```json
{
  "entities": [
    {
      "id": "entity1",
      "type": "box",
      "position": {"x": 10, "y": 15},
      "size": {"width": 2, "height": 2, "depth": 2},
      "color": "#ff0000"
    }
  ]
}
```

#### Entity Class Design
- Entity properties: id, type, position, size, color, mesh (Three.js object)
- EntityManager: loadFromJSON(), createEntity(), renderEntity()
- Support for box, cylinder, sphere geometries with materials

### Phase 3B: Interactive Entity Management

#### Requirements
- Click-to-place entity creation using mouse raycasting on plane
- Entity selection with visual feedback (highlighting, outline)
- Entity property editing (position, color, type changes)
- Entity deletion (select and delete key or button)
- UI panel with entity controls and type selector

#### User Interface
- Entity management panel (collapsible sidebar or overlay)
- Entity type selector (dropdown: box, cylinder, sphere)
- Color picker for entity customization
- Entity list showing all current entities with names/IDs
- Delete button and clear all functionality

#### Interaction System
- Mouse raycasting to detect plane intersection for placement
- Entity selection on click with visual highlighting
- Property editor updates selected entity in real-time
- Non-persistent (entities reset on page reload)

### Phase 3C: Moving Entities

#### Requirements
- Three-click movement system: select entity → target position → confirm
- Visual movement preview showing target location
- Smooth animation between current and target positions
- Movement validation (target must be within plane boundaries)
- Movement cancellation (right-click or escape)

#### Movement Workflow
1. **Click 1**: Select entity (highlight selected entity)
2. **Click 2**: Select target position (show preview line/marker)
3. **Click 3**: Confirm movement (animate entity to target)
- Right-click or ESC cancels movement at any stage

#### Movement System
- Movement state tracking: idle, selecting_target, confirming_move
- Visual feedback: selection highlight, target marker, movement line
- Smooth interpolation animation (configurable duration)
- Multiple entities can be queued for movement
- Movement queue system with visual indicators

## Phase 4: TypeScript Conversion
- [ ] Install TypeScript, ts-loader, and webpack as dev dependencies
- [ ] Create a webpack.config.js to bundle the TypeScript files
- [ ] Create a tsconfig.json file for TypeScript configuration
- [ ] Rename main.js and EntityManager.js to .ts files
- [ ] Add types to the existing code in the new .ts files
- [ ] Update index.html to point to the new bundled javascript file
- [ ] Update package.json with a build script that runs webpack