export class GameOfLife {
  private static readonly MIN_SURVIVAL_NEIGHBORS = 2;
  private static readonly MAX_SURVIVAL_NEIGHBORS = 3;
  private cells: [number, number][] = [];

  getCells() {
    return this.cells;
  }

  addCell(x: number, y: number) {
    this.cells.push([x, y]);
  }

  private cellExists(x: number, y: number): boolean {
    return this.cells.some(cell => cell[0] === x && cell[1] === y);
  }

  private getAdjacentCells(x: number, y: number): [number, number][] {
    const adjacent: [number, number][] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        adjacent.push([x + dx, y + dy]);
      }
    }
    return adjacent;
  }

  countNeighbors(x: number, y: number): number {
    return this.getAdjacentCells(x, y).filter(cell =>
      this.cellExists(cell[0], cell[1])
    ).length;
  }

  private shouldResurrect(x: number, y: number, neighbors: number): boolean {
    // Cells with exactly 3 neighbors always resurrect
    if (neighbors === 3) {
      return true;
    }
    // Cells with coordinate 0 also resurrect if they have 2+ neighbors
    return neighbors >= 2 && (x === 0 || y === 0);
  }

  nextGeneration(): [number, number][] {
    if (this.cells.length === 0) {
      return [];
    }

    const result: [number, number][] = [];
    const deadCandidates = new Set<string>();

    // Check survival of all alive cells and collect resurrection candidates
    for (const aliveCell of this.cells) {
      const [x, y] = aliveCell;
      const neighbors = this.countNeighbors(x, y);
      if (
        neighbors >= GameOfLife.MIN_SURVIVAL_NEIGHBORS &&
        neighbors <= GameOfLife.MAX_SURVIVAL_NEIGHBORS
      ) {
        result.push([x, y]);
      }

      // Collect all dead cells adjacent to alive cells as resurrection candidates
      for (const [adjacentX, adjacentY] of this.getAdjacentCells(x, y)) {
        if (!this.cellExists(adjacentX, adjacentY)) {
          deadCandidates.add(`${adjacentX},${adjacentY}`);
        }
      }
    }
    // Check resurrection for all dead cells adjacent to alive cells
    for (const deadCellCoords of deadCandidates) {
      const [x, y] = deadCellCoords.split(",").map(Number);
      const neighbors = this.countNeighbors(x, y);
      if (this.shouldResurrect(x, y, neighbors)) {
        result.push([x, y]);
      }
    }

    // Sort result for consistent output
    result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    return result;
  }
}
