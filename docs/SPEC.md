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
- **Zoom:** Use **Ctrl** and **Space** keys to zoom in and out, respectively (within a 10-200 unit range).

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
- **Deletion:** Entities can be deleted by selecting them and pressing the 'Delete' key or using a UI button.
- **Persistence:** Entity state is not persistent and resets on page reload.

### 4.3. Moving Entities

#### 4.3.1. Core Properties
- **Position**: A 3D vector (`x`, `y`, `z`) representing the entity's location.
- **Velocity**: A 3D vector (`vx`, `vy`, `vz`) representing speed and direction.
- **Acceleration**: A 3D vector (`ax`, `ay`, `az`) representing the rate of change of velocity.
- **Orientation**: The entity's rotation should align with its direction of movement.

#### 4.3.2. Movement Mechanics
- **Time-based Updates**: Entity movement is based on a discrete time step (`deltaTime`) to ensure consistent speed across different frame rates.
  - `new_velocity = current_velocity + acceleration * deltaTime`
  - `new_position = current_position + velocity * deltaTime`
- **Movement Control**: The simulation will use a three-click system for directing entities:
  1. **Click 1**: Select the entity to move.
  2. **Click 2**: Select the target destination on the plane.
  3. **Click 3**: Confirm the movement, initiating the animation.
- **Visual Feedback**: The system will provide visual aids, such as a preview line to the target, a marker at the destination, and highlighting for the selected entity.
- **Animation**: Movement between the start and target positions will be a smooth, interpolated animation.
- **Validation**: The target position must be within the boundaries of the world plane.
- **Cancellation**: The movement command can be canceled by right-clicking or pressing the `Escape` key.
- **Movement Queue**: The system should support queueing movement commands for multiple entities.

## 5. User Interface
- A dedicated, collapsible UI panel will house entity management controls.
- **Controls Include:**
  - An entity type selector (dropdown for `box`, `cylinder`, `sphere`).
  - A color picker for customizing entity appearance.
  - A list displaying all current entities with their names or IDs.
  - Buttons for deleting entities and clearing all entities from the scene.
- Constants for velocity and acceleration should be editable in a controls section of the UI.