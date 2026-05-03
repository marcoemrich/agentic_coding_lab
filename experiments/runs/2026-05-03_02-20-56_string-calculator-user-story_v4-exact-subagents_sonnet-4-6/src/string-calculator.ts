export const add = (numbers: string): number =>
  numbers.split(",").reduce((sum, num) => sum + Number(num), 0);
