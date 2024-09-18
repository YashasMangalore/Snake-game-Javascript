console.log("Let the games begin");

// Initialize high score from local storage or set to 0
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let score = 0;
let snake = [{ top: 200, left: 200 }];
const BASE_SPEED = 200; // Base speed in milliseconds
const MAX_SPEED = 50;  // Max speed in milliseconds
let food = null;
let direction = {
  key: "ArrowRight",
  dx: 20,
  dy: 0,
};

window.addEventListener("keydown", (e) => {
  const newDirection = getDirection(e.key);
  const allowedChange = Math.abs(direction.dx) !== Math.abs(newDirection.dx);
  if (allowedChange) {
    direction = newDirection;
  }
});

function getDirection(key) {
  switch (key) {
    case "ArrowUp":
    case "w":
      return { key, dx: 0, dy: -20 };
    case "ArrowDown":
    case "s":
      return { key, dx: 0, dy: 20 };
    case "ArrowLeft":
    case "a":
      return { key, dx: -20, dy: 0 };
    case "ArrowRight":
    case "d":
      return { key, dx: 20, dy: 0 };
    default:
      return direction;
  }
}

function moveSnake() {
  const head = Object.assign({}, snake[0]); //copy
  head.top += direction.dy;
  head.left += direction.dx;
  snake.unshift(head); //unshift appends to start of an array

  if (snake[0].top < 0) {
    snake[0].top = 380;
  }
  if (snake[0].left < 0) {
    snake[0].left = 380;
  }
  if (snake[0].top > 380) {
    snake[0].top = 0;
  }
  if (snake[0].left > 380) {
    snake[0].left = 0;
  }

  if (!eatFood())
  {
    snake.pop();
  }
}

function randomFood() {
  let newFood;
  do {
    newFood = {
      top: Math.floor(Math.random() * 20) * 20,
      left: Math.floor(Math.random() * 20) * 20,
    };
  } while (snake.some( (segment) => segment.top === newFood.top && segment.left === newFood.left));

  food = newFood;
}

function eatFood() {
  if (snake[0].top === food.top && snake[0].left === food.left) {
    food = null;
    return true;
  }
  return false;
}

function gameOver() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].top === snake[0].top && snake[i].left === snake[0].left) {
      return true;
    }
  }
  return false;
}

function drawSnake() {
  snake.forEach((item, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.top = `${item.top}px`;
    snakeElement.style.left = `${item.left}px`;

    snakeElement.classList.add("snake");
    if (index === 0) {
      snakeElement.classList.add("head");
    }
    document.getElementById("game-board").appendChild(snakeElement);
  });
}

function drawFood() {
  const foodElement = document.createElement("div");
  foodElement.style.top = `${food.top}px`;
  foodElement.style.left = `${food.left}px`;
  foodElement.classList.add("food");
  document.getElementById("game-board").appendChild(foodElement);
}

function updateScore() {
  document.querySelector("#score h2").innerText = "Score : " + score;
  document.querySelector("#high-score h2").innerText = "High-Score : " + highScore;
}
function gameLoop() {
  if (gameOver()) {
    alert("Game Over!!!");
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore); // Save the new high score
    }
    score = 0;
    snake = [{ top: 200, left: 200 }];
    direction = {
      key: "ArrowRight",
      dx: 20,
      dy: 0,
    };
    randomFood();
  }

  // Calculate speed based on the length of the snake
  let currentSpeed = BASE_SPEED - (snake.length - 1) * 6; // Decrease speed as snake grows
  if (currentSpeed < MAX_SPEED) {
    currentSpeed = MAX_SPEED; // Cap the speed
  }

  setTimeout(() => {
    document.getElementById("game-board").innerHTML = "";
    moveSnake();
    if (!food) {
      randomFood();
      score += 10;
    }
    updateScore();
    drawSnake(); // Draw the snake
    drawFood(); // Draw the food
    gameLoop(); // Call the loop again
  }, currentSpeed); // Use the dynamically calculated speed
}

randomFood();
gameLoop();
