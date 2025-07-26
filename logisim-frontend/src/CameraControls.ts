import * as THREE from 'three';

export class CameraControls {
  camera: THREE.PerspectiveCamera;
  cameraFocusPoint: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  cameraDistance: number = 50;
  cameraAngle: number = Math.PI / 4;
  cameraRotation: number = 0;
  keys: { [key: string]: boolean } = {};

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.setupControls();
    this.updateCameraPosition();
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

  update() {
    this.handleKeyInput();
  }
}
