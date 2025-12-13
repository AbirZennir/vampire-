// Héros contrôlé par la souris, qui tire automatiquement
class Hero extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.detectionRadius = 220;
    this.fireDelay = 25;
    this.fireCooldown = 0;
    this.health = 100;
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
    if (this.fireCooldown > 0) {
      this.fireCooldown--;
      return;
    }
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

  show() {
    super.show(color(0, 255, 255)); // cyan
  }
}
