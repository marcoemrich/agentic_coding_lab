export type Cell = [x: number, y: number];

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_FOR_BIRTH = 3;

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

// The eight cells surrounding a position (Moore neighbourhood, excluding self).
function* neighbors([x, y]: Cell): Iterable<Cell> {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) {
        yield [x + dx, y + dy];
      }
    }
  }
}

function countLiveNeighbors(cell: Cell, live: Set<string>): number {
  let count = 0;
  for (const neighbor of neighbors(cell)) {
    if (live.has(cellKey(neighbor))) {
      count += 1;
    }
  }
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(cellKey));

  // A position's fate can change only if it is live or adjacent to a live
  // cell: every live cell, plus each cell in its Moore neighbourhood.
  const positions = new Map<string, Cell>();
  for (const cell of cells) {
    positions.set(cellKey(cell), cell);
    for (const neighbor of neighbors(cell)) {
      positions.set(cellKey(neighbor), neighbor);
    }
  }

  const result: Cell[] = [];
  for (const [key, position] of positions) {
    const liveNeighbors = countLiveNeighbors(position, live);
    const isAlive = live.has(key);
    const survives = isAlive && (liveNeighbors === MIN_NEIGHBORS_TO_SURVIVE || liveNeighbors === MAX_NEIGHBORS_TO_SURVIVE);
    const isBorn = !isAlive && liveNeighbors === NEIGHBORS_FOR_BIRTH;
    if (survives || isBorn) {
      result.push(position);
    }
  }

  return result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
