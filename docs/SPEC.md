# Logistics Sim Spec

## Base game:
* 3D camera with a plane below
* Camera controls:
    * WASD to pan, Q and E to rotate around a point (meaning the camera moves in a wide circle, while remaining focused on a specific point in the middle to rotate around)
    * Shift-W and Shift-S to tilt camera up/down (changes viewing angle)
    * Ctrl and Space keys to zoom in, zoom out (respectively)
* There should be a plane that the game will exist in (an X-Y plane)
* The camera should never go below 15 degrees above the plane (meaning it cant clip down through the world plane)
* The plane should support any number of entities - fixed or moving, and should be configurable with a height/width in the X-Y axis

## Current Camera Control System (Implemented)

### Camera Architecture
- Camera maintains focal point, calculated in spherical coordinates
- Distance and rotation tracked separately from focal point

### Controls
- **WASD**: Pan relative to camera orientation (not world coordinates)
- **Q/E**: Rotate around focal point, smooth continuous movement
- **Shift-W/S**: Tilt camera up/down (changes viewing angle)
- **Ctrl/Space**: Zoom in/out (10-200 unit range)
- **15° constraint**: Camera never goes below plane

### Technical
- Three.js PerspectiveCamera with continuous key state tracking
- All movements maintain focal point as center of operations

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