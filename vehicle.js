// =======================
//        vehicle.js
// =======================
// Classe de base Vehicle :
// - utilisée par Hero, Monster, Missile et Gem
// - gère le mouvement par forces (steering behaviors)
// - fournit seek, arrive, avoid, separate

class Vehicle {

  constructor(x, y) {
    this.pos = createVector(x, y);       // position
    this.vel = p5.Vector.random2D();     // vitesse initiale
    this.acc = createVector(0, 0);       // accélération (forces accumulées)

    this.maxSpeed = 3;                   // vitesse maximale
    this.maxForce = 0.15;                // force maximale

    this.r = 12;                         // rayon (collision + dessin)
  }

  // Ajoute une force à l’accélération
  applyForce(force) {
    this.acc.add(force);
  }

  // Intégration physique (Euler)
  update() {
    this.vel.add(this.acc);              // vitesse += accélération
    this.vel.limit(this.maxSpeed);       // limite de vitesse
    this.pos.add(this.vel);              // position += vitesse
    this.acc.mult(0);                    // reset des forces
  }

  // Comportement seek : aller vers une cible
  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  // Comportement arrive : ralentir à l’approche
  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();

    if (d < 100) {
      let m = map(d, 0, 100, 0, this.maxSpeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxSpeed);
    }

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  // Évitement d’obstacles par anticipation (look-ahead)
  avoid(obstacles) {
    let steer = createVector(0, 0);
    if (this.vel.magSq() === 0 || obstacles.length === 0) return steer;

    // vecteur regard vers l’avant
    let ahead = this.vel.copy().normalize().mult(60);
    let aheadPos = p5.Vector.add(this.pos, ahead);

    let mostThreatening = null;
    let minDist = Infinity;

    for (let o of obstacles) {
      let d = p5.Vector.dist(aheadPos, o.pos);
      if (d < o.r + this.r && d < minDist) {
        minDist = d;
        mostThreatening = o;
      }
    }

    if (mostThreatening) {
      let avoidance = p5.Vector.sub(aheadPos, mostThreatening.pos);
      avoidance.setMag(this.maxForce * 3);
      steer.add(avoidance);
    }

    return steer;
  }

  // Séparation (boids) : éviter les voisins trop proches
  separate(others) {
    let desiredSeparation = this.r * 2;
    let steer = createVector(0, 0);
    let count = 0;

    for (let other of others) {
      if (other === this) continue;
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count);
      steer.setMag(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce * 2);
    }

    return steer;
  }

  // Empêche de sortir de l’écran
  keepInside() {
    if (this.pos.x < this.r) this.pos.x = this.r;
    if (this.pos.x > width - this.r) this.pos.x = width - this.r;
    if (this.pos.y < this.r) this.pos.y = this.r;
    if (this.pos.y > height - this.r) this.pos.y = height - this.r;
  }

  // Correction si un véhicule entre dans un obstacle
  resolveObstacleCollisions(obstacles) {
    for (let o of obstacles) {
      let dir = p5.Vector.sub(this.pos, o.pos);
      let dist = dir.mag();
      let minDist = this.r + o.r;

      if (dist < minDist) {
        if (dist === 0) dir = p5.Vector.random2D();
        else dir.normalize();

        dir.mult(minDist);
        this.pos = p5.Vector.add(o.pos, dir);
        this.vel.mult(0.5); // ralentissement après collision
      }
    }
  }

  // Collision simple par distance
  collidesWith(other) {
    return p5.Vector.dist(this.pos, other.pos) < this.r + other.r;
  }

  // Dessin générique (debug / fallback)
  show(colorFill = 255) {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    fill(colorFill);
    stroke(0);
    strokeWeight(1);
    beginShape();
    vertex(this.r, 0);
    vertex(-this.r, this.r / 2);
    vertex(-this.r, -this.r / 2);
    endShape(CLOSE);
    pop();
  }
}
