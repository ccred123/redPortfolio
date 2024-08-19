//來源 https://codepen.io/fleemaja/pen/BMbrqN
class Ball {
  constructor(x, y, radius) {
    this.x = x; // 球的初始 x 座標
    this.y = y; // 球的初始 y 座標
    this.shadowY = y; // 球的陰影 y 座標
    this.velocity = createVector(
      radius * 0.21, // 球的 x 方向速度
      random(-radius * 0.084, radius * 0.084) // 球的 y 方向隨機速度
    );
    this.radius = radius; // 球的半徑
  }

  update(ballArc) {
    this.x += this.velocity.x; // 更新球的 x 座標
    this.shadowY += this.velocity.y; // 更新陰影的 y 座標
    this.y = this.shadowY - ballArc; // 更新球的 y 座標，使其根據弧度變化
  }

  render() {
    push();
    noStroke();
    fill(54, 54, 54, 100); // 設定陰影顏色
    ellipse(this.x, this.shadowY, this.radius); // 繪製陰影
    stroke(54);
    strokeWeight(1);
    fill(50, 217, 50); // 設定球的顏色
    ellipse(this.x, this.y, this.radius); // 繪製球
    pop();
  }
}

class Paddle {
  constructor(x, y, slope, bottomBound, topBound, images, isPlayer, width) {
    this.x = x; // 球拍的 x 座標
    this.y = y; // 球拍的 y 座標
    this.bottomBound = bottomBound; // 球拍的下邊界
    this.topBound = topBound; // 球拍的上邊界
    this.slope = -slope; // 球拍的斜率
    this.images = images; // 球拍的圖像
    this.counter = 0; // 計數器，用於控制動畫
    this.animationSpeed = 0.1; // 動畫速度
    this.width = width; // 球拍的寬度
    this.height = width * 2; // 球拍的高度
    this.moveDirection = "none"; // 球拍的移動方向
    this.isPlayer = isPlayer; // 判斷是否為玩家的球拍
    this.playerHasMoved = false; // 玩家是否移動過
  }

  move() {
    const speed = this.height * 0.05; // 移動速度
    if (this.moveDirection === "up" && this.y > this.topBound) {
      this.y -= speed; // 如果移動方向為 "上" 且未超過上邊界，則向上移動
      this.x += speed / this.slope; // 更新 x 座標以匹配斜率
      this.counter += this.animationSpeed; // 更新動畫計數器
    } else if (this.moveDirection === "down" && this.y < this.bottomBound) {
      this.y += speed; // 如果移動方向為 "下" 且未超過下邊界，則向下移動
      this.x -= speed / this.slope; // 更新 x 座標以匹配斜率
      this.counter += this.animationSpeed; // 更新動畫計數器
    }
  }

  autoMove(ballY) {
    const diff = this.y - ballY; // 計算球拍與球之間的 y 差距
    if (diff < 0 && diff < -this.height * 0.5) {
      // 如果球在球拍下方，且差距超過球拍高度的一半
      this.switchMoveDirection("down"); // 球拍向下移動
    } else if (diff > 0 && diff > this.height * 0.5) {
      // 如果球在球拍上方，且差距超過球拍高度的一半
      this.switchMoveDirection("up"); // 球拍向上移動
    } else {
      this.switchMoveDirection("none"); // 不移動
    }
    this.move(); // 根據方向移動球拍
  }

  switchMoveDirection(type) {
    switch (type) {
      case "up":
        this.moveDirection = "up"; // 設定移動方向為 "上"
        this.playerHasMoved = true; // 標記玩家已經移動
        break;
      case "down":
        this.moveDirection = "down"; // 設定移動方向為 "下"
        this.playerHasMoved = true; // 標記玩家已經移動
        break;
      default:
        this.moveDirection = "none"; // 不移動
    }
  }

