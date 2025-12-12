// Monstres qui chassent le héros et évitent les obstacles
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
    if (this.fireCooldown > 0) {
      this.fireCooldown--;
      return;
    }
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

  show() {
    super.show(color(255, 80, 80)); // rouge
  }
}
