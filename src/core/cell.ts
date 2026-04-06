export class Cell {
  alive: boolean;

  constructor(alive = false) {
    this.alive = alive;
  }

  onToggle(): void {
    this.alive = !this.alive;
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
    if (!this.alive) return;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, size - 1, size - 1);
  }
}
