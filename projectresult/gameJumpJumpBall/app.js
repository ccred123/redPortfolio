const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");

let circle_x = 160; //球圓心初始位置
let circle_y = 60; //球圓心初始位置
let radius = 20; //球半徑
let xSpeed = 20; //每幀x方向的移動量
let ySpeed = 20; //每幀y方向的移動量

let ground_x = 100; //地板的初始位置
let ground_y = 500; //地板的初始位置
let ground_width = 200; //地板的寬度
let ground_thickness = 5; //地板厚度

let brickTotal = 10; // 總磚塊數
let brickArray = [];
let count = 0; //撞擊到磚塊的初始數量

// 開始時間
let startTime = performance.now();
let elapsedTime = 0; // 經過時間

//常用的隨機值
function getRandomArbitrtary(min, max) {
  return min + Math.floor(Math.random() * (max - min)); // 最小值 +
}

//製作多個磚塊
class Brick {
  constructor(x, y) {
    this.x = x; // 0 < x <9 50
    this.y = y; // 0 < y < 550
    this.width = 50;
    this.height = 50;
    this.visible = true; //磚塊預設為顯示
    brickArray.push(this); //將製作好的磚塊放入 brickArray
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  //確認球是否碰到磚塊
  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }
}

//製作所有的brick
for (let i = 0; i < brickTotal; i++) {
  new Brick(getRandomArbitrtary(0, 950), getRandomArbitrtary(0, 550));
}

c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
});

function drawCircle() {
  // 更新經過時間
  elapsedTime = (performance.now() - startTime) / 1000;

  // ===== 球打到磚塊回彈 =====
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++; //計算撞擊到的磚塊數量
      document.getElementById("countBrick").innerHTML =
        "剩餘磚塊 " + (brickTotal - count);
      brick.visible = false; //磚塊不該顯示

      //改變球x,y方向的速度
      if (circle_y >= brick.y + brick.height) {
        ySpeed *= -1;
      } else if (circle_y <= brick.y) {
        ySpeed *= -1;
      } else if (circle_x <= brick.x) {
        xSpeed *= -1;
      } else if (circle_x >= brick.x + brick.width) {
        xSpeed *= -1;
      }

      // 如果所有磚塊都被撞擊，結束遊戲
      if (count === brickTotal) {
        // 停止時間更新並顯示最終時間
        document.getElementById("countTime").innerHTML =
          "花費時間 " + elapsedTime.toFixed(2) + " 秒";
        clearInterval(game);
        alert("遊戲結束");

        return; // 結束 drawCircle 函數，停止遊戲畫面更新
      }
    }
  });

  // ===== 球打到地板(一個長方形區塊)回彈 =====
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + ground_width + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 35;
    } else {
      circle_y += 35;
    }
    ySpeed *= -1;
  }

  // ===== 確認球有沒有打到牆壁 =====
  if (circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
  }
  if (circle_x <= radius) {
    xSpeed *= -1;
  }
  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
  }
  if (circle_y <= radius) {
    ySpeed *= -1;
  }

  // ===== 更動球圓心的座標 =====
  circle_x += xSpeed;
  circle_y += ySpeed;

  // 畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 畫出所有的brick
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  // 畫出地板(可控制)
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, ground_width, ground_thickness);

  // 畫出圓球
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();

  // 更新時間顯示
  document.getElementById("countTime").innerHTML =
    "花費時間 " + elapsedTime.toFixed(2) + " 秒";
}
let game = setInterval(drawCircle, 25);
