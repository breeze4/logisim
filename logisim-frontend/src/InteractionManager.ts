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
  }

  add(entity: Entity) {
    if (!entity.mesh) return;

    this.interactionManager.add(entity.mesh);
    // @ts-expect-error: 'click' is not in Object3DEventMap, but is supported by three.interactive
    entity.mesh.addEventListener('click', (event: InteractiveEvent) => {
      event.stopPropagation();
      if (event.originalEvent) {
        event.originalEvent.stopPropagation();
      }
      this.onSelectEntity(entity);
    });
  }

  remove(entity: Entity) {
    if (entity.mesh) {
      this.interactionManager.remove(entity.mesh);
    }
  }

  setHighlight(entity: Entity | null) {
    if (this.selectedEntity && this.selectedEntity.mesh) {
      // Deselect previous
      (this.selectedEntity.mesh.material as THREE.MeshLambertMaterial).emissive.setHex(0x000000);
    }

    this.selectedEntity = entity;

    if (this.selectedEntity && this.selectedEntity.mesh) {
      // Select new
      (this.selectedEntity.mesh.material as THREE.MeshLambertMaterial).emissive.setHex(0x555555);
    }
  }

  update() {
    this.interactionManager.update();
  }
}