function toKey(x: number, y: number): string {
  return `${x},${y}`;
}

function fromKey(key: string): [number, number] {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countLiveNeighbors(x: number, y: number, alive: Set<string>): number {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (alive.has(toKey(x + dx, y + dy))) count++;
    }
  }
  return count;
}

function survives(neighbors: number, isAlive: boolean): boolean {
  return neighbors === 3 || (neighbors === 2 && isAlive);
}

export function nextGeneration(livingCells: [number, number][]): [number, number][] {
  const alive = new Set(livingCells.map(([x, y]) => toKey(x, y)));
  const candidates = new Set<string>();

  for (const [x, y] of livingCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        candidates.add(toKey(x + dx, y + dy));
      }
    }
  }

  const result: [number, number][] = [];

  for (const key of candidates) {
    const [x, y] = fromKey(key);
    const neighbors = countLiveNeighbors(x, y, alive);
    if (survives(neighbors, alive.has(key))) {
      result.push([x, y]);
    }
  }

  return result;
}
