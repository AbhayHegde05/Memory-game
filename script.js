// script.js

// ---------- INDEX PAGE ----------
if (document.getElementById("playBtn")) {
  let skipClickedTime = 0;
  let ruleTimer = null;

  document.getElementById("playBtn").addEventListener("click", () => {
    document.getElementById("rulesPopup").style.display = "flex";
    ruleTimer = Date.now();
  });

  document.getElementById("skipBtn").addEventListener("click", () => {
    skipClickedTime = Date.now();
    const timeDiff = (skipClickedTime - ruleTimer) / 1000;

    document.getElementById("rulesPopup").style.display = "none";

    if (timeDiff < 5) {
      document.getElementById("impatientPopup").style.display = "flex";
    } else {
      window.location.href = "game.html";
    }
  });

  document.getElementById("impatientOkBtn").addEventListener("click", () => {
    document.getElementById("impatientPopup").style.display = "none";
  });
}

// ---------- GAME PAGE ----------
if (document.getElementById("gameBoard")) {
  const board = document.getElementById("gameBoard");
  const icons = ["🍎", "🍌", "🍇", "🍉", "🍒", "🥝", "🍍", "🥥", "🥑", "🍓", "🫐", "🍈", "🍋", "🍊", "🍅", "🥕", "🧄", "🧅", "🌽", "🥔", "🥦", "🍄", "🥬", "🥒", "🧀", "🍞", "🥨", "🍗", "🍖", "🍔", "🍟", "🌮"];
  const pairs = icons.concat(icons); // 32 icons * 2 = 64 cards

  let shuffled = pairs.sort(() => 0.5 - Math.random());

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchCount = 0;

  let startTime = Date.now();
  let timerInterval = setInterval(() => {
    const now = Date.now();
    const diff = Math.floor((now - startTime) / 1000);
    document.getElementById("timer").textContent = `⏱️ Time: ${diff}s`;
  }, 1000);

  shuffled.forEach((icon) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = icon;

    card.addEventListener("click", () => {
      if (lockBoard || card.classList.contains("matched") || card === firstCard) return;

      card.classList.add("revealed");

      if (!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;
        lockBoard = true;

        if (firstCard.textContent === secondCard.textContent) {
          firstCard.classList.add("matched");
          secondCard.classList.add("matched");
          matchCount += 2;
          resetBoard();

          if (matchCount === 64) {
            clearInterval(timerInterval);
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            document.getElementById("finalTime").textContent = `🏁 You finished in ${totalTime} seconds!`;
            document.getElementById("winPopup").style.display = "flex";
          }
        } else {
          setTimeout(() => {
            firstCard.classList.remove("revealed");
            secondCard.classList.remove("revealed");
            resetBoard();
          }, 800);
        }
      }
    });

    board.appendChild(card);
  });

  function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  window.restartGame = () => {
    window.location.href = "game.html";
  };
}
