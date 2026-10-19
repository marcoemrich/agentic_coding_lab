export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;

function neighborKeys([x, y]: Cell): string[] {
  const keys: string[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      keys.push(`${x + dx},${y + dy}`);
    }
  }
  return keys;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map((c) => c.join(",")));
  const neighborCounts = new Map<string, number>();

  for (const cell of cells) {
    for (const key of neighborKeys(cell)) {
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const [x, y] = key.split(",").map(Number);
    const isAlive = live.has(key);
    const survives = isAlive && count >= MIN_SURVIVAL_NEIGHBORS && count <= MAX_SURVIVAL_NEIGHBORS;
    const reproduces = !isAlive && count === REPRODUCTION_NEIGHBORS;
    if (survives || reproduces) {
      result.push([x, y]);
    }
  }
  result.sort((a, b) => (a[1] - b[1]) || (a[0] - b[0]));
  return result;
}