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