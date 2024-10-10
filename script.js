const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


// Canvas dimensions
canvas.width = window.innerWidth > 600 ? 600 : window.innerWidth;
canvas.height = window.innerHeight > 400 ? 400 : window.innerHeight;


// Character properties
let character = {
  x: 100,
  y: canvas.height - 30,
  width: 20,
  height: 20,
  color: 'black',
  dy: 0, // vertical movement speed
  gravity: 0.5,
  jumpPower: -8,
  isJumping: false,
  hasWings: false // state when hit by obstacle
};


// Obstacles and game speed
let obstacles = [];
let gameSpeed = 2;
let frameCount = 0;


// Touch controls for mobile
let touchStartX = null;


// Initialize game
function startGame() {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchend', handleTouchEnd);
  requestAnimationFrame(updateGame);
}


// Handle keyboard input
function handleKeyDown(e) {
  if (e.code === 'ArrowUp' && !character.isJumping) {
    character.dy = character.jumpPower;
    character.isJumping = true;
  }
}


function handleKeyUp(e) {
  if (e.code === 'ArrowUp') {
    character.isJumping = false;
  }
}


function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  if (!character.isJumping) {
    character.dy = character.jumpPower;
    character.isJumping = true;
  }
}


function handleTouchEnd(e) {
  touchStartX = null;
  character.isJumping = false;
}


// Update game state
function updateGame() {
  frameCount++;
  clearCanvas();
  drawCharacter();
  updateCharacter();
  handleObstacles();
  if (frameCount % 100 === 0) {
    createObstacle();
  }
  requestAnimationFrame(updateGame);
}


function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function drawCharacter() {
  ctx.fillStyle = character.color;
  ctx.fillRect(character.x, character.y, character.width, character.height);
}


function updateCharacter() {
  // Gravity effect
  if (!character.hasWings) {
    character.dy += character.gravity;
    character.y += character.dy;
    if (character.y > canvas.height - character.height) {
      character.y = canvas.height - character.height;
      character.dy = 0;
    }
  } else {
    // If character has wings (flying mode)
    if (character.y < 0) {
      character.y = 0;
    }
  }
}


// Create obstacles
function createObstacle() {
  const size = Math.random() * 20 + 10;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - size,
    width: size,
    height: size,
    color: 'black'
  });
}


function handleObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    obs.x -= gameSpeed;
    drawObstacle(obs);


    // Check collision
    if (
      character.x < obs.x + obs.width &&
      character.x + character.width > obs.x &&
      character.y < obs.y + obs.height &&
      character.y + character.height > obs.y
    ) {
      if (!character.hasWings) {
        character.hasWings = true;
        character.gravity = -0.2; // change gravity while flying
      } else {
        // Reset if hit while flying
        character.hasWings = false;
        character.gravity = 0.5;
      }
    }


    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
      i--;
    }
  }
}


function drawObstacle(obs) {
  ctx.fillStyle = obs.color;
  ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
}


// Start the game
startGame();