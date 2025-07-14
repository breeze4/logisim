class LogisticsSimulation {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.plane = null;
    this.planeWidth = 100;
    this.planeHeight = 100;
    this.cameraFocusPoint = new THREE.Vector3(0, 0, 0);
    this.cameraDistance = 50;
    this.cameraAngle = Math.PI / 4;
    this.cameraRotation = 0;
    this.keys = {};
    
    this.init();
    this.setupControls();
    this.animate();
  }

  init() {
    const container = document.getElementById('canvas-container');
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.createPlane();
    this.setupLighting();
    this.updateCameraPosition();

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
    this.scene.add(directionalLight);
  }

  updateCameraPosition() {
    const minAngle = 15 * Math.PI / 180;
    const maxAngle = 85 * Math.PI / 180;
    this.cameraAngle = Math.max(minAngle, Math.min(this.cameraAngle, maxAngle));
    
    const x = this.cameraFocusPoint.x + this.cameraDistance * Math.cos(this.cameraRotation) * Math.cos(this.cameraAngle);
    const z = this.cameraFocusPoint.z + this.cameraDistance * Math.sin(this.cameraRotation) * Math.cos(this.cameraAngle);
    const y = this.cameraFocusPoint.y + this.cameraDistance * Math.sin(this.cameraAngle);
    
    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.cameraFocusPoint);
  }

  setupControls() {
    document.addEventListener('keydown', (event) => {
      this.keys[event.code] = true;
      this.keys['Shift'] = event.shiftKey;
    });

    document.addEventListener('keyup', (event) => {
      this.keys[event.code] = false;
      this.keys['Shift'] = event.shiftKey;
    });

    document.getElementById('updatePlane').addEventListener('click', () => {
      this.planeWidth = parseInt(document.getElementById('planeWidth').value);
      this.planeHeight = parseInt(document.getElementById('planeHeight').value);
      this.createPlane();
    });
  }

  handleKeyInput() {
    const panSpeed = 0.75;
    const rotationSpeed = 0.01;
    const zoomSpeed = 2;
    const tiltSpeed = 0.005;

    const forward = new THREE.Vector3(
      Math.cos(this.cameraRotation),
      0,
      Math.sin(this.cameraRotation)
    );
    const right = new THREE.Vector3(
      -Math.sin(this.cameraRotation),
      0,
      Math.cos(this.cameraRotation)
    );

    if (this.keys['KeyW']) {
      if (this.keys['Shift']) {
        this.cameraAngle += tiltSpeed;
      } else {
        this.cameraFocusPoint.add(forward.clone().multiplyScalar(-panSpeed));
      }
    }
    if (this.keys['KeyS']) {
      if (this.keys['Shift']) {
        this.cameraAngle -= tiltSpeed;
      } else {
        this.cameraFocusPoint.add(forward.clone().multiplyScalar(panSpeed));
      }
    }
    if (this.keys['KeyA']) {
      this.cameraFocusPoint.add(right.clone().multiplyScalar(panSpeed));
    }
    if (this.keys['KeyD']) {
      this.cameraFocusPoint.add(right.clone().multiplyScalar(-panSpeed));
    }
    
    if (this.keys['KeyQ']) {
      this.cameraRotation += rotationSpeed;
    }
    if (this.keys['KeyE']) {
      this.cameraRotation -= rotationSpeed;
    }
    
    if (this.keys['ControlLeft'] || this.keys['ControlRight']) {
      this.cameraDistance = Math.max(10, this.cameraDistance - zoomSpeed);
    }
    if (this.keys['Space']) {
      this.cameraDistance = Math.min(200, this.cameraDistance + zoomSpeed);
    }

    this.updateCameraPosition();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.handleKeyInput();
    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LogisticsSimulation();
}); 