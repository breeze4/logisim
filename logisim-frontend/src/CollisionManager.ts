import * as THREE from 'three';
import { Entity } from './entities';

export class CollisionManager {
  constructor(private entities: Entity[]) {}

  public checkCollisions() {
    for (let i = 0; i < this.entities.length; i++) {
      for (let j = i + 1; j < this.entities.length; j++) {
        const entityA = this.entities[i];
        const entityB = this.entities[j];

        if (this.areColliding(entityA, entityB)) {
          this.resolveCollision(entityA, entityB);
        }
      }
    }
  }

  private areColliding(a: Entity, b: Entity): boolean {
    if (!a.boundingVolume || !b.boundingVolume) return false;

    if (a.boundingVolume instanceof THREE.Box3 && b.boundingVolume instanceof THREE.Box3) {
      return a.boundingVolume.intersectsBox(b.boundingVolume);
    }
    if (a.boundingVolume instanceof THREE.Sphere && b.boundingVolume instanceof THREE.Sphere) {
      return a.boundingVolume.intersectsSphere(b.boundingVolume);
    }
    if (a.boundingVolume instanceof THREE.Box3 && b.boundingVolume instanceof THREE.Sphere) {
      return a.boundingVolume.intersectsSphere(b.boundingVolume);
    }
    if (a.boundingVolume instanceof THREE.Sphere && b.boundingVolume instanceof THREE.Box3) {
      return a.boundingVolume.intersectsBox(b.boundingVolume);
    }
    return false;
  }

  private resolveCollision(a: Entity, b: Entity) {
    // Simple elastic collision response
    const v1 = a.velocity.clone();
    const v2 = b.velocity.clone();
    const m1 = a.mass;
    const m2 = b.mass;

    // Static objects (mass 0 or velocity 0) are treated as having infinite mass
    if (v1.lengthSq() === 0) {
        b.velocity.reflect(v1.clone().normalize());
        return;
    }
    if (v2.lengthSq() === 0) {
        a.velocity.reflect(v2.clone().normalize());
        return;
    }

    const newVelA = v1.clone().multiplyScalar((m1 - m2) / (m1 + m2)).add(v2.clone().multiplyScalar((2 * m2) / (m1 + m2)));
    const newVelB = v1.clone().multiplyScalar((2 * m1) / (m1 + m2)).add(v2.clone().multiplyScalar((m2 - m1) / (m1 + m2)));

    a.velocity = newVelA;
    b.velocity = newVelB;
  }
}
