import * as THREE from 'three';
import './style.css';
import { EntityManager, Entity } from './entities';
import { CameraControls } from './CameraControls';
import { UIManager } from './UIManager';
import { AppInteractionManager } from './InteractionManager';

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
  }

  addEntity(type: 'box' | 'cylinder' | 'sphere') {
    // For now, add at center
    this.entityManager.addEntity(type, { x: 0, y: 0 });
    this.uiManager.updateEntityList(this.entityManager.entities, this.selectedEntity);
  }

  clearEntities() {
    this.entityManager.clearEntities();
    this.selectEntity(null);
  }

  selectEntity(entity: Entity | null) {
    this.selectedEntity = entity;
    // this.interactionManager.selectEntity(entity);
    this.uiManager.updateEntityList(this.entityManager.entities, this.selectedEntity);
    this.uiManager.updateSelectedEntityPanel(this.selectedEntity);
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