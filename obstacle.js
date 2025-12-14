class Obstacle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;

    // ✅ DESIGN ONLY: petite animation d'apparition
    this.spawnT = 0;
  }

  show() {
    this.spawnT = min(this.spawnT + 0.08, 1);

    push();
    translate(this.pos.x, this.pos.y);
    imageMode(CENTER);

    // apparition douce (scale + alpha)
    let s = this.r * 2 * (0.85 + 0.15 * this.spawnT);
    tint(255, 255 * this.spawnT);
    image(obstacleImg, 0, 0, s, s);
    noTint();

    pop();
  }
}
