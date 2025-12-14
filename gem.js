// =======================
//         gem.js
// =======================
// Une Gem est un Vehicle spécial :
// - apparaît quand un monstre meurt
// - peut être attirée par le héros 
// - augmente la vie et le score quand elle est collectée

class Gem extends Vehicle {
  constructor(x, y) {
    super(x, y); // initialise position, vitesse, accélération (Vehicle)

    this.maxSpeed = 6;        // vitesse max de déplacement
    this.maxForce = 0.35;     // force maximale appliquée
    this.r = 7;               // rayon (collision + dessin)

    this.detectionRadius = 180; // distance d’activation de l’effet aimant
    this.autoCollect = false;   // true => va directement vers le héros

    this.trail = []; // positions précédentes pour l’effet visuel
  }

  // Comportement principal : attraction vers le héros (arrival)
  applyBehaviors(hero) {
    let force = createVector(0, 0); // force totale appliquée à la gem

    const d = p5.Vector.dist(this.pos, hero.pos); // distance gem ↔ héros

    // Si le héros est proche OU autoCollect activé
    if (d < this.detectionRadius || this.autoCollect) {

      // Direction vers le héros
      let direction = p5.Vector.sub(hero.pos, this.pos);

      // Variation progressive de la vitesse (arrival)
      let speedBoost = map(d, this.detectionRadius, 0, 0.1, 2.5);
      direction.setMag(this.maxSpeed * speedBoost);

      // Steering = direction désirée - vitesse actuelle
      let steer = p5.Vector.sub(direction, this.vel);
      steer.limit(this.maxForce * 2); // arrivée plus dynamique

      force.add(steer);
    }

    // Application finale de la force (Vehicle)
    this.applyForce(force);
  }

  update(hero) {
    this.applyBehaviors(hero); // attraction vers le héros
    super.update();            // intégration vitesse + position

    // Sauvegarde des positions pour la traînée visuelle
    this.trail.push(this.pos.copy());
    if (this.trail.length > 15) this.trail.shift();
  }

  show() {
    //  Traînée lumineuse 
    push();
    noStroke();
    for (let i = 0; i < this.trail.length; i++) {
      let p = this.trail[i];
      let alpha = map(i, 0, this.trail.length - 1, 20, 180);
      fill(0, 200, 255, alpha);
      circle(p.x, p.y, map(i, 0, this.trail.length - 1, 2, this.r * 1.5));
    }
    pop();

    //  Dessin de la gem 
    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * 0.15); // rotation continue
    fill(0, 220, 255);
    stroke(255);
    strokeWeight(2);

    // Forme losange
    beginShape();
    vertex(0, -this.r);
    vertex(this.r, 0);
    vertex(0, this.r);
    vertex(-this.r, 0);
    endShape(CLOSE);

    pop();
  }
}
