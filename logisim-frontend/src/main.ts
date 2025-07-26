import * as THREE from 'three';
import './style.css';
import { EntityManager, Entity } from './entities';
import { CameraControls } from './CameraControls';
import { UIManager } from './UIManager';
import { AppInteractionManager } from './InteractionManager';

type MovementState = 'IDLE' | 'ENTITY_SELECTED';

class LogisticsSimulation {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  plane: THREE.Mesh | null = null;
  entityManager: EntityManager;
  cameraControls: CameraControls;
  uiManager: UIManager;
  interactionManager: AppInteractionManager;
  planeWidth: number = 100;
  planeHeight: number = 100;
  selectedEntity: Entity | null = null;
  clock: THREE.Clock;
  movementState: MovementState = 'IDLE';
  previewLine: THREE.Line;
  private entityInteraction: boolean = false;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.clock = new THREE.Clock();
    
    this.interactionManager = new AppInteractionManager(
      this.renderer,
      this.camera,
      this.selectEntity.bind(this)
    );
    this.entityManager = new EntityManager(this.scene, this.interactionManager);
    this.cameraControls = new CameraControls(this.camera);
    this.uiManager = new UIManager(
      this.addEntity.bind(this),
      this.clearEntities.bind(this),
      this.selectEntity.bind(this)
    );

    // Movement visualization
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    this.previewLine = new THREE.Line(lineGeometry, lineMaterial);
    this.previewLine.visible = false;
    this.scene.add(this.previewLine);

    this.init();
    this.setupControls();
    this.animate();
  }

  init() {
    const container = document.getElementById('canvas-container');
    if (!container) {
      console.error('Container not found');
      return;
    }

    this.scene.background = new THREE.Color(0x87CEEB);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.createPlane();
    this.setupLighting();

    this.entityManager.loadEntities('entities.json').then(() => {
      this.uiManager.updateEntityList(this.entityManager.entities, this.selectedEntity);
    });

    window.addEventListener('resize', () => this.onWindowResize());
    this.renderer.domElement.addEventListener('click', this.onPlaneClick.bind(this));
    this.renderer.domElement.addEventListener('mousemove', this.onPlaneMouseMove.bind(this));
  }

  createPlane() {
    if (this.plane) {
      this.scene.remove(this.plane);
    }

    const geometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight);
    const material = new THREE.MeshLambertMaterial({
      color: 0x90EE90,
      side: THREE.DoubleSide
    });

    this.plane = new THREE.Mesh(geometry, material);
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);

    const gridHelper = new THREE.GridHelper(
      Math.max(this.planeWidth, this.planeHeight),
      20,
      0x000000,
      0x666666
    );
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 25);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    // Adjust the shadow camera frustum
    const shadowCameraSize = Math.max(this.planeWidth, this.planeHeight);
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -shadowCameraSize / 2;
    directionalLight.shadow.camera.right = shadowCameraSize / 2;
    directionalLight.shadow.camera.top = shadowCameraSize / 2;
    directionalLight.shadow.camera.bottom = -shadowCameraSize / 2;

    this.scene.add(directionalLight);
  }

  setupControls() {
    const updatePlaneButton = document.getElementById('updatePlane');
    if (updatePlaneButton) {
      updatePlaneButton.addEventListener('click', () => {
        this.planeWidth = parseInt((<HTMLInputElement>document.getElementById('planeWidth')).value);
        this.planeHeight = parseInt((<HTMLInputElement>document.getElementById('planeHeight')).value);
        this.createPlane();
      });
    }
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.selectEntity(null);
      }
    });
  }

  addEntity(type: 'box' | 'cylinder' | 'sphere') {
    // For now, add at center
    const entity = this.entityManager.addEntity(type, { x: 0, y: 0 });
    if (entity) {
        entity.velocity.set(0,0,0); // Start with no velocity
    }
    this.uiManager.updateEntityList(this.entityManager.entities, this.selectedEntity);
  }

  clearEntities() {
    this.entityManager.clearEntities();
    this.selectEntity(null);
  }

  selectEntity(entity: Entity | null) {
    this.entityInteraction = true;

    this.selectedEntity = entity;
    this.interactionManager.setHighlight(entity);

    if (entity) {
      this.movementState = 'ENTITY_SELECTED';
      console.log('Entity selected, waiting for target.');
    } else {
      this.movementState = 'IDLE';
      this.previewLine.visible = false;
    }
    
    this.uiManager.updateEntityList(this.entityManager.entities, this.selectedEntity);
    this.uiManager.updateSelectedEntityPanel(this.selectedEntity);
    this.uiManager.updateStatus(this.movementState);
  }

  onPlaneMouseMove(event: MouseEvent) {
    if (this.movementState !== 'ENTITY_SELECTED' || !this.selectedEntity || !this.selectedEntity.mesh) {
      return;
    }
  
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
  
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObject(this.plane!);
  
    if (intersects.length > 0) {
      const targetPoint = intersects[0].point;
      const points = [this.selectedEntity.mesh.position, targetPoint];
      this.previewLine.geometry.setFromPoints(points);
      this.previewLine.visible = true;
    }
  }

  onPlaneClick(event: MouseEvent) {
    if (this.entityInteraction) {
      this.entityInteraction = false;
      return;
    }
    if (this.movementState !== 'ENTITY_SELECTED' || !this.selectedEntity) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObject(this.plane!);

    if (intersects.length > 0) {
      const targetPoint = intersects[0].point;
      
      if (Math.abs(targetPoint.x) > this.planeWidth / 2 || Math.abs(targetPoint.z) > this.planeHeight / 2) {
        console.warn('Target is outside the plane boundaries.');
        return;
      }

      this.previewLine.visible = false;

      // Clean up old visuals if they exist
      if (this.selectedEntity.movementVisuals) {
        this.scene.remove(this.selectedEntity.movementVisuals.marker);
        this.scene.remove(this.selectedEntity.movementVisuals.line);
      }

      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );
      marker.position.copy(targetPoint);
      this.scene.add(marker);

      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([this.selectedEntity.mesh!.position, targetPoint]);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      this.scene.add(line);

      this.selectedEntity.movementVisuals = { marker, line };
      this.selectedEntity.targetPosition = targetPoint;
      this.selectedEntity.isMoving = true;
      
      console.log('Movement started.');
      this.selectEntity(null);
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const deltaTime = this.clock.getDelta();

    this.entityManager.entities.forEach(entity => {
      entity.update(deltaTime);

      if (entity.isMoving && entity.movementVisuals && entity.mesh && entity.targetPosition) {
        const points = [entity.mesh.position, entity.targetPosition];
        entity.movementVisuals.line.geometry.setFromPoints(points);
      } else if (!entity.isMoving && entity.movementVisuals) {
        this.scene.remove(entity.movementVisuals.marker);
        this.scene.remove(entity.movementVisuals.line);
        // Consider disposing geometry and material here
        entity.movementVisuals = null;
      }
    });

    if (this.selectedEntity) {
      this.uiManager.updateMovementVectors(this.selectedEntity);
    }

    this.cameraControls.update();
    this.interactionManager.update();
    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LogisticsSimulation();
});