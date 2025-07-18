const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.getElementById("scoreText");
const reset = document.getElementById("reset");
const upkey = document.getElementById("Up-key");
const downkey = document.getElementById("Down-key");
const rightkey = document.getElementById("Right-key");
const leftkey = document.getElementById("Left-key");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "green";
const snakeBorder = "white";
const foodColor = "red";

const canvasSize = Math.min(gameWidth , gameHeight);

const gridSize = 20;

unitSize = canvasSize / gridSize;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let directionChanged = false;

// snake body

let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize * 1, y: 0 },
  { x: 0, y: 0 }, // tail
];

window.addEventListener("keydown", changeDirection);

reset.addEventListener("click", resetGame);

gameStart();

function gameStart() {
  running = true;
  scoreText.textContent = `SCORE : ${score}`;
  CreateFood();
  drawFood();
  nextTick();
}

function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      drawFood();
      checkGameOver();
      directionChanged = false;
      nextTick();
    }, 70);
  } else {
    displayGameOver();
  }
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
} // clear the board

function CreateFood() {
  function randomFood(max, min) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize; //

    return randNum;
  }

  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameWidth - unitSize);
} // generate the index of food

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
} // draw the food

function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity }; // creating head

  snake.unshift(head);
  // if the food is eaten size will increase
  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1;
    scoreText.textContent = `SCORE : ${score}`;
    CreateFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}

function changeDirection(event) {
  const keyPressed = event.keyCode;

  const DOWN = 40;
  const UP = 38;
  const LEFT = 37;
  const RIGHT = 39;

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;
  const goingRight = xVelocity == unitSize;

  switch (true) {
    case keyPressed == LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keyPressed == RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyPressed == DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

function checkGameOver() {
  switch (
    true // if touches the boundery then the game is over
  ) {
    case snake[0].x < 0:
      running = false;
      break;
    case snake[0].x >= gameWidth:
      running = false;
      break;
    case snake[0].y < 0:
      running = false;
      break;
    case snake[0].y >= gameHeight:
      running = false;
      break;
  }

  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}

function displayGameOver() {
  ctx.font = "50px MV Boli";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
  running = false;
}

function resetGame() {
  xVelocity = unitSize;
  yVelocity = 0;

  score = 0;

  // snake body

  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize * 1, y: 0 },
    { x: 0, y: 0 }, // tail
  ];

  gameStart();
}

// adding key functionality for mobile users

upkey.addEventListener("click", () => touchDirection("UP"));
downkey.addEventListener("click", () => touchDirection("DOWN"));
leftkey.addEventListener("click", () => touchDirection("LEFT"));
rightkey.addEventListener("click", () => touchDirection("RIGHT"));

function touchDirection(dir) {
  if (directionChanged) return;

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;
  const goingRight = xVelocity == unitSize;

  switch (dir) {
    case "LEFT":
      if (!goingRight) {
        xVelocity = -unitSize;
        yVelocity = 0;
        directionChanged = true;
      }
      break;
    case "RIGHT":
      if (!goingLeft) {
        xVelocity = unitSize;
        yVelocity = 0;
        directionChanged = true;
      }
      break;
    case "UP":
      if (!goingDown) {
        xVelocity = 0;
        yVelocity = -unitSize;
        directionChanged = true;
      }
      break;
    case "DOWN":
      if (!goingUp) {
        xVelocity = 0;
        yVelocity = unitSize;
        directionChanged = true;
      }
      break;
  }
}
