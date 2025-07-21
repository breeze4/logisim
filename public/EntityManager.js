class Entity {
  constructor(entityData) {
    this.id = entityData.id;
    this.type = entityData.type;
    this.position = entityData.position;
    this.size = entityData.size;
    this.color = entityData.color;
    this.mesh = null;
  }
}

class EntityManager {
  constructor(scene) {
    this.scene = scene;
    this.entities = [];
  }

  async loadEntities(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.entities && Array.isArray(data.entities)) {
        data.entities.forEach(entityData => {
          this.createEntity(entityData);
        });
      }
    } catch (error) {
      console.error('Error loading entities:', error);
    }
  }

  createEntity(entityData) {
    const entity = new Entity(entityData);

    let geometry;
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
    mesh.position.set(entity.position.x, entity.size.height / 2, entity.position.y);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    entity.mesh = mesh;
    this.entities.push(entity);
    this.scene.add(mesh);
  }
}
