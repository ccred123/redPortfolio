let hero = document.querySelector(".hero");
let slider = document.querySelector(".slider");
let animation = document.querySelector("section.animation-wrapper");

const time_line = new TimelineMax(); //控制動畫的時間線

//parmeter1 : 控制的對象
//parmeter2 : duration
//parmeter3 : 控制對象的原始狀態
//parmeter4 : 控制對象的結束狀態
//parmeter5 : 提早開始跑

time_line
  .fromTo(hero, 1, { height: "0%" }, { height: "100%", ease: Power2.easeInOut })
  .fromTo(
    hero,
    1.2,
    { width: "80%" },
    { width: "100%", ease: Power2.easeInOut }
  )
  .fromTo(
    slider,
    1,
    { x: "-100%" },
    { x: "0%", ease: Power2.easeInOut },
    "-=1.2"
  )
  .fromTo(animation, 0.3, { opacity: 1 }, { opacity: 0 });

//讓開場動畫結束後不會停留在頁面
//建立一個計時器，如果時間到就會執行該function
setTimeout(() => {
  animation.style.pointerEvents = "none";
}, 2500);

// 讓整個網站的ENTER KEY都無法使用
window.addEventListener("keypress", (e) => {
  // console.log(e);
  if (e.key == "Enter") {
    e.preventDefault();
  }
});

// 防止FORM內部的BUTTON交出表單
let allButtons = document.querySelectorAll("button");
allButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
  });
});

//選擇 select內的option之後，會改變相對應的顏色
let allSelects = document.querySelectorAll("select");
allSelects.forEach((select) => {
  select.addEventListener("change", (e) => {
    // console.log(e.target.value);
    setGPA();
    changeColor(e.target); //變更背景顏色 e.target 也就是 <select>
  });
});

// 改變 credit之後，gpa也會更新
let credits = document.querySelectorAll(".class-credits");
credits.forEach((credit) => {
  credit.addEventListener("change", () => {
    setGPA();
  });
});

function changeColor(target) {
  if (target.value == "A" || target.value == "A-") {
    target.style.backgroundColor = "lightgreen"; //背景顏色
    target.style.color = "black"; //文字顏色
  } else if (
    target.value == "B+" ||
    target.value == "B" ||
    target.value == "B-"
  ) {
    target.style.backgroundColor = "yellow"; //背景顏色
    target.style.color = "black"; //文字顏色
  } else if (
    target.value == "C+" ||
    target.value == "C" ||
    target.value == "C-"
  ) {
    target.style.backgroundColor = "orange"; //背景顏色
    target.style.color = "black"; //文字顏色
  } else if (
    target.value == "D+" ||
    target.value == "D" ||
    target.value == "D-"
  ) {
    target.style.backgroundColor = "red"; //背景顏色
    target.style.color = "black"; //文字顏色
  } else if (target.value == "F") {
    target.style.backgroundColor = "gray"; //背景顏色
    target.style.color = "white"; //文字顏色
  } else {
    target.style.backgroundColor = "white"; //背景顏色
    // target.style.color = "white"; //文字顏色
  }
}

function convertor(grade) {
  switch (grade) {
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.4;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.4;
    case "C":
      return 2.0;
    case "C-":
      return 1.7;
    case "D+":
      return 1.4;
    case "D":
      return 1.0;
    case "D-":
      return 0.7;
    case "F":
      return 0.0;
    default:
      return 0;
  }
}

