const canvas = document.getElementById("myCanvas");
// getContext() 會回傳 canvas 的drawing context
// drawing context 可用在canvas內畫圖
const ctx = canvas.getContext("2d");
const unit = 20; // 蛇一格的大小
const row = canvas.height / unit; //row可以容納的格數(320/20=16)
const column = canvas.width / unit; //column可以容納的格數(320/20=16)

//array中每個元素為物件,其物件是儲存蛇身體的xy座標
let snake = [];
function creatSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

//製作果實物件
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random(0, 1) * column) * unit;
    this.y = Math.floor(Math.random(0, 1) * row) * unit;
  }

  //畫出果實
  drawFruit() {
    ctx.fillStyle = "yellow"; //果實顏色
    ctx.fillRect(this.x, this.y, unit, unit); //出現果實位置
  }
  //果實的新位置
  newlocation() {
    let overlapping = false; //預設蛇與果實沒重疊
    let newX;
    let newY;

    //需要從snake裡的座標一個一個確認是否與新果實出現的位置一樣
    function checkOverlaping(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x == newX && snake[i].y == newY) {
          console.log("此次挑選座標重疊", newX, newY);
          overlapping = true; //更新預設蛇與果實為有重疊
          return overlapping;
        } else {
          return overlapping;
        }
      }
    }

    //當果實出現在蛇的位置重疊時,須更新果實的位置,直到位置不一樣
    do {
      newX = Math.floor(Math.random(0, 1) * column) * unit; //產生果實新位置
      newY = Math.floor(Math.random(0, 1) * row) * unit; //產生果實新位置
      // console.log("果實可能的新座標", newX, newY);
      checkOverlaping(newX, newY); //確認有沒有在重疊
    } while (overlapping);

    this.x = newX; //使用確認可以的果實新位置
    this.y = newY; //使用確認可以的果實新位置
  }
}

creatSnake(); //蛇的初始設定
let myFruit = new Fruit();

//移動蛇
window.addEventListener("keydown", changeDirection); //監聽鍵盤按鍵
let d = "Right"; //蛇預設移動方向(右邊)
function changeDirection(e) {
  // console.log(e); //顯示目前案件的event
  if (e.key == "ArrowRight" && d != "Left") {
    console.log("向右");
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    console.log("向下");
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    console.log("向左");
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    console.log("向上");
    d = "Up";
  }

  //每次按上下左右鍵時，下一帪畫出來之前，不接受任何keydown事件，避免遇到連續按按鍵導致自殺
  //原本向左走，當短短0.1秒內先按了up再來right，會導致畫面還沒更新時，身體會瞬間180度轉向導致吃到自己遊戲結束
  window.removeEventListener("keydown", changeDirection); //移除監聽
}

let highestScore; // 本機端目前最高分
loadHighestScore();
let score = 0; //遊戲初始分數

document.getElementById("myScore1").innerHTML = "目前分數 " + score;
document.getElementById("myScore2").innerHTML = "最高分數 " + highestScore;
//劃出蛇
function draw() {
  //每次畫圖前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return draw;
    }
  }
  //canvas像是個畫布,每次執行前須清除之前的內容,再次重畫
  ctx.fillStyle = "black"; //背景設定為黑色
  ctx.fillRect(0, 0, canvas.width, canvas.height); //背景設定的範圍

  myFruit.drawFruit(); //畫出果實(執行畫果實的class)
  // console.log("draw執行中, 正在畫蛇~");
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "darkred"; //蛇頭
    } else {
      ctx.fillStyle = "lightblue"; //蛇身
    }
    ctx.strokeStyle = "white"; //蛇的外框顏色

    //(穿牆功能)蛇遇到邊框時,會從另外一頭出來
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    } else if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    } else if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    } else if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    //畫實心正方形, fillRect(x,y,width,height)
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); //蛇身
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); //畫長方形外框
  }

  //以目前d變數的方向,來決定蛇的下一幀數(fps)要放在哪一個座標
  let snakeX = snake[0].x; // snake[0].x是個parameter data type ,snakeX後續更新值不會影響snake[0]
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  //根據上面移動結果,改變蛇頭下一幀的新位置
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //確認蛇是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //更新果實的位置
    myFruit.newlocation();
    //更新分數
    score++;
    judgmentHighestScore(score); //判斷目前分數是否為有始以來最高分
    document.getElementById("myScore1").innerHTML = "目前分數 " + score;
    document.getElementById("myScore2").innerHTML = "最高分數 " + highestScore;
  } else {
    snake.pop(); //更新蛇身體長度
  }
  snake.unshift(newHead); //移動後,新增蛇頭的新座標
  window.addEventListener("keydown", changeDirection); //畫出下一幀
  // console.log("蛇繪製完畢");
}

//讓蛇每隔一個時間就會移動
let myGame = setInterval(draw, 100); //每0.1秒執行一次function

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function judgmentHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
