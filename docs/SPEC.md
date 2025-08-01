# Logistics Simulation Specification

## 1. Overview
This document outlines the specifications for a 3D logistics simulation application. The core of the application is a web-based interface displaying a 3D world with a configurable plane, a flexible camera system, and support for various types of entities.

## 2. World Plane
- The simulation will take place on a configurable X-Y plane.
- The plane's dimensions (height and width) will be adjustable.
- It must support an unlimited number of fixed or moving entities.

## 3. Camera System

### 3.1. Core Requirements
- The camera must be a 3D perspective camera positioned above the X-Y plane.
- It should maintain focus on a central point when rotating.
- The camera's viewing angle must not go below 15 degrees relative to the plane, preventing it from clipping through the ground.

### 3.2. Controls
- **Panning:** Use **WASD** keys for camera movement, relative to the camera's current orientation.
- **Rotation:** Use **Q** and **E** keys to rotate the camera in a wide circle around its focal point.
- **Tilting:** Use **Shift-W** and **Shift-S** to tilt the camera angle up and down.
- **Zoom:** Use the **mousewheel** to zoom in and out (within a 10-200 unit range).

### 3.3. Technical Implementation
- The system is implemented using a `Three.js PerspectiveCamera`.
- Camera state (focal point, distance, rotation) is tracked in spherical coordinates.
- A continuous key state tracking mechanism ensures smooth and responsive movements.

## 4. Entity Management

### 4.1. Static Entities (JSON-Based)
- Entities can be loaded from a JSON configuration file on application start.
- Supported entity types include: `box`, `cylinder`, and `sphere`.
- **Properties:** Each entity has an `id`, `type`, `position` (x, y on the plane), `size`, and `color`.
- **JSON Structure:**
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

### 4.2. Interactive Entity Management
- **Creation:** Users can click on the plane to place new entities. This is handled via mouse raycasting.
- **Selection:** Entities can be selected, which provides visual feedback (e.g., highlighting or an outline).
- **Modification:** Selected entities' properties (like position, color, type) can be edited through a UI panel.
- **Deletion:** Entities can be deleted using a UI button.
- **Persistence:** Entity state is not persistent and resets on page reload.

### 4.3. Moving Entities

#### 4.3.1. Core Properties
- **Position**: A 3D vector (`x`, `y`, `z`) representing the entity's location.
- **Velocity**: A 3D vector (`vx`, `vy`, `vz`) representing speed and direction.
- **Acceleration**: A 3D vector (`ax`, `ay`, `az`) representing the rate of change of velocity.
- **Orientation**: The entity's rotation should align with its direction of movement.

#### 4.3.2. Movement Mechanics
- **Time-based Updates**: Entity movement is based on a discrete time step (`deltaTime`) to ensure consistent speed across different frame rates.
- **Movement Control**: The simulation uses a two-click system for directing entities:
  1. **Click 1**: Select the entity to move.
  2. **Click 2**: Select the target destination on the plane to initiate movement.
- **Visual Feedback**: The system provides visual aids, such as a preview line to the target, a marker at the destination, and highlighting for the selected entity.
- **Animation**: Movement between the start and target positions is a smooth, interpolated animation.
- **Validation**: The target position must be within the boundaries of the world plane.
- **Cancellation**: The movement command can be canceled by pressing the `Escape` key.
- **Simultaneous Movement**: The system supports moving multiple entities at the same time.

## 5. User Interface
- A dedicated, collapsible UI panel will house entity management controls.
- **Controls Include:**
  - An entity type selector (dropdown for `box`, `cylinder`, `sphere`).
  - A color picker for customizing entity appearance.
  - A list displaying all current entities with their names or IDs.
  - Buttons for deleting entities and clearing all entities from the scene.
- Constants for velocity and acceleration should be editable in a controls section of the UI.

## 6. Collision Mechanics

### 6.1. Core Requirement
- Entities must not be able to pass through one another. They should realistically collide and react.

### 6.2. Detection Method
- **Bounding Volumes:** Collision detection will be based on simplified geometric shapes that surround each entity.
  - **`box` type:** An Axis-Aligned Bounding Box (AABB).
  - **`sphere`, `cylinder` types:** A Bounding Sphere.
- **Checks:** The system will perform intersection tests between these bounding volumes on each frame.

### 6.3. Response Method
- **Physics-Based Reaction:** Collisions will be treated as elastic, meaning entities will "bounce" off each other.
- **Mass Property:** A `mass` property will be added to each entity to influence the collision outcome. By default, all entities will have a mass of 1.
- **Static vs. Dynamic:** If a moving entity collides with a static entity (one with zero velocity), the moving entity will bounce off, and the static entity will remain unaffected (as if it has infinite mass).
- **Calculation:** The post-collision velocities will be calculated based on the conservation of momentum and kinetic energy.

## 7. Pathfinding and Obstacle Avoidance

### 7.1. Core Requirement
- Moving entities must intelligently navigate the environment to reach their destination, avoiding both static and dynamic obstacles without getting stuck.

### 7.2. Hybrid Approach
- The system will use a two-layered approach for robust navigation:
  - **Global Pathfinding (A\*):** Provides a high-level, optimal path from the start to the end point.
  - **Local Avoidance (Steering Behaviors):** Provides real-time, reactive adjustments to avoid immediate obstacles like other moving entities.

### 7.3. A* Pathfinding Implementation
- **Grid System:** The world plane will be represented as a grid for the A* algorithm.
  - **Cell Size:** The grid will have a configurable resolution (e.g., 1 cell per world unit).
  - **Obstacle Mapping:** Static entities will mark their corresponding grid cells as permanently unwalkable. Moving entities will temporarily mark their cells, forcing the A* algorithm to path around them.
- **Path Smoothing:** The raw path generated by A* (a sequence of grid nodes) will be smoothed to produce a more natural, direct line of movement where possible.
- **Dynamic Re-planning:** An entity will recalculate its A* path if its current path becomes blocked by a new, unforeseen obstacle.

### 7.4. Local Avoidance Implementation
- **Steering Behaviors:** Entities will use a combination of steering forces to navigate their immediate surroundings.
  - **Seek:** A force that steers the entity towards the next waypoint on its A* path.
  - **Separation:** A repulsive force that discourages entities from getting too close to each other, preventing clumping.
  - **Obstacle Avoidance:** A force that steers the entity away from imminent collisions with other entities.
- **Force Combination:** The final velocity of an entity will be a weighted combination of these steering forces, allowing for nuanced and reactive movement.
