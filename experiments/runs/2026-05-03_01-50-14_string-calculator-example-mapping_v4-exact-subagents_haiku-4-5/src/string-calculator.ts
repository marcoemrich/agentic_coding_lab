export function add(numberString: string): number {
  const numbers = numberString.split(",").map(Number);
  return numbers.reduce((sum, num) => sum + num, 0);
}
