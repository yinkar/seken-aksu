/*
  You can use mouse to drag and throw the ball
  You can also use WASD or arrow keys and space but I don't recommend it yet
*/

// Global game settings
const game = {
  width: 800,
  height: 600
}

// Empty player object, it will be full in setup() function
let player = {
  position: null,
  speed: null,
  size: null,
  visualSize: null,
  moving: false
};

// Gravity constant
const gravity = 0.9;

// Particles
const dust = [];

let tracking = false;

let previousPosition = null;

let distance = 0;

const positions = [];

function setup() {
  [game.width, game.height] = [windowWidth, windowHeight];
  
  // Create a canvas by using game settings
  createCanvas(game.width, game.height);

  // Set player position by using game setting values
  player.position = createVector(game.width / 2, 15);

  // Set other player vectors
  player.speed = createVector(0, 0);
  player.size = createVector(50, 50);
  player.visualSize = createVector(50, 50);

  previousPosition = createVector(game.width / 2, 15);
}

function draw() {

  // Set canvas background as black
  background(0);

  // Add player speed to player x position
  player.position.x += player.speed.x;

  
  if (mouseX > player.position.x - player.size.x &&
    mouseX < player.position.x + player.size.x &&
    mouseY > player.position.y - player.size.y &&
    mouseY < player.position.y + player.size.y) {
    document.body.style.cursor = 'pointer';
  }
  else {
    document.body.style.cursor = 'default';
  }
  
  // Move player left if is in canvas area
  if (player.position.x - player.size.x / 2 > 0 && (keyIsDown(65) || keyIsDown(LEFT_ARROW))) {
    player.position.x -= 5;
  }

  // Move player right if is in canvas area
  if (player.position.x + player.size.x / 2 + 5 < width && (keyIsDown(68) || keyIsDown(RIGHT_ARROW))) {
    player.position.x += 5;
  }

  // If drag and drop is active move player by mouse
  if (player.moving) {
    if (mouseX > 0 &&
      mouseX < width &&
      mouseY > 0 &&
      mouseY < height) {
      player.position.x = mouseX;
      player.position.y = mouseY;
    }
  } else {

    // If player is in air
    if (player.position.y + player.size.y / 2 + player.speed.y < height) {

      // Add gravity to player's vertical speed
      player.speed.y += gravity;

      // Then add player's vertical speed to player's vertical position
      player.position.y += player.speed.y;

    } else {

      if (player.x === 0 && player.y === 0) {
        tracking = false;
      }

      //If player is on the floor

      // Make slow player's horizontal speed
      player.speed.x *= 0.95;

      // If player is very close to floor and player has a vertical speed, in other words if player is ready to bounce
      if (abs(player.speed.y) > 4) {

        // Reverse and decrease ball's vertical speed, in other words bounce the ball
        player.speed.y *= -0.75;

        // Make dust particle effect with custom function
        generateDust(player.position.x, height, -10, 10, -10, 0);

        // Vertical squeezing effect
        player.visualSize.x *= 1.2;
        player.visualSize.y *= 0.8;

        // Remove squeezing effect after 50 ms
        setTimeout(() => {
          player.visualSize.x = 50;
          player.visualSize.y = 50;
        }, 50);

      } else {
        // If player is not bouncing then make player's vertical speed zero
        player.speed.y = 0;
      }

    }

    // If player hit the ceil
    if (player.position.y + player.speed.y < 0) {

      // Reverse the speed
      player.speed.y *= -1;

      // Make dust particle effect with custom function
      generateDust(player.position.x, 0, -10, 10, 0, 10);
    }

    // If player is in game area horizontally
    if (player.position.x + player.speed.x < 0 ||
      player.position.x + player.speed.x > width) {

      // Make dust particle effect with custom function according to wall direction
      generateDust(
        Math.sign(player.speed.x) < 0 ? 0 : width,
        player.position.y,
        Math.sign(player.speed.x) * -10,
        Math.sign(player.speed.x) * 10,
        -10,
        10
      );

      // Reverse and decrease the horizontal speed
      player.speed.x *= -0.8;

      // Horizontal squeezing effect
      player.visualSize.x *= 0.8;
      player.visualSize.y *= 1.2;

      // Remove squeezing effect after 50 ms
      setTimeout(() => {
        player.visualSize.x = 50;
        player.visualSize.y = 50;
      }, 50);
    }
  }

  // Dust particle effect loop
  dust.forEach(e => {

    // Increase speed
    e.x += e.dx;
    e.y += e.dy;
    
    
    e.dy += gravity * 0.7;

    // Decrease size
    e.size *= 0.95;

    // Fill by particle color
    fill(e.color);
    noStroke();

    // Draw a circle to show particle
    circle(e.x, e.y, e.size);
  });

  if (tracking && !mouseIsPressed) {
    distance += player.position.dist(previousPosition);
  }

  previousPosition = player.position.copy();

  // Fill for ball
  fill(255);

  // Draw an ellipse to player
  ellipse(player.position.x, player.position.y - 2 + abs(player.speed.y / 2), player.visualSize.x, player.visualSize.y);

  // FPS
  let fps = frameRate();
  fill(175);
  stroke(100);
  text(`FPS: ${fps.toFixed(2)}`, 10, 20);

  text(`Distance: ${distance.toFixed(2)}`, 10, 35);
}

