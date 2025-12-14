// =======================
//        missile.js
// =======================
// Un Missile est un petit Vehicle :
// - cherche (seek) une cible précise
// - peut éviter légèrement les obstacles
// - a une durée de vie limitée
// - peut venir du héros ou d'un monstre

class Missile extends Vehicle {

  constructor(x, y, target, isFromHero) {
    super(x, y);                 // initialise position / vitesse / accélération

    this.target = target;        // cible à poursuivre
    this.isFromHero = isFromHero; // true = tir du héros, false = tir du monstre

    this.maxSpeed = 6;           // vitesse maximale
    this.maxForce = 0.4;         // force maximale appliquée
    this.r = 4;                  // rayon 

    this.life = 120;             // durée de vie 
  }

  // Comportements du missile : seek + léger avoid
  applyBehaviors(obstacles) {

    // si la cible n'existe plus, rien à faire
    if (!this.target) return;

    // force de poursuite vers la cible (seek)
    let seekTarget = this.seek(this.target.pos);
    seekTarget.mult(1.5);        // renforce la poursuite
    this.applyForce(seekTarget);

    // évitement léger des obstacles 
    let avoidForce = this.avoid(obstacles);
    this.applyForce(avoidForce);
  }

  update() {
    // applique les comportements à chaque frame
    this.applyBehaviors(obstacles); // obstacles global 

    super.update();               // intégration physique 
    this.life--;                  // décrémente la durée de vie
  }

  // vérifie si le missile doit être supprimé
  isDead() {
    return this.life <= 0;
  }

  // Affichage visuel du missile
  show() {
    push();
    translate(this.pos.x, this.pos.y);

    // orientation selon la vitesse
    rotate(this.vel.heading());

    // couleur selon l'origine du tir
    if (this.isFromHero) {
      fill(0, 255, 0);           // vert = tir du héros
    } else {
      fill(255, 150, 0);         // orange = tir du monstre
    }

    noStroke();
    rectMode(CENTER);
    rect(0, 0, 8, 3);            // forme simple et lisible
    pop();
  }
}
