// Classe de base Vehicle utilisée par Hero, Monster et Missile
class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);

    this.maxSpeed = 3;
    this.maxForce = 0.15;

    this.r = 12; // rayon pour dessin + collisions
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  // Aller vers une cible
  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  // Arriver doucement
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

  // Éviter les obstacles à l’avance avec un vecteur "ahead"
  avoid(obstacles) {
    let steer = createVector(0, 0);
    if (this.vel.magSq() === 0 || obstacles.length === 0) return steer;

    let ahead = this.vel.copy().normalize().mult(60); // distance de look-ahead
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

  // Séparation simple entre véhicules
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

  // Rester dans l'écran (clamp simple)
  keepInside() {
    if (this.pos.x < this.r) this.pos.x = this.r;
    if (this.pos.x > width - this.r) this.pos.x = width - this.r;
    if (this.pos.y < this.r) this.pos.y = this.r;
    if (this.pos.y > height - this.r) this.pos.y = height - this.r;
  }

  // Correction si on entre dans un obstacle
  resolveObstacleCollisions(obstacles) {
    for (let o of obstacles) {
      let dir = p5.Vector.sub(this.pos, o.pos);
      let dist = dir.mag();
      let minDist = this.r + o.r;
      if (dist < minDist) {
        if (dist === 0) {
          dir = p5.Vector.random2D();
        } else {
          dir.normalize();
        }
        dir.mult(minDist);
        this.pos = p5.Vector.add(o.pos, dir);
        this.vel.mult(0.5); // on ralentit un peu
      }
    }
  }

  collidesWith(other) {
    return p5.Vector.dist(this.pos, other.pos) < this.r + other.r;
  }

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
