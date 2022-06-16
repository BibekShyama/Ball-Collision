const body = document.body;
const playgroundWidth = window.innerWidth;
const playgroundHeight = window.innerHeight;
const TOTAL_BALL = 100;
const ballColors = [
  "red",
  "blue",
  "yellow",
  "green",
  "orange",
  "purple",
  "maroon",
  "voilet",
  "aqua",
  "cyan",
  "black",
  "brown",
];
const balls = [];
const box = document.createElement("div");
box.style.position = "relative";
box.style.width = playgroundWidth + "px";
box.style.height = playgroundHeight + "px";
body.appendChild(box);

class Ball {
  constructor(x, y, radius, velx, vely) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.width = radius * 2;
    this.height = radius * 2;
    this.velx = velx;
    this.vely = vely;
    this.ball = document.createElement("div");
    // this.ball.style.backgroundColor = `rgb(${Math.floor(
    //   Math.random(0, 255)
    // )},${Math.floor(Math.random(0, 255))},${Math.floor(Math.random(0, 255))})`;
    this.ball.style.backgroundColor =
      ballColors[randomNumberGenerator(0, ballColors.length)];
    box.appendChild(this.ball);
  }

  drawBall() {
    this.ball.style.width = `${this.width}px`;
    this.ball.style.height = `${this.height}px`;
    this.ball.style.position = "absolute";
    this.ball.style.top = `${this.y}px`;
    this.ball.style.left = `${this.x}px`;
    this.ball.style.borderRadius = "50%";
  }

  move() {
    this.x += this.velx;
    this.y += this.vely;
  }
}
function randomNumberGenerator(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

for (let i = 0; i < TOTAL_BALL; i++) {
  let radius = randomNumberGenerator(10, 20);
  let x = randomNumberGenerator(0, playgroundWidth - radius * 2);
  let y = randomNumberGenerator(0, playgroundHeight - radius * 2);
  let velx = randomNumberGenerator(-5, 5);
  let vely = randomNumberGenerator(-5, 5);
  if (i !== 0) {
    for (let j = 0; j < balls.length; j++) {
      let obj = balls[j];
      if (
        isCollided(
          x + radius,
          y + radius,
          radius,
          obj.x + obj.radius,
          obj.y + obj.radius,
          obj.radius
        )
      ) {
        x = randomNumberGenerator(0, playgroundWidth - radius * 2);
        y = randomNumberGenerator(0, playgroundHeight - radius * 2);
        j = -1;
      }
    }
  }

  const circle = new Ball(x, y, radius, velx, vely);

  balls.push(circle);
}

function isCollided(x1, y1, r1, x2, y2, r2) {
  const square_dist = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  const square_radius = (r1 + r2) * (r1 + r2);
  if (square_dist < square_radius) {
    return true;
  } else {
    return false;
  }
}

function directionChange(ball1, ball2) {
  let collisionVector = {
    x: ball2.x - ball1.x,
    y: ball2.y - ball1.y,
  };

  let collisionVectorDist = Math.sqrt(
    (ball2.x - ball1.x) * (ball2.x - ball1.x) +
      (ball2.y - ball1.y) * (ball2.y - ball1.y)
  );

  let normalisedCollision = {
    x: collisionVector.x / collisionVectorDist,
    y: collisionVector.y / collisionVectorDist,
  };

  let relativeVelocity = {
    x: ball1.velx - ball2.velx,
    y: ball1.vely - ball2.vely,
  };

  let speed =
    relativeVelocity.x * normalisedCollision.x +
    relativeVelocity.y * normalisedCollision.y;

  return { speed, normalisedCollision };
}

function BallCollisionDetection() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      if (
        isCollided(
          balls[i].x + balls[i].radius,
          balls[i].y + balls[i].radius,
          balls[i].radius,
          balls[j].x + balls[j].radius,
          balls[j].y + balls[j].radius,
          balls[j].radius
        )
      ) {
        const { speed, normalisedCollision } = directionChange(
          balls[i],
          balls[j]
        );
        if (speed < 0) {
          break;
        } else {
          balls[i].velx -= speed * normalisedCollision.x;
          balls[i].vely -= speed * normalisedCollision.y;

          balls[j].velx += speed * normalisedCollision.x;
          balls[j].vely += speed * normalisedCollision.y;
        }
      }
    }
  }
}

function wallCollisionDetection() {
  balls.forEach((ball) => {
    if (ball.x < 0) {
      ball.velx = -ball.velx;
    } else if (ball.x + ball.width > playgroundWidth) {
      ball.velx = -ball.velx;
    }
    if (ball.y < 0) {
      ball.vely = -ball.vely;
    } else if (ball.y + ball.height > playgroundHeight) {
      ball.vely = -ball.vely;
    }
  });
}

function loop() {
  balls.forEach((ball) => ball.drawBall());
  balls.forEach((ball) => ball.move());
  BallCollisionDetection();
  wallCollisionDetection();

  window.requestAnimationFrame(loop);
}

loop();
