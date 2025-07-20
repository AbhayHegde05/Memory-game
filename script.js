const grid = document.getElementById("gameGrid");
const restartBtn = document.getElementById("restartBtn");
const timerDisplay = document.getElementById("timer");
const finishPopup = document.getElementById("finishPopup");
const finalTime = document.getElementById("finalTime");

let timer = 0;
let interval;
let flippedCards = [];
let matched = 0;
const totalPairs = 32;

const emojis = ['🍕','🎈','🚀','🎮','🎧','📱','🐶','🦄','🍭','🎉','🧠','🌈','🍩','🐼','💎','🐱',
                '🍎','🐯','🐸','⚽','🎲','🍫','🌟','🍔','📷','📚','🎤','🪐','📀','🧸','🐵','💡'];

function startGame() {
  // Reset
  grid.innerHTML = '';
  matched = 0;
  flippedCards = [];
  timer = 0;
  timerDisplay.textContent = `⏱️ Time: 0s`;
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `⏱️ Time: ${timer}s`;
  }, 1000);

  // Duplicate + Shuffle
  const fullSet = [...emojis, ...emojis];
  const shuffled = fullSet.sort(() => 0.5 - Math.random());

  shuffled.forEach(icon => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = icon;
    card.dataset.icon = icon;
    card.addEventListener("click", () => flipCard(card));
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      const [c1, c2] = flippedCards;
      if (c1.dataset.icon === c2.dataset.icon) {
        matched++;
        flippedCards = [];
        if (matched === totalPairs) {
          clearInterval(interval);
          finishPopup.style.display = "block";
          finalTime.textContent = `You completed the game in ${timer} seconds! 🎯`;
        }
      } else {
        setTimeout(() => {
          c1.classList.remove("flipped");
          c2.classList.remove("flipped");
          flippedCards = [];
        }, 800);
      }
    }
  }
}

function restartGame() {
  finishPopup.style.display = "none";
  startGame();
}

restartBtn.addEventListener("click", restartGame);
window.onload = startGame;
