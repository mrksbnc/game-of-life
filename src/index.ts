import { GameOfLife } from "./core/game-of-life";
import { initThemeToggle } from "./theme/theme";

enum GameStateLabel {
  Start = "Start",
  Stop = "Stop",
}

const game = new GameOfLife({
  canvasId: "game-of-life__canvas",
});

game.init();

initThemeToggle(() => game.redraw());

const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
const stepBtn = document.getElementById("step-btn") as HTMLButtonElement;
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;
const randomBtn = document.getElementById("random-btn") as HTMLButtonElement;

startBtn.addEventListener("click", () => {
  const running = game.onToggle();
  startBtn.textContent = running ? GameStateLabel.Stop : GameStateLabel.Stop;
});

stepBtn.addEventListener("click", () => game.step());
resetBtn.addEventListener("click", () => {
  game.reset();
  startBtn.textContent = "Start";
});
randomBtn.addEventListener("click", () => game.randomize());
