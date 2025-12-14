class Hero extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.health = 100;
    this.detectionRadius = 220;
    this.fireDelay = 25;
    this.fireCooldown = 0;
  }

  closestMonster(monsters) {
    let best = null;
    let bestDistSq = Infinity;
    for (let m of monsters) {
      let d2 = p5.Vector.sub(this.pos, m.pos).magSq();
      if (d2 < bestDistSq) {
        bestDistSq = d2;
        best = m;
      }
    }
    return best;
  }

  autoShoot(monsters) {
    if (this.fireCooldown > 0) { this.fireCooldown--; return; }
    let target = this.closestMonster(monsters);
    if (!target) return;

    let d = p5.Vector.dist(this.pos, target.pos);
    if (d > this.detectionRadius) return;

    missiles.push(new Missile(this.pos.x, this.pos.y, target, true));
    this.fireCooldown = this.fireDelay;
  }

  applyBehaviors(monsters, obstacles) {
    let mouse = createVector(mouseX, mouseY);
    let arriveForce = this.arrive(mouse);
    this.applyForce(arriveForce);

    let avoidForce = this.avoid(obstacles);
    avoidForce.mult(2.0);
    this.applyForce(avoidForce);

    this.autoShoot(monsters);
  }

  // ✅ DESIGN ONLY
  show() {
    push();
    translate(this.pos.x, this.pos.y);

    // rotation douce vers la direction (sans changer la logique)
    if (this.vel.magSq() > 0.0001) rotate(this.vel.heading());

    // petit pulse discret
    let pulse = 1 + 0.03 * sin(frameCount * 0.12);

    imageMode(CENTER);
    noSmooth();
    smooth(); // garde la qualité
    let s = this.r * 3.6 * pulse;
    image(heroImg, 0, 0, s, s);

    pop();
  }
}
