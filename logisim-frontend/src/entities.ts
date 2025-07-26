import { AppInteractionManager } from './InteractionManager';
import * as THREE from 'three';

export interface EntityData {
  id: string;
  type: 'box' | 'cylinder' | 'sphere';
  position: { x: number; y: number };
  size: { width?: number; height?: number; depth?: number; radius?: number };
  color: string;
}

export class Entity {
  id: string;
  type: 'box' | 'cylinder' | 'sphere';
  position: { x: number; y: number };
  size: { width?: number; height?: number; depth?: number; radius?: number };
  color: string;
  mesh: THREE.Mesh | null;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  isMoving: boolean;
  targetPosition: THREE.Vector3 | null;
  movementVisuals: { marker: THREE.Mesh, line: THREE.Line } | null;

  constructor(entityData: EntityData) {
    this.id = entityData.id;
    this.type = entityData.type;
    this.position = entityData.position;
    this.size = entityData.size;
    this.color = entityData.color;
    this.mesh = null;
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.isMoving = false;
    this.targetPosition = null;
    this.movementVisuals = null;
  }

  update(deltaTime: number) {
    // Handle movement towards a target destination
    if (this.isMoving && this.targetPosition && this.mesh) {
      const speed = 5; // This could be a configurable property
      
      const targetPositionOnPlane = this.targetPosition.clone();
      targetPositionOnPlane.y = this.mesh.position.y;

      const distanceToTarget = this.mesh.position.distanceTo(targetPositionOnPlane);
      const travelDistance = speed * deltaTime;

      if (distanceToTarget <= travelDistance) {
        // Arrived at the destination
        this.mesh.position.copy(targetPositionOnPlane);
        this.isMoving = false;
        this.targetPosition = null;
        this.velocity.set(0, 0, 0);
      } else {
        // Move towards the destination
        const direction = targetPositionOnPlane.clone().sub(this.mesh.position).normalize();
        this.velocity = direction.multiplyScalar(speed);
        const deltaPosition = this.velocity.clone().multiplyScalar(deltaTime);
        this.mesh.position.add(deltaPosition);
      }
    }
    // Handle physics-based movement (e.g., from acceleration)
    else if (this.mesh) {
      this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
      const deltaPosition = this.velocity.clone().multiplyScalar(deltaTime);
      this.mesh.position.add(deltaPosition);
    }

    // Update internal state and orientation for all cases
    if (this.mesh) {
      this.position.x = this.mesh.position.x;
      this.position.y = this.mesh.position.z;

      if (this.velocity.lengthSq() > 0.001) {
        const lookAtTarget = this.mesh.position.clone().add(this.velocity);
        this.mesh.lookAt(lookAtTarget);
      }
    }
  }
}

export class EntityManager {
  scene: THREE.Scene;
  entities: Entity[];
  interactionManager: AppInteractionManager;

  constructor(scene: THREE.Scene, interactionManager: AppInteractionManager) {
    this.scene = scene;
    this.entities = [];
    this.interactionManager = interactionManager;
  }

  async loadEntities(url: string) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.entities && Array.isArray(data.entities)) {
        data.entities.forEach((entityData: EntityData) => {
          this.createEntity(entityData);
        });
      }
    } catch (error) {
      console.error('Error loading entities:', error);
    }
  }

  createEntity(entityData: EntityData) {
    const entity = new Entity(entityData);

    let geometry: THREE.BufferGeometry;
    switch (entity.type) {
      case 'box':
        geometry = new THREE.BoxGeometry(entity.size.width, entity.size.height, entity.size.depth);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(entity.size.radius, entity.size.radius, entity.size.height, 32);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(entity.size.radius, 32, 32);
        break;
      default:
        console.warn(`Unknown entity type: ${entity.type}`);
        return;
    }

    const material = new THREE.MeshLambertMaterial({ color: entity.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(entity.position.x, (entity.size.height || 0) / 2, entity.position.y);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.userData.entity = entity;

    entity.mesh = mesh;
    this.entities.push(entity);
    this.scene.add(mesh);
    this.interactionManager.add(entity);

    return entity;
  }

  addEntity(type: 'box' | 'cylinder' | 'sphere', position: { x: number, y: number }) {
    const entityData: EntityData = {
      id: `entity_${Date.now()}`,
      type,
      position,
      size: type === 'box' ? { width: 4, height: 4, depth: 4 } : { radius: 2, height: 6 },
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };
    return this.createEntity(entityData);
  }

  deleteEntity(entity: Entity) {
    if (entity.mesh) {
      this.interactionManager.remove(entity);
      this.scene.remove(entity.mesh);
    }
    this.entities = this.entities.filter(e => e.id !== entity.id);
  }

  clearEntities() {
    this.entities.forEach(entity => {
      if (entity.mesh) {
        this.interactionManager.remove(entity);
        this.scene.remove(entity.mesh);
      }
    });
    this.entities = [];
  }
}
