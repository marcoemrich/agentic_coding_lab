export function add(numbers: string): number {
  if (numbers === '') return 0;
  return numbers.split(',').reduce((sum, n) => sum + parseInt(n, 10), 0);
}
