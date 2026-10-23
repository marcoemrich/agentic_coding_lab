export function countByType<T>(items: T[], typeOf: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const type = typeOf(item);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
}
