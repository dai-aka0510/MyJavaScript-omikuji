const form = document.getElementById("form");
const input = document.getElementById("input");
const ul = document.getElementById("ul");

const fortunes = ["超大吉 🌟", "大吉 ✨", "中吉 😊", "小吉 🍀", "吉 🌸", "末吉 🍵"];

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (input.value.trim() === "") return;

    // 入力した名前を一時保存
    const name = input.value;
    input.value = ""; // 先に入力欄をクリア

    // 1. 画面を一度クリアして「占っています...」を表示
    ul.innerHTML = "";
    const loadingLi = document.createElement("li");
    loadingLi.textContent = "🔮 占っています...";
    loadingLi.classList.add("list-group-item", "text-center", "fw-bold", "text-muted", "fs-5");
    ul.appendChild(loadingLi);

    // 2. setTimeoutで1.5秒（1500ms）遅らせて結果を出す！
    setTimeout(function () {
        ul.innerHTML = ""; // 「占っています...」を消す

        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        const resultLi = document.createElement("li");
        
        resultLi.textContent = `${name} さんの今日の運勢：${randomFortune}`;
        resultLi.classList.add("list-group-item", "text-center", "fw-bold", "fs-5", "text-danger");

        ul.appendChild(resultLi);
    }, 1500); // ← ここで待ち時間を調整（1500 = 1.5秒）
});