  render() {
    const y1 = this.y - this.height; // 球拍頂部 y 座標
    const x1 = this.x + this.height / this.slope; // 球拍頂部 x 座標

    const x2 = x1 + this.width; // 球拍頂部右側 x 座標
    const y2 = y1; // 球拍頂部右側 y 座標

    const x3 = this.x + this.width; // 球拍底部右側 x 座標
    const y3 = this.y; // 球拍底部右側 y 座標

    this.imageIdx = floor(this.counter) % this.images.length; // 計算當前要顯示的圖像

    if (this.images.length > 0) {
      noStroke();
      fill(54, 54, 54, 25);
      ellipse(this.x, this.y + this.height, this.height, this.width * 1.5); // 繪製陰影
      imageMode(CENTER);
      image(
        this.images[this.imageIdx],
        this.x,
        this.y,
        this.width * 2,
        this.height * 2
      ); // 繪製球拍圖像
      if (this.isPlayer && !this.playerHasMoved) {
        textSize(14);
        fill(54);
        text(
          "use the arrow keys to move!",
          this.x - padding,
          this.y - this.height * 1.5
        ); // 提示玩家使用方向鍵移動
      }
    } else {
      noStroke();
      fill(54);
      quad(this.x, this.y, x1, y1, x2, y2, x3, y3); // 如果沒有圖像則繪製簡單的四邊形作為球拍
    }
  }
}

let width, height;
let courtTopLeftX,
  courtTopLeftY,
  courtBottomLeftX,
  courtBottomLeftY,
  courtBottomRightX,
  courtBottomRightY,
  courtTopRightX,
  courtTopRightY;
let netTopLeftX,
  netTopLeftY,
  netBottomLeftX,
  netBottomLeftY,
  netBottomRightX,
  netBottomRightY,
  netTopRightX,
  netTopRightY;
let netWidth, shadowSize, padding, quadOffset;
let paddleOne, paddleTwo;
let ball;
let leftPlayerScore, rightPlayerScore;
let tennisManRedOne, tennisManRedTwo, tennisManBlueOne, tennisManBlueTwo;
let courtHeight, courtWidth, maxBallArc, oneFourthPoint, threeFourthsPoint;

function preload() {
  tennisManRedOne = loadImage(
    "https://res.cloudinary.com/dkw0kkkgd/image/upload/v1550623424/tennisManRedOne_zaszr5.png"
  ); // 預載入紅色球拍圖像
  tennisManRedTwo = loadImage(
    "https://res.cloudinary.com/dkw0kkkgd/image/upload/v1550623420/tennisManRedTwo_mz3skr.png"
  ); // 預載入紅色球拍圖像
  tennisManBlueOne = loadImage(
    "https://res.cloudinary.com/dkw0kkkgd/image/upload/v1550623406/tennisManBlueOne_jo7ppq.png"
  ); // 預載入藍色球拍圖像
  tennisManBlueTwo = loadImage(
    "https://res.cloudinary.com/dkw0kkkgd/image/upload/v1550623416/tennisManBlueTwo_ac6ppw.png"
  ); // 預載入藍色球拍圖像
}

function setup() {
  setupCanvas(); // 設置畫布
  leftPlayerScore = 0; // 左邊玩家分數初始化
  rightPlayerScore = 0; // 右邊玩家分數初始化
  setupCourtCoordinates(); // 設置球場座標
  setupNetCoordinates(); // 設置網的座標
  setupPaddles(); // 設置球拍
  ball = new Ball(width * 0.5, height * 0.5, width * 0.021); // 初始化球
}

function setupCanvas() {
  height = min(window.innerHeight, window.innerWidth / 2);
  // keep court dimensions nice
  width = min(window.innerWidth, height * 2);
  createCanvas(width, height);
}

function draw() {
  paddleOne.move(); // move player according to keyboard inputs
  paddleTwo.autoMove(ball.y); // computer player moves on its own relative to the ball's position
  updateBall();
  isColliding(); // check if ball is colliding with players
  didHitWall(); // check if ball is colliding with walls
  didScore(); // check if a player has scored
  background(255); // draw background
  drawCourt();
  drawCourtLines();
  paddleOne.render(); // draw player
  paddleTwo.render(); // draw computer player
  drawNet();
  ball.render(); // draw ball
  drawScore();
}

function setupCourtCoordinates() {
  padding = height * 0.125;
  quadOffset = width * 0.125;

  // top left coordinates of court
  courtTopLeftX = padding + quadOffset;
  courtTopLeftY = padding;

  // bottom left coordinates of court
  courtBottomLeftX = padding;
  courtBottomLeftY = height - padding;

  // bottom right coordinates of court
  courtBottomRightX = width - padding - quadOffset;
  courtBottomRightY = height - padding;

  // top right coordinates of court
  courtTopRightX = width - padding;
  courtTopRightY = padding;
}

