class Monster extends Vehicle {
  constructor(x, y) {
    super(x, y);

    this.maxSpeed = 3.2;
    this.maxForce = 0.25;
    this.r = 14;

    this.health = 20;
    this.detectionRadius = 200;
    this.fireDelay = 50;
    this.fireCooldown = 0;
  }

  autoShoot(hero) {
    if (this.fireCooldown > 0) { this.fireCooldown--; return; }
    let d = p5.Vector.dist(this.pos, hero.pos);
    if (d > this.detectionRadius) return;
    missiles.push(new Missile(this.pos.x, this.pos.y, hero, false));
    this.fireCooldown = this.fireDelay;
  }

  applyBehaviors(hero, obstacles, monsters) {
    let seekForce = this.arrive(hero.pos);
    let avoidForce = this.avoid(obstacles);
    let separateForce = this.separate(monsters);

    seekForce.mult(1.0);
    avoidForce.mult(2.0);
    separateForce.mult(1.2);

    this.applyForce(seekForce);
    this.applyForce(avoidForce);
    this.applyForce(separateForce);

    this.autoShoot(hero);
  }

  // ✅ DESIGN ONLY
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.vel.magSq() > 0.0001) rotate(this.vel.heading());

    let pulse = 1 + 0.02 * sin(frameCount * 0.10);

    imageMode(CENTER);
    let s = this.r * 3.6 * pulse;
    image(monsterImg, 0, 0, s, s);

    pop();
  }
}
