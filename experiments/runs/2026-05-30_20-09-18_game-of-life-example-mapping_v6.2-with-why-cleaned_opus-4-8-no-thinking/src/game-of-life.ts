type Cell = [number, number]; // [x, y]
type CellKey = string; // "x,y" — lets cells be used as Map/Set keys

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;
const fromKey = (key: CellKey): Cell => key.split(",").map(Number) as Cell;

function neighborsOf([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const isSelf = dx === 0 && dy === 0;
      if (!isSelf) neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
}

function countLiveNeighbors(cells: Cell[]): Map<CellKey, number> {
  const counts = new Map<CellKey, number>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = toKey(neighbor);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(toKey));
  const neighborCounts = countLiveNeighbors(cells);

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const isAlive = living.has(key);
    const survives = isAlive && (count === 2 || count === 3);
    const isBorn = !isAlive && count === 3;
    if (survives || isBorn) {
      next.push(fromKey(key));
    }
  }

  return next;
}