function setupNetCoordinates() {
  // net settings
  netWidth = height * 0.125;
  shadowSize = width * 0.021;

  // top left of net
  netTopLeftX = width * 0.5 + quadOffset * 0.5;
  netTopLeftY = padding - netWidth;

  // bottom left of net
  netBottomLeftX = width * 0.5 - quadOffset * 0.5;
  netBottomLeftY = height - padding - netWidth;

  // bottom right of net
  netBottomRightX = width * 0.5 - quadOffset * 0.5;
  netBottomRightY = height - padding;

  // top right of net
  netTopRightX = width * 0.5 + quadOffset * 0.5;
  netTopRightY = padding;
}

function setupPaddles() {
  const bottomBound = courtBottomLeftY;
  const topBound = courtTopRightY;
  const yBounds = [bottomBound, topBound];

  const position = [courtBottomLeftX + 30, courtBottomLeftY - 60];
  const slope =
    (courtBottomLeftY - courtTopLeftY) / (courtBottomLeftX - courtTopLeftX);
  const blueImages = [tennisManBlueOne, tennisManBlueTwo];
  paddleOne = new Paddle(
    ...position,
    slope,
    ...yBounds,
    blueImages,
    (isPlayer = true),
    width * 0.03
  );

  const twoPosition = [courtTopRightX - 70, courtTopRightY + 60];
  const twoSlope =
    (courtTopRightY - courtBottomRightY) / (courtTopRightX - courtBottomRightX);
  const redImages = [tennisManRedOne, tennisManRedTwo];
  paddleTwo = new Paddle(
    ...twoPosition,
    twoSlope,
    ...yBounds,
    redImages,
    (isPlayer = false),
    width * 0.03
  );
}

function keyReleased() {
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    paddleOne.switchMoveDirection("none");
  } else if (keyCode === 87 || keyCode === 83) {
    paddleOne.switchMoveDirection("none");
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    paddleOne.switchMoveDirection("up");
  } else if (keyCode === DOWN_ARROW) {
    paddleOne.switchMoveDirection("down");
  }
}

function isColliding() {
  const bottomOfBall = ball.y + ball.radius,
    topOfBall = ball.y - ball.radius,
    topOfPaddleOne = paddleOne.y - paddleOne.height,
    bottomOfPaddleOne = paddleOne.y + paddleOne.height,
    topOfPaddleTwo = paddleTwo.y - paddleTwo.height,
    bottomOfPaddleTwo = paddleTwo.y + paddleTwo.height;

  if (
    ball.x >= paddleOne.x - paddleOne.width &&
    ball.x <= paddleOne.x + paddleOne.width
  ) {
    if (topOfBall <= bottomOfPaddleOne && bottomOfBall >= topOfPaddleOne) {
      playerCollisionEvent();
    }
  } else if (
    ball.x >= paddleTwo.x - paddleTwo.width &&
    ball.x <= paddleTwo.x + paddleTwo.width
  ) {
    if (topOfBall <= bottomOfPaddleTwo && bottomOfBall >= topOfPaddleTwo) {
      computerCollisionEvent();
    }
  }
}

function playerCollisionEvent() {
  ball.velocity.x *= -1.03;
  ball.x = paddleOne.x + paddleOne.width + 5;
  let velocityMag;
  let xVel = ball.velocity.x;

  const maxTopSlope =
    (courtTopRightY - (paddleOne.y - paddleOne.height)) /
    (courtTopRightX - (paddleOne.x + paddleOne.width)); // range from -0.38 to 0
  const maxBottomSlope =
    (courtBottomRightY - (paddleOne.y + paddleOne.height)) /
    (courtBottomRightX - (paddleOne.x + paddleOne.width)); // range from 0 to 0.54

  if (ball.y < paddleOne.y) {
    velocityMag = -random(4);
    ball.velocity.y = map(velocityMag, -4, 0, xVel * maxTopSlope, 0);
  } else {
    velocityMag = random(4);
    ball.velocity.y = map(velocityMag, 0, 4, 0, xVel * maxBottomSlope);
  }
}

function computerCollisionEvent() {
  ball.velocity.x *= -1.03;
  ball.x = paddleTwo.x - paddleTwo.width - 4;
  let velocityMag;
  let xVel = ball.velocity.x;

  const maxTopSlope =
    (courtTopLeftY - (paddleTwo.y - paddleTwo.height)) /
    (courtTopLeftX - (paddleTwo.x - paddleTwo.width)); // 0 to 0.56
  const maxBottomSlope =
    (courtBottomLeftY - (paddleTwo.y + paddleTwo.height)) /
    (courtBottomLeftX - (paddleTwo.x - paddleTwo.width)); // 0 to -0.39

  if (ball.y < paddleTwo.y) {
    velocityMag = -random(4);
    ball.velocity.y = map(velocityMag, -4, 0, xVel * maxTopSlope, 0);
  } else {
    velocityMag = random(4);
    ball.velocity.y = map(velocityMag, 0, 4, 0, xVel * maxBottomSlope);
  }
}

