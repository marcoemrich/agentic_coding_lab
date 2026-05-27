export type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

type NeighborTally = { cell: Cell; count: number };

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set<string>(liveCells.map(keyOf));
  const tallies = tallyNeighbors(liveCells);

  const nextCells: Cell[] = [];
  for (const [key, { cell, count }] of tallies) {
    if (livesNextGeneration(liveKeys.has(key), count)) {
      nextCells.push(cell);
    }
  }
  return nextCells;
}

// Conway's rules, restated by outcome:
//   - A dead cell with exactly 3 live neighbors is born (Rule 4).
//   - A live cell with 2 or 3 live neighbors survives (Rule 2);
//     fewer dies of underpopulation (Rule 1), more of overpopulation (Rule 3).
function livesNextGeneration(isAlive: boolean, liveNeighbors: number): boolean {
  return liveNeighbors === 3 || (isAlive && liveNeighbors === 2);
}

function tallyNeighbors(liveCells: Cell[]): Map<string, NeighborTally> {
  const tallies = new Map<string, NeighborTally>();
  for (const [x, y] of liveCells) {
    for (const neighbor of neighborsOf(x, y)) {
      const key = keyOf(neighbor);
      const existing = tallies.get(key);
      if (existing) {
        existing.count++;
      } else {
        tallies.set(key, { cell: neighbor, count: 1 });
      }
    }
  }
  return tallies;
}

function* neighborsOf(x: number, y: number): Generator<Cell> {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      yield [x + dx, y + dy];
    }
  }
}