function setGPA() {
  let formLength = document.querySelectorAll("form").length; //document.querySelector('form')為node list ，抓取全部地的form
  let credits = document.querySelectorAll(".class-credits");
  let selects = document.querySelectorAll("select");
  let sum = 0; // gpa初始分子
  let creditSum = 0; // gpa初始分母

  for (let i = 0; i < credits.length; i++) {
    if (!isNaN(credits[i].valueAsNumber)) {
      creditSum += credits[i].valueAsNumber;
    }
    console.log(credits[i].valueAsNumber);
  }
  console.log("creditSum is :" + creditSum);

  for (let i = 0; i < formLength; i++) {
    if (!isNaN(credits[i].valueAsNumber)) {
      sum += credits[i].valueAsNumber * convertor(selects[i].value);
    }
    console.log(convertor(selects[i].value));
  }
  console.log("sum is :" + sum);

  let result;
  if (creditSum == 0) {
    result = (0.0).toFixed(2); //避免分母為0時，會顯示nan
  } else {
    result = (sum / creditSum).toFixed(2); //小數點後2位
  }

  document.getElementById("result-gpa").innerText = result;
}

//點擊按鈕，新增表單
let addBtn = document.querySelector(".plus-btn");
addBtn.addEventListener("click", () => {
  let newForm = document.createElement("form");
  let newDiv = document.createElement("div");
  newDiv.classList.add("grader");

  //製作表單內五個小元素
  let newInput1 = document.createElement("input");
  newInput1.setAttribute("type", "text"); //type="text"
  newInput1.setAttribute("list", "opt"); //list="opt"
  newInput1.classList.add("class-type"); //class="class-type"

  let newInput2 = document.createElement("input");
  newInput2.setAttribute("type", "text"); //type="text"
  newInput2.setAttribute("list", "opt"); //list="opt"
  newInput2.classList.add("class-number"); //class="class-number"

  let newInput3 = document.createElement("input");
  newInput2.setAttribute("type", "number");
  newInput3.setAttribute("min", "0");
  newInput3.setAttribute("max", "6");
  newInput3.classList.add("class-credits"); //class-credits"
  //新增的表單，讓GPA可以更動
  newInput3.addEventListener("change", () => {
    setGPA();
  });

  // here is the select tag
  let newSelect = document.createElement("select");
  newSelect.classList.add("select");
  var opt1 = document.createElement("option");
  opt1.setAttribute("value", "");
  let textNode1 = document.createTextNode("");
  opt1.appendChild(textNode1);
  var opt2 = document.createElement("option");
  opt2.setAttribute("value", "A");
  let textNode2 = document.createTextNode("A");
  opt2.appendChild(textNode2);
  var opt3 = document.createElement("option");
  opt3.setAttribute("value", "A-");
  let textNode3 = document.createTextNode("A-");
  opt3.appendChild(textNode3);
  var opt4 = document.createElement("option");
  opt4.setAttribute("value", "B+");
  let textNode4 = document.createTextNode("B+");
  opt4.appendChild(textNode4);
  var opt5 = document.createElement("option");
  opt5.setAttribute("value", "B");
  let textNode5 = document.createTextNode("B");
  opt5.appendChild(textNode5);
  var opt6 = document.createElement("option");
  opt6.setAttribute("value", "B-");
  let textNode6 = document.createTextNode("B-");
  opt6.appendChild(textNode6);
  var opt7 = document.createElement("option");
  opt7.setAttribute("value", "C+");
  let textNode7 = document.createTextNode("C+");
  opt7.appendChild(textNode7);
  var opt8 = document.createElement("option");
  opt8.setAttribute("value", "C");
  let textNode8 = document.createTextNode("C");
  opt8.appendChild(textNode8);
  var opt9 = document.createElement("option");
  opt9.setAttribute("value", "C-");
  let textNode9 = document.createTextNode("C-");
  opt9.appendChild(textNode9);
  var opt10 = document.createElement("option");
  opt10.setAttribute("value", "D+");
  let textNode10 = document.createTextNode("D+");
  opt10.appendChild(textNode10);
  var opt11 = document.createElement("option");
  opt11.setAttribute("value", "D");
  let textNode11 = document.createTextNode("D");
  opt11.appendChild(textNode11);
  var opt12 = document.createElement("option");
  opt12.setAttribute("value", "D-");
  let textNode12 = document.createTextNode("D-");
  opt12.appendChild(textNode12);
  var opt13 = document.createElement("option");
  opt13.setAttribute("value", "F");
  let textNode13 = document.createTextNode("F");
  opt13.appendChild(textNode13);

  newSelect.append(
    opt1,
    opt2,
    opt3,
    opt4,
    opt5,
    opt6,
    opt7,
    opt8,
    opt9,
    opt10,
    opt11,
    opt12,
    opt13
  );
  newSelect.addEventListener("change", (e) => {
    setGPA();
    changeColor(e.target);
  });

  let newBtn = document.createElement("button");
  newBtn.classList.add("trash-button");
  let newITag = document.createElement("i");
  newITag.classList.add("fas");
  newITag.classList.add("fa-trash");
  newBtn.appendChild(newITag);

  newBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.parentElement.parentElement.style.animation =
      "scaleDown 0.5s ease forwards";
    e.target.parentElement.parentElement.addEventListener(
      "animationend",
      (e) => {
        e.target.remove();
        setGPA();
      }
    );
  });

  newDiv.appendChild(newInput1);
  newDiv.appendChild(newInput2);
  newDiv.appendChild(newInput3);
  newDiv.appendChild(newSelect);
  newDiv.appendChild(newBtn);
  newForm.appendChild(newDiv);
  document.querySelector(".all-inputs").appendChild(newForm);
  newForm.style.animation = "scaleUp 0.5s ease forwards";
});

