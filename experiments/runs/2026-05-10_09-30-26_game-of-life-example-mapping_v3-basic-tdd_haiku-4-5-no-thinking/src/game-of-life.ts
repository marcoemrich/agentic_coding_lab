export type Coordinate = [number, number];

export class GameOfLife {
  private liveCells: Set<string>;

  constructor(cells: Coordinate[]) {
    this.liveCells = new Set(cells.map(([x, y]) => `${x},${y}`));
  }

  private getCellKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  private parseKey(key: string): Coordinate {
    const [x, y] = key.split(',').map(Number);
    return [x, y];
  }

  private getNeighbors(x: number, y: number): Coordinate[] {
    const neighbors: Coordinate[] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        neighbors.push([x + dx, y + dy]);
      }
    }
    return neighbors;
  }

  private countLiveNeighbors(x: number, y: number): number {
    let count = 0;
    const neighbors = this.getNeighbors(x, y);
    for (const [nx, ny] of neighbors) {
      if (this.liveCells.has(this.getCellKey(nx, ny))) {
        count++;
      }
    }
    return count;
  }

  nextGeneration(): GameOfLife {
    const nextGenCells: Coordinate[] = [];
    const cellsToCheck = new Set<string>();

    // Add all live cells to check
    for (const key of this.liveCells) {
      cellsToCheck.add(key);
    }

    // Add all neighbors of live cells
    for (const key of this.liveCells) {
      const [x, y] = this.parseKey(key);
      const neighbors = this.getNeighbors(x, y);
      for (const [nx, ny] of neighbors) {
        cellsToCheck.add(this.getCellKey(nx, ny));
      }
    }

    // Check each cell for survival or birth
    for (const key of cellsToCheck) {
      const [x, y] = this.parseKey(key);
      const liveNeighbors = this.countLiveNeighbors(x, y);
      const isAlive = this.liveCells.has(key);

      // Rule 1: Underpopulation - die if < 2 neighbors
      // Rule 2: Survival - live if 2 or 3 neighbors
      // Rule 3: Overpopulation - die if > 3 neighbors
      // Rule 4: Reproduction - born if exactly 3 neighbors
      if (isAlive && (liveNeighbors === 2 || liveNeighbors === 3)) {
        nextGenCells.push([x, y]);
      } else if (!isAlive && liveNeighbors === 3) {
        nextGenCells.push([x, y]);
      }
    }

    return new GameOfLife(nextGenCells);
  }

  getLiveCells(): Coordinate[] {
    return Array.from(this.liveCells)
      .map(key => this.parseKey(key))
      .sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
  }
}
