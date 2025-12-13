// =======================
//         gem.js
// =======================

class Gem extends Vehicle {
  constructor(x, y) {
    super(x, y);

    this.maxSpeed = 6;       // plus rapide qu'avant
    this.maxForce = 0.35;    // meilleure accélération
    this.r = 7;

    this.detectionRadius = 180; // activation du magnet
    this.autoCollect = false;

    this.trail = []; // pour laisser une traînée lumineuse
  }

  applyBehaviors(hero) {
    let force = createVector(0, 0);

    const d = p5.Vector.dist(this.pos, hero.pos);

    // Mode aimant (magnétique)
    if (d < this.detectionRadius || this.autoCollect) {
      // Effet ARRIVAL custom stylé : accélération progressive
      let direction = p5.Vector.sub(hero.pos, this.pos);
      let speedBoost = map(d, this.detectionRadius, 0, 0.1, 2.5); // + boost quand proche
      direction.setMag(this.maxSpeed * speedBoost);

      let steer = p5.Vector.sub(direction, this.vel);
      steer.limit(this.maxForce * 2); // double force d'arrivée
      force.add(steer);
    }

    this.applyForce(force);
  }

  update(hero) {
    this.applyBehaviors(hero);
    super.update();

    // ajouter la position pour l’effet TRAIL stylé
    this.trail.push(this.pos.copy());
    if (this.trail.length > 15) {
      this.trail.shift();
    }
  }

  show() {
    // ---- Effet TRAIL stylé ----
    push();
    noStroke();
    for (let i = 0; i < this.trail.length; i++) {
      let p = this.trail[i];
      let alpha = map(i, 0, this.trail.length - 1, 20, 180);
      fill(0, 200, 255, alpha);
      circle(p.x, p.y, map(i, 0, this.trail.length - 1, 2, this.r * 1.5));
    }
    pop();

    // ---- GEM ----
    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * 0.15); // rotation plus rapide
    fill(0, 220, 255);
    stroke(255);
    strokeWeight(2);

    beginShape();
    vertex(0, -this.r);
    vertex(this.r, 0);
    vertex(0, this.r);
    vertex(-this.r, 0);
    endShape(CLOSE);

    pop();
  }
}