//點擊按鈕，刪除表單
let allTrash = document.querySelectorAll(".trash-button");
allTrash.forEach((trash) => {
  trash.addEventListener("click", (e) => {
    // console.log(e.target.parentElement.parentElement);//確認元素是<form>
    e.target.parentElement.parentElement.classList.add("remove"); //新增一個class="remove"的div
    // e.target.parentElement.parentElement.remove(); //刪除整個form
  });
});
//刪除表單的動畫
allTrash.forEach((trash) => {
  let form = trash.parentElement.parentElement;
  form.addEventListener("transitionend", (e) => {
    //transitionend :當scss設定移除動畫結束，form的區塊才移除
    e.target.remove(); //
    setGPA(); //分數重新計算
  });
});

//排序演算法
let btn1 = document.querySelector(".sort-descending");
let btn2 = document.querySelector(".sort-ascending");
btn1.addEventListener("click", () => {
  handleSorting("descending");
});
btn2.addEventListener("click", () => {
  handleSorting("ascending");
});

function handleSorting(direction) {
  let graders = document.querySelectorAll("div.grader");
  let objectArry = [];

  //抓取每個欄位的資料，並做成物件存放在 objectArry
  for (let i = 0; i < graders.length; i++) {
    // console.log(graders[i]);
    let class_name = graders[i].children[0].value; //class_category
    let class_number = graders[i].children[1].value; //class_number
    let class_credit = graders[i].children[2].value; //class_category
    let class_grade = graders[i].children[3].value;
    console.log(class_name, class_number, class_credit, class_grade); //查看當前抓取的資料
    if (
      //只要有一個欄位不是空的，就抓取資料
      !(
        class_name == "" &&
        class_name == "" &&
        class_number == "" &&
        class_credit == "" &&
        class_grade == ""
      )
    ) {
      let class_object = {
        class_name,
        class_number,
        class_credit,
        class_grade,
      };
      objectArry.push(class_object); //將當前form的欄位資料放入objectArry
    }
  }

  //取得arrayObject後，用前面宣告的 convert() 把成績的 abc string 轉換成數字
  for (let i = 0; i < objectArry.length; i++) {
    objectArry[i].class_grade_number = convertor(objectArry[i].class_grade); //將轉換的數字放入class_grade_number屬性
  }
  // console.log(objectArry);
  objectArry = mergeSort(objectArry);
  if (direction == "descending") {
    objectArry = objectArry.reverse();
  }
  console.log(objectArry); //查看排序好的內容
  //===========================
  //根據 objectArray 排序的內容來更新網頁
  let allInput = document.querySelector(".all-inputs");
  allInput.innerHTML = "";

  for (let i = 0; i < objectArry.length; i++) {
    //backtive製作更新後的<form>
    allInput.innerHTML += `<form action="">
<div class="grader">
    <input
    type="text"
    placeholder="class_category"
    class="class-type"
    list="opt"
    value=${objectArry[i].class_name}
    /><!--
--><input
    type="text"
    placeholder="class_number"
    class="class-number"
    value=${objectArry[i].class_number}
    /><!--
--><input
    type="number"
    placeholder="credits"
    min="0"
    max="6"
    class="class-credits"
    value=${objectArry[i].class_credit}
    /><!--
--><select name="select" class="select">
    <option value=""></option>
    <option value="A">A</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B">B</option>
    <option value="B-">B-</option>
    <option value="C+">C+</option>
    <option value="C">C</option>
    <option value="C-">C-</option>
    <option value="D+">D+</option>
    <option value="D">D</option>
    <option value="D-">D-</option>
    <option value="F">F</option></select
    ><!--
--><button class="trash-button">
    <i class="fas fa-trash"></i>
    </button>
</div>
</form>`;
  }

  //因為 grader 是<select>，無法用back-tick去修改value的值
  //直接改用去更改
  graders = document.querySelectorAll("div.grader");
  for (let i = 0; i < graders.length; i++) {
    graders[i].children[3].value = objectArry[i].class_grade;
  }
  //===============
  //監聽 select 事件排序後有沒有變動，背景顏色和gpa分數更動
  allSelects = document.querySelectorAll("select");
  allSelects.forEach((select) => {
    changeColor(select); //變更<select> abc 對應的顏色
    select.addEventListener("change", (e) => {
      setGPA();
      changeColor(e.target);
    });
  });

  //監聽 credit 事件排序後有沒有變動，gpa分數更動
  let allCredits = document.querySelectorAll(".class-credits");
  allCredits.forEach((credit) => {
    credit.addEventListener("change", () => {
      setGPA();
    });
  });

  //垃圾桶事件監聽排序後有沒有變動，gpa分數更動
  let allTrash = document.querySelectorAll(".trash-button");
  allTrash.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.parentElement.parentElement.style.animation =
        "scaleDown 0.5s ease forwards";
      e.target.parentElement.parentElement.addEventListener(
        "animationend",
        (e) => {
          e.target.remove();
          setGPA();
        }
      );
    });
  });
}