function resetBall() {
  ball.x = width * 0.5;
  ball.y = height * 0.5;
  ball.shadowY = height * 0.5;
  ball.velocity.x =
    ball.velocity.x < 0 ? ball.radius * 0.21 : -(ball.radius * 0.21);
  ball.velocity.y = random(-ball.radius * 0.084, ball.radius * 0.084);
}

function didHitWall() {
  const upperBound = courtTopLeftY;
  const lowerBound = courtBottomLeftY;

  if (ball.y <= upperBound) {
    ball.velocity.y *= -1;
  }
  if (ball.y >= lowerBound) {
    ball.velocity.y *= -1;
  }
}

function didScore() {
  const leftBound = courtBottomLeftX;
  const rightBound = courtTopRightX;

  if (ball.x <= leftBound) {
    rightPlayerScore++;
    resetBall();
  }
  if (ball.x >= rightBound) {
    leftPlayerScore++;
    resetBall();
  }
}

function updateBall() {
  let ballArc;
  maxBallArc = height * 0.0625;
  courtWidth = width - 2 * padding - quadOffset;
  oneFourthPoint = courtBottomLeftX + quadOffset * 0.5 + courtWidth * 0.25;
  threeFourthsPoint = courtTopRightX - quadOffset * 0.5 - courtWidth * 0.25;

  const oneRacketX = paddleOne.x + paddleOne.width;
  const twoRacketX = paddleTwo.x - paddleTwo.width;

  if (ball.velocity.x > 0) {
    // ball is moving right
    if (ball.x <= width * 0.5) {
      ballArc = map(
        ball.x,
        oneRacketX,
        width * 0.5,
        maxBallArc * 0.5,
        maxBallArc
      );
    } else if (ball.x > width * 0.5 && ball.x <= threeFourthsPoint) {
      ballArc = map(ball.x, width * 0.5, threeFourthsPoint, maxBallArc, 0);
    } else {
      ballArc = map(ball.x, threeFourthsPoint, twoRacketX, 0, maxBallArc * 0.5);
    }
  } else {
    // ball is moving left
    if (ball.x >= width * 0.5) {
      ballArc = map(
        ball.x,
        twoRacketX,
        width * 0.5,
        maxBallArc * 0.5,
        maxBallArc
      );
    } else if (ball.x < width * 0.5 && ball.x >= oneFourthPoint) {
      ballArc = map(ball.x, width * 0.5, oneFourthPoint, maxBallArc, 0);
    } else {
      ballArc = map(ball.x, oneFourthPoint, oneRacketX, 0, maxBallArc * 0.5);
    }
  }
  ball.update(ballArc);
}

function drawCourt() {
  noStroke();
  fill(54);
  const shift = 10;
  quad(
    courtTopLeftX + shift,
    courtTopLeftY + shift,
    courtBottomLeftX + shift,
    courtBottomLeftY + shift,
    courtBottomRightX + shift,
    courtBottomRightY + shift,
    courtTopRightX + shift,
    courtTopRightY + shift
  );

  fill(230, 70, 20); // 設置球場顏色
  quad(
    courtTopLeftX,
    courtTopLeftY,
    courtBottomLeftX,
    courtBottomLeftY,
    courtBottomRightX,
    courtBottomRightY,
    courtTopRightX,
    courtTopRightY
  );
}

function drawCourtLines() {
  stroke(255);

  courtHeight = height - 2 * padding;
  const topSingleLineX1 = padding + (1 - 0.125) * quadOffset,
    topSingleLineY = padding + 0.125 * courtHeight,
    topSingleLineX2 = width - padding - 0.125 * quadOffset;

  // middle line
  line(oneFourthPoint, height * 0.5, threeFourthsPoint, height * 0.5);

  // center marker notch thingies
  const markerLength = width / 64;
  const leftX = courtBottomLeftX + quadOffset * 0.5;
  const rightX = courtTopRightX - quadOffset * 0.5;
  line(leftX, height * 0.5, leftX + markerLength, height * 0.5);
  line(rightX - markerLength, height * 0.5, rightX, height * 0.5);

  line(topSingleLineX1, topSingleLineY, topSingleLineX2, topSingleLineY);

  const bottomSingleLineX1 = padding + 0.125 * quadOffset,
    bottomSingleLineY = padding + (1 - 0.125) * courtHeight,
    bottomSingleLineX2 = width - padding - (1 - 0.125) * quadOffset;

  line(
    bottomSingleLineX1,
    bottomSingleLineY,
    bottomSingleLineX2,
    bottomSingleLineY
  );

  // vertical lines in the middle of the court
  line(
    bottomSingleLineX1 + courtWidth * 0.25,
    bottomSingleLineY,
    topSingleLineX1 + courtWidth * 0.25,
    topSingleLineY
  );

  line(
    bottomSingleLineX2 - courtWidth * 0.25,
    bottomSingleLineY,
    topSingleLineX2 - courtWidth * 0.25,
    topSingleLineY
  );
}