function keyPressed() {
  // If space key pressed
  if (key === ' ') {

    // If player is on the floor
    if (player.position.y + player.size.y / 2 + 1 > height) {

      // Set vertical speed suddenly
      player.speed.y = 30;

      // Horizontal squeezing effect
      player.visualSize.x *= 0.7;
      player.visualSize.y *= 1.3;

      // Remove squeezing effect after 50 ms
      setTimeout(() => {
        player.visualSize.x = 50;
        player.visualSize.y = 50;
      }, 100);
    }

  }

}

function mousePressed() {

  // If mouse is pressed on player's position
  if (mouseX > player.position.x - player.size.x &&
    mouseX < player.position.x + player.size.x &&
    mouseY > player.position.y - player.size.y &&
    mouseY < player.position.y + player.size.y) {

    // Set player's drag and drop option true
    player.moving = true;
    
    distance = 0;
  }
}

function mouseReleased() {

  // If mouse button released and player's drag and drop option is true
  if (player.moving) {

    // Set player's speed by the change amount of mouse position. pmouseX means mouseX position of previous frame
    player.speed.x = mouseX - pmouseX;
    player.speed.y = mouseY - pmouseY;

    tracking = true;
  }

  // Set drag and drop option false
  player.moving = false;
}

function touchStarted() {

  // If mouse is pressed on player's position
  if (mouseX > player.position.x - player.size.x &&
    mouseX < player.position.x + player.size.x &&
    mouseY > player.position.y - player.size.y &&
    mouseY < player.position.y + player.size.y) {

    // Set player's drag and drop option true
    player.moving = true;
    
    distance = 0;
  }
}

function touchEnded() {

  // If mouse button released and player's drag and drop option is true
  if (player.moving) {

    // Set player's speed by the change amount of mouse position. pmouseX means mouseX position of previous frame
    player.speed.x = mouseX - pmouseX;
    player.speed.y = mouseY - pmouseY;

    tracking = true;
  }

  // Set drag and drop option false
  player.moving = false;
}

// Dust particle effect function
function generateDust(x, y, dx1, dx2, dy1, dy2) {

  // Set dust amount by player's speed
  let dustAmount = min(75, abs(floor(0.7 * player.speed.y)));

  for (i = 0; i < dustAmount; i++) {
    // Add dust with random values to array to use in game
    dust.push({
      x: x,
      y: y,
      dx: random(dx1, dx2),
      dy: random(dy1, dy2),
      size: random(1, 7),
      color: random(0, 255)
    });

    // Remove particle after a random time
    setTimeout(() => {
      dust.pop();
    }, random(0, 500));
  }
}