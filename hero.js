// =======================
//         hero.js
// =======================
// Le Hero est un Vehicle spécial :
// - se déplace avec un comportement arrival vers la souris
// - évite les obstacles
// - détecte les monstres proches
// - tire automatiquement 

// Hérite de Vehicle (position, vitesse, forces)
class Hero extends Vehicle {

  constructor(x, y) {
    super(x, y);          // initialise le Vehicle
    this.health = 100;    // points de vie du héros

    this.detectionRadius = 220; // distance de détection des monstres
    this.fireDelay = 25;         // délai entre deux tirs
    this.fireCooldown = 0;       // timer de tir
  }

  // Trouve le monstre le plus proche 
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

  // Tir automatique vers le monstre le plus proche
  autoShoot(monsters) {

    // gestion du cooldown
    if (this.fireCooldown > 0) {
      this.fireCooldown--;
      return;
    }

    let target = this.closestMonster(monsters);
    if (!target) return;

    // distance héros ↔ monstre
    let d = p5.Vector.dist(this.pos, target.pos);
    if (d > this.detectionRadius) return;

    // création d'un missile orienté vers la cible
    missiles.push(new Missile(this.pos.x, this.pos.y, target, true));

    // réinitialise le cooldown
    this.fireCooldown = this.fireDelay;
  }

  // Comportements principaux du héros
  applyBehaviors(monsters, obstacles) {

    // arrival vers la souris
    let mouse = createVector(mouseX, mouseY);
    let arriveForce = this.arrive(mouse);
    this.applyForce(arriveForce);

    // évitement des obstacles (force renforcée)
    let avoidForce = this.avoid(obstacles);
    avoidForce.mult(2.0);
    this.applyForce(avoidForce);

    // tir automatique
    this.autoShoot(monsters);
  }

  // Affichage visuel du héros 
  show() {
    push();
    translate(this.pos.x, this.pos.y);

    // rotation dans la direction du mouvement
    if (this.vel.magSq() > 0.0001) {
      rotate(this.vel.heading());
    }

    // léger effet de pulsation
    let pulse = 1 + 0.03 * sin(frameCount * 0.12);

    imageMode(CENTER);
    smooth();
    let s = this.r * 3.6 * pulse;
    image(heroImg, 0, 0, s, s);

    pop();
  }
}