function drawNet() {
  strokeWeight(1);
  // shadow
  noStroke();
  fill(54, 54, 54, 54); // 設置球網顏色
  quad(
    netTopRightX,
    netTopRightY,
    netBottomRightX,
    netBottomRightY,
    netBottomRightX + shadowSize,
    netBottomRightY,
    netTopRightX + shadowSize,
    netTopRightY
  );

  stroke(54);
  // line across
  line(
    netBottomLeftX,
    netBottomRightY - netWidth * 0.75,
    netTopRightX,
    netTopRightY - netWidth * 0.75
  );
  line(
    netBottomLeftX,
    netBottomRightY - netWidth * 0.5,
    netTopRightX,
    netTopRightY - netWidth * 0.5
  );
  line(
    netBottomLeftX,
    netBottomRightY - netWidth * 0.25,
    netTopRightX,
    netTopRightY - netWidth * 0.25
  );

  line(netBottomRightX, netBottomRightY, netTopRightX, netTopRightY);

  // vertical net lines
  line(
    netBottomLeftX + quadOffset / 10,
    (9 * courtHeight) / 10 + netWidth,
    netBottomLeftX + quadOffset / 10,
    (9 * courtHeight) / 10
  );
  line(
    netBottomLeftX + (2 * quadOffset) / 10,
    (8 * courtHeight) / 10 + netWidth,
    netBottomLeftX + (2 * quadOffset) / 10,
    (8 * courtHeight) / 10
  );
  line(
    netBottomLeftX + (3 * quadOffset) / 10,
    (7 * courtHeight) / 10 + netWidth,
    netBottomLeftX + (3 * quadOffset) / 10,
    (7 * courtHeight) / 10
  );
  line(
    netBottomLeftX + (4 * quadOffset) / 10,
    (6 * courtHeight) / 10 + netWidth,
    netBottomLeftX + (4 * quadOffset) / 10,
    (6 * courtHeight) / 10
  );
  line(
    netBottomLeftX + (6 * quadOffset) / 10,
    (4 * courtHeight) / 10 + netWidth,
    netBottomLeftX + (6 * quadOffset) / 10,
    (4 * courtHeight) / 10
  );
  line(
    netBottomLeftX + (7 * quadOffset) / 10,
    (3 * courtHeight) / 10 + netWidth,
    netBottomLeftX + (7 * quadOffset) / 10,
    (3 * courtHeight) / 10
  );
  line(
    netBottomLeftX + (8 * quadOffset) / 10,
    (2 * courtHeight) / 10 + netWidth,
    netBottomLeftX + (8 * quadOffset) / 10,
    (2 * courtHeight) / 10
  );
  line(
    netBottomLeftX + (9 * quadOffset) / 10,
    courtHeight / 10 + netWidth,
    netBottomLeftX + (9 * quadOffset) / 10,
    courtHeight / 10
  );

  stroke(245);

  strokeWeight(4);
  line(netTopLeftX, netTopLeftY, netBottomLeftX, netBottomLeftY);
  // line through the middle of the net
  line(width * 0.5, height * 0.5, width * 0.5, height * 0.5 - netWidth);
  stroke(54);
  // left post
  line(netBottomRightX, netBottomRightY, netBottomLeftX, netBottomLeftY);

  // right post
  strokeWeight(3);
  line(netTopRightX, netTopRightY, netTopLeftX, netTopLeftY);
}

function drawScore() {
  textSize(height * 0.1);
  noStroke();
  fill(54);
  textAlign(RIGHT);
  text(leftPlayerScore, padding + quadOffset + courtWidth * 0.25, padding - 10); // player score
  textAlign(LEFT);
  text(rightPlayerScore, width - padding - courtWidth * 0.25, padding - 10); // computer score
}
