// =======================
//      sketch.js
// =======================

let hero;
let monsters = [];
let missiles = [];
let obstacles = [];
let gems = [];

// sprites preload
let heroImg, monsterImg, obstacleImg;

// slider pour le nombre de monstres
let monsterSlider;

let score = 0;
let gameOver = false;
let gameWin = false;

function preload() {
  heroImg = loadImage("assets/hero.png");
  monsterImg = loadImage("assets/monster.png");
  obstacleImg = loadImage("assets/obstacle.png");
}

function setup() {
  createCanvas(800, 800);

  hero = new Hero(width / 2, height / 2);

  // ✅ Slider à gauche + style
  monsterSlider = createSlider(0, 20, 6, 1);
  monsterSlider.id("monsterSlider");
  monsterSlider.position(26, 62);
  monsterSlider.style("width", "240px");
  applyModernSliderStyle(monsterSlider);

  // init monsters
  for (let i = 0; i < monsterSlider.value(); i++) addMonsterRandom();

  // init obstacles
  obstacles.push(new Obstacle(200, 200, 40));
  obstacles.push(new Obstacle(600, 250, 60));
  obstacles.push(new Obstacle(300, 550, 50));
  obstacles.push(new Obstacle(550, 600, 35));
}

// ajoute un monstre à une position aléatoire
function addMonsterRandom() {
  monsters.push(new Monster(random(width), random(height)));
}

function draw() {
  // fond moderne léger
  background(14, 16, 26);
  noStroke();
  fill(10, 12, 20, 120);
  rect(0, 0, width, height);

  adjustMonstersWithSlider();

  if (gameOver || gameWin) {
    drawEndScreen();
    return;
  }

  // Obstacles
  for (let o of obstacles) o.show();

  // HERO
  hero.applyBehaviors(monsters, obstacles);
  hero.update();
  hero.keepInside();
  hero.resolveObstacleCollisions(obstacles);
  hero.show();

  // GEMS
  for (let i = gems.length - 1; i >= 0; i--) {
    let g = gems[i];
    g.update(hero);
    g.keepInside();
    g.resolveObstacleCollisions(obstacles);
    g.show();

    // collision gem ↔ héros -> heal + score
    if (g.collidesWith(hero)) {
      hero.health = min(hero.health + 20, 100);
      score += 5;
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
      if (hero.health <= 0) gameOver = true;
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
      for (let j = monsters.length - 1; j >= 0; j--) {
        let m = monsters[j];
        if (miss.collidesWith(m)) {
          // création gem à la position du monstre
          let gem = new Gem(m.pos.x, m.pos.y);
          gem.autoCollect = true;
          gems.push(gem);

          monsters.splice(j, 1);
          missiles.splice(i, 1);
          score += 10;
          break;
        }
      }
    } else {
      if (miss.collidesWith(hero)) {
        hero.health -= 10;
        missiles.splice(i, 1);
        if (hero.health <= 0) gameOver = true;
      }
    }
  }

  // victoire si plus de monstres et slider à 0
  if (monsters.length === 0 && monsterSlider.value() === 0) gameWin = true;

  drawHUD();
}

function adjustMonstersWithSlider() {
  const desired = monsterSlider.value();
  while (monsters.length < desired) addMonsterRandom();
  while (monsters.length > desired) monsters.pop();
}

// ✅ HUD: card centrée + slider + "comment jouer" sous le slider (à gauche)
function drawHUD() {
  push();

  // ---- Label slider
  fill(255, 255, 255, 190);
  textSize(13);
  textAlign(LEFT, TOP);
  text("Nb monstres", 26, 38);

  // ---- Card centrée (score/vie)
  const cardW = 300;
  const cardH = 92;
  const cardX = width / 2 - cardW / 2;
  const cardY = 14;

  noStroke();
  fill(0, 0, 0, 125);
  rect(cardX, cardY, cardW, cardH, 14);

  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text("Score : " + score, cardX + 16, cardY + 14);
  text("Monstres : " + monsters.length, cardX + 16, cardY + 34);

  // barre de vie
  let hp = constrain(hero.health, 0, 100);
  fill(255, 255, 255, 70);
  rect(cardX + 16, cardY + 58, cardW - 32, 12, 10);

  fill(80, 220, 120);
  rect(cardX + 16, cardY + 58, (cardW - 32) * (hp / 100), 12, 10);

  fill(255, 255, 255, 180);
  text("Vie : " + hp.toFixed(0), cardX + 16, cardY + 74);

  // ---- ✅ COMMENT JOUER (VRAIMENT sous le slider, même colonne)
  const helpW = 240;  // même largeur que slider
  const helpH = 120;
  const helpX = 26;   // même X que slider
  const helpY = 92;   // juste sous le slider (sliderY=62)

  noStroke();
  fill(0, 0, 0, 110);
  rect(helpX, helpY, helpW, helpH, 14);

  fill(255, 255, 255, 210);
  textSize(13);
  text("Comment jouer", helpX + 12, helpY + 12);

  fill(255, 255, 255, 170);
  textSize(12);
  text("• Déplace le héros : souris", helpX + 12, helpY + 34);
  text("• Le héros tire automatiquement", helpX + 12, helpY + 50);
  text("• Clic : ajouter un obstacle", helpX + 12, helpY + 66);
  text("• Slider : nb de monstres", helpX + 12, helpY + 82);
  text("• R : recommencer", helpX + 12, helpY + 98);

  pop();
}

function drawEndScreen() {
  background(0, 0, 0, 190);
  drawHUD();

  push();
  textAlign(CENTER, CENTER);
  textSize(34);
  fill(255);
  text(gameWin ? "🏆 YOU WIN !" : "💀 GAME OVER", width / 2, height / 2 - 10);

  textSize(15);
  fill(255, 255, 255, 190);
  text("Appuie sur 'r' pour recommencer", width / 2, height / 2 + 30);

  textSize(12);
  fill(255, 255, 255, 140);
  text("Souris = bouger | Clic = obstacle | Slider = monstres | R = restart", width / 2, height / 2 + 55);
  pop();
}

function keyPressed() {
  if (key === "r" || key === "R") resetGame();
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

  for (let i = 0; i < monsterSlider.value(); i++) addMonsterRandom();
}

// ✅ style slider moderne
function applyModernSliderStyle(sl) {
  sl.style("appearance", "none");
  sl.style("-webkit-appearance", "none");
  sl.style("height", "8px");
  sl.style("border-radius", "999px");
  sl.style("background", "rgba(255,255,255,0.18)");
  sl.style("outline", "none");

  const style = document.createElement("style");
  style.innerHTML = `
    #monsterSlider::-webkit-slider-thumb{
      -webkit-appearance:none;
      appearance:none;
      width:18px;height:18px;border-radius:50%;
      background:#38bdf8;
      border:2px solid rgba(255,255,255,0.9);
      box-shadow:0 0 18px rgba(56,189,248,0.55);
      cursor:pointer;
      transition:transform 0.15s ease;
    }
    #monsterSlider::-webkit-slider-thumb:hover{ transform:scale(1.08); }

    #monsterSlider::-moz-range-thumb{
      width:18px;height:18px;border-radius:50%;
      background:#38bdf8;
      border:2px solid rgba(255,255,255,0.9);
      box-shadow:0 0 18px rgba(56,189,248,0.55);
      cursor:pointer;
    }
  `;
  document.head.appendChild(style);
}
