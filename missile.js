// Missile = petit véhicule qui SEEK sa cible
class Missile extends Vehicle {
  constructor(x, y, target, isFromHero) {
    super(x, y);
    this.target = target;
    this.isFromHero = isFromHero;

    this.maxSpeed = 6;
    this.maxForce = 0.4;
    this.r = 4;

    this.life = 120; // frames
  }

  applyBehaviors(obstacles) {
    if (!this.target) return;

    // seek la cible
    let seekTarget = this.seek(this.target.pos);
    seekTarget.mult(1.5);
    this.applyForce(seekTarget);

    // éviter un peu les obstacles (facultatif mais cohérent)
    let avoidForce = this.avoid(obstacles);
    this.applyForce(avoidForce);
  }

  update() {
    this.applyBehaviors(obstacles); // obstacles est global
    super.update();
    this.life--;
  }

  isDead() {
    return this.life <= 0;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    if (this.isFromHero) {
      fill(0, 255, 0);      // vert = tir du héros
    } else {
      fill(255, 150, 0);    // orange = tir des monstres
    }
    noStroke();
    rectMode(CENTER);
    rect(0, 0, 8, 3);
    pop();
  }
}
