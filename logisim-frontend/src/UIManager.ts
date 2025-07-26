import * as THREE from 'three';
import { Entity } from "./entities";

export class UIManager {
  private entityList: HTMLElement;
  private selectedEntityPanel: HTMLElement;
  private entityTypeSelect: HTMLSelectElement;
  private addEntityButton: HTMLButtonElement;
  private clearEntitiesButton: HTMLButtonElement;

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

    this.addEntityButton.addEventListener('click', () => this.onAddEntity(this.entityTypeSelect.value as any));
    this.clearEntitiesButton.addEventListener('click', () => this.onClearEntities());
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
      this.selectedEntityPanel.innerHTML = `
        <p>ID: ${selectedEntity.id}</p>
        <p>Type: ${selectedEntity.type}</p>
        <label>Color: <input type="color" id="entity-color" value="${selectedEntity.color}"></label>
      `;
      const colorInput = document.getElementById('entity-color') as HTMLInputElement;
      colorInput.addEventListener('input', () => {
        selectedEntity.color = colorInput.value;
        (selectedEntity.mesh!.material as THREE.MeshLambertMaterial).color.set(colorInput.value);
      });
    } else {
      this.selectedEntityPanel.innerHTML = '<p>No entity selected</p>';
    }
  }
}
