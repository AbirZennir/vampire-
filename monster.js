// =======================
//        monster.js
// =======================
// Un Monster est un Vehicle hostile :
// - se dirige vers le héros (arrival)
// - évite les obstacles
// - se sépare des autres monstres
// - tire automatiquement vers le héros

class Monster extends Vehicle {

  constructor(x, y) {
    super(x, y); // initialise position, vitesse, accélération

    this.maxSpeed = 3.2;     // vitesse maximale du monstre
    this.maxForce = 0.25;    // force maximale appliquée
    this.r = 14;             // rayon 

    this.health = 20;        // points de vie
    this.detectionRadius = 200; // distance de tir
    this.fireDelay = 50;        // délai entre tirs
    this.fireCooldown = 0;      // timer de tir
  }

  // Tir automatique vers le héros 
  autoShoot(hero) {

    // gestion du cooldown
    if (this.fireCooldown > 0) {
      this.fireCooldown--;
      return;
    }

    // distance monstre ↔ héros
    let d = p5.Vector.dist(this.pos, hero.pos);
    if (d > this.detectionRadius) return;

    // création d'un missile dirigé vers le héros
    missiles.push(new Missile(this.pos.x, this.pos.y, hero, false));

    // réinitialisation du cooldown
    this.fireCooldown = this.fireDelay;
  }

  // Comportements principaux du monstre
  applyBehaviors(hero, obstacles, monsters) {

    // arrivée vers le héros
    let seekForce = this.arrive(hero.pos);

    // évitement des obstacles
    let avoidForce = this.avoid(obstacles);

    // séparation entre monstres (boids)
    let separateForce = this.separate(monsters);

    // pondération des forces
    seekForce.mult(1.0);
    avoidForce.mult(2.0);
    separateForce.mult(1.2);

    // application des forces
    this.applyForce(seekForce);
    this.applyForce(avoidForce);
    this.applyForce(separateForce);

    // tir automatique
    this.autoShoot(hero);
  }

  // Affichage visuel du monstre 
  show() {
    push();
    translate(this.pos.x, this.pos.y);

    // orientation selon la vitesse
    if (this.vel.magSq() > 0.0001) {
      rotate(this.vel.heading());
    }

    // léger effet de pulsation
    let pulse = 1 + 0.02 * sin(frameCount * 0.10);

    imageMode(CENTER);
    let s = this.r * 3.6 * pulse;
    image(monsterImg, 0, 0, s, s);

    pop();
  }
}
