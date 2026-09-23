const form = document.getElementById("form");
const input = document.getElementById("input");
const ul = document.getElementById("ul");

const fortunes = ["超大吉 🌟", "大吉 ✨", "中吉 😊", "小吉 🍀", "吉 🌸", "末吉 🍵"];
const items = ["招き猫 🐱", "お守り ✨", "赤いペン 🖊️", "新しい靴下 🧦", "カフェラテ ☕"];
const colors = ["金色 ⭐", "赤 ❤️", "青 💙", "緑 💚", "ピンク 💖", "白 🤍"];

// ★ Web Audio APIを使った「ガラガラ...」効果音生成関数
function playOmikujiSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // 1.5秒間で小さなノイズ（木が擦れ合う音）を連続生成
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const bufferSize = audioCtx.sampleRate * 0.05; // 0.05秒の短音
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let j = 0; j < bufferSize; j++) {
                data[j] = Math.random() * 2 - 1; // ホワイトノイズ
            }

            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            // 低音フィルタ（木のくもった音を表現）
            const filter = audioCtx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.value = 800 + Math.random() * 400;

            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            noise.start();
        }, i * 110);
    }
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (input.value.trim() === "") return;

    // 1. 今日の日付を取得して重複確認
    const today = new Date().toISOString().split('T')[0];
    const lastDrawnDate = localStorage.getItem("omikuji_last_date");

    if (lastDrawnDate === today) {
        alert("おみくじは1日1回までです！また明日引いてね 🔮");
        return;
    }

    const name = input.value;
    input.value = "";

    // 2. 効果音を鳴らす
    playOmikujiSound();

    // 3. シャカシャカ揺れるおみくじアニメーションを表示（Step 2）
    ul.innerHTML = "";
    const loadingLi = document.createElement("li");
    loadingLi.innerHTML = `
        <div class="omikuji-box-anim">🪘</div>
        <div class="fs-5 fw-bold text-secondary">ガラガラ… 運勢を占っています…</div>
    `;
    loadingLi.classList.add("list-group-item", "text-center", "py-4", "border-0", "bg-transparent");
    ul.appendChild(loadingLi);

    // 4. 1.5秒後に結果を表示
    setTimeout(function () {
        ul.innerHTML = "";

        const randomItem = items[Math.floor(Math.random() * items.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        const resultLi = document.createElement("li");

        let fortuneClass = "";

        if (randomFortune === "超大吉 🌟") {
            fortuneClass = "result-ultra";
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
            });
        } else if (randomFortune === "大吉 ✨") {
            fortuneClass = "result-great";
        } else if (randomFortune === "中吉 😊" || randomFortune === "小吉 🍀") {
            fortuneClass = "result-good";
        } else {
            fortuneClass = "result-normal";
        }

        resultLi.innerHTML = `
            <p class="mb-2 fw-bold">${name} さんの今日の運勢：${randomFortune}</p>
            <p class="fs-6 mb-1">ラッキーアイテム：${randomItem}</p>
            <p class="fs-6 mb-0">ラッキーカラー：${randomColor}</p>
        `;

        resultLi.classList.add("list-group-item", "text-center", "fw-bold", "fs-5", "result-card", fortuneClass);
        ul.appendChild(resultLi);

        // Xシェアボタンの更新
        const shareBtn = document.getElementById("share-btn");
        const shareText = encodeURIComponent(`${name} さんの今日の運勢は【${randomFortune}】でした！\nラッキーアイテム：${randomItem}\nラッキーカラー：${randomColor}\n\n#MyJavaScriptおみくじ`);
        shareBtn.href = `https://twitter.com/intent/tweet?text=${shareText}`;
        shareBtn.classList.remove("d-none");

        localStorage.setItem("omikuji_last_date", today);

    }, 1500);
});