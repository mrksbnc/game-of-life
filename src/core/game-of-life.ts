import { Cell } from "./cell";

const CELL_SIZE = 5;
const MIN_ROWS = 500;
const MIN_COLS = 1000;

export interface GameOfLifeOptions {
  canvasId: string;
}

export class GameOfLife {
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #grid: Cell[][];
  #cols = 0;
  #rows = 0;
  #running = false;
  #animationId: number | null = null;

  constructor(options: GameOfLifeOptions) {
    this.#canvas = document.getElementById(options.canvasId) as HTMLCanvasElement;

    const context = this.#canvas.getContext("2d");
    if (!context) {
      throw new Error("No context was found");
    }

    this.#context = context;
    this.#grid = [];

    this.#resize();
    this.#registerEventListeners();
  }

  #getColors() {
    const style = getComputedStyle(document.documentElement);
    return {
      cell: style.getPropertyValue("--cell-color"),
    };
  }

  #initGrid(): Cell[][] {
    return Array.from({ length: this.#rows }, () =>
      Array.from({ length: this.#cols }, () => new Cell()),
    );
  }

  #countNeighbors(row: number, col: number): number {
    let count = 0;

    for (let deltaRow = -1; deltaRow <= 1; ++deltaRow) {
      for (let deltaCol = -1; deltaCol <= 1; ++deltaCol) {
        /** Skip self */
        if (deltaRow === 0 && deltaCol === 0) {
          continue;
        }

        const neighborRow = row + deltaRow;
        const neighborCol = col + deltaCol;

        const inBounds =
          neighborRow >= 0 &&
          neighborRow < this.#rows &&
          neighborCol >= 0 &&
          neighborCol < this.#cols;

        if (inBounds && this.#grid[neighborRow][neighborCol].alive) {
          count++;
        }
      }
    }

    return count;
  }

  #generateNextFrame(): void {
    const newStates: boolean[][] = [];

    for (let row = 0; row < this.#rows; ++row) {
      newStates[row] = [];
      for (let col = 0; col < this.#cols; ++col) {
        const neighbors = this.#countNeighbors(row, col);
        const alive = this.#grid[row][col].alive;

        if (alive) {
          newStates[row][col] = neighbors === 2 || neighbors === 3;
        } else {
          newStates[row][col] = neighbors === 3;
        }
      }
    }

    for (let row = 0; row < this.#rows; ++row) {
      for (let col = 0; col < this.#cols; ++col) {
        this.#grid[row][col].alive = newStates[row][col];
      }
    }
  }

  #onCellClick(clientX: number, clientY: number): { row: number; col: number } | null {
    const rect = this.#canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (row >= 0 && row < this.#rows && col >= 0 && col < this.#cols) {
      return { row, col };
    }

    return null;
  }

  #resize(): void {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;

    this.#cols = Math.max(MIN_COLS, Math.ceil(this.#canvas.width / CELL_SIZE));
    this.#rows = Math.max(MIN_ROWS, Math.ceil(this.#canvas.height / CELL_SIZE));
    this.#grid = this.#initGrid();

    this.#draw();
  }

  #draw(): void {
    const colors = this.#getColors();

    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    for (let row = 0; row < this.#rows; ++row) {
      for (let col = 0; col < this.#cols; ++col) {
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;

        this.#grid[row][col].draw(this.#context, x, y, CELL_SIZE, colors.cell);
      }
    }
  }

  #animate(): void {
    if (!this.#running) return;

    this.#generateNextFrame();
    this.#draw();

    setTimeout(() => {
      this.#animationId = requestAnimationFrame(() => this.#animate());
    }, 100);
  }

  #registerEventListeners(): void {
    window.addEventListener("resize", () => this.#resize());

    this.#canvas.addEventListener("click", (e) => {
      const cell = this.#onCellClick(e.clientX, e.clientY);
      if (cell) {
        this.#grid[cell.row][cell.col].onToggle();
        this.#draw();
      }
    });
  }

  start(): void {
    if (this.#running) return;
    this.#running = true;
    this.#animate();
  }

  stop(): void {
    this.#running = false;
    if (this.#animationId) {
      cancelAnimationFrame(this.#animationId);
      this.#animationId = null;
    }
  }

  onToggle(): boolean {
    if (this.#running) {
      this.stop();
    } else {
      this.start();
    }
    return this.#running;
  }

  step(): void {
    this.#generateNextFrame();
    this.#draw();
  }

  reset(): void {
    this.stop();
    this.#grid = this.#initGrid();
    this.#draw();
  }

  randomize(): void {
    for (let row = 0; row < this.#rows; ++row) {
      for (let col = 0; col < this.#cols; ++col) {
        this.#grid[row][col].alive = Math.random() > 0.5;
      }
    }
    this.#draw();
  }

  redraw(): void {
    this.#draw();
  }

  init(): void {
    this.#draw();
  }
}
