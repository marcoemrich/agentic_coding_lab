export function add(numbers: string): number {
  if (numbers === "") return 0;
  return numbers.split(",").reduce((sum, numStr) => sum + parseInt(numStr, 10), 0);
}
