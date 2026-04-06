import { Cell } from "./cell";

const GRID_SIZE = 10;

export interface GameOfLifeOptions {
  canvasId: string;
}

export class GameOfLife {
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #grid: Cell[][];
  #cellSize: number;
  #offsetX: number;
  #offsetY: number;
  #running = false;
  #animationId: number | null = null;

  constructor(options: GameOfLifeOptions) {
    this.#canvas = document.getElementById(options.canvasId) as HTMLCanvasElement;

    const context = this.#canvas.getContext("2d");
    if (!context) {
      throw new Error("No context was found");
    }

    this.#context = context;
    this.#grid = this.#initGrid();
    this.#cellSize = 0;
    this.#offsetX = 0;
    this.#offsetY = 0;

    this.#resize();
    this.#registerEventListeners();
  }

  #getColors() {
    const style = getComputedStyle(document.documentElement);
    return {
      cell: style.getPropertyValue("--cell-color"),
      grid: style.getPropertyValue("--grid-color"),
    };
  }

  #initGrid(): Cell[][] {
    return Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => new Cell()),
    );
  }

  #drawGridLines(gridColor: string): void {
    this.#context.strokeStyle = gridColor;
    this.#context.lineWidth = 1;

    for (let i = 0; i <= GRID_SIZE; ++i) {
      const x = this.#offsetX + i * this.#cellSize;
      const y = this.#offsetY + i * this.#cellSize;

      this.#context.beginPath();
      this.#context.moveTo(x, this.#offsetY);
      this.#context.lineTo(x, this.#offsetY + GRID_SIZE * this.#cellSize);
      this.#context.stroke();

      this.#context.beginPath();
      this.#context.moveTo(this.#offsetX, y);
      this.#context.lineTo(this.#offsetX + GRID_SIZE * this.#cellSize, y);
      this.#context.stroke();
    }
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
          neighborRow < GRID_SIZE &&
          neighborCol >= 0 &&
          neighborCol < GRID_SIZE;

        if (inBounds && this.#grid[neighborRow][neighborCol].alive) {
          count++;
        }
      }
    }

    return count;
  }

  #generateNextFrame(): void {
    const newStates: boolean[][] = [];

    for (let row = 0; row < GRID_SIZE; ++row) {
      newStates[row] = [];
      for (let col = 0; col < GRID_SIZE; ++col) {
        const neighbors = this.#countNeighbors(row, col);
        const alive = this.#grid[row][col].alive;

        if (alive) {
          newStates[row][col] = neighbors === 2 || neighbors === 3;
        } else {
          newStates[row][col] = neighbors === 3;
        }
      }
    }

    for (let row = 0; row < GRID_SIZE; ++row) {
      for (let col = 0; col < GRID_SIZE; ++col) {
        this.#grid[row][col].alive = newStates[row][col];
      }
    }
  }

  #onCellClick(clientX: number, clientY: number): { row: number; col: number } | null {
    const rect = this.#canvas.getBoundingClientRect();
    const x = clientX - rect.left - this.#offsetX;
    const y = clientY - rect.top - this.#offsetY;

    const col = Math.floor(x / this.#cellSize);
    const row = Math.floor(y / this.#cellSize);

    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      return { row, col };
    }

    return null;
  }

  #resize(): void {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;

    this.#cellSize = Math.ceil(Math.max(this.#canvas.width, this.#canvas.height) / GRID_SIZE);
    this.#offsetX = 0;
    this.#offsetY = 0;

    this.#draw();
  }

  #draw(): void {
    const colors = this.#getColors();

    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    for (let row = 0; row < GRID_SIZE; ++row) {
      for (let col = 0; col < GRID_SIZE; ++col) {
        const x = this.#offsetX + col * this.#cellSize;
        const y = this.#offsetY + row * this.#cellSize;

        this.#grid[row][col].draw(this.#context, x, y, this.#cellSize, colors.cell);
      }
    }

    this.#drawGridLines(colors.grid);
  }

  #animate(): void {
    if (!this.#running) return;

    this.#generateNextFrame();
    this.#draw();

    setTimeout(() => {
      this.#animationId = requestAnimationFrame(() => this.#animate());
    }, 300);
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
    for (let row = 0; row < GRID_SIZE; ++row) {
      for (let col = 0; col < GRID_SIZE; ++col) {
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
