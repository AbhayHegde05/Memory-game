// --- WELCOME SCREEN + RULES LOGIC ---
let skipClickedAt = null;
let rulesShownOnce = false;

document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("playButton");
  const skipBtn = document.getElementById("skipButton");
  const rulesPopup = document.getElementById("rulesPopup");
  const impatientPopup = document.getElementById("impatientPopup");

  if (playBtn) {
    playBtn.onclick = () => {
      rulesPopup.style.display = "flex";
      skipClickedAt = Date.now(); // record when popup was shown
    };
  }

  if (skipBtn) {
    skipBtn.onclick = () => {
      const now = Date.now();
      const timeSpent = (now - skipClickedAt) / 1000;

      if (!rulesShownOnce && timeSpent < 5) {
        impatientPopup.style.display = "flex";
      } else {
        window.location.href = "game.html";
      }

      rulesShownOnce = true;
      rulesPopup.style.display = "none";
    };
  }
});

function closeImpatientPopup() {
  document.getElementById("impatientPopup").style.display = "none";
}

// --- GAME LOGIC ---
const icons = ['🍎', '🚀', '🐶', '🎮', '🎲', '🚗', '🎧', '📱', '🐱', '🍩', '📚', '✈️', '🧸', '🪐', '🎁', '💡',
               '🍕', '⚽', '🏀', '🏓', '🎹', '📷', '🎤', '🔒', '🔑', '💻', '🌈', '🌍', '🧠', '💎', '🌟', '🎈'];

let timerInterval;
let startTime;

if (window.location.pathname.includes("game.html")) {
  const board = document.getElementById("gameBoard");
  const timerDisplay = document.getElementById("timer");
  const winPopup = document.getElementById("winPopup");
  const timeResult = document.getElementById("timeResult");

  const cards = [...icons, ...icons]; // 32 unique x 2 = 64 cards
  shuffle(cards);

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchedCount = 0;

  cards.forEach(icon => {
    const div = document.createElement("div");
    div.classList.add("card", "hidden");
    div.dataset.icon = icon;
    div.textContent = icon;
    div.addEventListener("click", handleCardClick);
    board.appendChild(div);
  });

  function handleCardClick(e) {
    const card = e.target;

    if (lockBoard || !card.classList.contains("hidden")) return;

    card.classList.remove("hidden");

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      lockBoard = true;

      if (firstCard.dataset.icon === secondCard.dataset.icon) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedCount += 2;
        resetTurn();
        if (matchedCount === cards.length) {
          clearInterval(timerInterval);
          winPopup.style.display = "flex";
          timeResult.textContent = `You completed the game in ${Math.floor((Date.now() - startTime) / 1000)} seconds!`;
        }
      } else {
        setTimeout(() => {
          firstCard.classList.add("hidden");
          secondCard.classList.add("hidden");
          resetTurn();
        }, 700);
      }
    }
  }

  function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      timerDisplay.textContent = `Time: ${elapsed}s`;
    }, 1000);
  }

  startTimer();
}

function restartGame() {
  window.location.href = "game.html";
}
