export function nextGeneration(livingCells: Set<string>): Set<string> {
  const neighborCounts = new Map<string, number>();

  for (const cell of livingCells) {
    const [x, y] = cell.split(",").map(Number);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = `${x + dx},${y + dy}`;
        neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
      }
    }
  }

  const result = new Set<string>();
  for (const [cell, count] of neighborCounts) {
    if (count === 3 || (count === 2 && livingCells.has(cell))) {
      result.add(cell);
    }
  }

  return result;
}
