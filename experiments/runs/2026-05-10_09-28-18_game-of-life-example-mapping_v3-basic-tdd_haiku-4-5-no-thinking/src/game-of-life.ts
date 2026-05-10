type Coordinate = [number, number];

export class GameOfLife {
  private liveCells: Set<string>;

  constructor(cells: Coordinate[]) {
    this.liveCells = new Set(cells.map(coord => this.coordToString(coord)));
  }

  private coordToString(coord: Coordinate): string {
    return `${coord[0]},${coord[1]}`;
  }

  private stringToCoord(str: string): Coordinate {
    const [x, y] = str.split(',').map(Number);
    return [x, y];
  }

  private countLiveNeighbors(x: number, y: number): number {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighborKey = this.coordToString([x + dx, y + dy]);
        if (this.liveCells.has(neighborKey)) {
          count++;
        }
      }
    }
    return count;
  }

  private getCellsToCheck(): Set<string> {
    const cellsToCheck = new Set<string>();

    for (const cellStr of this.liveCells) {
      const [x, y] = this.stringToCoord(cellStr);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          cellsToCheck.add(this.coordToString([x + dx, y + dy]));
        }
      }
    }

    return cellsToCheck;
  }

  nextGeneration(): GameOfLife {
    const cellsToCheck = this.getCellsToCheck();
    const nextLiveCells: Coordinate[] = [];

    for (const cellStr of cellsToCheck) {
      const [x, y] = this.stringToCoord(cellStr);
      const liveNeighbors = this.countLiveNeighbors(x, y);
      const isAlive = this.liveCells.has(cellStr);

      if (isAlive && (liveNeighbors === 2 || liveNeighbors === 3)) {
        nextLiveCells.push([x, y]);
      } else if (!isAlive && liveNeighbors === 3) {
        nextLiveCells.push([x, y]);
      }
    }

    return new GameOfLife(nextLiveCells);
  }

  getLiveCells(): Coordinate[] {
    return Array.from(this.liveCells)
      .map(str => this.stringToCoord(str))
      .sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
  }
}
