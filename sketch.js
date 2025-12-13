// =======================
//      sketch.js
// =======================

let hero;
let monsters = [];
let missiles = [];
let obstacles = [];
let gems = [];        // 👈 nouveau tableau

// slider pour le nombre de monstres
let monsterSlider;

let score = 0;
let gameOver = false;
let gameWin = false;

function setup() {
  createCanvas(800, 800);

  hero = new Hero(width / 2, height / 2);

  // slider : nombre de monstres (0 → 20, valeur initiale 6)
  monsterSlider = createSlider(0, 20, 6, 1);
  monsterSlider.position(10, 70);
  monsterSlider.style("width", "150px");

  for (let i = 0; i < monsterSlider.value(); i++) {
    addMonsterRandom();
  }

  obstacles.push(new Obstacle(200, 200, 40));
  obstacles.push(new Obstacle(600, 250, 60));
  obstacles.push(new Obstacle(300, 550, 50));
  obstacles.push(new Obstacle(550, 600, 35));
}

// ajoute un monstre à une position aléatoire
function addMonsterRandom() {
  let x = random(width);
  let y = random(height);
  monsters.push(new Monster(x, y));
}

function draw() {
  background(20);

  adjustMonstersWithSlider();

  if (gameOver || gameWin) {
    drawEndScreen();
    return;
  }

  // Obstacles
  for (let o of obstacles) {
    o.show();
  }

  // HERO
  hero.applyBehaviors(monsters, obstacles);
  hero.update();
  hero.keepInside();
  hero.resolveObstacleCollisions(obstacles);
  hero.show();

  // GEMS (avant les monstres ou après, peu importe tant qu'on update)
  for (let i = gems.length - 1; i >= 0; i--) {
    let g = gems[i];
    g.update(hero);
    g.keepInside();
    g.resolveObstacleCollisions(obstacles);
    g.show();

    // collision gem ↔ héros -> heal + score
    if (g.collidesWith(hero)) {
      hero.health = min(hero.health + 20, 100); // heal max 100
      score += 5;                               // bonus score
      gems.splice(i, 1);
    }
  }

  // MONSTRES
  for (let i = monsters.length - 1; i >= 0; i--) {
    let m = monsters[i];

    m.applyBehaviors(hero, obstacles, monsters);
    m.update();
    m.keepInside();
    m.resolveObstacleCollisions(obstacles);
    m.show();

    if (m.collidesWith(hero)) {
      hero.health -= 0.3;
      if (hero.health <= 0) {
        gameOver = true;
      }
    }
  }

  // MISSILES
  for (let i = missiles.length - 1; i >= 0; i--) {
    let miss = missiles[i];

    miss.update();
    miss.keepInside();
    miss.show();

    // 1) missile touche un obstacle → il s'arrête
    let hitObstacle = false;
    for (let o of obstacles) {
      if (miss.collidesWith(o)) {
        hitObstacle = true;
        break;
      }
    }
    if (hitObstacle) {
      missiles.splice(i, 1);
      continue;
    }

    // 2) durée de vie écoulée
    if (miss.isDead()) {
      missiles.splice(i, 1);
      continue;
    }

    // 3) collisions missile ↔ monstres / héros
    if (miss.isFromHero) {
      // missile du héros touche un monstre
      for (let j = monsters.length - 1; j >= 0; j--) {
        let m = monsters[j];
        if (miss.collidesWith(m)) {
          // 🔷 création de la gem à la position du monstre
          let gem = new Gem(m.pos.x, m.pos.y);
          gem.autoCollect = true;   // la gem vient direct vers le héros
          gems.push(gem);

          monsters.splice(j, 1);
          missiles.splice(i, 1);
          score += 10;
          break;
        }
      }
    } else {
      // missile d'un monstre touche le héros
      if (miss.collidesWith(hero)) {
        hero.health -= 10;
        missiles.splice(i, 1);
        if (hero.health <= 0) {
          gameOver = true;
        }
      }
    }
  }

  // victoire si plus de monstres et slider à 0
  if (monsters.length === 0 && monsterSlider.value() === 0) {
    gameWin = true;
  }

  drawHUD();
}

function adjustMonstersWithSlider() {
  const desired = monsterSlider.value();

  while (monsters.length < desired) {
    addMonsterRandom();
  }
  while (monsters.length > desired) {
    monsters.pop();
  }
}

function drawHUD() {
  push();
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score : " + score, 10, 10);
  text("Vie héro : " + hero.health.toFixed(0), 10, 30);
  text("Monstres restants : " + monsters.length, 10, 50);
  text("Nb monstres (slider) :", 10, 90);
  pop();
}

function drawEndScreen() {
  background(20, 20, 20, 230);
  drawHUD();

  push();
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  if (gameWin) {
    text("🏆 YOU WIN !", width / 2, height / 2);
  } else {
    text("💀 GAME OVER", width / 2, height / 2);
  }
  textSize(16);
  text("Appuie sur 'r' pour recommencer", width / 2, height / 2 + 40);
  pop();
}

function keyPressed() {
  if (key === "r" || key === "R") {
    resetGame();
  }
}

// CLIC : ajouter un obstacle
function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    let r = random(25, 60);
    obstacles.push(new Obstacle(mouseX, mouseY, r));
  }
}

function resetGame() {
  score = 0;
  gameOver = false;
  gameWin = false;

  hero = new Hero(width / 2, height / 2);
  monsters = [];
  missiles = [];
  obstacles = [];
  gems = [];

  obstacles.push(new Obstacle(200, 200, 40));
  obstacles.push(new Obstacle(600, 250, 60));
  obstacles.push(new Obstacle(300, 550, 50));
  obstacles.push(new Obstacle(550, 600, 35));

  for (let i = 0; i < monsterSlider.value(); i++) {
    addMonsterRandom();
  }
}