//排序 mergesort 演算法
//用一個 function 把左、右兩邊 array 比較大小放放入一個 array
function merge(a1, a2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < a1.length && j < a2.length) {
    if (a1[i].class_grade_number > a2[j].class_grade_number) {
      result.push(a2[j]); //放入比較小的值
      j++;
    } else {
      result.push(a1[i]);
      i++;
    }
  }
  //當 i 超出 a1 arr 長度時，會將另外一個 array 全部放入 result
  while (i < a1.length) {
    result.push(a1[i]);
    i++;
  }
  while (j < a2.length) {
    result.push(a2[j]);
    j++;
  }
  console.log("合併", result);
  return result;
}

//將一個 array 拆成左右邊，兩個array，用 merge() 遞迴方式排序好array
function mergeSort(arr) {
  if (arr.length == 0) {
    return;
  }

  if (arr.length == 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2); //arr拆分的index
    let left = arr.slice(0, middle); //a1:左邊的 array
    let right = arr.slice(middle, arr.length); //a2:右邊的 array
    console.log("拆分的index:", middle);
    console.log("左邊:", left);
    console.log("右邊:", right);
    console.log("左邊mer:", mergeSort(left));
    console.log("右邊mer:", mergeSort(right));
    return merge(mergeSort(left), mergeSort(right));
  }
}
