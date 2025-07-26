import * as THREE from 'three';
import { Entity } from "./entities";

export class UIManager {
  private entityList: HTMLElement;
  private selectedEntityPanel: HTMLElement;
  private entityTypeSelect: HTMLSelectElement;
  private addEntityButton: HTMLButtonElement;
  private clearEntitiesButton: HTMLButtonElement;
  private statusDisplay: HTMLElement;

  constructor(
    private onAddEntity: (type: 'box' | 'cylinder' | 'sphere') => void,
    private onClearEntities: () => void,
    private onSelectEntity: (entity: Entity) => void
  ) {
    this.entityList = document.getElementById('entity-list')!;
    this.selectedEntityPanel = document.getElementById('selected-entity-panel')!;
    this.entityTypeSelect = document.getElementById('entity-type') as HTMLSelectElement;
    this.addEntityButton = document.getElementById('add-entity') as HTMLButtonElement;
    this.clearEntitiesButton = document.getElementById('clear-entities') as HTMLButtonElement;
    this.statusDisplay = document.getElementById('status-display')!;

    this.addEntityButton.addEventListener('click', () => this.onAddEntity(this.entityTypeSelect.value as any));
    this.clearEntitiesButton.addEventListener('click', () => this.onClearEntities());
  }

  updateStatus(state: 'IDLE' | 'ENTITY_SELECTED') {
    if (state === 'IDLE') {
      this.statusDisplay.textContent = 'Select an entity to begin.';
      this.statusDisplay.className = 'status-idle';
    } else {
      this.statusDisplay.textContent = 'Entity selected. Click a destination on the plane to start movement.';
      this.statusDisplay.className = 'status-selected';
    }
  }

  updateMovementVectors(entity: Entity) {
    const velocityX = document.getElementById('velocity-x') as HTMLInputElement;
    const velocityY = document.getElementById('velocity-y') as HTMLInputElement;
    const velocityZ = document.getElementById('velocity-z') as HTMLInputElement;
    const accelerationX = document.getElementById('acceleration-x') as HTMLInputElement;
    const accelerationY = document.getElementById('acceleration-y') as HTMLInputElement;
    const accelerationZ = document.getElementById('acceleration-z') as HTMLInputElement;

    if (velocityX) velocityX.value = entity.velocity.x.toFixed(2);
    if (velocityY) velocityY.value = entity.velocity.y.toFixed(2);
    if (velocityZ) velocityZ.value = entity.velocity.z.toFixed(2);
    if (accelerationX) accelerationX.value = entity.acceleration.x.toFixed(2);
    if (accelerationY) accelerationY.value = entity.acceleration.y.toFixed(2);
    if (accelerationZ) accelerationZ.value = entity.acceleration.z.toFixed(2);
  }

  updateEntityList(entities: Entity[], selectedEntity: Entity | null) {
    this.entityList.innerHTML = '';
    entities.forEach(entity => {
      const item = document.createElement('div');
      item.className = 'entity-list-item';
      if (entity === selectedEntity) {
        item.classList.add('selected');
      }
      item.textContent = `${entity.id} (${entity.type})`;
      item.addEventListener('click', () => this.onSelectEntity(entity));
      this.entityList.appendChild(item);
    });
  }

  updateSelectedEntityPanel(selectedEntity: Entity | null) {
    if (selectedEntity) {
      const { id, type, color, position, size, mesh, velocity, acceleration } = selectedEntity;
      this.selectedEntityPanel.innerHTML = `
        <h4>Entity Properties</h4>
        <p><strong>ID:</strong> ${id}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Position:</strong> x: ${position.x.toFixed(2)}, y: ${position.y.toFixed(2)}</p>
        <p><strong>Size:</strong> ${JSON.stringify(size)}</p>
        <label><strong>Color:</strong> <input type="color" id="entity-color" value="${color}"></label>
        
        <hr>
        <h4>Movement</h4>
        <div>
          <strong>Velocity:</strong><br>
          <label>x: <input type="number" class="vector-input" id="velocity-x" value="${velocity.x}"></label>
          <label>y: <input type="number" class="vector-input" id="velocity-y" value="${velocity.y}"></label>
          <label>z: <input type="number" class="vector-input" id="velocity-z" value="${velocity.z}"></label>
        </div>
        <div>
          <strong>Acceleration:</strong><br>
          <label>x: <input type="number" class="vector-input" id="acceleration-x" value="${acceleration.x}"></label>
          <label>y: <input type="number" class="vector-input" id="acceleration-y" value="${acceleration.y}"></label>
          <label>z: <input type="number" class="vector-input" id="acceleration-z" value="${acceleration.z}"></label>
        </div>
      `;

      if (mesh) {
        this.selectedEntityPanel.innerHTML += `
          <hr>
          <h4>Mesh Properties</h4>
          <p><strong>Position:</strong> x: ${mesh.position.x.toFixed(2)}, y: ${mesh.position.y.toFixed(2)}, z: ${mesh.position.z.toFixed(2)}</p>
          <p><strong>Rotation:</strong> x: ${mesh.rotation.x.toFixed(2)}, y: ${mesh.rotation.y.toFixed(2)}, z: ${mesh.rotation.z.toFixed(2)}</p>
          <p><strong>Scale:</strong> x: ${mesh.scale.x.toFixed(2)}, y: ${mesh.scale.y.toFixed(2)}, z: ${mesh.scale.z.toFixed(2)}</p>
          <p><strong>Visible:</strong> ${mesh.visible}</p>
          <p><strong>Cast Shadow:</strong> ${mesh.castShadow}</p>
          <p><strong>Receive Shadow:</strong> ${mesh.receiveShadow}</p>
        `;
      }

      document.getElementById('entity-color')!.addEventListener('input', (e) => {
        selectedEntity.color = (e.target as HTMLInputElement).value;
        if (selectedEntity.mesh && selectedEntity.mesh.material instanceof THREE.MeshLambertMaterial) {
          selectedEntity.mesh.material.color.set(selectedEntity.color);
        }
      });

      document.getElementById('velocity-x')!.addEventListener('input', (e) => selectedEntity.velocity.x = parseFloat((e.target as HTMLInputElement).value));
      document.getElementById('velocity-y')!.addEventListener('input', (e) => selectedEntity.velocity.y = parseFloat((e.target as HTMLInputElement).value));
      document.getElementById('velocity-z')!.addEventListener('input', (e) => selectedEntity.velocity.z = parseFloat((e.target as HTMLInputElement).value));

      document.getElementById('acceleration-x')!.addEventListener('input', (e) => selectedEntity.acceleration.x = parseFloat((e.target as HTMLInputElement).value));
      document.getElementById('acceleration-y')!.addEventListener('input', (e) => selectedEntity.acceleration.y = parseFloat((e.target as HTMLInputElement).value));
      document.getElementById('acceleration-z')!.addEventListener('input', (e) => selectedEntity.acceleration.z = parseFloat((e.target as HTMLInputElement).value));

    } else {
      this.selectedEntityPanel.innerHTML = '<p>No entity selected</p>';
    }
  }
}
