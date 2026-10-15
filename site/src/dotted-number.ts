// Dotted numbers — chapter labels like 4.10, workflow versions like 1.3.2 —
// compare part by part: 2.9 before 2.10, 1 before 1.1.
export function byDottedNumber(a: string, b: string): number {
  const [left, right] = [a.split(".").map(Number), b.split(".").map(Number)];
  const differing = left.findIndex((part, index) => part !== right[index]);
  return differing === -1 ? left.length - right.length : left[differing] - (right[differing] ?? 0);
}
