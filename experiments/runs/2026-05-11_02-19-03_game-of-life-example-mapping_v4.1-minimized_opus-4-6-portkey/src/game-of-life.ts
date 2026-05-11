function toKey(x: number, y: number): string {
  return `${x},${y}`;
}

function fromKey(key: string): [number, number] {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function neighbors(x: number, y: number): [number, number][] {
  const result: [number, number][] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      result.push([x + dx, y + dy]);
    }
  }
  return result;
}

function countLiveNeighbors(x: number, y: number, alive: Set<string>): number {
  return neighbors(x, y).filter(([nx, ny]) => alive.has(toKey(nx, ny))).length;
}

export function nextGeneration(cells: [number, number][]): [number, number][] {
  const alive = new Set(cells.map(([x, y]) => toKey(x, y)));

  const survivors = cells.filter(([x, y]) => {
    const count = countLiveNeighbors(x, y, alive);
    return count === 2 || count === 3;
  });

  const deadNeighbors = new Set<string>();
  for (const [x, y] of cells) {
    for (const [nx, ny] of neighbors(x, y)) {
      const key = toKey(nx, ny);
      if (!alive.has(key)) deadNeighbors.add(key);
    }
  }

  const births: [number, number][] = [];
  for (const key of deadNeighbors) {
    const [x, y] = fromKey(key);
    if (countLiveNeighbors(x, y, alive) === 3) {
      births.push([x, y]);
    }
  }

  return [...survivors, ...births];
}
