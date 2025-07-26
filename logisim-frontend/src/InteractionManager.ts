import * as THREE from 'three';
import { InteractionManager, InteractiveEvent } from 'three.interactive';
import { Entity } from './entities';

export class AppInteractionManager {
  private interactionManager: InteractionManager;
  private selectedEntity: Entity | null = null;

  constructor(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    private onSelectEntity: (entity: Entity | null) => void
  ) {
    this.interactionManager = new InteractionManager(renderer, camera, renderer.domElement);
    window.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (this.selectedEntity) {
        // This should be handled by the EntityManager
        console.log('Delete key pressed for entity:', this.selectedEntity.id);
      }
    }
  }

  add(entity: Entity) {
    if (!entity.mesh) return;

    this.interactionManager.add(entity.mesh);
    entity.mesh.addEventListener('click', (event: InteractiveEvent) => {
      event.stopPropagation();
      this.selectEntity(entity);
    });
  }

  remove(entity: Entity) {
    if (entity.mesh) {
      this.interactionManager.remove(entity.mesh);
    }
  }

  selectEntity(entity: Entity | null) {
    if (this.selectedEntity && this.selectedEntity.mesh) {
      // Deselect previous
      (this.selectedEntity.mesh.material as THREE.MeshLambertMaterial).emissive.setHex(0x000000);
    }

    this.selectedEntity = entity;

    if (this.selectedEntity && this.selectedEntity.mesh) {
      // Select new
      (this.selectedEntity.mesh.material as THREE.MeshLambertMaterial).emissive.setHex(0x555555);
    }

    this.onSelectEntity(this.selectedEntity);
  }

  update() {
    this.interactionManager.update();
  }
}