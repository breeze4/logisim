# Logistics Simulation

This project is a web-based 3D logistics simulation built with TypeScript, Three.js, and Vite. It provides an interactive environment for creating, managing, and moving entities on a configurable 3D plane.

## Features

### Core Engine
- **3D Rendering:** Utilizes Three.js for rendering the 3D environment.
- **World Plane:** A configurable X-Y plane with adjustable height and width.
- **Camera System:** A 3D perspective camera with smooth controls.
- **Vite Frontend:** A modern frontend build setup using Vite.

### Camera Controls
- **Panning:** WASD keys for camera movement.
- **Rotation:** Q and E keys for rotation.
- **Tilting:** Shift+W/S for tilting the camera angle.
- **Zoom:** Mousewheel for zooming in and out.
- **Constraints:** Camera angle is constrained to prevent clipping through the ground.

### Entity Management
- **Entity Class:** A robust `Entity` class with properties for position, type, size, color, and movement.
- **Entity Manager:** A centralized `EntityManager` for lifecycle management.
- **Rendering:** Entities are rendered as Three.js geometries (box, cylinder, sphere).
- **JSON Loading:** Entities can be pre-loaded from a JSON configuration file.
- **Shadows:** All entities correctly cast and receive shadows.

### Interactive Features
- **UI Panel:** A dedicated UI for managing entities and simulation settings.
- **Raycasting:** Mouse-based interaction for selecting and moving entities.
- **Entity Selection:** Visual highlighting for selected entities.
- **Dynamic Creation:** Click-to-place functionality for adding new entities.
- **Property Editor:** Modify selected entity properties like color, velocity, and acceleration in real-time.
- **Deletion:** A "Clear All" button to remove all entities from the scene.

### Entity Movement
- **Physics-based:** Movement is based on velocity and acceleration, updated with a `deltaTime` for frame-rate independence.
- **Orientation:** Entities automatically orient themselves to face their direction of movement.
- **Interactive Control:**
  - **Two-Click Movement:** Select an entity, then click a destination to initiate movement.
  - **Visual Feedback:** A preview line shows the intended path, and a target marker indicates the destination.
  - **Dynamic Updates:** The progress line updates in real-time as the entity moves.
  - **Multiple Movers:** The system supports multiple entities moving simultaneously, each with its own visuals.
  - **Rerouting:** A moving entity can be re-tasked to a new destination, with visuals updating correctly.
  - **Validation:** Target positions are validated to be within the world boundaries.
  - **Cancellation:** Movement commands can be canceled by pressing the `Escape` key.
- **UI Feedback:** A status display provides clear instructions to the user based on the current interaction state.

## How to Run

1.  Navigate to the `logisim-frontend` directory.
2.  Install dependencies: `npm install`
3.  Run the development server: `npm run dev`
4.  Open the provided URL in your browser.

## Project Structure

- `docs/`: Contains the detailed specification and feature list.
- `logisim-frontend/`: The main Vite project with all the source code.
  - `src/`: TypeScript source files.
  - `public/`: Static assets.
- `server.js`: A simple Express server for the backend.
