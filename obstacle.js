// Obstacles circulaires
class Obstacle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
  }

  show() {
    push();
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    circle(this.pos.x, this.pos.y, this.r * 2);
    pop();
  }
}
