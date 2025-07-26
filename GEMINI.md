# GEMINI.md

This file provides guidance to Gemini CLI when working with code in this repository.

## Project Overview

This is a logistics simulation project that aims to create a 3D web-based application. The project is currently in early development with a basic Express.js server setup serving static files.

## Architecture

- **Backend**: Node.js with Express.js server (`server.js`)
  - Serves static files from the `public/` directory
  - Provides basic API endpoints (example at `/api/example`)
  - Runs on port 3000 by default

- **Frontend**: Basic HTML/JavaScript client in `public/`
  - `index.html`: Main HTML page
  - `main.js`: Client-side JavaScript handling API calls

- **Specification**: Detailed game requirements in `docs/SPEC.md`
  - Describes a 3D camera system with specific controls
  - WASD for panning, Q/E for rotation around a point
  - Ctrl/Space for zoom in/out
  - Camera angle constraints (never below 15 degrees above plane)
  - Support for configurable plane dimensions and entities

## Development Commands

```bash
# Start the development server
npm run start:dev

# Start the production server
npm start
```

## Project Goals

Based on the specification, this project will implement:
1. A 3D camera system with constrained movement
2. A configurable world plane (X-Y axis)
3. Support for fixed and moving entities
4. Web-based interface for the logistics simulation

The current implementation is a minimal Express.js setup that needs significant development to meet the 3D simulation requirements outlined in the specification.

## Working instructions

Reference `@docs/SPEC.md` and `@docs/TASKS.md` files when deciding what work to do.

When completing a checklist of tasks, make sure to check off each item as its completed.

When turning a spec into tasks, make sure that the tasks are logical units of creation. For example, to turn a basic API call from the spec into tasks, try something like: task to scaffold the API client and make sure it works correctly, then add resuable constants/functions as needed, then make the new API call, then add the usage of the API to the app. Be very granular and specific with tasks.

After completing a series of tasks, be sure to run `npm run build` to look for error messages in the build.
