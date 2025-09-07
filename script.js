// Standard Pong implementation

const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  dx: 5,
  dy: 5
};

// Paddle
const paddleWidth = 10, paddleHeight = 100;
const player = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0
};
const ai = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 5
};

// Score
let playerScore = 0;
let aiScore = 0;

// Draw functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}
function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = '45px Arial';
  ctx.fillText(text, x, y);
}

function render() {
  // Background
  drawRect(0, 0, canvas.width, canvas.height, "#000");
  // Center line
  for (let i = 0; i < canvas.height; i += 30) {
    drawRect(canvas.width / 2 - 1, i, 2, 20, "#fff");
  }
  // Paddles
  drawRect(player.x, player.y, player.width, player.height, "#fff");
  drawRect(ai.x, ai.y, ai.width, ai.height, "#fff");
  // Ball
  drawCircle(ball.x, ball.y, ball.radius, "#fff");
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = -ball.dx;
  ball.speed = 5;
}

function update() {
  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // AI movement
  if (ai.y + ai.height / 2 < ball.y) {
    ai.y += ai.dy;
  } else {
    ai.y -= ai.dy;
  }
  if (ai.y < 0) ai.y = 0;
  if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;

  // Player movement
  player.y += player.dy;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

  // Wall collision
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  // Paddle collision
  let paddle = (ball.x < canvas.width / 2) ? player : ai;
  if (
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.x + ball.radius > paddle.x &&
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height
  ) {
    // Calculate collision point
    let collidePoint = ball.y - (paddle.y + paddle.height / 2);
    collidePoint = collidePoint / (paddle.height / 2);

    // Calculate angle
    let angleRad = (Math.PI / 4) * collidePoint;

    let direction = (ball.x < canvas.width / 2) ? 1 : -1;
    ball.dx = direction * ball.speed * Math.cos(angleRad);
    ball.dy = ball.speed * Math.sin(angleRad);

    // Speed up
    ball.speed += 0.5;
  }

  // Score
  if (ball.x - ball.radius < 0) {
    aiScore++;
    updateScore();
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    playerScore++;
    updateScore();
    resetBall();
  }
}

function updateScore() {
  document.getElementById('player-score').textContent = playerScore;
  document.getElementById('ai-score').textContent = aiScore;
}

function game() {
  update();
  render();
  requestAnimationFrame(game);
}

// Controls
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowUp') player.dy = -8;
  if (event.key === 'ArrowDown') player.dy = 8;
});
document.addEventListener('keyup', function (event) {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') player.dy = 0;
});

// Start
game();