export const countByType = <T>(items: T[], typeOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const entry of items) {
    const t = typeOf(entry);
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return counts;
};
