// =======================
//       obstacle.js
// =======================
// Un Obstacle est un objet statique :
// - ne bouge pas
// - est évité par les Vehicles 
// - sert de contrainte dans l’environnement

class Obstacle {

  constructor(x, y, r) {
    this.pos = createVector(x, y); // position de l'obstacle
    this.r = r;                    // rayon 

    // variable d’animation 
    this.spawnT = 0;
  }

  // Affichage de l'obstacle 
  show() {

    // animation progressive à l’apparition
    this.spawnT = min(this.spawnT + 0.08, 1);

    push();
    translate(this.pos.x, this.pos.y);
    imageMode(CENTER);

    // scale + transparence pour effet d’apparition
    let s = this.r * 2 * (0.85 + 0.15 * this.spawnT);
    tint(255, 255 * this.spawnT);
    image(obstacleImg, 0, 0, s, s);
    noTint();

    pop();
  }
}
